# TypeScript Type Inference: Complete Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Basic Type Inference](#basic-type-inference)
3. [Variable Inference](#variable-inference)
4. [Function Inference](#function-inference)
5. [Array Inference](#array-inference)
6. [Object Inference](#object-inference)
7. [Union Type Inference](#union-type-inference)
8. [Contextual Typing](#contextual-typing)
9. [Advanced Inference](#advanced-inference)
10. [Generic Inference](#generic-inference)
11. [When Inference Fails](#when-inference-fails)
12. [Best Practices](#best-practices)

---

## Introduction

### What is Type Inference?

**Type Inference** is TypeScript's ability to **automatically determine the type** of a variable, function return, or expression based on the value or context provided.

Instead of explicitly declaring types everywhere, TypeScript figures out types for you.

### Benefits

```
✅ Less verbose code
✅ Cleaner, more readable
✅ Still fully type-safe
✅ Catches errors at compile time
✅ Reduces boilerplate
```

### When Used

- Variables initialized with values
- Function return types
- Array and object literals
- Conditional expressions
- Generic type parameters

---

## Basic Type Inference

### Primitive Types

```typescript
// STRING
let name = "John";
// Type: string

let greeting = `Hello, ${name}`;
// Type: string

// NUMBER
let age = 30;
// Type: number

let price = 19.99;
// Type: number

let count = 0n; // BigInt
// Type: bigint

// BOOLEAN
let isActive = true;
// Type: boolean

let isCompleted = 1 > 2;
// Type: boolean

// UNDEFINED
let value = undefined;
// Type: undefined

// NULL
let empty = null;
// Type: null

// SYMBOL
let id = Symbol("id");
// Type: symbol
```

### Type Narrowing

```typescript
// TypeScript infers the most specific type possible
let value = Math.random() > 0.5 ? "hello" : 42;
// Type: string | number

// After checking, type narrows
if (typeof value === "string") {
  value.toUpperCase(); // ✅ string methods available
} else {
  value.toFixed(2); // ✅ number methods available
}
```

---

## Variable Inference

### Explicit vs Inferred

```typescript
// ❌ VERBOSE: Explicit type declaration
let username: string = "Alice";
let userAge: number = 25;
let isAdmin: boolean = false;

// ✅ CLEAN: Type inference
let username = "Alice";
let userAge = 25;
let isAdmin = false;

// TypeScript infers:
// username: string
// userAge: number
// isAdmin: boolean
```

### const vs let Inference

```typescript
// WITH let - inferred as wider type
let status = "active";
// Type: string
// Can be reassigned to any string

// WITH const - inferred as literal type
const status = "active";
// Type: "active" (literal)
// Cannot be reassigned

// Useful for readonly values
const direction = "north";
// Type: "north"
// More specific than "string"

function changeDirection(dir: "north" | "south" | "east" | "west") {
  // ...
}

changeDirection(direction); // ✅ Works perfectly
```

### Inference with Complex Values

```typescript
// Objects
let user = { name: "John", age: 30 };
// Type: { name: string; age: number }

// Arrays
let numbers = [1, 2, 3];
// Type: number[]

let mixed = [1, "two", 3];
// Type: (string | number)[]

// Functions
let greet = (name: string) => `Hello, ${name}`;
// Type: (name: string) => string
```

---

## Function Inference

### Return Type Inference

```typescript
// ✅ TypeScript infers return type is number
function add(a: number, b: number) {
  return a + b;
}
// Return type: number

// ✅ TypeScript infers return type is string
function formatName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}
// Return type: string

// ✅ TypeScript infers return type is boolean
function isEven(num: number) {
  return num % 2 === 0;
}
// Return type: boolean

// ⚠️ Multiple return types create union
function getValue(id: number) {
  if (id > 0) {
    return { value: id };
  }
  return null;
}
// Return type: { value: number } | null
```

### Parameter Type Requirements

```typescript
// ❌ ERROR: Parameter types must be explicit
function multiply(a, b) {
  return a * b;
}
// Error: Parameter 'a' implicitly has an 'any' type

// ✅ CORRECT: Add parameter types
function multiply(a: number, b: number) {
  return a * b;
}
// Return type automatically inferred as number
```

### Arrow Function Inference

```typescript
// ✅ Return type inferred as string
const greet = (name: string) => {
  return `Hello, ${name}`;
};
// Type: (name: string) => string

// ✅ Single-line arrow function
const double = (n: number) => n * 2;
// Type: (n: number) => number
```

### Callback Function Inference

```typescript
// ✅ Callback parameter types inferred from context
const numbers = [1, 2, 3, 4];

const doubled = numbers.map(n => n * 2);
// n is inferred as number (from array type)

const result = numbers.filter(n => n > 2);
// n is inferred as number
// result type: number[]

// Works with objects too
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

const names = users.map(user => user.name);
// user is inferred as { id: number; name: string }
// names type: string[]
```

---

## Array Inference

### Basic Array Inference

```typescript
// Homogeneous arrays (single type)
let numbers = [1, 2, 3];
// Type: number[]

let strings = ["a", "b", "c"];
// Type: string[]

let flags = [true, false];
// Type: boolean[]

// Heterogeneous arrays (multiple types)
let mixed = [1, "two", 3];
// Type: (string | number)[]

// Empty array - tricky!
let empty = [];
// Type: any[] or unknown[]
// Usually needs type annotation
```

### Array Methods and Inference

```typescript
// Array.map() infers return type
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
// Type: number[]

const asStrings = numbers.map(n => String(n));
// Type: string[]

// Array.filter() infers filtered type
const evens = numbers.filter(n => n % 2 === 0);
// Type: number[]

// Array.reduce() needs return type help
const sum = numbers.reduce((acc, n) => acc + n, 0);
// Type: number
```

### Const Assertions for Arrays

```typescript
// ❌ Without const assertion - inferred as array type
let status = ["pending", "completed"];
// Type: string[]
// Can be modified: status[0] = "cancelled"

// ✅ With const assertion - inferred as readonly tuple
let status = ["pending", "completed"] as const;
// Type: readonly ["pending", "completed"]
// Cannot be modified

// Useful for discriminated unions
const actions = [
  { type: "LOAD", payload: true },
  { type: "ERROR", payload: "Network error" }
] as const;
// Type is now very specific for each action
```

---

## Object Inference

### Object Literal Inference

```typescript
// ✅ TypeScript infers complete object type
let user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};
// Type: { name: string; age: number; email: string }

// ✅ Object with methods
let calculator = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b
};
// Type: { add: (a: number, b: number) => number; subtract: (a: number, b: number) => number }

// ✅ Nested objects
let config = {
  database: {
    host: "localhost",
    port: 5432
  },
  cache: {
    enabled: true
  }
};
// Type: { database: { host: string; port: number }; cache: { enabled: boolean } }
```

### Optional Properties

```typescript
// Object with optional property
let userA = { name: "Alice" };
// Type: { name: string }

let userB = { name: "Bob", age: 25 };
// Type: { name: string; age: number }

// They have different types!
// To unify them, use optional properties:

let user: { name: string; age?: number } = {};
user = { name: "Alice" };
user = { name: "Bob", age: 25 };
```

---

## Union Type Inference

### From Conditional Expressions

```typescript
// Ternary operator creates union type
let value = Math.random() > 0.5 ? "hello" : 42;
// Type: string | number

// Multiple conditions
let result = Math.random() > 0.5 
  ? { status: "success" }
  : Math.random() > 0.25
    ? null
    : { error: "Failed" };
// Type: { status: string } | { error: string } | null
```

### From Multiple Return Statements

```typescript
function getUser(id: number) {
  if (id > 0) {
    return { name: "Alice", id };
  }
  
  if (id === 0) {
    return null;
  }
  
  return { error: "Invalid ID" };
}
// Type: { name: string; id: number } | { error: string } | null
```

### Type Narrowing with Unions

```typescript
function processValue(value: string | number) {
  if (typeof value === "string") {
    // ✅ value narrowed to string
    console.log(value.toUpperCase());
  } else {
    // ✅ value narrowed to number
    console.log(value.toFixed(2));
  }
}

function processInput(input: { type: "user" } | { type: "admin" }) {
  if (input.type === "user") {
    // ✅ input narrowed to { type: "user" }
  } else {
    // ✅ input narrowed to { type: "admin" }
  }
}
```

---

## Contextual Typing

### Function Parameters from Context

```typescript
// ✅ Parameter type inferred from context
const numbers = [1, 2, 3];

// TypeScript knows 'n' is number (from array type)
numbers.forEach(n => console.log(n * 2));

// ✅ Callback types inferred from function signature
function handleClick(callback: (event: MouseEvent) => void) {
  // ...
}

// event type inferred as MouseEvent
handleClick(event => {
  console.log(event.clientX);
});

// ✅ Event handler inference
const button = document.querySelector("button")!;

button.addEventListener("click", event => {
  // event inferred as MouseEvent
  console.log(event.clientX);
});
```

### Variable Assignment Context

```typescript
// Type inferred from assignment
function getUser(): { id: number; name: string } {
  return { id: 1, name: "Alice" };
}

// user type inferred as { id: number; name: string }
let user = getUser();

// ✅ Array context
const strings: string[] = ["a", "b", "c"];
// Array element type inferred as string

// ✅ Object property context
const config: { host: string; port: number } = {
  host: "localhost",
  port: 5432
};
// host inferred as string, port as number
```

---

## Advanced Inference

### Tuple Inference

```typescript
// ✅ Tuple type inference
let pair = [1, "hello"];
// Type: [number, string]
// Or: (string | number)[] (depends on context)

// ✅ With const assertion - strict tuple
let tuple = [1, "hello"] as const;
// Type: readonly [1, "hello"] (literal types)

// ✅ Function returning tuple
function getCoordinates() {
  return [10, 20];
}
// Return type: number[]

// Better: with const assertion
function getCoordinates() {
  return [10, 20] as const;
}
// Return type: readonly [10, 20]
```

### Discriminated Unions

```typescript
// ✅ TypeScript infers discriminated union type
const actions = [
  { type: "ADD", payload: 5 },
  { type: "SUBTRACT", payload: 3 },
  { type: "RESET", payload: null }
];

// Type: { type: string; payload: number | null }[]

// Better: with type guard
function handleAction(action: { type: "ADD"; payload: number } | { type: "RESET"; payload: null }) {
  if (action.type === "ADD") {
    // action.payload is inferred as number
  } else {
    // action.payload is inferred as null
  }
}
```

### Recursive Types

```typescript
// ✅ Self-referential type inference
interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

let tree = {
  value: 1,
  left: { value: 2 },
  right: {
    value: 3,
    left: { value: 4 }
  }
};

// TypeScript infers correct nested structure
// Type: { value: number; left: { value: number }; right: { value: number; left: { value: number } } }
```

---

## Generic Inference

### Automatic Type Parameter Inference

```typescript
// ✅ Generic type parameter inferred automatically
function identity<T>(value: T): T {
  return value;
}

let result1 = identity("hello");
// T inferred as string
// Return type: string

let result2 = identity(42);
// T inferred as number
// Return type: number

let result3 = identity({ name: "Alice" });
// T inferred as { name: string }
// Return type: { name: string }
```

### Multiple Generic Parameters

```typescript
// ✅ Multiple type parameters inferred
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

let result = pair("hello", 42);
// T inferred as string
// U inferred as number
// Return type: [string, number]
```

### Generic Array Methods

```typescript
// ✅ Generic array methods infer types
const numbers = [1, 2, 3];

// map's generic type inferred
const doubled = numbers.map((n, i) => {
  // n: number (inferred)
  // i: number (inferred)
  return n * 2;
});
// Return type: number[]

// Generic object array
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

const names = users.map(u => u.name);
// u type: { id: number; name: string }
// Return type: string[]
```

### Constraining Generic Inference

```typescript
// ✅ Generic constraint
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength("hello");      // ✅ string has length
getLength([1, 2, 3]);    // ✅ array has length
getLength({ length: 5 }); // ✅ object with length
getLength(123);          // ❌ Error: number has no length

// Type inference still works - T is inferred from argument
```

---

## When Inference Fails

### Empty Arrays

```typescript
// ❌ PROBLEM: Empty array type is ambiguous
let items = [];
// Type: any[] or unknown[]
// TypeScript doesn't know what type of items

// ✅ SOLUTION 1: Type annotation
let items: string[] = [];

let items: Array<{ id: number; name: string }> = [];

// ✅ SOLUTION 2: Initialize with sample
let items = ["apple", "banana"];
// Type: string[] (inferred from values)

// ✅ SOLUTION 3: Push operation
let items: string[] = [];
items.push("apple");
```

### Ambiguous Function Returns

```typescript
// ❌ PROBLEM: Multiple return paths with different types
function getData(id?: number) {
  if (id) {
    return { data: "found" };
  }
  // implicit return undefined
}
// Return type: { data: string } | undefined

// ✅ SOLUTION: Explicit return type
function getData(id?: number): { data: string } | undefined {
  if (id) {
    return { data: "found" };
  }
}

// ✅ SOLUTION: Always return consistently
function getData(id?: number): { data: string } | null {
  if (id) {
    return { data: "found" };
  }
  return null; // Explicit
}
```

### Complex Object Structures

```typescript
// ❌ PROBLEM: Complex inference may be wrong
let config = {
  api: { url: "http://localhost:3000" },
  features: { enabled: ["auth", "api"] }
};
// Type might be inferred too broadly

// ✅ SOLUTION: Use const assertion
let config = {
  api: { url: "http://localhost:3000" },
  features: { enabled: ["auth", "api"] }
} as const;
// Now types are very specific

// ✅ SOLUTION: Type annotation
interface Config {
  api: { url: string };
  features: { enabled: string[] };
}

let config: Config = {
  api: { url: "http://localhost:3000" },
  features: { enabled: ["auth", "api"] }
};
```

### Callback Parameter Inference Limitations

```typescript
// ❌ PROBLEM: No context for callback parameters
const handler = (event) => {
  // event is 'any' - no context provided
};

// ✅ SOLUTION: Add to function with known signature
element.addEventListener("click", (event) => {
  // event inferred as MouseEvent (from addEventListener signature)
  console.log(event.clientX);
});

// ✅ SOLUTION: Explicit parameter type
const handler = (event: MouseEvent) => {
  console.log(event.clientX);
};
```

### Circular Reference Issues

```typescript
// ❌ PROBLEM: Self-referential without interface
let tree = {
  value: 1,
  children: [
    { value: 2, children: [] } // What type are children?
  ]
};

// ✅ SOLUTION: Use interface for recursive types
interface TreeNode {
  value: number;
  children: TreeNode[];
}

let tree: TreeNode = {
  value: 1,
  children: [
    { value: 2, children: [] }
  ]
};
```

---

## Best Practices

### When to Use Inference

```typescript
// ✅ DO: Use inference for obvious cases
let name = "Alice";        // Clearly a string
let count = 0;             // Clearly a number
let isActive = true;       // Clearly a boolean

// ✅ DO: Use inference with functions when return is clear
function add(a: number, b: number) {
  return a + b; // Return type obviously number
}

// ✅ DO: Use inference in array operations
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // Return type clear
```

### When to Use Explicit Types

```typescript
// ✅ DO: Explicit types for function parameters
function process(data: string, count: number): boolean {
  // Always explicit for parameters
  // Return type can be inferred
}

// ✅ DO: Explicit types for exports
export const DEFAULT_PORT: number = 3000;
export function handleRequest(req: Request): Response {
  // Public APIs should have explicit types
}

// ✅ DO: Explicit types for complex objects
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

const user: User = { /* ... */ };

// ✅ DO: Explicit types for ambiguous cases
let value: string | number;

let empty: string[] = [];

let callback: (event: Event) => void = (event) => {
  // ...
};
```

### Balance Guide

```
INFER:
- Simple variable assignments
- Function return types (when obvious)
- Callback parameters (when context clear)

EXPLICIT:
- Function parameters (always)
- Public API contracts
- Complex object types
- Empty containers (arrays, maps)
- Ambiguous values
```

### Reading Inferred Types

```typescript
// Hover in VS Code to see inferred type
let user = { id: 1, name: "Alice" };
// Hovering shows: { id: number; name: string }

// Use typeof to create type from variable
let user = { id: 1, name: "Alice" };
type User = typeof user;
// User type: { id: number; name: string }

// Verify inferred type
let result = someFunction();
// Right-click → "Go to Type Definition" to verify
```

---

## Summary

### Key Points

| Concept | Description |
|---------|------------|
| **Basic Inference** | TypeScript figures out type from value |
| **Function Inference** | Return types inferred from return statements |
| **Contextual** | Types inferred from context of usage |
| **Limitations** | Doesn't work for parameters, empty arrays, ambiguous cases |
| **Balance** | Use inference smartly, explicit for clarity |

### Checklist

- [ ] Use inference for simple assignments
- [ ] Always explicit for function parameters
- [ ] Add type annotations for public APIs
- [ ] Use `as const` for strict literal types
- [ ] Add types to empty arrays/objects
- [ ] Verify inferred types with hover
- [ ] Document complex inferred types

### Resources

- [TypeScript Handbook: Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

