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

- Pseudo-elements behave in a similar way.
- However, they act as if you had added a whole new HTML element into the markup, rather than applying a class to existing elements.

- Pseudo-elements start with a double colon ::. ::before is an example of a pseudo-element.


**Use-case scenario**

- For example, if you wanted to select the first line of a paragraph you could wrap it in a <span> element and use an element selector; however, that would fail if the number of words you had wrapped were longer or shorter than the parent element's width. As we tend not to know how many words will fit on a line — as that will change if the screen width or font-size changes — it is impossible to robustly do this by adding HTML.

- **That is the reason we have to use  The ::first-line pseudo-element selector will do this for you reliably — if the number of words increases or decreases it will still only select the first line.**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/c0ba8755-9cc7-4575-b835-e41f35c458f7)

___________________
**Example 2**
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


## 8. CSS Position

- In CSS, the position property is used to control the positioning of an element within its containing element. The position property can take several values, each affecting the positioning of the element in different ways.
- CSS positioning is a fundamental concept that allows **you to control the layout of elements on your web page**.



**Static Position**

- It's default position does means,
- Elements are positioned according to the normal flow of the document.
- top, right, bottom, and left properties have no effect.

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
   <p class="positioned">Static Element </p>
   <!-- <div class="normal">Normal Box</div> -->
<!-- <div class="relative">Relatively Positioned Box</div> -->

  </body>
</html>

//styles.css

.positioned {
  width: 300px;
  height: 50px;
  background-color: yellow;
  border: 1px solid black;
  top: 20px;
  left: 20px;
  position: static;
}
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/e5ceadf3-e4ab-4fd1-83d0-5b1e5da9b8c4)



**2.relative position**

- Positioned relative to its normal(static) position.
- When you use top, right, bottom, or left, it will be adjusted from its normal position.

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
   <p class="positioned">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only. </p>

   <p></p>
<div class="relative">he standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form.</div>

  </body>
</html>

//style

.positioned {
  width: 90%;
  height: auto;
  background-color: yellow;
  border: 1px solid black;
  top: 20px;
  left: 20px;
  position: static;
}

.relative {
  position: relative;
  top: 40px;
  left: 70px;
  width: 200px;
  height: auto;
  background-color: lightcoral;
  border: 1px solid black;
}

```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/42b3a1ef-1d8a-4f32-8e74-09a9ba21f274)



**3.Absolute**

- Absolutely! When an element is set to position: absolute; in CSS, it is removed from the normal document flow, and instead positioned relative to its nearest positioned ancestor. If no such ancestor exists, it positions itself relative to the initial containing block (usually the <html> element).


- **Removed from Normal Flow:** The element does not affect the positioning of other elements nor is it affected by them. This means it doesn't take up space where it would normally be in the document flow.
- **Positioned Relative to Nearest Positioned Ancestor:** If an ancestor element has a position property set to anything other than static (e.g., relative, absolute, fixed), the absolutely positioned element will position itself based on the top, right, bottom, and left properties relative to this ancestor.


```js
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Absolute Positioning Example</title>
<style>
  .relative-container {
    position: relative;
    width: 300px;
    height: 300px;
    background-color: lightblue;
    border: 2px solid black;
  }
  .absolute-box {
    position: absolute;
    top: 50px;
    left: 70px;
    width: 100px;
    height: 100px;
    background-color: lightcoral;
    border: 1px solid black;
  }
</style>
</head>
<body>
<div class="relative-container">
  This is a relatively positioned container.
  <div class="absolute-box">Absolutely positioned box</div>
</div>
</body>
</html>
```

- In this example

- The .relative-container is a <div> with position: relative;. This doesn’t change its position in the document flow, but it becomes a reference point for any absolutely positioned child elements.
- The .absolute-box is a <div> with position: absolute; and positioned 50px from the top and 70px from the left of its parent .relative-container.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7b5b0812-8e35-4315-96f1-d5f0455a866c)


**4.fixed** 

- Positioned relative to the viewport, which means it always stays in the same place even if the page is scrolled.
- Ignores the normal flow of the document.

```js
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Fixed Positioning Example</title>
<style>
  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: navy;
    color: white;
    text-align: center;
    padding: 10px 0;
    border-bottom: 2px solid yellow;
  }
  .content {
    margin-top: 100px; /* Give enough space to see content below fixed header */
    height: 2000px; /* To demonstrate scrolling */
    background-color: lightgrey;
    padding: 20px;
  }
</style>
</head>
<body>
  <div class="fixed-header">Fixed Header - Always Visible</div>
  <div class="content">
    Scroll down to see the effect of the fixed header.
  </div>
</body>
</html>
```
- The .fixed-header div has position: fixed;, which keeps it at the top of the viewport at all times. This div acts as a header that remains visible as you scroll through the page.
- The .content div has enough margin-top to ensure it starts below the header and extends far enough to allow for scrolling. This setup illustrates how the fixed header stays in place while the content moves beneath it.



**5.sticky**


- Sticky positioning in CSS is a powerful feature that combines aspects of both relative and fixed positioning. An element with position: sticky; behaves like a relatively positioned element until it reaches a certain point during scrolling, at which point it becomes fixed.
- This is typically used for headers, navigation bars, or any component you want to remain visible as you scroll past a certain point.

**How It Works:**
- Relatively Positioned: Initially, the element behaves like it's relatively positioned.
- Becomes Fixed: As you scroll and the element reaches a specified threshold (defined by top, right, bottom, or left), it "sticks" in place and behaves like it's fixed positioned.

```js
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Sticky Positioning Example</title>
<style>
  body, html {
    height: 2000px; /* Ensures there's enough room to scroll */
    margin: 0;
    padding: 0;
  }
  .sticky-sidebar {
    position: -webkit-sticky;
    position: sticky;
    top: 20px; /* Distance from the top of the viewport */
    background-color: yellow;
    padding: 10px;
    width: 200px;
    height: 300px;
    border: 3px solid green;
  }
  .content {
    width: 300px;
    float: right;
    padding: 10px;
    background-color: lightblue;
  }
</style>
</head>
<body>
  <div class="sticky-sidebar">I stick as you scroll!</div>
  <div class="content">Lots of content here to scroll through. Keep scrolling to see the sticky element in action. This content is here to make sure there's enough to scroll through. Scroll down and notice how the yellow sidebar sticks to the top after you scroll 20px down.</div>
</body>
</html>
```

- The .sticky-sidebar is styled with position: sticky; and top: 20px;, which means it will scroll with the content until the viewport’s top edge reaches 20 pixels above the sidebar, at which point it will stick and remain visible as you continue to scroll.
- The .content div is just regular content that makes the page tall enough to scroll. It’s floated to the right to allow the sticky sidebar to show clearly on the left.

            **OR**


```js
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Sticky Positioning Example</title>
<style>
  body, html {
    height: 100%; /* Makes sure the HTML and Body are full height */
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  }
  div.sticky {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0; /* Set the sticky element to stay at the top of the viewport */
    padding: 5px;
    background-color: #cae8ca; /* Light green background */
    border: 2px solid #4CAF50; /* Green border */
  }
  .content {
    padding-bottom: 2000px; /* Provides enough height to scroll */
    padding: 10px;
    background-color: #fff; /* White background for content */
    border: 1px solid #ddd; /* Light grey border */
  }
</style>
</head>
<body>

<p>Try to <b>scroll</b> inside this frame to understand how sticky positioning works.</p>

<div class="sticky">I am sticky!</div>

<div class="content">
  <p>In this example, the sticky element sticks to the top of the page (top: 0), when you reach its scroll position.</p>
  <p>Scroll back up to remove the stickyness.</p>
  <p>Some text to enable scrolling.. Lorem ipsum dolor sit amet, illum definitiones no quo, maluisset concludaturque et eum, altera fabulas ut quo. Atqui causae gloriatur ius te, id agam omnis evertitur eum. Affert laboramus repudiandae nec et. Inciderint efficiantur his ad. Eum no molestiae voluptatibus.</p>
  <p>Some more text to ensure there's ample scrolling space. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
</div>

</body>
</html>
```


## 8. CSS Specificity





**If there are two or more CSS rules that point to the same element, the selector with the highest specificity value will "win", and its style declaration will be applied to that HTML element.
Think of specificity as a score/rank that determines which style declaration is ultimately applied to an element.**

- CSS specificity is a crucial concept when working with CSS as it determines which styles are applied to elements based on the rules defined. Here’s a breakdown of how it works and how to calculate it:

**What is CSS Specificity?**
- CSS specificity is a system that browsers use to decide which CSS property values are the most relevant to an element and, therefore, will be applied. Specificity is calculated when multiple CSS rules could apply to an element and there is a need to determine which rule takes precedence.

**How Does CSS Specificity Work?**
- When multiple rules point to the same element, the browser follows these steps to determine which one applies:

- Importance: The !important rule takes highest precedence.
- Specificity: If no rule has the !important declaration, the browser looks at specificity.
- Source Order: If two competing rules have the same specificity, the later rule in the CSS file will be used.


**Calculating Specificity:**
- Specificity is calculated on a per-selector basis and results in a comma-separated list of values, typically viewed as a set of four numbers (a, b, c, d). Here’s how these values are determined:

- a: This value is 1 if the style is inline, 0 otherwise.
- b: This is the count of ID selectors in the selector.
- c: This is the count of class selectors, pseudo-classes, and attribute selectors.
- d: This is the count of type selectors and pseudo-elements.
- The universal selector (*), combinators (+, >, ~, , etc.), and negation pseudo-class (:not()) do not affect specificity.


`#header .menu li.active a { color: blue; }`

- a = 0 (no inline style)
- b = 1 (one ID selector: #header)
- c = 2 (two class selectors: .menu, .active)
- d = 2 (two type selectors: li, a)
- The specificity would be calculated as 0,1,2,2.


**Example**

- In this example, we have used the "p" element as selector, and specified a red color for this element. **The text will be red:**

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
    <p>Hello World!</p>
  </body>
</html>

//css
p {
  color: red;
}
```
**Example 2**
- In this example, we have added a class selector (named "test"), and specified a green color for this class. The text will now be green (even though we have specified a red color for the element selector "p"). This is because the class selector is given higher priority:

```js
 <body>
    <p class="test">Hello World!</p>
  </body>

.test {
  color: green;
}
p {
  color: red;
}
```

**Example 3**

- In this example, we have added the id selector (named "demo"). The text will now be blue, because the id selector is given higher priority:

```js
<html>
<head>
  <style>
    #demo {color: blue;}
    .test {color: green;}
    p {color: red;}
  </style>
</head>
<body>

<p id="demo" class="test">Hello World!</p>

</body>
</html>
```

**Example 4**

- In this example, we have added an inline style for the "p" element. The text will now be pink, because the inline style is given the highest priority:

```js
<html>
<head>
  <style>
    #demo {color: blue;}
    .test {color: green;}
    p {color: red;}
  </style>
</head>
<body>

<p id="demo" class="test" style="color: pink;">Hello World!</p>

</body>
</html>
```

**Specificity Hierarchy**

- Every CSS selector has its place in the specificity hierarchy.

- There are four categories which define the specificity level of a selector:

- `Inline styles - Example: <h1 style="color: pink;">`
- IDs - Example: #navbar
- Classes, pseudo-classes, attribute selectors - Example: .test, :hover, [href]
- Elements and pseudo-elements - Example: h1, ::before


## 9. CSS Display properties

- **CSS display properties control the layout behavior of elements on a web page.** Here are some of the most commonly used values for the display property and examples of how they might be used:

**1.display:block**

- Description: This value makes the element behave like a block-level element, occupying the full width available and starting on a new line.
- `Example: <div>, <p>, <h1> - <h6>,<form>,<header>,<footer>,<section>`

**2. display:inline**

- Description: This value makes the element behave like an inline element, meaning it does not start on a new line and only occupies as much width as necessary.
- Inline elements cant have width and height

`<span>
<a>
<img>
`

**3.inline-block**

- Description: Combines the layout properties of both inline and block elements. The element does not break onto a new line but can have a width and height.
- Example: Custom button styling.

```js
button {
  display: inline-block;
}
```


**Example**

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
    <div id="div1">This is first div</div>
    <span id="span1">This is span</span>
    <img  id="img" src="https://images.unsplash.com/photo-1527903789995-dc8ad2ad6de0?q=80&w=1420&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="df">
    <span id="span2">This is span 2</span>
<div id="div2"> This is last Div</div>
  </body>
</html>


#div1 {
  display: block;
  background-color: red;
}

#span1 {
  display: inline;
  background-color: cyan;
}
#span2 {
  display: inline;
  background-color: purple;
}

#div2 {
  display: inline-block;
  background-color: greenyellow;
}
#img {
  width: 80px;
  height: 80px;
}
```



- ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/42453ece-6e1e-4e0e-8e86-11f9de51f294)


## 10. CSS flex

- If Flexbox is a powerful layout system because it’s a one-dimensional system (meaning that we can work with rows or columns)
- It makes our life easier to design and build responsive web pages without having to use tricky hacks and a lot of float and position properties in our CSS code.


```js
<div class="container">
  <div id="one">1</div>
  <div id="two">2</div>
  <div id="three">3</div>
</div>

//css
.container{
  display: flex;
}
```


 ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/afb7b411-c060-4873-816c-f0162dbf78a7)

- In our flex container, we could decide to set a direction for the items in our container. The most frequently used flex directions are row and column. Our corresponding CSS would look like this:

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/33e36512-630e-47e9-b512-939528bb4a8c)

- In some cases, flex-direction could be set to row-reverse or column-reverse. One important thing to note under flex directions is the concept of axes. Depending on the flex direction, we can have a main axis and a cross axis. In the case where the flex-direction is row, the main axis is in the horizontal direction, and the cross axis is in the vertical. The opposite is of the case when the flex-direction is column. This will be useful when we look into aligning:

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/d525153b-bec4-4c79-aff0-f65b76fe61c5)

- Another interesting property is flex-wrap, which lets items in a flex container move on to the next line when there is no more room:

```js
.container{
  flex-wrap: wrap | nowrap| wrap-reverse;
}
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/3940d3e4-d703-4946-9523-369a5489d11d)



- The problem with flex-wrap, however, is that when the items wrap, they form their own flex line below the ones above, and so are not perfectly aligned with the items above them. You see that item4 and item5 spread out to fill all the room below the elements above them.
- To demonstrate this, let’s look at a few alignment-related properties of Flexbox such as align-self and justify-content.


```js
<div id="container">
  <div id="one">1</div>
  <div id="two">2</div>
  <div id="three">3</div>
  <div id="four">4</div>
</div>

#one{
  align-self: flex-start | flex-end | center | stretch 
}
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/f34d37a7-0a9c-4e97-9e4a-76638814ed58)

- Instead of aligning each individual item, say we wanted to align all items together within the container. For that, we’ll use justify-content.

```js
.container{
  justify-content: flex-start | flex-end | center | space-between | space-around
}
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/9ebe9259-7ccf-4b41-9c89-62d17d49a293)

## 11.CSS Grid

- CSS Grid is a two-dimensional layout system, we can work with rows and columns together, which means that it opens a lot of different possibilities to build more complex and organized design systems.

```js

<div class="container">
  <div id="one">1</div>
  <div id="two">2</div>
  <div id="three">3</div>
  <div id="four">4</div>
  <div id="five">5</div>
</div>


.container {
  display: grid;
  grid-template-columns: 60px 60px ;
  grid-template-rows: auto;
}

```

- To define a grid container, all you need to do is pass a display: grid property to your block element. Now you have a grid, so you should define how many rows and columns you want.
- To create rows and columns, we use the grid-template-rows and grid-template-columns properties, and pass values that tell how much our grid items will span through the container:

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/94401745-5372-4f23-87af-8f9a6a2cc145)

- Just like now, Grid also has some properties that let you align items within the container. An example is the justify-self property


```js

#one{
  justify-self: start | end | center | stretch
}
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/41a2f3be-a5cb-4413-b167-6f937afe6eda)


- It is worth noting that justify-self is not the only alignment property that grid has. We could also use justify-content, justify-items, align-items, and align-self. 

- **CSS Grid is for layout; Flexbox is for alignment**


**When to use CSS Flexbox**

- You have a small design to implement: Flexbox is ideal when you have a small layout design to implement, with a few rows or a few columns
- You need to align elements: Flexbox is perfect for that, the only thing we should do is create a flex container using display: flex and then define the flex-direction that we want
- You need a content-first design : Flexbox is the ideal layout system to create web pages if you don’t know exactly how your content is going to look, so if you want everything just to fit in, Flexbox is perfect for that

**When to use CSS Grid**


- You have a complex design to implement
- 





## 12. CSS Example 1



## 13. what is the use of css sprites.

- CSS sprites are a technique used in web development to optimize the loading and performance of websites


- Reduced HTTP Requests: By combining multiple images into a single sprite sheet, a website only needs to load one image file instead of several. This reduces the number of HTTP requests made to the server, which can significantly speed up page loading times.
- Faster Page Loading: Fewer HTTP requests mean less data that the browser needs to fetch, which can lead to faster page loading times. This is particularly beneficial for users on slower internet connections or mobile devices.
-Lower Bandwidth Usage: Using sprites can reduce the total amount of data transferred between the server and the client, as overhead from multiple image headers is eliminated.
- Improved User Experience: Faster load times and smoother interactions (like hovering over buttons or navigating through image-based navigation bars) can lead to a better user experience.
- Easier Image Management: Managing one image file instead of many can simplify the workflow for web designers and developers. It can be easier to update and maintain a single image file than multiple individual files.
- Cache Efficiency: Since the sprite image is loaded only once and used multiple times across different pages of a website, it can be effectively cached by the browser, ensuring that subsequent page visits are faster.


  
## 14. How is responsive design different from adaptive design?

**Responsive Design:**

- In this design web designers design the user interface of a website in such a manner that whatever device you are using you can access comfortably web page. if we use a web page on the laptop then it splits into a large view but if you use the same web page on mobile then it synchronizes itself. web designers simply design it by using only HTML & CSS. designer works with the developer for a better user experience.

**Adaptive Design:**

- In this design web designers design the user interface of a website in such a manner that it creates different layouts of the web page for the different devices. so based on the screen size of the device it loads the layout of the page. it creates the different layouts for different devices like screen size as for 320px, 480px, 760px, 960px, 1200px, 1600px. for different sizes of mobile screens, tablet screens, and many more devices it depicts the size of layouts of the screen and displays the content of the page. web designers have to work more because they have to develop six different pages.






