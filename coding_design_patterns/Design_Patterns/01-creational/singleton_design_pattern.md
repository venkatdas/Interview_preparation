### Singleton Design pattern

- The Singleton Pattern is a design pattern used to ensure that a class has only one instance and provides a global point of access to that instance.
- This pattern is commonly used in scenarios where a single shared resource or configuration object is required.

------ OR ---------

- The Singleton Pattern ensures that a class has only one instance and provides a global point of access to it. This pattern is useful when you want to limit the number of instances of a class and ensure a single shared instance is accessible throughout the application.

**When to Use Singleton**

- To manage shared resources (e.g., database connections, configuration files).
- For objects that should only have one instance (e.g., logging service, app state manager).

**How It Works in JavaScript**

- In JavaScript, the Singleton Pattern can be implemented using different techniques, such as using an object literal, closures, or classes.

**Example 1: Using Object Literal**

- An object literal inherently ensures there is only one instance.

```js
const Singleton = {
  name: "SingletonInstance",
  getName() {
    return this.name;
  },
};

// Access Singleton
console.log(Singleton.getName()); // "SingletonInstance"
```

- This is simple but lacks flexibility or control.

**Example 2: Using a Closure**

```js
const Singleton = (function () {
  let instance;

  function createInstance() {
    return { name: "SingletonInstance" };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// Access Singleton
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true (same instance)
```

**Example 3: Using a Class**

```js
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    this.name = "SingletonInstance";
  }

  getName() {
    return this.name;
  }
}

// Access Singleton
const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // true (same instance)
```

- In this example:

- The constructor checks if an instance already exists (Singleton.instance).

- If it exists, it returns the existing instance.
- Otherwise, it creates and stores a new instance.

**Remodify the above example in different way**

```js
// Implementation example of the Singleton Pattern
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      // Initialize the instance
      Singleton.instance = this;
    }
    return Singleton.instance;
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // Output: true
```

- In this example, the Singleton class has a constructor that checks if an instance of the class already exists. If an instance doesn't exist (!Singleton.instance condition), it initializes the instance by assigning this to Singleton.instance. This ensures that subsequent calls to the constructor will return the same instance.

- When instance1 and instance2 are created using the new Singleton() syntax, both variables refer to the same instance of the Singleton class. Hence, when comparing instance1 === instance2 using the strict equality operator, it evaluates to true.

- **Use Case: Singletons are often used for logging, caching, and managing configurations.**
