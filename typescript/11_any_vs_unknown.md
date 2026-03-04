# `any` vs `unknown` in TypeScript

> A ~1 minute interview answer with examples.

---

## 🎤 Interview Answer (Speak This)

In TypeScript, both `any` and `unknown` are used when the type of a variable is not known at the time of writing the code, but they behave differently in terms of type safety.

`any` completely disables TypeScript's type checking for that variable. When we assign a variable as `any`, TypeScript allows us to assign any type of value to it and also allows us to perform any operation on it without giving errors. Because of this, it behaves similar to plain JavaScript and removes the benefits of TypeScript's type safety. This can cause runtime errors, which is why using `any` is generally discouraged in large applications.

On the other hand, `unknown` is a safer alternative to `any`. Like `any`, it can store values of any type, but TypeScript does not allow us to use that value directly. Before performing any operation, we must first check its type using type guards such as `typeof` or `instanceof`.

So the key difference is that `any` **removes** type safety, while `unknown` **maintains** type safety by forcing us to perform type checks before using the value. In modern TypeScript projects, developers prefer `unknown` over `any` whenever possible because it helps prevent runtime errors and keeps the code safer.

---

## The Core Difference

| | `any` | `unknown` |
|---|---|---|
| Accepts all types | ✅ | ✅ |
| Allows operations without type check | ✅ | ❌ |
| Type-safe | ❌ | ✅ |
| Recommended in modern TS | ❌ | ✅ |

---

## `any` — Disables Type Checking

When a variable is typed as `any`, TypeScript stops checking it entirely. You can assign anything to it and call any operation on it — no errors, no warnings.

```ts
let value: any = "hello";

value = 42;          // ✅ no error
value = true;        // ✅ no error
value = { id: 1 };  // ✅ no error

value.toUpperCase(); // ✅ no TS error — but 💥 runtime crash if value isn't a string
value.fly();         // ✅ no TS error — even if this method doesn't exist
value();             // ✅ no TS error — even if value isn't a function
```

> TypeScript essentially becomes plain JavaScript here — all the benefits of static typing are lost.

---

## `unknown` — Safe Alternative to `any`

A variable typed as `unknown` can also hold any value, but TypeScript **forces you to verify the type** before using it. This prevents accidental runtime errors.

```ts
let value: unknown = "hello";

value.toUpperCase();  // ❌ TS Error: Object is of type 'unknown'
```

You must narrow the type first using a **type guard**:

```ts
// Using typeof
let value: unknown = "hello";

if (typeof value === "string") {
  console.log(value.toUpperCase()); // ✅ Safe — TS knows it's a string here
}
```

```ts
// Using instanceof
let value: unknown = new Date();

if (value instanceof Date) {
  console.log(value.toISOString()); // ✅ Safe — TS knows it's a Date here
}
```

```ts
// Narrowing with multiple types
function processInput(input: unknown) {
  if (typeof input === "number") {
    console.log(input.toFixed(2));     // ✅ treated as number
  } else if (typeof input === "string") {
    console.log(input.trim());         // ✅ treated as string
  } else {
    console.log("Unsupported type");
  }
}
```

---

## Real-World Use Case

A very common scenario is handling API responses or data from external sources where the shape isn't guaranteed:

```ts
// ❌ With any — dangerous
async function fetchUser(): Promise<any> {
  const res = await fetch("/api/user");
  const data = await res.json();
  console.log(data.name.toUpperCase()); // No safety — crashes if name is undefined
}

// ✅ With unknown — safe
async function fetchUser(): Promise<unknown> {
  const res = await fetch("/api/user");
  const data: unknown = await res.json();

  if (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof (data as any).name === "string"
  ) {
    console.log((data as { name: string }).name.toUpperCase()); // ✅ Safe
  }
}
```

---

## Key Takeaway

- Use **`any`** only as a last resort (e.g., migrating old JavaScript code quickly).
- Use **`unknown`** whenever the type is genuinely not known — it enforces safety by requiring type checks before use.
- In modern TypeScript projects, **`unknown` is always preferred over `any`**.
