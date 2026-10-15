# Mock Interview Set 05 — Intervals & Dynamic Programming

**Time:** 60 minutes total. Problem 1: 20 min. Problem 2: 35 min. 5 min to review.
**Covers:** [`31_Intervals`](../31_Intervals/README.md), [`29_Dynamic_Programming/02_Knapsack`](../29_Dynamic_Programming/02_Knapsack/README.md)
**When:** end of week 10 (12-week plan) or end of week 4 (4-week plan)

**Rules**

- Timer on. For the DP problem, write the recurrence on paper before any code.
- Brute force first, then name the pattern.
- Open the Hints only when the problem's time is half gone and you have nothing.

---

## Problem 1 — Merge Intervals (LeetCode 56, Medium) — 20 min

**Links:** [LeetCode #56](https://leetcode.com/problems/merge-intervals/) · [curriculum statement + hints](../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md) (open after the mock)

Given an array of intervals `[start, end]`, merge all overlapping intervals and return the result.

```
Input: [[1,3], [2,6], [8,10], [15,18]]   Output: [[1,6], [8,10], [15,18]]
Input: [[1,4], [4,5]]                    Output: [[1,5]]     (touching counts as overlapping)
Input: [[1,4], [2,3]]                    Output: [[1,4]]     (one inside another)
```

**Clarifying questions you should ask**

- Are the intervals sorted? (no)
- Do touching intervals (`[1,4]` and `[4,5]`) merge? (yes)
- Can `start > end` happen? (no)

<details>
<summary>Hints</summary>

1. Brute force: compare every pair, merge, repeat until nothing changes. O(n^2) or worse. Say it.
2. Sort by start. Then overlaps are always with the **last merged** interval.
3. For each interval: if `current.start <= last.end`, set `last.end = max(last.end, current.end)`; else push `current`.
4. The `max` matters for the "one inside another" case.

</details>

**Expected complexity:** O(n log n) time (sort), O(n) space for the output (O(1) extra if you merge in place).

**Follow-up questions an interviewer may ask**

- Insert a new interval into an already-sorted, non-overlapping list (57). Can you do it in one pass without re-sorting?
- Minimum number of meeting rooms needed (253). (sort starts and ends separately, or min-heap of end times)
- Intervals arrive as a stream; maintain merged intervals (352). (sorted structure, in JS a sorted array with binary search)
- How do you prove sorting by start is enough? (after sorting, anything that overlaps `last` must start before `last.end`)

---

## Problem 2 — Coin Change (LeetCode 322, Medium) — 35 min

**Links:** [LeetCode #322](https://leetcode.com/problems/coin-change/) · [curriculum statement + hints](../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/04_coin_change_min_coins.md) (open after the mock)

Given `coins` (distinct positive integers) and an `amount`, return the **fewest** coins needed to make `amount`.
You have unlimited coins of each kind. Return `-1` if it cannot be made.

```
Input: coins = [1, 2, 5], amount = 11   Output: 3   (5 + 5 + 1)
Input: coins = [2],       amount = 3    Output: -1
Input: coins = [1],       amount = 0    Output: 0
```

**Clarifying questions you should ask**

- Can I reuse a coin? (yes, unlimited)
- Is greedy (take the biggest coin first) correct? (no: coins = [1, 3, 4], amount = 6 -> greedy gives 4+1+1 = 3 coins, best is 3+3 = 2)
- Size? (amount up to 10^4, up to 12 coins; O(amount * coins) is fine)

<details>
<summary>Hints</summary>

1. Brute force: recursion `minCoins(amount) = 1 + min over coins of minCoins(amount - coin)`. Exponential because subproblems repeat.
2. "Minimum" + "choices at each step" + "unlimited reuse" -> unbounded knapsack DP.
3. State: `dp[a]` = fewest coins to make amount `a`. Base: `dp[0] = 0`. Fill `a` from 1 to amount: `dp[a] = min(dp[a - coin] + 1)` for every coin that fits.
4. Initialize with `Infinity`; the answer is `dp[amount] === Infinity ? -1 : dp[amount]`.
5. Dry-run `coins = [1, 2, 5]`, amount 0..6 on paper: `0 1 1 2 2 1 2`.

</details>

**Expected complexity:** O(amount * coins) time, O(amount) space.

**Follow-up questions an interviewer may ask**

- Count the number of **ways** to make the amount (Coin Change II, 518). Why must the coin loop be the outer loop there?
- Return the actual coins used, not just the count. (keep a `parent[a]` = coin chosen)
- Top-down with memo vs bottom-up: when would you pick each? (memo when the state space is sparse; tabulation when every state is needed)
- When is greedy correct for coin change? (canonical coin systems like [1, 5, 10, 25]; in general it is not)

---

## Self-review (5 min)

- [ ] I remembered the `max` when extending `last.end`.
- [ ] I gave a counter-example for greedy before doing DP.
- [ ] I wrote the DP state, transition, base case and answer location before coding.
- [ ] I dry-ran the DP table on a small example.
- [ ] I finished both problems within time.

Write 3 lines: what went well, what went wrong, what to review next.
