## rest vs spread

**Rest Operator (...)**
- The rest operator collects all remaining elements into an array. It is used in function arguments and destructuring assignments.
- Usage: Function parameters, array destructuring, and object destructuring.


```js
function sum(...numbers) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(4, 5, 6, 7)); // 22
```

- Example 2: Array Destructuring
- The rest operator can be used to collect the remaining elements in an array destructuring assignment.


```js
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

```

- Object destrcuring


```js
const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a); // 1
console.log(b); // 2
console.log(rest); // { c: 3, d: 4 }
```


**Spread Operator (...)**
- The spread operator expands an array or object into individual elements. It is used in array literals, object literals, and function calls.


- Example 1: Array Expansion
- The spread operator can be used to create a new array by expanding an existing array.


```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5, 6];
console.log(arr2); // [1, 2, 3, 4, 5, 6]
```

- Example 2: Function Arguments
- The spread operator can be used to pass an array as individual arguments to a function.

```js

function multiply(x, y, z) {
  return x * y * z;
}

const numbers = [2, 3, 4];
console.log(multiply(...numbers)); // 24

```


- Example 3: Object Expansion
- The spread operator can be used to create a new object by copying properties from an existing object.

```js
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3, d: 4 };
console.log(obj2); // { a: 1, b: 2, c: 3, d: 4 }
```

