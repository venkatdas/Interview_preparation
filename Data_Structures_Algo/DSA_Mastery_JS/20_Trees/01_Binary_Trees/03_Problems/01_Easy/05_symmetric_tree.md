# Symmetric Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | two-tree recursion (mirrored) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #101 — https://leetcode.com/problems/symmetric-tree/ |
| **Solution file** | [05_symmetric_tree.js](../solutions/05_symmetric_tree.js) — open only after a real attempt |

## Problem

Return true if the tree is a mirror of itself around its center
(the left subtree is the mirror image of the right subtree).

## Examples

```
Input: [1,2,2,3,4,4,3]          Output: true
Input: [1,2,2,null,3,null,3]    Output: false   Explanation: both 3s are right children
Input: [1]                      Output: true
```

## Constraints & clarifying questions

```
- Empty tree symmetric? (yes)
- Do values matter or only shape? (both)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-tree recursion (mirrored)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (invert a copy, compare with original)   O(n) time, O(n) space. Build a mirrored COPY of the tree, then check isSame(original, mirrorCopy).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (recursion on two nodes at once)   O(n) time, O(h) space. isMirror(a, b) is true when: - both null, or - both non-null, a.val === b.val, and a.left mirrors b.right, and a.right mirrors b.left   &lt;- the crossed comparison Start with isMirror(root.left, root.right).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> true, [1] -> true
- [1,2,2,null,3,null,3] -> false (same values, shape not mirrored)
- [1,2,3] -> false (values differ)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (invert a copy, compare with original)   O(n) time, O(n) space

```
Build a mirrored COPY of the tree, then check isSame(original, mirrorCopy).
Correct but allocates a whole second tree. (Reuses problems 03 and 04.)
```

### APPROACH 2 — Optimal (recursion on two nodes at once)   O(n) time, O(h) space

```
isMirror(a, b) is true when:
  - both null, or
  - both non-null, a.val === b.val,
    and a.left mirrors b.right, and a.right mirrors b.left   <- the crossed comparison
Start with isMirror(root.left, root.right).

Dry run on [1,2,2,3,4,4,3]:
  isMirror(2, 2): equal -> isMirror(3, 3) and isMirror(4, 4)
    isMirror(3, 3): equal, children all null -> true
    isMirror(4, 4): true
  -> true
```

### Edge cases

```
- [] -> true, [1] -> true
- [1,2,2,null,3,null,3] -> false (same values, shape not mirrored)
- [1,2,3] -> false (values differ)
```

Full JavaScript solution with tests: [05_symmetric_tree.js](../solutions/05_symmetric_tree.js). Run it with `node 05_symmetric_tree.js` from the solutions folder.

</details>

## Common mistakes

- Comparing left with left and right with right (that checks equality, not mirroring).
- Checking only that each level is a palindrome while ignoring null positions.
- Forgetting the root itself is always symmetric with itself; compare its two children.

## Related follow-ups

- [Same Tree](03_same_tree.md)
- [Invert Binary Tree](04_invert_binary_tree.md)
- [Binary Tree Level Order Traversal](../02_Medium/10_level_order_traversal.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
