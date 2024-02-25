### Event Propagation Bubbling capturing and Delegation

- Event propagation is a way of defining the element order when an event occurs.
-  If you have a `p` element inside a `div` element, and the user clicks on the `p` element, which element's "click" event should be handled first?

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/52f91f02-0dea-4d3d-af83-6d765e654b82)

- From above Image we have defined div and inside from and again button, when an click event listener is added among all of them
- and If I click on button form and div also executed .. In which direction or sequence all of these events is executed. Can we change the sequence of Execution?
-  Which involves lot of phases and these comes under Event propagation.

#### Event Bubling

- Event bubbling in JavaScript is a mechanism where an event triggered on a DOM element propagates up to its ancestors in the hierarchy, potentially triggering event handlers attached to these ancestor elements.
- This means that if you click on a child element, the event will first be handled by the child (if an event handler is attached), and then the event will "bubble" up to its parent, and then to the parent's parent, and so on,


- This is how event bubbling happens from the “bottom to top”.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>this keyword</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div>
      <h2>Welcome to event propagation</h2>
    </div>
    <div>
      DIV
      <form action="">
        FORM
        <button>BUTTON</button>
      </form>
    </div>
    <script src="./script.js"></script>
  </body>
</html>
```

```css
body * {
  margin: 10px;
  padding: 10px;
  border: 1px solid red;
}
```
```js

const div = document.querySelector("div");
const form = document.querySelector("form");
const button = document.querySelector("button");

div.addEventListener("click", function () {
  alert("div");
});
form.addEventListener("click", function () {
  alert("form");
});
button.addEventListener("click", function () {
  alert("button");
});
```
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5e231b46-ed8a-40e0-a07d-c5996f3a0ed0)

### event.currentTarget vs  event.target vs this.target

1) event.currentTarget

```js
const div = document.querySelector("div");
const form = document.querySelector("form");
const button = document.querySelector("button");

div.addEventListener("click",func);
form.addEventListener("click", func);
button.addEventListener("click",func);

function func(event){
  alert("currentTarget =" + event.currentTarget.tagName);
}
```

- Its keep on changing the currenTarget to from button, form, div

2) even.target

```js
function func(event){
  alert("currentTarget =" + event.currentTarget.tagName + ", target ="+ event.target.tagName);
}
```
- This aims the only button because button is origin of bubbling

3) this.target

```js
function func(event){
  alert("currentTarget =" + event.currentTarget.tagName + ", target ="+ event.target.tagName +", this =" + this.tagName);
}
```

- This will aim from button, form, div

#### Event Capturing/trickling

-  It is the opposite of bubbling. The event handler is first on its parent component and then on the component where it was actually wanted to fire that event handler.
-   In short, it means that the event is first captured by the outermost element and propagated to the inner elements. It is also called trickle down.

```js
const div = document.querySelector("div");
const form = document.querySelector("form");
const button = document.querySelector("button");

div.addEventListener(
  "click",
  function () {
    alert("div");
  },
  {
    capture: true,
  }
);
form.addEventListener(
  "click",
  function () {
    alert("form");
  },
  {
    capture: true,
  }
);
button.addEventListener(
  "click",
  function () {
    alert("button");
  },
  { capture: true }
);
```
### How to stop Bubbling or Capturing

- When you call e.stopPropagation() within an event handler, it prevents the event from propagating (traveling) further through the event phases for that specific event flow.
-  This means it stops the event from either continuing down the tree during the capturing phase or bubbling up the tree during the bubbling phase, depending on where stopPropagation() is called.

Example

```js
const div = document.querySelector("div");
const form = document.querySelector("form");
const button = document.querySelector("button");

div.addEventListener(
  "click",
  function (e) {
    alert("div");
    e.stopPropagation();
  },
  {
    capture: true,
  }
);
form.addEventListener(
  "click",
  function (e) {
    alert("form");
  },
  {
    capture: true,
  }
);
button.addEventListener(
  "click",
  function (e) {
    alert("button");
  },
  { capture: true }
);
```

- From above code it works for capturing 
-  when e.stopPropagation() is used in the div's event handler with { capture: true }, it stops the event from propagating further down to children (in this case, form and button) during the capturing phase for that specific event instance. Other elements will not receive that event in their capturing or bubbling phase event handlers.

### This is for Bubbling

```js
const div = document.querySelector("div");
const form = document.querySelector("form");
const button = document.querySelector("button");

div.addEventListener(
  "click",
  function (e) {
    alert("div");
  }
);
form.addEventListener(
  "click",
  function (e) {
    alert("form");
    e.stopPropagation();

  }
);
button.addEventListener(
  "click",
  function (e) {
    alert("button");

  }
);
```
- It pops button->form
- at form it sees the e.stopPropagation so, it wont't reach down.
