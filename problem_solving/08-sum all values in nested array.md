## Sum the values in the nested array.

- Define a function sumNestedArray that takes an array arr as its argument.
- Initialize a variable sum to 0. This variable will accumulate the sum of all numbers found in the array, including those in nested arrays.
- Iterate over each element in the array using the forEach method.
  - Check if the current element is an array itself using Array.isArray(element).
  - If the current element is an array, recursively call sumNestedArray with this element (the nested array) as the argument. Add the result returned by the recursive call to the sum.
  - If the current element is not an array, it's assumed to be a number. Add this number directly to the sum.
- After iterating through all elements and summing up all numbers, including those in nested arrays, return the sum

```js

function sumNestedValues(arr){

  let sum =0;
  arr.forEach(element => {
    if(Array.isArray(element)){
      // If the element is an array, recursively call this function
      sum = sum + sumNestedValues(element);
    }else
    {
      sum= sum+ element
    }
    
  });
  return sum

}

console.log(sumNestedValues([1,2,[2,3,[4,5,60],[80,90]]])); //247
```

