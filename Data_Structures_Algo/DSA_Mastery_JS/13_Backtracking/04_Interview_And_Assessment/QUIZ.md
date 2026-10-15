# Recursion & Backtracking — Quiz

Try every question before opening the answer. Score yourself, then re-read the matching part of [CONCEPTS.md](../01_Concepts/CONCEPTS.md). See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Multiple choice)** How many results does `subsets([1, 2, 3, 4])` return?
A) 8  B) 15  C) 16  D) 24

<details><summary>Answer</summary>C) 2^4 = 16, including the empty subset.</details>

**2. (Predict the output)**

```js
const results = [];
const path = [];
function go(i) {
  if (i === 2) { results.push(path); return; }
  path.push(i); go(i + 1); path.pop();
}
go(0);
console.log(results);
```

<details><summary>Answer</summary>

`[ [] ]`. The single stored reference is `path` itself, which is empty after all the pops. Fix: `results.push([...path])`.

</details>

**3. (Complexity)** What is the time complexity of generating all permutations of n distinct numbers, including copying each into the result?

<details><summary>Answer</summary>O(n · n!). There are n! leaves and each copy costs O(n).</details>

**4. (Spot the bug)** This is meant to return combinations of size k from 1..n:

```js
function combine(n, k) {
  const res = [], path = [];
  function go(start) {
    if (path.length === k) { res.push([...path]); return; }
    for (let i = 1; i <= n; i++) { path.push(i); go(i + 1); path.pop(); }
  }
  go(1);
  return res;
}
```

<details><summary>Answer</summary>

The loop starts at `1` instead of `start`, so it produces `[2,1]` as well as `[1,2]` and even `[1,1]`. Use `for (let i = start; ...)`.

</details>

**5. (Multiple choice)** Input `[1, 1, 2]`, you want unique permutations. Which skip rule is correct after sorting?
A) `if (used[i]) continue;` only
B) `if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;`
C) `if (i > start && nums[i] === nums[i-1]) continue;`
D) Put every result in a Set and nothing else

<details><summary>Answer</summary>B (plus the usual `used[i]` check). C is the rule for subsets/combinations. D works but wastes time generating duplicates.</details>

**6. (Predict the output)**

```js
function f(n) { if (n === 0) return 0; return n + f(n - 2); }
console.log(f(4));
console.log(f(3));
```

<details><summary>Answer</summary>`6`, then a `RangeError` (stack overflow): `f(3) -> f(1) -> f(-1) -> ...` never hits `n === 0`. The base case should be `n <= 0`.</details>

**7. (Complexity)** Recursive `fib(n)` without memo makes roughly how many calls? With a memo Map?

<details><summary>Answer</summary>Without memo: exponential, about O(1.618^n) (often written O(2^n)). With memo: O(n) calls, each O(1) work.</details>

**8. (Multiple choice)** Which signal most strongly suggests backtracking?
A) n up to 10^5, find the max sum
B) "Return all valid arrangements", n ≤ 12
C) Sorted array, find a target
D) Count paths in a grid moving only right/down, grid 100 x 100

<details><summary>Answer</summary>B. D sounds like "paths" but asks for a count on a large grid, which is DP.</details>

**9. (Spot the bug)** Word Search helper:

```js
function dfs(r, c, k) {
  if (k === word.length) return true;
  if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== word[k]) return false;
  board[r][c] = '#';
  return dfs(r+1,c,k+1) || dfs(r-1,c,k+1) || dfs(r,c+1,k+1) || dfs(r,c-1,k+1);
}
```

<details><summary>Answer</summary>The cell is never restored. Store the result, set `board[r][c] = word[k]` back, then return the result. Otherwise later starting points see `'#'` and fail.</details>

**10. (Predict the output)** How many lines does this print?

```js
function go(path) {
  if (path.length === 3) { console.log(path.join('')); return; }
  for (const ch of 'ab') go(path + ch);
}
go('');
```

<details><summary>Answer</summary>8 lines (`aaa` to `bbb`). Each of 3 positions has 2 choices. Strings are immutable, so no undo step is needed here.</details>

**11. (Complexity)** N-Queens with Sets for columns and both diagonals: what does each placement check cost, and roughly what is the worst-case bound?

<details><summary>Answer</summary>Each check is O(1). The search is bounded by O(n!) because each row tries fewer columns than the row above; real counts are much smaller thanks to diagonal pruning.</details>

**12. (Multiple choice)** In Combination Sum (reuse allowed), what do you pass to the recursive call after choosing `candidates[i]`?
A) `i + 1`  B) `i`  C) `0`  D) `start + 1`

<details><summary>Answer</summary>B) `i`. Staying on `i` allows reusing the same candidate; `i + 1` forbids reuse (Combination Sum II); `0` creates duplicate orderings.</details>

---

## Mastery checklist

- [ ] I can write the choose / explore / un-choose template from memory and explain why the copy `[...path]` is needed.
- [ ] I can write subsets, combinations and permutations without notes, and explain how their trees differ.
- [ ] I can deduplicate results for inputs with repeated values using sort + skip, for both subsets and permutations.
- [ ] I can state the time complexity of each generator (2^n, C(n,k), n!) and say where pruning helps.
- [ ] I solved N-Queens or Sudoku and Word Search without hints, including restoring state correctly.
