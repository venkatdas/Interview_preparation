# N-ary Tree Preorder Traversal

| | |
|---|---|
| **Topic** | N-ary Trees and Miscellaneous |
| **Difficulty** | Easy |
| **Pattern** | recursion / explicit stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #589 — https://leetcode.com/problems/n-ary-tree-preorder-traversal/ |
| **Solution file** | [01_n_ary_preorder.js](../solutions/01_n_ary_preorder.js) — open only after a real attempt |

## Problem

Return the preorder traversal (node, then each child left to right) of an N-ary tree.

## Examples

```
Input: [1,null,3,2,4,null,5,6]   Output: [1,3,5,6,2,4]
Input: []                        Output: []
```

## Constraints & clarifying questions

```
- Children order matters? (yes, left to right as stored)
- Follow-up: iterative? (yes, see optimal)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *recursion / explicit stack* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (recursive)   O(n) time, O(h) space. visit node, then recurse into every child.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (iterative with an explicit stack)   O(n) time, O(n) space. Push the root.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> []
- single node
- node with many children / long chain
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (recursive)   O(n) time, O(h) space

```
visit node, then recurse into every child. Three lines. The "brute" label only
means it relies on the call stack; on very deep trees that can overflow.
```

### APPROACH 2 — Optimal (iterative with an explicit stack)   O(n) time, O(n) space

```
Push the root. Pop, visit, push children in REVERSE order so the first child is on
top of the stack and gets popped next.

Dry run on [1,null,3,2,4,null,5,6]:
  stack [1]        pop 1 -> out [1],         push 4,2,3 -> stack [4,2,3]
  pop 3 -> [1,3]   push 6,5 -> [4,2,6,5]
  pop 5 -> [1,3,5]; pop 6 -> [1,3,5,6]; pop 2 -> [...,2]; pop 4 -> [1,3,5,6,2,4]
```

### Edge cases

```
- empty tree -> []
- single node
- node with many children / long chain
```

Full JavaScript solution with tests: [01_n_ary_preorder.js](../solutions/01_n_ary_preorder.js). Run it with `node 01_n_ary_preorder.js` from the solutions folder.

</details>

## Common mistakes

- Pushing children onto the stack in normal order, which visits them right to left.
- Not handling a null root.
- Recursing on very deep trees in JS without mentioning the iterative option.

## Related follow-ups

- N-ary Tree Postorder Traversal (LeetCode #590)
- [N-ary Tree Level Order Traversal](../02_Medium/03_n_ary_level_order.md)
- [Maximum Depth of N-ary Tree](02_max_depth_n_ary.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
