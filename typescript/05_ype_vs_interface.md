# TypeScript — Type Aliases & Interface vs Type Alias

A complete reference guide covering `type` aliases in depth and a detailed comparison with `interface`.

---

## 1. What Is a Type Alias?

A **type alias** gives a name to any type — not just object shapes. Unlike an interface, it can represent primitives, unions, intersections, tuples, and more.

```ts
type Point = {
  x: number;
  y: number;
};

let point: Point = { x: 10, y: 20 };
```

The keyword is `type`, and it uses `=` to assign a type expression to a name.

---

## 2. Type Alias for Primitives

Interfaces can only describe object shapes. Type aliases have no such restriction.

```ts
type Age = number;
type Username = string;
type IsActive = boolean;

let age: Age = 25;
let username: Username = "piyush123";
let isActive: IsActive = true;
```

This is useful for adding **semantic meaning** to primitives — `Age` and `number` are identical at runtime, but `Age` communicates intent.

---

## 3. Type Alias for Union Types

Unions are one of the most common reasons to reach for `type` over `interface`.

```ts
type ID = string | number;

let userId: ID = "piyush123"; // ✅ string
let productId: ID = 456;      // ✅ number
```

### Union of Literal Types (String Unions)

```ts
type Direction = "north" | "south" | "east" | "west";
type Status = "pending" | "active" | "inactive" | "banned";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

let dir: Direction = "north"; // ✅
// let bad: Direction = "up"; // ❌ Error
```

String unions are a powerful replacement for enums in many cases — they are simpler, have no runtime overhead, and autocomplete perfectly.

### Union of Object Types

```ts
type Cat = { meow(): void };
type Dog = { bark(): void };

type Pet = Cat | Dog;

function makeSound(pet: Pet) {
  if ("meow" in pet) {
    pet.meow();
  } else {
    pet.bark();
  }
}
```

---

## 4. Type Alias for Intersection Types (`&`)

An intersection combines multiple types into one. The resulting type must satisfy **all** members.

```ts
type HasName = { name: string };
type HasAge  = { age: number };

type Person = HasName & HasAge;

let person: Person = { name: "Piyush", age: 26 }; // must have both
```

This is the `type` equivalent of `interface extends`, but composable on the fly.

```ts
type AdminUser = Person & {
  role: "admin";
  permissions: string[];
};
```

---

## 5. Type Alias for Tuples

Tuples are fixed-length arrays where each position has a specific type.

```ts
type Coordinate = [number, number];
type RGB = [number, number, number];
type NameAge = [string, number];

let coord: Coordinate = [10, 20];
let color: RGB = [255, 128, 0];
let user: NameAge = ["Piyush", 26];
```

### Named Tuple Elements (TypeScript 4.0+)

```ts
type Coordinate = [x: number, y: number];
type Range = [min: number, max: number];

// Named labels appear in IDE tooltips — no runtime difference
```

### Tuple with Rest Elements

```ts
type AtLeastTwo = [number, number, ...number[]];

let scores: AtLeastTwo = [90, 85, 78, 92]; // ✅
```

---

## 6. Type Alias for Function Types

```ts
type Formatter = (value: string) => string;
type MathOp    = (a: number, b: number) => number;
type Callback  = (err: Error | null, result?: string) => void;

const toUpper: Formatter = (s) => s.toUpperCase();
const add: MathOp = (a, b) => a + b;
```

---

## 7. Generic Type Aliases

Type aliases support generics, just like interfaces.

```ts
type Maybe<T> = T | null | undefined;
type Pair<A, B> = { first: A; second: B };
type ApiResponse<T> = {
  data: T;
  status: number;
  error?: string;
};

let name: Maybe<string> = null;          // ✅
let entry: Pair<string, number> = { first: "score", second: 100 };
let res: ApiResponse<string[]> = { data: ["a", "b"], status: 200 };
```

---

## 8. Utility Types (Built on Type Aliases)

TypeScript's built-in utility types are all implemented as generic type aliases. Understanding this helps you write your own.

```ts
// Partial — all properties become optional
type PartialUser = Partial<{ name: string; age: number }>;
// → { name?: string; age?: number }

// Required — all properties become required
type RequiredUser = Required<{ name?: string; age?: number }>;
// → { name: string; age: number }

// Readonly — all properties become readonly
type FrozenUser = Readonly<{ name: string; age: number }>;

// Pick — keep only selected keys
type UserPreview = Pick<{ name: string; age: number; email: string }, "name" | "email">;
// → { name: string; email: string }

// Omit — drop selected keys
type WithoutEmail = Omit<{ name: string; age: number; email: string }, "email">;
// → { name: string; age: number }

// Record — map keys to a value type
type Scores = Record<string, number>;
// → { [key: string]: number }

// Extract / Exclude — filter union members
type OnlyString = Extract<string | number | boolean, string>; // → string
type NoBoolean  = Exclude<string | number | boolean, boolean>; // → string | number

// ReturnType — extract a function's return type
function getUser() { return { name: "Piyush", age: 26 }; }
type UserType = ReturnType<typeof getUser>; // → { name: string; age: number }
```

---

## 9. Conditional Types

Only possible with `type`, not `interface`.

```ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"
```

### Practical example — unwrap an array type:

```ts
type Unwrap<T> = T extends Array<infer Item> ? Item : T;

type A = Unwrap<string[]>;  // string
type B = Unwrap<number>;    // number
```

---

## 10. Mapped Types

Also exclusive to `type`.

```ts
type Flags<T> = {
  [K in keyof T]: boolean;
};

type UserFlags = Flags<{ name: string; age: number }>;
// → { name: boolean; age: boolean }
```

### Making all properties optional (how `Partial<T>` works internally):

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

---

---

## 11. Interface vs Type Alias — Full Comparison

### Side-by-side Syntax

```ts
// Object shape with interface
interface UserI {
  name: string;
  age: number;
}

// Object shape with type alias
type UserT = {
  name: string;
  age: number;
};

// Both produce identical behavior for object shapes
```

---

### Extending / Composing

```ts
// Interface uses `extends`
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// Type alias uses intersection `&`
type Animal = { name: string };
type Dog = Animal & { breed: string };
```

Both produce the same result, but `interface extends` gives a cleaner error message when types are incompatible.

---

### Declaration Merging (Interface ONLY)

Declaring the same interface name twice **merges** them. This is unique to interfaces.

```ts
interface Config {
  debug: boolean;
}

interface Config {
  version: string;
}

// TypeScript sees this as:
// interface Config { debug: boolean; version: string; }

const cfg: Config = { debug: true, version: "1.0" }; // ✅
```

Type aliases will throw an error on duplicate names:

```ts
type Config = { debug: boolean };
// type Config = { version: string }; // ❌ Error: Duplicate identifier 'Config'
```

**When it matters:** Libraries like `@types/node` and framework type definitions use declaration merging to let you augment existing types without touching the source.

---

### Unions — Type Alias ONLY

Interfaces cannot describe union types.

```ts
type Result = "success" | "failure" | "pending"; // ✅ only possible with type

// interface Result = ??? // ❌ Not possible
```

---

### Conditional & Mapped Types — Type Alias ONLY

```ts
type NonNullable<T> = T extends null | undefined ? never : T; // ✅ type only
type Readonly<T> = { readonly [K in keyof T]: T[K] };         // ✅ type only
```

---

### `implements` in Classes — Both Work

```ts
interface Printable { print(): void; }
type Loggable = { log(): void };

class Report implements Printable, Loggable {
  print() { console.log("printing..."); }
  log()   { console.log("logging..."); }
}
```

Both `interface` and `type` can be used with `implements`.

---

### Error Messages

When a type mismatch occurs, `interface` tends to produce more readable errors because TypeScript refers to the named interface directly. Type aliases sometimes get expanded inline in error output.

```ts
interface Point { x: number; y: number }
// Error: Argument of type '{ x: number }' is not assignable to parameter of type 'Point'.
// Missing property 'y'.

type Point = { x: number; y: number }
// Error: Argument of type '{ x: number }' is not assignable to parameter of type '{ x: number; y: number }'.
// (inline expansion — less clean in complex types)
```

---

### Comparison Table

| Feature                            | `interface` | `type`  |
|------------------------------------|:-----------:|:-------:|
| Object shapes                      | ✅           | ✅       |
| Primitives (`type Age = number`)   | ❌           | ✅       |
| Union types (`A \| B`)             | ❌           | ✅       |
| Intersection (`A & B`)             | via `extends`| ✅      |
| Tuples                             | ❌           | ✅       |
| Conditional types                  | ❌           | ✅       |
| Mapped types                       | ❌           | ✅       |
| Declaration merging                | ✅           | ❌       |
| `extends` keyword                  | ✅           | ❌       |
| `implements` in classes            | ✅           | ✅       |
| Generic support                    | ✅           | ✅       |
| Cleaner error messages             | ✅           | sometimes|
| Used with utility types internally | ❌           | ✅       |

---

## 12. When to Use Which

### Use `interface` when:

- Defining the **shape of an object** or class contract.
- Building a **public API** or library — interfaces are easier to extend downstream.
- You want **declaration merging** (e.g., extending third-party types).
- Defining class `implements` contracts.

```ts
interface Repository<T> {
  findById(id: number): T | null;
  save(entity: T): void;
  delete(id: number): void;
}
```

### Use `type` when:

- Defining **union types** (`"GET" | "POST"`, `string | number`).
- Working with **tuples** or fixed-length arrays.
- Writing **conditional** or **mapped** types.
- Aliasing **primitives** for semantic clarity.
- Composing complex types from multiple sources.

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Nullable<T> = T | null;
type Coordinates = [lat: number, lng: number];
```

---

## 13. Real-World Patterns

### Pattern 1 — Domain model with interface, utilities with type

```ts
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

type CreateUserDto  = Omit<User, "id">;
type UpdateUserDto  = Partial<CreateUserDto>;
type UserSummary    = Pick<User, "id" | "name">;
```

### Pattern 2 — API response shape

```ts
type ApiStatus = "idle" | "loading" | "success" | "error";

interface ApiState<T> {
  status: ApiStatus;
  data: T | null;
  error: string | null;
}
```

### Pattern 3 — Event system

```ts
type EventMap = {
  click:  { x: number; y: number };
  keyup:  { key: string; code: string };
  resize: { width: number; height: number };
};

type EventName    = keyof EventMap;
type EventPayload<E extends EventName> = EventMap[E];
```

---

## Quick Reference Card

```ts
// ── Type Alias ──────────────────────────────────────
type ID           = string | number;                  // union
type Point        = { x: number; y: number };          // object
type Coords       = [number, number];                  // tuple
type Greet        = (name: string) => string;          // function
type Maybe<T>     = T | null | undefined;              // generic
type IsStr<T>     = T extends string ? true : false;  // conditional
type Flags<T>     = { [K in keyof T]: boolean };      // mapped

// ── Interface ────────────────────────────────────────
interface Shape { color: string; area(): number }      // object + method
interface Named extends Shape { name: string }         // extends
interface Named { alias: string }                      // merges with above ✅
```

---

## Key Takeaways

- `type` can represent **anything** — primitives, unions, tuples, functions, conditionals.
- `interface` is purpose-built for **object shapes** and class contracts.
- Only `interface` supports **declaration merging** — critical for library augmentation.
- Only `type` supports **union types**, **conditional types**, and **mapped types**.
- Both support generics and can be used with `implements`.
- In practice: **interface for objects and APIs**, **type for everything else**.
