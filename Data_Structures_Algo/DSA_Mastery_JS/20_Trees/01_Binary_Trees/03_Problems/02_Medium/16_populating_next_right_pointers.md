# Populating Next Right Pointers in Each Node

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Medium |
| **Pattern** | level links in O(1) space |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #116 — https://leetcode.com/problems/populating-next-right-pointers-in-each-node/ |
| **Solution file** | [16_populating_next_right_pointers.js](../solutions/16_populating_next_right_pointers.js) — open only after a real attempt |

## Problem

You are given a PERFECT binary tree whose nodes have an extra `next` pointer
(initially null). Set every node's `next` to the node immediately to its right on
the same level. The last node of each level keeps next = null.

## Examples

```
Input: [1,2,3,4,5,6,7]
Output (levels, read via next): [1,#], [2,3,#], [4,5,6,7,#]
Input: []   Output: []
```

## Constraints & clarifying questions

```
- Perfect tree guaranteed? (yes for 116; 117 is the general case, see note below)
- O(1) extra space required? (the follow-up; recursion stack does not count)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *level links in O(1) space* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS level by level)   O(n) time, O(w) space. Standard level order.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (use the next pointers you already built)   O(n) time, O(1) space. Once level k is linked, we can walk level k with `next` pointers like a linked list, and link level k+1 as we go: node.left.next  = node.right                      (siblings) node.right.next = node.next ?

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree
- single node (next stays null)
- For a non-perfect tree (117) the O(1) version needs a "dummy head" per level; the
  BFS version works unchanged.
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS level by level)   O(n) time, O(w) space

```
Standard level order. Inside a level, link queue[i].next = queue[i+1].
Works for ANY tree (also solves LeetCode 117), but uses a queue.
```

### APPROACH 2 — Optimal (use the next pointers you already built)   O(n) time, O(1) space

```
Once level k is linked, we can walk level k with `next` pointers like a linked list,
and link level k+1 as we go:
  node.left.next  = node.right                      (siblings)
  node.right.next = node.next ? node.next.left : null   (cousins, via parent's next)
Start from the root; after finishing a level, drop to its leftmost child.

Dry run on [1,2,3,4,5,6,7]:
  level [1]:   2.next = 3; 1.next is null so 3.next = null
  level [2,3]: node 2: 4.next = 5, 5.next = 3.left = 6
               node 3: 6.next = 7, 7.next = null
  level [4..7]: leaves, nothing to link. done.
```

### Edge cases

```
- empty tree
- single node (next stays null)
- For a non-perfect tree (117) the O(1) version needs a "dummy head" per level; the
  BFS version works unchanged.
```

Full JavaScript solution with tests: [16_populating_next_right_pointers.js](../solutions/16_populating_next_right_pointers.js). Run it with `node 16_populating_next_right_pointers.js` from the solutions folder.

</details>

## Common mistakes

- Not connecting `node.right.next` to `node.next.left` across parents.
- Using a queue when O(1) extra space was asked (fine as a first answer; mention the pointer-walk version).
- Assuming the tree is perfect for the general version (LeetCode #117).

## Related follow-ups

- Populating Next Right Pointers in Each Node II (LeetCode #117)
- [Binary Tree Level Order Traversal](10_level_order_traversal.md)
- [Binary Tree Right Side View](12_right_side_view.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
