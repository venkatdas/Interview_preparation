# Unique Binary Search Trees II

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | generating structures on a range |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Binary Search Trees](../../../21_Binary_Search_Trees/README.md) |
| **Source** | LeetCode #95 — https://leetcode.com/problems/unique-binary-search-trees-ii/ (statement paraphrased in our own words) |
| **Solution file** | [11_unique_binary_search_trees_ii.js](../solutions/11_unique_binary_search_trees_ii.js) — open only after a real attempt |

## Problem

Given n, build every structurally unique BST that stores exactly the values 1..n.
Return the list of roots (any order).

## Examples

```
n = 1 -> [[1]]
n = 3 -> 5 trees:
  1        1          2         3      3
   \        \        / \       /      /
    3        2      1   3     2      1
   /          \              /        \
  2            3            1          2
```

## Constraints & clarifying questions

```
- 1 <= n <= 8 (output size is Catalan(n): 1430 for n = 8)
- May trees share subtrees? (on LeetCode yes; ask - if no, clone them)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Generate all structures: pick the root, generate all left subtrees and all right subtrees, take the cross product.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Insert every permutation of 1..n into an empty BST and keep the distinct shapes. Correct but n! work.

</details>

<details><summary>Hint 3</summary>

**The key idea.** `build(lo, hi)`: for each root r, combine `build(lo, r-1)` with `build(r+1, hi)`. The BST rule decides which values go left.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** The empty range must return `[null]`, not `[]`, or the loops produce nothing. n = 0 returns `[]`.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (insert every permutation, dedupe)   O(n! * n) time

```
Every BST of 1..n is produced by inserting SOME permutation. Insert all n!
permutations, serialize each tree, keep the distinct ones. Huge redundancy.
```

### APPROACH 2 — Optimal (generate on a value range)   O(Catalan(n) * n) time

```
PROMISE: build(lo, hi) returns every BST containing exactly the values lo..hi.
  base: lo > hi -> [null] (one way to build an empty tree - NOT an empty list,
        or the loops below would produce nothing)
  step: for each root value r in lo..hi:
          for L of build(lo, r-1), for R of build(r+1, hi): new TreeNode(r, L, R)
Memoizing build by (lo, hi) shares identical subtrees between results.

Dry run build(1,3), root 1: left build(1,0)=[null], right build(2,3) = [2->3, 3->2]
  -> 2 trees; root 2: [1] x [3] -> 1 tree; root 3: build(1,2) x [null] -> 2 trees. Total 5.
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| permutations + dedupe | O(n! * n) | O(n! * n) |
| range recursion | O(Catalan(n) * n) | output size |

### Edge cases

```
- n = 0 -> [] on LeetCode (special-case it; build would return [null])
- shared subtrees: mutating one result would change others
```

### Common mistakes

- Returning `[]` for an empty range.
- Mutating a shared subtree after building (memo shares nodes).
- Confusing the count problem (LeetCode #96) with this list problem.

Full JavaScript solution with tests: [11_unique_binary_search_trees_ii.js](../solutions/11_unique_binary_search_trees_ii.js). Run it with `node 11_unique_binary_search_trees_ii.js` from the solutions folder.

</details>

## Related follow-ups

- Unique Binary Search Trees (LeetCode #96)
- All Possible Full Binary Trees (LeetCode #894)
- Different Ways to Add Parentheses (LeetCode #241)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
