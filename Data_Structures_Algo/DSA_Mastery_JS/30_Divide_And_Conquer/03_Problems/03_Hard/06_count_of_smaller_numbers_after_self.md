# Count of Smaller Numbers After Self, merge-sort version

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Hard |
| **Pattern** | count while merging indices |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #315 — https://leetcode.com/problems/count-of-smaller-numbers-after-self/ |
| **Solution file** | [06_count_of_smaller_numbers_after_self.js](../solutions/06_count_of_smaller_numbers_after_self.js) — open only after a real attempt |

## Problem

For each index i, count how many elements to its right are strictly smaller than nums[i].

## Examples

```
Input: [5,2,6,1]   Output: [2,1,1,0]
Input: [-1,-1]     Output: [0,0]
```

## Constraints & clarifying questions

```
- n up to 10^5 -> O(n^2) too slow
- Strictly smaller
- (A Fenwick-tree version lives in ../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count while merging indices* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2). For each i scan j > i.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Merge sort on INDICES, count while merging)   O(n log n) time, O(n) space. Sort indices by value with merge sort.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> []
- all equal -> zeros
- descending -> [n-1, ..., 0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2)

```
For each i scan j > i.
```

### APPROACH 2 — Optimal (Merge sort on INDICES, count while merging)   O(n log n) time, O(n) space

```
Sort indices by value with merge sort. When merging a left half and a right half (all
left indices are < all right indices in position), each time we take an element from the
LEFT half, every right-half element already taken is smaller than it and sits to its right
in the original array. So counts[leftIndex] += (number of right elements taken so far).
Ties: take the right element first only if it is strictly smaller, so equal values do
not count.

Dry run on [5,2,6,1] (indices 0..3):
  split [0,1] | [2,3]
  left: merge [0] and [1]: 2 < 5 -> take 1 (rightTaken = 1); take 0 -> counts[0] += 1 -> order [1,0]
  right: merge [2] and [3]: 1 < 6 -> take 3; take 2 -> counts[2] += 1 -> order [3,2]
  top: merge [1,0] (values 2,5) with [3,2] (values 1,6):
    1 < 2 -> take 3 (rightTaken 1); 2 < 6 -> take 1, counts[1] += 1; 5 < 6 -> take 0, counts[0] += 1;
    take 2
  counts = [2,1,1,0]
```

### Edge cases

```
- empty -> []
- all equal -> zeros
- descending -> [n-1, ..., 0]
```

Full JavaScript solution with tests: [06_count_of_smaller_numbers_after_self.js](../solutions/06_count_of_smaller_numbers_after_self.js). Run it with `node 06_count_of_smaller_numbers_after_self.js` from the solutions folder.

</details>

## Common mistakes

- Sorting the values themselves and losing track of original positions - sort INDICES.
- Counting equal elements as "smaller" (wrong `<` vs `<=` in the merge).
- Counting at the wrong moment: add the number of right-half items already taken when a LEFT item is placed.

## Related follow-ups

- Reverse Pairs (LeetCode #493)
- Count of Range Sum (LeetCode #327)
- [Fenwick Tree](../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
