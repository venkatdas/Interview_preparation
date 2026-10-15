# Russian Doll Envelopes

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Hard |
| **Pattern** | sort + 2D LIS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #354 — https://leetcode.com/problems/russian-doll-envelopes/ |
| **Solution file** | [14_russian_doll_envelopes.js](../solutions/14_russian_doll_envelopes.js) — open only after a real attempt |

## Problem

You are given envelopes[i] = [width, height]. Envelope A fits inside B only if
A's width AND height are both strictly smaller. Return the maximum number of
envelopes you can nest one inside another (no rotation).

## Examples

```
Input: [[5,4],[6,4],[6,7],[2,3]]   Output: 3   Explanation: [2,3] -> [5,4] -> [6,7]
Input: [[1,1],[1,1],[1,1]]         Output: 1
```

## Constraints & clarifying questions

```
- Strictly smaller in both dimensions? (yes; equal width does NOT fit)
- Can we rotate envelopes? (no)
- Empty input? (0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + 2D LIS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Sort by width.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Sort trick + LIS O(n log n)   O(n log n) time, O(n) space. Sort by width ASC, and for equal widths by height DESC.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- all identical -> 1
- same width, growing height -> 1 (width must be strictly smaller)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Sort by width. Then it is LIS with a "fits" comparison: take / skip each envelope,
tracking the last one taken.
```

### APPROACH 2 — DP: 2D LIS   O(n^2) time, O(n) space

```
Sort by width ascending. Now a chain only needs to go left-to-right in the sorted
array AND satisfy strict width and height.
```

### APPROACH 3 — Sort trick + LIS O(n log n)   O(n log n) time, O(n) space

```
Sort by width ASC, and for equal widths by height DESC. Then run plain LIS on
heights only. Why height DESC for ties? Two envelopes with the same width must
never both be chosen; with heights descending, the second one is NOT greater than
the first, so LIS can never pick both. Width is then handled by the sort order.

Sorted: [2,3] [5,4] [6,7] [6,4]  -> heights [3, 4, 7, 4]
  3 -> tails [3];  4 -> [3,4];  7 -> [3,4,7];  4 -> replaces 7 -> [3,4,4]  length 3
```

### DP definition

```
STATE      dp[i] = longest chain ending with envelope i

RECURRENCE dp[i] = 1 + max(dp[j]) for j &lt; i with w[j] &lt; w[i] and h[j] &lt; h[i]

BASE CASES dp[i] = 1

ANSWER     max(dp)
Sorted [[2,3],[5,4],[6,4],[6,7]]:
  i    : 0      1      2      3
  env  : [2,3]  [5,4]  [6,4]  [6,7]
  dp   : 1      2      2      3      ([6,7] fits [5,4] (dp 2) -> 3; not [6,4]: same width)
```

### Edge cases

```
- [] -> 0
- all identical -> 1
- same width, growing height -> 1 (width must be strictly smaller)
```

Full JavaScript solution with tests: [14_russian_doll_envelopes.js](../solutions/14_russian_doll_envelopes.js). Run it with `node 14_russian_doll_envelopes.js` from the solutions folder.

</details>

## Common mistakes

- Sorting both width and height ascending; equal widths then chain illegally. Sort width ascending and height DESCENDING for equal widths.
- Running the O(n^2) LIS on n = 10^5; use the O(n log n) tails + binary search version.
- Allowing equal heights: the doll must be strictly larger in both dimensions.

## Related follow-ups

- [Longest Increasing Subsequence](../02_Medium/03_longest_increasing_subsequence.md)
- Maximum Height by Stacking Cuboids (LeetCode #1691)
- Largest Divisible Subset (LeetCode #368)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
