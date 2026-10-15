# Counting Bits

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Easy |
| **Pattern** | dp[i] = dp[i >> 1] + (i & 1) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #338 — https://leetcode.com/problems/counting-bits/ |
| **Solution file** | [06_counting_bits.js](../solutions/06_counting_bits.js) — open only after a real attempt |

## Problem

Given n, return an array ans of length n + 1 where ans[i] is the number of 1 bits in i.

## Examples

```
Input: 2   Output: [0,1,1]
Input: 5   Output: [0,1,1,2,1,2]   Explanation: 0,1,10,11,100,101
```

## Constraints & clarifying questions

```
- Can we do better than O(n * 32)? (yes, O(n) with DP)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *dp[i] = dp[i >> 1] + (i & 1)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) time, O(n) space. For every i run Kernighan's popcount.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DP on i >> 1)   O(n) time, O(n) space (the output). i >> 1 is i with its last bit dropped.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> [0]
- n = 1 -> [0,1]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) time, O(n) space

```
For every i run Kernighan's popcount. Fine, but the interviewer wants the DP.
```

### APPROACH 2 — Optimal (DP on i >> 1)   O(n) time, O(n) space (the output)

```
i >> 1 is i with its last bit dropped. So bits(i) = bits(i >> 1) + (i & 1).
i >> 1 < i, so it has already been computed. One addition per number.
(Alternative recurrence: bits(i) = bits(i & (i - 1)) + 1.)

Dry run for n = 5:
  ans[0]=0
  ans[1]=ans[0]+1=1
  ans[2]=ans[1]+0=1
  ans[3]=ans[1]+1=2
  ans[4]=ans[2]+0=1
  ans[5]=ans[2]+1=2  -> [0,1,1,2,1,2]
```

### Edge cases

```
- n = 0 -> [0]
- n = 1 -> [0,1]
```

Full JavaScript solution with tests: [06_counting_bits.js](../solutions/06_counting_bits.js). Run it with `node 06_counting_bits.js` from the solutions folder.

</details>

## Common mistakes

- Calling popcount separately for every number (O(n log n)) when an O(n) recurrence exists.
- Returning an array of length n instead of n + 1 (0..n inclusive).
- Using `i / 2` (float) instead of `i >> 1`.

## Related follow-ups

- [Number of 1 Bits](02_number_of_1_bits.md)
- [Counting Bits](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/01_Easy/09_counting_bits.md) (29_Dynamic_Programming/01_One_Dimensional_DP)
- [Hamming Distance](05_hamming_distance.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
