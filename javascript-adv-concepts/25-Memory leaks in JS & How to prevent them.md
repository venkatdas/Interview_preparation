#### Memory leaks


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6251ad6c-a8fa-4f71-84c8-7b25ed344e8e)

- We just need to remember that memory is limited ,
- so when it comes to call stack and memory heap ,those are two places that JavaScript remembers or stores memory.

**What are memory leaks?**

- A Memory leak can be defined as a piece of memory that is no longer being used or required by an application
- but for some reason is not returned back to the OS.
- In simple terms it is forgotten data forever waiting to be used.
- Leaks are the cause of whole class of problems: **slowdowns, crashes, high latency, and even problems with other applications.**

- Memory leaks in JavaScript can lead to poor performance, slow loading times, and crashes in web applications.

- A memory leak occurs when a JavaScript program holds onto references to objects that are no longer needed, preventing the garbage collector from freeing up memory. This can cause the amount of memory used by the program to grow over time, eventually leading to performance issues.
- JavaScript is a garbage-collected language, meaning that the browser automatically frees up memory that is no longer needed by the program. However, if a program holds onto references to objects that are no longer needed, the garbage collector cannot free up that memory, leading to a memory leak.

## 1. 1.Undeclared/ Global Variables
**Cause of Leak:**
Creating an unintended global variable by not declaring it properly.
```js
function createGlobalVariable() {
  globalVar = "This is a global variable"; // Mistakenly creates a global variable
}
```
**Prevention:**
Declare variables with let, const, or var to avoid them becoming global.

```js
function createLocalVariable() {
  let localVar = "This is a local variable"; // Properly declared local variable
}
```

## 2. Timers and Callbacks

**Cause of Leak:**
Setting up an interval and forgetting to clear it can cause the callback function to hold onto variables unnecessarily.

```js
let someResource = loadData();
setInterval(() => {
  console.log(someResource);
}, 1000);
```
**Prevention:**
Clear the interval when it's no longer needed or before the containing component is destroyed.

```js
let someResource = loadData();
let intervalId = setInterval(() => {
  console.log(someResource);
}, 1000);

// Later on
clearInterval(intervalId);
someResource = null; // Release the resource
```

## 3. Out of DOM references

**Cause of Leak:**
Holding onto DOM elements that have been removed from the DOM.

```js
let elements = document.querySelectorAll('.some-class');
document.body.innerHTML = ''; // Removes elements from the DOM

// elements is still holding references to the removed DOM elements
```
**Prevention:**
Clear references to DOM elements once they are no longer needed.

```js
let elements = document.querySelectorAll('.some-class');
document.body.innerHTML = ''; // Removes elements from the DOM

elements = null; // Clears the reference
```


## 4. Event Listeners

**Cause of Leak:**
Adding an event listener to a DOM element and not removing it can prevent the element from being garbage collected.

```js
document.getElementById('myButton').addEventListener('click', () => {
  console.log('Button clicked!');
});
```
**Prevention:**
Remove event listeners when they are no longer needed.

```js
function handleClick() {
  console.log('Button clicked!');
}

let button = document.getElementById('myButton');
button.addEventListener('click', handleClick);

// When the button is no longer needed
button.removeEventListener('click', handleClick);
```
## Example 5: Closures

**Cause of Leak:**
A closure captures a large object or other resources that are no longer needed
```js
function createClosure() {
  let bigData = new Array(1000).fill(new Array(1000).fill(0));
  return function() {
    console.log(bigData[0][0]);
  };
}
let closure = createClosure();
```
Prevention:
Ensure closures only hold references to what is absolutely necessary and release resources when they are no longer needed.

```js
function createEfficientClosure() {
  let bigData = new Array(1000).fill(new Array(1000).fill(0));
  return {
    logFirstItem: function() {
      console.log(bigData[0][0]);
    },
    releaseData: function() {
      bigData = null; // Release the memory
    }
  };
}
let closure = createEfficientClosure();
closure.logFirstItem();
closure.releaseData(); // Explicitly release resources when done
```

 
