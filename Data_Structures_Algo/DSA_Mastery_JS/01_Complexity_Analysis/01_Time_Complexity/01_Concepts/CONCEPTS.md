# Big-O and Time Complexity

**Big-O** is a way to describe how the running time of code **grows** as the input gets bigger.
It does not measure seconds. It answers: "if I double the input, does the work stay the same,
double, quadruple, or explode?" Think of it like describing a car by its fuel consumption per km
rather than by one specific trip: it tells you how it behaves on *any* trip.

---

## Prerequisites

- [JavaScript For DSA](../../../00_Foundations/01_JavaScript_For_DSA/README.md): loops, recursion and built-in methods (some built-ins hide loops).
- High-school math: exponents and logarithms (log2 of 1,000,000 is about 20).

---

## Why it matters / when to use

- Every interview ends with "what is the time and space complexity?". You must answer instantly.
- The input size in the constraints tells you which complexity is acceptable (see the table
  in `02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem`). Big-O is how you pick an approach *before* coding.
- "Can you do better?" means "can you lower the Big-O?". You need to know what is below you.
- Comparing two solutions: O(n log n) vs O(n^2) decides which to write.
- Spotting hidden costs: `arr.includes(x)` inside a loop silently makes it O(n^2).

---

## How it works

Big-O counts the number of **basic steps** as a function of input size `n`, then keeps only the
part that matters when `n` is huge.

```
  steps
    ^                                     O(2^n)     O(n^2)
    |                                    /          /
    |                                   /         /
    |                                  /        /        O(n log n)
    |                                 /       /       ..
    |                                /      /     ..
    |                               /     /   ..            O(n)
    |                             /    /  ..        ______
    |                          /   / ..     _______
    |                      /  / ..  _______                 O(log n)
    |                __/ _/._______ _ _ _ _ _ _ _ _ _ _ _ _ O(1)
    +-------------------------------------------------------> n
```

From fastest to slowest (for large n):

| Big-O | Name | Example | n = 1,000 -> steps |
|---|---|---|---|
| O(1) | constant | array index, Map.get, push/pop | 1 |
| O(log n) | logarithmic | binary search, heap push/pop | ~10 |
| O(n) | linear | one loop, scanning an array | 1,000 |
| O(n log n) | linearithmic | good sorting, n binary searches | ~10,000 |
| O(n^2) | quadratic | nested loops over the same array | 1,000,000 |
| O(n^3) | cubic | triple nested loops | 10^9 |
| O(2^n) | exponential | all subsets, naive fibonacci | 10^301 (impossible) |
| O(n!) | factorial | all permutations | way worse |

Rule of thumb: JavaScript does roughly **10^8 simple operations per second**.

### The classes with JS examples

```js
// O(1): the work does not depend on n
function first(arr) { return arr[0]; }

// O(log n): each step cuts the problem in half
function binarySearch(sorted, target) {
  let low = 0, high = sorted.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;           // 1000 -> 500 -> 250 -> ... about 10 steps
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) low = mid + 1; else high = mid - 1;
  }
  return -1;
}

// O(n): one pass
function sum(arr) { let total = 0; for (const x of arr) total += x; return total; }

// O(n log n): n items, each costing log n (sorting, or a loop with binary search inside)
function sortNums(arr) { return [...arr].sort((a, b) => a - b); }

// O(n^2): every element against every other element
function hasDuplicatePair(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] === arr[j]) return true;
  return false;
}

// O(2^n): every element is either in or out -> 2 choices, n times
function subsets(arr) {
  if (arr.length === 0) return [[]];
  const rest = subsets(arr.slice(1));
  return [...rest, ...rest.map((s) => [arr[0], ...s])];
}

// O(n!): n choices, then n-1, then n-2 ...
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) =>
    permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
}
```

All of these are runnable in `02_Implementations/complexity_examples.js`.

### The three simplification rules

1. **Drop constants.** `2n` steps is O(n). `n/2` is O(n). A loop that runs twice in a row is
   still O(n), not O(2n).
2. **Drop non-dominant terms.** `n^2 + n + 5` is O(n^2). When n is a million, the `n` is noise.
3. **Different inputs get different variables.** A loop over `a` nested in a loop over `b` is
   O(a * b), NOT O(n^2). Two loops in sequence over `a` then `b` is O(a + b).

```js
function twoInputs(a, b) {
  for (const x of a) console.log(x);     // O(a)
  for (const y of b) console.log(y);     // O(b)
}                                        // total O(a + b)

function nested(a, b) {
  for (const x of a)
    for (const y of b) console.log(x, y); // O(a * b)
}
```

### How to analyze code

**Single loop:** count how many times the body runs. `for (i = 0; i < n; i++)` -> n -> O(n).

**Loop that halves or doubles:** `for (i = 1; i < n; i *= 2)` -> log2(n) iterations -> O(log n).

**Nested loops:** multiply. Two loops to n -> O(n^2). Inner loop `j < i` is still O(n^2)
because 1 + 2 + ... + n = n(n+1)/2, and we drop constants.

**Loop with an expensive call inside:** multiply by the cost of the call.
`for each of n items: arr.includes(x)` -> n * O(n) = O(n^2). `for each of n items: map.has(x)` -> n * O(1) = O(n).

**Sequential blocks:** add, then keep the biggest. Sort (n log n) then one loop (n) -> O(n log n).

**Recursion:** total work = (number of calls) * (work per call). Draw the call tree.

```js
// one recursive call, shrinks by 1, O(1) work per call  -> n calls -> O(n)
function sumTo(n) { return n === 0 ? 0 : n + sumTo(n - 1); }

// one recursive call, shrinks by half                    -> log n calls -> O(log n)
function power(x, n) {
  if (n === 0) return 1;
  const half = power(x, n >> 1);
  return n % 2 ? half * half * x : half * half;
}

// TWO recursive calls, each shrinks by 1  -> 2^n calls   -> O(2^n)
function fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }

// TWO recursive calls, each half the size, O(n) work to merge -> O(n log n)  (merge sort)
```

**Recurrence intuition.** Write T(n) as "calls at this level * size of each + work at this level":

| Recurrence | Meaning | Result |
|---|---|---|
| T(n) = T(n - 1) + O(1) | one call, shrink by 1 | O(n) |
| T(n) = T(n / 2) + O(1) | one call, halve | O(log n) |
| T(n) = 2 T(n / 2) + O(n) | two halves plus linear merge | O(n log n) |
| T(n) = 2 T(n / 2) + O(1) | two halves, constant work (tree traversal) | O(n) |
| T(n) = 2 T(n - 1) + O(1) | two calls, shrink by 1 | O(2^n) |
| T(n) = n T(n - 1) | n branches each shrinking by 1 | O(n!) |

**Master theorem (lightly).** For T(n) = a * T(n / b) + O(n^d), compare `d` with `log_b(a)`:
- d > log_b(a) -> O(n^d) (the top-level work dominates)
- d = log_b(a) -> O(n^d * log n) (every level does the same work; merge sort: a=2, b=2, d=1)
- d < log_b(a) -> O(n^(log_b a)) (the leaves dominate; e.g. a=2, b=2, d=0 gives O(n))

You rarely need the formula in an interview, but "two halves plus linear merge is n log n"
should be instant.

### Amortized analysis

Sometimes one operation is expensive but it happens rarely enough that the **average over a
sequence** is cheap. The classic: `array.push`.

```
capacity 1: push -> full, grow to 2 (copy 1)
capacity 2: push -> full, grow to 4 (copy 2)
capacity 4: push, push -> full, grow to 8 (copy 4)
...
n pushes: total copies = 1 + 2 + 4 + ... + n/2 < n   -> O(n) total -> O(1) per push on average
```

So we say push is **amortized O(1)**. Same idea: a monotonic stack is O(n) total because each
element is pushed and popped at most once, even though a single step might pop many.
See `03_Arrays/02_Implementations/dynamic_array.js` for a hand-built version.

---

## Pseudocode

A routine for analysing any piece of code:

```
analyse(code):
    for each loop: cost <- (number of iterations) * (cost of the body)
    nested loops multiply; loops one after another add
    for each built-in call: look up its cost (includes/indexOf/slice/splice/shift are O(n))
    for recursion: cost <- (number of calls) * (work per call)
                    or write a recurrence, e.g. T(n) = 2T(n/2) + O(n) -> O(n log n)
    drop constants and lower-order terms; keep the dominant term per input size
    state best / average / worst case if they differ
```

---

## Dry run on a concrete example

Counting the work of a classic nested loop for `n = 4`:

```js
for (let i = 0; i < n; i++)
  for (let j = i + 1; j < n; j++) count++;
```

| i | j values | inner iterations | running total |
|---|---|---|---|
| 0 | 1, 2, 3 | 3 | 3 |
| 1 | 2, 3 | 2 | 5 |
| 2 | 3 | 1 | 6 |
| 3 | - | 0 | 6 |

Total = 3 + 2 + 1 = n(n - 1)/2 = 6. The formula is about n²/2; drop the constant 1/2, so it is **O(n²)**.

---

## Operations & complexity

Cost of common JavaScript built-ins. Memorize this table.

| Operation | Time | Note |
|---|---|---|
| `arr[i]`, `arr.length` | O(1) | direct index |
| `arr.push(x)`, `arr.pop()` | O(1) amortized | end of array |
| `arr.shift()`, `arr.unshift(x)` | O(n) | every element moves one slot. Avoid in loops |
| `arr.splice(i, k)` | O(n) | shifts everything after i |
| `arr.slice(i, j)` | O(j - i) | copies, up to O(n) |
| `arr.indexOf(x)`, `arr.includes(x)`, `arr.find(fn)` | O(n) | linear scan. Inside a loop -> O(n^2) |
| `arr.concat(b)`, `[...arr, ...b]` | O(n + m) | copies both |
| `arr.sort(cmp)` | O(n log n) | TimSort; stable since ES2019 |
| `arr.reverse()` | O(n) | in place |
| `arr.map / filter / reduce / forEach` | O(n) * cost of callback | |
| `str[i]`, `str.length`, `str.charCodeAt(i)` | O(1) | |
| `str + other`, `str.slice(i, j)` | O(n) in theory | V8 ropes make `+=` fast in practice; array + join is the safe answer |
| `str.split(sep)`, `arr.join(sep)` | O(n) | |
| `str.indexOf(sub)`, `str.includes(sub)` | O(n * m) worst | |
| `map.get / set / has / delete` | O(1) average | hash table |
| `set.add / has / delete` | O(1) average | hash table |
| `map.size`, `set.size` | O(1) | |
| `Object.keys(obj)`, `Object.values`, `Object.entries` | O(k) | k = number of keys; allocates an array |
| `obj[key]`, `key in obj` | O(1) average | |
| `[...map]`, `[...set]`, `Array.from(x)` | O(n) | |
| `Math.max(...arr)` | O(n) | and it throws for ~100k+ elements (argument limit), use a loop |
| `JSON.parse(JSON.stringify(x))` | O(size) | deep copy, slow |

---

## JavaScript implementation

`02_Implementations/complexity_examples.js` contains one runnable function per complexity class, each with a
step counter so you can *see* the growth, plus a tiny timing demo that compares
`includes` inside a loop (O(n^2)) with a `Set` lookup (O(n)). Run `node 02_Implementations/complexity_examples.js`.

```js
// count the steps instead of trusting your gut
let steps = 0;
for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) steps++;
// n = 10 -> 100, n = 100 -> 10,000: quadratic
```

---

## Patterns / variations

### 1. The "inner lookup" upgrade: O(n^2) -> O(n)

```js
// slow: includes is O(n), inside an O(n) loop
function hasDupSlow(arr) {
  for (let i = 0; i < arr.length; i++)
    if (arr.slice(0, i).includes(arr[i])) return true;
  return false;
}
// fast: Set.has is O(1)
function hasDupFast(arr) {
  const seen = new Set();
  for (const x of arr) { if (seen.has(x)) return true; seen.add(x); }
  return false;
}
```
Use when: any time you write `includes`, `indexOf`, or `find` inside a loop.

### 2. Sort first: O(n^2) -> O(n log n)

Many pair / interval / duplicate problems become a single pass after sorting. Sorting costs
O(n log n), which is cheaper than the O(n^2) you avoid.

### 3. Binary search instead of scanning: O(n) -> O(log n)

If the data is sorted (or the answer is monotonic: "the smallest x such that..."), halve the
search space every step. See `10_Searching`.

### 4. Memoize recursion: O(2^n) -> O(n)

```js
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, value);
  return value;
}
```
Each `n` is computed once -> n calls -> O(n). See `29_Dynamic_Programming`.

### 5. Best / average / worst case

Big-O usually means **worst case**. Say so. Quick sort is O(n log n) on average, O(n^2) worst.
Hash map lookup is O(1) average, O(n) worst (all keys collide; practically never in JS).
If an early `return` can make it faster, mention "best case O(1), worst case O(n)".

---

## Alternatives and trade-offs

| Way to judge speed | What it tells you | Limitation |
|---|---|---|
| Big-O (worst case) | how the cost grows with input size | hides constants; two O(n) solutions can differ 10x |
| Average / expected case | typical behaviour (hash maps, quicksort) | can still hit the worst case on bad input |
| Amortized analysis | average per operation over a sequence (`push`) | single operations can still be slow |
| Benchmarking (`console.time`) | real speed on real data | depends on machine, JIT warm-up and input |
| Counting operations | exact numbers for small inputs | tedious; use only to confirm a guess |

---

## Common mistakes & edge cases

- Calling two sequential loops O(n^2). Sequential = add (O(n)), nested = multiply (O(n^2)).
- Forgetting the cost of a built-in inside a loop (`includes`, `shift`, `splice`, `slice`, `indexOf`, string concat).
- Using `n` for everything. If there are two inputs (two arrays, a string and a pattern), use two variables.
- Calling `for (i = 1; i < n; i *= 2)` O(n). It is O(log n).
- Saying binary search is O(n / 2). Halving each step is O(log n), not division by a constant.
- Ignoring the cost of recursion stack depth (that is space, see `01_Complexity_Analysis/02_Space_Complexity`).
- Thinking a lower Big-O is always faster. For n = 10, a simple O(n^2) often beats a complex O(n log n). Big-O is about growth, not small inputs.
- Confusing O(log n) bases. log2 vs log10 differ by a constant, so we just write O(log n).

---

## When this does NOT apply

- **Tiny, fixed-size inputs**: O(n²) on 10 items is instant. Big-O only matters as n grows.
- **Constant factors matter in practice**: an O(n log n) sort in native code can beat a hand-written O(n) loop for moderate n.
- **Memory, I/O and network** often dominate real programs; time complexity says nothing about them.
- **Worst case is not the whole story** for randomised algorithms; say "expected O(n log n)" for quicksort with a random pivot.

---

## Interview tips

- State complexity as "O(n) time, O(1) space, because ...". The *because* is what gets graded.
- Say "worst case" and "amortized" when they apply. Precision signals experience.
- When you spot an `includes` inside a loop in your own code, call it out before the interviewer does, and fix it with a Set.
- Ask for the input size early. Then say out loud which complexity you are aiming for:
  "n is 10^5, so I need O(n log n) or better."
- If asked "can you do better?", first ask yourself what the theoretical lower bound is.
  You cannot beat O(n) if you must look at every element at least once.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| - | One runnable example per complexity class, step counters, timing demo | - | analysis | 02_Implementations/complexity_examples.js |

---

## Practice more

Analyze the complexity of your solutions to these (do not just solve them, state Big-O and why):

Easy: Two Sum (1), Contains Duplicate (217), Binary Search (704), Fibonacci Number (509),
Climbing Stairs (70), Majority Element (169), Intersection of Two Arrays (349)

Medium: Longest Substring Without Repeating Characters (3), Kth Largest Element in an Array (215),
Subsets (78), Permutations (46), Merge Intervals (56), Top K Frequent Elements (347),
Find Peak Element (162), Search in Rotated Sorted Array (33)
