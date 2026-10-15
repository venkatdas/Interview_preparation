# All Nodes Distance K in Binary Tree

| | |
|---|---|
| **Topic** | N-ary Trees and Miscellaneous |
| **Difficulty** | Medium |
| **Pattern** | parent map + BFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #863 — https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/ |
| **Solution file** | [06_all_nodes_distance_k.js](../solutions/06_all_nodes_distance_k.js) — open only after a real attempt |

## Problem

Given a binary tree, a target node and an integer k, return the values of all nodes
that are exactly k edges away from target (going up through parents is allowed).

## Examples

```
Input: root=[3,5,1,6,2,0,8,null,null,7,4], target=5, k=2   Output: [7,4,1]
Input: root=[1], target=1, k=3                              Output: []
```

## Constraints & clarifying questions

```
- Values unique? (yes)  - k = 0 -> [target.val]
- Any output order? (yes; tests sort)

Key insight: a tree is a graph. Nodes can only go DOWN with left/right, so first give
every node a way to go UP (a parent map), then it is a plain BFS from target.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *parent map + BFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (distance from target to EVERY node, pick those equal to k)   O(n^2), O(h). For every node, compute the distance target -> node via the lowest common ancestor: dist = depth(target) + depth(node) - 2 * depth(lca).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (parent map + BFS)   O(n) time, O(n) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 -> the target itself
- k larger than the tree -> []
- target is the root or a leaf
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (distance from target to EVERY node, pick those equal to k)   O(n^2), O(h)

```
For every node, compute the distance target -> node via the lowest common ancestor:
dist = depth(target) + depth(node) - 2 * depth(lca). Each LCA/depth is O(n).
```

### APPROACH 2 — Optimal (parent map + BFS)   O(n) time, O(n) space

```
1. DFS once to record parent[node] in a Map.
2. BFS from target over neighbours {left, right, parent}, with a visited set
   (otherwise we bounce between a node and its parent). After k rounds the queue
   holds exactly the nodes at distance k.

Dry run on root 3, target 5, k=2:
  parents: 5->3, 1->3, 6->5, 2->5, 0->1, 8->1, 7->2, 4->2
  round 0: [5]           visited {5}
  round 1: [6, 2, 3]     (left, right, parent)
  round 2: [7, 4, 1]     (6 has nothing new; 2 -> 7, 4; 3 -> 1; 5 already visited)
  k reached -> [7, 4, 1]
```

### Edge cases

```
- k = 0 -> the target itself
- k larger than the tree -> []
- target is the root or a leaf
```

Full JavaScript solution with tests: [06_all_nodes_distance_k.js](../solutions/06_all_nodes_distance_k.js). Run it with `node 06_all_nodes_distance_k.js` from the solutions folder.

</details>

## Common mistakes

- Searching only downward from the target (misses nodes reached through the parent).
- No visited set, so BFS bounces between a node and its parent.
- Comparing node values instead of nodes when locating the target.

## Related follow-ups

- [Lowest Common Ancestor of a Binary Tree](../../../01_Binary_Trees/03_Problems/02_Medium/17_lowest_common_ancestor.md) (20_Trees/01_Binary_Trees)
- [Rotting Oranges](../../../../24_Graph_Traversal/03_Problems/02_Medium/10_rotting_oranges.md) (24_Graph_Traversal)
- Amount of Time for Binary Tree to Be Infected (LeetCode #2385)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
