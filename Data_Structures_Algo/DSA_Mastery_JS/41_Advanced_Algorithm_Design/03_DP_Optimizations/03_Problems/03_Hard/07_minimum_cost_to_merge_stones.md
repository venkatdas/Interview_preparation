# Minimum Cost to Merge Stones

| | |
|---|---|
| **Topic** | DP Optimizations (Advanced) |
| **Difficulty** | Hard |
| **Pattern** | interval DP, Knuth optimization for K = 2 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1000 — https://leetcode.com/problems/minimum-cost-to-merge-stones/ |
| **Solution file** | [07_minimum_cost_to_merge_stones.js](../solutions/07_minimum_cost_to_merge_stones.js) — open only after a real attempt |
| **Interview frequency** | Rare-to-occasional (a famous hard interval DP); the Knuth speed-up itself is competitive-programming only. |

## Problem

There are n piles of stones in a row; pile i has `stones[i]` stones. One move merges
exactly K **consecutive** piles into one pile and costs the total number of stones in those
K piles. Return the minimum total cost to end with a single pile, or -1 if that is impossible.

## Examples

```
Input: stones = [3,2,4,1], K = 2     Output: 20
Input: stones = [3,2,4,1], K = 3     Output: -1   (4 piles -> 2 piles -> stuck)
Input: stones = [3,5,1,2,6], K = 3   Output: 25   ([5,1,2] -> 8 costs 8, then [3,8,6] -> 17 costs 17)
```

## Constraints & clarifying questions

```
- 1 <= n <= 30, 2 <= K <= 30, 1 <= stones[i] <= 100
- When is it possible? Each merge removes K-1 piles -> need (n-1) % (K-1) == 0
- n = 1 -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Interval DP on `[i..j]` with prefix sums. See "Knuth optimization" and the interval-DP prerequisite in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Do K = 2 first: `dp[i][j] = min over m of dp[i][m] + dp[m+1][j] + sum(i..j)`. That is the classic optimal merge.

</details>

<details><summary>Hint 3</summary>

**The key idea.** For general K let `dp[i][j]` be the min cost to squeeze `[i..j]` into as few piles as possible. Split so the left part `[i..m]` becomes exactly one pile: m moves in steps of K-1. Add `sum(i..j)` only when `(j-i) % (K-1) == 0` (then the remaining K piles merge into one).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Return -1 early when `(n-1) % (K-1) != 0`. For K = 2, Knuth's `opt[i][j-1] <= opt[i][j] <= opt[i+1][j]` shrinks the m-loop to O(n²) total.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (every merge order)   exponential time

```
go(row): if one pile -> 0; try every window of K consecutive piles, merge, recurse;
memoise on the row contents. Only for tiny inputs.
```

### APPROACH 2 — Optimal (interval DP with step K-1)   O(n³ / K) time, O(n²) space

```
if (n-1) % (K-1) != 0: return -1
for len in K..n, for i, j = i+len-1:
  dp[i][j] = min over m = i, i+(K-1), ... < j of dp[i][m] + dp[m+1][j]
  if (len-1) % (K-1) == 0: dp[i][j] += sum(i..j)
answer dp[0][n-1]
```

Knuth (K = 2 only): store `opt[i][j]`, loop m in `[opt[i][j-1], opt[i+1][j]]` → O(n²).

Dry run on [3,2,4,1], K = 2 (pre = [0,3,5,9,10]):

```
len 2: dp[0][1]=5, dp[1][2]=6, dp[2][3]=5
len 3: dp[0][2] = min(0+6, 5+0) + 9 = 14
       dp[1][3] = min(0+5, 6+0) + 7 = 12
len 4: dp[0][3] = min(0+12, 5+5, 14+0) + 10 = 20
```

### Complexity

O(n²) intervals × O(n/K) split points = O(n³/K); O(n²) memory. Knuth for K = 2: O(n²).

### Edge cases

```
- n = 1 -> 0
- (n-1) % (K-1) != 0 -> -1
- K = n -> a single merge, cost = total
```

### Common mistakes

- Adding `sum(i..j)` for every interval instead of only when it collapses to one pile.
- Stepping m by 1 for general K (counts impossible pile shapes).

Full JavaScript solution with tests: [07_minimum_cost_to_merge_stones.js](../solutions/07_minimum_cost_to_merge_stones.js). Run it with `node 07_minimum_cost_to_merge_stones.js` from the solutions folder.

</details>

## Related follow-ups

- Minimum Cost to Cut a Stick (LeetCode 1547)
- Burst Balloons (LeetCode 312)
- Optimal Binary Search Tree (classic Knuth example)
- Stone Game VII (LeetCode 1690)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
