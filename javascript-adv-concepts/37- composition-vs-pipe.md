## Composition vs Pipe

Compose:

- compose is a function often found in functional programming libraries like Ramda or Lodash.
- It takes multiple functions as arguments and returns a new function that is the composition of those functions.
- The order of composition is from right to left, meaning that the rightmost function is executed first, and its result is passed as an argument to the next function to its left.

```js 

//syntax
const compose = (...functions) => input => functions.reduceRight((acc, fn) => fn(acc), input);
```



Example

```js
const addTwo = x => x + 2;
const double = x => x * 2;
const composedFunc = compose(double, addTwo);
composedFunc(3); // Output: 10
```
- Compose executes functions from right to left.

- In the compose example, addTwo is applied first, followed by double, resulting in 10.

  ________________________

## pipe

```js
const addTwo = x => x + 2;
const double = x => x * 2;
const pipedFunc = pipe(addTwo, double);
pipedFunc(3); // Output: 10
```
In the pipe example, addTwo is applied first, resulting in 5, and then double is applied, resulting in 10.



