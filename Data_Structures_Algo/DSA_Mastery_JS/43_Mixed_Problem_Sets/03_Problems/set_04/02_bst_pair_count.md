# BST Pair Count

| | |
|---|---|
| **Set** | [Mixed Set 04](README.md) — problem 02 of 5 |
| **Difficulty** | Medium |
| **Time box** | 20 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [02_bst_pair_count.js](solutions/02_bst_pair_count.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A binary search tree with DISTINCT values is given as a level-order array (null for
missing children). Return how many unordered pairs of different nodes have values that
add up to `target`.

## Examples

```
Input: tree = [5, 3, 8, 1, 4, 6, 9], target = 9    Output: 3   Explanation: (1,8), (3,6), (4,5)
Input: tree = [2, 1, 3], target = 4                 Output: 1   Explanation: (1,3)
Input: tree = [1], target = 2                       Output: 0   Explanation: a node cannot pair with itself
```

## Constraints & clarifying questions

```
- Up to 10^5 nodes. Values distinct (so each pair is counted once).
- Can I use O(n) extra space? (yes; follow-up: O(h) with two iterators)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** In-order traversal (sorted order) + opposite-end two pointers. See [Binary Search Trees](../../../21_Binary_Search_Trees/README.md) and [Two Pointers](../../../06_Two_Pointers/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Collect all values and test every pair: O(n²).

</details>

<details><summary>Hint 3</summary>

**The key idea.** A BST's in-order traversal is sorted. Two pointers on a sorted array count pairs with a given sum in O(n).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree or one node -> 0
- target smaller than any pair -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
Collect all values with any traversal and test every pair.
```

### APPROACH 2 — Optimal (in-order traversal gives a sorted array + two pointers)   O(n) time, O(n) space

```
In-order traversal of a BST visits values in increasing order. On the sorted values run
opposite-end two pointers: sum too small -> move left up; too big -> move right down;
equal -> count and move both (values are distinct).

Dry run on [5, 3, 8, 1, 4, 6, 9], target 9:
  in-order = [1, 3, 4, 5, 6, 8, 9]
  1+9=10 > 9  r--      1+8=9 count=1 l++ r--
  3+6=9 count=2        4+5=9 count=3, pointers cross -> answer 3
```

### Edge cases

```
- empty tree or one node -> 0
- target smaller than any pair -> 0
```

### Common mistakes

```
- Running two pointers on a level-order array (it is not sorted).
- Counting (a, b) and (b, a) separately.
```

Full JavaScript solution with tests: [02_bst_pair_count.js](solutions/02_bst_pair_count.js). Run it with `node solutions/02_bst_pair_count.js` from this folder.

</details>

## Related follow-ups

- O(h) memory with two BST iterators (forward and reverse)
- Duplicates allowed
- Count pairs with sum ≤ target

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
