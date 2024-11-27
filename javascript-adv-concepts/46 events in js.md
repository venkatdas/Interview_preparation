## EVENTS

- In JavaScript, an event is an action or occurrence that happens in the browser, often triggered by the user or the browser itself.
- Examples include clicking a button, moving the mouse, typing on the keyboard, resizing the browser window, or loading a web page.



Common Types of Events
Here are some frequently used events:

**Mouse Events**

click	Triggered when an element is clicked.
dblclick	Triggered on a double-click.
mouseover	Triggered when the mouse enters an element.
mouseout	Triggered when the mouse leaves an element.
mousedown	Triggered when a mouse button is pressed.
mouseup	Triggered when a mouse button is released.


**Keyboard Events**

Event	Description
keydown	Triggered when a key is pressed down.
keyup	Triggered when a key is released.
keypress	Triggered when a key is pressed and held (deprecated).

**Form Events**
Event	Description
submit	Triggered when a form is submitted.
change	Triggered when an input value changes.
focus	Triggered when an element gains focus.
blur	Triggered when an element loses focus.

**Window Events**

Event	Description
load	Triggered when the page fully loads.
resize	Triggered when the browser window is resized.
scroll	Triggered when the user scrolls the page.



### Mouse Cick Event Example
```js
<!DOCTYPE html>
<html>
<head>
  <title>Click Event Example</title>
</head>
<body>
  <button id="myButton">Click Me!</button>

  <script>
    const button = document.getElementById('myButton');

    // Add an event listener for the 'click' event
    button.addEventListener('click', function () {
      alert('Button clicked!');
    });
  </script>
</body>
</html>
```


### Event Object
- When an event occurs, JavaScript creates an event object containing information about the event.
- You can access it by passing it as a parameter to the event handler function.



```js

<!DOCTYPE html>
<html>
<head>
  <title>Event Object Example</title>
</head>
<body>
  <button id="myButton">Click Me!</button>

  <script>
    const button = document.getElementById('myButton');

    button.addEventListener('click', function (event) {
      console.log(event); // Logs the event object
      console.log(event.type); // Logs the event type ('click')
      console.log(event.target); // Logs the clicked element
    });
  </script>
</body>
</html>
```


- Event Phases: Capturing and Bubbling
- JavaScript events propagate in two phases:

- Capturing Phase: The event travels from the root element down to the target element.
- Bubbling Phase: The event bubbles up from the target element to the root.


________________



## Event Delegation

Event delegation is a technique that allows you to handle events for multiple child elements by attaching a single event listener to a common parent. 
It leverages event bubbling, where the event propagates from the target element up through its ancestors.

```js
<ul id="parentList">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<script>
  const parentList = document.getElementById('parentList');

  // Add a single event listener to the parent element
  parentList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') { // Check if a <li> was clicked
      alert(`You clicked: ${event.target.textContent}`);
    }
  });

  // Dynamically add a new item
  const newItem = document.createElement('li');
  newItem.textContent = 'Item 4';
  parentList.appendChild(newItem);
</script>
```



Why Use Event Delegation?
Reduces the number of event listeners in the DOM, improving performance.
Dynamically handles elements added to the DOM later.



_________-


- Event delegation is a way to handle events efficiently. Instead of adding event listeners to every individual element (like buttons or list items), you attach one event listener to a parent element.

- When you click on a child element, the event travels (or "bubbles up") from the clicked element to its parent. The parent can "catch" this event and figure out which child was clicked.
