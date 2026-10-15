# Number of Longest Increasing Subsequence

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | LIS with length + count |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #673 — https://leetcode.com/problems/number-of-longest-increasing-subsequence/ |
| **Solution file** | [04_number_of_longest_increasing_subsequence.js](../solutions/04_number_of_longest_increasing_subsequence.js) — open only after a real attempt |

## Problem

Given an integer array nums, return the NUMBER of longest strictly increasing
subsequences.

## Examples

```
Input: [1,3,5,4,7]   Output: 2   Explanation: [1,3,4,7] and [1,3,5,7]
Input: [2,2,2,2,2]   Output: 5   Explanation: length is 1, and there are 5 of them
```

## Constraints & clarifying questions

```
- Strictly increasing? (yes)
- Can the count overflow? (LeetCode guarantees it fits in a 32-bit int)
- Empty array? (return 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *LIS with length + count* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Enumerate every subsequence (take / skip), keep only increasing ones, track the max length and how many reach it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (memo / tabulation)   O(n^2) time, O(n) space. Same as LIS but every state carries TWO numbers.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- all equal -> n (each element is its own LIS of length 1)
- strictly increasing -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Enumerate every subsequence (take / skip), keep only increasing ones, track the
max length and how many reach it.
```

### APPROACH 2 — DP (memo / tabulation)   O(n^2) time, O(n) space

```
Same as LIS but every state carries TWO numbers.
```

### DP definition

```
STATE      length[i] = length of the longest increasing subsequence ending at i
count[i]  = how many increasing subsequences of that length end at i
RECURRENCE for each j &lt; i with nums[j] &lt; nums[i]:
if length[j] + 1 > length[i]: length[i] = length[j] + 1, count[i] = count[j]
             else if length[j] + 1 === length[i]: count[i] += count[j]
BASE CASES length[i] = 1, count[i] = 1

ANSWER     sum of count[i] over all i where length[i] === max length
Table for [1, 3, 5, 4, 7]:
  i       : 0  1  2  3  4
  nums    : 1  3  5  4  7
  length  : 1  2  3  3  4
  count   : 1  1  1  1  2      i=4: from j=2 (len 3) count 1, from j=3 (len 3) count +1 -> 2
  max length 4, total count = 2

The `memo` version returns a pair {length, count} for "best subsequence that
ends at index i" and sums counts at the end.
```

### Edge cases

```
- [] -> 0
- all equal -> n (each element is its own LIS of length 1)
- strictly increasing -> 1
```

Full JavaScript solution with tests: [04_number_of_longest_increasing_subsequence.js](../solutions/04_number_of_longest_increasing_subsequence.js). Run it with `node 04_number_of_longest_increasing_subsequence.js` from the solutions folder.

</details>

## Common mistakes

- On finding a longer chain, adding to `count[i]` instead of resetting it to `count[j]`.
- Summing counts of every index instead of only those whose length equals the global maximum.
- Initialising `count[i] = 0`; every single element is one subsequence of length 1, so start at 1.

## Related follow-ups

- [Longest Increasing Subsequence](03_longest_increasing_subsequence.md)
- [Number of LIS with a segment tree](../../../../34_Range_Query_Data_Structures/01_Segment_Tree/03_Problems/02_Medium/05_number_of_longest_increasing_subsequence.md)
- [Russian Doll Envelopes](../03_Hard/14_russian_doll_envelopes.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
