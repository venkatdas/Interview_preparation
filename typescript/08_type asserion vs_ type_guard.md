# TypeScript — Type Assertions & Type Guards

A complete reference guide with in-depth explanations and interview-ready answers.

---

## Part 1 — Type Assertions

---

### 1. What Is a Type Assertion?

A **type assertion** is you telling TypeScript: *"Trust me — I know the type of this value better than you do."*

TypeScript's type checker is conservative. Sometimes you have context it doesn't — like knowing that a DOM element is definitely an `HTMLInputElement`, or that a value from an API is a specific shape. Type assertions let you override TypeScript's inferred type.

> **Important:** Type assertions are a **compile-time** feature only. They produce zero JavaScript output — no runtime check, no conversion, no casting. They are purely instructions to the type checker.

```ts
let someValue: unknown = "this is a string";

// TypeScript infers: unknown — it won't let you call .length
// You assert: "I know this is a string"
let strLength: number = (someValue as string).length;
```

---

### 2. Two Syntax Forms

TypeScript supports two syntaxes for type assertions — they are 100% equivalent.

```ts
let someValue: unknown = "this is a string";

// ── Form 1: as syntax (preferred) ────────────────────
let len1: number = (someValue as string).length;

// ── Form 2: angle-bracket syntax (legacy) ────────────
let len2: number = (<string>someValue).length;
```

**Always use `as` syntax.** The angle-bracket form is not allowed in `.tsx` files (React JSX) because `<string>` is ambiguous with JSX tags. `as` works everywhere.

---

### 3. When to Use Type Assertions

#### DOM element access

```ts
// getElementById returns HTMLElement | null
// You know it's a specific input element
const input = document.getElementById("email") as HTMLInputElement;
input.value = "user@example.com"; // ✅ .value exists on HTMLInputElement

// Without assertion, TypeScript would complain:
// const input2 = document.getElementById("email");
// input2.value; // ❌ Error: Property 'value' does not exist on 'HTMLElement'
```

#### Working with `unknown`

```ts
// unknown is the type-safe alternative to any
// You must assert before using it
async function fetchUser(): Promise<unknown> {
  const res = await fetch("/api/user");
  return res.json();
}

const user = await fetchUser();
const name = (user as { name: string }).name; // ✅
```

#### JSON parsing

```ts
interface Config {
  apiUrl: string;
  timeout: number;
}

const raw = JSON.parse(localStorage.getItem("config") || "{}");
const config = raw as Config; // tell TS what shape we expect
console.log(config.apiUrl);
```

---

### 4. `unknown` vs `any` — Why It Matters for Assertions

```ts
// any — no type safety, no need to assert
let a: any = "hello";
a.toUpperCase();  // ✅ TypeScript allows anything on any
a.nonExistent();  // ✅ No error — but crashes at runtime!

// unknown — type-safe, assertion required before use
let u: unknown = "hello";
// u.toUpperCase();           // ❌ Error: Object is of type 'unknown'
(u as string).toUpperCase();  // ✅ You explicitly assert first
```

`unknown` forces you to be deliberate. `any` opts out of the type system entirely. Prefer `unknown` for values whose type you don't know — like API responses, `JSON.parse`, `try/catch` error variables.

---

### 5. Double Assertion (Escape Hatch)

TypeScript blocks assertions that it considers impossible — when the types have no overlap. You can bypass this with a double assertion through `unknown` (or `any`).

```ts
const value = "hello" as unknown as number;
// string → unknown → number
// ⚠️ This compiles but is almost certainly wrong at runtime
```

```ts
// Real use case: forcing incompatible mock types in tests
const mockEvent = {} as unknown as MouseEvent;
```

> **Warning:** Double assertion is a code smell. It suppresses safety. Use it only in tests or when you have absolute certainty. If you find yourself doing this in production code, reconsider your design.

---

### 6. Non-Null Assertion Operator (`!`)

The `!` suffix is a special assertion that tells TypeScript: *"I know this value is not null or undefined."*

```ts
// querySelector returns Element | null
const button = document.querySelector(".submit")!; // assert: definitely not null
button.addEventListener("click", () => {}); // ✅ no null check needed

// Without !:
const button2 = document.querySelector(".submit");
// button2.addEventListener(...); // ❌ Error: possibly null
button2?.addEventListener("click", () => {}); // need optional chaining instead
```

```ts
// Common with Map
const map = new Map<string, number>();
map.set("a", 1);

const value = map.get("a")!; // get() returns number | undefined — assert it's there
console.log(value.toFixed(2)); // ✅
```

> **Use `!` sparingly.** Every `!` is a promise to TypeScript that you break if the value is actually null. Optional chaining (`?.`) and runtime checks are safer alternatives.

---

### 7. `as const` Assertion (Recap)

```ts
// Without as const — values widen to string, number
const config = { env: "production", port: 3000 };
// config.env → string

// With as const — values become exact literals, properties become readonly
const config = { env: "production", port: 3000 } as const;
// config.env → "production" (literal)
// config.port → 3000 (literal)
```

---

### 8. Type Assertion Pitfalls

#### Assertion does NOT convert — it only silences the checker

```ts
let value: unknown = "42";
let num = value as number; // ❌ No actual conversion!
console.log(num);           // "42" — still a string at runtime
console.log(num + 1);       // "421" — string concatenation, not addition!

// Do this instead:
let real = Number(value); // actual runtime conversion
```

#### Asserting without checking leads to runtime crashes

```ts
async function getUser() {
  const res = await fetch("/api/user");
  const data = await res.json();
  return data as { name: string; age: number }; // blind assertion
}

// If the API returns { error: "Not found" }:
const user = await getUser();
console.log(user.name.toUpperCase()); // 💥 Runtime crash: Cannot read properties of undefined
```

**This is why type guards exist** — they give you safety that assertions cannot.

---

---

## Part 2 — Type Guards

---

### 9. What Is a Type Guard?

A **type guard** is a runtime check that narrows a value's type within a specific block of code. After the check, TypeScript **automatically knows** the more specific type — no assertion needed.

```ts
function processValue(value: string | number): void {
  if (typeof value === "string") {
    // Here, TypeScript KNOWS value is string
    console.log(value.toUpperCase()); // ✅
  } else {
    // Here, TypeScript KNOWS value is number
    console.log(value.toFixed(2));    // ✅
  }
}
```

The critical difference from assertions:

| | Type Assertion | Type Guard |
|---|---|---|
| When it runs | Compile time only | Runtime |
| Safety | None — you can lie | Real — checks actual value |
| Syntax | `as Type` | `if`, `typeof`, `instanceof`, etc. |
| Narrows type | Yes | Yes |
| Can crash | Yes, if wrong | No — it verified first |

---

### 10. Built-in Type Guards

#### `typeof` guard

Works with: `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `function`, `object`

```ts
function format(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.trim().toLowerCase();    // string
  } else if (typeof value === "number") {
    return value.toFixed(2);              // number
  } else {
    return value ? "yes" : "no";          // boolean
  }
}
```

**Limitation:** `typeof null === "object"` — this is a JavaScript quirk. Always check for null separately.

```ts
function processObj(value: object | null): void {
  if (value !== null && typeof value === "object") {
    // safely object, not null
  }
}
```

---

#### `instanceof` guard

Works for class instances and built-in constructors (`Date`, `Error`, `Array`, `Map`, etc.).

```ts
class Dog { bark()  { console.log("Woof!"); } }
class Cat { meow()  { console.log("Meow!"); } }

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript narrows to Dog ✅
  } else {
    animal.meow(); // TypeScript narrows to Cat ✅
  }
}
```

```ts
// With built-ins
function processDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString(); // Date
  }
  return new Date(value).toISOString(); // string
}

// Error handling
function handleError(err: unknown): string {
  if (err instanceof Error) {
    return err.message; // ✅ .message is on Error
  }
  return String(err);
}
```

---

#### `in` operator guard

Checks if a **property exists** on an object. Works well for plain objects and interface discrimination.

```ts
type Admin  = { role: "admin"; permissions: string[] };
type User   = { role: "user";  email: string };

type Person = Admin | User;

function greet(person: Person): void {
  if ("permissions" in person) {
    // TypeScript narrows to Admin
    console.log(`Admin with ${person.permissions.length} permissions`);
  } else {
    // TypeScript narrows to User
    console.log(`User: ${person.email}`);
  }
}
```

```ts
interface Bird { fly(): void }
interface Fish { swim(): void }

function move(creature: Bird | Fish): void {
  if ("fly" in creature) {
    creature.fly();   // Bird ✅
  } else {
    creature.swim();  // Fish ✅
  }
}
```

---

#### Truthiness / equality guard

```ts
// null / undefined check
function printName(name: string | null | undefined): void {
  if (name) {
    console.log(name.toUpperCase()); // string (null/undefined are falsy)
  }
}

// Strict equality
function processId(id: string | number): void {
  if (id === 0) {
    // id is exactly 0 (number)
  }
}
```

---

### 11. User-Defined Type Guards (Predicate Functions)

When built-in guards aren't enough, you can write your own. The return type `value is Type` is the **type predicate** — it tells TypeScript how to narrow after a `true` result.

```ts
// Syntax: paramName is Type
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number): void {
  if (isString(value)) {
    console.log(value.toUpperCase()); // ✅ TypeScript knows: string
  } else {
    console.log(value.toFixed(2));    // ✅ TypeScript knows: number
  }
}
```

#### More user-defined type guard examples

```ts
interface Cat { meow(): void }
interface Dog { bark(): void }

function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal;
}

function isDog(animal: Cat | Dog): animal is Dog {
  return "bark" in animal;
}

// Checking for null/undefined
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const items = ["hello", null, "world", undefined, "!"];
const strings = items.filter(isDefined); // string[] — nulls removed ✅
```

#### Validating API response shapes

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value &&
    typeof (value as User).id === "number" &&
    typeof (value as User).name === "string" &&
    typeof (value as User).email === "string"
  );
}

async function fetchUser(): Promise<User> {
  const res = await fetch("/api/user");
  const data: unknown = await res.json();
  if (isUser(data)) {
    return data; // ✅ safe — actually validated at runtime
  }
  throw new Error("Invalid user data from API");
}
```

---

### 12. Assertion Functions (`asserts`)

TypeScript 3.7+. An assertion function **throws** if the condition is false — and TypeScript narrows the type for all code after the call.

```ts
// Syntax: asserts value is Type
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`Expected string, got ${typeof value}`);
  }
}

let input: unknown = "hello";
assertIsString(input);
// After this line, TypeScript knows input is string
console.log(input.toUpperCase()); // ✅

// ── asserting non-null ──────────────────────────────
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value must be defined");
  }
}

let el: HTMLElement | null = document.getElementById("app");
assertDefined(el);
el.style.display = "none"; // ✅ TypeScript knows el is HTMLElement
```

---

### 13. Discriminated Union Guards

The most robust pattern — use a shared literal property (the **discriminant**) to narrow.

```ts
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState   = { status: "error";   message: string };

type State = LoadingState | SuccessState | ErrorState;

function render(state: State): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data.join(", ");  // ✅ data exists on SuccessState
    case "error":
      return `Error: ${state.message}`; // ✅ message exists on ErrorState
    default:
      // Exhaustiveness check — if you add a new state and forget it, this errors
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
```

---

### 14. Type Guard in Array Filtering

`Array.filter()` loses type information by default. Use a type predicate to fix this.

```ts
const values = [1, null, 2, undefined, 3, null, 4];

// Without type guard — TypeScript thinks result is (number | null | undefined)[]
const nums1 = values.filter(v => v !== null && v !== undefined);

// With type guard — TypeScript correctly infers number[]
function isNumber(value: number | null | undefined): value is number {
  return value !== null && value !== undefined;
}

const nums2 = values.filter(isNumber); // number[] ✅
```

---

### 15. Combining Guards

You can combine multiple guards for precise narrowing.

```ts
type Input = string | number | null | undefined;

function process(value: Input): void {
  if (value === null || value === undefined) {
    console.log("No value");
    return;
  }

  // Here: value is string | number
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // string
  } else {
    console.log(value.toFixed(2));    // number
  }
}
```

---

---

## Part 3 — Interview Q&A

---

### Q1. What is the difference between type assertion and type casting?

**Answer:**
They sound similar but are fundamentally different. In languages like Java/C#, casting performs a **runtime conversion** — it changes the value. In TypeScript, `as Type` is a **type assertion** — it's purely a compile-time instruction that produces zero JavaScript output. No conversion happens. If you assert `"42" as number`, the value is still the string `"42"` at runtime. TypeScript simply stops complaining about the type. This is why incorrect assertions cause runtime crashes that TypeScript cannot warn you about.

---

### Q2. When would you use a type assertion vs a type guard?

**Answer:**
Use a **type guard** whenever you can — it performs an actual runtime check, so it's safe. TypeScript will narrow the type automatically inside the `if` block, and your code is protected against wrong assumptions.

Use a **type assertion** only when you have knowledge that TypeScript cannot infer — such as working with DOM APIs where `getElementById` returns `HTMLElement | null` but you know the specific element type, or when integrating with untyped third-party code. Even then, consider whether a type guard would be cleaner.

Never use an assertion to "silence" an error without understanding why TypeScript flagged it.

---

### Q3. What is a type predicate? Write an example.

**Answer:**
A type predicate is a special return type syntax for user-defined type guard functions: `paramName is SomeType`. When the function returns `true`, TypeScript narrows the type of that parameter to `SomeType` in the calling scope.

```ts
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function handleCatch(e: unknown) {
  if (isError(e)) {
    console.log(e.message); // TypeScript knows: Error
  } else {
    console.log(String(e));
  }
}
```

Without the `value is Error` predicate (if you just returned `boolean`), TypeScript would not narrow the type inside the `if` block.

---

### Q4. What is the difference between `unknown` and `any`? How does each relate to assertions?

**Answer:**
Both `unknown` and `any` can hold any value. The difference is safety:

- `any` disables type checking entirely. You can call any method, access any property — TypeScript will not complain. No assertions needed, but you lose all safety guarantees.
- `unknown` is the safe counterpart. TypeScript prevents you from using the value until you either assert its type or narrow it with a type guard. It forces deliberate handling.

```ts
let a: any = "hello";
a.toFixed(2); // ✅ TypeScript allows it — will crash at runtime

let u: unknown = "hello";
// u.toFixed(2);          // ❌ TypeScript blocks this
(u as string).length;     // ✅ assertion required first
```

Use `unknown` for API responses, `JSON.parse`, `try/catch` error variables — anything whose type you genuinely don't know at compile time.

---

### Q5. What is the `!` (non-null assertion) operator and when should you avoid it?

**Answer:**
The `!` suffix operator tells TypeScript that the value is definitely not `null` or `undefined`. It's a shorthand assertion that removes `null | undefined` from the type.

```ts
const el = document.getElementById("app")!; // HTMLElement (not null)
```

You should avoid `!` when the value might genuinely be null at runtime — each `!` is a lie you tell TypeScript, and if wrong, it causes an unhandled runtime crash. Prefer optional chaining (`?.`), nullish coalescing (`??`), or explicit null checks. Reserve `!` for cases where you have absolute certainty, such as after a required DOM element that is always present in the HTML.

---

### Q6. What is a discriminated union and how do type guards work with it?

**Answer:**
A discriminated union is a union of object types that all share a common **literal property** (the discriminant) with unique values per member. TypeScript uses that literal property to narrow the union in `if`/`switch` statements without needing any explicit assertion.

```ts
type Shape =
  | { kind: "circle";    radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2; // ✅ narrowed to Circle
  }
  return shape.width * shape.height;    // ✅ narrowed to Rectangle
}
```

The `kind` check is the type guard. TypeScript inspects the literal value and narrows the type automatically. Adding a `default: const _: never = shape` case gives exhaustiveness checking — a compile error if you forget to handle a new union member.

---

### Q7. What is an assertion function (`asserts`) and how does it differ from a type predicate?

**Answer:**
Both are user-defined type guards, but they work differently:

A **type predicate** returns `boolean`. If `true`, TypeScript narrows inside the `if` block where it's called.

```ts
function isString(v: unknown): v is string {
  return typeof v === "string";
}
if (isString(x)) { /* x is string here */ }
```

An **assertion function** returns `void` but **throws** if the condition fails. TypeScript narrows the type for all code **after** the call — no `if` block needed.

```ts
function assertString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("Not a string");
}
assertString(x);
// x is string from here on ✅
```

Use type predicates for conditional branching; use assertion functions when failure should halt execution.

---

### Q8. Why is double assertion (`as unknown as T`) a code smell?

**Answer:**
TypeScript blocks assertions between types with no overlap precisely because it's almost certainly a mistake. Double assertion bypasses that safety by routing through `unknown` (which is compatible with everything). It tells TypeScript *"I know better than you"* on a case where the types are so different that TypeScript itself refuses to trust you.

```ts
const num = "hello" as unknown as number; // compiles — but wrong at runtime
```

Every double assertion is a point where TypeScript's type system gives you no protection. It's acceptable in test code (forcing mock types) or very narrow interoperability scenarios, but in production logic it almost always indicates a design problem — usually that a function signature or interface is modelling the data incorrectly.

---

## Quick Reference Card

```ts
// ── Type Assertions ──────────────────────────────────
const input = el as HTMLInputElement;          // as syntax (preferred)
const input = <HTMLInputElement>el;            // angle-bracket (avoid in .tsx)
const definite = maybeNull!;                   // non-null assertion
const frozen = { a: 1 } as const;             // literal freeze
const override = x as unknown as number;      // double assertion (⚠️ code smell)

// ── Built-in Type Guards ─────────────────────────────
typeof x === "string"                          // primitive check
x instanceof Date                              // class instance check
"fly" in creature                              // property existence check
if (x) { }                                     // truthiness check
if (x !== null && x !== undefined) { }         // null/undefined check

// ── User-Defined Type Guard ──────────────────────────
function isUser(v: unknown): v is User {
  return typeof v === "object" && v !== null && "id" in v;
}

// ── Assertion Function ───────────────────────────────
function assertDefined<T>(v: T | null): asserts v is T {
  if (v === null) throw new Error("null!");
}

// ── Discriminated Union ───────────────────────────────
switch (shape.kind) {
  case "circle":    /* Circle */ break;
  case "rectangle": /* Rectangle */ break;
  default: const _: never = shape; // exhaustiveness
}

// ── Filter with Predicate ─────────────────────────────
const nums = arr.filter((x): x is number => x !== null);
```

---

## Key Takeaways

- **Type assertions** are compile-time only — they do not convert, check, or protect at runtime. Use with care.
- **Type guards** perform actual runtime checks — TypeScript narrows the type automatically and your code is safe.
- Always prefer `as` syntax over angle-bracket assertions for portability in `.tsx` files.
- Use `unknown` instead of `any` for values of uncertain type — it forces safe handling through assertions or guards.
- `!` (non-null assertion) is a promise. If the value is actually null, your code crashes. Prefer explicit checks.
- User-defined type predicates (`value is Type`) let you encapsulate complex narrowing logic into reusable functions.
- Assertion functions (`asserts value is Type`) narrow for all code after the call and throw on failure.
- Discriminated unions + `switch` + `never` exhaustiveness check is the gold standard for modelling state.
- Double assertion (`as unknown as T`) is a red flag in production code — it bypasses all type safety.
