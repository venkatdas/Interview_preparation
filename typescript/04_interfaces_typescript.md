# TypeScript Interfaces

A complete reference guide for working with interfaces in TypeScript.

---

## 1. Object Type Annotation vs Interface

Before interfaces, you can annotate objects inline. For one-off shapes, this works fine — but it doesn't scale.

```ts
// Inline object type annotation
let user: { name: string; age: number } = {
  name: "Piyush",
  age: 26,
};
```

An **interface** gives that shape a reusable name:

```ts
interface User {
  name: string;
  age: number;
}
```

---

## 2. Basic Interface

```ts
interface User {
  name: string;
  age: number;
}

let newUser: User = {
  name: "Piyush",
  age: 25,
};
```

---

## 3. Optional Properties (`?`)

Mark a property optional with `?`. It can be present or `undefined`.

```ts
interface User {
  name: string;
  age: number;
  email?: string; // optional
}

let userA: User = { name: "Piyush", age: 25 };             // ✅ valid
let userB: User = { name: "Piyush", age: 25, email: "p@x.com" }; // ✅ valid
```

---

## 4. Readonly Properties

`readonly` prevents reassignment after object creation.

```ts
interface User {
  readonly id: number;
  name: string;
  age: number;
}

let newUser: User = { id: 1, name: "Piyush", age: 25 };
// newUser.id = 2; // ❌ Error: Cannot assign to 'id' because it is read-only
newUser.name = "Raj"; // ✅ allowed
```

---

## 5. Interface with Methods

Interfaces can define method signatures — either as a method shorthand or as a function-typed property.

```ts
interface Product {
  name: string;
  price: number;
  getDiscount(percentage: number): number;  // method signature
}

let laptop: Product = {
  name: "MacBook Pro",
  price: 2000,
  getDiscount(percentage: number): number {
    return this.price * (percentage / 100);
  },
};

console.log(laptop.getDiscount(10)); // 200
```

### Method vs Function Property Syntax

```ts
interface Example {
  method(): void;              // method shorthand
  fn: () => void;              // function-typed property
}
```

Both work the same at runtime, but they differ in how TypeScript checks `this` internally.

---

## 6. Index Signatures

Useful when you don't know property names ahead of time.

```ts
interface StringMap {
  [key: string]: string;
}

let colors: StringMap = {
  primary: "blue",
  secondary: "green",
};
```

You can mix known properties with an index signature, as long as all known properties match the index type:

```ts
interface Config {
  debug: boolean;
  [key: string]: boolean; // all values must be boolean
}
```

---

## 7. Extending Interfaces

Use `extends` to build on existing interfaces.

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

let myDog: Dog = {
  name: "Buddy",
  breed: "Labrador",
};
```

### Extending Multiple Interfaces

```ts
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

interface Duck extends Flyable, Swimmable {
  quack(): void;
}
```

---

## 8. Declaration Merging

Interfaces with the same name are **merged** automatically. This is unique to interfaces (types cannot do this).

```ts
interface Window {
  title: string;
}

interface Window {
  version: number;
}

// Merged result:
// interface Window { title: string; version: number; }
```

This is how libraries like `@types/node` extend built-in browser globals.

---

## 9. Interface vs Type Alias

| Feature                    | `interface`    | `type`           |
|----------------------------|:--------------:|:----------------:|
| Object shapes              | ✅              | ✅                |
| Extends / Inheritance      | ✅ (`extends`)  | ✅ (`&` intersect)|
| Declaration merging        | ✅              | ❌                |
| Union types                | ❌              | ✅                |
| Computed / mapped types    | ❌              | ✅                |
| Primitives / tuples        | ❌              | ✅                |

**General rule:** Prefer `interface` for object shapes and public APIs; use `type` for unions, tuples, and complex compositions.

---

## 10. Implementing an Interface in a Class

Classes use `implements` to guarantee they satisfy an interface.

```ts
interface Shape {
  color: string;
  area(): number;
}

class Circle implements Shape {
  color: string;
  radius: number;

  constructor(color: string, radius: number) {
    this.color = color;
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

A class can implement multiple interfaces:

```ts
class SmartWatch implements Trackable, Chargeable { ... }
```

---

## 11. Nested Interfaces

Interfaces can be composed from other interfaces.

```ts
interface Address {
  street: string;
  city: string;
  zip: string;
}

interface Person {
  name: string;
  age: number;
  address: Address;
}

let person: Person = {
  name: "Piyush",
  age: 26,
  address: {
    street: "123 Main St",
    city: "Mumbai",
    zip: "400001",
  },
};
```

---

## 12. Function Interfaces

An interface can describe the shape of a function itself.

```ts
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;
```

---

## 13. Generic Interfaces

Make an interface flexible by adding a type parameter.

```ts
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

let response: ApiResponse<User> = {
  data: { id: 1, name: "Piyush" },
  status: 200,
  message: "OK",
};

// Works with arrays too
let listResponse: ApiResponse<User[]> = {
  data: [{ id: 1, name: "Piyush" }],
  status: 200,
  message: "OK",
};
```

---

## Quick Reference Card

```ts
interface MyInterface {
  // Required property
  name: string;

  // Optional property
  nickname?: string;

  // Readonly property
  readonly id: number;

  // Method
  greet(message: string): void;

  // Function-typed property
  transform: (input: string) => string;

  // Index signature
  [key: string]: unknown;
}
```

---

## Key Takeaways

- Use interfaces to define the **shape** of objects, classes, and functions.
- `?` makes a property optional; `readonly` prevents mutation after creation.
- Interfaces support `extends` for inheritance and **declaration merging** automatically.
- Use `implements` in classes to enforce interface contracts.
- Generic interfaces (`interface Foo<T>`) make shapes reusable across types.
- Prefer interfaces over inline type annotations for anything you'll reuse.
