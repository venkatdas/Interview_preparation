# Insert into a Binary Search Tree

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | walk down, attach leaf |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #701 — https://leetcode.com/problems/insert-into-a-binary-search-tree/ |
| **Solution file** | [02_insert_into_bst.js](../solutions/02_insert_into_bst.js) — open only after a real attempt |

## Problem

Insert val into the BST and return the root. The value does not exist yet.
Any valid result is accepted; we always insert as a NEW LEAF (no restructuring).

## Examples

```
Input: root=[4,2,7,1,3], val=5   Output: [4,2,7,1,3,5]
Input: root=[], val=5            Output: [5]
```

## Constraints & clarifying questions

```
- Is val guaranteed not to be in the tree? (yes)
- Should the tree stay balanced? (no, not required)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *walk down, attach leaf* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (recursive)   O(h) time, O(h) space. insert(node, val): if node is null, return a new node; otherwise recurse into the correct side and reattach: node.left = insert(node.left, val).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (iterative, O(1) space)   O(h) time, O(1) space. Walk down with a pointer.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> the new node is the root
- val bigger than everything -> becomes the rightmost leaf
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (recursive)   O(h) time, O(h) space

```
insert(node, val): if node is null, return a new node; otherwise recurse into the
correct side and reattach: node.left = insert(node.left, val). Clean and short;
the "cost" is only the recursion stack.
```

### APPROACH 2 — Optimal (iterative, O(1) space)   O(h) time, O(1) space

```
Walk down with a pointer. When the side we want to go to is null, attach the new
node there and stop.

Dry run on [4,2,7,1,3], val=5:
  at 4: 5 > 4, right exists -> go to 7
  at 7: 5 < 7, left is null -> 7.left = 5. done
```

### Edge cases

```
- empty tree -> the new node is the root
- val bigger than everything -> becomes the rightmost leaf
```

Full JavaScript solution with tests: [02_insert_into_bst.js](../solutions/02_insert_into_bst.js). Run it with `node 02_insert_into_bst.js` from the solutions folder.

</details>

## Common mistakes

- Not reassigning `root.left = insert(root.left, val)`, so the new node is never attached.
- Rebalancing when the problem does not require it (any valid BST is accepted).
- Forgetting the empty-tree case returns the new node.

## Related follow-ups

- [Search in a Binary Search Tree](../01_Easy/01_search_in_bst.md)
- [Delete Node in a BST](11_delete_node_in_bst.md)
- [Convert Sorted Array to Binary Search Tree](../01_Easy/04_sorted_array_to_bst.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
