## two sum

```js
function twoSumBrutforce(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if(arr[i]+arr[j]===target){
        return [i,j]
      }
    }
  }
  return 'no indices found'
}

console.log(twoSumBrutforce([1, 1, 3], 5));
```


**Other Approach**

- Using a two pointer technique


```js
var twoSum = function(nums, target) {
    // Step 1: Create an array of objects to keep track of the original indices
    let numsWithIndex = nums.map((num, index) => ({ num, index }));
    console.log(numsWithIndex);

    // Step 2: Sort the array based on the numbers
    numsWithIndex.sort((a, b) => a.num - b.num);
    console.log(numsWithIndex.sort((a, b) => a.num - b.num));

    // Step 3: Initialize two pointers
    let start = 0;
    let end = numsWithIndex.length - 1;

    // Step 4: Apply the two-pointer approach
    while (start < end) {
        const sum = numsWithIndex[start].num + numsWithIndex[end].num;
        if (sum < target) {
            start++;
        } else if (sum > target) {
            end--;
        } else {
            return [numsWithIndex[start].index, numsWithIndex[end].index];
        }
    }

    return []; // Return an empty array if no solution is found
};

// Example usage:
console.log(twoSum([3, 2, 4], 6)); // Output: [1, 2]
```
