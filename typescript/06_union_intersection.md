# TypeScript — Union Types & Intersection Types

A complete reference guide for `|` and `&` in TypeScript.

---

## Part 1 — Union Types (`|`)

---

### 1. What Is a Union Type?

A union type means a value can be **one of several types**. Use the pipe `|` to combine them.

```ts
let value: string | number;

value = "hello"; // ✅
value = 42;      // ✅
// value = true; // ❌ Error: boolean not in union
```

Think of `|` as **"or"** — this type is A **or** B **or** C.

---

### 2. Union with Primitives

```ts
type ID        = string | number;
type Booleanish = boolean | "true" | "false";
type MaybeDate  = Date | null;
type Nullable<T> = T | null;
type Optional<T> = T | null | undefined;

let userId: ID = "piyush123"; // ✅
let orderId: ID = 456;         // ✅
```

---

### 3. Union with Literal Types

Literal types restrict a value to **exact values** — like a string enum.

```ts
type Direction  = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Status     = "pending" | "active" | "inactive" | "banned";
type Coin       = "heads" | "tails";

let dir: Direction = "north"; // ✅
// let dir: Direction = "up"; // ❌ Error
```

This pattern is often preferred over `enum` — it's simpler, has no runtime overhead, and works naturally with autocomplete.

---

### 4. Union with Object Types

```ts
type Circle = {
  kind: "circle";
  radius: number;
};

type Rectangle = {
  kind: "rectangle";
  width: number;
  height: number;
};

type Shape = Circle | Rectangle;

let s: Shape = { kind: "circle", radius: 10 };    // ✅
let r: Shape = { kind: "rectangle", width: 5, height: 8 }; // ✅
```

---

### 5. Accessing Properties on Union Types

You can only access properties that exist on **all** members of the union without narrowing.

```ts
type Cat = { name: string; meow(): void };
type Dog = { name: string; bark(): void };

type Pet = Cat | Dog;

function greet(pet: Pet) {
  console.log(pet.name);   // ✅ exists on both
  // pet.meow();           // ❌ Error: not guaranteed to exist
}
```

To access type-specific properties, you must **narrow** the type first.

---

### 6. Type Narrowing with Union Types

Narrowing is how TypeScript figures out the **specific type** inside a union at a given point in the code.

#### `typeof` guard

```ts
type StringOrNumber = string | number;

function double(value: StringOrNumber): StringOrNumber {
  if (typeof value === "string") {
    return value.repeat(2);  // TypeScript knows: string here
  }
  return value * 2;           // TypeScript knows: number here
}
```

#### `in` operator guard

```ts
type Cat = { meow(): void };
type Dog = { bark(): void };

function makeSound(pet: Cat | Dog) {
  if ("meow" in pet) {
    pet.meow(); // ✅ Cat
  } else {
    pet.bark(); // ✅ Dog
  }
}
```

#### `instanceof` guard

```ts
function processDate(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString(); // Date
  }
  return new Date(value).toISOString(); // string
}
```

#### Truthiness guard

```ts
function printLength(value: string | null | undefined) {
  if (value) {
    console.log(value.length); // string (null/undefined filtered out)
  }
}
```

---

### 7. Discriminated Unions (Tagged Unions)

The most powerful union pattern. Each member has a **common literal property** (the discriminant) that TypeScript uses to narrow exhaustively.

```ts
type Circle    = { kind: "circle";    radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Triangle  = { kind: "triangle";  base: number;  height: number };

type Shape = Circle | Rectangle | Triangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;  // ✅ Circle
    case "rectangle":
      return shape.width * shape.height;   // ✅ Rectangle
    case "triangle":
      return 0.5 * shape.base * shape.height; // ✅ Triangle
  }
}
```

The `kind` property is the **discriminant** — it's the same key across all members but with unique literal values.

#### Exhaustiveness checking with `never`

Add a default case that assigns to `never`. If you add a new union member and forget to handle it, TypeScript will throw a compile-time error.

```ts
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
    case "triangle":  return 0.5 * shape.base * shape.height;
    default:
      const _exhaustive: never = shape; // ❌ Error if a case is missing
      return _exhaustive;
  }
}
```

---

### 8. Union in Function Parameters

```ts
function format(value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "number")  return value.toFixed(2);
  return value.trim();
}

format("  hello ");  // "hello"
format(3.14159);     // "3.14"
format(true);        // "yes"
```

---

### 9. Union with Arrays

```ts
type StringOrNumberArray = string[] | number[];      // array of one OR the other
type MixedArray          = (string | number)[];      // array containing either

let a: StringOrNumberArray = [1, 2, 3];       // ✅ number[]
let b: StringOrNumberArray = ["a", "b"];      // ✅ string[]
// let c: StringOrNumberArray = [1, "a"];     // ❌ mixed not allowed

let d: MixedArray = [1, "a", 2, "b"];         // ✅ mixed fine
```

---

### 10. `Extract` and `Exclude` — Filtering Union Members

```ts
type All = string | number | boolean | null;

type OnlyString  = Extract<All, string>;           // string
type NoNull      = Exclude<All, null>;             // string | number | boolean
type Primitives  = Extract<All, string | number>;  // string | number
```

`Extract<T, U>` keeps members assignable to `U`.
`Exclude<T, U>` removes members assignable to `U`.

---

---

## Part 2 — Intersection Types (`&`)

---

### 11. What Is an Intersection Type?

An intersection type **combines** multiple types into one. A value of an intersection type must satisfy **all** member types simultaneously.

```ts
type HasName = { name: string };
type HasAge  = { age: number };

type Person = HasName & HasAge;

let person: Person = { name: "Piyush", age: 26 }; // must have BOTH name and age
```

Think of `&` as **"and"** — this type is A **and** B **and** C.

---

### 12. Intersection of Object Types

```ts
type Addressable = {
  street: string;
  city: string;
};

type Contactable = {
  email: string;
  phone: string;
};

type Customer = Addressable & Contactable & {
  id: number;
  name: string;
};

let customer: Customer = {
  id: 1,
  name: "Piyush",
  street: "123 Main St",
  city: "Mumbai",
  email: "p@example.com",
  phone: "+91-9999999999",
};
```

---

### 13. Intersection vs `interface extends`

Both achieve the same result for object shapes, but with a key difference in **conflict handling**.

```ts
// Interface extends
interface A { x: number }
interface B extends A { y: number }
// Result: { x: number; y: number }

// Intersection
type A = { x: number };
type B = A & { y: number };
// Result: { x: number; y: number }
```

#### When property types conflict — the difference matters:

```ts
// Interface extends — compile-time error on declaration
interface A { value: string }
// interface B extends A { value: number } // ❌ Error immediately

// Intersection — no error on declaration, but `value` becomes `never`
type A = { value: string };
type B = { value: number };
type C = A & B;

let c: C = { value: ??? }; // value: string & number → never ❌
// There is no value that is both string AND number
```

With intersections, conflicting property types silently produce `never` — be cautious.

---

### 14. Intersection for Mixins / Role Composition

Intersections shine when composing behaviours from multiple sources.

```ts
type Serializable = {
  serialize(): string;
  deserialize(data: string): void;
};

type Loggable = {
  log(message: string): void;
};

type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type AuditedEntity = Serializable & Loggable & Timestamped & {
  id: number;
  name: string;
};
```

---

### 15. Intersection with Functions

Intersecting function types means the result must satisfy **all** signatures — it becomes an **overloaded** function type.

```ts
type Logger  = (message: string) => void;
type Counter = (count: number)  => void;

type LogAndCount = Logger & Counter;

// A value of LogAndCount must handle both call signatures
```

In practice, intersecting object types with callable signatures is more common:

```ts
type CallableConfig = {
  (url: string): Promise<Response>;  // callable
  baseUrl: string;                   // also has properties
  timeout: number;
};
```

---

### 16. Intersection with Generic Types

```ts
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b } as A & B;
}

const result = merge({ name: "Piyush" }, { age: 26 });
// result: { name: string } & { age: number }
// → { name: string; age: number }

console.log(result.name); // "Piyush"
console.log(result.age);  // 26
```

This generic `merge` function is a classic use of intersections.

---

### 17. Intersection with Optional & Readonly

```ts
type Base = {
  id: number;
  name: string;
};

type WithOptionalEmail = Base & {
  email?: string;
};

type ReadonlyBase = Readonly<Base> & {
  createdAt: Date;
};

let entity: ReadonlyBase = {
  id: 1,
  name: "Piyush",
  createdAt: new Date(),
};
// entity.id = 2; // ❌ readonly
```

---

---

## Part 3 — Union vs Intersection Side-by-Side

---

### 18. Core Mental Model

| Concept      | Symbol | Meaning          | Must satisfy |
|--------------|:------:|------------------|:------------:|
| Union        | `\|`   | A **or** B        | one of them  |
| Intersection | `&`    | A **and** B       | all of them  |

```ts
type A = { x: number };
type B = { y: number };

type AorB  = A | B;  // { x: number } OR { y: number } — needs x OR y (or both)
type AandB = A & B;  // needs BOTH x AND y
```

```ts
// Valid AorB values:
let v1: AorB = { x: 1 };         // ✅ satisfies A
let v2: AorB = { y: 2 };         // ✅ satisfies B
let v3: AorB = { x: 1, y: 2 };   // ✅ satisfies both (allowed)

// Valid AandB values:
let v4: AandB = { x: 1, y: 2 };  // ✅ must satisfy both
// let v5: AandB = { x: 1 };     // ❌ missing y
```

---

### 19. Property Availability

```ts
type Bird = { fly(): void; layEggs(): void };
type Fish = { swim(): void; layEggs(): void };

type BirdOrFish  = Bird | Fish;   // union
type BirdAndFish = Bird & Fish;   // intersection

declare let bf1: BirdOrFish;
bf1.layEggs(); // ✅ exists on both members
// bf1.fly();  // ❌ not guaranteed — only on Bird

declare let bf2: BirdAndFish;
bf2.fly();      // ✅ guaranteed — has all Bird methods
bf2.swim();     // ✅ guaranteed — has all Fish methods
bf2.layEggs();  // ✅ guaranteed
```

With a union you get the **intersection of available members** (only shared properties).
With an intersection you get the **union of available members** (all properties from all types).

> This is intentionally inverted from what you might expect — it's a common point of confusion.

---

### 20. Combining Union and Intersection

You can mix both in one type expression. `&` has higher precedence than `|`.

```ts
type A = { a: string };
type B = { b: string };
type C = { c: string };

// (A & B) | C — either has both a+b, or just c
type T = A & B | C;

let t1: T = { a: "x", b: "y" };     // ✅ satisfies A & B
let t2: T = { c: "z" };              // ✅ satisfies C
// let t3: T = { a: "x" };           // ❌ missing b, and missing c
```

Use parentheses to make intent explicit:

```ts
type AdminOrEditor = (Admin & Authenticated) | (Editor & Authenticated);
// vs
type AuthedAdminOrEditor = (Admin | Editor) & Authenticated;
// These are equivalent by distributive law, but parentheses add clarity
```

---

### 21. Real-World Patterns

#### Result / Either pattern

```ts
type Success<T> = { ok: true;  value: T };
type Failure<E> = { ok: false; error: E };
type Result<T, E = string> = Success<T> | Failure<E>;

function divide(a: number, b: number): Result<number> {
  if (b === 0) return { ok: false, error: "Division by zero" };
  return { ok: true, value: a / b };
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value); // ✅ TypeScript knows value exists
} else {
  console.log(result.error); // ✅ TypeScript knows error exists
}
```

#### Builder / Plugin composition

```ts
type BasePlugin = { name: string; version: string };
type HasUI      = { render(): JSX.Element };
type HasAPI     = { fetch(url: string): Promise<unknown> };

type UIPlugin  = BasePlugin & HasUI;
type APIPlugin = BasePlugin & HasAPI;
type FullPlugin = BasePlugin & HasUI & HasAPI;
```

#### Config with required + optional sections

```ts
type RequiredConfig = {
  apiKey: string;
  environment: "dev" | "staging" | "prod";
};

type OptionalConfig = {
  timeout?: number;
  retries?: number;
  debug?: boolean;
};

type AppConfig = RequiredConfig & OptionalConfig;

const config: AppConfig = {
  apiKey: "abc123",
  environment: "prod",
  timeout: 5000, // optional
};
```

---

## Quick Reference Card

```ts
// ── Union Types (|) ──────────────────────────────────
type ID      = string | number;             // primitive union
type Dir     = "N" | "S" | "E" | "W";       // literal union
type Shape   = Circle | Square | Triangle;  // object union

// Narrowing
if (typeof x === "string") { /* x is string */ }
if ("radius" in shape)     { /* shape is Circle */ }
if (x instanceof Date)     { /* x is Date */ }

// Discriminated union
switch (shape.kind) {
  case "circle":    /* ... */ break;
  case "rectangle": /* ... */ break;
  default: const _: never = shape; // exhaustiveness check
}

// Filter union members
type A = Extract<string | number | null, string>;  // string
type B = Exclude<string | number | null, null>;    // string | number

// ── Intersection Types (&) ──────────────────────────
type Person  = HasName & HasAge;            // combine objects
type Admin   = User & { role: "admin" };   // extend inline
function merge<A, B>(a: A, b: B): A & B   // generic merge
```

---

## Key Takeaways

- `|` means **or** — a value satisfies any one member; you can only safely access **shared** properties without narrowing.
- `&` means **and** — a value must satisfy all members; you can access **all** properties from every member.
- Use **discriminated unions** with a `kind` / `type` literal discriminant for clean, exhaustive pattern matching.
- Use **intersections** to compose object shapes, mix in behaviours, and implement generic merge functions.
- Conflicting property types in intersections produce `never` silently — watch for this.
- The property availability of union vs intersection is **inverted** from intuition: union gives fewer available properties, intersection gives more.
- Combine `|` and `|` freely — use parentheses to keep intent clear.
