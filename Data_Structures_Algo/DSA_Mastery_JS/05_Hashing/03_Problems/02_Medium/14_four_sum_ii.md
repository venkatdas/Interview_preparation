# 4Sum II

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Medium |
| **Pattern** | counting pairs |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #454 — https://leetcode.com/problems/4sum-ii/ |
| **Solution file** | [14_four_sum_ii.js](../solutions/14_four_sum_ii.js) — open only after a real attempt |

## Problem

Given four integer arrays nums1, nums2, nums3, nums4 all of length n, return the number
of tuples (i, j, k, l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] === 0.

## Examples

```
Input: [1,2], [-2,-1], [-1,2], [0,2]   Output: 2
  Explanation: (0,0,0,1): 1 + -2 + -1 + 2 = 0 and (1,1,0,0): 2 + -1 + -1 + 0 = 0
Input: [0], [0], [0], [0]              Output: 1
```

## Constraints & clarifying questions

```
- Count tuples of INDICES (so duplicate values count separately)? (yes)
- n up to 200 -> O(n^4) = 1.6 * 10^9 is too slow, O(n^2) = 40,000 is instant
- Negative numbers? (yes, sums can be anything)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting pairs* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^4) time, O(1) space. Four nested loops.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (counting pairs, "meet in the middle" with a Map)   O(n^2) time, O(n^2) space. Split the four arrays into two halves: 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All zeros -> n^4 tuples
- No valid tuples -> 0
- Duplicate values across arrays are counted per index
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^4) time, O(1) space

```
Four nested loops. Only for tiny inputs / checking the optimal one in tests.
```

### APPROACH 2 — Optimal (counting pairs, "meet in the middle" with a Map)   O(n^2) time, O(n^2) space

```
Split the four arrays into two halves:
  1. Count every sum a + b (a from nums1, b from nums2) in a Map: sum -> occurrences.
  2. For every c + d (c from nums3, d from nums4), we need a + b = -(c + d).
     Add map.get(-(c + d)) to the answer.
Two O(n^2) passes instead of one O(n^4) pass. Same trick as Two Sum, one level up.

Dry run on [1,2], [-2,-1], [-1,2], [0,2]:
  pair sums of nums1+nums2: 1-2=-1, 1-1=0, 2-2=0, 2-1=1 -> map {-1:1, 0:2, 1:1}
  nums3+nums4: -1+0=-1 need 1 -> 1; -1+2=1 need -1 -> 1; 2+0=2 need -2 -> 0; 2+2=4 need -4 -> 0
  total 2
```

### Edge cases

```
- All zeros -> n^4 tuples
- No valid tuples -> 0
- Duplicate values across arrays are counted per index
```

Full JavaScript solution with tests: [14_four_sum_ii.js](../solutions/14_four_sum_ii.js). Run it with `node 14_four_sum_ii.js` from the solutions folder.

</details>

## Common mistakes

- Trying all four nested loops (O(n^4)).
- Storing pair sums in a Set instead of a count map, losing how many pairs give each sum.
- Confusing it with 4Sum, which uses one array and asks for distinct quadruplets.

## Related follow-ups

- [Two Sum](../01_Easy/01_two_sum.md) — the complement lookup at its simplest
- [4Sum](../../../06_Two_Pointers/03_Problems/02_Medium/15_four_sum.md) — one array, sort and two pointers
- [Closest Subsequence Sum](../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/03_Problems/03_Hard/09_closest_subsequence_sum.md) — meet in the middle at scale

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
