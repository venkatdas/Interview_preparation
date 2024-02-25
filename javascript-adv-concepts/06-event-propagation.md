### Event Propagation Bubbling capturing and Delegation

- Event propagation is a way of defining the element order when an event occurs.
-  If you have a `p` element inside a `div` element, and the user clicks on the `p` element, which element's "click" event should be handled first?

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/52f91f02-0dea-4d3d-af83-6d765e654b82)

- From above Image we have defined div and inside from and again button, when an click event listener is added among all of them
- and If I click on button form and div also executed .. In which direction or sequence all of these events is executed. Can we change the sequence of Execution?
-  Which involves lot of phases and these comes under Event propagation.

#### Event Bubling

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


