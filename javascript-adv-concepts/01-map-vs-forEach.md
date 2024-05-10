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
_______________________


**More examples of both map and foreach**

- Usecase scenarios

1) Transforming Data Structure
- Transform an array of objects into an array of different structures (like converting an array of user objects into an array of user names).

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// Create an array of user names.
const userNames = users.map(user => user.name);

console.log(userNames); // Output: [ 'Alice', 'Bob', 'Charlie' ]
```

2) 

- Creating Derived Values
- Generate derived values from existing data, such as calculating square roots or ages from birth years.

```js

const years = [2000, 1999, 1997];

// Calculate current age from birth years.
const ages = years.map(year => new Date().getFullYear() - year);

console.log(ages); // Output will vary depending on the current year.

//(3) [24, 25, 27]

```





3)Mapping IDs to Objects
- Retrieve objects based on a related field or value, like mapping product IDs to product objects.


```js
const productIDs = [1, 2, 3];
const products = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Phone' },
  { id: 3, name: 'Tablet' },
];

// Get product objects from product IDs.
const matchedProducts = productIDs.map(id => products.find(product => product.id === id));

console.log(matchedProducts);
// Output:
// [
//   { id: 1, name: 'Laptop' },
//   { id: 2, name: 'Phone' },
//   { id: 3, name: 'Tablet' }
// ]
```


_________________



**.forEach Use Cases**

1) Performing Side Effects
- Logging, updating an external store, or modifying variables outside the loop.
- Example:

```js
const groceries = ['apples', 'bananas', 'milk'];

// Log each grocery item.
groceries.forEach(item => console.log(`Don't forget to buy ${item}`));
// Output:
// Don't forget to buy apples
// Don't forget to buy bananas
// Don't forget to buy milk
```

2) Mutating Elements in Place
- When modifying the elements directly within the array.


```js
const fruits = ['apple', 'banana', 'cherry'];

// Capitalize all fruit names.
fruits.forEach((fruit, index, array) => {
  array[index] = fruit.toUpperCase();
});

console.log(fruits); // Output: [ 'APPLE', 'BANANA', 'CHERRY' ]
```

3) Accumulating Results in an External Variable

```js
const scores = [80, 90, 70, 85, 95];
let sum = 0;

// Calculate the sum of scores.
scores.forEach(score => sum += score);

console.log(sum); // Output: 420

```


- Use .map when you want to transform an array and return a new one.
- Use .forEach when you want to apply side effects without needing a return value.


