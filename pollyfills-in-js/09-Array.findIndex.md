## Array.findIndex()


- The findIndex method is a built-in array method in JavaScript that **allows you to find the index of the first element in the array** that satisfies a provided testing function. If no elements in the array satisfy the testing function, it returns -1.
- This method is useful when you need to locate the position of an element in an array based on a condition

```js
//Syntax

const index = array.findIndex(callback(element[, index[, array]])[, thisArg])
```

_________________________


```js


Array.prototype.myFindIndex = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError('"this" is null or undefined');
  }

  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function");
  }
  //Converts this into an object to ensure the method can 
  //handle being called on array-like objects, not just arrays.

  var inputArray = Object(this); // Get the array object
  var inputArrayLength = Number(inputArray.length) || 0;


  for (let i = 0; i < inputArrayLength; i++) {
    if (callback.call(thisArg, this[i], i, inputArray)) {
      return i;
    }
  }
  return -1;
};
```

_____________________

Examples

```js

const strings = ["apple", "banana", "grapefruit", "blueberry"];
const containsBerryIndex = strings.myFindIndex((res)=>res==="apple")
console.log(containsBerryIndex); // Output: 0

_________________________________________________________________________________________



//Example 1
const array23 = [5, 12, 8, 130, 44];
const isLargeNumber = (element) => element > 13;
console.log(array23.myFindIndex(isLargeNumber));
// Expected output: 3, because 130 is at index 3

//Example 2
const numbers = [-3, 8, 9, -5, 7, -2];
const index = numbers.myFindIndex((num) => num < 0);
console.log(index); // Output:  (because -3 is the first negative number and its index is 0)

//Example 3
const people = [
  { name: 'John', age: 15 },
  { name: 'Doe', age: 17 },
  { name: 'Anna', age: 22 },
  { name: 'Mike', age: 19 },
];
const index1 = people.myFindIndex((person) => person.age >= 18);
console.log(index1); // Output: 2 (because Anna is the first adult and her index is 2)

//Example 4
const words = ['apple', 'banana', 'cherry', 'date'];
const index2 = words.myFindIndex((word) => word.length > 5);
console.log(index2); // Output: 1 (because "banana" has a length of 6 and its index is 1)

//Example 5
const library = [
  { title: 'Moby Dick', author: 'Herman Melville' },
  { title: '1984', author: 'George Orwell' },
  { title: 'Brave New World', author: 'Aldous Huxley' },
];
const index3 = library.myFindIndex((book) => book.title === "1984");
console.log(index3); // Output: 1

//Example 6
const words3 = ['apple', 'banana', 'cherry', 'date'];
const index4 = words3.myFindIndex((word) => word === "cherry"); //2
console.log(index4); // Output: 2 (because "cherry" is at its index is 2)
```
