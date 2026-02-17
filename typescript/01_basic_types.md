# TypeScript Fundamentals

A reference guide covering the core type system features of TypeScript — from basic primitives to object types and type aliases.

---

## Primitives

The three foundational types in TypeScript mirror JavaScript's primitive values.

```typescript
let age: number = 20;
let userName: string = "Max";
let isInstructor: boolean = true;
```

| Type | Description | Example |
|------|-------------|---------|
| `number` | Integers and floating-point values | `20`, `3.14` |
| `string` | Text values | `"Max"` |
| `boolean` | True/false flags | `true`, `false` |

---

## Arrays

Arrays are typed by specifying the element type followed by `[]`.

```typescript
let hobbies: string[] = ["Sports", "Cooking"];
let numbers: number[] = [1, 2, 3];
```

TypeScript will enforce that **every element** matches the declared type. Pushing a `number` into a `string[]` will produce a compile-time error.

---

## Tuples

Tuples are fixed-length arrays where **each position has a specific type**.

```typescript
let person: [string, number] = ["Max", 20];
```

Unlike a regular array, the order matters:
- `person[0]` must be a `string`
- `person[1]` must be a `number`

> **Use case:** Representing structured pairs or records — e.g., `[key, value]` entries, or `[x, y]` coordinates.

---

## Enums

Enums define a **set of named constants**, making code self-documenting. By default, values start at `0` and auto-increment.

```typescript
enum Color {
  Red,   // 0
  Green, // 1
  Blue,  // 2
}

let myColor: Color = Color.Green;
console.log(myColor); // Output: 1
```

### Why Use Enums?

Enums eliminate confusing "magic numbers" or strings from your logic.

```typescript
// ❌ Without enum — what does 0 mean?
function setStatus(status: number) {
  if (status === 0) console.log("pending");
  if (status === 1) console.log("approved");
  if (status === 2) console.log("rejected");
}

setStatus(0); // Unclear intent
```

```typescript
// ✅ With enum — intent is immediately clear
enum ApprovalStatus {
  Pending  = 0,
  Approved = 1,
  Rejected = 2,
}

function setStatus(status: ApprovalStatus) {
  if (status === ApprovalStatus.Pending) console.log("pending");
}

setStatus(ApprovalStatus.Pending); // Self-documenting
```

> **Tip:** You can assign custom values to enum members (numbers or strings) to align with API responses or database values.

---

## `any`

The `any` type opts a variable out of type checking entirely.

```typescript
let anyValue: any = 5;
anyValue = "Now I'm a string";
anyValue = true; // No errors — but no safety either
```

> ⚠️ **Avoid `any` whenever possible.** It defeats the purpose of TypeScript and can hide bugs that only surface at runtime. Prefer `unknown` if you genuinely don't know the type at design time.

---

## `void`

`void` is used as the return type for functions that **do not return a value**.

```typescript
function logMessage(message: string): void {
  console.log(message);
}
```

Think of `void` as the opposite of a value — it signals to callers that this function is called purely for its **side effects**.

---

## `never`

`never` represents values that **never occur** — used for functions that either always throw or run forever.

```typescript
// Always throws — never returns normally
function throwError(message: string): never {
  throw new Error(message);
}

// Infinite loop — never terminates
function infiniteLoop(): never {
  while (true) {}
}
```

### `void` vs `never`

| Type | Meaning | Example |
|------|---------|---------|
| `void` | Returns, but with no useful value | `console.log(...)` |
| `never` | Does **not** return at all | `throw`, infinite loops |

> **Advanced use:** The TypeScript compiler uses `never` in exhaustive checks — if a switch statement covers all enum cases, the `default` branch has type `never`.

---

## Object Types

You can define the shape of an object using a `type` alias.

```typescript
type User = {
  name: string;
  age: number;
};

let user: User = {
  name: "Max",
  age: 20,
};

function printUser(user: User): void {
  console.log(`Name: ${user.name}, Age: ${user.age}`);
}

printUser(user); // Name: Max, Age: 20
```

TypeScript will raise an error if:
- A required property is missing
- An extra (undeclared) property is added
- A property has the wrong type

> **Tip:** Use `?` to mark optional properties: `age?: number`

---

## Union Types

Union types allow a variable to hold **more than one type**.

```typescript
let unionValue: string | number = "Hello";
unionValue = 42; // Also valid
```

When working with unions, TypeScript narrows the type based on runtime checks:

```typescript
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows it's a string here
  }
  return value.toFixed(2); // TypeScript knows it's a number here
}
```

---

## Type Aliases

Type aliases create a **reusable name** for any type — objects, unions, primitives, and more.

```typescript
type Point = {
  x: number;
  y: number;
};

let point: Point = { x: 10, y: 20 };
```

### When to Use Type Aliases

- To give meaningful names to complex types
- To avoid repeating the same type definition in multiple places
- To compose multiple types together using unions (`|`) or intersections (`&`)

```typescript
type ID = string | number;         // Union alias
type Named = { name: string };
type Aged  = { age: number };
type Person = Named & Aged;        // Intersection alias
```

---

## Quick Reference

| Concept | Syntax | Purpose |
|---------|--------|---------|
| Primitive | `let x: number` | Basic value types |
| Array | `string[]` | Typed list |
| Tuple | `[string, number]` | Fixed-length typed array |
| Enum | `enum Status { ... }` | Named constant set |
| Any | `any` | Opt out of type checking |
| Void | `: void` | Function with no return value |
| Never | `: never` | Function that never returns |
| Object Type | `type User = { ... }` | Shape of an object |
| Union | `string \| number` | Multiple allowed types |
| Type Alias | `type Point = { ... }` | Reusable type name |
