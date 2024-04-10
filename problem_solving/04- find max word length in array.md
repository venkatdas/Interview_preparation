## Find max word length in array

**Approach Taken**

- Initializing maxLength: A variable maxLength is initialized to 0 to keep track of the longest word length found so far.

- Looping Through Array: A for loop iterates through each element in the array.

- Comparing Lengths: Inside the loop, it checks if the current word's length (arr[i].length) is greater than the maxLength found so far. If it is, maxLength is updated to this new value.

- Returning maxLength: After the loop has checked all words, the function returns maxLength, which now holds the length of the longest word in the array.

```js
function maxWordLength(arr) {
  let maxLength = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > maxLength) {
      maxLength = arr[i].length;
    }
    
  }
  return maxLength;
}

console.log(maxWordLength(["hello", "world", "JavaScript", "coding"]));
```


__________________

```js
function maximumWordLength(arr) {
  return Math.max(...arr.map((word) => word.length));
}

console.log(maximumWordLength(["hello", "world", "JavaScript"]));
```
