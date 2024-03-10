## Destructuring Arrays and Objects


- JavaScript has a powerful feature called Destructuring that allows extracting and assigning values from objects and arrays into variables in a very concise and readable way.


- **Arrays**

- When destructuring arrays, square brackets are used to specify the variables to be filled with the array values.
- The order of the variables corresponds to the order of the values in the array.

```js
const numbers = [1, 2, 3, 4, 5];

const [first, second, ...rest] = numbers;

console.log(first); // Output: 1
console.log(second); // Output: 2
console.log(rest); // Output: [3, 4, 5]
```

- **Objects**

```js
const person = {
  names: "Paul Knulst",
  role: "Tech Lead",
  address: {
    street: "Blogstreet",
    city: "Anytown",
    country: "Germany",
  },
};

const {
  names,
  role,
  address: { city, ...address },
} = person;

console.log(names); // Output: Paul Knulst
console.log(role); // Output: Tech Lead
console.log(city); // Output: Anytown
console.log(address); // {street: 'Blogstreet', country: 'Germany'}
```
