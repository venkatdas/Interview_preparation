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

```
foo(); // 'FOOOOO'
function foo() {
  console.log('FOOOOO');
}
```

