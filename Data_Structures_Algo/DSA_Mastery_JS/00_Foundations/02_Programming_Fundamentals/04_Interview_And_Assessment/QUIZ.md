# Programming Fundamentals — Self-Assessment Quiz

Answer each question before opening the answer. Back to the [topic README](../README.md).

**Q1. Predict the output.**
```js
const a = [1, 2]; const b = a; b.push(3); console.log(a.length);
```
<details><summary>Answer</summary>3. `b` is an alias for the same array.</details>

**Q2. Predict the output.**
```js
const g = [[0], [0]]; const c = [...g]; c[0][0] = 5; console.log(g[0][0]);
```
<details><summary>Answer</summary>5. Spread copies the outer array only; rows are shared.</details>

**Q3. Multiple choice: which keeps a `Date` as a `Date`?** (a) `JSON.parse(JSON.stringify(x))` (b) `{ ...x }` on the parent then reading `.d` (c) `structuredClone(x)`
<details><summary>Answer</summary>(c). (b) keeps the same Date object (shared, not copied); (a) turns it into a string.</details>

**Q4. Predict: `[NaN].indexOf(NaN)` and `[NaN].includes(NaN)`.**
<details><summary>Answer</summary>`-1` and `true`. `indexOf` uses `===`, `includes` uses SameValueZero.</details>

**Q5. Predict: `Object.is(0, -0)`, `0 === -0`, `new Set([0, -0]).size`.**
<details><summary>Answer</summary>`false`, `true`, `1`.</details>

**Q6. Spot the bug.**
```js
function lastPairSum(arr) { let best = -Infinity; for (let i = 0; i < arr.length; i++) best = Math.max(best, arr[i] + arr[i + 1]); return best; }
```
<details><summary>Answer</summary>On the last iteration `arr[i + 1]` is `undefined`, the sum is `NaN`, and `Math.max(..., NaN)` is `NaN`. The loop must be `i < arr.length - 1`.</details>

**Q7. How many windows of size k = 3 are in an array of length n = 7? Write the loop header.**
<details><summary>Answer</summary>`n - k + 1 = 5`. `for (let s = 0; s + k <= n; s++)`.</details>

**Q8. Complexity: what is the time and space of `grid.map(r => [...r])` for an R × C grid?**
<details><summary>Answer</summary>O(R·C) time and O(R·C) space.</details>

**Q9. Spot the bug.**
```js
function rotate(arr, k) { arr = arr.slice(-k).concat(arr.slice(0, -k)); }
```
<details><summary>Answer</summary>It rebinds the local parameter; the caller's array is unchanged. Also `k` is not reduced mod n, and for k = 0 `slice(-0)` returns the whole array, duplicating it.</details>

**Q10. Predict the output.**
```js
const rows = new Array(2).fill([]); rows[1].push('x'); console.log(rows);
```
<details><summary>Answer</summary>`[ [ 'x' ], [ 'x' ] ]`: both slots are the same array.</details>

**Q11. Multiple choice: which loop should you avoid on arrays?** (a) `for...of` (b) `for...in` (c) classic `for`
<details><summary>Answer</summary>(b). It yields string keys and inherited enumerable properties.</details>

**Q12. Predict: what does this print?**
```js
function* g() { yield 1; yield 2; } const it = g(); console.log([...it].length, [...it].length);
```
<details><summary>Answer</summary>`2 0`. A generator object is exhausted after one pass.</details>

**Q13. Count multiples of 4 in [10, 30] using the formula.**
<details><summary>Answer</summary>`floor(30/4) - floor(9/4) = 7 - 2 = 5` (12, 16, 20, 24, 28).</details>

**Q14. Spot the bug in this memo.**
```js
const memo = {}; function f(n) { if (memo[n]) return memo[n]; ... }
```
<details><summary>Answer</summary>A cached value of `0` is falsy, so it is recomputed every time. Use `n in memo` or a `Map` with `has`. Also the module-level memo is shared across unrelated calls.</details>

## Mastery checklist

- [ ] I can draw the arrows for aliasing, shallow copy and deep copy of a nested array.
- [ ] I can list five things the JSON clone trick loses, and write a cycle-safe `deepClone` from memory.
- [ ] I can explain `===`, `Object.is` and SameValueZero with `NaN` and `-0` examples.
- [ ] I write loop bounds as half-open ranges and test every loop with n = 0, 1, 2.
- [ ] I can write a memoized recursive function with a closure and an iterable class without notes.
