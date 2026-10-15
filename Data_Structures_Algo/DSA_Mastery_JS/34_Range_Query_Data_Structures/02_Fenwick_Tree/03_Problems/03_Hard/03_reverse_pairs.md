# Reverse Pairs

| | |
|---|---|
| **Topic** | Fenwick Tree (Binary Indexed Tree) |
| **Difficulty** | Hard |
| **Pattern** | compress v and 2v together, counting BIT |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #493 — https://leetcode.com/problems/reverse-pairs/ |
| **Solution file** | [03_reverse_pairs.js](../solutions/03_reverse_pairs.js) — open only after a real attempt |

## Problem

Count the pairs (i, j) with i < j and nums[i] > 2 * nums[j].

## Examples

```
Input: [1,3,2,3,1]   Output: 2   Explanation: (1,4): 3 > 2*1 and (3,4): 3 > 2*1
Input: [2,4,3,5,1]   Output: 3   Explanation: (1,4) 4 > 2, (2,4) 3 > 2, (3,4) 5 > 2
```

## Constraints & clarifying questions

```
- n up to 5 * 10^4, values up to +-2^31 -> 2 * nums[j] fits in a double exactly
- Strict inequality
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *compress v and 2v together, counting BIT* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Check every pair.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Fenwick tree over compressed values)   O(n log n) time, O(n) space. This is "count of smaller after self" with a twist: we compare nums[i] against 2*nums[j].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty / single element -> 0
- negatives: 2 * (-3) = -6 < -1, so (-1 then -3) counts
- zeros: 0 > 2*0 is false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Check every pair.
```

### APPROACH 2 — Optimal (Fenwick tree over compressed values)   O(n log n) time, O(n) space

```
This is "count of smaller after self" with a twist: we compare nums[i] against 2*nums[j].
Compress the union of all values v AND all doubled values 2v into one sorted list.
Sweep from the right. For index i, we need the number of already-seen j with
2 * nums[j] < nums[i]. Keep the BIT indexed by rank(2 * nums[j]); query
prefixCount(rank(nums[i]) - 1) (how many doubled values have a strictly smaller rank).
Then insert rank(2 * nums[i]) for future i's to the left.

Dry run on [1,3,2,3,1]: values {1,2,3}, doubled {2,4,6} -> sorted [1,2,3,4,6], ranks 0..4
  i=4 (1): query ranks < rank(1)=0 -> 0; insert rank(2)=1
  i=3 (3): query ranks < rank(3)=2 -> 1 (the inserted 2); insert rank(6)=4
  i=2 (2): query ranks < 1 -> 0; insert rank(4)=3
  i=1 (3): query ranks < 2 -> 1; insert rank(6)=4
  i=0 (1): query ranks < 0 -> 0
  total 2

(A merge-sort version also exists: count across halves before merging. Same complexity.)
```

### Edge cases

```
- empty / single element -> 0
- negatives: 2 * (-3) = -6 < -1, so (-1 then -3) counts
- zeros: 0 > 2*0 is false
```

Full JavaScript solution with tests: [03_reverse_pairs.js](../solutions/03_reverse_pairs.js). Run it with `node 03_reverse_pairs.js` from the solutions folder.

</details>

## Common mistakes

- Compressing only the original values; the query value `2 * nums[i]` must also be located in the sorted list (use binary search).
- Computing `2 * nums[i]` in 32-bit arithmetic; in JS Numbers it is safe, but do not use `| 0` tricks.
- Querying after inserting the current element, which can pair an element with itself.

## Related follow-ups

- [Count of Smaller Numbers After Self](02_count_of_smaller_numbers_after_self.md)
- [Count of Range Sum](../../../01_Segment_Tree/03_Problems/03_Hard/06_count_of_range_sum.md)
- Merge-sort inversion counting ([Divide and Conquer](../../../../30_Divide_And_Conquer/README.md))

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
