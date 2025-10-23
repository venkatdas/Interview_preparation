```js
const person1={
    name:"venkatdas"
}

const person2={
    name:"akshay kumar"
}

const greet={
    name:"virat kohli",
    fullName: function(punctuation){
        console.log(`Hello my full name is ${this.name}${punctuation}`)
    }
}
// greet.fullName.call(person1,"!")

///////////

Function.prototype.myCall= function (obj,...args) {

    if(obj===null|| obj=== undefined){
        obj=globalThis;
    }
    obj= Object(obj)// convert primitive to object
obj.fn=this
obj.fn(...args)
    // console.log(obj.fn)
}
greet.fullName.myCall(person1,"!","Welcome")
```

------------------

- The above code works but there are few pitfalss, 
- not deleting temporary object
- there is a chance to overide the name

---------------

- After modification it becomes like this.

```js
Function.prototype.myCall = function (thisArg, ...args) {
  // Step 1: If thisArg is null or undefined, set it to globalThis
  if (thisArg === null || thisArg === undefined) {
    thisArg = globalThis;
  }

  // Step 2: Convert primitive (like string, number, boolean) to object
  thisArg = Object(thisArg);

  console.log("Before attaching function:", thisArg);

  // Step 3: Attach the function (the one we are calling myCall on)
  // 'this' here refers to the function (like greet.fullName)
  thisArg.fn = this;

  console.log("After attaching function:", thisArg);
  console.log("Function being attached:", thisArg.fn);

  // Step 4: Execute the function using thisArg as its 'this' context
  const result = thisArg.fn(...args);

  console.log("After function call:", thisArg);

  // Step 5: Clean up
  delete thisArg.fn;
  console.log("After deleting temporary function:", thisArg);

  // Step 6: Return the result
  return result;
};
```

----------

- To understand above code we have to know few things
- Let's assume, before deep dive.

```js
function greet() {
  console.log("Hello,", this.name);
}

const person = { name: "Venkatdas" };

greet.myCall(person);
```

- Inside your myCall, at this moment:

- this → the function we’re trying to call (greet)

- thisArg → the object we want as this inside that function (person)

```js
this = greet
thisArg = { name: "Venkatdas" }
```

#### Step 2 — First line: thisArg.fn = this

👉 This means:

`“Add a new property named fn to the thisArg object,
and assign it the value of this (which is the function being called).”`

In plain English:

- “Attach the function temporarily as a method of the object.”

- So after this line executes, memory looks like this:

```js
thisArg = {
  name: "Venkatdas",
  fn: function greet() {
    console.log("Hello,", this.name);
  }
}
```

#### 🧩 Step 3 — Second line: const result = thisArg.fn(...args)

Now, this is the key:
When a function is called as a property of an object, like object.fn(),
JavaScript automatically sets this = object inside that function.
- So here
`thisArg.fn(...args)`
- same as
`person.fn(); // if thisArg = person`
Therefore inside the function is

`this === thisArg`

- ✅ Meaning:

Inside greet, this → { name: "Venkatdas" }

So this.name → "Venkatdas"

That’s why the output becomes:

🧱 Step 4 — Why both lines are needed
Line	Purpose
thisArg.fn = this	Temporarily attaches the function to the object (so we can call it as a method).
thisArg.fn(...args)	Executes that function as a method of the object (so this refers to the object).

If you skip the first line, JavaScript won’t know what object to bind this to.
If you skip the second, you never actually call the function.

#### 🧩 Step 5 — After the call

- After calling it, we delete the temporary property:

`delete thisArg.fn;`


- So the object goes back to its original form:

`{ name: "Venkatdas" }`

------------

### ⚠️ The Problem — Property name conflict

- What if the object already has a property named fn?

```js
const person = {
  name: "Venkatdas",
  fn: "Existing value"
};

function greet() {
  console.log("Hello,", this.name);
}

greet.myCall(person);
```

- When your code runs:

thisArg.fn = this;

you just overwrote the existing property fn: "Existing value"
with your function reference.

Then after deleting it (delete thisArg.fn),
the original value "Existing value" is gone forever ❌.

That’s a side effect — your helper changed the original object’s data.

🧠 The Fix — Use a unique Symbol as the property key

Symbols in JavaScript are unique and hidden property identifiers.

Let’s rewrite your myCall safely using Symbol.

```js
Function.prototype.myCall = function (thisArg, ...args) {
  if (thisArg === null || thisArg === undefined) {
    thisArg = globalThis;
  }

  thisArg = Object(thisArg);

  // Step 1: create a unique key
  const uniqueKey = Symbol('temporaryFunction');

  // Step 2: attach the function to the object using that unique key
  thisArg[uniqueKey] = this;

  // Step 3: call the function
  const result = thisArg[uniqueKey](...args);

  // Step 4: delete the temporary property
  delete thisArg[uniqueKey];

  return result;
};

```

-------------------

# Implementing a Custom `call()` Method in JavaScript

## Understanding the Problem

The `call()` method in JavaScript allows you to invoke a function with a specific `this` context. Let's build our own implementation to understand how it works under the hood.

## Initial Setup

```js
const person1 = {
    name: "venkatdas"
}

const person2 = {
    name: "akshay kumar"
}

const greet = {
    name: "virat kohli",
    fullName: function(punctuation) {
        console.log(`Hello my full name is ${this.name}${punctuation}`)
    }
}

// Native call method
greet.fullName.call(person1, "!")
```

## First Attempt: Basic Implementation

```js
Function.prototype.myCall = function(obj, ...args) {
    if (obj === null || obj === undefined) {
        obj = globalThis;
    }
    
    obj = Object(obj); // Convert primitive to object
    obj.fn = this;     // Attach the function
    obj.fn(...args);   // Execute it
}

greet.fullName.myCall(person1, "!", "Welcome")
```

### ⚠️ Problems with This Approach

1. **Memory leak**: Temporary property `fn` is never deleted
2. **Property collision**: If `obj` already has a property named `fn`, it gets overwritten
3. **No return value**: Function result is not returned

## Improved Implementation

```js
Function.prototype.myCall = function(thisArg, ...args) {
    // Step 1: Handle null/undefined
    if (thisArg === null || thisArg === undefined) {
        thisArg = globalThis;
    }

    // Step 2: Convert primitives to objects
    thisArg = Object(thisArg);

    // Step 3: Attach the function temporarily
    thisArg.fn = this;

    // Step 4: Execute the function
    const result = thisArg.fn(...args);

    // Step 5: Clean up
    delete thisArg.fn;

    // Step 6: Return the result
    return result;
};
```

## How It Works: Step-by-Step

Let's trace through an example:

```js
function greet() {
    console.log("Hello,", this.name);
}

const person = { name: "Venkatdas" };

greet.myCall(person);
```

### Execution Flow

| Step | Code | Memory State |
|------|------|--------------|
| **Initial** | `greet.myCall(person)` | `this = greet`<br>`thisArg = { name: "Venkatdas" }` |
| **1** | `thisArg.fn = this` | `thisArg = { name: "Venkatdas", fn: greet }` |
| **2** | `thisArg.fn()` | Inside `greet`: `this === thisArg` |
| **3** | `delete thisArg.fn` | `thisArg = { name: "Venkatdas" }` |

### Key Insight

```js
thisArg.fn = this;           // Attach function as a method
const result = thisArg.fn(...args);  // Call as method → 'this' binds to thisArg
```

When you call `thisArg.fn()`, JavaScript automatically sets `this` to `thisArg` inside the function. This is how method invocation works!

## The Property Collision Problem

### The Issue

```js
const person = {
    name: "Venkatdas",
    fn: "Existing value"  // ⚠️ This property exists!
};

function greet() {
    console.log("Hello,", this.name);
}

greet.myCall(person);
```

**What happens:**
1. `thisArg.fn = this` overwrites the existing `fn` property
2. `delete thisArg.fn` removes it permanently
3. Original value `"Existing value"` is lost forever ❌

## Final Solution: Using Symbol

Symbols create **unique**, **guaranteed-not-to-conflict** property keys:

```js
Function.prototype.myCall = function(thisArg, ...args) {
    // Handle null/undefined
    if (thisArg === null || thisArg === undefined) {
        thisArg = globalThis;
    }

    // Convert primitives to objects
    thisArg = Object(thisArg);

    // Create a unique key that won't collide
    const uniqueKey = Symbol('temporaryFunction');

    // Attach function using the unique key
    thisArg[uniqueKey] = this;

    // Execute the function
    const result = thisArg[uniqueKey](...args);

    // Clean up
    delete thisArg[uniqueKey];

    return result;
};
```

### Why Symbols?

- **Unique**: Each `Symbol()` creates a brand new identifier
- **Hidden**: Symbols don't show up in `Object.keys()` or `for...in` loops
- **Safe**: Impossible to accidentally collide with existing properties

## Testing the Implementation

```js
const person = {
    name: "Venkatdas",
    fn: "I won't be overwritten!"
};

function introduce() {
    return `Hi, I'm ${this.name}`;
}

const result = introduce.myCall(person);
console.log(result);           // "Hi, I'm Venkatdas"
console.log(person.fn);        // "I won't be overwritten!" ✅
```

## Comparison with Native `call()`

| Feature | Our `myCall` | Native `call()` |
|---------|--------------|-----------------|
| Binding context | ✅ | ✅ |
| Passing arguments | ✅ | ✅ |
| Returning values | ✅ | ✅ |
| No side effects | ✅ | ✅ |
| Performance | Slower | Optimized |

## Key Takeaways

1. **Method invocation** automatically binds `this` to the object
2. **Temporary attachment** allows us to simulate context binding
3. **Symbols** prevent property name collisions
4. **Cleanup** is essential to avoid memory leaks and side effects

This pattern is the foundation for understanding how `call()`, `apply()`, and `bind()` work internally!