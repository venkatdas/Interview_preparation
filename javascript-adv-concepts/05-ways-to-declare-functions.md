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

**3) Arrow Functions**

- Introduced in ES6, arrow functions provide a concise syntax for writing function expressions. They are anonymous and change the way this is handled.

  ```js
  const greet = (name) => {
  console.log("Hello " + name + "!");
};
greet("Carol");

```
- Hoisting: Arrow functions, like function expressions, are not hoisted.
- this keyword: Arrow functions do not have their own this. They inherit this from the parent scope at the time they are defined, not when they are called.

**4) IIFE**

```js
(function() {
  console.log("IIFE is running!");
})();

```


**5)  Method Definitions in Objects**

- Functions can also be defined as methods within an object.

  ```js
  const obj = {
  greet: function(name) {
    console.log("Hello " + name + "!");
  }
};
obj.greet("Dave");

// Or using shorthand syntax
const obj2 = {
  greet(name) {
    console.log("Hello " + name + "!");
  }
};
obj2.greet("Eve");
```

**6) Generator Functions**

- Generator functions allow you to define an iterative algorithm by writing a single function whose execution is not continuous.

```js
function* idGenerator() {
  let id = 1;
  while(true) {
    yield id;
    id++;
  }
}
const generator = idGenerator();
console.log(generator.next().value); // 1
console.log(generator.next().value); // 2
```

- Execution: Generator functions can pause execution and resume, maintaining their context across re-entries.


7) Async Functions

- Async functions enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.


```js
async function fetchData() {
  const data = await someAsyncOperation();
  console.log(data);
}
```

**8) Callback Functions**

```js
setTimeout(function() {
  console.log("This message is shown after 1 second.");
}, 1000);
```


