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
