## Find the maximum consecutive ones in the array

```js
/**
 * Function to find the maximum number of consecutive ones in a binary array
 * @param {number[]} nums - The binary array (only contains 0s and 1s)
 * @return {number} - The maximum number of consecutive ones
 */
function findMaxConsecutiveOnes(nums) {
    // Initialize variables to keep track of the maximum count of consecutive ones
    // and the current count of consecutive ones.
    let maxCount = 0;
    let currentCount = 0;

    // Iterate through each element in the array.
    for (let i = 0; i < nums.length; i++) {
        // If the current element is 1, increment the current count.
        if (nums[i] === 1) {
            currentCount++;
            // Update the maximum count if the current count is greater.
            maxCount = Math.max(maxCount, currentCount);
        } else {
            // If the current element is not 1, reset the current count.
            currentCount = 0;
        }
    }

    // Return the maximum count of consecutive ones.
    return maxCount;
}

// Example usage:
const binaryArray = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1];
const maxConsecutiveOnes = findMaxConsecutiveOnes(binaryArray);
console.log(maxConsecutiveOnes); // Output: 4
```
