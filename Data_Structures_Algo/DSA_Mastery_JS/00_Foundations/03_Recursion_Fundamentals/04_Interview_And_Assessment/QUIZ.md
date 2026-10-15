# Recursion Fundamentals — Self-Assessment Quiz

Answer each question before opening the answer. Back to the [topic README](../README.md).

**Q1. Predict the output.**
```js
function f(n) { if (n === 0) return 0; return n + f(n - 1); } console.log(f(4));
```
<details><summary>Answer</summary>10 (4 + 3 + 2 + 1 + 0).</details>

**Q2. Spot the bug.**
```js
function countDown(n) { if (n === 0) return; console.log(n); countDown(n - 2); }
```
<details><summary>Answer</summary>Odd `n` skips 0 and recurses forever (until RangeError). Use `n <= 0` as the base case.</details>

**Q3. Spot the bug.**
```js
function sum(arr, i) { if (i === arr.length) return 0; arr[i] + sum(arr, i + 1); }
```
<details><summary>Answer</summary>Missing `return` on the recursive line: the function returns `undefined`.</details>

**Q4. Complexity: time and stack space of naive `fib(n)`?**
<details><summary>Answer</summary>O(φ^n) ≈ O(1.6^n) time, O(n) stack space (tree height).</details>

**Q5. How many calls does `fib(5)` (naive, with base cases n < 2) make?**
<details><summary>Answer</summary>15. In general calls(n) = 2·fib(n+1) − 1 = 2·8 − 1.</details>

**Q6. Multiple choice: in Node, `function g(n, acc) { return n === 0 ? acc : g(n - 1, acc + 1); } g(1e6, 0)`** (a) returns 1e6 (b) throws RangeError (c) depends on strict mode
<details><summary>Answer</summary>(b). V8 has no tail call optimization, in strict mode or not.</details>

**Q7. Complexity: `function len(s) { return s === '' ? 0 : 1 + len(s.slice(1)); }`**
<details><summary>Answer</summary>O(n²) time (each slice copies), O(n) stack depth.</details>

**Q8. Predict the output order.**
```js
function p(n) { if (n === 0) return; p(n - 1); console.log(n); } p(3);
```
<details><summary>Answer</summary>1, 2, 3. The print happens after the call returns (head recursion), so the deepest call prints first.</details>

**Q9. What is the maximum stack depth of `fastPow(x, 1024)` (halving)?**
<details><summary>Answer</summary>About 11–12 frames (log2(1024) = 10, plus the base case and the top call).</details>

**Q10. Which conversion is enough for summing all values in a tree: "push children" or "frames with stage"?**
<details><summary>Answer</summary>"Push children": addition does not depend on order and no work happens between child calls. Postorder output or Tower of Hanoi needs frames with a stage.</details>

**Q11. Spot the bug in this trampoline use.**
```js
const sum = trampoline(function go(n, acc) { return n === 0 ? acc : go(n - 1, acc + n); });
```
<details><summary>Answer</summary>It calls `go` directly instead of returning a thunk `() => go(n - 1, acc + n)`, so the stack still grows.</details>

**Q12. Spot the bug.**
```js
const res = []; const path = [];
function gen(n) { if (path.length === n) { res.push(path); return; } for (const c of 'ab') { path.push(c); gen(n); path.pop(); } }
```
<details><summary>Answer</summary>`res.push(path)` stores the shared array; at the end all entries are the same empty array. Use `res.push([...path])` or `path.join('')`.</details>

**Q13. Grid paths on an open 3 × 3 grid (right/down only). How many paths, and how many distinct subproblems does memo store at most?**
<details><summary>Answer</summary>C(4, 2) = 6 paths; at most 9 subproblems (one per cell).</details>

## Mastery checklist

- [ ] I can draw the call stack and the recursion tree for a small input and read time (nodes) and space (height) from them.
- [ ] I measured Node's maximum recursion depth and know when to switch to iteration.
- [ ] I can explain why tail calls do not save stack in Node and write a trampoline.
- [ ] I can convert a recursion with work between calls into an explicit stack of frames.
- [ ] I solved problems 01–08 and can re-solve 05 and 08 from scratch.
