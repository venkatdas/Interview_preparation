## Array.find()

```js
//synatx
arr.find(callback(element[, index[, array]])[, thisArg])
//element: current being processed in the array
```

- The find method returns the first element in the array that satisfies the provided testing function.
- If no values satisfy the testing function, undefined is returned.

______________________


Approach

- Check if Array.prototype.find is already defined. If it is, there's no need to add a polyfill.
- Define the polyfill function. It should take a callback function as an argument.
- This callback function is applied to each element of the array until the callback returns true.
- If the callback function returns true for an element, return that element. If the array is exhausted without finding such an element, return undefined.

```js

if (!Array.prototype.find) {
  Array.prototype.find = function(callback) {
    // Loop through the array
    for (var i = 0; i < this.length; i++) {
      // Check if the callback returns true for the current element
      if (callback(this[i], i, this)) {
        // If true, return the current element
        return this[i];
      }
    }
    // If no element satisfies the condition, return undefined
    return undefined;
  };
}

```

ex

```js

const arr = [3, 6, 9];

const resulttt = arr.myFind((num) => num > 4);
console.log(resulttt); //6


const resulttt = arr.myFind((num) => num >23);
console.log(resulttt); // undefined
```



