# Subtree of Another Tree

| | |
|---|---|
| **Topic** | Binary Trees |
| **Difficulty** | Easy |
| **Pattern** | isSame at every node / serialize |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #572 — https://leetcode.com/problems/subtree-of-another-tree/ |
| **Solution file** | [09_subtree_of_another_tree.js](../solutions/09_subtree_of_another_tree.js) — open only after a real attempt |

## Problem

Given trees root and subRoot, return true if some node of root has a subtree that is
IDENTICAL (same structure, same values) to subRoot.

## Examples

```
Input: root=[3,4,5,1,2], subRoot=[4,1,2]                   Output: true
Input: root=[3,4,5,1,2,null,null,null,null,0], subRoot=[4,1,2]   Output: false
       Explanation: the node 4 now has an extra grandchild 0, so the subtrees differ
```

## Constraints & clarifying questions

```
- Is an empty subRoot a subtree of anything? (LeetCode says subRoot has >= 1 node)
- Does "subtree" mean the WHOLE subtree hanging from a node? (yes, not a partial match)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *isSame at every node / serialize* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (try isSame at every node)   O(n * m) time, O(h) space. For every node of root, run isSame(node, subRoot).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (serialize both, substring search)   O(n + m) time, O(n + m) space. Serialize each tree in preorder with '#' for null and a separator before each value.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- subRoot identical to root -> true
- subRoot larger than root -> false
- values with several digits / negatives: separators protect us
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (try isSame at every node)   O(n * m) time, O(h) space

```
For every node of root, run isSame(node, subRoot). isSame costs up to O(m).
Perfectly acceptable in interviews; mention the string approach as the upgrade.
```

### APPROACH 2 — Optimal (serialize both, substring search)   O(n + m) time, O(n + m) space

```
Serialize each tree in preorder with '#' for null and a separator before each value.
Then subRoot is a subtree of root exactly when its string is a substring of root's.
Markers are essential: without '#', [12] vs [1,2] would be confused; without the
separator, value "12" would match inside "123". With a KMP search this is truly
linear; String.includes is good enough to say in an interview.

Dry run on root=[3,4,5,1,2], subRoot=[4,1,2]:
  root    -> ",3,4,1,#,#,2,#,#,5,#,#"
  subRoot -> ",4,1,#,#,2,#,#"           found inside -> true
With the extra 0 under 2: root contains ",2,0,#,#,#" so ",2,#,#" is not found -> false
```

### Edge cases

```
- subRoot identical to root -> true
- subRoot larger than root -> false
- values with several digits / negatives: separators protect us
```

Full JavaScript solution with tests: [09_subtree_of_another_tree.js](../solutions/09_subtree_of_another_tree.js). Run it with `node 09_subtree_of_another_tree.js` from the solutions folder.

</details>

## Common mistakes

- Comparing values only at the matching root, not the whole subtree.
- Serializing without null markers, which creates false matches like `12` inside `2`.
- Stopping after the first value match fails instead of continuing to search.

## Related follow-ups

- [Same Tree](03_same_tree.md)
- [Find Duplicate Subtrees](../../../02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/05_find_duplicate_subtrees.md) (20_Trees/02_N_Ary_Trees_And_Misc)
- [Serialize and Deserialize Binary Tree](../03_Hard/20_serialize_deserialize.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
