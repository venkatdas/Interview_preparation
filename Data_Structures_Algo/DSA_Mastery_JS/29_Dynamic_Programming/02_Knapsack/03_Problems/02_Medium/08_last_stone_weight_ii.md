# Last Stone Weight II

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | subset sum closest to half |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1049 — https://leetcode.com/problems/last-stone-weight-ii/ |
| **Solution file** | [08_last_stone_weight_ii.js](../solutions/08_last_stone_weight_ii.js) — open only after a real attempt |

## Problem

You have stones with positive weights. Repeatedly pick ANY two stones x <= y
and smash them: if x == y both vanish, otherwise a stone of weight y - x
remains. Return the SMALLEST possible weight of the last stone (0 if none).

## Examples

```
Input: [2,7,4,1,8,1]   Output: 1
  Explanation: 2,4->2 | 7,8->1 | 2,1->1 | 1,1->0 | 1 left
Input: [31,26,33,21,40]   Output: 5
```

## Constraints & clarifying questions

```
- Do we choose which stones to smash? (yes - that is the difference from
  "Last Stone Weight I", which forces the two heaviest and is a heap problem)
- Weights are positive ints, small total (<= 3000 on LeetCode)?
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *subset sum closest to half* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Key insight: any sequence of smashes assigns a + or - sign to every stone, and the result is |sum(plus) - sum(minus)|.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (subset sum closest to total/2)   O(n * total) time, O(total) space. Split stones into two piles S1 and S2, answer = S1 - S2 with S1 >= S2.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single stone -> its weight
- all stones equal and an even count -> 0
- empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Key insight: any sequence of smashes assigns a + or - sign to every stone,
and the result is |sum(plus) - sum(minus)|. So try every sign assignment and
take the smallest non-negative result.
```

### APPROACH 2 — DP (subset sum closest to total/2)   O(n * total) time, O(total) space

```
Split stones into two piles S1 and S2, answer = S1 - S2 with S1 >= S2.
To minimise S1 - S2 = total - 2*S2 we want S2 as large as possible but
at most total/2. So: find the largest reachable subset sum <= total/2.
```

### DP definition

```
STATE      dp[s] = can some subset of the stones seen so far weigh exactly s
RECURRENCE dp[s] = dp[s] || dp[s - stone]   (s downward, each stone once)
BASE CASES dp[0] = true
ANSWER     total - 2 * (largest s &lt;= total/2 with dp[s] true)
Dry run: [2,7,4,1,8,1], total 23, half 11
  reachable sums <= 11 after all stones include 11 (2+8+1 or 7+4)
  best S2 = 11 -> answer 23 - 22 = 1
```

### Edge cases

```
- single stone -> its weight
- all stones equal and an even count -> 0
- empty -> 0
```

Full JavaScript solution with tests: [08_last_stone_weight_ii.js](../solutions/08_last_stone_weight_ii.js). Run it with `node 08_last_stone_weight_ii.js` from the solutions folder.

</details>

## Common mistakes

- Simulating with a heap (that is Last Stone Weight I) instead of seeing the two-groups subset sum.
- Searching for sums up to `total` instead of `floor(total / 2)`.
- Answering `total - best` instead of `total - 2 * best`.

## Related follow-ups

- [Minimum Subset Sum Difference](09_minimum_subset_sum_difference.md)
- [Partition Equal Subset Sum](03_subset_sum_partition_equal.md)
- [Target Sum](07_target_sum.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
