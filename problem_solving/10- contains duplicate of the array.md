## if Array Contains duplicate return true 


- Brutforce solution

```js
function containsDuplicate(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                return true; // Found a duplicate
            }
        }
    }
    return false; // No duplicates found
}

// Example usage
console.log(containsDuplicate([1, 2, 3, 1]));  // Output: true
console.log(containsDuplicate([1, 2, 3]));     // Output: false

```


```js
function containsDuplicate(arr) {
    const map = new Map();  // Step 1: Initialize a Map

    for (const element of arr) {  // Step 2: Iterate over the array
        if (map.has(element)) {  // Step 3: Check for the element in the Map
            return true;  // There's a duplicate
        }
        map.set(element, true);  // Step 4: Add element to the Map
    }

    return false;  // Step 5: No duplicates found
}

// Testing the function
console.log(containsDuplicate([1, 2, 3, 1]));  // Output: true
console.log(containsDuplicate([1, 2, 3, 4]));  // Output: false

```
- optimized solution

```js
function containsDuplicate(arr) {
  const set = new Set(arr);

return set.size !== arr.length;
}

console.log(containsDuplicate([1, 2, 3]));
```
