# Two Sum IV - Input is a BST

| | |
|---|---|
| **Topic** | Binary Search Trees |
| **Difficulty** | Easy |
| **Pattern** | inorder + two pointers |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #653 — https://leetcode.com/problems/two-sum-iv-input-is-a-bst/ |
| **Solution file** | [05_two_sum_iv_bst.js](../solutions/05_two_sum_iv_bst.js) — open only after a real attempt |

## Problem

Given a BST and an integer k, return true if there are two DIFFERENT nodes whose
values add up to k.

## Examples

```
Input: root=[5,3,6,2,4,null,7], k=9    Output: true   (2 + 7, or 3 + 6)
Input: root=[5,3,6,2,4,null,7], k=28   Output: false
```

## Constraints & clarifying questions

```
- Can the same node be used twice? (no)
- Values unique? (yes)
- Negative values / k? (possible, the approaches do not care)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *inorder + two pointers* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (hash set, any tree works)   O(n) time, O(n) space. Traverse; for each value v check if k - v is in the set, then add v.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (inorder -> sorted array -> two pointers)   O(n) time, O(n) space. Inorder of a BST is sorted.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single node -> false (needs two different nodes)
- empty -> false
- k is double a value: [1,2,3], k=4 -> 1+3 true; [2], k=4 -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (hash set, any tree works)   O(n) time, O(n) space

```
Traverse; for each value v check if k - v is in the set, then add v. This is the
classic Two Sum and it ignores the BST property. Perfectly fine answer.
```

### APPROACH 2 — Optimal (inorder -> sorted array -> two pointers)   O(n) time, O(n) space

```
Inorder of a BST is sorted. On a sorted array, two pointers from both ends find a
pair in O(n). Same complexity as the set, but uses the structure, and the follow-up
(O(h) space) is done by replacing the array with two iterators: one inorder
(ascending) stack and one REVERSE inorder (descending) stack.

Dry run on [5,3,6,2,4,null,7], k=9:
  sorted = [2,3,4,5,6,7]; left=0 (2), right=5 (7): 2+7 = 9 -> true
```

### Edge cases

```
- single node -> false (needs two different nodes)
- empty -> false
- k is double a value: [1,2,3], k=4 -> 1+3 true; [2], k=4 -> false
```

Full JavaScript solution with tests: [05_two_sum_iv_bst.js](../solutions/05_two_sum_iv_bst.js). Run it with `node 05_two_sum_iv_bst.js` from the solutions folder.

</details>

## Common mistakes

- Using the same node twice for `k = 2 * node.val`.
- Forgetting that a hash set during traversal is O(n) space; the two-iterator method is O(h).
- Searching the BST for `k - val` from the root each time without excluding the current node.

## Related follow-ups

- [Two Sum](../../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) (05_Hashing)
- [Two Sum II - Input Array Is Sorted](../../../06_Two_Pointers/03_Problems/02_Medium/03_two_sum_ii_sorted.md) (06_Two_Pointers)
- Binary Search Tree Iterator (LeetCode #173)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
