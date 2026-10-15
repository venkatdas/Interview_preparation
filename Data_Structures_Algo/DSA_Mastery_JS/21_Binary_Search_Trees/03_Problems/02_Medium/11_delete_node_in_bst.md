# Delete Node in a BST

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Medium |
| **Pattern** | three delete cases |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #450 — https://leetcode.com/problems/delete-node-in-a-bst/ |
| **Solution file** | [11_delete_node_in_bst.js](../solutions/11_delete_node_in_bst.js) — open only after a real attempt |

## Problem

Delete the node with value key from the BST (if present) and return the root.
The result must still be a BST.

## Examples

```
Input: root=[5,3,6,2,4,null,7], key=3   Output: [5,4,6,2,null,null,7]  (or [5,2,6,null,4,null,7])
Input: root=[5,3,6,2,4,null,7], key=0   Output: unchanged
Input: root=[], key=0                   Output: []
```

## Constraints & clarifying questions

```
- Values unique? (yes)   - Key may be absent? (yes -> return the tree unchanged)
- Either of the two valid answers accepted for the 2-children case? (yes)

The three cases when we find the node:
  1. leaf              -> return null (parent's pointer becomes null)
  2. one child         -> return that child (it takes the node's place)
  3. two children      -> replace the node's value with its inorder SUCCESSOR (min of
                          the right subtree), then delete the successor from the right
                          subtree (the successor has no left child, so that is case 1 or 2)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *three delete cases* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (collect values, drop key, rebuild a balanced BST)   O(n) time, O(n) space. Inorder -> sorted values -> remove key -> build from the middle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (recursive delete with the three cases)   O(h) time, O(h) space. Recurse down to the node (like search), re-attach the returned subtree on the way up.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- deleting the root (all three cases possible at the root)
- key not in the tree
- deleting the last node -> null
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect values, drop key, rebuild a balanced BST)   O(n) time, O(n) space

```
Inorder -> sorted values -> remove key -> build from the middle. Values are right but the
shape is thrown away and it costs O(n) for a single delete. Shows WHY we want the local fix.
```

### APPROACH 2 — Optimal (recursive delete with the three cases)   O(h) time, O(h) space

```
Recurse down to the node (like search), re-attach the returned subtree on the way up.

Dry run on [5,3,6,2,4,null,7], key=3:
  delete(5): 3 < 5 -> 5.left = delete(3)
    delete(3): found, two children. successor = min(right subtree {4}) = 4
               3.val = 4; 3.right = delete(right, 4) -> 4 is a leaf -> null
               returns node (now 4, with left child 2)
  result [5,4,6,2,null,null,7]
```

### Edge cases

```
- deleting the root (all three cases possible at the root)
- key not in the tree
- deleting the last node -> null
```

Full JavaScript solution with tests: [11_delete_node_in_bst.js](../solutions/11_delete_node_in_bst.js). Run it with `node 11_delete_node_in_bst.js` from the solutions folder.

</details>

## Common mistakes

- Losing a subtree when the deleted node has two children.
- Copying the successor's value but forgetting to delete the successor node.
- Not handling deletion of the root or a missing key.

## Related follow-ups

- [Insert into a Binary Search Tree](02_insert_into_bst.md)
- [Inorder Successor in BST](09_inorder_successor_in_bst.md)
- [Trim a Binary Search Tree](10_trim_a_bst.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
