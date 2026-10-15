# Minimum Cost to Cut a Stick

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Hard |
| **Pattern** | sentinels + split on cut |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1547 — https://leetcode.com/problems/minimum-cost-to-cut-a-stick/ |
| **Solution file** | [05_minimum_cost_to_cut_a_stick.js](../solutions/05_minimum_cost_to_cut_a_stick.js) — open only after a real attempt |

## Problem

A wooden stick of length n is labelled from 0 to n. You are given an array cuts of
positions where you must cut. The cost of one cut equals the CURRENT length of the
stick piece being cut. You may perform the cuts in any order. Return the minimum
total cost.

## Examples

```
Input: n = 7, cuts = [1, 3, 4, 5]   Output: 16
  Explanation: order [3, 5, 1, 4] costs 7 + 4 + 3 + 2 = 16. Order [1,3,4,5] costs 7+6+4+3 = 20.
Input: n = 9, cuts = [5, 6, 1, 4, 2]   Output: 22
```

## Constraints & clarifying questions

```
- 2 <= n <= 10^6, 1 <= cuts.length <= 100 (so DP is on the CUTS, not on n)
- Cuts are distinct and strictly inside (0, n).
- Is cuts sorted? (not necessarily; we sort it ourselves)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sentinels + split on cut* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(m! ) time worst, O(m) space. For the piece between positions a and b, try every cut inside it as the FIRST cut: pay (b - a), then recurse on both halves.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / Tabulation (Interval DP with sentinels)   O(m^3) time, O(m^2) space. Sort the cuts and add sentinels 0 and n at both ends: points = [0, ...sorted cuts, n] Now every stick piece is described by two indices (l, r) into `points`, and the piece has length points[r] - points[l].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- One cut -> cost n
- Two cuts -> n + (the longer of the two sides) ... whichever order is cheaper
- Unsorted cuts input
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(m! ) time worst, O(m) space

```
For the piece between positions a and b, try every cut inside it as the FIRST cut:
pay (b - a), then recurse on both halves. Each level tries all remaining cuts.
```

### APPROACH 2 — Memo / Tabulation (Interval DP with sentinels)   O(m^3) time, O(m^2) space

```
Sort the cuts and add sentinels 0 and n at both ends:
  points = [0, ...sorted cuts, n]
Now every stick piece is described by two indices (l, r) into `points`, and the
piece has length points[r] - points[l]. All cuts strictly between them are
points[l+1..r-1].

  STATE      dp[l][r] = min cost to perform all cuts strictly between points[l] and points[r]
  RECURRENCE dp[l][r] = min over k in (l, r) of
                        dp[l][k] + dp[k][r] + (points[r] - points[l])
             "k is the first cut made in this piece; it costs the full piece length,
              then the two halves are independent sticks"
             (Here 'first' works because the cost of cut k is the piece length, which is
              fixed once the piece [l, r] exists -- the order inside halves doesn't change it.)
  BASE CASES dp[l][r] = 0 when r - l <= 1   (no cut between neighbours)
  ANSWER     dp[0][m+1]

Dry run on n = 7, cuts = [1, 3, 4, 5]:  points = [0, 1, 3, 4, 5, 7]
  len 2 (adjacent): all 0
  len 3: dp[0][2] = 3 (piece 0..3, one cut)   dp[1][3] = 3   dp[2][4] = 2   dp[3][5] = 3
  len 4: dp[0][3] = min(k=1: 0+3+4, k=2: 3+0+4) = 7
         dp[1][4] = min(k=2: 0+2+4, k=3: 3+0+4) = 6
         dp[2][5] = min(k=3: 0+3+4, k=4: 2+0+4) = 6
  len 5: dp[0][4] = min(k=1: 0+6+5, k=2: 3+2+5, k=3: 7+0+5) = 10
         dp[1][5] = min(k=2: 0+6+6, k=3: 3+3+6, k=4: 6+0+6) = 12
  len 6: dp[0][5] = min(k=1: 0+12+7, k=2: 3+6+7, k=3: 7+3+7, k=4: 10+0+7) = 16
```

### Edge cases

```
- One cut -> cost n
- Two cuts -> n + (the longer of the two sides) ... whichever order is cheaper
- Unsorted cuts input
```

Full JavaScript solution with tests: [05_minimum_cost_to_cut_a_stick.js](../solutions/05_minimum_cost_to_cut_a_stick.js). Run it with `node 05_minimum_cost_to_cut_a_stick.js` from the solutions folder.

</details>

## Common mistakes

- Building the DP over every position 0..n (n can be 10^6); build it over the sorted cut positions plus the two ends.
- Forgetting to sort the cuts and add the sentinels 0 and n.
- Adding the cost of the cut itself instead of the length of the current piece `cuts[j] - cuts[i]`.

## Related follow-ups

- [Matrix Chain Multiplication](../02_Medium/02_matrix_chain_multiplication.md)
- [Burst Balloons](06_burst_balloons.md)
- Minimum Cost to Merge Stones (LeetCode #1000)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
