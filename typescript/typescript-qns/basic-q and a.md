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
```

------
#### Generics

- Generics in TypeScript are a way to create reusable and flexible components that can work with a variety of types without sacrificing type safety. They allow you to write functions, classes, or interfaces that can operate on data of different types while maintaining strict type checking.

# Generics in TypeScript

Generics in TypeScript are like placeholders for types. They let you write code that works with any data type, without deciding the type in advance. This makes your code reusable and flexible, while still being type-safe.

---

### Why Use Generics?
1. **Type Safety**: Generics allow you to specify the types you are working with, reducing runtime errors.
2. **Code Reusability**: You can write a single generic function or class and use it with different types.
3. **Scalability**: Generics help in building scalable and type-safe APIs or libraries.

---

### Syntax of Generics
The syntax involves using angle brackets `<T>` where `T` is a placeholder for a type. You can replace `T` with any valid identifier, but `T` is commonly used by convention.

---

### Examples

#### **Generic Function**
```typescript
function identity<T>(value: T): T {
    return value;
}

// Usage
const num = identity<number>(42); // T is number
const str = identity<string>("Hello"); // T is string
```
Here, the type `T` adapts to the type of the argument passed.

---

#### **Generic Array**
```typescript
function getFirstElement<T>(arr: T[]): T {
    return arr[0];
}

// Usage
const firstNumber = getFirstElement<number>([1, 2, 3]); // T is number
const firstString = getFirstElement<string>(["a", "b", "c"]); // T is string
```

---

#### **Generic Interface**
```typescript
interface KeyValuePair<K, V> {
    key: K;
    value: V;
}

// Usage
const pair: KeyValuePair<string, number> = {
    key: "age",
    value: 30,
};
```
Here, the interface works with two generic types: `K` for the key and `V` for the value.

---

#### **Generic Class**
```typescript
class Box<T> {
    private content: T;

    constructor(value: T) {
        this.content = value;
    }

    getContent(): T {
        return this.content;
    }
}

// Usage
const stringBox = new Box<string>("Hello");
console.log(stringBox.getContent()); // Output: "Hello"

const numberBox = new Box<number>(123);
console.log(numberBox.getContent()); // Output: 123
```

---

#### **Generic Constraints**
You can restrict the types that a generic can accept using `extends`.

```typescript
function printLength<T extends { length: number }>(item: T): void {
    console.log(item.length);
}

// Usage
printLength("Hello"); // Works because string has a length property
printLength([1, 2, 3]); // Works because array has a length property
// printLength(42); // Error: number does not have a length property
```

---

#### **Using Multiple Generics**
```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

// Usage
const merged = merge({ name: "John" }, { age: 30 });
console.log(merged); // Output: { name: "John", age: 30 }
```

---

### Key Points
1. **Default Types**: You can set default types for generics.
   ```typescript
   function createArray<T = string>(length: number, value: T): T[] {
       return Array(length).fill(value);
   }
   const arr = createArray(3, "x"); // T defaults to string
   ```

2. **Generic Utility Types**: TypeScript provides built-in utility types like `Partial<T>`, `Readonly<T>`, `Record<K, T>`, etc., which leverage generics.

3. **Generic in React**: Generics are often used in React components for props or hooks.
   ```typescript
   interface ButtonProps<T> {
       label: T;
   }

   const Button = <T extends string | number>({ label }: ButtonProps<T>) => (
       <button>{label}</button>
   );
   ```

---

Generics are a powerful feature that makes TypeScript code robust, reusable, and type-safe!



# 21. Union Types in TypeScript

Union types in TypeScript allow a variable to hold one of several specified types. This is useful when a value can be of more than one type.

---

## **1. What Are Union Types?**
A union type is created using the pipe (`|`) symbol to combine multiple types.

### Example:
```typescript
let value: string | number;

value = "Hello"; // Valid
value = 42;       // Valid
// value = true;  // Error: Type 'boolean' is not assignable to type 'string | number'
```

---

## **2. Union Types in Function Parameters**
Union types can be used in function parameters to accept multiple types.

### Example:
```typescript
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log(`ID as string: ${id.toUpperCase()}`);
  } else {
    console.log(`ID as number: ${id.toFixed(2)}`);
  }
}

printId("abc123"); // Output: ID as string: ABC123
printId(123.456);   // Output: ID as number: 123.46
```

---

## **3. Working with Union Arrays**
Union types can also be applied to arrays, allowing them to hold multiple types.

### Example:
```typescript
let data: (string | number)[] = [];
data.push("Hello");
data.push(42);

console.log(data); // Output: ["Hello", 42]
```

---

## **4. Narrowing Union Types**
TypeScript requires you to narrow down union types to perform type-specific operations. This is typically done using type guards like `typeof` or `instanceof`.

### Example:
```typescript
function describe(value: string | Date): void {
  if (typeof value === "string") {
    console.log(`It's a string: ${value}`);
  } else {
    console.log(`It's a date: ${value.toISOString()}`);
  }
}

describe("TypeScript");      // Output: It's a string: TypeScript
describe(new Date());         // Output: It's a date: 2025-01-01T00:00:00.000Z
```

---

## **5. Union Types in Interfaces**
Union types can be used as properties in interfaces.

### Example:
```typescript
interface User {
  id: string | number;
  name: string;
}

const user1: User = { id: 1, name: "Alice" };
const user2: User = { id: "abc123", name: "Bob" };
```

---

## **6. Union Types and Function Return Values**
Functions can return union types to indicate multiple possible return values.

### Example:
```typescript
function getValue(condition: boolean): string | number {
  return condition ? "Success" : 0;
}

const result = getValue(true);  // result is of type string | number
```

---

## **7. Union Types and Discriminated Unions**
Discriminated unions use a common property to narrow down the type.

### Example:
```typescript
interface Dog {
  type: "dog";
  bark: () => void;
}

interface Cat {
  type: "cat";
  meow: () => void;
}

type Pet = Dog | Cat;

function interactWithPet(pet: Pet): void {
  if (pet.type === "dog") {
    pet.bark();
  } else {
    pet.meow();
  }
}

const myPet: Dog = { type: "dog", bark: () => console.log("Woof!") };
interactWithPet(myPet); // Output: Woof!
```

---

## **8. Best Practices with Union Types**
1. **Narrow types explicitly:** Use type guards like `typeof`, `instanceof`, or discriminated unions.
2. **Avoid overly broad unions:** Use union types sparingly to avoid complex logic.
3. **Use type aliases:** When unions become complex, create a type alias for readability.

### Example:
```typescript
type ID = string | number;

function processId(id: ID): void {
  console.log(`Processing ID: ${id}`);
}
```

---

Union types in TypeScript provide a flexible and powerful way to handle values that can be of multiple types. By combining them with type narrowing techniques, you can maintain type safety while writing versatile code.
