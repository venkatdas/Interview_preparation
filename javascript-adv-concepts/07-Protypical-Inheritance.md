#### Protypical Inheritance

- Prototypical inheritance is a feature in JavaScript where objects can inherit properties and methods from other objects. Instead of using classes (as in classical inheritance), JavaScript uses prototypes to enable inheritance.
- Every JavaScript object has an internal link (referred to as [[Prototype]] or __proto__) that points to another object, called its prototype.
- Through this chain, objects can access properties and methods of other objects.

**How It Works**
- When you try to access a property or method on an object, JavaScript first looks at that object.
- If the property is not found, it looks up the [[Prototype]] chain until it finds the property or reaches null.
- 


________________
- Prototypal inheritance is a feature in JavaScript that allows objects to inherit properties and methods from other objects
- One object trying to access the properties and methods form another object.
- 
![Screenshot (74)](https://github.com/venkatdas/Interview_prep/assets/43024084/fa2a6fac-89b9-48f6-af75-41fb70e1d8f0)


- How does this object knows those methods like greet , name methods..?

- These will come via prototype

So , What is it?


- Whenever you create any object , javascript engine automatically puts the hidden properties into an aobject and attaches to your project.
- To access those hidden properties using __proto__ keyword, This is the object where javascript engine will keeping methods and props
- 



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/bfc7bbb3-a5b0-4a95-931e-ec7f6952689b)

- Prototype chain


________________________________________________


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/355b8481-c5a8-46ae-b54b-2d48c8786183)


object2 is inheriting the properties from object1 this is called prototypical inheritance


______________________________________________

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/379baf2f-8149-4a30-827f-dd65cda241e2)

- If you try to access the getIntro from object2 it will get `Aditya from dehradun` because `this` points to the object2 and it will get the access, when coming to `city` , it is not there in object2 sothat accroding to prototype chain it will inherit from object1.


_______________________________________________


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/0ea20720-8e91-42b1-8c77-b738fae3fbce)

- Whatever the functions you will create , it will have access to mybind because of prototype

----

# Understanding the Prototype Chain in JavaScript

## **What is the Prototype Chain?**

The prototype chain is the mechanism JavaScript uses to resolve properties and methods. If an object doesn’t have a requested property, the JavaScript engine searches up the prototype chain.

Here’s the code example we’ll analyze:

```javascript
function Animal(name) {
      this.name = name;
}

Animal.prototype.speak = function () {
      console.log(`${this.name} makes a sound.`);
};

const dog = new Animal("Buddy");

console.log(dog.name); // Buddy
dog.speak(); // Buddy makes a sound.
```

### **Step-by-Step Explanation**

### **1. Function Constructor and Prototype**
```javascript
function Animal(name) {
    this.name = name;
}
```
- `Animal` is a **constructor function**. 
- When you create an object using `new Animal("Buddy")`, the `name` property is added to the newly created object (`dog` in this case).

---

### **2. Adding Methods to the Prototype**
```javascript
Animal.prototype.speak = function () {
    console.log(`${this.name} makes a sound.`);
};
```
- The `speak` method is not added directly to the `Animal` object. Instead, it is added to the `Animal.prototype`.
- All objects created using the `Animal` constructor inherit this method via the **prototype chain**.

---

### **3. Creating an Instance**
```javascript
const dog = new Animal("Buddy");
```
- When you create `dog` using `new Animal("Buddy")`:
  - A new object is created.
  - The `name` property is set on the `dog` object.
  - The prototype of `dog` is set to `Animal.prototype`.

---

### **How the Prototype Chain Works**

#### **Accessing `dog.name`:**
```javascript
console.log(dog.name); // Buddy
```
- The `name` property is **directly on the `dog` object**. 
- JavaScript finds it immediately and returns `"Buddy"`.

#### **Accessing `dog.speak`:**
```javascript
dog.speak(); // Buddy makes a sound.
```
- The `speak` method is **not directly on the `dog` object**.
- JavaScript looks for `speak` in the `dog` object and doesn’t find it.
- It then **looks up the prototype chain**:
  - It finds `speak` on `Animal.prototype`.
  - It calls the `speak` method from `Animal.prototype`, with `this` referring to `dog`.

---

### **Prototype Chain Visualization**

Here’s the chain for your `dog` object:

1. **`dog` Object:**
   - Contains the `name` property.
   - `__proto__` points to `Animal.prototype`.

2. **`Animal.prototype`:**
   - Contains the `speak` method.
   - `__proto__` points to `Object.prototype`.

3. **`Object.prototype`:**
   - Contains methods like `toString`, `hasOwnProperty`, etc.
   - `__proto__` is `null` (end of the chain).

---

### **Prototype Chain Diagram**

```plaintext
dog
  |
  |__ name: "Buddy"
  |__ __proto__ --> Animal.prototype
                     |
                     |__ speak: function()
                     |__ __proto__ --> Object.prototype
                                        |
                                        |__ toString: function()
                                        |__ hasOwnProperty: function()
                                        |__ __proto__ --> null
```

---

### **Key Points**

1. **Prototype Chain Resolution:**
   - JavaScript first checks the object itself.
   - If the property or method is not found, it checks the object’s prototype (`__proto__`).
   - This continues up the chain until the property is found or the chain ends (`null`).

2. **Prototype vs. `__proto__`:**
   - `prototype`: A property of constructor functions that defines the prototype for objects created using `new`.
   - `__proto__`: A property of objects that points to their prototype.

3. **Why Use Prototypes?**
   - Prototypes allow objects to share methods and properties, saving memory and enabling inheritance.

---

### **Experiment to Understand**

Try these commands in your console to see the prototype chain in action:

#### Check the Prototype of `dog`:
```javascript
console.log(dog.__proto__ === Animal.prototype); // true
```

#### Check the Prototype of `Animal.prototype`:
```javascript
console.log(Animal.prototype.__proto__ === Object.prototype); // true
```

#### Check the End of the Chain:
```javascript
console.log(Object.prototype.__proto__); // null
```

---

### **Additional Question**

#### **Why is the `name` property directly on the `dog` object, but the `speak` method is not?**

### **Answer**

#### **How the `name` Property is Directly on the `dog` Object**

1. **Constructor Function Behavior**:
   ```javascript
   function Animal(name) {
       this.name = name;
   }
   ```
   - When you use a constructor function with the `new` keyword, the `this` inside the function refers to the newly created object (`dog` in this case).
   - The line `this.name = name;` adds the `name` property **directly to the new object**.

   Example:
   ```javascript
   const dog = new Animal("Buddy");
   console.log(dog.name); // "Buddy"
   console.log(dog.hasOwnProperty("name")); // true (directly on the object)
   ```

#### **Why the `speak` Method is Not Directly on the `dog` Object**

1. **Prototype Usage**:
   ```javascript
   Animal.prototype.speak = function () {
       console.log(`${this.name} makes a sound.`);
   };
   ```
   - The `speak` method is added to the `Animal.prototype` object, not to the `dog` object itself.
   - This is intentional: **methods that are shared among all instances should be added to the prototype** to avoid duplicating them in memory for each instance.

2. **Prototype Chain Lookup**:
   - When you call `dog.speak()`, JavaScript:
     - First looks for `speak` directly on the `dog` object (it’s not there).
     - Then looks at `dog.__proto__` (which is `Animal.prototype`).
     - Finds `speak` on `Animal.prototype` and executes it.

---



### **Why is `speak` on the Prototype?**

1. **Efficiency**:
   - If you added `speak` directly to each instance (`dog`), every instance would have its own copy of the method, wasting memory.
   - By adding `speak` to the prototype, all instances share the same method.

   Example:
   ```javascript
   const dog1 = new Animal("Buddy");
   const dog2 = new Animal("Charlie");

   console.log(dog1.speak === dog2.speak); // true (shared method)
   ```

2. **Separation of Data and Behavior**:
   - Instance-specific data (like `name`) belongs directly on the object.
   - Shared behavior (like `speak`) belongs on the prototype.

---

### **Summary of Your Example**

Here’s what happens step by step:

1. **`const dog = new Animal("Buddy");`**
   - A new object `dog` is created.
   - `dog.name = "Buddy"` (directly on the object).
   - `dog.__proto__` is set to `Animal.prototype`.

2. **Accessing `dog.name`:**
   - JavaScript finds `name` directly on the `dog` object.

3. **Accessing `dog.speak()`:**
   - JavaScript doesn’t find `speak` on `dog`.
   - It checks `dog.__proto__` (which is `Animal.prototype`) and finds the method there.

---
