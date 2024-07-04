## reduce pollyfill
- The reduce method can be very handy for summing up numbers, consolidating an array of objects into a single object, or even combining elements through concatenation.
- Definition: is to return the all the elements in an array as a single value.

- Syntax

```js
arr.reduce(callback( accumulator, currentValue, currentIndex, array ), initialValue)
```


_____________________________

```js
Array.prototype.myReduce = function (callback, initialValue) {
  var accumulator = initialValue; // In our case the variable is 0

  // What if intial value is not provided
  // then accumulator takes first element in array as initial value
  // current value is second element in the array.

  for (let i = 0; i < this.length; i++) {
    accumulator = accumulator
      ? callback(accumulator, this[i], i, this)
      : this[i];
  }
  return accumulator;
};


const arr = [2, 3, 4];
const reduceArr = arr.myReduce(
  (accumulator, currentValue) => accumulator + currentValue,0);

console.log(reduceArr); //9
```

**OR**

```js
Array.prototype.myReduce = function (callback, initialValue) {
  var accumulator = initialValue;

  // Determine the starting index based on whether initialValue is provided
  var i = initialValue !== undefined ? 0 : 1;

  // If initialValue is not provided, use the first element of the array as the accumulator
  if (initialValue === undefined && this.length > 0) {
    accumulator = this[0];
  }

  // Iterate over the array starting from the current index
  for (; i < this.length; i++) {
    // Apply the callback function to the accumulator and the current array element
    accumulator = callback(accumulator, this[i], i, this);
  }

  // Return the accumulated result
  return accumulator;
};
```

____________

```js
if (!Array.prototype.myReduce) {
  Array.prototype.myReduce = function (callback, initialValue) {
    // Ensure callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    let accumulator = initialValue;
    let startIndex = 0;

    // If initialValue is not provided, use the first element as the initial value
    if (accumulator === undefined) {
      if (this.length === 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      accumulator = this[0];
      startIndex = 1;
    }

    // Iterate over the array
    for (let i = startIndex; i < this.length; i++) {
      accumulator = callback(accumulator, this[i], i, this);
    }

    return accumulator;
  };
}

// Example usage:
let arr = [1, 2, 3, 4];

let sum = arr.myReduce((acc, val) => acc + val);

console.log(sum); // Output: 10
```


