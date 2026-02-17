# TypeScript — Generics (Official Docs, Simplified)

---

## 1. The Problem — Why Do We Need Generics?

Imagine you want a function that just returns whatever you pass into it.

**Option 1 — Specific type:** Too rigid, only works for one type.

```ts
function identity(arg: number): number {
  return arg;
}
```

**Option 2 — `any`:** Works for all types, but you lose type information.

```ts
function identity(arg: any): any {
  return arg;
}
// You pass in a number, but TypeScript thinks the return is "any"
// You lose all safety
```

**Option 3 — Generics ✅:** Works for all types AND keeps the type information.

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```

`<Type>` is a **type variable** — a placeholder that captures the type you pass in and uses it for the return too. Whatever goes in, the same type comes out.

---

## 2. Calling a Generic Function

Two ways to call a generic function:

```ts
// Way 1 — Explicitly tell TypeScript the type
let output = identity<string>("myString");
// output: string ✅

// Way 2 — Let TypeScript figure it out (most common)
let output = identity("myString");
// TypeScript sees "myString" and infers Type = string
// output: string ✅
```

Way 2 is called **type argument inference** — TypeScript looks at what you pass in and automatically fills in the type. You'll use this most of the time.

---

## 3. Working with Generic Type Variables

Once you use generics, TypeScript treats `T` as "could be anything" — so you can't just use any property on it without being careful.

```ts
// ❌ This errors — TypeScript doesn't know if Type has .length
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // Error: Property 'length' does not exist on type 'Type'
  return arg;
}
```

**Fix — say that arg is an array of Type (arrays always have `.length`):**

```ts
// ✅ Works — arrays have .length
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}

// Same thing, different syntax
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length);
  return arg;
}
```

Now TypeScript knows: "this is an array of some type" — and arrays definitely have `.length`.

---

## 4. Generic Interfaces

You can put the type variable on an interface too.

```ts
// Generic function signature inside an interface
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity; // ✅
```

Or move the type parameter to the interface itself — this way, every method inside knows the type upfront:

```ts
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

let myIdentity: GenericIdentityFn<number> = identity;
// Now locked in — only works with numbers
```

**When to use which:**
- Put `<Type>` on the method → each call can be a different type.
- Put `<Type>` on the interface → the whole interface is locked to one type.

---

## 5. Generic Classes

Classes can be generic too — the type parameter goes right after the class name.

```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

// Use it with numbers
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};

// Use the exact same class with strings!
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test")); // "test"
```

> ⚠️ **Important:** Generics only apply to the **instance side** of a class. Static members **cannot** use the class's type parameter.

```ts
class MyClass<T> {
  instanceProp: T;          // ✅ fine
  static staticProp: T;     // ❌ Error — statics can't use T
}
```

---

## 6. Generic Constraints

Sometimes you want to allow many types but still require they have certain properties. This is done with `extends`.

```ts
// ❌ Without constraint
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // Error: Type might not have .length
  return arg;
}
```

**Step 1 — Create an interface describing what you need:**

```ts
interface Lengthwise {
  length: number;
}
```

**Step 2 — Constrain `Type` to that interface:**

```ts
// ✅ With constraint — Type must have .length
function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Safe now ✅
  return arg;
}

loggingIdentity("hello");       // ✅ strings have .length
loggingIdentity([1, 2, 3]);     // ✅ arrays have .length
loggingIdentity({ length: 10 }); // ✅ object has .length

loggingIdentity(3);             // ❌ Error: numbers have no .length
```

The constraint says: "I don't care exactly what Type is, as long as it has a `length` property."

---

## 7. Using One Type Parameter to Constrain Another

Type parameters can reference each other. This is useful for safe property access.

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // ✅
getProperty(x, "m"); // ❌ Error: "m" is not a key of x
```

`Key extends keyof Type` means: "Key must be one of the actual keys of Type." This prevents you from accessing a property that doesn't exist on the object.

---

## 8. Using Class Types in Generics

When you want a generic factory function (a function that creates instances), you pass the class itself as the argument.

```ts
// Basic factory
function create<Type>(c: { new(): Type }): Type {
  return new c();
}
```

`{ new(): Type }` means "a class whose constructor returns a Type."

**Advanced example — relationships between classes:**

```ts
class BeeKeeper { hasMask: boolean = true; }
class ZooKeeper { nametag: string = "Mikle"; }

class Animal    { numLegs: number = 4; }
class Bee extends Animal {
  numLegs = 6;
  keeper: BeeKeeper = new BeeKeeper();
}
class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag; // ✅ string
createInstance(Bee).keeper.hasMask;  // ✅ boolean
```

TypeScript knows which keeper each animal has — fully typed.

---

## 9. Generic Parameter Defaults

Just like default values for function parameters, you can set a **default type** for a type parameter.

```ts
// Without defaults — three separate overloads needed
declare function create(): Container<HTMLDivElement, HTMLDivElement[]>;
declare function create<T extends HTMLElement>(element: T): Container<T, T[]>;
declare function create<T extends HTMLElement, U extends HTMLElement>(
  element: T, children: U[]
): Container<T, U[]>;

// With defaults — one clean signature
declare function create<
  T extends HTMLElement = HTMLDivElement,
  U extends HTMLElement[] = T[]
>(element?: T, children?: U): Container<T, U>;

const div = create();
// div: Container<HTMLDivElement, HTMLDivElement[]>  ← uses default

const p = create(new HTMLParagraphElement());
// p: Container<HTMLParagraphElement, HTMLParagraphElement[]>  ← inferred
```

**Rules for defaults:**
- A type parameter with a default becomes **optional**.
- Required type parameters must come **before** optional ones.
- The default type must still satisfy any constraint on that parameter.

---

## 10. Variance Annotations (Advanced)

> 💡 This is an advanced topic. Skip if you're just starting with TypeScript.

**Variance** describes how types relate to each other when used in generics.

### Covariance (`out T`) — same direction

```ts
interface Producer<out T> {
  make(): T;
}
```

A `Producer<Cat>` can be used where a `Producer<Animal>` is expected — because `Cat` is an `Animal`.
The relationship flows in the **same direction**.

### Contravariance (`in T`) — opposite direction

```ts
interface Consumer<in T> {
  consume: (arg: T) => void;
}
```

A `Consumer<Animal>` can be used where a `Consumer<Cat>` is expected — because if something handles any Animal, it can definitely handle a Cat.
The relationship flows in the **opposite direction**.

### Invariant (`in out T`) — exact match required

```ts
interface ProducerConsumer<in out T> {
  consume: (arg: T) => void;
  make(): T;
}
```

Must be the exact same type — no substitution allowed.

### When to use variance annotations

Almost **never**. TypeScript infers variance automatically and gets it right in nearly every case. You should only add variance annotations if:

1. You have a profiler showing a specific type is slow.
2. You have circular types causing incorrect inference.
3. The annotation matches the actual structural behavior of the type.

> ⚠️ **Never use variance annotations to force TypeScript to behave differently.** They are only a hint, not a rule, and TypeScript may ignore them in structural comparisons.

---

## Summary Table

| Concept | Syntax | What It Does |
|---|---|---|
| Generic function | `function f<T>(arg: T): T` | Works with any type, preserves it |
| Type inference | `f("hello")` | TypeScript fills in `T` automatically |
| Generic interface | `interface I<T> { ... }` | Interface locked to a type |
| Generic class | `class C<T> { ... }` | Class properties share the same type |
| Constraint | `<T extends SomeType>` | T must have certain properties |
| keyof constraint | `<K extends keyof T>` | K must be a real key of T |
| Factory pattern | `c: { new(): T }` | Accepts a class, creates instances |
| Default type param | `<T = DefaultType>` | T is optional, falls back to default |
| Covariant | `<out T>` | Producers — T only appears in output |
| Contravariant | `<in T>` | Consumers — T only appears in input |

---

## Key Takeaways

- Generics let you write **one function/class/interface** that works with **many types** while keeping full type safety.
- TypeScript usually **infers** the type for you — you only need to specify it explicitly when inference fails.
- Use `extends` to **constrain** a type parameter — this lets you safely access specific properties.
- `Key extends keyof Type` is the pattern for **safe property access** on any object.
- Generic classes are only generic on the **instance side** — static members can't use the type parameter.
- Default type parameters make type arguments **optional** in complex function signatures.
- Variance annotations are for **advanced edge cases only** — TypeScript handles variance automatically in normal code.
