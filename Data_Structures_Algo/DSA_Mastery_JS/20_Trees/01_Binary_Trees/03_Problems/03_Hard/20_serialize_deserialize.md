# Serialize and Deserialize Binary Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Hard |
| **Pattern** | preorder with '#' |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #297 — https://leetcode.com/problems/serialize-and-deserialize-binary-tree/ |
| **Solution file** | [20_serialize_deserialize.js](../solutions/20_serialize_deserialize.js) — open only after a real attempt |

## Problem

Design serialize(root) -> string and deserialize(string) -> root such that
deserialize(serialize(tree)) rebuilds the exact same tree. Any format is allowed.

## Examples

```
Input: [1,2,3,null,null,4,5]   serialize -> "1,2,#,#,3,4,#,#,5,#,#"  -> deserialize -> same tree
Input: []                      serialize -> "#"
```

## Constraints & clarifying questions

```
- Values: integers only? negative? (yes, so use a separator, not fixed width)
- Any format OK, or must match LeetCode's level-order format? (any)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *preorder with '#'* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (level order with nulls, like LeetCode's own format)   O(n), O(n). BFS, write "#" for every missing child; rebuild with a queue (exactly `buildTree` in `20_Trees/02_Implementations/tree_node.js`).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (preorder with '#' sentinels)   O(n) time, O(n) space. Serialize: preorder; write the value, recurse left, recurse right; write '#' for null.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> "#"
- negative and multi-digit values (separator handles them)
- deep skewed tree: recursion depth n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (level order with nulls, like LeetCode's own format)   O(n), O(n)

```
BFS, write "#" for every missing child; rebuild with a queue (exactly `buildTree` in
tree_node.js). Works, but the string contains a '#' for every missing child of every
node, and the rebuild logic with the queue is fiddlier to write from memory.
```

### APPROACH 2 — Optimal (preorder with '#' sentinels)   O(n) time, O(n) space

```
Serialize: preorder; write the value, recurse left, recurse right; write '#' for null.
Deserialize: read tokens left to right with one moving index. Each call consumes
exactly the tokens of one subtree: value, then its whole left subtree, then right.
The '#' markers tell the recursion when a subtree ends, which is why preorder alone
(without inorder) is enough here but NOT in problem 18.

Dry run on "1,2,#,#,3,4,#,#,5,#,#":
  build: '1' -> node 1; left = build: '2' -> node 2; left '#' null; right '#' null
                        right = build: '3'; left build: '4', '#', '#'; right build: '5', '#', '#'
```

### Edge cases

```
- empty tree -> "#"
- negative and multi-digit values (separator handles them)
- deep skewed tree: recursion depth n
```

Full JavaScript solution with tests: [20_serialize_deserialize.js](../solutions/20_serialize_deserialize.js). Run it with `node 20_serialize_deserialize.js` from the solutions folder.

</details>

## Common mistakes

- Omitting null markers, so different shapes produce the same string.
- Multi-digit and negative values broken by character-by-character parsing (split on a delimiter).
- Using a global index that isn't reset between calls.

## Related follow-ups

- [Construct Binary Tree from Preorder and Inorder Traversal](../02_Medium/18_construct_from_preorder_inorder.md)
- Serialize and Deserialize BST (LeetCode #449)
- [Find Duplicate Subtrees](../../../02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/05_find_duplicate_subtrees.md) (20_Trees/02_N_Ary_Trees_And_Misc)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
