# TypeScript Functions: Complete Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Basic Function Syntax](#basic-function-syntax)
3. [Function Types](#function-types)
4. [Parameters](#parameters)
5. [Return Types](#return-types)
6. [Arrow Functions](#arrow-functions)
7. [Function Overloading](#function-overloading)
8. [Callbacks](#callbacks)
9. [Higher-Order Functions](#higher-order-functions)
10. [Generic Functions](#generic-functions)
11. [Function Expressions](#function-expressions)
12. [Advanced Patterns](#advanced-patterns)
13. [Best Practices](#best-practices)

---

## Introduction

### Functions in TypeScript

TypeScript adds **type safety** to functions by allowing you to specify:
- Parameter types
- Return types
- Optional/required parameters
- Function overloading

### Benefits

```
✅ Catch errors at compile time
✅ Better IDE autocomplete
✅ Self-documenting code
✅ Refactoring safety
✅ Improved maintainability
```

---

## Basic Function Syntax

### Standard Function Declaration

```typescript
// ✅ BASIC: Function with types
function add(a: number, b: number): number {
  return a + b;
}

// ✅ CALL: Using the function
let result = add(5, 3); // result: 8

// ❌ ERROR: Wrong parameter type
add("5", 3); // Error: Argument of type 'string' is not assignable to parameter of type 'number'

// ❌ ERROR: Missing parameter
add(5); // Error: Expected 2 arguments, but got 1
```

### Function with Multiple Parameters

```typescript
// ✅ Multiple parameters with types
function greet(firstName: string, lastName: string, age: number): string {
  return `Hello ${firstName} ${lastName}, you are ${age} years old`;
}

greet("John", "Doe", 30);
// ✅ Returns: "Hello John Doe, you are 30 years old"

greet("Jane", "Smith"); 
// ❌ Error: Missing required parameter 'age'
```

### Function with No Parameters

```typescript
// ✅ No parameters
function getCurrentTime(): string {
  return new Date().toISOString();
}

// ✅ No parameters, no return
function logMessage(): void {
  console.log("This is a message");
}
```

### Function with No Return

```typescript
// ✅ Function returning void
function printUser(name: string): void {
  console.log(`User: ${name}`);
  // Explicitly returns nothing
}

// ✅ Function that doesn't explicitly return
function setName(name: string) {
  // Return type: void (inferred)
}

// ❌ Can't return a value from void function
function getData(): void {
  return { data: "test" }; // Error!
}
```

---

## Function Types

### Function Type Annotation

```typescript
// ✅ Define a function type
type Add = (a: number, b: number) => number;

// ✅ Use the type
const add: Add = (a, b) => a + b;

// ✅ Parameter types inferred from type
const subtract: Add = (a, b) => a - b;

// ❌ ERROR: Wrong signature
const multiply: Add = (a, b, c) => a * b * c; // Error: too many parameters
```

### Function Type with Interface

```typescript
// ✅ Interface for function type
interface Calculator {
  (a: number, b: number): number;
}

const add: Calculator = (a, b) => a + b;
const multiply: Calculator = (a, b) => a * b;

// ❌ ERROR: Wrong return type
const concat: Calculator = (a, b) => `${a}${b}`; // Error: returns string, not number
```

### Multiple Function Signatures

```typescript
// ✅ Type with multiple function signatures
type StringOrNumber = (input: string) => number | (input: number) => string;

// Actually, better to use overloading (see later)
type Converter = 
  | ((input: string) => number)
  | ((input: number) => string);
```

---

## Parameters

### Required Parameters

```typescript
// ✅ All parameters required
function createUser(name: string, email: string, age: number): void {
  console.log(`User: ${name}, Email: ${email}, Age: ${age}`);
}

createUser("Alice", "alice@example.com", 30);
// ✅ Works

createUser("Bob", "bob@example.com");
// ❌ Error: Missing required parameter 'age'
```

### Optional Parameters

```typescript
// ✅ Optional parameter with ?
function createUser(
  name: string,
  email: string,
  age?: number // Optional
): void {
  if (age) {
    console.log(`User: ${name}, Age: ${age}`);
  } else {
    console.log(`User: ${name}`);
  }
}

createUser("Alice", "alice@example.com");
// ✅ age is optional

createUser("Bob", "bob@example.com", 25);
// ✅ age provided
```

### Default Parameters

```typescript
// ✅ Default parameter value
function createUser(
  name: string,
  email: string,
  age: number = 18
): void {
  console.log(`User: ${name}, Email: ${email}, Age: ${age}`);
}

createUser("Alice", "alice@example.com");
// ✅ age defaults to 18

createUser("Bob", "bob@example.com", 30);
// ✅ age set to 30
```

### Optional vs Default

```typescript
// Optional parameter - type is T | undefined
function funcA(value?: string) {
  // value: string | undefined
  console.log(value.length); // ❌ Error: value might be undefined
}

// Default parameter - type is the parameter type
function funcB(value: string = "default") {
  // value: string (never undefined)
  console.log(value.length); // ✅ OK: value is always string
}

// Optional with default - type is the parameter type
function funcC(value: string = "default") {
  // value: string
  console.log(value.length); // ✅ OK
}
```

### Rest Parameters

```typescript
// ✅ Rest parameter - collect remaining args
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3, 4, 5);
// ✅ Returns: 15

// ✅ Rest with mixed parameters
function logMessages(prefix: string, ...messages: string[]): void {
  messages.forEach(msg => console.log(`${prefix}: ${msg}`));
}

logMessages("LOG", "Hello", "World", "!");
// ✅ Logs: LOG: Hello, LOG: World, LOG: !

// ✅ Rest must be last parameter
function createUser(name: string, ...roles: string[]) {
  // ...
}

// ❌ ERROR: Rest parameter not last
function invalid(...items: string[], count: number) { }
```

### Parameter Destructuring

```typescript
// ✅ Object destructuring in parameters
interface User {
  name: string;
  age: number;
  email?: string;
}

function displayUser({ name, age, email }: User): void {
  console.log(`${name} (${age}) - ${email || "no email"}`);
}

displayUser({ name: "Alice", age: 30 });
// ✅ Works

// ✅ Array destructuring in parameters
function swap([a, b]: [number, number]): [number, number] {
  return [b, a];
}

swap([1, 2]); // Returns: [2, 1]

// ✅ Destructuring with defaults
function createConfig({
  host = "localhost",
  port = 3000,
  ssl = true
}: {
  host?: string;
  port?: number;
  ssl?: boolean;
} = {}): void {
  console.log(`${ssl ? "https" : "http"}://${host}:${port}`);
}

createConfig({ port: 8080 });
// ✅ Uses defaults for host and ssl
```

---

## Return Types

### Explicit Return Types

```typescript
// ✅ Explicit return type
function add(a: number, b: number): number {
  return a + b;
}

// ✅ Multiple return types (union)
function getValue(id: number): string | number {
  return id > 0 ? `ID-${id}` : id;
}

// ✅ Object return type
function createUser(name: string): { id: number; name: string } {
  return { id: 1, name };
}

// ✅ Array return type
function getNumbers(): number[] {
  return [1, 2, 3];
}

// ✅ Tuple return type
function getCoordinates(): [number, number] {
  return [10, 20];
}
```

### Inferred Return Types

```typescript
// ✅ TypeScript infers return type as number
function add(a: number, b: number) {
  return a + b;
}

// ✅ TypeScript infers return type as string
function greet(name: string) {
  return `Hello ${name}`;
}

// ⚠️ TypeScript infers union return type
function getValue(id: number) {
  if (id > 0) {
    return { value: id };
  }
  return null;
}
// Return type: { value: number } | null
```

### Never Return Type

```typescript
// ✅ Function that never returns (infinite loop)
function infiniteLoop(): never {
  while (true) {
    // Never returns
  }
}

// ✅ Function that always throws
function throwError(message: string): never {
  throw new Error(message);
}

// ✅ Exhaustive check in switch
type Direction = "up" | "down" | "left" | "right";

function getOpposite(dir: Direction): Direction {
  switch (dir) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      const exhaustive: never = dir;
      return exhaustive; // Ensures all cases handled
  }
}
```

---

## Arrow Functions

### Basic Arrow Function

```typescript
// ✅ Arrow function with types
const add = (a: number, b: number): number => {
  return a + b;
};

// ✅ Single-line arrow function (implicit return)
const multiply = (a: number, b: number): number => a * b;

// ✅ Single parameter (parentheses optional)
const square = (n: number) => n * n;

// ❌ ERROR: Single parameter still needs type
const square = n => n * n; // Error: parameter implicitly 'any'

// ✅ No parameters (parentheses required)
const getCurrentTime = (): string => new Date().toISOString();
```

### Arrow Functions as Callbacks

```typescript
// ✅ Array methods with arrow functions
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((n) => n * 2);

const evens = numbers.filter((n) => n % 2 === 0);

const sum = numbers.reduce((acc, n) => acc + n, 0);

// ✅ Event handlers with arrow functions
const button = document.querySelector("button")!;

button.addEventListener("click", (event) => {
  console.log("Button clicked");
});
```

### This Binding

```typescript
// ❌ Regular function - 'this' is dynamic
const user = {
  name: "Alice",
  getName: function() {
    return this.name; // 'this' depends on how it's called
  }
};

const getName = user.getName;
console.log(getName()); // ❌ this is undefined (error)

// ✅ Arrow function - 'this' is lexically bound
const user2 = {
  name: "Bob",
  getName: () => {
    return this.name; // 'this' from outer scope
  }
};

// ✅ Method with explicit 'this' type
const user3 = {
  name: "Charlie",
  getName(this: typeof user3) {
    return this.name; // 'this' is user3
  }
};

console.log(user3.getName()); // ✅ "Charlie"
```

---

## Function Overloading

### Function Overload Signatures

```typescript
// ✅ Multiple signatures for same function
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string | number, b: string | number): string | number {
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  throw new Error("Invalid arguments");
}

combine("Hello", " World"); // ✅ Returns string: "Hello World"
combine(5, 3); // ✅ Returns number: 8
combine("5", 3); // ❌ Error: no matching overload
```

### Multiple Overload Combinations

```typescript
// ✅ Overloads with optional parameters
function padLeft(value: string, padding: string): string;
function padLeft(value: string, padding: number): string;

function padLeft(
  value: string,
  padding: string | number
): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  }
  return padding + value;
}

padLeft("Hello", 10); // ✅ "          Hello"
padLeft("Hello", ">>"); // ✅ ">>Hello"
padLeft("Hello", true); // ❌ Error: boolean not allowed
```

### Overloading with Different Return Types

```typescript
// ✅ Overloads with different return types
function getProperty(obj: { x: number }, key: "x"): number;
function getProperty(obj: { y: string }, key: "y"): string;

function getProperty(obj: any, key: string): any {
  return obj[key];
}

const point = { x: 10 };
const value: number = getProperty(point, "x"); // ✅ Inferred as number

const user = { y: "Alice" };
const name: string = getProperty(user, "y"); // ✅ Inferred as string
```

---

## Callbacks

### Callback Function Parameters

```typescript
// ✅ Function accepting callback
function processArray(
  items: number[],
  callback: (item: number) => void
): void {
  items.forEach(callback);
}

processArray([1, 2, 3], (item) => {
  console.log(item * 2);
});

// ✅ Callback with return type
function mapArray<T, U>(
  items: T[],
  transform: (item: T) => U
): U[] {
  return items.map(transform);
}

const numbers = [1, 2, 3];
const strings = mapArray(numbers, (n) => String(n));
// ✅ strings: ["1", "2", "3"]
```

### Callback with Error Handling

```typescript
// ✅ Node.js style callback with error
function readFile(
  path: string,
  callback: (error: Error | null, data?: string) => void
): void {
  // Simulate file read
  const success = Math.random() > 0.5;
  
  if (success) {
    callback(null, "File content");
  } else {
    callback(new Error("File not found"));
  }
}

readFile("file.txt", (error, data) => {
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Data:", data);
  }
});
```

### Optional Callbacks

```typescript
// ✅ Optional callback parameter
function doSomething(
  callback?: (result: string) => void
): void {
  const result = "Done";
  
  // Check if callback exists
  if (callback) {
    callback(result);
  }
}

doSomething(); // ✅ No callback
doSomething((result) => console.log(result)); // ✅ With callback
```

---

## Higher-Order Functions

### Functions Returning Functions

```typescript
// ✅ Function that returns a function
function makeMultiplier(factor: number): (num: number) => number {
  return (num: number) => num * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // ✅ 10
console.log(triple(5)); // ✅ 15

// ✅ Practical example: Debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const handleResize = debounce((width: number) => {
  console.log(`Resized to ${width}`);
}, 300);

// Call multiple times, only executes after 300ms of silence
```

### Function Composition

```typescript
// ✅ Compose functions together
function compose<A, B, C>(
  f: (a: A) => B,
  g: (b: B) => C
): (a: A) => C {
  return (a: A) => g(f(a));
}

const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;

const addOneThenDouble = compose(addOne, double);

console.log(addOneThenDouble(5)); // ✅ (5 + 1) * 2 = 12

// ✅ Pipe (opposite order)
function pipe<A, B, C>(
  f: (a: A) => B,
  g: (b: B) => C
): (a: A) => C {
  return (a: A) => g(f(a));
}

const doubleThenAddOne = pipe(double, addOne);
console.log(doubleThenAddOne(5)); // ✅ (5 * 2) + 1 = 11
```

### Currying

```typescript
// ✅ Curried function (returns function chain)
function add(a: number): (b: number) => number {
  return (b: number) => a + b;
}

const add5 = add(5);
console.log(add5(3)); // ✅ 8

// ✅ Generic curry utility
function curry<A, B, C>(
  f: (a: A, b: B) => C
): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => f(a, b);
}

const multiply = (a: number, b: number) => a * b;
const curriedMultiply = curry(multiply);

const multiplyBy2 = curriedMultiply(2);
console.log(multiplyBy2(5)); // ✅ 10
```

---

## Generic Functions

### Basic Generics

```typescript
// ✅ Generic function with type parameter
function identity<T>(value: T): T {
  return value;
}

identity<string>("hello"); // ✅ T = string
identity<number>(42); // ✅ T = number
identity("world"); // ✅ T inferred as string

// ✅ Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

pair<string, number>("age", 30); // ✅ ["age", 30]
pair("name", "Alice"); // ✅ ["name", "Alice"] - types inferred
```

### Generic Constraints

```typescript
// ✅ Generic with constraint
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength("hello"); // ✅ string has length
getLength([1, 2, 3]); // ✅ array has length
getLength({ length: 5 }); // ✅ object with length
getLength(123); // ❌ Error: number has no length

// ✅ Generic constrained to another type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30 };
const name = getProperty(person, "name"); // ✅ Returns string
getProperty(person, "email"); // ❌ Error: "email" not in person
```

### Generic with Default Type

```typescript
// ✅ Generic with default type
function wrap<T = string>(value: T): { value: T } {
  return { value };
}

wrap("hello"); // ✅ T = string
wrap<number>(42); // ✅ T = number
wrap(); // ✅ T = string (default)
```

### Conditional Types in Generics

```typescript
// ✅ Conditional type in generic
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // ✅ true
type B = IsString<42>; // ✅ false

// ✅ Conditional return type
function process<T>(
  value: T
): T extends string ? string : number {
  if (typeof value === "string") {
    return value.length;
  }
  return 0;
}

const strResult = process("hello"); // ✅ Type: number
const numResult = process(42); // ✅ Type: number
```

---

## Function Expressions

### Anonymous Functions

```typescript
// ✅ Anonymous function assigned to variable
const add = function(a: number, b: number): number {
  return a + b;
};

add(5, 3); // ✅ 8

// ✅ Without explicit type annotation
const multiply = function(a: number, b: number) {
  return a * b;
  // Return type inferred as number
};
```

### Named Function Expressions

```typescript
// ✅ Named function expression
const factorial = function fact(n: number): number {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can call itself by name
};

factorial(5); // ✅ 120

// Function name 'fact' only available inside function
// fact(5); // ❌ Error: fact is not defined
```

### Immediately Invoked Function Expression (IIFE)

```typescript
// ✅ IIFE with types
const result = (function(a: number, b: number): number {
  return a + b;
})(5, 3);

console.log(result); // ✅ 8

// ✅ Arrow IIFE
const name = ((firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
})("John", "Doe");

console.log(name); // ✅ "John Doe"
```

---

## Advanced Patterns

### Type Guards with Functions

```typescript
// ✅ Type guard function
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: string | number) {
  if (isString(value)) {
    // ✅ value narrowed to string
    console.log(value.toUpperCase());
  } else {
    // ✅ value narrowed to number
    console.log(value.toFixed(2));
  }
}

// ✅ Is type predicate
function isUser(value: unknown): value is { name: string; age: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "age" in value &&
    typeof (value as any).name === "string" &&
    typeof (value as any).age === "number"
  );
}

const data: unknown = { name: "Alice", age: 30 };

if (isUser(data)) {
  console.log(data.name); // ✅ data is narrowed to user type
}
```

### Function Decorators

```typescript
// ✅ Method decorator
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3); // Logs: "Calling add with args: [5, 3]"
```

### Async Functions

```typescript
// ✅ Async function with return type
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ✅ Async function with error handling
async function getUsers(): Promise<{ id: number; name: string }[]> {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// ✅ Calling async functions
fetchUser(1).then((user) => {
  console.log(user.name);
});

// ✅ With await in async context
async function displayUser() {
  const user = await fetchUser(1);
  console.log(user.name);
}
```

---

## Best Practices

### Parameter Ordering

```typescript
// ✅ GOOD: Required params first, optional last
function createUser(
  name: string,
  email: string,
  age?: number,
  role: string = "user"
): void {
  // ...
}

// ❌ BAD: Optional in middle, required at end
function createUser(
  name: string,
  age?: number,
  email: string
): void {
  // Can't call createUser("Alice", "alice@example.com")
}
```

### Explicit Return Types

```typescript
// ✅ GOOD: Explicit return types for public APIs
export function processData(data: string[]): { success: boolean; count: number } {
  return {
    success: true,
    count: data.length
  };
}

// ✅ GOOD: Infer return types for private functions
function helper(x: number) {
  return x * 2;
}

// ❌ AVOID: Implicit any in public APIs
export function processData(data) { }
```

### Function Complexity

```typescript
// ❌ AVOID: Too many parameters (>3)
function createUser(
  name: string,
  email: string,
  age: number,
  role: string,
  department: string,
  manager: string
): void {
  // Hard to remember order, easy to mistake parameters
}

// ✅ GOOD: Use object parameter
interface CreateUserOptions {
  name: string;
  email: string;
  age?: number;
  role?: string;
  department?: string;
  manager?: string;
}

function createUser(options: CreateUserOptions): void {
  // Clear intent, can add fields without breaking API
}

createUser({
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  department: "Engineering"
});
```

### Naming Conventions

```typescript
// ✅ GOOD: Clear, descriptive names
function getUserById(id: number): User | null { }
function validateEmail(email: string): boolean { }
function transformUserData(user: User): TransformedUser { }

// ❌ AVOID: Unclear names
function get(id) { }
function check(email) { }
function transform(user) { }

// ✅ GOOD: Predicate functions start with "is" or "has"
function isValidEmail(email: string): boolean { }
function hasPermission(user: User, action: string): boolean { }

// ✅ GOOD: Async functions indicate they're async
async function fetchUser(id: number): Promise<User> { }
async function saveUser(user: User): Promise<void> { }
```

### Error Handling

```typescript
// ✅ GOOD: Explicit error types
function parseJson(json: string): { success: boolean; data?: any; error?: Error } {
  try {
    return {
      success: true,
      data: JSON.parse(json)
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error")
    };
  }
}

// ✅ GOOD: Throw specific errors
function getUserById(id: number): User {
  if (id <= 0) {
    throw new Error("ID must be positive");
  }

  const user = database.find(id);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  return user;
}

// ✅ GOOD: Use type guards for error handling
async function safeCall<T>(fn: () => Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error("Unknown error")];
  }
}
```

### Documentation

```typescript
// ✅ GOOD: JSDoc for public functions
/**
 * Creates a new user in the database
 * 
 * @param name - The user's full name
 * @param email - The user's email address
 * @param age - Optional age (defaults to 18)
 * @returns The created user with ID
 * @throws Error if email already exists
 * 
 * @example
 * const user = await createUser("Alice", "alice@example.com", 30);
 */
export async function createUser(
  name: string,
  email: string,
  age?: number
): Promise<{ id: string; name: string; email: string }> {
  // ...
}

// ✅ GOOD: Comments for complex logic
function calculateDiscount(price: number, quantity: number): number {
  // Bulk discount: 5% for 10+, 10% for 20+, 15% for 50+
  let discountPercent = 0;
  
  if (quantity >= 50) discountPercent = 15;
  else if (quantity >= 20) discountPercent = 10;
  else if (quantity >= 10) discountPercent = 5;
  
  return price * (1 - discountPercent / 100);
}
```

---

## Function Checklist

### When Writing Functions

- [ ] All parameters have explicit types
- [ ] Return type is explicit for public APIs
- [ ] Parameters ordered (required → optional)
- [ ] Object parameter instead of 3+ params
- [ ] Descriptive function name
- [ ] Error cases handled
- [ ] JSDoc for public functions
- [ ] No implicit `any` types
- [ ] Type guards used for narrowing
- [ ] Generic constraints applied

### Testing Functions

```typescript
// ✅ Type tests
const add = (a: number, b: number): number => a + b;

// Verify parameter types
add(1, 2); // ✅ OK
add("1", "2"); // ❌ Error: not numbers

// Verify return type
const result: number = add(1, 2); // ✅ OK
const resultStr: string = add(1, 2); // ❌ Error: returns number, not string
```

---

## Summary

| Concept | Use Case |
|---------|----------|
| **Parameters** | Input to function, typed explicitly |
| **Return Type** | Output type, explicit for public APIs |
| **Optional Params** | `param?: Type` for optional values |
| **Default Params** | `param: Type = value` for defaults |
| **Rest Params** | `...args: Type[]` for variable args |
| **Overloading** | Multiple signatures for same function |
| **Generics** | Reusable functions with type parameters |
| **Callbacks** | Functions passed as parameters |
| **Arrow Functions** | Concise syntax, lexical `this` binding |
| **Type Guards** | Narrow types with `is` keyword |
| **Async Functions** | Return `Promise<T>` for async operations |

---

## Resources

- [TypeScript Handbook: Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Effective TypeScript](https://effectivetypescript.com/)

