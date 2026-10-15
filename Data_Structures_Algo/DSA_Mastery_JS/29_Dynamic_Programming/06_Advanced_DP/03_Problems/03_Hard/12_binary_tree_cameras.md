# Binary Tree Cameras

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | tree DP (3 states) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #968 — https://leetcode.com/problems/binary-tree-cameras/ |
| **Solution file** | [12_binary_tree_cameras.js](../solutions/12_binary_tree_cameras.js) — open only after a real attempt |

## Problem

A camera placed on a node monitors that node, its parent and its children.
Return the minimum number of cameras so that every node is monitored.

## Examples

```
Input: [0,0,null,0,0]        Output: 1   Explanation: one camera on the middle node
       0
      /
     0      <- camera here covers root and both leaves
    / \
   0   0
Input: [0,0,null,0,null,0,null,null,0]   Output: 2
```

## Constraints & clarifying questions

```
- Up to 1000 nodes, all values are 0 (values do not matter).
- Single node -> 1 camera.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *tree DP (3 states)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(h) space. For each node decide camera / no camera, recursing with flags "is my parent covering me?" and "does my parent need me to cover it?" without caching.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Greedy post-order (the famous O(n) trick). Return a state code: 0 = not covered, 1 = covered, 2 = has camera.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single node -> 1
- straight line of 3 -> 1 (camera in the middle)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(h) space

```
For each node decide camera / no camera, recursing with flags "is my parent covering
me?" and "does my parent need me to cover it?" without caching. Exponential-ish.
```

### APPROACH 2 — Tree DP with 3 states per node (post-order)   O(n) time, O(h) space

```
Every node returns a triple of minimum cameras for its subtree under three conditions:
```

### APPROACH 3 — Greedy post-order (the famous O(n) trick)

```
Return a state code: 0 = not covered, 1 = covered, 2 = has camera. If any child is
NOT covered, place a camera here. It is the same DP with the optimal choice baked in.
```

### DP definition

```
STATE      [hasCamera, coveredNoCamera, notCovered]
hasCamera        : this node holds a camera (so its children are covered)
             coveredNoCamera  : no camera here, but a CHILD's camera covers it
             notCovered       : no camera here and not covered by children
                                (its PARENT must cover it)
RECURRENCE with L = left triple, R = right triple:
hasCamera       = 1 + min(L) + min(R)            // children can be in any state
  notCovered      = L.coveredNoCamera + R.coveredNoCamera   // no child camera, children
                                                   // must already be covered themselves
  coveredNoCamera = min over (at least one child has a camera):
                      L.hasCamera + min(R.hasCamera, R.coveredNoCamera),
                      R.hasCamera + min(L.hasCamera, L.coveredNoCamera)
BASE CASES null node -> [Infinity, 0, 0]: it can't hold a camera, it needs nothing.
ANSWER     min(root.hasCamera, root.coveredNoCamera)  (root has no parent to cover it).
Dry run on the first example (post-order):
  leaf        : hasCamera = 1 + 0 + 0 = 1, notCovered = 0 + 0 = 0,
                coveredNoCamera = Inf (no child can have a camera) -> [1, Inf, 0]
  middle node : L = R = [1, Inf, 0]
                hasCamera = 1 + 0 + 0 = 1
                notCovered = Inf + Inf = Inf
                coveredNoCamera = min(1 + min(1, Inf), 1 + min(1, Inf)) = 2  -> [1, 2, Inf]
  root        : L = [1, 2, Inf], R = null [Inf, 0, 0]
                hasCamera = 1 + 1 + 0 = 2
                notCovered = 2 + 0 = 2
                coveredNoCamera = min(1 + min(Inf, 0), Inf + ...) = 1  -> [2, 1, 2]
  answer min(2, 1) = 1
```

### Edge cases

```
- single node -> 1
- straight line of 3 -> 1 (camera in the middle)
```

Full JavaScript solution with tests: [12_binary_tree_cameras.js](../solutions/12_binary_tree_cameras.js). Run it with `node 12_binary_tree_cameras.js` from the solutions folder.

</details>

## Common mistakes

- Placing cameras on leaves; a leaf's parent covers more nodes.
- Forgetting the root: if the root ends up "not covered", it needs one extra camera.
- Treating null children as "not covered", which forces cameras on every leaf; null should count as covered.

## Related follow-ups

- [House Robber III](../02_Medium/05_house_robber_iii.md)
- [Diameter of Binary Tree](../01_Easy/06_diameter_longest_path_tree_dp.md)
- Distribute Coins in Binary Tree (LeetCode #979)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
