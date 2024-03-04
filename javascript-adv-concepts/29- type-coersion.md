### Type Coersion

- Type coercion happens when we **have double equal to (==),** so this simply means compare two values if both are of different type,
- coerce one into the same type
- Two types of conversions are there
  **1) ImPlicit Conversion**


- Implicit coercion occurs when JavaScript automatically converts one data type into another.
- This conversion happens behind the scenes when you perform operations on values of different types.

**2) Explict coersion**

-Explicit coercion, on the other hand, is when you manually convert values from one type to another using JavaScript's built-in functions or constructs.

- 
Equality tabel : https://dorey.github.io/JavaScript-Equality-Table/


Examples:

Implict coersion


```js

console.log('10' + 5); // "105" - Number 5 is concatenated as a string "5" to "10"

console.log('5' - 2); // 3 - String "5" is converted to number 5 before subtraction

 console.log(true + 1); // 2 - true is treated as 1, so 1 + 1 = 2

console.log('6' * '2'); // 12 - Both strings are converted to numbers before multiplication
console.log('text' / 2); // NaN - "text" cannot be converted to a number
console.log('10' == 10); // true - String "10" is converted to number 10 before comparison
```

Explicit coersion

```js
console.log(Number('123')); // 123 - Explicitly converts string "123" to number 123
console.log(String(123)); // "123" - Converts number 123 to string "123"
console.log(String(true)); // "true" - Converts boolean true to string "true"
console.log([1, 2, 3].toString()); // "1,2,3" - Converts array to a comma-separated string
console.log(+'100'); // 100 - Unary plus converts string "100" to number 100
console.log(Boolean('hello')); // true - Non-empty strings are truthy
console.log(parseInt('123px')); // 123 - Parses number 123 from the beginning of the string
console.log(parseInt("123")); // 123
console.log(parseFloat("123.45")); // 123.45
console.log("true" === "true"); // true

console.log(JSON.parse('{"name":"John", "age":30}')); // { name: 'John', age: 30 }

console.log(Boolean("false")); // true (because it's a non-empty string)
console.log(Boolean("")); // false
```
