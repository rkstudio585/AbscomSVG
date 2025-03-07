(function() {
  const AbscomSVG = {
    /**
     * Renders SVG content into the specified SVG element.
     * @param {string|SVGElement} svgArg - The ID of the SVG element or the SVG element itself.
     * @param {Object|Object[]} def - A single definition object or an array of definitions.
     */
    render: function(svgArg, def) {
      let svg;
      if (typeof svgArg === 'string') {
        svg = document.getElementById(svgArg);
      } else if (svgArg instanceof SVGElement) {
        svg = svgArg;
      } else {
        console.error('Invalid SVG argument:', svgArg);
        return;
      }
      if (!svg) {
        console.error('SVG element not found');
        return;
      }
      const defs = Array.isArray(def) ? def : [def];
      
      // Track existing elements with IDs
      const existingEls = {};
      Array.from(svg.children).forEach(child => {
        const id = child.getAttribute('id');
        if (id) existingEls[id] = child;
      });
      
      // Process each top-level definition
      defs.forEach(d => {
        if (d.id && existingEls[d.id]) {
          updateElement(existingEls[d.id], d);
          delete existingEls[d.id];
        } else {
          const el = createElement(d);
          if (el) svg.appendChild(el);
        }
      });
      
      // Remove elements no longer in definitions
      for (const id in existingEls) {
        svg.removeChild(existingEls[id]);
      }
    },
    
    /** Element Creation Helpers */
    
    /**
     * Creates a circle definition.
     * @param {number} cx - Center x-coordinate.
     * @param {number} cy - Center y-coordinate.
     * @param {number} r - Radius.
     * @param {string} fill - Fill color.
     * @returns {Object} Circle definition.
     */
    circle: function(cx, cy, r, fill) {
      return { type: 'circle', attrs: { cx, cy, r, fill } };
    },
    
    /**
     * Creates a rectangle definition.
     * @param {number} x - X-coordinate.
     * @param {number} y - Y-coordinate.
     * @param {number} width - Width.
     * @param {number} height - Height.
     * @param {string} fill - Fill color.
     * @returns {Object} Rectangle definition.
     */
    rect: function(x, y, width, height, fill) {
      return { type: 'rect', attrs: { x, y, width, height, fill } };
    },
    
    /**
     * Creates a text definition.
     * @param {number} x - X-coordinate.
     * @param {number} y - Y-coordinate.
     * @param {string} text - Text content.
     * @param {Object} [attrs] - Additional attributes.
     * @returns {Object} Text definition.
     */
    text: function(x, y, text, attrs = {}) {
      return { type: 'text', attrs: { x, y, ...attrs }, text };
    },
    
    /**
     * Creates an animation definition.
     * @param {string} attributeName - Attribute to animate.
     * @param {string} from - Starting value.
     * @param {string} to - Ending value.
     * @param {string} dur - Duration (e.g., '2s').
     * @param {string} repeatCount - Repeat count (e.g., 'indefinite').
     * @returns {Object} Animation definition.
     */
    animate: function(attributeName, from, to, dur, repeatCount) {
      return { type: 'animate', attrs: { attributeName, from, to, dur, repeatCount } };
    },
    
    /**
     * Creates a line definition.
     * @param {number} x1 - Starting x-coordinate.
     * @param {number} y1 - Starting y-coordinate.
     * @param {number} x2 - Ending x-coordinate.
     * @param {number} y2 - Ending y-coordinate.
     * @param {string} stroke - Stroke color.
     * @returns {Object} Line definition.
     */
    line: function(x1, y1, x2, y2, stroke) {
      return { type: 'line', attrs: { x1, y1, x2, y2, stroke } };
    },
    
    /**
     * Creates a polygon definition.
     * @param {string} points - Points of the polygon.
     * @param {string} fill - Fill color.
     * @returns {Object} Polygon definition.
     */
    polygon: function(points, fill) {
      return { type: 'polygon', attrs: { points, fill } };
    },
    
    /**
     * Creates a path definition.
     * @param {string} d - Path data.
     * @param {string} fill - Fill color.
     * @returns {Object} Path definition.
     */
    path: function(d, fill) {
      return { type: 'path', attrs: { d, fill } };
    },
    
    /**
     * Creates an image definition.
     * @param {string} href - Image source.
     * @param {number} x - X-coordinate.
     * @param {number} y - Y-coordinate.
     * @param {number} width - Width.
     * @param {number} height - Height.
     * @returns {Object} Image definition.
     */
    image: function(href, x, y, width, height) {
      return { type: 'image', attrs: { 'xlink:href': href, x, y, width, height } };
    },
    
    /**
     * Creates an ellipse definition.
     * @param {number} cx - Center x-coordinate.
     * @param {number} cy - Center y-coordinate.
     * @param {number} rx - X-radius.
     * @param {number} ry - Y-radius.
     * @param {string} fill - Fill color.
     * @returns {Object} Ellipse definition.
     */
    ellipse: function(cx, cy, rx, ry, fill) {
      return { type: 'ellipse', attrs: { cx, cy, rx, ry, fill } };
    },
    
    /** Attribute and Transformation Helpers */
    
    /**
     * Adds stroke attributes to a definition.
     * @param {Object} def - Element definition.
     * @param {string} color - Stroke color.
     * @param {number} width - Stroke width.
     * @returns {Object} Updated definition.
     */
    withStroke: function(def, color, width) {
      def.attrs.stroke = color;
      def.attrs['stroke-width'] = width;
      return def;
    },
    
    /**
     * Creates a transformation string.
     * @param {string} type - Transformation type (e.g., 'translate', 'rotate').
     * @param {...number} values - Transformation values.
     * @returns {string} Transformation string.
     */
    transform: function(type, ...values) {
      return `${type}(${values.join(',')})`;
    }
  };

  /**
   * Creates an SVG element from a definition object.
   * @param {Object} def - Element definition.
   * @returns {SVGElement|null} Created element or null if invalid.
   */
  function createElement(def) {
    if (!validateDef(def)) return null;
    const el = document.createElementNS('http://www.w3.org/2000/svg', def.type);
    if (def.id) el.setAttribute('id', def.id);
    for (const attr in def.attrs) {
      el.setAttribute(attr, def.attrs[attr]);
    }
    if (def.text) el.textContent = def.text;
    if (def.events) {
      for (const event in def.events) {
        const handlers = Array.isArray(def.events[event]) ? def.events[event] : [def.events[event]];
        handlers.forEach(handler => {
          if (typeof handler === 'function') {
            el.addEventListener(event, handler);
          } else {
            el.addEventListener(event, handler.callback, handler.options);
          }
        });
      }
    }
    if (def.children) {
      def.children.forEach(childDef => {
        const childEl = createElement(childDef);
        if (childEl) el.appendChild(childEl);
      });
    }
    return el;
  }

  /**
   * Updates an existing SVG element with a new definition.
   * @param {SVGElement} el - Element to update.
   * @param {Object} def - New definition.
   */
  function updateElement(el, def) {
    if (def.id && el.getAttribute('id') !== def.id) {
      el.setAttribute('id', def.id);
    }
    for (const attr in def.attrs) {
      el.setAttribute(attr, def.attrs[attr]);
    }
    el.textContent = def.text || '';
    if (def.events) {
      for (const event in def.events) {
        const handlers = Array.isArray(def.events[event]) ? def.events[event] : [def.events[event]];
        handlers.forEach(handler => {
          if (typeof handler === 'function') {
            el.addEventListener(event, handler);
          } else {
            el.addEventListener(event, handler.callback, handler.options);
          }
        });
      }
    }
    const childEls = Array.from(el.children);
    const childDefs = def.children || [];
    const existing = {};
    childEls.forEach(child => {
      const id = child.getAttribute('id');
      if (id) existing[id] = child;
    });
    childDefs.forEach(childDef => {
      if (childDef.id && existing[childDef.id]) {
        updateElement(existing[childDef.id], childDef);
        delete existing[childDef.id];
      } else {
        el.appendChild(createElement(childDef));
      }
    });
    for (const id in existing) el.removeChild(existing[id]);
  }

  /**
   * Validates a definition object.
   * @param {Object} def - Definition to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  function validateDef(def) {
    if (!def || !def.type) {
      console.error('Definition missing type');
      return false;
    }
    if (def.type === 'circle') {
      const required = ['cx', 'cy', 'r'];
      for (const attr of required) {
        if (!(attr in def.attrs)) {
          console.error(`Circle missing attribute: ${attr}`);
          return false;
        }
      }
    } else if (def.type === 'rect') {
      const required = ['x', 'y', 'width', 'height'];
      for (const attr of required) {
        if (!(attr in def.attrs)) {
          console.error(`Rect missing attribute: ${attr}`);
          return false;
        }
      }
    } else if (def.type === 'line') {
      const required = ['x1', 'y1', 'x2', 'y2'];
      for (const attr of required) {
        if (!(attr in def.attrs)) {
          console.error(`Line missing attribute: ${attr}`);
          return false;
        }
      }
    } else if (def.type === 'polygon') {
      if (!('points' in def.attrs)) {
        console.error('Polygon missing points attribute');
        return false;
      }
    } else if (def.type === 'path') {
      if (!('d' in def.attrs)) {
        console.error('Path missing d attribute');
        return false;
      }
    } else if (def.type === 'image') {
      if (!('xlink:href' in def.attrs)) {
        console.error('Image missing xlink:href attribute');
        return false;
      }
    } else if (def.type === 'ellipse') {
      const required = ['cx', 'cy', 'rx', 'ry'];
      for (const attr of required) {
        if (!(attr in def.attrs)) {
          console.error(`Ellipse missing attribute: ${attr}`);
          return false;
        }
      }
    } else if (def.type === 'text' && !def.text) {
      console.error('Text element missing text content');
      return false;
    }
    return true;
  }

  // Expose AbscomSVG globally
  window.AbscomSVG = AbscomSVG;
})();
