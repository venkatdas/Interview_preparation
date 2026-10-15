# House Robber III

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Medium |
| **Pattern** | tree DP (take/skip tuple) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #337 — https://leetcode.com/problems/house-robber-iii/ |
| **Solution file** | [05_house_robber_iii.js](../solutions/05_house_robber_iii.js) — open only after a real attempt |

## Problem

Houses form a binary tree. A thief cannot rob two directly-connected houses
(parent and child) on the same night. Return the maximum money he can rob.

## Examples

```
Input: [3,2,3,null,3,null,1]   Output: 7   Explanation: 3 + 3 + 1 (root + two grandchildren)
       3
      / \
     2   3
      \   \
       3   1
Input: [3,4,5,1,3,null,1]      Output: 9   Explanation: 4 + 5
```

## Constraints & clarifying questions

```
- Up to 10^4 nodes, values >= 0.
- Is an empty tree possible? (yes -> 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *tree DP (take/skip tuple)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n) worst, O(h) space. rob(node) = max( node.val + rob(grandchildren...), rob(left) + rob(right) ).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Tree DP with a 2-value tuple (post-order)   O(n) time, O(h) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> 0
- single node -> its value
- straight line (linked-list tree) -> alternate levels
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n) worst, O(h) space

```
rob(node) = max( node.val + rob(grandchildren...), rob(left) + rob(right) ).
Grandchildren are visited by both branches -> overlapping subproblems -> exponential.
```

### APPROACH 2 — Memo on the node object   O(n) time, O(n) space

```
Same recursion, but cache rob(node) in a Map keyed by the node object itself
(objects are valid Map keys, no string building needed).
```

### APPROACH 3 — Tree DP with a 2-value tuple (post-order)   O(n) time, O(h) space

### DP definition

```
STATE      for each node return [skip, take]:
take = money if we ROB this node
             skip = money if we do NOT rob this node (children free to do anything)
RECURRENCE take = node.val + left.skip + right.skip
skip = max(left.skip, left.take) + max(right.skip, right.take)
BASE CASES null node -> [0, 0]
ANSWER     max(root.skip, root.take)
Every node is visited once and does O(1) work. The `tabulation` version below does the
same post-order with an explicit stack (bottom-up order), no recursion.

Dry run on the first example (post-order, leaves first):
  node 3 (left leaf, under 2) : [0, 3]
  node 2                     : take = 2 + 0 + 0 = 2, skip = max(0,3) + 0 = 3 -> [3, 2]
  node 1 (right leaf)        : [0, 1]
  node 3 (right child)       : take = 3 + 0 + 0 = 3, skip = 0 + max(0,1) = 1 -> [1, 3]
  root 3                     : take = 3 + 3 + 1 = 7, skip = max(3,2)+max(1,3) = 6 -> [6, 7]
  answer max(6, 7) = 7
```

### Edge cases

```
- empty tree -> 0
- single node -> its value
- straight line (linked-list tree) -> alternate levels
```

Full JavaScript solution with tests: [05_house_robber_iii.js](../solutions/05_house_robber_iii.js). Run it with `node 05_house_robber_iii.js` from the solutions folder.

</details>

## Common mistakes

- Robbing grandchildren by recursion without a cache, which is exponential; return a pair [rob, skip] from each node instead.
- When the current node is skipped, forcing the children to be robbed; each child should take its own best of rob / skip.
- Forgetting the empty tree (answer 0).

## Related follow-ups

- [House Robber](../../../01_One_Dimensional_DP/03_Problems/02_Medium/05_house_robber.md)
- [Binary Tree Cameras](../03_Hard/12_binary_tree_cameras.md)
- Maximum Independent Set on trees

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
