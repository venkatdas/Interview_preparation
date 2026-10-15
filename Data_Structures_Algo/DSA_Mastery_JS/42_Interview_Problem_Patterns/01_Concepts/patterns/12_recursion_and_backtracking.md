# 12. Recursion & Backtracking

Backtracking builds answers **one choice at a time**. At each step you *choose* an option, *explore*
everything that follows from it (recursively), then *un-choose* it and try the next option. It is
a depth-first walk over a tree of decisions. It is the right tool when the problem asks for
**all** solutions (all subsets, all permutations, all valid boards) — the output itself is
exponential, so no algorithm can be polynomial.

The skill that separates good from great: **pruning** — stopping a branch as soon as you know it
cannot lead to a valid answer.

**Teaches in depth:** [Backtracking](../../../13_Backtracking/README.md), [Bit Manipulation (subset masks)](../../../14_Bit_Manipulation/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at backtracking |
|---|---|
| "return **all** subsets / combinations / permutations" | enumerate every leaf of the decision tree |
| "generate all valid parentheses / IP addresses / words" | build strings character by character with rules |
| "N-Queens", "Sudoku", "place items so that no two conflict" | constraint satisfaction, prune on conflict |
| "word search in a grid" | DFS with mark / unmark |
| "partition into palindromes / k equal subsets" | choose cut points |
| "combination sum", "target sum" (list them all) | choose numbers with a running remainder |

**Constraint hints**

- n <= 10 (permutations: 10! ≈ 3.6M) or n <= 20 (subsets: 2^20 ≈ 1M) -> exponential search is expected.
- If the question asks for the **count** or the **best** value and n is large, it is probably DP, not backtracking ([17](17_dynamic_programming_families.md)).

## 2. When it applies (preconditions)

- The answer is built from a sequence of choices.
- You can check partial solutions (to prune) or at least full ones.
- The output size or the constraints are small enough for exponential time.

## 3. When it does NOT apply

- **Counting with overlapping subproblems.** "How many ways to climb 50 stairs with steps 1 or 2?" Backtracking explores ~2^50 paths; the answer only depends on "how many stairs remain", so DP gives O(n).
- **Optimization with a greedy or DP structure.** "Minimum coins for 10^4" — enumerating combinations explodes; use DP.
- **Large n.** Subsets of 40 items is 2^40 ≈ 10^12. Use meet-in-the-middle or DP.
  *Counterexample:* Combination Sum IV asks for the **number** of ordered combinations to reach 32 with `[1, 2, 3]`. Listing them is over 10^8 sequences; DP over the target gives the count in 96 steps.

## 4. The template

```js
// Subsets: record every node of the decision tree
function subsets(nums) {
  const result = [];
  const path = [];
  function backtrack(start) {
    result.push([...path]);            // record a COPY of the current choice
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);              // choose
      backtrack(i + 1);                // explore
      path.pop();                      // un-choose
    }
  }
  backtrack(0);
  return result;
}

// Combination Sum: reuse allowed, prune when the candidate is too big
function combinationSum(candidates, target) {
  const c = candidates.slice().sort((a, b) => a - b);
  const res = [];
  const path = [];
  (function backtrack(start, remaining) {
    if (remaining === 0) { res.push(path.slice()); return; }
    for (let i = start; i < c.length; i++) {
      if (c[i] > remaining) break;                 // prune: sorted, so every later one is too big
      path.push(c[i]);
      backtrack(i, remaining - c[i]);              // i, not i + 1: reuse allowed
      path.pop();
    }
  })(0, target);
  return res;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`subsets`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`permutations`, `combinationSum`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `subsets([1, 2])`:

| call | path on entry | recorded | loop |
|---|---|---|---|
| backtrack(0) | [] | [] | choose 1 |
| backtrack(1) | [1] | [1] | choose 2 |
| backtrack(2) | [1, 2] | [1, 2] | no loop, return; pop 2, pop 1 |
| backtrack(0) cont. | [] | — | choose 2 |
| backtrack(2) | [2] | [2] | return |

Result `[[], [1], [1, 2], [2]]`.

## 5. Variations

- **Permutations:** a `used[]` array instead of `start`; record at depth n.
- **With duplicates (Subsets II, Permutations II):** sort, then skip `nums[i] === nums[i-1]` at the same depth (`i > start`).
- **Combinations of size k:** record only when `path.length === k`; prune when not enough items remain.
- **Combination Sum II (each once):** recurse with `i + 1` and skip duplicates.
- **Grid search (Word Search):** mark the cell visited, recurse 4 directions, unmark.
- **Constraint satisfaction (N-Queens, Sudoku):** sets for "used" constraints, see [22](22_state_space_search_and_pruning.md).

## 6. Common pitfalls

1. **Pushing `path` instead of a copy.** `result.push(path)` stores the same array that later becomes empty. Use `path.slice()` or `[...path]`.
2. Forgetting to **un-choose** (pop / unmark), so later branches see stale state.
3. Using `i` vs `i + 1` incorrectly: `i` allows reuse, `i + 1` does not.
4. Duplicate skipping with `i > 0` instead of `i > start` removes valid answers.
5. Recursion depth: JS stacks hold roughly 10k frames. Backtracking depth is usually small, but a recursive DFS over 10^5 nodes is not — use an explicit stack there.
6. Building strings with `+=` and slicing in every call: fine for small n, but pass indices when possible.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Subsets | Medium | record every node | [statement](../../../13_Backtracking/03_Problems/02_Medium/01_subsets.md) · [solution](../../../13_Backtracking/03_Problems/solutions/01_subsets.js) |
| 2 | Subsets II | Medium | sort + skip duplicates | [statement](../../../13_Backtracking/03_Problems/02_Medium/02_subsets_ii.md) · [solution](../../../13_Backtracking/03_Problems/solutions/02_subsets_ii.js) |
| 3 | Permutations | Medium | used[] array | [statement](../../../13_Backtracking/03_Problems/02_Medium/03_permutations.md) · [solution](../../../13_Backtracking/03_Problems/solutions/03_permutations.js) |
| 4 | Combination Sum | Medium | reuse + prune | [statement](../../../13_Backtracking/03_Problems/02_Medium/06_combination_sum.md) · [solution](../../../13_Backtracking/03_Problems/solutions/06_combination_sum.js) |
| 5 | Letter Combinations of a Phone Number | Medium | one choice per digit | [statement](../../../13_Backtracking/03_Problems/02_Medium/08_letter_combinations_phone.md) · [solution](../../../13_Backtracking/03_Problems/solutions/08_letter_combinations_phone.js) |
| 6 | Generate Parentheses | Medium | rules prune (open <= n, close <= open) | [statement](../../../13_Backtracking/03_Problems/02_Medium/09_generate_parentheses.md) · [solution](../../../13_Backtracking/03_Problems/solutions/09_generate_parentheses.js) |
| 7 | Palindrome Partitioning | Medium | choose cut points | [statement](../../../13_Backtracking/03_Problems/02_Medium/10_palindrome_partitioning.md) · [solution](../../../13_Backtracking/03_Problems/solutions/10_palindrome_partitioning.js) |
| 8 | Word Search | Medium | grid DFS with unmark | [statement](../../../13_Backtracking/03_Problems/02_Medium/11_word_search.md) · [solution](../../../13_Backtracking/03_Problems/solutions/11_word_search.js) |
| 9 | N-Queens | Hard | constraint sets | [statement](../../../13_Backtracking/03_Problems/03_Hard/12_n_queens.md) · [solution](../../../13_Backtracking/03_Problems/solutions/12_n_queens.js) |
| 10 | Sudoku Solver | Hard | constraint satisfaction | [statement](../../../13_Backtracking/03_Problems/03_Hard/13_sudoku_solver.md) · [solution](../../../13_Backtracking/03_Problems/solutions/13_sudoku_solver.js) |

## 8. Self-check

**Q1.** Why does `result.push(path)` produce `[[], [], [], []]` for subsets of `[1, 2]`?

<details><summary>Answer</summary>

All entries are references to the same `path` array, which is empty after the last pop. Push a copy.

</details>

**Q2.** How many subsets and permutations exist for n = 10, and what does that say about time?

<details><summary>Answer</summary>

2^10 = 1024 subsets and 10! = 3,628,800 permutations. Time is O(2^n * n) and O(n! * n) (copying each answer costs n).

</details>

**Q3.** In Subsets II, why skip `nums[i] === nums[i - 1]` only when `i > start`?

<details><summary>Answer</summary>

At the same depth, choosing the second copy of a value would repeat a branch already explored with the first copy. But at a deeper level (`i === start`), taking the next copy builds a different subset like `[2, 2]`, which must be allowed.

</details>

---

Previous: [11. K-way Merge](11_k_way_merge.md) · Next: [13. Tree Traversal & Tree Properties](13_tree_traversal_and_properties.md) · [Pattern index](../../README.md)
