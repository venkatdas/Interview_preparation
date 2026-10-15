# Programming Fundamentals for DSA

Before data structures, you need a rock-solid grip on the small things every algorithm is built from:
variables, loops, functions, and, above all in JavaScript, **what happens when you copy or compare a value**.
Most "my algorithm is right but the answer is wrong" bugs in interviews are not algorithm bugs.
They are off-by-one loops, arrays that were shared when you thought they were copied, and `===` comparisons
that silently compare references. This guide teaches those fundamentals through the lens of DSA.

---

## 1. Prerequisites (Essential)

- [JavaScript for DSA](../../01_JavaScript_For_DSA/README.md): arrays, strings, Map/Set, numbers, the built-ins you will use daily. This guide does **not** repeat that material; it focuses on *semantics* (copying, equality, loop boundaries).
- Nice to have: [Mathematics for DSA](../../04_Mathematics_For_DSA/README.md) for floor division and modulo, used in the loop-boundary formulas below.

---

## 2. Intuition (Essential)

Think of every value in JavaScript as one of two kinds:

- **Primitives** (`number`, `string`, `boolean`, `undefined`, `null`, `bigint`, `symbol`): the variable holds the value itself. Copying copies the value.
- **Objects** (arrays, plain objects, Map, Set, functions, Dates...): the variable holds an **arrow (reference) pointing to** the object. Copying the variable copies the arrow, not the object.

Almost every fundamentals bug comes from forgetting which of the two you have.

And think of every loop as a **range of indices**: where it starts, where it stops, and whether the stop is included.
If you can say "this loop visits indices `[lo, hi)`" out loud, you will almost never write an off-by-one bug.

---

## 3. Mental model / analogy + visuals (Essential)

**References are house addresses.** Writing an address on two sticky notes does not build a second house.
Painting the house through either note changes the one house.

```
const a = [1, 2, 3];
const b = a;            // copy the ARROW, not the array
b.push(4);

  a ──┐
      ├──►  [1, 2, 3, 4]      one array, two names (aliasing)
  b ──┘

const c = [...a];       // NEW array, top-level values copied
  c ──►  [1, 2, 3, 4]         separate array

const grid = [[0, 0], [0, 0]];
const shallow = [...grid];   // new OUTER array, SAME inner rows

  grid    ──► [ • , • ]
                │   │
  shallow ──► [ • , • ]      both outer arrays point to the same rows
                │   │
                ▼   ▼
             [0,0] [0,0]
```

**Loop ranges as half-open intervals.** `for (let i = lo; i < hi; i++)` visits `[lo, hi)`: `hi - lo` items.

```
indices:   0   1   2   3   4   5
           [lo=1 ..........hi=5)        visits 1,2,3,4  -> 5 - 1 = 4 items
```

---

## 4. Why it exists (what problem it solves) (Essential)

DSA code constantly **copies state** (backtracking paths, DP rows, BFS visited sets), **compares state**
(was this configuration seen before? are these two trees equal?), and **walks ranges** (windows, partitions, subarrays).
If copying, comparing and ranges are fuzzy, you get:

- backtracking results that are all the same array (you pushed `path` instead of `[...path]`),
- a 2D grid where changing one row changes all rows (`new Array(3).fill([])`),
- a `Set` of arrays that never finds duplicates (`set.has([1,2])` compares references),
- binary searches and windows that skip or repeat one element.

---

## 5. How it works, step by step

### 5.1 Variables and types (Essential)

- Use `const` by default, `let` when you reassign, never `var` (function-scoped, hoisted, confusing in loops with closures).
- `const arr = []` means the **binding** cannot change. The array itself is still mutable: `arr.push(1)` is fine.
- `typeof null === 'object'` (historic bug), `typeof [] === 'object'` → use `Array.isArray`.
- Numbers are 64-bit floats. Integers are exact only up to `Number.MAX_SAFE_INTEGER` (2^53 - 1). Use `BigInt` beyond that.

### 5.2 Control flow and loops (Essential)

| Loop | Use it when | Trap |
|---|---|---|
| `for (let i = 0; i < n; i++)` | you need the index, or to skip/jump | off-by-one at `<` vs `<=` |
| `for (const x of arr)` | you only need values (works for Map, Set, strings) | no index; don't mutate the array length inside |
| `for (const k in obj)` | iterate object keys | iterates **inherited** enumerable keys and gives **string** keys for arrays: avoid on arrays |
| `while (cond)` | unknown iteration count (two pointers, binary search) | must change something every iteration or it loops forever |
| `arr.forEach` | side effects | cannot `break` or `return` early |

**Loop-boundary rules that prevent most off-by-one bugs:**

1. Prefer **half-open ranges** `[lo, hi)`. Length is `hi - lo`, empty when `lo === hi`, and adjacent ranges `[a,b)`, `[b,c)` do not overlap.
2. Last valid index is `n - 1`. A loop that reads `arr[i + 1]` must stop at `i < n - 1`.
3. "Every window of size k" starts at `i = 0 .. n - k` inclusive → `for (let i = 0; i + k <= n; i++)`.
4. Count of multiples of `k` in `[1, x]` is `Math.floor(x / k)`; in `[lo, hi]` it is `floor(hi/k) - floor((lo-1)/k)`.
5. Test every loop with n = 0, 1, 2. Most boundary bugs show up there.

### 5.3 Functions (Essential)

- Parameters are passed **by sharing**: the function receives a copy of the value, and for objects that value is the reference. So a function **can mutate** an array you pass in, but **cannot** make your variable point to a different array.

```js
function addOne(list) { list.push(1); }        // caller sees the change
function replace(list) { list = [99]; }        // caller does NOT see this
```

- Pure functions (no mutation of inputs, no hidden state) are easier to test. In interviews, say if you mutate the input ("I'll sort in place; is that OK?").
- Default parameters are evaluated **per call**: `function f(memo = new Map())` gives a fresh Map each call. That is good. A module-level `const memo = new Map()` is shared across calls, which is a classic hidden-state bug in test suites.

### 5.4 References vs values, aliasing and mutation (Essential)

**Aliasing** = two names for one object. It is fine when intended, and a bug when not.
The three classic DSA aliasing bugs:

```js
// Bug 1: one row shared by every row
const grid = new Array(3).fill(new Array(3).fill(0));
grid[0][0] = 1;          // ALL rows now start with 1
// Fix: Array.from({ length: 3 }, () => new Array(3).fill(0));

// Bug 2: storing the live backtracking path
result.push(path);       // later pops empty it
// Fix: result.push([...path]);

// Bug 3: sorting the caller's array by accident
function median(nums) { nums.sort((a, b) => a - b); ... }   // mutates input
// Fix: const sorted = [...nums].sort((a, b) => a - b);  or nums.toSorted(...) (Node 20+)
```

### 5.5 Shallow vs deep copy (Essential)

| Technique | Depth | Handles | Breaks on |
|---|---|---|---|
| `[...arr]`, `arr.slice()`, `Array.from(arr)` | shallow | arrays | nested arrays still shared |
| `{ ...obj }`, `Object.assign({}, obj)` | shallow | own enumerable props | nested objects shared, prototype lost |
| `JSON.parse(JSON.stringify(x))` | deep | plain JSON data | `undefined` and functions dropped, `NaN`/`Infinity` → `null`, `Date` → string, `Map`/`Set` → `{}`, cycles throw, `BigInt` throws |
| `structuredClone(x)` (Node 17+) | deep | Map, Set, Date, RegExp, typed arrays, **cycles** | functions and DOM nodes throw; class instances become plain objects (prototype lost) |
| hand-written `deepClone` | deep | whatever you decide | you must handle cycles with a `WeakMap` yourself |

For DSA, the usual need is a **2D grid copy**: `grid.map(row => [...row])` (one level deeper than shallow). That is O(rows × cols).

### 5.6 Equality (Essential)

| Comparison | `NaN` vs `NaN` | `+0` vs `-0` | `'1'` vs `1` | Used by |
|---|---|---|---|---|
| `==` | false | true | **true** (coerces) | avoid |
| `===` | **false** | true | false | everyday code, `indexOf` |
| `Object.is` | **true** | **false** | false | React state comparison |
| SameValueZero | **true** | true | false | `Map`/`Set` keys, `includes` |

- `[1,2] === [1,2]` is **false**: two different arrays. Objects compare by reference.
- To use an array as a Map/Set key, convert to a string key: `${r},${c}` or `arr.join(',')`.
- `[NaN].indexOf(NaN) === -1` but `[NaN].includes(NaN) === true`.
- To compare structures, write `deepEqual` (problem 06) or compare canonical strings.

### 5.7 Closures (where they matter for DSA) (Essential)

A closure is a function that remembers the variables of the scope where it was created.
In DSA this gives you **memoization** without globals:

```js
function makeFib() {
  const memo = new Map();             // private to this closure
  return function fib(n) {
    if (n < 2) return n;
    if (memo.has(n)) return memo.get(n);
    const v = fib(n - 1) + fib(n - 2);
    memo.set(n, v);
    return v;
  };
}
```

Also used for DFS helpers that read `grid`, `visited` and `rows` from the outer function instead of passing them every call.

### 5.8 Iteration protocols (Advanced)

An object is **iterable** if it has a `[Symbol.iterator]()` method returning an **iterator**: an object with `next()` that returns `{ value, done }`.
`for...of`, spread `[...x]`, `Array.from`, destructuring, `new Set(x)` and `new Map(x)` all use this protocol.
Generators (`function*`) are the easiest way to write one, and they are **lazy**: values are produced on demand, which means O(1) memory for a range of a billion numbers.

---

## 6. Pseudocode

```
deepClone(x, seen):
  if x is primitive or function: return x
  if seen has x: return seen[x]            // cycle or shared reference
  create empty copy of the same kind (array / Map / Set / Date / object)
  seen[x] = copy                           // register BEFORE recursing
  for each child of x: put deepClone(child, seen) into copy
  return copy

rotateRight(arr, k):                        // in place, O(1) extra space
  k = k mod n
  reverse(arr, 0, n-1); reverse(arr, 0, k-1); reverse(arr, k, n-1)
```

---

## 7. JavaScript implementation

Two runnable files:

- [`02_Implementations/copy_and_equality.js`](../02_Implementations/copy_and_equality.js): `sameValueZero`, `shallowCopy`, `copyGrid`, `jsonClone` (with its limits demonstrated), `deepClone` (cycles, Map, Set, Date), `deepEqual`, `keyOf` for using arrays as Map keys.
- [`02_Implementations/loops_and_iteration.js`](../02_Implementations/loops_and_iteration.js): half-open range helpers, `countMultiples`, sliding-window start indices, a lazy `Range` iterable class, a `range` generator, and `memoize` built with a closure.

Core snippet:

```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof Map) { const m = new Map(); seen.set(value, m); for (const [k, v] of value) m.set(deepClone(k, seen), deepClone(v, seen)); return m; }
  if (value instanceof Set) { const s = new Set(); seen.set(value, s); for (const v of value) s.add(deepClone(v, seen)); return s; }
  const out = Array.isArray(value) ? [] : {};
  seen.set(value, out);
  for (const key of Object.keys(value)) out[key] = deepClone(value[key], seen);
  return out;
}
```

---

## 8. Dry run on a concrete example

`rotateRight([1, 2, 3, 4, 5], 2)` with the triple-reverse trick (n = 5, k = 2):

| Step | Action | Array |
|---|---|---|
| 0 | start, `k = 2 % 5 = 2` | `[1, 2, 3, 4, 5]` |
| 1 | reverse whole `[0, 4]` | `[5, 4, 3, 2, 1]` |
| 2 | reverse first k `[0, 1]` | `[4, 5, 3, 2, 1]` |
| 3 | reverse rest `[2, 4]` | `[4, 5, 1, 2, 3]` |

Copy vs alias on a grid:

| Line | `grid[0][0]` | `copy[0][0]` | Why |
|---|---|---|---|
| `const copy = [...grid]` | 0 | 0 | outer copied, rows shared |
| `copy[0][0] = 7` | **7** | 7 | same row object |
| `const deep = grid.map(r => [...r]); deep[0][0] = 9` | 7 | 7 (deep: 9) | rows copied too |

---

## 9. Edge cases

- Empty array / empty string / `n = 0` loops must do nothing and not crash.
- `k` larger than `n` in rotations and chunking: take `k % n` (and guard `n = 0` before `%`).
- `NaN`, `-0`, `undefined` vs missing key (`{a: undefined}` vs `{}`), sparse arrays (`[ , 1]`).
- Cycles in objects (`a.self = a`) for clone/equal/print functions.
- Very deep nesting: recursion can overflow the stack. Use an explicit stack (see [Recursion Fundamentals](../../03_Recursion_Fundamentals/README.md)).

---

## 10. Complexity analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| `[...arr]`, `slice`, `{...obj}` | O(n) | O(n) | copies every top-level slot |
| `grid.map(r => [...r])` | O(R·C) | O(R·C) | copies every cell |
| `structuredClone` / `deepClone` | O(total nodes) | O(total nodes) + O(depth) stack | visits every nested value once (WeakMap prevents revisits) |
| `JSON.parse(JSON.stringify(x))` | O(size of JSON text) | same | builds a full string first |
| `deepEqual(a, b)` | O(total nodes) | O(depth) | stops at first difference |
| `a === b` on objects | O(1) | O(1) | compares references only |
| `arr.includes(x)` / `indexOf` | O(n) | O(1) | linear scan |
| `set.has(x)` / `map.get(x)` | O(1) average | — | hash lookup by SameValueZero |
| `memoize(fn)(x)` hit | O(key size) | O(#distinct keys) | builds a key, one Map lookup |

---

## 11. Alternatives (trade-offs)

- **Copy vs mutate in place.** Copying is safer and easier to reason about; mutating saves O(n) memory. Interviews asking for "O(1) extra space" want in-place mutation (e.g. rotate by reversal).
- **`structuredClone` vs hand-written clone.** Use `structuredClone` in real code. Write your own in interviews because they ask, and because it shows you understand cycles.
- **`JSON.stringify` key vs nested Map memo.** A string key is simple; nested Maps avoid building strings but are more code.
- **Generator vs array.** A generator is lazy (O(1) memory) but slower per item; an array is fast to index and reuse.

---

## 12. Common mistakes (and why they happen)

1. **`new Array(n).fill([])`**: `fill` puts the *same* object in every slot. Use `Array.from({ length: n }, () => [])`.
2. **Pushing a live array into results** (`res.push(path)`): you stored a reference that keeps changing.
3. **Using `===` or `Set` on arrays/objects** and expecting structural comparison.
4. **`for...in` on arrays**: keys are strings (`'0' + 1 === '01'`) and inherited keys appear.
5. **`<=` instead of `<`** reading `arr[n]` → `undefined` → `NaN` silently spreads through sums.
6. **Mutating an array while iterating it** with `for...of` or `forEach` (skips or repeats elements).
7. **Default `sort()` is lexicographic**: `[10, 9, 1].sort()` → `[1, 10, 9]`. Always pass `(a, b) => a - b`.
8. **Module-level memo shared across test cases** (stale answers after the input changes).
9. **Trusting the JSON clone** for data with `Date`, `Map`, `undefined` or `NaN`.

---

## 13. Patterns / variations with templates

**Copy a grid**
```js
const copy = grid.map(row => [...row]);
```

**Snapshot the path in backtracking**
```js
if (done) { result.push([...path]); return; }
```

**Arrays as Map/Set keys**
```js
const key = (r, c) => `${r},${c}`;      // or arr.join(',')
seen.add(key(r, c));
```

**Every window of size k (boundary-safe)**
```js
for (let start = 0; start + k <= n; start++) { /* window [start, start + k) */ }
```

**Count of multiples in an inclusive range**
```js
const countMultiples = (lo, hi, k) => Math.floor(hi / k) - Math.floor((lo - 1) / k);
```

**Memoize with a closure**
```js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}
```

**Lazy iterable**
```js
function* range(start, end, step = 1) { for (let i = start; step > 0 ? i < end : i > end; i += step) yield i; }
```

---

## 14. Recognition clues

**Use these fundamentals deliberately when:**
- you store state for later (results arrays, memo tables, visited sets) → copy or key it;
- the problem says "in place" or "O(1) extra space" → mutate, and say so;
- you compare structures (seen configurations, equal trees, duplicates of arrays) → string keys or deepEqual;
- you loop over windows, pairs (`i < j`) or neighbours (`i + 1`) → write the range out first.

**When it does NOT apply / overkill:**
- Copying immutable primitives or strings: they are already safe to share.
- Deep cloning when you only read the data: sharing is free and correct.
- Deep equality when a single hash/key per item suffices (e.g. sorted-string key for anagrams).

---

## 15. Interview application

**Talk track:**
- "I'll copy the input first so I don't mutate the caller's array. If you prefer O(1) extra space I can do it in place."
- "I'm pushing a copy of `path` because `path` keeps changing as I backtrack."
- "Arrays compare by reference, so I'll key the Set with a string like `r,c`."
- "My loop runs over `[0, n - k]` inclusive, which is every start of a window of size k. Let me check n = k: one window, correct."

**What to clarify:**
- May I mutate the input? Is the input shared with other code?
- Can values be `NaN`, `-0`, `null`, nested, cyclic?
- Are bounds inclusive or exclusive? Can `k` exceed `n`? Can `n` be 0?

---

## 16. Problems in this topic

| # | Problem | Difficulty | Focus |
|---|---|---|---|
| 01 | [Count FizzBuzz in a Range](../03_Problems/01_Easy/01_fizzbuzz_range_count.md) | Easy | inclusive bounds, inclusion–exclusion |
| 02 | [Frequency Map](../03_Problems/01_Easy/02_frequency_map.md) | Easy | Map keys, SameValueZero, NaN / -0 |
| 03 | [Chunk an Array](../03_Problems/01_Easy/03_chunk_array.md) | Easy | step loops, last partial chunk |
| 04 | [Rotate in Place](../03_Problems/02_Medium/04_rotate_in_place.md) | Medium | mutation, k mod n, triple reverse |
| 05 | [Flatten to Depth](../03_Problems/02_Medium/05_flatten_depth.md) | Medium | recursion vs explicit stack, holes |
| 06 | [Deep Equal](../03_Problems/02_Medium/06_deep_equal.md) | Medium | equality semantics, structure walk |
| 07 | [Memoize with a Closure](../03_Problems/02_Medium/07_memoize_closure.md) | Medium | closures, cache keys |
| 08 | [Lazy Range Iterable](../03_Problems/02_Medium/08_range_iterable.md) | Medium | iteration protocol, negative steps |
| 09 | [Deep Clone with Cycles](../03_Problems/03_Hard/09_deep_clone.md) | Hard | references, WeakMap, Map/Set/Date |

**Practice more (LeetCode):** 189 Rotate Array, 412 Fizz Buzz, 2677 Chunk Array, 2625 Flatten Deeply Nested Array, 2628 JSON Deep Equal, 2623 Memoize, 2632 Curry, 1480 Running Sum of 1d Array, 1929 Concatenation of Array, 26 Remove Duplicates from Sorted Array.
