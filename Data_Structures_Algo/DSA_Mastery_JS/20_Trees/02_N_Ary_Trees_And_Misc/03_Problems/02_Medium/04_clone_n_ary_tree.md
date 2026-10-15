# Clone N-ary Tree

| | |
|---|---|
| **Topic** | N-ary Trees and Miscellaneous |
| **Difficulty** | Medium |
| **Pattern** | copy with Map |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1490 — https://leetcode.com/problems/clone-n-ary-tree/ |
| **Solution file** | [04_clone_n_ary_tree.js](../solutions/04_clone_n_ary_tree.js) — open only after a real attempt |

## Problem

Return a DEEP copy of an N-ary tree: new node objects with the same values and the
same structure. Changing the copy must not change the original.

## Examples

```
Input: [1,null,3,2,4,null,5,6]   Output: [1,null,3,2,4,null,5,6]  (different objects)
Input: []                        Output: []
```

## Constraints & clarifying questions

```
- Deep copy (new nodes), not a shallow copy of the root? (deep)
- Follow-up: what if the tree becomes a graph with random pointers? (use a Map old->new,
  see Clone Graph in 23_Graphs; the optimal below already uses that idea)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *copy with Map* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (serialize to array, rebuild)   O(n) time, O(n) space. toNaryArray(root) then buildNaryTree(array).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (recursive copy with a Map old -> new)   O(n) time, O(n) space. clone(node): create a new node with node.val, then clone each child and push it into the new node's children.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> null
- mutate the copy afterwards: the original must be unchanged (tested)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (serialize to array, rebuild)   O(n) time, O(n) space

```
toNaryArray(root) then buildNaryTree(array). Two passes and an intermediate array.
Correct, but it only works because values can be rebuilt; it would not work if nodes
carried extra pointers.
```

### APPROACH 2 — Optimal (recursive copy with a Map old -> new)   O(n) time, O(n) space

```
clone(node): create a new node with node.val, then clone each child and push it into
the new node's children. The Map remembers which copy belongs to which original, so
the same code handles shared/random pointers (and makes the tests easy).

Dry run on [1,null,3,2,4,null,5,6]:
  clone(1) -> new 1'; children: clone(3) -> new 3' with children [5', 6']; clone(2) -> 2'; clone(4) -> 4'
```

### Edge cases

```
- empty -> null
- mutate the copy afterwards: the original must be unchanged (tested)
```

Full JavaScript solution with tests: [04_clone_n_ary_tree.js](../solutions/04_clone_n_ary_tree.js). Run it with `node 04_clone_n_ary_tree.js` from the solutions folder.

</details>

## Common mistakes

- Copying the `children` array reference (shallow copy).
- Using a visited map unnecessarily (fine but not needed for trees).
- Forgetting to return null for a null root.

## Related follow-ups

- [Clone Graph](../../../../24_Graph_Traversal/03_Problems/02_Medium/09_clone_graph.md) (24_Graph_Traversal)
- [Copy List with Random Pointer](../../../../15_Linked_Lists/03_Problems/02_Medium/16_copy_list_with_random_pointer.md) (15_Linked_Lists)
- [Serialize and Deserialize Binary Tree](../../../01_Binary_Trees/03_Problems/03_Hard/20_serialize_deserialize.md) (20_Trees/01_Binary_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
