### Closures


- **Closurs is a simply combinaiton of function + Lexical Environment**
-  In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.
-  A closure occurs when a function is declared inside another function, allowing the inner function to access and manipulate the variables of the outer function even after the outer function has finished executing.
- This means that the inner function retains access to the outer scope's variables.
-  **A closure is created when we define a function, not when a function is executed.**

```js
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() {
    // displayName() is the inner function, that forms the closure
    console.log(name); // use variable declared in the parent function // Mozilla
  }
  displayName();
}
init();

```
- Above one is the example of Lexical scope

Now let's see the closure.

```js
function makeFunc() {
  const name = "Mozilla";
console.log("Taylor Durden")
  function displayName() {
    console.log(name);
  }
  return displayName;
}

const myFunc = makeFunc();
myFunc();
```

