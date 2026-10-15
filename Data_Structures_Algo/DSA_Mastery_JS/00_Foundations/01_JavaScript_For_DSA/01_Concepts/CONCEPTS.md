# JavaScript for DSA

You already write JavaScript every day for the frontend. DSA uses a **small, specific subset**
of the language, and it punishes a handful of gotchas that never bite you in React code
(the default `sort` is alphabetical, `new Array(3).fill([])` shares one array, recursion
dies at ~10k calls). Think of this folder as the toolbox you carry into every problem: you
should know every tool in it without looking.

---

## Prerequisites

- None for the curriculum. You should already be comfortable writing everyday JavaScript (functions, arrays, objects, classes).
- Have Node.js 22 or newer installed so you can run `node <file>.js` and `node --test`.

---

## Why it matters / when to use

- Interviews are time-boxed. Fumbling with `Array.from` or `Map` syntax costs minutes.
- Many wrong answers are JS gotchas, not algorithm mistakes: `[10, 9, 1].sort()` gives `[1, 10, 9]`.
- You need to know the **cost** of what you call (`shift` is O(n), `Map.get` is O(1)).
- Choosing `Map` vs plain object vs `Set` correctly is a frequent interview check.
- Large inputs hit integer limits (`2^53`) and stack limits (recursion depth).

---

## How it works

Everything below is runnable with asserts in `02_Implementations/js_cheatsheet.js`.

### 1. Arrays

```js
// creation
const a = [1, 2, 3];
const zeros = new Array(5).fill(0);                       // [0,0,0,0,0]
const squares = Array.from({ length: 5 }, (_, i) => i * i); // [0,1,4,9,16]
const letters = Array.from('abc');                        // ['a','b','c']
const range = [...Array(4).keys()];                       // [0,1,2,3]

// 2D array: THE TRAP
const bad = new Array(3).fill([]);          // ONE inner array shared by all 3 rows!
bad[0].push(1);                             // bad = [[1],[1],[1]]
const good = Array.from({ length: 3 }, () => []);   // 3 separate rows
const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));

// destructuring and swap
const [first, second, ...rest] = [1, 2, 3, 4];
[arr[i], arr[j]] = [arr[j], arr[i]];        // swap without a temp

// sort: THE OTHER TRAP. Default compares as STRINGS.
[10, 9, 1].sort();                          // [1, 10, 9]   wrong
[10, 9, 1].sort((x, y) => x - y);           // [1, 9, 10]   ascending
[10, 9, 1].sort((x, y) => y - x);           // [10, 9, 1]   descending
people.sort((p, q) => p.age - q.age || p.name.localeCompare(q.name)); // tie-break
// sort is in place and returns the same array. Use [...arr].sort() to keep the original.
// sort is stable since ES2019 (equal elements keep their order).

// splice (mutates) vs slice (copies)
const s = [1, 2, 3, 4, 5];
s.slice(1, 3);        // [2, 3]      s unchanged, end index excluded, negative counts from end
s.splice(1, 2);       // removes [2, 3] from s -> s = [1, 4, 5]; O(n)
s.splice(1, 0, 9);    // insert 9 at index 1 -> [1, 9, 4, 5]

// useful
arr.at(-1)                      // last element (same as arr[arr.length - 1])
arr.indexOf(x), arr.includes(x) // O(n)
arr.findIndex(fn), arr.find(fn) // O(n)
arr.flat(), arr.flatMap(fn)
arr.every(fn), arr.some(fn)
arr.reduce((acc, x) => acc + x, 0)
arr.fill(value, start, end)
arr.join(',')
```

### 2. Strings

```js
const str = 'hello';
str[1];                  // 'e'  (read only: str[1] = 'x' silently does nothing)
str.length;              // 5
str.charCodeAt(0);       // 104  ('a' is 97, 'z' is 122, 'A' is 65, '0' is 48)
String.fromCharCode(97); // 'a'
'c'.charCodeAt(0) - 'a'.charCodeAt(0);   // 2 -> index into a 26-slot array

str.split('');           // ['h','e','l','l','o']   (breaks on emoji; use [...str])
arr.join('');            // back to a string
str.slice(1, 3);         // 'el'
str.indexOf('l');        // 2
str.includes('ell');     // true
str.startsWith('he');    // true
str.toUpperCase(); str.toLowerCase(); str.trim();
str.repeat(3);
str.replace('l', 'L');   // only first;  str.replaceAll('l', 'L') for all
str.padStart(8, '0');

// building: do not += in a hot loop when n is huge. Collect then join.
const pieces = []; for (...) pieces.push(ch); const out = pieces.join('');

// comparison: lexicographic by char code
'apple' < 'banana';   // true
'Zebra' < 'apple';    // true ('Z' = 90 < 'a' = 97)   -> lowercase first if you need case-insensitive
'10' < '9';           // true (string compare!) -> Number('10') < 9

// template literals for keys
const key = `${row},${col}`;   // use as a Map / Set key for grid coordinates
```

### 3. Map vs Object vs Set

| | `Map` | plain `{}` | `Set` |
|---|---|---|---|
| keys | any type (numbers, objects, NaN) | strings & symbols only (numbers become strings) | values, not keys |
| order | insertion order guaranteed | integer-like keys come first, then insertion | insertion order |
| size | `map.size` O(1) | `Object.keys(o).length` O(n) | `set.size` |
| lookup | `map.get(k)`, `map.has(k)` | `o[k]`, `k in o` | `set.has(v)` |
| iterate | `for (const [k, v] of map)` | `for (const k in o)` / `Object.entries(o)` | `for (const v of set)` |
| pitfalls | none really | prototype keys (`'constructor' in {}` is true), number keys stringified | |
| use for | counts, memo, adjacency lists, anything keyed by number/object | tiny fixed-shape records, JSON-like data | "have I seen this?", dedupe |

```js
const count = new Map();
for (const ch of str) count.set(ch, (count.get(ch) ?? 0) + 1);

const seen = new Set([1, 2, 2, 3]);       // {1, 2, 3}
seen.add(4); seen.has(2); seen.delete(1); [...seen];

// a pair/coordinate as a key: objects/arrays are compared by REFERENCE
const visited = new Set(); visited.add(`${r},${c}`);   // stringify it
```

### 4. Numbers

```js
Number.MAX_SAFE_INTEGER;   // 9007199254740991 = 2^53 - 1. Above this, integers lose precision.
2 ** 53 === 2 ** 53 + 1;   // true  (!)
Number.isSafeInteger(2 ** 53);  // false

// BigInt when the problem has numbers above 2^53 (factorials, huge products)
const big = 2n ** 64n;     // 18446744073709551616n
typeof big;                // 'bigint'  -- cannot mix with Number: 1n + 1 throws
BigInt(5) * 3n;            // 15n

// integer division
Math.floor(7 / 2);   // 3
Math.trunc(-7 / 2);  // -3   (toward zero)
Math.floor(-7 / 2);  // -4   (toward -infinity)   <- these differ for negatives!
(-7 / 2) | 0;        // -3   bitwise truncates toward zero, but only works below 2^31
(7 / 2) >> 0;        // 3    same caveat

// modulo with negatives: JS % keeps the sign of the DIVIDEND
-7 % 3;                   // -1  (not 2 as in Python)
((-7 % 3) + 3) % 3;       // 2   <- the "positive mod" idiom
(x % m + m) % m           // always in [0, m)

// sentinels
let best = -Infinity;     // safe initial max
let min = Infinity;       // safe initial min
Number.MAX_VALUE;         // 1.79e308, rarely needed
Number.EPSILON;           // for float compare: Math.abs(a - b) < Number.EPSILON

// conversion gotchas
parseInt('42px');       // 42        (stops at first non-digit)
parseInt('0x1f');       // 31        (auto-detects hex)
parseInt('08');         // 8         (fine in modern JS, older engines treated as octal)
parseInt('abc');        // NaN
Number('42px');         // NaN       (strict)
Number('');             // 0         (!)
+'3.5';                 // 3.5
parseInt('3.9');        // 3
Number.isInteger(3.0);  // true
Number.isNaN(x);        // use this, not x === NaN (always false)
(255).toString(2);      // '11111111'   number -> base string
parseInt('ff', 16);     // 255          base string -> number
(3.14159).toFixed(2);   // '3.14'  (string!)
```

### 5. Bitwise basics

Bitwise operators treat numbers as **32-bit signed integers**. Fine for most DSA; wrong above 2^31.

```js
5 & 3;      // 1   AND   (101 & 011 = 001)
5 | 3;      // 7   OR
5 ^ 3;      // 6   XOR   (x ^ x = 0, x ^ 0 = x -> finds the single non-duplicate)
~5;         // -6  NOT   (~x = -x - 1)
1 << 3;     // 8   left shift = multiply by 2^k
16 >> 2;    // 4   right shift = integer divide by 2^k (keeps sign)
-16 >>> 1;  // huge positive: unsigned shift, rarely wanted

n & 1;             // 1 if odd
n & (n - 1);       // clears the lowest set bit; === 0 means power of two
n & -n;            // isolates the lowest set bit
(mask >> i) & 1;   // is bit i set?
mask | (1 << i);   // set bit i
mask & ~(1 << i);  // clear bit i
```

More in `14_Bit_Manipulation`.

### 6. Classes and #private fields

```js
class Stack {
  #items = [];                       // private: cannot be reached from outside
  push(value) { this.#items.push(value); return this; }
  pop() { return this.#items.pop(); }
  get size() { return this.#items.length; }   // getter: stack.size without ()
  static from(iterable) { const s = new Stack(); for (const x of iterable) s.push(x); return s; }
}

class ListNode {
  constructor(value, next = null) { this.value = value; this.next = next; }
}
```

### 7. Closures

A function remembers the variables of the scope it was created in. Useful for counters,
memoization, and "generator-like" helpers.

```js
function makeCounter() {
  let count = 0;                     // captured by the returned function
  return () => ++count;
}
const next = makeCounter(); next(); next(); // 2

function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}
```

### 8. Recursion and the call stack limit

```js
function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }
factorial(5000);   // Infinity (number overflow), but it RUNS
factorial(20000);  // RangeError: Maximum call stack size exceeded
```

Node's default stack allows roughly **10,000-11,000 frames**. If recursion depth can reach the
input size (linked list of 10^5 nodes, DFS on a long path), use a loop or an explicit stack.
No tail-call optimization in V8.

### 9. Iterators and generators (briefly)

```js
for (const [index, value] of arr.entries()) {}   // index + value
for (const [key, value] of map) {}
for (const ch of 'héllo') {}                       // iterates code points, safe for emoji

function* idGenerator() { let id = 1; while (true) yield id++; }
const ids = idGenerator(); ids.next().value; // 1
// generators are handy for in-order tree traversal or lazy sequences; rarely needed in interviews.
```

### 10. Helpful built-ins and their traps

```js
Math.max(...arr);          // fine for small arrays; throws RangeError around 100k+ args
arr.reduce((m, x) => Math.max(m, x), -Infinity);   // safe for any size
Math.max();                // -Infinity (no args)
Math.min();                // Infinity

Math.floor, Math.ceil, Math.round, Math.trunc, Math.abs, Math.sqrt, Math.pow, Math.hypot
Math.log2(8);              // 3
Number.isInteger(Math.sqrt(49));   // perfect-square check

structuredClone(obj);      // deep copy (Node 17+)
Array.isArray(x)
Object.entries(obj).sort(([, a], [, b]) => b - a)   // sort object by value
String(x), Number(x), Boolean(x)
Number.parseInt === parseInt;      // true
localeCompare for strings in sort: a.localeCompare(b)
```

### 11. Writing and running tests with node + assert

No framework needed. The built-in `assert` module throws on failure, and `node file.js`
prints nothing extra on success.

```js
const assert = require('assert');

assert.strictEqual(add(1, 2), 3);                  // primitives, ===
assert.deepStrictEqual(twoSum([2, 7], 9), [0, 1]); // arrays / objects, structural
assert.ok(isPalindrome('aba'));                    // truthy
assert.throws(() => stack.pop(), /empty/);         // expects an error
assert.notStrictEqual(a, b);

console.log('✓ my-problem passed');                // only reached if nothing threw
module.exports = { optimal, bruteForce };          // so other files can require() it
```

Run: `node 03_Problems/solutions/01_two_sum.js`. Run everything in a folder:
`for f in problems/*.js; do node "$f"; done`.

Tip: put both solutions in a loop so they must agree:
`for (const solve of [bruteForce, optimal]) { assert.deepStrictEqual(solve(input), expected); }`.

---

## Pseudocode

The one routine you will write in almost every problem is a **frequency count**. Learn its two shapes:

```
COUNT WITH A MAP (any keys)              COUNT WITH AN ARRAY (keys are 'a'..'z')
count <- new Map()                        count <- array of 26 zeros
for x in items:                           for ch in s:
    count.set(x, (count.get(x) ?? 0) + 1)     count[code(ch) - code('a')] += 1
```

And the safe way to create a grid:

```
grid <- Array.from({ length: rows }, () => new Array(cols).fill(0))   // fresh row each time
```

---

## Dry run on a concrete example

Why `[10, 9, 1].sort()` gives `[1, 10, 9]`: the default sort converts numbers to strings and compares them character by character.

| compared pair | as strings | first differing char | order |
|---|---|---|---|
| 10 vs 9 | "10" vs "9" | '1' < '9' | 10 before 9 |
| 1 vs 10 | "1" vs "10" | "1" is a prefix | 1 before 10 |
| 1 vs 9 | "1" vs "9" | '1' < '9' | 1 before 9 |

Result: `[1, 10, 9]`. With `sort((a, b) => a - b)` the comparator returns a number (negative, zero, positive) and the result is `[1, 9, 10]`.

---

## Operations & complexity

| Operation | Time | Note |
|---|---|---|
| `arr[i]`, `str[i]`, `.length` | O(1) | |
| `push`, `pop` | O(1) amortized | |
| `shift`, `unshift`, `splice` | O(n) | shifts elements |
| `slice`, spread, `concat`, `map`, `filter` | O(n) | allocate a copy |
| `indexOf`, `includes`, `find` | O(n) | |
| `sort(cmp)` | O(n log n) | |
| `Map`/`Set` `get/set/has/delete` | O(1) avg | |
| `Object.keys/values/entries` | O(k) | |
| `str + str`, `str.slice` | O(n) | immutable |
| `str.split`, `arr.join` | O(n) | |
| `Math.max(...arr)` | O(n) | argument limit |
| `structuredClone`, `JSON.parse(JSON.stringify())` | O(size) | |

---

## JavaScript implementation

Every snippet above is verified with `assert` in `02_Implementations/js_cheatsheet.js`. Read it top to bottom
once, then run `node 02_Implementations/js_cheatsheet.js` and play with it.

---

## Patterns / variations

### 1. Frequency count (array for a-z, Map for anything)

```js
const freq = new Array(26).fill(0);
for (const ch of str) freq[ch.charCodeAt(0) - 97]++;

const counts = new Map();
for (const x of items) counts.set(x, (counts.get(x) ?? 0) + 1);
```

### 2. Grid helpers

```js
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const inBounds = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
for (const [dr, dc] of DIRS) { const nr = r + dr, nc = c + dc; if (inBounds(nr, nc)) {} }
```

### 3. Sorting with a comparator

```js
intervals.sort((a, b) => a[0] - b[0]);                   // by start
words.sort((a, b) => a.length - b.length || a.localeCompare(b)); // length, then alpha
```

### 4. Safe max / min of a big array

```js
let best = -Infinity;
for (const x of arr) if (x > best) best = x;
```

### 5. Positive modulo and integer division

```js
const mod = (x, m) => ((x % m) + m) % m;
const div = (x, y) => Math.trunc(x / y);   // matches C/Java integer division
```

### 6. Custom key for a Map/Set

```js
visited.add(`${row},${col}`);      // or row * cols + col as a number (faster)
```

---

## Alternatives and trade-offs

| Need | First choice | Alternative | When to switch |
|---|---|---|---|
| Key → value | `Map` | plain object | object only for fixed string keys (JSON-like data) |
| Membership | `Set` | `arr.includes` | `includes` only for tiny arrays (it is O(n)) |
| Counting a-z | 26-slot array | `Map` | `Map` when the alphabet is unknown or Unicode |
| Queue | index pointer over an array, or a deque class | `shift()` | `shift()` is O(n); fine only for small inputs |
| Big integers | `Number` (safe to 2^53 - 1) | `BigInt` | values above 9e15 or exact modular products |
| Deep recursion | recursion | explicit stack | depth beyond ~10,000 frames |

---

## Common mistakes & edge cases

- `arr.sort()` without a comparator on numbers.
- `new Array(n).fill([])` or `.fill({})` sharing one object.
- `new Array(3)` creates 3 EMPTY slots, not `[undefined x3]`; `.map` skips holes. Use `.fill(0)` or `Array.from`.
- `str[i] = 'x'` silently does nothing.
- `'10' < '9'` is true. Convert before comparing.
- `-7 % 3 === -1`. Use the positive-mod idiom.
- `x === NaN` is always false. Use `Number.isNaN`.
- `Number('')` is 0, `parseInt('')` is NaN.
- Bitwise on numbers above 2^31 gives garbage. `(2 ** 31) | 0` is negative.
- `Math.max(...hugeArray)` throws. Use a loop.
- Object keys are strings: `obj[1]` and `obj['1']` are the same key. Use `Map` for numeric keys you must distinguish.
- Using an array or object as a `Set`/`Map` key compares by reference, not content.
- `arr.length = 0` empties an array in place; `arr = []` creates a new one (matters if others hold a reference).
- Deep recursion beyond ~10k frames crashes.
- `const` prevents reassignment, not mutation: `const a = []; a.push(1)` is fine.
- Forgetting that `splice` and `sort` and `reverse` mutate the caller.

---

## When this does NOT apply

- These tricks are about **plain JavaScript in Node**. Browser-only APIs, TypeScript types and npm packages are not part of the toolbox here.
- `Map`/`Set` compare objects **by reference**. Two equal arrays are two different keys, so encode them as strings first.
- Bitwise operators work on **32-bit integers**. Do not use `| 0` or `>> 1` on values that may exceed 2^31.
- `Math.max(...arr)` and `push(...arr)` with very large arrays can throw "Maximum call stack size exceeded"; use a loop.

---

## Interview tips

- Say "I'll use a Map because keys may be numbers and I want O(1) lookups and `.size`".
- When sorting numbers, write the comparator immediately and say why.
- If you write `shift()` in a loop, call out that it is O(n) and offer a head index instead.
- Mention `MAX_SAFE_INTEGER`/`BigInt` when products or factorials can get large.
- For deep recursion, say "I'd convert this to an iterative version for very deep inputs".
- Use `#private` fields in classes: it shows you know modern JS.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| - | Every snippet in this README, verified with asserts | - | language reference | 02_Implementations/js_cheatsheet.js |

---

## Practice more

These problems are mostly about handling JS correctly:

Easy: Reverse String (344), Valid Anagram (242), Plus One (66), Single Number (136),
Number of 1 Bits (191), Palindrome Number (9), Fizz Buzz (412), Power of Two (231)

Medium: Sort an Array (912, write your own comparator and your own sort), String to Integer
(atoi) (8), Reverse Integer (7), Kth Largest Element (215), Top K Frequent Elements (347),
Design HashMap (706), Add Binary (67), Multiply Strings (43)
