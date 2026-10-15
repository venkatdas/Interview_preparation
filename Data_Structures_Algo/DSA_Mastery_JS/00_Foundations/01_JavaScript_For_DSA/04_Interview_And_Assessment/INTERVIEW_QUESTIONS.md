# JavaScript For DSA — Interview Questions

Language questions that come up while coding DSA in JavaScript. Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. When do you use a `Map` instead of a plain object?

<details><summary>Model answer</summary>

For DSA almost always. `Map` accepts any key type without converting to strings (1 and '1' stay different), keeps insertion order, has `size`, `has`, `delete`, and has no inherited keys like `constructor`. Objects are fine for fixed, known string keys such as JSON data.

</details>

### 2. Why is `new Array(3).fill([])` a bug when you want a grid?

<details><summary>Model answer</summary>

`fill` puts the same reference into every slot, so all three rows are one array. Use `Array.from({ length: 3 }, () => [])` so a new array is created per row.

</details>

### 3. What does the default `sort` do with numbers?

<details><summary>Model answer</summary>

It converts elements to strings and compares UTF-16 code units, so `[10, 9, 1]` becomes `[1, 10, 9]`. Pass a comparator: `(a, b) => a - b`. `sort` also mutates the array in place; use `[...arr].sort(...)` or `toSorted` to keep the original.

</details>

### 4. How big can integers get in JavaScript before precision is lost?

<details><summary>Model answer</summary>

Numbers are 64-bit floats, so integers are exact up to `Number.MAX_SAFE_INTEGER` = 2^53 − 1 ≈ 9.007 × 10^15. Beyond that use `BigInt` (with the `n` suffix) or keep values reduced modulo something like 10^9 + 7. Products of two numbers around 10^9 already exceed the safe range.

</details>

### 5. Why does `-7 % 3` return −1, and how do you get a positive remainder?

<details><summary>Model answer</summary>

`%` is a remainder that keeps the sign of the dividend. For a mathematical modulo use `((x % m) + m) % m`. This matters for circular indices and for prefix-sum remainders.

</details>

### 6. What is the recursion depth limit in Node and how do you work around it?

<details><summary>Model answer</summary>

Roughly 10,000 frames (it depends on frame size); beyond that you get `RangeError: Maximum call stack size exceeded`. JavaScript engines do not do tail-call optimisation in practice. Convert deep recursion into a loop with an explicit stack, or use BFS with a queue.

</details>

### 7. How do closures help in DSA code?

<details><summary>Model answer</summary>

A closure keeps access to variables from its outer function. Typical uses: a recursive helper (`dfs`) that reads the grid and writes to a result array without passing them as arguments; memoization with a private cache `Map`; counters and generators.

</details>

### 8. What is the difference between `for...of`, `for...in` and `forEach`?

<details><summary>Model answer</summary>

`for...of` iterates values of any iterable (arrays, strings by code point, Maps, Sets) and supports `break`/`continue`. `for...in` iterates enumerable string keys, including inherited ones; do not use it on arrays. `forEach` cannot `break` and cannot `return` a result from the outer function, so a plain `for` loop is better for early exits.

</details>

### 9. Why should you avoid `Math.max(...arr)` on very large arrays?

<details><summary>Model answer</summary>

Spreading passes every element as a function argument; with hundreds of thousands of elements it can exceed the argument/stack limit and throw `RangeError`. Use a loop or `reduce`.

</details>

### 10. How do you copy arrays and objects, and what is a shallow copy?

<details><summary>Model answer</summary>

`[...arr]`, `arr.slice()` and `{ ...obj }` make shallow copies: the outer container is new but nested arrays/objects are shared. For a grid use `grid.map(row => [...row])`; for arbitrary deep data use `structuredClone`.

</details>

### 11. When are bitwise operators safe in JavaScript?

<details><summary>Model answer</summary>

Bitwise operators convert operands to 32-bit signed integers. They are safe for flags, masks and values below 2^31. `x | 0` and `x >> 1` silently corrupt larger numbers; use `Math.trunc` and `Math.floor(x / 2)` instead. `>>>` gives an unsigned 32-bit result.

</details>

### 12. How do you implement an efficient queue in JavaScript?

<details><summary>Model answer</summary>

`shift()` is O(n) because it moves every element. Keep an array plus a `head` index and read `arr[head++]` (optionally compacting occasionally), or write a circular buffer / linked-list deque. Each enqueue and dequeue is then O(1).

</details>
