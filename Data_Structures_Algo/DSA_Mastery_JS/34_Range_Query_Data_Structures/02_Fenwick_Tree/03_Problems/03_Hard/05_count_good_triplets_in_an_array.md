# Count Good Triplets in an Array

| | |
|---|---|
| **Topic** | Fenwick Tree (Binary Indexed Tree) |
| **Difficulty** | Hard |
| **Pattern** | positions mapping + left/right counts |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2179 — https://leetcode.com/problems/count-good-triplets-in-an-array/ |
| **Solution file** | [05_count_good_triplets_in_an_array.js](../solutions/05_count_good_triplets_in_an_array.js) — open only after a real attempt |

## Problem

nums1 and nums2 are both permutations of [0..n-1]. A triplet of VALUES (x, y, z) is good
if x appears before y before z in nums1 AND x before y before z in nums2.
Return the number of good triplets.

## Examples

```
Input: nums1 = [2,0,1,3], nums2 = [0,1,2,3]   Output: 1
  triplets in nums1 order: (2,0,1),(2,0,3),(2,1,3),(0,1,3); only (0,1,3) is also ordered in nums2
Input: nums1 = [4,0,1,3,2], nums2 = [4,1,0,2,3]   Output: 4
```

## Constraints & clarifying questions

```
- n up to 10^5 -> O(n^3) and O(n^2) are out; need O(n log n)
- Both are permutations, so each value appears exactly once in each -> we can map values
  to their position in nums2.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *positions mapping + left/right counts* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time. Enumerate i &lt; j &lt; k in nums1 and check that the positions of those values in nums2 are also increasing.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Positions + two Fenwick passes)   O(n log n) time, O(n) space. Replace each value in nums1 by its index in nums2: pos[i] = indexInNums2(nums1[i]).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n < 3 -> 0
- identical permutations -> C(n, 3)
- reversed permutations -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time

```
Enumerate i < j < k in nums1 and check that the positions of those values in nums2 are
also increasing.
```

### APPROACH 2 — Optimal (Positions + two Fenwick passes)   O(n log n) time, O(n) space

```
Replace each value in nums1 by its index in nums2: pos[i] = indexInNums2(nums1[i]).
Now a good triplet is simply i < j < k with pos[i] < pos[j] < pos[k]: an increasing
triple in the array `pos`. Count by picking the MIDDLE element j:
  left[j]  = how many i < j have pos[i] < pos[j]   (Fenwick sweep left to right)
  right[j] = how many k > j have pos[k] > pos[j]   = (n - 1 - pos[j]) - (j - left[j])
             (values greater than pos[j] in total, minus the ones already to the left)
  answer = sum over j of left[j] * right[j]

Dry run: nums1 = [2,0,1,3], nums2 = [0,1,2,3] -> pos = [2,0,1,3]
  j=0 pos=2: left=0, greaterTotal=1, greaterLeft=0-0=0 -> right=1 -> 0
  j=1 pos=0: left=0, greaterTotal=3, greaterLeft=1-0=1 -> right=2 -> 0
  j=2 pos=1: left=1 (pos 0), greaterTotal=2, greaterLeft=2-1=1 -> right=1 -> 1*1=1
  j=3 pos=3: left=3, greaterTotal=0 -> 0
  answer 1
```

### Edge cases

```
- n < 3 -> 0
- identical permutations -> C(n, 3)
- reversed permutations -> 0
```

Full JavaScript solution with tests: [05_count_good_triplets_in_an_array.js](../solutions/05_count_good_triplets_in_an_array.js). Run it with `node 05_count_good_triplets_in_an_array.js` from the solutions folder.

</details>

## Common mistakes

- Trying to count triplets directly in O(n^3); fix the MIDDLE element and multiply (smaller-on-left) x (larger-on-right).
- Forgetting to remap nums1 through the positions in nums2, which turns the problem into counting increasing triplets in one array.
- Using a 32-bit-sized accumulator mentally; the answer can be about n^3/6, use Number (safe here) or BigInt for larger n.

## Related follow-ups

- [Count of Smaller Numbers After Self](02_count_of_smaller_numbers_after_self.md)
- Count Number of Teams (LeetCode #1395)
- Increasing Triplet Subsequence (LeetCode #334)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
