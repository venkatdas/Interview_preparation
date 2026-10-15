# Counting Bits

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Easy |
| **Pattern** | DP on bits |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #338 — https://leetcode.com/problems/counting-bits/ |
| **Solution file** | [09_counting_bits.js](../solutions/09_counting_bits.js) — open only after a real attempt |

## Problem

Given n, return an array ans of length n+1 where ans[i] is the number of
1 bits in the binary representation of i.

## Examples

```
Input: n = 2   Output: [0,1,1]
Input: n = 5   Output: [0,1,1,2,1,2]   Explanation: 0=0b0, 1=0b1, 2=0b10, 3=0b11, 4=0b100, 5=0b101
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^5
- Follow-up: can you do it in O(n) without using a built-in popcount? (that's the DP)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DP on bits* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) time, O(1) extra space. For each i, count bits by repeatedly checking i & 1 and shifting.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Alternative recurrence   O(n) time, O(n) space. dp[i] = dp[i & (i-1)] + 1  (i & (i-1) removes the lowest set bit).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> [0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) time, O(1) extra space

```
For each i, count bits by repeatedly checking i & 1 and shifting.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space

```
bits(i) = bits(i >> 1) + (i & 1), cached.
```

### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, n = 7:
  i      : 0  1  2  3  4  5  6  7
  i >> 1 : -  0  1  1  2  2  3  3
  i & 1  : -  1  0  1  0  1  0  1
  dp     : 0  1  1  2  1  2  2  3
```

### APPROACH 4 — Alternative recurrence   O(n) time, O(n) space

```
dp[i] = dp[i & (i-1)] + 1  (i & (i-1) removes the lowest set bit).
Same complexity, different "previous state". Both are valid DP on bits.
```

### DP definition

```
STATE:       dp[i] = number of 1 bits in i
RECURRENCE:  dp[i] = dp[i >> 1] + (i & 1)
(drop the last bit: i >> 1 is a smaller number we already solved;
              add 1 if the dropped bit was a 1)
BASE CASES:  dp[0] = 0
ANSWER:      the whole dp array
```

### Edge cases

```
- n = 0 -> [0]
```

Full JavaScript solution with tests: [09_counting_bits.js](../solutions/09_counting_bits.js). Run it with `node 09_counting_bits.js` from the solutions folder.

</details>

## Common mistakes

- Returning an array of length n instead of n + 1 (the answer includes 0 and n).
- Counting bits of every number from scratch, which is O(n log n) instead of the O(n) DP.
- Mixing up `i >> 1` (drop the last bit) with `i & (i - 1)` (drop the lowest set bit); both work but need different "+1" rules.

## Related follow-ups

- [Fibonacci Number](01_fibonacci_number.md)
- Number of 1 Bits (LeetCode 191)
- [Count Numbers with Unique Digits](../../../06_Advanced_DP/03_Problems/02_Medium/01_count_numbers_with_unique_digits.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
