# Diameter of Binary Tree / Longest Path

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Easy |
| **Pattern** | tree DP (longest path) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #543 — https://leetcode.com/problems/diameter-of-binary-tree/ · LeetCode #1522 — https://leetcode.com/problems/diameter-of-n-ary-tree/ |
| **Solution file** | [06_diameter_longest_path_tree_dp.js](../solutions/06_diameter_longest_path_tree_dp.js) — open only after a real attempt |

## Problem

The diameter of a tree is the number of edges on the longest path between any two
nodes. The path may or may not pass through the root. Return the diameter.

## Examples

```
Input: [1,2,3,4,5]   Output: 3   Explanation: path 4 -> 2 -> 1 -> 3 (or 5 -> 2 -> 1 -> 3)
       1
      / \
     2   3
    / \
   4   5
Input: [1,2]         Output: 1
```

## Constraints & clarifying questions

```
- Up to 10^4 nodes. Diameter counted in edges, not nodes (ask!).
- Empty tree -> 0.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *tree DP (longest path)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(n^2) time, O(h) space. diameter(node) = max( height(left) + height(right), diameter(left), diameter(right) ) where height is recomputed from scratch each time -> every node computes heights of its whole subtree again -> O(n^2) on a skewed tree.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Tree DP, one post-order pass   O(n) time, O(h) space. This is the general "longest path in a tree" trick: every node reports upward ONE number (the longest downward path from it), and while doing so it updates a global answer with the best path that BENDS at it.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> 0, single node -> 0
- skewed tree (linked list) -> n - 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(n^2) time, O(h) space

```
diameter(node) = max( height(left) + height(right), diameter(left), diameter(right) )
where height is recomputed from scratch each time -> every node computes heights of
its whole subtree again -> O(n^2) on a skewed tree.
```

### APPROACH 2 — Memoise height   O(n) time, O(n) space

```
Same recursion but cache height(node) in a Map keyed by node. Now each height is
computed once.
```

### APPROACH 3 — Tree DP, one post-order pass   O(n) time, O(h) space

```
This is the general "longest path in a tree" trick: every node reports upward ONE
number (the longest downward path from it), and while doing so it updates a global
answer with the best path that BENDS at it.
```

### DP definition

```
STATE      down(node) = number of edges on the longest path going DOWN from node.
RECURRENCE down(node) = 1 + max(down(left), down(right))
candidate answer at node = down(left) + down(right)
           (counts edges: left branch edges + right branch edges, each including the
           edge from node to the child because down(child) + 1 ... see code)
BASE CASES down(null) = -1 so that a leaf has down = 0 (no edges below it) and a
null child contributes -1 + 1 = 0 edges.
ANSWER     max over all nodes of  leftEdges + rightEdges.
Dry run on [1,2,3,4,5] (post-order):
  node 4 : leftEdges = 0, rightEdges = 0 -> through = 0, down = 0
  node 5 : same -> down = 0
  node 2 : leftEdges = down(4)+1 = 1, rightEdges = 1 -> through = 2, down = 1
  node 3 : through 0, down 0
  node 1 : leftEdges = down(2)+1 = 2, rightEdges = down(3)+1 = 1 -> through = 3, down = 2
  best seen = 3

The `tabulation` version does the same post-order with an explicit stack.
```

### Edge cases

```
- empty tree -> 0, single node -> 0
- skewed tree (linked list) -> n - 1
```

Full JavaScript solution with tests: [06_diameter_longest_path_tree_dp.js](../solutions/06_diameter_longest_path_tree_dp.js). Run it with `node 06_diameter_longest_path_tree_dp.js` from the solutions folder.

</details>

## Common mistakes

- Returning the diameter from the recursion instead of the HEIGHT; the function returns height and updates a global best with left + right.
- Counting nodes instead of edges (LeetCode #543 counts edges).
- Assuming the longest path goes through the root.

## Related follow-ups

- Binary Tree Maximum Path Sum (LeetCode #124)
- [House Robber III](../02_Medium/05_house_robber_iii.md)
- Longest Univalue Path (LeetCode #687)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
