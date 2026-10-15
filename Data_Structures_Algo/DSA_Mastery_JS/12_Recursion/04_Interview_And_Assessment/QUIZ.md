# Recursion — Self-Assessment Quiz

Answer on paper first, then open each answer. Score 12+/14 before moving on to
[Backtracking](../../13_Backtracking/README.md).

### Q1 (multiple choice) — Which call stack depth does `sumList(arr)` (first + rest) reach for an array of length n?
A) O(1)  B) O(log n)  C) O(n)  D) O(n^2)
<details><summary>Answer</summary>C. One frame per element until the base case.</details>

### Q2 (complexity) — What is the time complexity?
```js
function f(n) { if (n <= 1) return 1; return f(n - 1) + f(n - 1); }
```
<details><summary>Answer</summary>O(2^n). Two calls on n − 1 → the tree doubles each level. (It equals 2^(n−1); computing `f(n-1)` once and doubling would be O(n).)</details>

### Q3 (predict the output)
```js
function p(n) { if (n === 0) return; p(n - 1); console.log(n); }
p(3);
```
<details><summary>Answer</summary>`1 2 3` (each on its own line). The print happens AFTER the recursive call returns (head recursion), so the deepest call prints first.</details>

### Q4 (spot the bug)
```js
function isPowerOfThree(n) {
  if (n === 1) return true;
  if (n % 3 !== 0) return false;
  return isPowerOfThree(n / 3);
}
```
<details><summary>Answer</summary>`isPowerOfThree(0)` recurses forever: 0 % 3 === 0 and 0 / 3 === 0. Add `if (n <= 0) return false;` first.</details>

### Q5 (complexity) — Recursive binary search on a sorted array of n elements: time and space?
<details><summary>Answer</summary>O(log n) time and O(log n) stack space (iterative is O(1) space).</details>

### Q6 (multiple choice) — Memoizing `diff(i, j)` in Predict the Winner changes time from ... to ...
A) O(n) → O(1)  B) O(2^n) → O(n^2)  C) O(n^2) → O(n)  D) O(2^n) → O(n log n)
<details><summary>Answer</summary>B. There are n^2 intervals (i, j), each computed once with O(1) work.</details>

### Q7 (spot the bug)
```js
function reverse(head) {
  if (!head || !head.next) return head;
  const newHead = reverse(head.next);
  head.next.next = head;
  return newHead;
}
```
<details><summary>Answer</summary>Missing `head.next = null`. The original first node still points to the second, which now points back: a 2-cycle at the tail.</details>

### Q8 (predict the output) — How many trees does `allTreeShapes(4)` return?
<details><summary>Answer</summary>14, the 4th Catalan number (1, 1, 2, 5, 14).</details>

### Q9 (multiple choice) — Which is the best reason to pass an index instead of `arr.slice(1)`?
A) slice is not allowed in recursion  B) slice copies → O(n^2) total  C) indexes are faster to read  D) slice mutates the array
<details><summary>Answer</summary>B.</details>

### Q10 (concept) — In K-th Symbol in Grammar, which position in row n − 1 is the parent of position k (1-indexed) in row n?
<details><summary>Answer</summary>ceil(k / 2). Odd k is the left child (same symbol), even k is the right child (flipped).</details>

### Q11 (spot the bug) — memo key
```js
const memo = new Map();
function ways(a, b) { const key = `${a}${b}`; /* ... */ }
```
<details><summary>Answer</summary>Keys collide: (1, 23) and (12, 3) both give "123". Use a separator like `${a},${b}` or a nested array / numeric key a * BIG + b.</details>

### Q12 (multiple choice) — Which problem is mutual recursion the most natural fit for?
A) Sum of an array  B) Parsing nested arithmetic or Lisp expressions  C) Binary search  D) Reversing a string
<details><summary>Answer</summary>B. One function per grammar rule, calling each other.</details>

### Q13 (complexity) — `fastPow(b, e)` with one recursive call on `floor(e / 2)`: how many calls for e = 1,000,000?
<details><summary>Answer</summary>About log2(10^6) + 1 ≈ 21 calls.</details>

### Q14 (concept) — Your recursive DFS crashes on a 200,000-node path graph in Node. Name two fixes.
<details><summary>Answer</summary>Use an explicit stack (iterative DFS), or restructure (e.g. BFS / union-find) — or a trampoline for tail-recursive code. Raising `--stack-size` is a hack, not a fix.</details>

---

## Mastery checklist

- [ ] I can state the promise, base cases and recursive step for any problem in this topic before writing code.
- [ ] I can draw the recursion tree of a function and derive its time and space complexity, including the call stack.
- [ ] I can turn an exponential multiple recursion into a memoized one and explain why that is top-down DP.
- [ ] I can write recursive and iterative versions of linked-list reversal and tree inorder traversal from memory.
- [ ] I solved problems 01–14 without hints and re-solved 10, 11 and 14 a few days later.
