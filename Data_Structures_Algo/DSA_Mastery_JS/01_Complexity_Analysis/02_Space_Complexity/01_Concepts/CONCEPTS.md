# Space Complexity

**Space complexity** describes how much **extra memory** your code needs as the input grows.
Think of it like cooking: time complexity is how long the recipe takes, space complexity is
how many bowls and counters you need. A recipe that uses one bowl (in place) is different
from one that dirties a new bowl for every ingredient (a copy per element).

---

## Prerequisites

- [Time Complexity](../../01_Time_Complexity/README.md): the same Big-O language, now for memory.
- [JavaScript For DSA](../../../00_Foundations/01_JavaScript_For_DSA/README.md): which built-ins copy (`slice`, spread, `concat`, `map`, `filter`).

---

## Why it matters / when to use

- Every interview question ends with "time and space?". You need both.
- "Can you do it in O(1) space?" or "in place?" is one of the most common follow-ups.
- Recursion uses memory you do not see (the call stack). Deep recursion crashes Node.
- Many JS built-ins silently copy the whole array (`slice`, `spread`, `concat`, `map`, `filter`).
  A loop that calls them is both slower and heavier than it looks.
- Choosing between O(n) time + O(n) space and O(n log n) time + O(1) space is a real
  trade-off you will be asked to discuss.

---

## How it works

### Auxiliary vs total space

- **Total space** = input + everything extra.
- **Auxiliary space** = only the extra memory your algorithm allocates (not counting the input).

When an interviewer says "space complexity", they almost always mean **auxiliary** space.
Say "O(1) extra space" to be explicit.

```js
function sum(arr) {           // input: O(n), but it was given to us
  let total = 0;              // one number: O(1) auxiliary
  for (const x of arr) total += x;
  return total;
}                             // auxiliary O(1), total O(n)

function doubled(arr) {
  return arr.map((x) => x * 2); // new array of size n: O(n) auxiliary
}
```

### What counts as space

| Allocation | Space |
|---|---|
| a few variables / counters / pointers | O(1) |
| an array or string of length n | O(n) |
| a Map / Set with up to n entries | O(n) |
| a 2D grid of n x m | O(n * m) |
| recursion depth d (each frame holds its locals) | O(d) |
| result you are REQUIRED to return | usually not counted (say so) |

### Recursion stack space

Each recursive call that has not returned yet sits on the **call stack** with its own local
variables. The maximum depth of the recursion is memory you are using.

```
sumTo(4)
  sumTo(3)
    sumTo(2)
      sumTo(1)
        sumTo(0)   <- 5 frames alive at once -> O(n) space, even with zero arrays
```

| Recursion shape | Depth | Space |
|---|---|---|
| `f(n - 1)` (linear) | n | O(n) |
| `f(n / 2)` (binary search, fast power) | log n | O(log n) |
| DFS on a tree | height h | O(h): O(log n) balanced, O(n) skewed |
| `f(n-1) + f(n-2)` (naive fib) | n | O(n) (not 2^n: the two calls are not alive at the same time) |
| merge sort | log n frames + O(n) merge buffer | O(n) |

Node's default stack handles roughly **10,000 nested calls** before `RangeError: Maximum call
stack size exceeded`. For deep inputs (a 10^5-node linked list), convert recursion to a loop
or an explicit stack. See `00_Foundations/01_JavaScript_For_DSA`.

### In place vs not in place

**In place** = modify the input directly, using O(1) extra memory.

```js
// NOT in place: builds a new array            O(n) space
function reversed(arr) { return [...arr].reverse(); }

// in place: swap from both ends               O(1) space
function reverseInPlace(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++; right--;
  }
  return arr;
}
```

In place is great for memory but it **destroys the input**. Always ask: "Am I allowed to modify
the input?" If the caller still needs the original, in place is a bug, not an optimization.

### Common traps: things that copy

| Expression | What it does | Space |
|---|---|---|
| `arr.slice(i, j)` | copies the range | O(j - i) |
| `[...arr]`, `Array.from(arr)` | copies all | O(n) |
| `arr.concat(b)`, `[...a, ...b]` | new array with both | O(n + m) |
| `arr.map / filter` | new array | O(n) |
| `str.slice`, `str + x`, `str.split('')` | strings are immutable: every change is a new string | O(n) |
| `arr.sort()` | in place, BUT the engine uses O(log n) to O(n) internally | O(log n) typical |
| `JSON.parse(JSON.stringify(x))` | deep copy | O(size) |
| `Object.keys(obj)` | new array of keys | O(k) |

The classic hidden-cost mistake: recursion that passes `arr.slice(1)` at every level.
That is O(n) copy per call, n levels deep -> O(n^2) time AND O(n^2) total allocations.
Pass an **index** instead and keep the same array.

```js
// bad: copies the array on every call
function sumSlow(arr) { return arr.length ? arr[0] + sumSlow(arr.slice(1)) : 0; }

// good: same array, moving index. O(n) time, O(n) stack only
function sumFast(arr, i = 0) { return i === arr.length ? 0 : arr[i] + sumFast(arr, i + 1); }
```

Strings: `s += ch` in a loop creates a new string every time in theory (O(n^2)). V8 uses an
internal "rope" trick that makes it usually fine, but in an interview the safe answer is
"collect pieces in an array, then `join('')`".

---

## Pseudocode

```
analyseSpace(code):
    ignore the input itself (unless asked for total space)
    add every new structure that grows with n: arrays, maps, sets, strings, copies
    add the deepest recursion depth * (memory per frame)
    count the output only if the question says so (state your assumption)
    take the maximum alive at the same time, not the sum over the whole run
```

---

## Dry run on a concrete example

Stack frames for `sum(n) = n === 0 ? 0 : n + sum(n - 1)` with `n = 3`:

| moment | call stack (top on the right) | frames alive |
|---|---|---|
| call sum(3) | sum(3) | 1 |
| call sum(2) | sum(3), sum(2) | 2 |
| call sum(1) | sum(3), sum(2), sum(1) | 3 |
| call sum(0) | sum(3), sum(2), sum(1), sum(0) | 4 (peak) |
| sum(0) returns 0 | sum(3), sum(2), sum(1) | 3 |
| ... unwinding | ... | ... |
| sum(3) returns 6 | (empty) | 0 |

Peak depth is n + 1, so the space is **O(n)** even though no array was created. A loop with one accumulator would be O(1).

---

## Operations & complexity

Memory cost of the usual tools (auxiliary space for one call):

| Operation | Space | Note |
|---|---|---|
| swap two elements | O(1) | |
| two pointers / sliding window counters | O(1) | |
| frequency array of 26 letters | O(1) | fixed size regardless of n |
| frequency Map of n items | O(n) | O(k) for k distinct keys |
| prefix sum array | O(n) | |
| visited Set / Map for n nodes | O(n) | |
| DP table n x m | O(n * m) | often reducible to O(m) by keeping only the last row |
| BFS queue | O(w) | w = max width of a level |
| DFS recursion | O(h) | h = max depth |
| sort (built-in) | O(log n) to O(n) | depends on engine; say "O(n) worst for merge-based sorts" |

---

## JavaScript implementation

`02_Implementations/space_examples.js` has runnable demonstrations: in-place vs copy reversal, recursion depth
(linear vs logarithmic), the `slice` inside recursion trap, string building, and a function
that shows roughly where Node's call stack limit is.

```js
// count allocations instead of guessing
function reverseInPlace(arr) { /* O(1) extra */ }
function reversedCopy(arr)   { return [...arr].reverse(); /* O(n) extra */ }
```

---

## Patterns / variations

### 1. Trade space for time (the most common move)

```js
// O(n^2) time, O(1) space
function twoSumSlow(nums, t) { /* nested loops */ }
// O(n) time, O(n) space
function twoSumFast(nums, t) { const seen = new Map(); /* ... */ }
```
Use when: you have a lookup inside a loop. Memory is usually cheaper than time.

### 2. Trade time for space (when asked for O(1) space)

Sort first (O(n log n), in place), then use two pointers (O(1)). Example: 3Sum, Contains
Duplicate without a Set, Intersection of Two Arrays.

### 3. Reuse the input as storage (index as hash)

```js
// mark "seen" by negating the value at index (value - 1). O(1) extra space.
for (const value of nums) {
  const index = Math.abs(value) - 1;
  if (nums[index] > 0) nums[index] = -nums[index];
}
```
Use when: values are in range 1..n and you may modify the input. See `03_Arrays`.

### 4. Roll the DP table (keep only the previous row)

```js
// 2D: O(n * m)        ->       1D: O(m)
let prev = new Array(m + 1).fill(0);
for (let i = 1; i <= n; i++) {
  const curr = new Array(m + 1).fill(0);
  // fill curr using prev
  prev = curr;
}
```
Use when: each DP cell only depends on the previous row. See `29_Dynamic_Programming`.

### 5. Replace recursion with iteration

Reverse a linked list iteratively (O(1)) instead of recursively (O(n) stack). Tree traversals
with an explicit stack (same O(h) space but no crash risk, and you control it).

### 6. Streaming / running values

Kadane's algorithm, running min/max, Boyer-Moore majority vote: keep O(1) running state
instead of storing all candidates.

---

## Alternatives and trade-offs

| Goal | Uses more memory | Uses less memory | Cost of saving memory |
|---|---|---|---|
| Fast lookups | hash set O(n) | sort + binary search O(1) extra | O(n log n) time, input order lost |
| DP | full table O(n·m) | rolling rows O(m) | cannot reconstruct the path easily |
| Recursion | call stack O(depth) | iteration with variables | code can be harder to read |
| Build strings | many `+=` copies | array of parts + `join` | none, just a habit |
| Index-as-hash | extra boolean array O(n) | mark inside the input O(1) | mutates the input |

---

## Common mistakes & edge cases

- Saying "O(1) space" for a recursive function. The stack counts.
- Forgetting that `slice`, spread, `concat`, `map`, `filter` allocate a full copy.
- Calling `arr.sort()` O(1) space. It is in place, but say "O(log n) to O(n) internally".
- Counting the output array as extra space when the problem requires returning it. State your
  assumption: "excluding the output array".
- Modifying the input in place when the problem (or the caller) needs it intact.
- A 26-element frequency array is O(1), not O(n). Fixed size does not grow with input.
- A Map with n keys is O(n) even if each value is small.
- Naive fibonacci is O(2^n) **time** but only O(n) **space**. Time counts all calls; space counts
  the deepest chain alive at once.

---

## When this does NOT apply

- **The interviewer cares about time, not memory**: an O(n) hash map is usually the expected answer; do not trade away speed for O(1) space unless asked.
- **"O(1) space" with output**: the output array itself is normally not counted, but say so explicitly.
- **Garbage collection** means short-lived copies are freed, but they still count toward the peak.
- **Fixed-size helpers** (26 letters, 10 digits) are O(1), not O(n); do not over-count them.

---

## Interview tips

- Always give both: "O(n) time and O(n) extra space for the map".
- Say "auxiliary" or "extra" explicitly. Then say whether you count the output.
- When you use recursion, say "plus O(h) for the call stack" without being asked.
- If you choose a copy (`slice`) for readability, say "I'm copying here for clarity; in
  production I'd pass indices to avoid the O(n) copy."
- "Can you do it in O(1) space?" is a hint toward: two pointers, in-place marking, sorting
  first, or a math trick (XOR, sum formula).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| - | In-place vs copy, recursion depth, slice trap, string building, stack limit demo | - | analysis | 02_Implementations/space_examples.js |

---

## Practice more

Solve these and state the auxiliary space of each approach:

Easy: Reverse String (344), Move Zeroes (283), Missing Number (268), Single Number (136),
Reverse Linked List (206), Majority Element (169), Climbing Stairs (70, O(1) space version)

Medium: Rotate Array (189, O(1) space), Product of Array Except Self (238, O(1) extra),
Find All Numbers Disappeared in an Array (448), Sort Colors (75), Set Matrix Zeroes (73),
Find the Duplicate Number (287), Unique Paths (62, rolling row), House Robber (198)
