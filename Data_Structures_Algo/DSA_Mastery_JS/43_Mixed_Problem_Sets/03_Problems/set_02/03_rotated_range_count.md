# Rotated Range Count

| | |
|---|---|
| **Set** | [Mixed Set 02](README.md) — problem 03 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [03_rotated_range_count.js](solutions/03_rotated_range_count.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A list of DISTINCT integers was sorted in increasing order and then rotated at an
unknown point (for example [1,3,5,8,9] -> [8,9,1,3,5]). Given the rotated array `nums`
and two numbers lo <= hi, return how many values v in nums satisfy lo <= v <= hi.
Aim for O(log n).

## Examples

```
Input: nums = [8, 9, 1, 3, 5], lo = 2, hi = 8   Output: 3   Explanation: 3, 5, 8
Input: nums = [1, 2, 3], lo = 4, hi = 9         Output: 0
Input: nums = [], lo = 0, hi = 1                Output: 0
```

## Constraints & clarifying questions

```
- Values distinct? (yes — with duplicates, finding the rotation point can degrade to O(n))
- Could the array be not rotated at all? (yes, rotation by 0)
- Many queries on the same array later? (then find the pivot once and reuse it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Binary search to find the rotation point + lower/upper bound searches. See [Searching / Binary Search](../../../10_Searching/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Linear scan is O(n). What extra structure does the array have?

</details>

<details><summary>Hint 3</summary>

**The key idea.** After finding the index of the minimum, the array is two sorted pieces. Count = upperBound(hi) − lowerBound(lo) in each piece.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array                 -> 0
- not rotated (p = 0)         -> part B is empty
- lo > every value or hi < every value -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(1) space

```
Scan and count values inside [lo, hi].
```

### APPROACH 2 — Optimal (binary search for the pivot + lower/upper bound on each half)   O(log n) time, O(1) space

```
1. Binary search the index p of the minimum: compare nums[mid] with nums[right];
   if nums[mid] > nums[right] the minimum is to the right of mid.
2. nums[p..n-1] and nums[0..p-1] are each sorted. In each sorted part, count =
   upperBound(hi) - lowerBound(lo).

Dry run on nums = [8, 9, 1, 3, 5], lo = 2, hi = 8:
  pivot search: l=0 r=4 mid=2 nums[2]=1 <= 5 -> r=2; l=0 r=2 mid=1 9 > 1 -> l=2; p=2
  part A = nums[2..4] = [1,3,5]: first >= 2 is index 3, first > 8 is index 5 -> 2
  part B = nums[0..1] = [8,9]:   first >= 2 is index 0, first > 8 is index 1 -> 1
  answer 3
```

### Edge cases

```
- empty array                 -> 0
- not rotated (p = 0)         -> part B is empty
- lo > every value or hi < every value -> 0
```

### Common mistakes

```
- Comparing nums[mid] with nums[left] for the pivot: breaks on the non-rotated case.
- Using lowerBound for hi too: excludes values equal to hi.
```

Full JavaScript solution with tests: [03_rotated_range_count.js](solutions/03_rotated_range_count.js). Run it with `node solutions/03_rotated_range_count.js` from this folder.

</details>

## Related follow-ups

- Duplicates allowed (worst case becomes O(n) — why?)
- Many queries on the same array
- Return the k-th smallest element of the rotated array

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
