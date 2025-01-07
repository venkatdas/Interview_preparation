# Basic TypeScript Interview Questions with Examples

## **1. What is TypeScript? How is it different from JavaScript?**
TypeScript is a superset of JavaScript that adds static typing and other features, such as interfaces, enums, and type aliases. It compiles to plain JavaScript.

Example:
```typescript
// JavaScript Code
let greeting = "Hello";

// TypeScript Code
let greeting: string = "Hello"; // TypeScript ensures the type is a string
```

---

## **2. What are the benefits of using TypeScript?**
- **Static Typing:** Catch errors during development.
- **Improved IDE Support:** Better autocompletion and refactoring.
- **Readability and Maintainability:** Helps teams understand code faster.
- **Advanced JavaScript Features:** Supports ES6+ features.

---

## **3. What is transpiling in TypeScript?**
Transpiling is the process of converting TypeScript code into JavaScript code so it can be executed in browsers or Node.js environments.

Example:
```typescript
// TypeScript Code
const add = (a: number, b: number): number => a + b;

// JavaScript after transpiling
const add = (a, b) => a + b;
```

---

## **4. What are the basic types in TypeScript?**
- **Basic Types:** `number`, `string`, `boolean`, `any`, `unknown`, `void`, `null`, `undefined`, `never`, `object`, `array`, `tuple`, `enum`.

Example:
```typescript
let isDone: boolean = false;
let age: number = 25;
let firstName: string = "John";
let notSure: any = 4; // Can hold any type
```

---

## **5. What is the `any` type in TypeScript?**
The `any` type allows variables to hold values of any type. It disables type-checking for the variable.

Example:
```typescript
let value: any = 5;
value = "Now it's a string!"; // No error
```

---

## **6. What is the difference between `unknown` and `any`?**
- `any`: No type safety; operations can be performed directly.
- `unknown`: Requires explicit type checking before operations.

Example:
```typescript
let anyVar: any = "Hello";
let unknownVar: unknown = "Hello";

anyVar.toUpperCase(); // No error
// unknownVar.toUpperCase(); // Error: Object is of type 'unknown'

if (typeof unknownVar === "string") {
  unknownVar.toUpperCase(); // Safe
}
```

---

## **7. What are TypeScript interfaces?**
Interfaces define the shape of an object by specifying properties and their types.

Example:
```typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30,
};
```

---

## **8. What is the difference between `interface` and `type`?**
- **`interface`**: Used for object structures and supports extension.
- **`type`**: Can represent primitives, unions, intersections, and more.

Example:
```typescript
// Using interface
interface Point {
  x: number;
  y: number;
}

// Using type
type Point = {
  x: number;
  y: number;
};
```

---

## **9. What are tuples in TypeScript?**
Tuples are arrays with a fixed number of elements of specified types.

Example:
```typescript
let tuple: [number, string];
tuple = [1, "TypeScript"]; // Valid
// tuple = ["TypeScript", 1]; // Error: Type mismatch
```

---

## **10. What is the `enum` type in TypeScript?**
`enum` defines a set of named constants.

Example:
```typescript
enum Color {
  Red,
  Green,
  Blue,
}

let c: Color = Color.Green;
console.log(c); // Output: 1 (default numeric value)
```

---

## **11. What are generics in TypeScript?**
Generics allow writing reusable and type-safe code by working with types as parameters.

Example:
```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("Hello TypeScript");
```

---

## **12. What is the `readonly` modifier in TypeScript?**
The `readonly` modifier makes a property immutable.

Example:
```typescript
interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "John" };
// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property
```

---

## **13. What is the `never` type?**
The `never` type is used for functions that never return or unreachable code.

Example:
```typescript
function throwError(message: string): never {
  throw new Error(message);
}
```

---

## **14. How does TypeScript handle type inference?**
TypeScript infers the type of a variable when explicitly declared.

Example:
```typescript
let name = "John"; // TypeScript infers 'string'
// name = 42; // Error: Type 'number' is not assignable to type 'string'
```

---

## **15. What are type aliases in TypeScript?**
Type aliases allow defining custom names for types.

Example:
```typescript
type Point = {
  x: number;
  y: number;
};

const p: Point = { x: 10, y: 20 };
```

---

## **16. How can you enforce strict null checks in TypeScript?**
Enable `strictNullChecks` in `tsconfig.json` to prevent null or undefined values where not explicitly allowed.

Example:
```typescript
let value: string | null = "Hello";
value = null; // Valid because of union type
```

---

## **17. What is the `as` keyword used for in TypeScript?**
The `as` keyword is used for type assertions to explicitly specify the type of a value.

Example:
```typescript
let value: any = "Hello";
let strLength: number = (value as string).length;
```

---

## **18. What are decorators in TypeScript?**
Decorators are special declarations used to modify the behavior of classes, methods, or properties.

Example:
```typescript
function Log(target: any, propertyKey: string) {
  console.log(`Property ${propertyKey} has been accessed`);
}

class Example {
  @Log
  public prop: string = "Hello";
}
```

---

## **19. What is the `tsconfig.json` file?**
The `tsconfig.json` file is used to configure TypeScript compiler options.

Example:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "strict": true,
    "module": "commonjs"
  }
}
```

---

## **20. What is module resolution in TypeScript?**
Module resolution is the process by which TypeScript determines the location of imported modules.

Example:
```typescript
import { User } from "./models/User";
