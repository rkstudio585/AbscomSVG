# AbscomSVG Framework Documentation

A lightweight JavaScript framework for dynamic SVG generation and manipulation. Create, update, and animate SVG elements with declarative syntax.

## Table of Contents
1. [Setup](#setup)
2. [Basic Usage](#basic-usage)
3. [Element Creation](#element-creation)
4. [Attributes & Transformations](#attributes--transformations)
5. [Animations](#animations)
6. [Event Handling](#event-handling)
7. [Dynamic Updates](#dynamic-updates)
8. [Full Example](#full-example)

## Setup <a name="setup"></a>
1. Include the script in your HTML:
```html
<script src="abscomsvg.js"></script>
```
2. Create an SVG container:
```html
<svg id="myCanvas" width="400" height="400" xmlns="http://www.w3.org/2000/svg"></svg>
```

## Basic Usage <a name="basic-usage"></a>
```javascript
// Create a red circle
const circle = AbscomSVG.circle(50, 50, 40, 'red');
AbscomSVG.render('myCanvas', circle);
```

## Element Creation <a name="element-creation"></a>
### Available Helpers:
```javascript
// Rectangle
AbscomSVG.rect(x, y, width, height, fill)

// Line
AbscomSVG.line(x1, y1, x2, y2, stroke)

// Text 
AbscomSVG.text(x, y, content, {fontSize: '20px', fill: 'black'})

// Polygon
AbscomSVG.polygon('100,10 40,198 190,78 10,78 160,198', 'navy')

// Image
AbscomSVG.image('logo.png', 10, 10, 100, 100)
```

## Attributes & Transformations <a name="attributes--transformations"></a>
```javascript
// Add stroke to element
const outlinedCircle = AbscomSVG.withStroke(
  AbscomSVG.circle(50, 50, 40, 'gold'),
  'black',
  2
);

// Apply transformation
const rotatedRect = AbscomSVG.rect(10, 10, 80, 40, 'blue');
rotatedRect.attrs.transform = AbscomSVG.transform('rotate', 45, 50, 50);
```

## Animations <a name="animations"></a>
```javascript
const animatedCircle = {
  ...AbscomSVG.circle(50, 50, 20, 'green'),
  children: [
    AbscomSVG.animate('r', '20', '40', '1s', 'indefinite')
  ]
};
```

## Event Handling <a name="event-handling"></a>
```javascript
const clickableRect = {
  ...AbscomSVG.rect(10, 10, 100, 50, 'blue'),
  events: {
    click: [
      { callback: () => console.log('Clicked!'), options: { once: true } },
      () => alert('Hello!')
    ]
  }
};
```

## Dynamic Updates <a name="dynamic-updates"></a>
```javascript
// Update elements by re-rendering with new definitions
function updateScene() {
  const elements = [
    AbscomSVG.circle(Math.random()*300, Math.random()*300, 30, 'purple'),
    AbscomSVG.rect(200, 50, 100, 100, 'yellow')
  ];
  AbscomSVG.render('myCanvas', elements);
}

// Elements with same ID will update instead of recreate
const persistentElement = {
  ...AbscomSVG.circle(150, 150, 40, 'red'),
  id: 'mainElement'
};
```

## Full Example <a name="full-example"></a>
```html
<svg id="demo" width="300" height="300"></svg>

<script>
  // Create animated smiley face
  const face = AbscomSVG.circle(150, 150, 100, 'yellow');
  
  const leftEye = {
    ...AbscomSVG.circle(110, 120, 15, 'black'),
    children: [
      AbscomSVG.animate('cy', '120', '110', '0.5s', 'indefinite')
    ]
  };

  const mouth = AbscomSVG.path('M100 200 Q150 250 200 200', 'none');
  AbscomSVG.withStroke(mouth, 'black', 3);

  AbscomSVG.render('demo', [
    face,
    leftEye,
    AbscomSVG.circle(190, 120, 15, 'black'),
    mouth
  ]);
</script>
```

## Key Features
- Declarative SVG creation
- DOM-diffing for efficient updates
- Chainable attribute modifiers
- Cross-browser SVG namespace handling
- Built-in validation for element attributes

## Notes
- Always use IDs for elements you plan to update
- Use SVG coordinate system (origin at top-left)
- Add xmlns attribute to SVG containers for proper rendering
- Check console for validation warnings during development

[⬆ Back to Top](#abscomsvg-framework-documentation)
