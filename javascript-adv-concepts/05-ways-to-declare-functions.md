### Several ways to declare functions in JS

**1) Function Declaration (Function Statement)**

```js

function greet(name) {
  console.log("Hello " + name + "!");
}
greet("Alice");

```

- Hoisting: Function declarations are hoisted, meaning they are moved to the top of their scope before code execution. Thus, you can call a function before it's declared in the code.

  Example

```js
foo(); // 'FOOOOO'
function foo() {
  console.log('FOOOOO');
}
```

**2) Function Expression**

- A function expression involves defining a function and assigning it to a variable. Function expressions can be named or anonymous.

```js
const greet = function(name) {
  console.log("Hello " + name + "!");
};
greet("Bob");
```

- Hoisting: Unlike function declarations, **function expressions are not hoisted** You cannot call them before you declare them.

```js
foo(); // Uncaught TypeError: foo is not a function
var foo = function () {
  console.log('FOOOOO');
};
```
