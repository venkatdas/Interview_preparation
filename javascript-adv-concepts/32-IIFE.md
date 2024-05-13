## IIFE

- An Immediately Invoked Function Expression **(IIFE) is a JavaScript function that runs as soon as it is defined.**
- It is a design pattern used to encapsulate variables and functions, avoiding polluting the global scope, and to manage code in a more modular and maintainable way.

-  When JS Engine comes across this brackets, **it automatically makes it into a function expression (not functional declaration).**

-  **IIFEs (Immediately Invoked Function Expressions) are not hoisted** 


  ```js

(function () {
  // Code here

  console.log("das"); //das
})();

```

## IIFE with params

```js
let result = (function() {
  return 2 + 3;
})();
console.log(result);  // Output: 5
```


## IIFE with Arrow functions

```js
(() => {
  const message = 'IIFE with arrow function';
  console.log(message);
})();

```

## IIFE with closure

```js
const counter = (function() {
    let count = 0; // This variable is private to the IIFE

    return {
        increment: function() {
            count += 1;
            return count;
        },
        decrement: function() {
            count -= 1;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
})();

console.log(counter.getCount());  // 0
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
```


