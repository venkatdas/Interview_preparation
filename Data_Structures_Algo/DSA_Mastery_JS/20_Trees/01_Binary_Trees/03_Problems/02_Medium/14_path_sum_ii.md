# Path Sum II

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | backtracking shared path |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #113 — https://leetcode.com/problems/path-sum-ii/ |
| **Solution file** | [14_path_sum_ii.js](../solutions/14_path_sum_ii.js) — open only after a real attempt |

## Problem

Return ALL root-to-leaf paths whose values sum to targetSum. Each path is an array
of node values from the root to the leaf.

## Examples

```
Input: [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum=22
Output: [[5,4,11,2],[5,8,4,5]]
Input: [1,2,3], targetSum=5   Output: []
Input: [1,2], targetSum=0     Output: []
```

## Constraints & clarifying questions

```
- Order of the paths in the output? (any; tests sort)
- Negative values? (yes -> no pruning on "sum too big")
- Path must end at a leaf? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *backtracking shared path* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (copy the path at every step)   O(n * h) time, O(n * h) space. Recurse with a NEW array [...path, node.val] at each node.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (backtracking with one shared path)   O(n * h) worst output, O(h) extra. Keep one `path` array.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> []
- root alone equals target -> [[root]]
- node with one child is not a leaf
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (copy the path at every step)   O(n * h) time, O(n * h) space

```
Recurse with a NEW array [...path, node.val] at each node. Simple, but copying the
path costs O(h) at every node.
```

### APPROACH 2 — Optimal (backtracking with one shared path)   O(n * h) worst output, O(h) extra

```
Keep one `path` array. Push node.val on the way down, recurse, pop on the way up.
When we hit a leaf with the right sum, push a COPY of path into the result
(the shared array will be mutated afterwards). The number of valid paths can be
large, so output size dominates; the extra work is O(h).

Dry run on [1,2,3], target 3:
  path [1] -> left: path [1,2], leaf, 3 == 3 -> record [1,2]; pop -> [1]
           -> right: path [1,3], leaf, 4 != 3; pop -> [1]
  pop -> []   result [[1,2]]
```

### Edge cases

```
- empty tree -> []
- root alone equals target -> [[root]]
- node with one child is not a leaf
```

Full JavaScript solution with tests: [14_path_sum_ii.js](../solutions/14_path_sum_ii.js). Run it with `node 14_path_sum_ii.js` from the solutions folder.

</details>

## Common mistakes

- Pushing the shared `path` array instead of a copy into results.
- Forgetting to pop after exploring a child.
- Recording at nodes that are not leaves.

## Related follow-ups

- [Path Sum](../01_Easy/08_path_sum.md)
- [Subsets](../../../../13_Backtracking/03_Problems/02_Medium/01_subsets.md) (13_Backtracking)
- Path Sum III (LeetCode #437)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
