# Binary Tree Maximum Path Sum

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Hard |
| **Pattern** | return one arm, record two arms |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #124 — https://leetcode.com/problems/binary-tree-maximum-path-sum/ |
| **Solution file** | [19_maximum_path_sum.js](../solutions/19_maximum_path_sum.js) — open only after a real attempt |

## Problem

A path is any sequence of nodes where each pair of adjacent nodes is connected by an
edge, and a node appears at most once. It does NOT need to pass through the root or
end at a leaf. Return the maximum sum of node values over all paths (at least one node).

## Examples

```
Input: [1,2,3]                        Output: 6    Explanation: 2 -> 1 -> 3
Input: [-10,9,20,null,null,15,7]      Output: 42   Explanation: 15 -> 20 -> 7
Input: [-3]                           Output: -3   Explanation: must pick at least one node
```

## Constraints & clarifying questions

```
- Negative values? (yes, that is what makes it hard: sometimes you should NOT extend a path)
- Can the path be a single node? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *return one arm, record two arms* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (for every node as the "top", compute best downward arms)   O(n^2), O(h). For each node X, the best path with X as its highest point is X.val + bestDown(X.left) + bestDown(X.right), where bestDown(n) = max(0, n.val + max(bestDown children)) bestDown is recomputed from scratch for every node -> O(n^2) on skewed trees.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (one bottom-up pass, same shape as Diameter)   O(n) time, O(h) space. gain(node) RETURNS the best sum of a path that starts at node and goes DOWN one side (what a parent could extend).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single negative node -> that value (initialize best to -Infinity, not 0)
- all negative -> the largest single value
- best path entirely inside a subtree, not through the root
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (for every node as the "top", compute best downward arms)   O(n^2), O(h)

```
For each node X, the best path with X as its highest point is
  X.val + bestDown(X.left) + bestDown(X.right), where bestDown(n) = max(0, n.val + max(bestDown children))
bestDown is recomputed from scratch for every node -> O(n^2) on skewed trees.
```

### APPROACH 2 — Optimal (one bottom-up pass, same shape as Diameter)   O(n) time, O(h) space

```
gain(node) RETURNS the best sum of a path that starts at node and goes DOWN one side
(what a parent could extend). A negative arm is worth less than nothing, so clamp
arms to >= 0 with Math.max(0, ...).
As a side effect, UPDATE best with node.val + leftGain + rightGain, the best path that
BENDS at this node (uses both arms; the parent can never use that, so it is not returned).

Dry run on [-10,9,20,null,null,15,7]:
  gain(9)  = 9,  best = 9
  gain(15) = 15, best = 15
  gain(7)  = 7
  gain(20): arms 15, 7 -> best = 20+15+7 = 42; returns 20 + max(15,7) = 35
  gain(-10): arms 9, 35 -> best = max(42, -10+9+35=34) = 42; returns -10+35 = 25
  answer 42
```

### Edge cases

```
- single negative node -> that value (initialize best to -Infinity, not 0)
- all negative -> the largest single value
- best path entirely inside a subtree, not through the root
```

Full JavaScript solution with tests: [19_maximum_path_sum.js](../solutions/19_maximum_path_sum.js). Run it with `node 19_maximum_path_sum.js` from the solutions folder.

</details>

## Common mistakes

- Initializing the best answer to 0 (all-negative trees must return the largest single value).
- Returning `val + left + right` upward (a path can only extend through one branch).
- Not clamping negative child gains to 0.

## Related follow-ups

- [Diameter of Binary Tree](../01_Easy/07_diameter_of_binary_tree.md)
- [Path Sum](../01_Easy/08_path_sum.md)
- Longest Univalue Path (LeetCode #687)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
