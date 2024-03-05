## Array.concat() polyfill

```js
//syntax
var newArray = oldArray.concat(array2, array3, ..., arrayX)
```

- array2, array3, ..., arrayX: These are the arrays (or values) you want to concatenate with oldArray.
- Each of these can be an array or a single value.
- If you pass a value that is not an array, that value is added directly to the new array.


Example

```js
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = [1, 2, 3];

const combinedArray = array1.concat(array2, array3);
console.log(combinedArray);
// Output: ["a", "b", "c", "d", "e", "f", 1, 2, 3]

```
Approach

- we are passing empty parameters because we will perform operations with arguments
- maintain an result arr so that we will return this at last
- 1st basic for loop will be based on the this.length and result.push(this[i])
- 2nd basic for loop will be based on the arguments.length and arguments[i] can have array formatted values or primitives also
- So, inside the for loop write a if condition to handle Array.isArray(arguments[i]), if yes then perform another for loop based on the arguments[i] variable.length. and push the value in the result final array
- in the else condition directly push the arguments[i]
______________________________________

```js

Array.prototype.myConcat = function () {
  const resultArr = [];
  // start by pushing the current array elements
  for (let i = 0; i < this.length; i++) {
    resultArr.push(this[i]);
  }

  // Iterate over the arguments and append each of them to the result array
  //(ex: arr2, 7, 8) are the arguments

  for (let i = 0; i < arguments.length; i++) {
    const currentArg = arguments[i];

    //check if the currentArg is is an array,push its individual items
    if (Array.isArray(currentArg)) {
      for (let j = 0; j < currentArg.length; j++) {
        resultArr.push(currentArg[j]);
      }
    } else {
      // If it's not an array, push the argument itself to resultArr
      resultArr.push(currentArg);
    }
  }
  // Return the new array without modifying the original arrays or concateneated array
  return resultArr;
};


const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const array3 = [7, 8, 9];

// Use the myConcat method
const result = array1.myConcat(array2, array3, 10, 11);
console.log(result);
// Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

```
