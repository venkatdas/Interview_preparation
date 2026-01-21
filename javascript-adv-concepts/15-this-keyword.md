### This keyword

- Ok, so let's start by defining what the this keyword is. In JavaScript, the this keyword always refers to an object. The thing about it is that the object it refers to will vary depending on how and where this is being called.

And there's a few different ways in which you can use the this keyword, so let's see the most common cases and how it behaves in each of them.

- An important comment is that this is not a variable – it's a keyword, so its value can't be changed or reassigned.

## this in global space
- whatever you write outside of the fucntion it will call global scope or top level

`var a=5` // global scope '

`console.log(this) // global object`
In browser's globalObject is window and some other environments it might be a global depending upon the where we are running the this keyword

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/6f4a8ca3-3592-4af8-9278-5491e61cff48)

## this  keyword inside a function
- This keyword referes to an window object inside the function , where as this window object is different from the global window object
- this keyword inside a fucntion will vary depends on the strict and non strict mode of Javascipt
- strict mode means JS follows some rules to run the program

Let's run the program in strict mode 

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/b601f48e-daff-4ea2-98b4-02c93cad1d0f)

We will get the value is undefined
- this inside non-strict mode - (this substitution)
- according to (this keyword substition )

If this keyword is undefined or null and this keyword will be replaced with global object ,  and it will work in the non strict mode.


- The below image is this keyword will run in non strict mode
![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/ae2557ac-c11d-40e4-b623-287019d9e347)


------------

# Complete Guide to `this` Keyword in JavaScript

## Table of Contents
1. [What is `this` Keyword?](#what-is-this)
2. [Behavior of `this`](#behavior)
3. [Uses of `this`](#uses)
4. [`this` in Objects](#this-in-objects)
5. [`this` in Functions](#this-in-functions)
6. [Implicit vs Explicit Binding](#binding)
7. [The Problems with Implicit Binding](#problems)
8. [Solutions: call, apply, bind](#solutions)
9. [Interview Questions](#interview)

---

## What is `this` Keyword? {#what-is-this}

### Simple Definition
`this` is a special keyword in JavaScript that refers to the **context** in which a function is executed.

### Technical Definition
`this` is a **runtime binding** that refers to the object that is currently executing the code. Its value is determined by **how a function is called** (the call-site), not where the function is written.

### Key Principle

```javascript
// this is NOT determined by where function is written
// this IS determined by HOW function is called

function sayName() {
  console.log(this.name);
}

// Same function, different calls = different 'this'
```

### Complete Definition

> In JavaScript, `this` is a reference that is determined by the **execution context**. For regular functions, `this` refers to the object (or value) that is the **context of the function call** - determined by **how** the function is invoked. However, `this` can also be `undefined` (in strict mode), a primitive value (with explicit binding in strict mode), or inherit from the lexical scope (in arrow functions).

---

## Behavior of `this` Keyword {#behavior}

### Core Behaviors

1. **Dynamic Nature** - `this` changes based on execution context
2. **Runtime Binding** - Value determined when function runs, not when written
3. **Context Dependent** - Different rules apply in different situations

```javascript
// Behavior Example
const obj = {
  name: 'Alice',
  greet: function() {
    console.log(this.name);
  }
};

obj.greet(); // "Alice" - this = obj

const greetFunc = obj.greet;
greetFunc(); // undefined - this changed!
```

### `this` in Different Modes

#### Non-Strict Mode
```javascript
function showThis() {
  console.log(this); // Window (browser) or global (Node.js)
}
showThis();
```

#### Strict Mode
```javascript
'use strict';
function showThis() {
  console.log(this); // undefined
}
showThis();
```

---

## Uses of `this` Keyword {#uses}

### Use Case 1: Access Object Properties

```javascript
const user = {
  firstName: 'John',
  lastName: 'Doe',
  getFullName: function() {
    return this.firstName + ' ' + this.lastName;
  }
};

console.log(user.getFullName()); // "John Doe"
```

### Use Case 2: Reusable Methods

```javascript
function introduce() {
  console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old`);
}

const person1 = { name: 'Alice', age: 25, introduce };
const person2 = { name: 'Bob', age: 30, introduce };

person1.introduce(); // "Hi, I'm Alice and I'm 25 years old"
person2.introduce(); // "Hi, I'm Bob and I'm 30 years old"
```

### Use Case 3: Constructor Functions

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person = new Person('Charlie', 28);
console.log(person.name); // "Charlie"
```

### Use Case 4: Event Handlers

```javascript
button.addEventListener('click', function() {
  console.log(this); // refers to the button element
  this.style.backgroundColor = 'blue';
});
```

### Use Case 5: Method Chaining

```javascript
const calculator = {
  value: 0,
  add: function(num) {
    this.value += num;
    return this; // return this for chaining
  },
  multiply: function(num) {
    this.value *= num;
    return this;
  },
  getValue: function() {
    return this.value;
  }
};

calculator.add(5).multiply(2).add(3).getValue(); // 13
```

---

## `this` in Objects {#this-in-objects}

### Basic Usage

When a function is called as a **method** of an object, `this` refers to that object.

```javascript
const person = {
  name: 'David',
  age: 35,
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
    console.log(this); // logs the entire person object
  }
};

person.greet(); 
// "Hello, I'm David"
// {name: 'David', age: 35, greet: ƒ}
```

### Nested Objects

```javascript
const company = {
  name: 'TechCorp',
  employee: {
    name: 'Eve',
    role: 'Developer',
    showInfo: function() {
      console.log(this.name); // "Eve"
      console.log(this.role); // "Developer"
      // 'this' refers to 'employee' object, not 'company'
    }
  }
};

company.employee.showInfo();
```

**Rule:** `this` refers to the object immediately before the dot.

### Context Loss Problem

```javascript
const person = {
  name: 'Frank',
  greet: function() {
    console.log(this.name);
  }
};

person.greet(); // "Frank" - works fine ✅

const greetFunc = person.greet; // assigning to variable
greetFunc(); // undefined - lost context! ❌
// 'this' is now global object (or undefined in strict mode)
```

---

## `this` in Functions {#this-in-functions}

### Case 1: Regular Function Call

```javascript
function showThis() {
  console.log(this);
}

showThis(); // Window object (browser) or global (Node.js)
```

**In Strict Mode:**
```javascript
'use strict';
function showThis() {
  console.log(this);
}

showThis(); // undefined
```

### Case 2: Function Inside a Method

```javascript
const obj = {
  name: 'George',
  outer: function() {
    console.log(this.name); // "George" - this = obj
    
    function inner() {
      console.log(this.name); // undefined - this = global/undefined
    }
    inner();
  }
};

obj.outer();
```

**Why does inner function lose context?**
- `inner()` is called as a regular function, not as a method
- Regular function calls have `this` = global (or undefined in strict mode)

### Case 3: Constructor Functions

```javascript
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
  this.display = function() {
    console.log(`${this.brand} ${this.model}`);
  };
}

const car1 = new Car('Toyota', 'Camry');
car1.display(); // "Toyota Camry"
```

**What happens with `new`:**
1. A new empty object is created
2. `this` is bound to that object
3. The object is linked to the constructor's prototype
4. The function executes with `this` as the new object
5. The new object is returned

### Case 4: Arrow Functions

Arrow functions **don't have their own `this`**. They inherit `this` from the parent scope (lexical scoping).

```javascript
const obj = {
  name: 'Harry',
  regularFunc: function() {
    console.log(this.name); // "Harry"
  },
  arrowFunc: () => {
    console.log(this.name); // undefined (this from outer scope)
  }
};

obj.regularFunc(); // "Harry"
obj.arrowFunc(); // undefined
```

**Practical Use - Solving Nested Function Problem:**

```javascript
const obj = {
  name: 'Ian',
  outer: function() {
    console.log(this.name); // "Ian"
    
    // Regular function - loses context
    function innerRegular() {
      console.log(this.name); // undefined
    }
    innerRegular();
    
    // Arrow function - inherits context
    const innerArrow = () => {
      console.log(this.name); // "Ian" - inherits this from outer
    };
    innerArrow();
  }
};

obj.outer();
```

### Case 5: Class Methods

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  
  // Regular method
  increment() {
    this.count++;
  }
  
  // Arrow function as class field (bound to instance)
  incrementArrow = () => {
    this.count++;
  }
}

const counter = new Counter();

// Regular method loses context
const inc = counter.increment;
inc(); // Error: Cannot read property 'count' of undefined

// Arrow function preserves context
const incArrow = counter.incrementArrow;
incArrow(); // Works! count is incremented
console.log(counter.count); // 1
```

---

## Implicit vs Explicit Binding {#binding}

### Implicit Binding

When `this` is **automatically** determined by how the function is called.

```javascript
const person = {
  name: 'Jack',
  greet: function() {
    console.log(this.name);
  }
};

person.greet(); // "Jack"
// JavaScript IMPLICITLY sets this = person
// Because greet is called as person.greet()
```

**Rules for Implicit Binding:**
- Function is called with dot notation (`obj.method()`)
- `this` automatically refers to the object before the dot

### Explicit Binding

When we **manually** tell JavaScript what `this` should be using `call()`, `apply()`, or `bind()`.

```javascript
const person = {
  name: 'Liam'
};

function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

// EXPLICITLY setting this to person
greet.call(person, 'Hello', '!'); // "Hello, Liam!"
greet.apply(person, ['Hi', '.']); // "Hi, Liam."

const boundGreet = greet.bind(person);
boundGreet('Hey', '?'); // "Hey, Liam?"
```

---

## The Problems with Implicit Binding {#problems}

Implicit binding is fragile and breaks in several common situations.

### Problem 1: Variable Assignment

```javascript
const person = {
  name: 'Alice',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

person.greet(); // "Hello, Alice" ✅

// Assign to variable
const greetFunction = person.greet;
greetFunction(); // "Hello, undefined" ❌

// Why? No object before the function call
// 'this' defaults to global object
```

### Problem 2: Callback Functions

```javascript
const person = {
  name: 'Bob',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

// setTimeout
setTimeout(person.greet, 1000); // "Hello, undefined" ❌

// Event listeners
button.addEventListener('click', person.greet); // 'this' = button element ❌
```

**Why it breaks:**
```javascript
// setTimeout internally does something like:
const func = person.greet; // Assigns function to variable
func(); // Calls without object context
```

### Problem 3: Array Methods with Callbacks

```javascript
const user = {
  name: 'Eve',
  hobbies: ['reading', 'coding', 'gaming'],
  
  showHobbies: function() {
    this.hobbies.forEach(function(hobby) {
      console.log(this.name + ' likes ' + hobby);
      // "undefined likes reading" ❌
      // Inner function loses context
    });
  }
};

user.showHobbies();
```

### Problem 4: Borrowing Methods

```javascript
const person = {
  name: 'Charlie',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

const anotherPerson = {
  name: 'David'
  // Want to use person.greet but for this object
};

// Can't easily use person's method for anotherPerson
person.greet(); // "Hello, Charlie"
// Need: "Hello, David"
```

---

## Solutions: call, apply, bind {#solutions}

These methods exist to **control what `this` refers to** when implicit binding fails.

### Method 1: `call()`

**Purpose:** Invoke a function immediately with a specific `this` value.

**Syntax:** `function.call(thisArg, arg1, arg2, ...)`

#### Solving Problem 1: Variable Assignment

```javascript
const person = {
  name: 'Alice',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

const greetFunction = person.greet;

// Broken:
greetFunction(); // "Hello, undefined" ❌

// Fixed with call:
greetFunction.call(person); // "Hello, Alice" ✅
```

#### Solving Problem 4: Borrowing Methods

```javascript
const person = {
  name: 'Charlie',
  greet: function(greeting) {
    console.log(greeting + ', ' + this.name);
  }
};

const anotherPerson = {
  name: 'David'
};

// Borrow person's method for anotherPerson
person.greet.call(anotherPerson, 'Hello'); // "Hello, David" ✅
```

#### Real-World Example: Array-like Objects

```javascript
// Not a real array
const arrayLike = {
  0: 'apple',
  1: 'banana',
  2: 'orange',
  length: 3
};

// Borrow Array methods
const realArray = Array.prototype.slice.call(arrayLike);
console.log(realArray); // ['apple', 'banana', 'orange']

// Modern alternative
const arr = Array.from(arrayLike);
```

#### Real-World Example: Getting All Arguments

```javascript
function logAllArguments() {
  // 'arguments' is array-like, not a real array
  const args = Array.prototype.slice.call(arguments);
  console.log(args);
}

logAllArguments(1, 2, 3, 4); // [1, 2, 3, 4]

// Modern alternative with spread
function logArgs(...args) {
  console.log(args);
}
```

### Method 2: `apply()`

**Purpose:** Same as `call()`, but arguments passed as an **array**.

**Syntax:** `function.apply(thisArg, [arg1, arg2, ...])`

#### When Arguments Are in an Array

```javascript
const person = {
  name: 'Frank',
  introduce: function(greeting, hobby, city) {
    console.log(`${greeting}, I'm ${this.name}. I like ${hobby} and live in ${city}`);
  }
};

const anotherPerson = { name: 'Grace' };
const args = ['Hi', 'painting', 'Paris'];

// With call - tedious:
person.introduce.call(anotherPerson, args[0], args[1], args[2]);

// With apply - clean:
person.introduce.apply(anotherPerson, args);
// "Hi, I'm Grace. I like painting and live in Paris" ✅
```

#### Real-World Example: Math Operations

```javascript
const numbers = [5, 6, 2, 3, 7, 1, 9];

// Math.max expects separate arguments
// Math.max(numbers) // ❌ Returns NaN

// Solution with apply:
const max = Math.max.apply(null, numbers);
console.log(max); // 9 ✅

const min = Math.min.apply(null, numbers);
console.log(min); // 1 ✅

// Modern alternative with spread:
const max2 = Math.max(...numbers);
const min2 = Math.min(...numbers);
```

#### Difference: call vs apply

```javascript
function sum(a, b, c) {
  return a + b + c;
}

const obj = { name: 'test' };

// call - arguments separately
sum.call(obj, 1, 2, 3); // 6

// apply - arguments as array
sum.apply(obj, [1, 2, 3]); // 6

// Modern - spread with call
const args = [1, 2, 3];
sum.call(obj, ...args); // 6
```

### Method 3: `bind()`

**Purpose:** Creates a **new function** with `this` permanently bound. Doesn't invoke immediately.

**Syntax:** `const newFunc = function.bind(thisArg, arg1, arg2, ...)`

**Key Difference:**
- `call()` and `apply()` execute immediately ⚡
- `bind()` returns a new function for later use 📦

#### Solving Problem 2: setTimeout

```javascript
const person = {
  name: 'Bob',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

// Broken:
setTimeout(person.greet, 1000); // "Hello, undefined" ❌

// Fixed with bind:
setTimeout(person.greet.bind(person), 1000); // "Hello, Bob" ✅
```

#### Solving Problem 2: Event Handlers

```javascript
const counter = {
  count: 0,
  increment: function() {
    this.count++;
    console.log('Count: ' + this.count);
  }
};

const button = document.getElementById('btn');

// Broken:
button.addEventListener('click', counter.increment); // this = button ❌

// Fixed with bind:
button.addEventListener('click', counter.increment.bind(counter)); // ✅
```

#### Solving Problem 3: Array Methods

```javascript
const user = {
  name: 'Eve',
  hobbies: ['reading', 'coding', 'gaming'],
  
  showHobbies: function() {
    // Solution 1: bind
    this.hobbies.forEach(function(hobby) {
      console.log(this.name + ' likes ' + hobby);
    }.bind(this)); // Bind outer 'this' ✅
  }
};

user.showHobbies();
// "Eve likes reading"
// "Eve likes coding"
// "Eve likes gaming"
```

#### Alternative Solution: Arrow Functions

```javascript
const user = {
  name: 'Eve',
  hobbies: ['reading', 'coding', 'gaming'],
  
  showHobbies: function() {
    // Arrow function inherits 'this'
    this.hobbies.forEach((hobby) => {
      console.log(this.name + ' likes ' + hobby);
    });
  }
};

user.showHobbies(); // Works! ✅
```

#### What bind() Actually Does

```javascript
const person = {
  name: 'Test',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

// When you do:
const boundGreet = person.greet.bind(person);

// It's similar to creating:
const boundGreet = function() {
  return person.greet.call(person);
};

// Now 'this' is permanently locked
boundGreet(); // "Hello, Test" ✅
```

#### Partial Application with bind

```javascript
function multiply(a, b) {
  return a * b;
}

// Pre-fill first argument
const double = multiply.bind(null, 2);
console.log(double(5)); // 10 (2 * 5)
console.log(double(10)); // 20 (2 * 10)

const triple = multiply.bind(null, 3);
console.log(triple(5)); // 15 (3 * 5)
```

#### Constructor Inheritance

```javascript
function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  // Call parent constructor with Dog's 'this'
  Animal.call(this, name);
  this.breed = breed;
}

const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.name); // "Buddy"
console.log(dog.breed); // "Golden Retriever"
```

---

## Binding Precedence Rules

When multiple binding rules could apply, here's the order:

1. **`new` binding** (highest priority)
2. **Explicit binding** (`call`, `apply`, `bind`)
3. **Implicit binding** (object method)
4. **Default binding** (global/undefined - lowest priority)
5. **Arrow functions** (ignore all rules, use lexical scope)

```javascript
function test() {
  console.log(this.value);
}

const obj1 = { value: 1, test };
const obj2 = { value: 2 };

// Implicit
obj1.test(); // 1

// Explicit wins over implicit
obj1.test.call(obj2); // 2

// new wins over bind
const boundTest = test.bind(obj1);
const instance = new boundTest(); // undefined (new creates new object)

// Arrow functions ignore all binding
const obj3 = {
  value: 3,
  test: () => console.log(this.value)
};
obj3.test.call(obj2); // undefined (arrow function ignores call)
```

---

## Complete Comparison Table

| Method | Invocation | Arguments | Returns | Use Case |
|--------|------------|-----------|---------|----------|
| **call** | Immediate | Separate | Result | One-time calls with known args |
| **apply** | Immediate | Array | Result | Args already in array |
| **bind** | Returns function | Separate | New function | Callbacks, events, permanent binding |

### Visual Summary

```javascript
const obj = {
  name: 'Test',
  method: function(a, b) {
    console.log(this.name, a, b);
  }
};

// ❌ PROBLEM: Lost context
const func = obj.method;
func(1, 2); // undefined 1 2

// ✅ SOLUTION 1: call (immediate, separate args)
func.call(obj, 1, 2); // "Test" 1 2

// ✅ SOLUTION 2: apply (immediate, array args)
func.apply(obj, [1, 2]); // "Test" 1 2

// ✅ SOLUTION 3: bind (returns function for later)
const boundFunc = func.bind(obj);
boundFunc(1, 2); // "Test" 1 2
setTimeout(boundFunc, 1000, 1, 2); // Works in callbacks!
```

---

## Common Interview Questions {#interview}

### Q1: What's the output?

```javascript
const obj = {
  value: 42,
  getValue: function() {
    return this.value;
  }
};

const getValue = obj.getValue;
console.log(getValue());
```

**Answer:** `undefined` - The function loses its context when assigned to a variable.

### Q2: What's the output?

```javascript
const obj = {
  value: 1,
  nested: {
    value: 2,
    getValue: function() {
      return this.value;
    }
  }
};

console.log(obj.nested.getValue());
```

**Answer:** `2` - `this` refers to the `nested` object (the object immediately before the dot).

### Q3: Fix this code

```javascript
const person = {
  name: 'John',
  friends: ['Alice', 'Bob'],
  printFriends: function() {
    this.friends.forEach(function(friend) {
      console.log(this.name + ' knows ' + friend);
    });
  }
};

person.printFriends(); // undefined knows Alice, undefined knows Bob
```

**Solutions:**

```javascript
// Solution 1: bind
printFriends: function() {
  this.friends.forEach(function(friend) {
    console.log(this.name + ' knows ' + friend);
  }.bind(this));
}

// Solution 2: Arrow function
printFriends: function() {
  this.friends.forEach((friend) => {
    console.log(this.name + ' knows ' + friend);
  });
}

// Solution 3: Store this
printFriends: function() {
  const self = this;
  this.friends.forEach(function(friend) {
    console.log(self.name + ' knows ' + friend);
  });
}

// Solution 4: forEach's thisArg parameter
printFriends: function() {
  this.friends.forEach(function(friend) {
    console.log(this.name + ' knows ' + friend);
  }, this);
}
```

### Q4: Arrow function in object

```javascript
const obj = {
  value: 10,
  method1: function() {
    console.log(this.value);
  },
  method2: () => {
    console.log(this.value);
  }
};

obj.method1();
obj.method2();
```

**Answer:** 
- `method1()` logs `10` - regular function, `this` = obj
- `method2()` logs `undefined` - arrow function inherits `this` from outer scope (global)

### Q5: What happens here?

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function() {
  console.log(this.name);
};

const person = new Person('Alice');
const sayName = person.sayName;

person.sayName(); // ?
sayName(); // ?
```

**Answer:**
- `person.sayName()` logs `"Alice"` - implicit binding to person
- `sayName()` logs `undefined` - lost context, `this` is global/undefined

**Fix:**
```javascript
const boundSayName = person.sayName.bind(person);
boundSayName(); // "Alice"
```

### Q6: Class methods

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    this.count++;
  }
}

const counter = new Counter();
const increment = counter.increment;

counter.increment(); // Works
increment(); // Error!
```

**Why?** Class methods lose context when extracted.

**Fix:**
```javascript
class Counter {
  constructor() {
    this.count = 0;
    // Bind in constructor
    this.increment = this.increment.bind(this);
  }
  
  increment() {
    this.count++;
  }
}

// OR use arrow function
class Counter {
  count = 0;
  
  increment = () => {
    this.count++;
  }
}
```

---

## Key Takeaways

1. **`this` is determined at call-time**, not definition-time (except arrow functions)
2. **Four main rules:** default, implicit, explicit, `new` binding
3. **Arrow functions** inherit `this` from lexical scope
4. **Implicit binding breaks** when functions are assigned or passed as callbacks
5. **Explicit binding** (`call`, `apply`, `bind`) gives you control over `this`
6. **Use `call()`** for immediate invocation with separate arguments
7. **Use `apply()`** for immediate invocation with array arguments
8. **Use `bind()`** for callbacks, event handlers, and creating bound functions
9. **Strict mode** makes default `this` undefined instead of global
10. **Binding precedence:** `new` > explicit > implicit > default

---

## Modern Alternatives

### Instead of bind with arrow functions

```javascript
// Old way
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log(this);
  }
}

// Modern way
class Component {
  handleClick = () => {
    console.log(this);
  }
}
```

### Instead of apply with spread

```javascript
// Old way
Math.max.apply(null, [1, 2, 3, 4, 5]);

// Modern way
Math.max(...[1, 2, 3, 4, 5]);
```

### Instead of call with spread

```javascript
// Old way
func.call(obj, arg1, arg2, arg3);

// Can still use spread if args in array
const args = [arg1, arg2, arg3];
func.call(obj, ...args);
```

---

## Practice Tips

1. Always ask: **"How is this function being called?"**
2. Look for the **dot** - what's before it is usually `this`
3. If no dot, check for **call/apply/bind**
4. If neither, check if it's a **constructor** (`new`)
5. If none of the above, it's **default binding** (global/undefined)
6. **Arrow functions** are the exception - check where they're defined

Remember: Understanding `this` is crucial for mastering JavaScript!

