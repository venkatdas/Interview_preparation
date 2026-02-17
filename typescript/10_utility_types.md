# TypeScript — Utility Types

> Built-in generic types that transform existing types into new ones.
> You never have to write these from scratch — TypeScript ships them globally.

---

## What Are Utility Types and Why Do They Exist?

When you build real apps, you constantly need **variations** of a type — the same shape but with all fields optional, or with a few fields removed, or with everything locked as readonly.

Without utility types, you'd repeat yourself:

```ts
// Your base type
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Now you need a "create user" version — password is set by the server
interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// Now you need an "update user" version — everything optional
interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

// Now you need a "public user" version — no password
interface PublicUser {
  id: number;
  name: string;
  email: string;
}
```

That's four interfaces for one concept. If you add a field to `User`, you must update all four. This is the problem utility types solve — **derive new types from existing ones**.

```ts
// With utility types — all derived from one source of truth
type CreateUserDto = Omit<User, "id">;
type UpdateUserDto = Partial<Omit<User, "id">>;
type PublicUser    = Omit<User, "password">;
```

---

## Understanding the `K<T<U>>` Notation

Before diving in, let's decode the syntax you'll see everywhere.

```ts
Pick<Todo, "title" | "completed">
//   ^^^^  ^^^^^^^^^^^^^^^^^^^^^^
//    T           K
```

- `T` — the **source type** (usually an interface or object type)
- `K` — the **keys** you want to work with (a string literal or union of them)
- `U` — a **second type** (used in types like `Record<K, V>`)

When you see `K<T<U>>` — it's just **nesting**. The inner utility produces a type, and the outer utility consumes it:

```ts
Partial<Omit<User, "id">>
//      ^^^^^^^^^^^^^^^^  ← Omit<User, "id"> runs first → produces a new type
// Partial<...>           ← then Partial wraps that result
```

Read it **inside-out**: inner runs first, outer wraps the result.

---

## The Core Utility Types

---

## 1. `Partial<T>` — Make Everything Optional

Constructs a new type with **all properties of `T` set to optional**.

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type PartialTodo = Partial<Todo>;
// Equivalent to:
// {
//   title?:       string;
//   description?: string;
//   completed?:   boolean;
// }
```

### Why use it?

The most common use is **update/patch functions** — when updating a record, you only want to send the fields that changed.

```ts
function updateTodo(todo: Todo, fields: Partial<Todo>): Todo {
  return { ...todo, ...fields };
}

const todo: Todo = {
  title: "Buy groceries",
  description: "Milk, eggs, bread",
  completed: false,
};

// Only pass the fields you want to change
updateTodo(todo, { completed: true });     // ✅
updateTodo(todo, { title: "Buy food" });   // ✅
updateTodo(todo, {});                      // ✅ nothing changes — all fields optional
```

### How it works internally

```ts
type Partial<T> = {
  [K in keyof T]?: T[K];
};
// "For every key K in T, make it optional (?), keep its type T[K]"
```

---

## 2. `Required<T>` — Make Everything Required

The **exact opposite of `Partial`**. Constructs a type with all optional properties made required.

```ts
interface Config {
  host?: string;
  port?: number;
  ssl?:  boolean;
}

type StrictConfig = Required<Config>;
// {
//   host: string;   ← no more ?
//   port: number;   ← no more ?
//   ssl:  boolean;  ← no more ?
// }
```

### Why use it?

Use it when you've built up an object with optional fields and want to **validate that all fields are present** before using it.

```ts
interface FormData {
  username?: string;
  email?:    string;
  password?: string;
}

// After validation, we know everything is filled in
function submitForm(data: Required<FormData>): void {
  console.log(`Creating account for ${data.username}`);
}

const form: FormData = { username: "piyush", email: "p@x.com", password: "1234" };

// Without cast you'd get an error since FormData fields are optional
submitForm(form as Required<FormData>);
```

### How it works internally

```ts
type Required<T> = {
  [K in keyof T]-?: T[K];
  //             ^^ the minus removes the optional modifier
};
```

---

## 3. `Readonly<T>` — Prevent All Mutations

Constructs a type where **all properties are `readonly`** — they cannot be reassigned after creation.

```ts
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello"; // ❌ Error: Cannot assign to 'title' because it is read-only
```

### Why use it?

Use `Readonly<T>` when you want to **freeze** an object and make clear that it should never be mutated — like configuration objects, initial state, or constants.

```ts
// Config that should never change at runtime
const DB_CONFIG: Readonly<{
  host: string;
  port: number;
}> = {
  host: "localhost",
  port: 5432,
};

// DB_CONFIG.host = "other"; // ❌ Error — prevented at compile time

// Works great with Object.freeze()
// TypeScript models Object.freeze() exactly as:
// function freeze<T>(obj: T): Readonly<T>
```

### How it works internally

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
  // adds "readonly" to every property
};
```

---

## 4. `Record<Keys, Type>` — Build an Object Type from Keys + Value Type

Constructs an **object type** where the property keys come from `Keys` and every value is of type `Type`.

```ts
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy:   { age: 10, breed: "Persian" },
  boris:   { age: 5,  breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris; // { age: 5, breed: "Maine Coon" }
```

### Why use it?

`Record` is perfect when you have a **known set of keys** and want a **consistent value type** for all of them. It enforces that every key has a value and every value is the right shape.

```ts
// Map HTTP status codes to messages
type HttpStatus = 200 | 404 | 500;
const messages: Record<HttpStatus, string> = {
  200: "OK",
  404: "Not Found",
  500: "Server Error",
};

// Map role names to permissions
type Role = "admin" | "editor" | "viewer";
const permissions: Record<Role, string[]> = {
  admin:  ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};

// Dynamic key lookup with string index
type ScoreMap = Record<string, number>;
const scores: ScoreMap = { alice: 95, bob: 87, charlie: 91 };
```

### How it works internally

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
  // "For every key P in K, the value type is T"
};
```

---

## 5. `Pick<T, Keys>` — Keep Only Specific Properties

Constructs a new type by **picking only the listed keys** from `T`. Everything else is dropped.

```ts
interface Todo {
  title:       string;
  description: string;
  completed:   boolean;
  createdAt:   number;
}

// I only want title and completed
type TodoPreview = Pick<Todo, "title" | "completed">;
// {
//   title:     string;
//   completed: boolean;
// }

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

### Why use it?

Use `Pick` when you need a **subset** of a type — like a summary view, a form that only edits some fields, or an API response that returns limited data.

```ts
interface User {
  id:       number;
  name:     string;
  email:    string;
  password: string;
  role:     string;
  createdAt: Date;
}

// Public-facing user card — no sensitive data
type UserCard     = Pick<User, "id" | "name">;

// Login form — only these two fields
type LoginForm    = Pick<User, "email" | "password">;

// Admin table row
type AdminRow     = Pick<User, "id" | "name" | "email" | "role">;
```

---

## 6. `Omit<T, Keys>` — Remove Specific Properties

The **opposite of `Pick`**. Constructs a new type by taking all properties from `T` and **removing the listed keys**.

```ts
interface Todo {
  title:       string;
  description: string;
  completed:   boolean;
  createdAt:   number;
}

// Remove just description
type TodoPreview = Omit<Todo, "description">;
// {
//   title:     string;
//   completed: boolean;
//   createdAt: number;
// }

// Remove multiple
type TodoInfo = Omit<Todo, "completed" | "createdAt">;
// {
//   title:       string;
//   description: string;
// }
```

### Why use it?

Use `Omit` when it's **easier to say what you don't want** than what you do. If a type has 10 fields and you want to exclude 1, `Omit` is cleaner than `Pick`ing the other 9.

```ts
interface User {
  id:       number;
  name:     string;
  email:    string;
  password: string;
}

// Create a new user — no id yet (server assigns it)
type CreateUser = Omit<User, "id">;

// Safe to expose to frontend — no password
type PublicUser = Omit<User, "password">;

// DTO for update — exclude id (can't change it) + make rest optional
type UpdateUser = Partial<Omit<User, "id">>;
```

### `Pick` vs `Omit` — when to use which

| Situation | Use |
|---|---|
| Want a few specific fields from a large type | `Pick` |
| Want to exclude a few fields from a large type | `Omit` |
| 3 fields to keep out of 10 | `Pick<T, "a" \| "b" \| "c">` |
| 1 field to remove from 10 | `Omit<T, "secret">` |

---

## 7. `ReturnType<T>` — Extract a Function's Return Type

Constructs a type from the **return type of a function**.

```ts
function getUser() {
  return { id: 1, name: "Piyush", email: "p@x.com" };
}

type User = ReturnType<typeof getUser>;
// {
//   id:    number;
//   name:  string;
//   email: string;
// }
```

### Why use it?

When a function **defines the shape** of data (especially from APIs or factories), use `ReturnType` to derive the type automatically — no need to manually write and maintain a separate interface.

```ts
// The function IS the source of truth
function createApiClient(baseUrl: string) {
  return {
    get:    (path: string) => fetch(baseUrl + path),
    post:   (path: string, body: unknown) => fetch(baseUrl + path),
    delete: (path: string) => fetch(baseUrl + path),
  };
}

type ApiClient = ReturnType<typeof createApiClient>;
// automatically has: get, post, delete methods ✅

// Works great with library functions you don't control
type RouterInstance = ReturnType<typeof createRouter>;
type StoreInstance  = ReturnType<typeof createStore>;
```

```ts
// More examples
type T0 = ReturnType<() => string>;           // string
type T1 = ReturnType<(s: string) => void>;    // void
type T2 = ReturnType<() => { a: number }>;    // { a: number }
type T3 = ReturnType<typeof Math.random>;     // number
```

---

## 8. `Parameters<T>` — Extract a Function's Parameter Types

Constructs a **tuple type** from the parameter types of a function.

```ts
function createUser(name: string, age: number, admin: boolean) {}

type Params = Parameters<typeof createUser>;
// [name: string, age: number, admin: boolean]

// Access individual params by index
type NameParam  = Parameters<typeof createUser>[0]; // string
type AgeParam   = Parameters<typeof createUser>[1]; // number
```

### Why use it?

Use `Parameters` to **reuse the signature of an existing function** — especially useful when wrapping, decorating, or forwarding calls.

```ts
function saveToDb(id: number, data: { title: string; body: string }) {}

// Wrapper that logs before saving
function logAndSave(...args: Parameters<typeof saveToDb>) {
  console.log("Saving:", args);
  saveToDb(...args);
}

// Useful for building typed middleware/wrappers
type FetchParams = Parameters<typeof fetch>;
// [input: RequestInfo | URL, init?: RequestInit | undefined]
```

---

## 9. `Awaited<T>` — Unwrap a Promise

Recursively unwraps `Promise<T>` to get the **resolved value type** — no matter how deeply nested.

```ts
type A = Awaited<Promise<string>>;
// string

type B = Awaited<Promise<Promise<number>>>;
// number  ← unwraps both levels

type C = Awaited<boolean | Promise<number>>;
// boolean | number  ← union: boolean stays, Promise<number> becomes number
```

### Why use it?

Use `Awaited` when you have a `Promise` type and you need the type of its **resolved value**.

```ts
async function fetchUser() {
  const res = await fetch("/api/user");
  return res.json() as Promise<{ id: number; name: string }>;
}

// Get the resolved type without calling the function
type User = Awaited<ReturnType<typeof fetchUser>>;
// { id: number; name: string }
```

---

## 10. `Exclude<UnionType, ExcludedMembers>` — Remove Union Members

Removes specific members **from a union type**.

```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
// "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
// "c"

type T2 = Exclude<string | number | (() => void), Function>;
// string | number
```

### With object union types

```ts
type Shape =
  | { kind: "circle";   radius: number }
  | { kind: "square";   x: number }
  | { kind: "triangle"; x: number; y: number };

type WithoutCircle = Exclude<Shape, { kind: "circle" }>;
// { kind: "square"; x: number } | { kind: "triangle"; x: number; y: number }
```

### Why use it?

```ts
type AllEvents = "click" | "focus" | "blur" | "keydown" | "keyup";
type MouseEvents = Exclude<AllEvents, "keydown" | "keyup">;
// "click" | "focus" | "blur"
```

---

## 11. `Extract<Type, Union>` — Keep Only Matching Union Members

The **opposite of `Exclude`**. Keeps only the members that are assignable to `Union`.

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
// "a"  ← only "a" is in both

type T1 = Extract<string | number | (() => void), Function>;
// () => void  ← only the function type extends Function
```

### With object union types

```ts
type Shape =
  | { kind: "circle";   radius: number }
  | { kind: "square";   x: number }
  | { kind: "triangle"; x: number; y: number };

type OnlyCircle = Extract<Shape, { kind: "circle" }>;
// { kind: "circle"; radius: number }
```

---

## 12. `NonNullable<T>` — Remove `null` and `undefined`

```ts
type T0 = NonNullable<string | number | undefined>;
// string | number

type T1 = NonNullable<string[] | null | undefined>;
// string[]
```

### Why use it?

Use it after a null check, or when you know a value is defined but TypeScript doesn't.

```ts
type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>; // User

// Often combined with Awaited + ReturnType
type ApiResult = Awaited<ReturnType<typeof fetchUser>>;
type SafeResult = NonNullable<ApiResult>; // strips null/undefined
```

---

## 13. `InstanceType<T>` — Get the Instance Type of a Class

Extracts the type that `new ClassName()` produces.

```ts
class User {
  id: number = 0;
  name: string = "";
}

type UserInstance = InstanceType<typeof User>;
// User  (same as the class itself)
```

### Why use it?

Most useful when you're working with **class references dynamically** — like factories or dependency injection.

```ts
function create<T>(Constructor: new () => T): T {
  return new Constructor();
}

// InstanceType lets you extract the type without instantiating
type Created = InstanceType<typeof User>; // User
```

---

## 14. `Partial` + `Required` + `Readonly` Together

These three are opposites/complements. A common pattern:

```ts
interface Config {
  host:    string;
  port:    number;
  debug?:  boolean;
}

// Start with a draft — everything optional
type DraftConfig = Partial<Config>;

// Finalized config — everything required
type FinalConfig = Required<Config>;

// Immutable config — nothing can change
type FrozenConfig = Readonly<Config>;

// Immutable AND fully required
type StrictFrozenConfig = Readonly<Required<Config>>;
```

---

## 15. Combining Utility Types (Nesting)

The real power comes from **combining** utility types. Read inside-out.

```ts
interface User {
  id:       number;
  name:     string;
  email:    string;
  password: string;
  role:     "admin" | "user";
  createdAt: Date;
}

// Step 1: Omit<User, "id" | "password" | "createdAt">
// → { name: string; email: string; role: "admin" | "user" }

// Step 2: Partial<...>
// → { name?: string; email?: string; role?: "admin" | "user" }

type UpdateProfileDto = Partial<Omit<User, "id" | "password" | "createdAt">>;


// Another example — get the resolved return type of an async function
async function fetchUsers(): Promise<User[]> { return []; }

type FetchUsersReturn = Awaited<ReturnType<typeof fetchUsers>>;
// User[]

type SingleUser = FetchUsersReturn[number];
// User
```

---

## 16. String Manipulation Utility Types

TypeScript includes four built-in types for transforming **string literal types**.

```ts
type U = Uppercase<"hello">;     // "HELLO"
type L = Lowercase<"WORLD">;     // "world"
type C = Capitalize<"hello">;    // "Hello"
type N = Uncapitalize<"Hello">;  // "hello"
```

### Why use them?

They're most powerful inside **template literal types** to auto-generate property names.

```ts
type Fields = "name" | "age" | "email";

// Auto-generate getter names: getName, getAge, getEmail
type Getters = `get${Capitalize<Fields>}`;
// "getName" | "getAge" | "getEmail"

// Auto-generate event names: onNameChange, onAgeChange, onEmailChange
type EventHandlers = `on${Capitalize<Fields>}Change`;
// "onNameChange" | "onAgeChange" | "onEmailChange"
```

---

## Quick Reference Card

```
Partial<T>              → All properties optional
Required<T>             → All properties required
Readonly<T>             → All properties readonly (no mutation)

Record<K, V>            → Object with keys K and values V
Pick<T, K>              → Keep only keys K from T
Omit<T, K>              → Remove keys K from T

Exclude<Union, U>       → Remove U members from Union
Extract<Union, U>       → Keep only U members from Union
NonNullable<T>          → Remove null and undefined from T

ReturnType<F>           → Return type of function F
Parameters<F>           → Parameter types of function F as tuple
InstanceType<C>         → Instance type of class constructor C
Awaited<T>              → Unwrap Promise<T> → T

Uppercase<S>            → "hello" → "HELLO"
Lowercase<S>            → "HELLO" → "hello"
Capitalize<S>           → "hello" → "Hello"
Uncapitalize<S>         → "Hello" → "hello"
```

---

## When to Use Which — Decision Guide

| Scenario | Use |
|---|---|
| API update endpoint — send only changed fields | `Partial<T>` |
| After form validation — all fields now guaranteed | `Required<T>` |
| Config object that must not mutate | `Readonly<T>` |
| Map a union of strings to a value type | `Record<K, V>` |
| Need only 2–3 fields from a big interface | `Pick<T, K>` |
| Need everything except 1–2 sensitive fields | `Omit<T, K>` |
| Remove certain members from a union | `Exclude<U, E>` |
| Keep only certain members from a union | `Extract<U, E>` |
| Strip null/undefined from a type | `NonNullable<T>` |
| Get the type a function returns | `ReturnType<F>` |
| Get the params of a function to wrap it | `Parameters<F>` |
| Unwrap an async function's return type | `Awaited<ReturnType<F>>` |
| Auto-generate typed property/event names | `Capitalize<S>` in template literals |

---

## Key Takeaways

- Utility types let you **derive types from existing types** — one source of truth, many shapes.
- `Partial`, `Required`, and `Readonly` modify **property modifiers** — optional, required, immutable.
- `Pick` and `Omit` are about **selecting properties** — pick what you want, omit what you don't.
- `Record` builds an **object type** from a key union and a value type.
- `ReturnType` and `Parameters` let you **extract types from functions** without running them.
- `Exclude` and `Extract` work on **union types** — filtering members in or out.
- `Awaited` recursively unwraps `Promise<T>` to the **resolved value type**.
- Nest utility types to express complex transformations: `Partial<Omit<User, "id">>`.
- Read nested types **inside-out** — the innermost utility runs first.
