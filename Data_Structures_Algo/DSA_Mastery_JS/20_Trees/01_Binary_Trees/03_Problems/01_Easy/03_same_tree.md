# Same Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | two-tree recursion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #100 — https://leetcode.com/problems/same-tree/ |
| **Solution file** | [03_same_tree.js](../solutions/03_same_tree.js) — open only after a real attempt |

## Problem

Given two binary trees, return true if they are structurally identical and every
matching node has the same value.

## Examples

```
Input: p=[1,2,3], q=[1,2,3]         Output: true
Input: p=[1,2],   q=[1,null,2]      Output: false   Explanation: same values, different shape
Input: p=[1,2,1], q=[1,1,2]         Output: false
```

## Constraints & clarifying questions

```
- Can both be empty? (yes -> true)
- Values can be duplicates / negative? (yes, we compare node by node anyway)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-tree recursion* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (serialize both, compare strings)   O(n + m) time, O(n + m) space. Turn each tree into a preorder string with '#' for null children, then compare.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (parallel recursion)   O(min(n, m)) time, O(h) space. Walk both trees together: - both null -> true (two empty subtrees match) - one null  -> false (shape differs) - values differ -> false - else same(left, left) AND same(right, right) Stops at the first mismatch.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- both empty -> true
- one empty -> false
- same multiset of values but different structure -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (serialize both, compare strings)   O(n + m) time, O(n + m) space

```
Turn each tree into a preorder string with '#' for null children, then compare.
The '#' markers make shape part of the string, so [1,2] and [1,null,2] differ.
Works, but builds two strings when we could stop at the first difference.
```

### APPROACH 2 — Optimal (parallel recursion)   O(min(n, m)) time, O(h) space

```
Walk both trees together:
  - both null -> true (two empty subtrees match)
  - one null  -> false (shape differs)
  - values differ -> false
  - else same(left, left) AND same(right, right)
Stops at the first mismatch.

Dry run on p=[1,2], q=[1,null,2]:
  same(1, 1): values equal -> same(2, null) -> one is null -> false
```

### Edge cases

```
- both empty -> true
- one empty -> false
- same multiset of values but different structure -> false
```

Full JavaScript solution with tests: [03_same_tree.js](../solutions/03_same_tree.js). Run it with `node 03_same_tree.js` from the solutions folder.

</details>

## Common mistakes

- Comparing only values from a traversal, which ignores structure (`[1,2]` vs `[1,null,2]`).
- Forgetting the "one null, one not" case.
- Comparing node objects with `===` instead of values.

## Related follow-ups

- [Symmetric Tree](05_symmetric_tree.md)
- [Subtree of Another Tree](09_subtree_of_another_tree.md)
- [Find Duplicate Subtrees](../../../02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/05_find_duplicate_subtrees.md) (20_Trees/02_N_Ary_Trees_And_Misc)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
