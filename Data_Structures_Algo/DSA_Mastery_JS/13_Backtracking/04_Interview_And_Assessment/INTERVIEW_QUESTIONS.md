# Recursion & Backtracking — Interview Questions

Answer each question out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What are the two parts every recursive function needs, and what happens if one is missing?

<details><summary>Model answer</summary>

A **base case** (a tiny input answered directly) and a **recursive case** (a call on a strictly smaller input). Without a reachable base case the calls never stop and JavaScript throws `RangeError: Maximum call stack size exceeded`. Without progress toward the base case (for example calling `f(n)` from `f(n)`), you get the same crash.

</details>

### 2. What is backtracking, in one sentence, and how is it different from plain recursion?

<details><summary>Model answer</summary>

Backtracking is recursion that builds a candidate step by step: **choose** an option, **explore** deeper, then **un-choose** it so the next option starts from a clean state. Plain recursion just splits a problem into subproblems; backtracking walks a decision tree and undoes its choices on the way back up.

</details>

### 3. Why do we push a *copy* of `path` into the results instead of `path` itself?

<details><summary>Model answer</summary>

All recursive frames share one `path` array and keep mutating it with push/pop. If you store the reference, every stored result points at the same array, which is empty when the search ends. `results.push([...path])` takes a snapshot at that moment.

</details>

### 4. Compare the decision trees of subsets, combinations and permutations.

<details><summary>Model answer</summary>

- **Subsets**: loop from a `start` index, record **every** node. 2^n nodes.
- **Combinations of size k**: same `start`-index loop, record only when `path.length === k`; prune when not enough elements remain. C(n, k) leaves.
- **Permutations**: loop over **all** indices, skip those marked in `used[]`, record at depth n. n! leaves.

The `start` index is what stops `[1,2]` and `[2,1]` both appearing; permutations want both, so they use `used[]` instead.

</details>

### 5. How do you avoid duplicate results when the input contains duplicates?

<details><summary>Model answer</summary>

Sort the input so equal values sit next to each other. Then, at one level of the tree, skip a value equal to the previous one:
- subsets / combinations: `if (i > start && nums[i] === nums[i-1]) continue;`
- permutations: `if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;`

This prunes duplicate branches instead of generating them and deduping with a Set (which wastes exponential work).

</details>

### 6. What is the time complexity of generating all subsets? All permutations?

<details><summary>Model answer</summary>

Subsets: 2^n subsets, and copying each costs up to O(n), so O(n · 2^n) time and O(n) extra space for recursion (output not counted). Permutations: n! results each copied in O(n), so O(n · n!). The output size itself is that large, so no algorithm can do asymptotically better.

</details>

### 7. What is pruning, and give two concrete examples.

<details><summary>Model answer</summary>

Pruning means stopping a branch as soon as you know it cannot lead to a valid answer. Examples: in Combination Sum with sorted candidates, `break` once `candidate > remaining`; in N-Queens, skip a column if the column or either diagonal is already attacked (tracked in Sets for O(1) checks). Pruning does not change worst-case big-O in general but often cuts real running time by orders of magnitude.

</details>

### 8. When does recursion depth become a problem in JavaScript, and what do you do?

<details><summary>Model answer</summary>

Node's default stack holds roughly 10k frames (depends on frame size). Recursing once per element of a 100k-element array or a 100k-long linked list will crash. Backtracking depth is usually small (n ≤ 20), so it is rarely an issue there. Fixes: convert to an explicit stack (iteration), process in chunks, or recurse on halves (depth log n). JavaScript engines do not reliably perform tail-call optimization, so writing it tail-recursively does not help.

</details>

### 9. How would you explain memoization, and when does backtracking become dynamic programming?

<details><summary>Model answer</summary>

Memoization caches the answer for each distinct argument so repeated subproblems are solved once. Backtracking explores *paths*, and if the answer only depends on a small state (like "index i and remaining sum"), many paths reach the same state, so you can cache by state: that is top-down DP. If you need the actual list of every path (and the number of paths is exponential), caching cannot shrink the output.

</details>

### 10. "Find one solution" vs "find all solutions": how does the code change?

<details><summary>Model answer</summary>

To find one, make the helper return a boolean: return `true` as soon as a complete valid state is found, and propagate it up (`if (go(...)) return true;`) without undoing the winning choices (Sudoku keeps the filled board). To collect all, the helper returns nothing, records copies at the leaves and always undoes its choices.

</details>

### 11. In Word Search on a grid, why mark a cell as visited and then unmark it?

<details><summary>Model answer</summary>

The path may not reuse a cell, so while a cell is part of the current path it must be blocked (for example temporarily set to `'#'`). When that branch returns, the cell must be restored, because a different path may legally use it. Forgetting to restore gives wrong `false` answers; forgetting to mark lets the path reuse letters.

</details>

### 12. How do you choose which variable to branch on in a constraint problem like Sudoku?

<details><summary>Model answer</summary>

Pick the most constrained cell first (fewest legal digits), the "minimum remaining values" heuristic. It makes the tree narrow near the root, so wrong guesses are detected early. Maintaining row/column/box bitmasks or Sets makes each legality check O(1).

</details>

### 13. What should you clarify before coding a backtracking problem?

<details><summary>Model answer</summary>

Input size (n ≤ 20 means exponential is fine), whether duplicates exist in the input, whether order matters (combination vs permutation), whether an element can be reused, whether you need all answers, any answer, or just a count, and the required output order.

</details>
