## CSS

**1. CSS Box Modal**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/40355538-838a-4c5b-a6af-1f63f88c6bcd)


```js
  <body >
    <div class="box">
      <div class="content">This is some content!</div>
    </div>
  </body>

.box {
  width: 300px;
  padding: 20px; /* Space between content and border */
  border: 5px solid black; /* Border around the padding and content */
  margin: 30px; /* Space outside the border */
  background-color: lightblue; /* This sets the padding color */
}

.content {
  background-color: white; /* Background color of the content */
  height: 100%; /* Ensure it covers the content area */
}

```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/d8b2aefc-3064-489f-85d6-f62d56804928)

- Applying a different color directly to the margin in CSS is not possible because margins are always transparent and do not take a background color. 


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/3089a252-3bd4-467a-a459-35e301d92a6b)



**2. content-box (default — does not includes padding & border) vs border-box(includes padding & border)**


- content-box is the default value for box-sizing in CSS. When an element is set to content-box, the width and height properties include only the content area. Padding, border, and margin are not included in these dimensions.
- This means that if you add padding or borders to an element, **the overall size of the element will increase beyond the specified width and height**.

- This is the standard CSS box model. When you set the width and height properties of an element, they apply only to the content of the box, not the padding or border.
- Total width of the element = width + left padding + right padding + left border + right border.
- Total height of the element = height + top padding + bottom padding + top border + bottom border.

**Example**


```js
.box {
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
  box-sizing: content-box; /* This is the default setting and could be omitted */
}

```

- In this case, the total width of the .box element would be 350px (300px width + 20px left padding + 20px right padding + 5px left border + 5px right border),
- and the total height would be 250px (200px height + 20px top padding + 20px bottom padding + 5px top border + 5px bottom border).


**Border-box**

- When box-sizing is set to border-box, the width and height properties **include the content, padding, and border**, but not the margin.
- This setting makes it easier to size elements because adding padding or borders does not change the overall dimensions of the element, which simplifies layout design, especially in responsive grids.
- Total width of the element = width (which already includes padding and border).
- Total height of the element = height (which already includes padding and border).
- This value simplifies layouts because the size of an element remains consistent regardless of changes to its padding or border.

```js
.box {
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 10px solid black;
  margin: 10px;
  box-sizing: border-box;
}
```

- With border-box: If you have a box with a width of 300px, and you add padding of 20px and a border of 10px, the total width remains 300px. The content area shrinks to accommodate the padding and border within the defined width.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/d7c1fda8-63f9-4ca7-ba97-ca96e410f83e)

## 3. CSS Position


## 4. Flexbox:

- Flexbox is a layout model that allows design in a more efficient and predictable way.


## 5. How to center a div using flexbox

- To center a <div> element using CSS Flexbox, you can follow these steps:


- **Set the Container to Display Flex:** Apply display: flex; to the container element that holds the <div> you want to center. This makes it a flex container and allows you to use the flex properties on its children.
- **Align Items Vertically:** Use align-items: center; on the flex container. This aligns the flex items (including your <div>) in the center of the container along the cross axis, which is vertical by default.
- **Justify Content Horizontally:** Apply justify-content: center; on the flex container to center the flex items along the main axis, which is horizontal by default.


```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>HTML + CSS</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="container">
      Centered content
  </div>

  </body>
</html>


//CSS

.container {
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  height: 100vh; /* Optional: takes full viewport height */
}
```


## 6. How do you include CSS in your HTML document?

**1. Inline CSS**
- Inline CSS involves adding style directly within an HTML element using the style attribute.
- This method is useful for quick, one-off styling of individual elements but is generally not recommended for larger projects because it mixes content with presentation and can be hard to maintain.
```js
<p style="color: red;">This text will be red.</p>

```

**2.Internal (Embedded) CSS**

- Internal CSS is written within a <style> tag in the <head> section of the HTML document. This method is suitable for styles that are specific to a single document and allows you to style elements without altering the HTML structure.


```js
<head>
  <style>
    p {
      color: blue;
    }
  </style>
</head>
<body>
  <p>This text will be blue.</p>
</body>

```

**3. External CSS**

- External CSS is the most common and recommended method for including CSS, especially in larger projects. Styles are maintained in separate CSS files which are linked to the HTML document using the <link> tag in the <head> section.
- This method keeps content and presentation separate, making the HTML and CSS easier to read and maintain.

```js
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <p>This text will be styled according to the styles.css file.</p>
</body>


//style.css

p {
  color: green;
}

```

## 7. CSS selectors

- CSS selectors are patterns used to select HTML elements in order to apply styles to them.

    **Types of selectors**

```js
/* Selects all paragraphs */
p {
    color: blue;
}

/* Selects elements with class 'highlight' */
.highlight {
    background-color: yellow;
}

/* Selects elements with id 'header' */
#header {
    font-size: 24px;
}
```


- Type Selectors: These target elements based on their HTML tag (e.g., div, p).
- Class Selectors: These target elements based on their class attribute (e.g., .class-name).
- ID Selectors: These target elements based on their ID attribute (e.g., #id-name).

- Attribute Selectors: These target elements based on the presence or value of an attribute (e.g., [type="text"]).This group of selectors gives you different ways to select elements based on the presence of a certain attribute on an element:

- Pseudo-class Selectors: These target elements based on their state (e.g., :hover, :checked).
- Pseudo-element Selectors: These target specific parts of an element (e.g., ::before, ::after).
- Universal Selector: This targets any element (e.g., *).
- Combinators and Descendant Selectors: These define relationships between elements (e.g., >, +, ~, and whitespace).

**Pseudo Class Example**


- Pseudo-classes are keywords that can be added to selectors in CSS to target specific states or elements.


- A pseudo-class is a selector that selects elements that are in a specific state, e.g. they are the first element of their type, or they are being hovered over by the mouse pointer.

  **Example**

- Let's look at a simple example. If we wanted to make the first paragraph in an article larger and bold, we could add a class to that paragraph and then add CSS to that class, as shown in the first example below:

  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/b1a5b34b-bc91-459b-9d0a-0f2df4bdc0c1)

- As per above Image we have applied a simple class then we have applied styles to that. This is working fine but if we have aneother extra para that need to be added top of the document then, We'd need to move the class over to the new paragraph. Instead of adding the class,
- we could use the :first-child pseudo-class selector — this will always target the first child element in the article, and we will no longer need to edit the HTML

```jsarticle p:first-child {
  font-size: 120%;
  font-weight: bold;
}
```

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Styling the list items */
    li {
      margin: 5px;
      padding: 10px;
      border: 1px solid #ccc;
    }

    /* Styling the even list items using :nth-child(even) pseudo-class */
    li:nth-child(even) {
      background-color: #f2f2f2;
    }

    /* Styling the first list item using :first-child pseudo-class */
    li:first-child {
      font-weight: bold;
    }

    /* Styling the last list item using :last-child pseudo-class */
    li:last-child {
      border-bottom: 2px solid #333;
    }

    /* Styling the hovered list item using :hover pseudo-class */
    li:hover {
      background-color: #ddd;
    }
  </style>
</head>
<body>

  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
    <li>Item 5</li>
  </ul>

</body>
</html>
```


- **Pseudo Element Example**
Pseudo-elements in CSS allow you to style a specific part of an element.


```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Styling the first line of each list item */
    li::first-line {
      text-transform: uppercase;
      font-weight: bold;
    }

    /* Styling the first letter of each list item */
    li::first-letter {
      font-size: 150%;
      color: #900;
    }

    /* Styling the marker of the list item (e.g., the bullet or number) */
    li::marker {
      content: "•"; /* Custom marker content */
      color: #ff4500; /* Custom marker color */
      margin-right: 5px; /* Add some spacing between the marker and the text */
    }
  </style>
</head>
<body>

  <ul>
    <li>Item 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
    <li>Item 2 - Fusce tincidunt, justo eget ultrices rhoncus, ligula quam congue lacus.</li>
    <li>Item 3 - Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</li>
  </ul>

</body>
</html>
```



