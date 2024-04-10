## find the first pair of numbers whose sum is zero .


- input param accepts array
- define two variables (left and right)
- initialize left with 0 and right with array.length - 1 (it says max)
- perform a while loop (left <right)
- array[left] + array[right] will be stored in sum variable
- if sum ===0 then simply return [array[left], array[right]]
- if sum< 0 , Need a bigger number to get closer to zero, increment left
- else if sum> 0 , Need a smaller number to get closer to zero , decrement right
```js
function findPairWithZeroSum(arr) {
    if (arr.length === 0) {
      return "Array is empty";
    }
     arr.sort((a, b) => a - b);
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === 0) {
      return [arr[left], arr[right]];
    } else if (sum < 0) {
      left++;
    } else {
      right--;
    }
  }
  return 'no pair found that equals zero'
}

console.log(findPairWithZeroSum([5,3,2,6,-1,-2,8,3,2,-2])); // [-2, 2]
```
