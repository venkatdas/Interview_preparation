## IIFE

- An Immediately Invoked Function Expression (IIFE) is a JavaScript function that runs as soon as it is defined.
- It is a design pattern used to encapsulate variables and functions, avoiding polluting the global scope, and to manage code in a more modular and maintainable way.

-  When JS Engine comes across this brackets, it automatically makes it into a function expression (not functional declaration)


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




