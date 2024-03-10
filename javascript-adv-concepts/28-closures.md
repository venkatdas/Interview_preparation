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

const myFunc = makeFunc(); // parent function closed and executed
myFunc(); //return child function value
```

- myFunc holds a reference to the displayName function returned by makeFunc.
- displayName retains access to its lexical scope at the time of definition (including any variables defined in makeFunc) through closure, even after makeFunc has completed execution.

- This setup allows myFunc (which is now a reference to displayName) to be called later, and when called,
- it can still access and use the variables from makeFunc's scope, demonstrating the power and utility of closures in JavaScript.

Example 2

```js
function makeFunc(a, b) {
  const name = "Mozilla";
  const result = a + b;

  console.log("Hey Ravi kumar");
  function displayName() {
    console.log(name);
  }
  // Return an object that includes both the `displayName` function and the `result`
  return { displayName, result };
}

const das = makeFunc(3, 3);
console.log(das); // This will log the object with `displayName` function and `result` value

// Now, you can call `displayName` as a method of the object returned by `makeFunc`
das.displayName(); // Calls the `displayName` function that logs "Mozilla"
console.log(das.result); // Accesses the `result` value directly, should log 6

```
_________________________________________

**Output based questions**

## 1.

```js

let count =0;
(function printCount(){
if(count===0){
  let count=1;
  console.log(count);
}
console.log(count);
})()
```
<details>
  <summary>Solution</summary>

  
```js
let count =0;
(function printCount(){
if(count===0){
  let count=1; //by shadowing 
  console.log(count); //1
}
//outside block still count =0;
console.log(count); //0
})()

```
  
</details>


