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

Example 2


- Suppose you have a series of string operations to perform on names: trim whitespace, capitalize the first letter, and append a greeting.


```js
const trim = str => str.trim();
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
const greet = str => `Hello, ${str}!`;

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Composing the functions
const prepareGreeting = compose(greet, capitalize, trim);

console.log(prepareGreeting("  alice")); // Output: "Hello, Alice!"
```
- In this example, prepareGreeting first trims " alice", capitalizes it to "Alice", and then applies the greeting, producing "Hello, Alice!".
  ________________________

## pipe

Example 1

```js
const addTwo = x => x + 2;
const double = x => x * 2;
const pipedFunc = pipe(addTwo, double);
pipedFunc(3); // Output: 10
```
In the pipe example, addTwo is applied first, resulting in 5, and then double is applied, resulting in 10.


Example 2

- Let's say you want to perform a series of arithmetic operations on a number: add a value, double the result, and then subtract a value.



```js
const add = (x, y) => x + y;
const double = x => x * 2;
const subtract = (x, y) => x - y;

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// Piping the functions with pre-set arguments for add and subtract
const operate = pipe(x => add(x, 10), double, x => subtract(x, 5));

console.log(operate(5)); // Output: 25

```
- Here, operate(5) first adds 10 to 5, doubles the result to 30, and then subtracts 5, ending with 25.


