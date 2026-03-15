# JavaScript Classes — Complete Guide

## Why Classes Exist

Without classes, creating multiple similar objects is repetitive:

```javascript
// Without class — repetitive
const user1 = { name: "Ram", age: 20 };
const user2 = { name: "Sam", age: 25 };

// With class — clean and reusable
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
const user1 = new User("Ram", 20);
const user2 = new User("Sam", 25);
```

A class is a **template/blueprint to create objects**. Instead of writing the same properties and methods repeatedly, you define them once and reuse it.

---

## Why Your Original Code Didn't Work

```javascript
// ❌ WRONG
class name {
  console.log("das"); // statements are not allowed directly in a class body
}
```

A class body **only accepts method definitions and field declarations**, not arbitrary statements like `console.log(...)`.

### How to Fix It

```javascript
// ✅ Run code on instantiation — use constructor
class Name {
  constructor() {
    console.log("das");
  }
}
const obj = new Name(); // prints "das"

// ✅ Run code via a method
class Name {
  greet() {
    console.log("das");
  }
}
const obj = new Name();
obj.greet(); // prints "das"

// ✅ Just log directly — no class needed
console.log("das");
```

> **Convention:** Class names should always be **capitalized** (`Name`, not `name`).

---

## Ways to Define a Class

### 1. Class Declaration
```javascript
class User {
  constructor(name) {
    this.name = name;
  }
}
```

### 2. Class Expression (Anonymous)
```javascript
const User = class {
  constructor(name) {
    this.name = name;
  }
};
```

### 3. Class Expression (Named)
```javascript
const User = class MyUser {
  constructor(name) {
    this.name = name;
  }
};
```

All three work the same way. **Class declaration is the most common.**

---

## What a Class Can Contain

### 1. Constructor
Sets up initial data when an object is created.

```javascript
constructor(name) {
  this.name = name;
}
```

### 2. Instance Methods
Functions available on every object created from the class.

```javascript
greet() {
  console.log("Hi " + this.name);
}
```

### 3. Instance Fields
Properties with default values, defined directly without constructor.

```javascript
class User {
  score = 0; // every user starts with score 0
}
```

### 4. Static Methods
Belong to the class itself, not to individual objects.

```javascript
static describe() {
  console.log("This is a User class");
}
User.describe(); // called on class, not on an object
```

### 5. Static Fields
A shared value across all objects, belonging to the class.

```javascript
static count = 0;
```

### 6. Getters & Setters
Control how properties are read or written.

```javascript
get upperName() {
  return this.name.toUpperCase();
}
```

---

## The Constructor — In Depth

The constructor is a **special method that runs automatically** the moment you use `new`.

```javascript
class User {
  constructor(name) {
    console.log("constructor ran!");
    this.name = name;
  }
}

const u = new User("Ram");
// instantly prints: "constructor ran!"
// u.name is now "Ram"
```

> There can only be **one constructor per class**. Writing two will throw an error.

### What is `this`?

`this` refers to the **specific object being created**. It lets each object hold its own data independently.

```javascript
car1.brand // "Toyota"
car2.brand // "BMW"  ← same class, different data
```

---

## What If You Don't Write a Constructor?

JavaScript **automatically adds an empty one** behind the scenes:

```javascript
// What you write
class Car {
  drive() {
    console.log("driving!");
  }
}

// What JavaScript sees internally
class Car {
  constructor() {} // ← added silently, does nothing

  drive() {
    console.log("driving!");
  }
}
```

Your class still works and objects still get created — they just won't have any custom data set up.

```javascript
class Dog {
  bark() {
    console.log("Woof!");
  }
}

const d = new Dog(); // works fine, no error
d.bark();            // Woof!
d.name;              // undefined — nobody set it
```

### When Do You Need to Write a Constructor?

| Situation | Need Constructor? |
|---|---|
| No data to pass in | ❌ No — JS adds an empty one |
| Want to pass data into the object | ✅ Yes — write your own |

---

## Full Example — Everything Together

```javascript
class User {
  // Instance field
  score = 0;

  // Static field
  static count = 0;

  // Constructor
  constructor(name, age) {
    this.name = name;
    this.age = age;
    User.count++;
  }

  // Instance method
  greet() {
    console.log(`Hi, I am ${this.name}`);
  }

  // Static method
  static describe() {
    console.log("I am the User class");
  }

  // Getter
  get info() {
    return `${this.name}, age ${this.age}`;
  }
}

const u1 = new User("Ram", 20);
const u2 = new User("Sam", 25);

u1.greet();             // Hi, I am Ram
console.log(u1.info);   // Ram, age 20
console.log(u1.score);  // 0
User.describe();        // I am the User class
console.log(User.count);// 2
```

---

## Mental Model — Analogies

| Term | Analogy |
|---|---|
| Class | A house blueprint |
| Constructor | The part that sets the address and size when built |
| Object (`new`) | The actual house built from the blueprint |
| Instance Method | Things the house can "do" (e.g. `openDoor`) |
| Static Method | Something the blueprint itself tracks (e.g. total houses built) |

---

## How to Run / Use a Class

To use a class, you **instantiate it** using the `new` keyword.

```javascript
class Name {
  constructor() {
    console.log("das");
  }
}

// Instantiate the class
const obj = new Name();  // prints: das
```

The moment you write `new Name()`, JavaScript automatically calls the constructor and runs whatever is inside it.

### What's Happening Step by Step

```javascript
const obj = new Name();
//    ↑         ↑
//    │         └── calls the class and triggers constructor
//    └── stores the created object
```

1. `new Name()` — creates a new object from the `Name` class
2. Constructor runs **automatically** — prints `"das"`
3. The new object gets stored in `obj`

### Checking the Object

```javascript
console.log(obj);        // Name {}  ← an instance of Name
console.log(typeof obj); // "object"
```

### Passing Data While Instantiating

```javascript
class Name {
  constructor(message) {
    console.log(message);
  }
}

const obj1 = new Name("das");    // prints: das
const obj2 = new Name("hello");  // prints: hello
```

> You can create as many instances as you want from the same class — each one is independent.

---

## Class Inheritance — `extends`

One class can **inherit** from another using `extends`. The child class gets all the properties and methods of the parent.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks!`);
  }
}

const d = new Dog("Bruno");
d.speak(); // Bruno barks!
```

### `super` — Calling the Parent

`super()` calls the parent's constructor. You **must** call `super()` in a child constructor before using `this`.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);        // calls Animal's constructor
    this.breed = breed; // then adds its own property
  }
}

const d = new Dog("Bruno", "Labrador");
console.log(d.name);  // Bruno
console.log(d.breed); // Labrador
```

---

## Private Fields & Methods

Fields or methods prefixed with `#` are **private** — they can only be accessed inside the class.

```javascript
class BankAccount {
  #balance = 0; // private field

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.getBalance()); // 100
console.log(acc.#balance);     // ❌ SyntaxError — private field
```

---

## `instanceof` — Check if Object Belongs to a Class

```javascript
class Car {}
const c = new Car();

console.log(c instanceof Car); // true
console.log(c instanceof Car); // true
```

---

## How to Run / Use a Class

To use a class, you **instantiate it** using the `new` keyword.

```javascript
class Name {
  constructor() {
    console.log("das");
  }
}

// Instantiate the class
const obj = new Name();  // prints: das
```

The moment you write `new Name()`, JavaScript automatically calls the constructor and runs whatever is inside it.

### What's Happening Step by Step

```javascript
const obj = new Name();
//    ↑         ↑
//    │         └── calls the class and triggers constructor
//    └── stores the created object
```

1. `new Name()` — creates a new object from the `Name` class
2. Constructor runs **automatically** — prints `"das"`
3. The new object gets stored in `obj`

### Checking the Object

```javascript
console.log(obj);        // Name {}  ← an instance of Name
console.log(typeof obj); // "object"
```

### Passing Arguments on Instantiation

If your constructor accepts arguments, pass them inside `new`:

```javascript
class Name {
  constructor(message) {
    console.log(message);
  }
}

const obj1 = new Name("das");    // prints: das
const obj2 = new Name("hello");  // prints: hello
```

> You can create as many instances as you want from the same class — each one is independent.

---

## Inheritance — Extending a Class

A class can **inherit** from another class using `extends`. This lets you reuse logic and add on top of it.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks!`);
  }
}

const d = new Dog("Bruno");
d.speak(); // Bruno barks!
```

### `super` — Calling the Parent Constructor

When you extend a class and write your own constructor, you **must** call `super()` first.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // ← calls Animal's constructor first
    this.breed = breed;
  }
}

const d = new Dog("Bruno", "Labrador");
console.log(d.name);  // Bruno
console.log(d.breed); // Labrador
```

---

## Private Fields & Methods

You can make fields or methods **private** (accessible only inside the class) using `#`.

```javascript
class BankAccount {
  #balance = 0;  // private field

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.getBalance()); // 100
console.log(acc.#balance);     // ❌ Error — private field
```

---

## Quick Reference Summary

| Part | What it does | Called on |
|---|---|---|
| `constructor` | Sets up object data | Automatically on `new` |
| Instance method | Behavior for each object | Object — `u1.greet()` |
| Instance field | Default value per object | Object — `u1.score` |
| Static method | Utility for the class itself | Class — `User.describe()` |
| Static field | Shared value across all objects | Class — `User.count` |
| Getter | Read a computed property | Object — `u1.info` |
