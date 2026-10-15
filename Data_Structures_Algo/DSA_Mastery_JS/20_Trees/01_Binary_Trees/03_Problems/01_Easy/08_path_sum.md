# Path Sum

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | top-down remaining sum |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #112 — https://leetcode.com/problems/path-sum/ |
| **Solution file** | [08_path_sum.js](../solutions/08_path_sum.js) — open only after a real attempt |

## Problem

Given a tree and a targetSum, return true if there is a root-to-LEAF path whose
node values add up to targetSum.

## Examples

```
Input: [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22   Output: true   (5+4+11+2)
Input: [1,2,3], targetSum=5                                       Output: false
Input: [], targetSum=0                                            Output: false  (no path at all)
```

## Constraints & clarifying questions

```
- Must the path end at a leaf? (yes; [1,2], target 1 -> false because 1 is not a leaf)
- Negative values? (yes, so you cannot prune when the running sum exceeds the target)
- Empty tree -> false
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *top-down remaining sum* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (collect all root-to-leaf sums, then check)   O(n) time, O(n) space. DFS to every leaf, push the sum of the path into a list, then see if target is in it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (top-down recursion with remaining target)   O(n) time, O(h) space. Pass "how much is still needed" down the tree.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> false even when target is 0
- node with one child is not a leaf ([1,2], target 1 -> false)
- negative numbers: [-2,null,-3], target -5 -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect all root-to-leaf sums, then check)   O(n) time, O(n) space

```
DFS to every leaf, push the sum of the path into a list, then see if target is in it.
Same time complexity but stores every path sum and never stops early.
```

### APPROACH 2 — Optimal (top-down recursion with remaining target)   O(n) time, O(h) space

```
Pass "how much is still needed" down the tree. At a leaf, check if its value equals
the remaining amount. Return as soon as one side says true.

Dry run on [5,4,8,11,null,13,4,7,2,null,null,null,1], target 22:
  hasPath(5, 22) -> hasPath(4, 17) -> hasPath(11, 13) -> hasPath(7, 2) leaf 7 != 2 false
                                                       -> hasPath(2, 2)  leaf 2 == 2 true
```

### Edge cases

```
- empty tree -> false even when target is 0
- node with one child is not a leaf ([1,2], target 1 -> false)
- negative numbers: [-2,null,-3], target -5 -> true
```

Full JavaScript solution with tests: [08_path_sum.js](../solutions/08_path_sum.js). Run it with `node 08_path_sum.js` from the solutions folder.

</details>

## Common mistakes

- Accepting a path that ends at a non-leaf node.
- Returning `target === 0` at a null child, which counts half-paths.
- Assuming values are positive and pruning early (negatives exist).

## Related follow-ups

- [Path Sum II](../02_Medium/14_path_sum_ii.md)
- Path Sum III (LeetCode #437)
- [Binary Tree Maximum Path Sum](../03_Hard/19_maximum_path_sum.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
