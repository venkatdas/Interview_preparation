# Constructor Pattern (ES6)

## Definition
The **Constructor Pattern** is a **Creational Design Pattern** that uses a
`constructor` function or class to create and initialize objects.
In ES6, this pattern is implemented using the `class` keyword and the
`constructor()` method.

---

## Logic
1. A `class` acts as a blueprint for creating objects.
2. The `constructor()` method runs automatically when an object is created using the `new` keyword.
3. Inside the constructor, `this` refers to the newly created object.
4. Properties are assigned to the object to initialize its state.
5. Each call to `new` creates a separate instance with its own data.

---

## Code Example (ES6)

```js
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}

const user1 = new User("Das", "Admin");
const user2 = new User("Alex", "Student");

console.log(user1);
console.log(user2);
