## Object.seal vs object.freeze

- In JavaScript, both Object.seal() and Object.freeze() are methods used to control the mutability of objects,
- but they provide different levels of immutability and protection.


**Object.seal():**
- When you seal an object using Object.seal(), you prevent new properties from being added to it and prevent existing properties from being removed. However, you can still modify the values of existing properties.
- Essentially, sealing an object means you can't add or delete properties, but you can modify the existing ones.

```js
const person = { name: "John", age: 30 };

Object.seal(person);

person.age = 31; // Modifying an existing property is allowed
console.log(person); // Output: { name: "John", age: 31 }

person.city = "New York"; // Adding new properties is not allowed
console.log(person); // Output: { name: "John", age: 31 }

delete person.name; // Removing existing properties is not allowed
console.log(person); // Output: { name: "John", age: 31 }

console.log(Object.isSealed(person)); // Output: true
```

**Object.freeze():**
- Freezing an object with Object.freeze() goes a step further.
- It not only prevents adding or deleting properties but also prevents the values of existing properties from being changed.
- In other words, the object becomes completely immutable.
- The Object.isFrozen() method can be used to check if an object is frozen.


```js
const person = { name: "John", age: 30 };

Object.freeze(person);

person.age = 31; // Modifying properties is not allowed
console.log(person); // Output: { name: "John", age: 30 }

person.city = "New York"; // Adding new properties is not allowed
console.log(person); // Output: { name: "John", age: 30 }

delete person.name; // Removing properties is not allowed
console.log(person); // Output: { name: "John", age: 30 }

console.log(Object.isFrozen(person)); // Output: true

```


**Key differences:**

- Object.seal() allows modification of existing properties, but does not permit addition or deletion of properties. Object.freeze(), on the other hand, prevents any modifications, additions, or deletions to properties.

- Object.seal() creates a “sealed” object, while Object.freeze() creates a “frozen” object.
- Sealed objects are still mutable, whereas frozen objects are completely immutable.
- Both methods return the modified object itself.
- Object.seal() allows checking if an object is sealed using Object.isSealed(), and Object.freeze() allows checking if an object is frozen using Object.isFrozen().


















