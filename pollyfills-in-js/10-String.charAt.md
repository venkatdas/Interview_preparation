## String.charAt() polyfill

- The String.prototype.charAt() method in JavaScript is used to return the character at a specified index (position) in a string.
syntax

```js
str.charAt(index)

```

- str: This is the string from which you want to retrieve the character.
- index: An integer between 0 and str.length - 1. Specifies the position of the character to be returned.


__________________


**Approach**

- by default we will consider the param index = 0
- if index is less than 0 or index is greater than or equal to length of string then return ''
- core logic is : return this[index]

_____________________________________

```js
if (!String.prototype.myCharAt) {
  String.prototype.myCharAt = function(index) {
    // The index is expected to be a non-negative integer.
    // If index is not a number, it defaults to 0.
    // If index is out of bounds, return an empty string.
    if (index < 0 || index >= this.length) {
      return '';
    }
    // Return the character at the specified index.
    // Since strings are array-like, this[index] is equivalent to string.charAt(index) in modern environments.
    return this[index];
  };
}
```

- Test cases

```js
const str = 'Hello, world!';
console.log(str.myCharAt(0)); // "H"
console.log(str.myCharAt(7)); // "w"
console.log(str.myCharAt(50)); // ""
console.log(str.myCharAt(-1)); // ""
```

