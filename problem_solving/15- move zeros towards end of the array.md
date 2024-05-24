## move zeros towards end of the array

- let arr = [1, 2, 0, 0, 3,0,9,9,8,0,9,0,9];


```js
function moveZerosToEnd(arr) {
  let n = arr.length;
  let count = 0;  // Count of non-zero elements

  // Traverse the array. If the element is non-zero, then move it to the front.
  for (let i = 0; i < n; i++) {
    if (arr[i] !== 0) {
      arr[count++] = arr[i];
    }
  }

  // Now all non-zero elements have been shifted to the front and 'count' is set to the index of the first 0.
  // Make all elements from count to end as 0.
  while (count < n) {
    arr[count++] = 0;
  }

  return arr;
}

let arr = [1, 2, 0, 0, 3, 0, 9, 9, 8, 0, 9, 0, 9];
console.log(moveZerosToEnd(arr));  // Output: [
  0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
  0
]
```



**Aneother approach**


```js


function moveZerosToEnd(arr) {
  let nonZeroArray = [];
  let zeroArray = [];

  // Traverse the array and separate non-zero and zero elements
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      zeroArray.push(arr[i]);
    } else {
      nonZeroArray.push(arr[i]);
    }
  }

  // Concatenate non-zero elements with zero elements
  return nonZeroArray.concat(zeroArray);
}

let arr = [1, 2, 0,0,3];
console.log(moveZerosToEnd(arr));  // Output: [1, 2, 3, 0, 0]



```



















