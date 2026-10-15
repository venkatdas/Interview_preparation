# Kth Ancestor of a Tree Node (re-solve)

| | |
|---|---|
| **Topic** | Advanced Tree Techniques |
| **Difficulty** | Hard |
| **Pattern** | binary lifting (reused from 01_Classic_Techniques) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Classic Techniques](../../../01_Classic_Techniques/README.md) |
| **Source** | LeetCode #1483 — https://leetcode.com/problems/kth-ancestor-of-a-tree-node/ (statement paraphrased, not copied) |
| **Solution file** | [04_kth_ancestor_of_a_tree_node.js](../solutions/04_kth_ancestor_of_a_tree_node.js) — open only after a real attempt |

This problem is fully taught in
[01_Classic_Techniques problem 08](../../../01_Classic_Techniques/03_Problems/03_Hard/08_kth_ancestor_of_a_tree_node.md).
Here you re-solve it quickly as spaced repetition, and the solution file **reuses**
`binaryLiftingLCA` from `01_Classic_Techniques/02_Implementations/classic_techniques.js`
with `require` instead of copying it.

## Problem

A tree has n nodes 0..n-1 rooted at 0, described by `parent[]` (`parent[0] = -1`). Build a
class whose method `getKthAncestor(node, k)` returns the k-th ancestor of `node`
(1st ancestor = parent), or -1 if it does not exist.

## Examples

```
parent = [-1,0,0,1,1,2,2]
getKthAncestor(3, 1) -> 1
getKthAncestor(5, 2) -> 0
getKthAncestor(6, 3) -> -1   (only 2 ancestors exist)
```

## Constraints & clarifying questions

```
- n and the number of queries up to 5 * 10^4; k up to n.
- k = 0? (return the node itself)
- Is parent[i] < i guaranteed? (do not rely on it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Many ancestor queries" -> *binary lifting*. See section 5.8 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Follow parent pointers k times: O(k) per query, up to O(n * q) total.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Precompute up[j][v] = 2^j-th ancestor. Any k is a sum of powers of two, so jump once per set bit.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** If k > depth[v] return -1 before jumping (or detect stepping past the root).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(k) per query

Walk up k parent pointers, stop at -1.

### APPROACH 2 — Optimal (binary lifting)   O(n log n) build, O(log n) per query

```
up[0][v] = parent[v]; up[j][v] = up[j-1][ up[j-1][v] ]
query: if k > depth[v] -> -1; else for each set bit j of k: v = up[j][v]

Dry run getKthAncestor(5, 2), parent = [-1,0,0,1,1,2,2]:
  depth[5] = 2, k = 0b10 -> bit 1 -> v = up[1][5] = up[0][2] = 0
```

### Edge cases

```
- k = 0 -> node
- k = depth -> root
- k > depth -> -1
```

### Common mistakes

- Table too short: need ceil(log2(n + 1)) levels.
- Letting the root's ancestor be -1 inside the table and then indexing up[j][-1].

Full JavaScript solution with tests: [04_kth_ancestor_of_a_tree_node.js](../solutions/04_kth_ancestor_of_a_tree_node.js).

</details>

## Related follow-ups

- Lowest Common Ancestor of a Binary Tree (LeetCode #236)
- Minimum Edge Weight Equilibrium Queries in a Tree (LeetCode #2846)
- Path Sum Queries with Updates (problem 05)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
