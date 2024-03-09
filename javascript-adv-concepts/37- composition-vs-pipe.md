## Composition vs Pipe

Compose:

- compose is a function often found in functional programming libraries like Ramda or Lodash.
- It takes multiple functions as arguments and returns a new function that is the composition of those functions.
- The order of composition is from right to left, meaning that the rightmost function is executed first, and its result is passed as an argument to the next function to its left.

```js 

//syntax
const compose = (...functions) => input => functions.reduceRight((acc, fn) => fn(acc), input);
```

