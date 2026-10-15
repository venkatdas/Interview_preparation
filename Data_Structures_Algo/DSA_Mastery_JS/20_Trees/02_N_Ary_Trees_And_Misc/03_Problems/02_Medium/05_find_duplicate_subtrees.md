# Find Duplicate Subtrees

| | |
|---|---|
| **Topic** | N-ary Trees and Miscellaneous |
| **Difficulty** | Medium |
| **Pattern** | subtree hashing |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #652 — https://leetcode.com/problems/find-duplicate-subtrees/ |
| **Solution file** | [05_find_duplicate_subtrees.js](../solutions/05_find_duplicate_subtrees.js) — open only after a real attempt |

## Problem

Given a binary tree, return the roots of all duplicate subtrees. Two subtrees are
duplicates if they have the same structure and the same values. Return one root per
distinct duplicate shape.

## Examples

```
Input: [1,2,3,4,null,2,4,null,null,4]   Output: roots of [2,4] and [4]
Input: [2,1,1]                          Output: root of [1]
Input: [2,2,2,3,null,3,null]            Output: roots of [2,3] and [3]
```

## Constraints & clarifying questions

```
- Return each duplicate shape only once? (yes)
- Order of the output? (any; tests compare serialized sets)
- Values can repeat and leaves of equal value count as duplicates? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *subtree hashing* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (compare every pair of subtrees)   O(n^2) time, O(h) space. Collect all nodes; for each pair (i, j) run isSame.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (serialize every subtree, count with a map)   O(n^2) worst / O(n) typical. Postorder: build the string "val,leftString,rightString" (with '#' for null) for each subtree and count it in a Map.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no duplicates -> []
- all leaves equal -> that leaf shape once
- duplicate shape appearing 3+ times -> still reported once (count === 2 check)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (compare every pair of subtrees)   O(n^2) time, O(h) space

```
Collect all nodes; for each pair (i, j) run isSame. Keep one representative per shape.
n up to 5000 makes n^2 isSame calls too slow in practice.
```

### APPROACH 2 — Optimal (serialize every subtree, count with a map)   O(n^2) worst / O(n) typical

```
Postorder: build the string "val,leftString,rightString" (with '#' for null) for
each subtree and count it in a Map. The second time a string appears, record the
node. Each node's string is built from its children's strings, so the whole tree is
serialized once (strings can be long on skewed trees, hence O(n^2) worst case on
string length; assigning each distinct string an integer id makes it a true O(n)).

Dry run on [2,1,1]:
  left 1  -> "1,#,#" count 1
  right 1 -> "1,#,#" count 2 -> record this node
  root    -> "2,1,#,#,1,#,#" count 1
  result: [node 1]
```

### Edge cases

```
- no duplicates -> []
- all leaves equal -> that leaf shape once
- duplicate shape appearing 3+ times -> still reported once (count === 2 check)
```

Full JavaScript solution with tests: [05_find_duplicate_subtrees.js](../solutions/05_find_duplicate_subtrees.js). Run it with `node 05_find_duplicate_subtrees.js` from the solutions folder.

</details>

## Common mistakes

- Serializing without null markers, so different shapes collide.
- Adding a node every time its serialization repeats (report only when the count becomes exactly 2).
- Inorder serialization, which is ambiguous even with null markers in some cases; use pre- or postorder.

## Related follow-ups

- [Subtree of Another Tree](../../../01_Binary_Trees/03_Problems/01_Easy/09_subtree_of_another_tree.md) (20_Trees/01_Binary_Trees)
- [Same Tree](../../../01_Binary_Trees/03_Problems/01_Easy/03_same_tree.md) (20_Trees/01_Binary_Trees)
- [Serialize and Deserialize Binary Tree](../../../01_Binary_Trees/03_Problems/03_Hard/20_serialize_deserialize.md) (20_Trees/01_Binary_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
