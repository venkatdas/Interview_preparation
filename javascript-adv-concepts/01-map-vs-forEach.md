### map vs forEach

#### map

- Iterates through the elements in an array.
- "Maps" each element to a new element by calling the function on each element, creating a new array as a result.


```javascript

const a = [1, 2, 3];
const doubled = a.map((num) => {
  return num * 2;
});

// doubled = [2, 4, 6]
```

#### forEach


- Iterates through the elements in an array.
- Executes a callback for each element
- Does not return a value.
- When you need to apply a function to each element of an array but do not need to create a new array with the results.

Example 1) 

```javascript
const a = [1, 2, 3];
const doubled = a.forEach((num, index) => {
  // Do something with num and/or index.
});

// doubled = undefined
```

Example 2) 

```javascript

const users = [{name: 'Alice'}, {name: 'Bob'}, {name: 'Charlie'}];
users.forEach(user => console.log(user.name));
// Output:
// Alice
// Bob
// Charlie

```

Example 3)

```javascript

let numbers = [1, 2, 3, 4];
// Iterate over each element in the numbers array
numbers.forEach((number, index, arr) => {
    // Mutate the original array at the current index
    arr[index] = number * 2;
});
console.log(numbers); // [2, 4, 6, 8]
```
- The example you've provided illustrates an important nuance about forEach: while it is true that forEach itself does not return a new array, it can be used to mutate the original array in-place. This is an important distinction to make.
  
- In your example, forEach is used to iterate over the numbers array, and for each element, it doubles the value of that element. This is done by directly modifying the original array (arr[index] = number * 2). After the forEach operation completes, the original numbers array has been changed to [2, 4, 6, 8].
  
- **This use case highlights the flexibility of forEach for scenarios where you want to apply a function to each element of an array and are fine with or intend to modify the original array directly. It's a good example of a scenario where you might choose forEach over map, especially if creating a new array is not necessary or desired**

Example 4)

```javascript 

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

let names = []; // Initialize an empty array
users.forEach(user => {
  names.push(user.name); // Push each user's name into the names array
});

console.log(names); // Output: ['Alice', 'Bob', 'Charlie']
```

- this example, forEach iterates over each object in the users array, and for each iteration, the user's name is extracted and pushed into the names array. This manual process accomplishes the same goal as using map, but map is more concise and directly returns the new array, which is why it's often preferred for such transformations.
