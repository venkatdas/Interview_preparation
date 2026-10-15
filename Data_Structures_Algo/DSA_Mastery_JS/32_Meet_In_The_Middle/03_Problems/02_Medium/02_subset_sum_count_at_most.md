# Subset Sum Count ≤ Target (n = 40)

| | |
|---|---|
| **Topic** | Meet in the Middle |
| **Difficulty** | Medium |
| **Pattern** | sorted half sums + two pointers |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Two Pointers](../../../06_Two_Pointers/README.md) |
| **Source** | Original exercise |
| **Solution file** | [02_subset_sum_count_at_most.js](../solutions/02_subset_sum_count_at_most.js) — open only after a real attempt |

## Problem

You are given up to 40 integers (they may be negative, and up to 10^9 in size) and a target `T`.
Count how many of the 2^n subsets — including the empty subset — have a sum that is **at most** `T`.

## Examples

```
nums=[1,2,3], T=3    Output: 5    ({}, {1}, {2}, {3}, {1,2})
nums=[-5,10], T=0    Output: 2    ({}, {-5})
nums=[], T=-1        Output: 0    (the empty subset has sum 0, which is > -1)
```

## Constraints & clarifying questions

```
- 0 <= n <= 40, |nums[i]| <= 1e9, |T| <= 4e10
- Does the empty subset count? (yes)
- Equal values at different indices are different subsets.
- The answer can be up to 2^40 — still exact in a JS number.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** n = 40 with huge values: DP over sums is impossible, 2^40 is too slow. That's the meet-in-the-middle signal.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Solve it for n = 20 by looping over all bitmasks. Now imagine doing that on each half separately.

</details>

<details><summary>Hint 3</summary>

**The key idea.** With both halves' sums sorted, count pairs `l + r <= T` with two pointers: walk `l` upward and move a pointer into `R` downward; for each `l`, everything at or below the pointer works.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Duplicate sums must stay in the lists. You can get sorted lists without calling sort by merging `cur` with `cur + x` after each element.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n · n) time, O(1) space

Loop `mask` from 0 to 2^n − 1, add the chosen values, compare with `T`.

### APPROACH 2 — Optimal (meet in the middle + two pointers)   O(2^(n/2)) time and space

```
L = sorted subset sums of left half   (merge trick)
R = sorted subset sums of right half
j = last index of R, count = 0
for l in L (ascending):
    while j >= 0 and l + R[j] > T: j--
    count += j + 1
```

Dry run `nums=[1,2,3], T=3`: L = [0,1], R = [0,2,3,5].
`l=0`: drop 5, j points at 3 → add 3. `l=1`: drop 3, j points at 2 → add 2. Total 5.

### Edge cases

```
- empty array -> 1 if T >= 0 else 0
- all negative values and a huge T -> 2^n
```

### Common mistakes

- De-duplicating sums (you undercount).
- Pairing every l with every r — back to 2^n.

Full JavaScript solution with tests: [02_subset_sum_count_at_most.js](../solutions/02_subset_sum_count_at_most.js).

</details>

## Related follow-ups

- Count subsets with sum exactly T (CSES 1628 "Meet in the Middle")
- Count subsets with sum in a range [lo, hi] (= count(≤ hi) − count(≤ lo − 1))
- The k-th smallest subset sum (binary search on the answer + this counter)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
