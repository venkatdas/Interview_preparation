# OOP Basics Guide - From Zero to Hero

## Part 1: What is a `function`?

A function is a **box that does something when you call it**.

```javascript
function greet() {
  console.log("Hello");
}

greet(); // Output: Hello
```

- `function greet()` = creating the box
- `greet()` = using the box

**That's it.** A function is just a reusable box.

---

## Part 2: What is a `method`?

A **method** is just a function **inside an object or class**.

```javascript
const person = {
  sayHi: function() {
    console.log("Hi");
  }
};

person.sayHi(); // Output: Hi
```

- `sayHi` is a **method** (because it's inside `person`)
- It's still a function, just with a fancy name

**Rule:**
- Function alone = **function**
- Function inside object/class = **method**

---

## Part 3: What is a `class`?

A class is a **template** (like a cookie cutter).

```javascript
class User {
  sayHi() {
    console.log("Hi");
  }
}
```

**This does NOTHING yet.**

It's just a plan that says:
> "When someone makes a User, it will have a `sayHi` method."

---

## Part 4: What is `new`?

`new` means: **"Make a real object from this class"**

```javascript
const u = new User();
```

What happens here? 3 steps automatically:

1. JavaScript creates an empty object `{}`
2. It connects this object to the `User` class
3. It runs the `constructor` (we'll explain this soon)

Now `u` is a **real object** based on the `User` class.

---

## Part 5: Using the object

```javascript
class User {
  sayHi() {
    console.log("Hi");
  }
}

const u = new User();
u.sayHi(); // Output: Hi
```

Step by step:
1. `class User` = blueprint
2. `const u = new User()` = create real object
3. `u.sayHi()` = use the method

---

## Part 6: What is `constructor`?

A **constructor** is a special method that runs **automatically** when you use `new`.

```javascript
class User {
  constructor() {
    console.log("A user was created!");
  }
}

const u = new User();
// Output: A user was created!
```

**When does it run?**
👉 When you write `new User()`, JavaScript **automatically calls `constructor()`**.

---

## Part 7: Constructor with data

You can pass data to the constructor:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
  
  sayHi() {
    console.log("Hi, I'm " + this.name);
  }
}

const u = new User("Alice");
u.sayHi(); // Output: Hi, I'm Alice
```

What happened?
1. `new User("Alice")` creates object
2. `constructor(name)` runs automatically
3. `this.name = name` stores "Alice" inside the object
4. `u.sayHi()` uses that stored name

---

## Part 8: Understanding `this`

### What is `this`?

`this` means **"the current object"**.

When you write `this.name`, you mean **"the name property of THIS specific object"**.

### Example to understand

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
}

const u1 = new User("Alice");
const u2 = new User("Bob");
```

What happens?

#### When creating `u1`:
1. JavaScript creates empty object `{}`
2. Runs `constructor("Alice")`
3. Inside constructor, `this` points to **that specific object** (u1)
4. `this.name = name` means: "Put 'Alice' inside **this object's** name property"
5. Result: `u1 = { name: "Alice" }`

#### When creating `u2`:
1. JavaScript creates **another** empty object `{}`
2. Runs `constructor("Bob")`
3. Inside constructor, `this` points to **that specific object** (u2)
4. `this.name = name` means: "Put 'Bob' inside **this object's** name property"
5. Result: `u2 = { name: "Bob" }`

### Visual representation

```javascript
class User {
  constructor(name) {
    this.name = name;
    // 👆 "this" = the object being created right now
  }
}

const u1 = new User("Alice");
// When creating u1, "this" points to u1
// So: u1.name = "Alice"

const u2 = new User("Bob");
// When creating u2, "this" points to u2
// So: u2.name = "Bob"

console.log(u1.name); // Alice
console.log(u2.name); // Bob
```

### Another example with methods

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
  
  sayHi() {
    console.log("Hi, I'm " + this.name);
    //                       👆 "this" = the object that called this method
  }
}

const u1 = new User("Alice");
const u2 = new User("Bob");

u1.sayHi(); // Output: Hi, I'm Alice
// When u1 calls sayHi(), "this" points to u1

u2.sayHi(); // Output: Hi, I'm Bob
// When u2 calls sayHi(), "this" points to u2
```

### Simple rule

**`this` always points to the object that is currently using the code.**

| Code | `this` points to |
|------|------------------|
| `const u1 = new User("Alice")` | The new object being created (u1) |
| `u1.sayHi()` | The object that called the method (u1) |
| `u2.sayHi()` | The object that called the method (u2) |

### Why do we need `this`?

Without `this`, you couldn't store data inside the object:

```javascript
class User {
  constructor(name) {
    // ❌ This won't work - where does "name" go?
    name = name; // Just a local variable, lost after constructor ends
  }
}
```

With `this`:

```javascript
class User {
  constructor(name) {
    // ✅ This works - stores "name" INSIDE the object
    this.name = name;
  }
}

const u = new User("Alice");
console.log(u.name); // Alice (still there!)
```

---

## Summary Tables

### Code Meanings

| Code | Meaning |
|------|---------|
| `function greet() {}` | A reusable box of code |
| `object.method()` | A function inside an object |
| `class User {}` | A blueprint/template |
| `constructor()` | Special method that runs when object is created |
| `new User()` | Create a real object from the class |
| `const n = new User()` | Create object and store it in `n` |

### Understanding `this`

- `this` = **the current object**
- In constructor: `this` = the object being created
- In method: `this` = the object that called the method
- `this.name = name` means: "Store this value **inside this object**"

---

## Complete Example

```javascript
class User {
  constructor(name, age) {
    this.name = name;  // Store name in this object
    this.age = age;    // Store age in this object
  }
  
  sayHi() {
    console.log("Hi, I'm " + this.name);
  }
  
  getAge() {
    console.log("I'm " + this.age + " years old");
  }
}

// Create two different users
const user1 = new User("Alice", 25);
const user2 = new User("Bob", 30);

// Each user has their own data
user1.sayHi();    // Hi, I'm Alice
user1.getAge();   // I'm 25 years old

user2.sayHi();    // Hi, I'm Bob
user2.getAge();   // I'm 30 years old
```

---

## Key Takeaways

1. **Function** = reusable box of code
2. **Method** = function inside object/class
3. **Class** = blueprint/template
4. **Constructor** = runs automatically when creating object
5. **new** = creates real object from class
6. **this** = the current object
