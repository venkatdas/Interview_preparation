# TypeScript — Literal Types

A complete reference guide for string, number, boolean, and template literal types in TypeScript.

---

## 1. What Are Literal Types?

A **literal type** is a type that represents a single, exact value — not just the general category of `string` or `number`, but a *specific* value like `"north"` or `42`.

```ts
// General type — any string is fine
let direction: string = "north"; // ✅ "south", "anything" also fine

// Literal type — only "north" is allowed
let direction: "north" = "north"; // ✅
// direction = "south";           // ❌ Error: '"south"' not assignable to '"north"'
```

Literal types become truly powerful when combined with **unions**.

---

## 2. String Literal Types

```ts
type Direction = "north" | "south" | "east" | "west";
type Status    = "pending" | "active" | "inactive" | "banned";
type Alignment = "left" | "center" | "right";
type Theme     = "light" | "dark" | "system";

let dir: Direction = "north"; // ✅
// let dir: Direction = "up"; // ❌ Error
```

### String literals in functions

```ts
function move(direction: "up" | "down" | "left" | "right"): void {
  console.log(`Moving ${direction}`);
}

move("up");    // ✅
move("left");  // ✅
// move("diagonal"); // ❌ Error
```

### Return type as string literal

```ts
function getTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const theme = getTheme(); // type: "light" | "dark"
```

---

## 3. Number Literal Types

```ts
type DiceRoll   = 1 | 2 | 3 | 4 | 5 | 6;
type ZeroOrOne  = 0 | 1;
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

let roll: DiceRoll = 4;   // ✅
// let roll: DiceRoll = 7; // ❌ Error

function respond(status: 200 | 404 | 500): string {
  switch (status) {
    case 200: return "OK";
    case 404: return "Not Found";
    case 500: return "Server Error";
  }
}
```

---

## 4. Boolean Literal Types

```ts
type AlwaysTrue  = true;
type AlwaysFalse = false;

// Rarely used alone, but useful in conditional/mapped types
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

---

## 5. Literal Type Widening

This is one of the most important — and surprising — behaviours of literal types.

When you declare a variable with `let`, TypeScript **widens** the inferred type to the general category. When you use `const`, it **narrows** to the exact literal type.

```ts
let a   = "hello";  // inferred as: string   (widened)
const b = "hello";  // inferred as: "hello"  (literal — const can't change)

let c   = 42;       // inferred as: number   (widened)
const d = 42;       // inferred as: 42       (literal)

let e   = true;     // inferred as: boolean  (widened)
const f = true;     // inferred as: true     (literal)
```

### Why this matters

```ts
type Direction = "north" | "south" | "east" | "west";

function move(direction: Direction): void { }

let dir = "north";   // TypeScript infers: string
move(dir);           // ❌ Error: string is not assignable to Direction

const dir2 = "north"; // TypeScript infers: "north"
move(dir2);           // ✅ "north" is assignable to Direction
```

---

## 6. The `as const` Assertion

`as const` tells TypeScript to infer the **narrowest possible type** — every value becomes a literal, and every property becomes `readonly`.

```ts
// Without as const
const config = {
  host: "localhost",
  port: 3000,
  env: "development",
};
// config.host → string, config.port → number

// With as const
const config = {
  host: "localhost",
  port: 3000,
  env: "development",
} as const;
// config.host → "localhost"  (literal)
// config.port → 3000         (literal)
// config.env  → "development" (literal)
// All properties are readonly
```

### `as const` on arrays

```ts
const ROLES = ["admin", "editor", "viewer"] as const;
// type: readonly ["admin", "editor", "viewer"]
// Not string[] — each position is a specific literal

type Role = typeof ROLES[number]; // "admin" | "editor" | "viewer"
```

### `as const` on a single value

```ts
let direction = "north" as const;
// direction: "north"  (literal, even though it's let)

function move(d: "north" | "south") {}
move(direction); // ✅
```

---

## 7. `typeof` + `as const` Pattern

Derive a union type directly from a constant array — the single source of truth pattern.

```ts
const COLORS = ["red", "green", "blue", "yellow"] as const;

type Color = typeof COLORS[number];
// type Color = "red" | "green" | "blue" | "yellow"

function paintWith(color: Color): void {
  console.log(`Painting with ${color}`);
}

paintWith("red");    // ✅
// paintWith("pink"); // ❌ Error
```

When you add a new item to `COLORS`, the `Color` type updates **automatically** — no manual union to maintain.

```ts
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
type HttpMethod = typeof HTTP_METHODS[number];
// "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
```

---

## 8. Object Literal Types with `as const`

```ts
const STATUS = {
  PENDING:  "pending",
  ACTIVE:   "active",
  INACTIVE: "inactive",
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
// "pending" | "active" | "inactive"

function setStatus(s: Status): void { }

setStatus(STATUS.ACTIVE);   // ✅
setStatus("pending");        // ✅ literal "pending" is assignable
// setStatus("unknown");     // ❌ Error
```

This pattern is the modern, type-safe alternative to `enum`.

---

## 9. Literal Types vs Enum

Both solve the same problem — restricting a value to a known set. Here's how they compare.

```ts
// Enum approach
enum Direction {
  North = "north",
  South = "south",
  East  = "east",
  West  = "west",
}

// Literal union approach
type Direction = "north" | "south" | "east" | "west";
```

| Feature                  | `enum`                  | Literal Union / `as const` |
|--------------------------|:-----------------------:|:--------------------------:|
| Runtime object exists    | ✅ yes                   | ❌ erased at compile time   |
| Tree-shakeable           | ❌                       | ✅                          |
| Autocomplete             | ✅                       | ✅                          |
| Reverse mapping          | ✅ (numeric only)        | ❌                          |
| Use as value at runtime  | ✅                       | ✅ (with `as const`)        |
| Serialization (JSON)     | needs mapping           | works natively              |
| Nominal vs structural    | nominal (strict)        | structural                  |

**Recommendation:** Prefer literal unions and `as const` for most use cases. Use `enum` when you need reverse mapping or a runtime object.

---

## 10. Template Literal Types

TypeScript 4.1+ allows constructing new string literal types using template syntax.

```ts
type Greeting = `Hello, ${string}`;  // any string starting with "Hello, "

let g: Greeting = "Hello, Piyush";   // ✅
// let g: Greeting = "Hi, Piyush";   // ❌ Error
```

### Combining literal unions in templates

When you use a union inside a template literal, TypeScript **distributes** across all combinations.

```ts
type Color    = "red" | "green" | "blue";
type Shade    = "light" | "dark";

type ColorShade = `${Shade}-${Color}`;
// "light-red" | "light-green" | "light-blue" |
// "dark-red"  | "dark-green"  | "dark-blue"
```

### CSS property pattern

```ts
type Side      = "top" | "right" | "bottom" | "left";
type CSSMargin = `margin-${Side}`;
// "margin-top" | "margin-right" | "margin-bottom" | "margin-left"

type CSSPadding = `padding-${Side}`;
// "padding-top" | "padding-right" | "padding-bottom" | "padding-left"
```

### Event name pattern

```ts
type Entity = "user" | "product" | "order";
type Action = "created" | "updated" | "deleted";

type EventName = `${Entity}:${Action}`;
// "user:created"    | "user:updated"    | "user:deleted"
// "product:created" | "product:updated" | "product:deleted"
// "order:created"   | "order:updated"   | "order:deleted"

function on(event: EventName, handler: () => void): void { }

on("user:created", () => console.log("new user"));   // ✅
// on("user:banned", () => {}); // ❌ Error
```

---

## 11. Template Literal Intrinsic Types

TypeScript provides built-in string manipulation types:

```ts
type U = Uppercase<"hello">;    // "HELLO"
type L = Lowercase<"WORLD">;    // "world"
type C = Capitalize<"hello">;   // "Hello"
type N = Uncapitalize<"Hello">; // "hello"
```

### Practical: generate getter names

```ts
type PropName = "name" | "age" | "email";
type Getter   = `get${Capitalize<PropName>}`;
// "getName" | "getAge" | "getEmail"

type Setter = `set${Capitalize<PropName>}`;
// "setName" | "setAge" | "setEmail"
```

---

## 12. Literal Types in Discriminated Unions (Revisited)

Literal types are the **backbone** of discriminated unions — the literal property is what TypeScript uses to narrow.

```ts
type LoadingState = {
  status: "loading";                     // literal discriminant
};

type SuccessState<T> = {
  status: "success";                     // literal discriminant
  data: T;
};

type ErrorState = {
  status: "error";                       // literal discriminant
  message: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function render<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "loading": return "Loading...";
    case "success": return `Data: ${JSON.stringify(state.data)}`;
    case "error":   return `Error: ${state.message}`;
  }
}
```

---

## 13. Literal Types in Function Overloads

Use literal parameter types to give different return types based on input value.

```ts
function createElement(tag: "a"):        HTMLAnchorElement;
function createElement(tag: "canvas"):   HTMLCanvasElement;
function createElement(tag: "table"):    HTMLTableElement;
function createElement(tag: string):     HTMLElement;
function createElement(tag: string):     HTMLElement {
  return document.createElement(tag);
}

const anchor = createElement("a");     // type: HTMLAnchorElement ✅
const canvas = createElement("canvas");// type: HTMLCanvasElement ✅
const div    = createElement("div");   // type: HTMLElement
```

---

## 14. `satisfies` Operator with Literal Types (TS 4.9+)

`satisfies` validates a value against a type without widening it.

```ts
type Palette = "red" | "green" | "blue";

// Problem with plain type annotation — values widen to string
const palette: Record<Palette, string> = {
  red:   "#FF0000",
  green: "#00FF00",
  blue:  "#0000FF",
};
palette.red; // type: string — we lost the literal info

// With satisfies — values stay as their inferred literal types
const palette2 = {
  red:   "#FF0000",
  green: "#00FF00",
  blue:  "#0000FF",
} satisfies Record<Palette, string>;

palette2.red; // type: "#FF0000" — literal preserved ✅
```

---

## 15. Common Patterns Summary

### Pattern 1 — Config options

```ts
type LogLevel  = "debug" | "info" | "warn" | "error";
type SortOrder = "asc" | "desc";

interface QueryOptions {
  sortBy:    string;
  order:     SortOrder;
  logLevel:  LogLevel;
  limit:     1 | 10 | 25 | 50 | 100;
}
```

### Pattern 2 — Derive union from object keys

```ts
const routes = {
  home:    "/",
  about:   "/about",
  contact: "/contact",
} as const;

type RouteName = keyof typeof routes;     // "home" | "about" | "contact"
type RoutePath = typeof routes[RouteName];// "/" | "/about" | "/contact"
```

### Pattern 3 — Branded / opaque types with literals

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId    = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

declare function getUser(id: UserId): void;

const uid = 1 as UserId;
const pid = 1 as ProductId;

getUser(uid); // ✅
// getUser(pid); // ❌ ProductId is not UserId — even though both are number
```

---

## Quick Reference Card

```ts
// ── String Literals ──────────────────────────────────
type Dir     = "north" | "south" | "east" | "west";
type Status  = "ok" | "error" | "loading";

// ── Number Literals ──────────────────────────────────
type Dice    = 1 | 2 | 3 | 4 | 5 | 6;
type Binary  = 0 | 1;

// ── Boolean Literals ─────────────────────────────────
type Yes     = true;
type No      = false;

// ── Widening: let vs const ───────────────────────────
let  a = "hello";       // string  (widened)
const b = "hello";      // "hello" (literal)
let  c = "hi" as const; // "hi"    (forced literal)

// ── as const ─────────────────────────────────────────
const DIRS = ["N", "S", "E", "W"] as const;
type Dir = typeof DIRS[number];         // "N" | "S" | "E" | "W"

const CONFIG = { env: "prod" } as const;
type Env = typeof CONFIG["env"];        // "prod"

// ── Template Literals ────────────────────────────────
type Side    = "top" | "bottom";
type Padding = `padding-${Side}`;       // "padding-top" | "padding-bottom"

type Upper   = Uppercase<"hello">;      // "HELLO"
type Cap     = Capitalize<"world">;     // "World"

// ── Discriminated Union ───────────────────────────────
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; data: string };
```

---

## Key Takeaways

- A literal type represents a **single exact value** rather than a general category.
- `const` variables infer literal types; `let` variables widen to the general type.
- Use `as const` to freeze objects and arrays into their narrowest literal types.
- The `typeof arr[number]` pattern derives a union type from an `as const` array — a single source of truth.
- Template literal types compose string literal unions into all valid combinations automatically.
- Literal types are the discriminant in **discriminated unions** — the key that powers exhaustive `switch` checking.
- Prefer literal unions over `enum` for most use cases — they're simpler, tree-shakeable, and serialize naturally.
- `satisfies` (TS 4.9+) validates a type without widening the inferred literal values.
