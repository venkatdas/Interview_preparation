# Gym Passes

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Hard |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [10_gym_passes.js](../solutions/10_gym_passes.js) — open only after a real attempt |

## Problem

You plan to visit a climbing gym on certain days: `days` is sorted ascending with distinct positive
integers. The gym sells passes: `passes[k] = [duration, price]`. A pass bought on day `x` is valid on
days `x, x+1, ..., x+duration-1`. You may buy any number of passes of any type. Return the
**minimum total price** to cover every planned day.

## Examples

```
Input: days = [1, 2, 3, 10], passes = [[1, 4], [3, 9]]          Output: 13  (3-day on day 1, 1-day on day 10)
Input: days = [1, 5, 9], passes = [[1, 4], [7, 10]]             Output: 12  (three 1-day passes)
Input: days = [1, 2, 3, 4, 5, 6, 7], passes = [[1, 4], [7, 10]] Output: 10
Input: days = [], passes = [[1, 4]]                             Output: 0
```

## Constraints & clarifying questions

```
- 0 <= days.length <= 10^5, 1 <= days[i] <= 10^9 (no array indexed by calendar day)
- 1 <= passes.length <= 10, 1 <= duration <= 10^9, 1 <= price <= 10^6
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Dynamic programming over the planned days (+ binary search for the next uncovered day). Lesson: [Dynamic Programming (families)](../../01_Concepts/patterns/17_dynamic_programming_families.md).

**Target:** O(n * p * log n) time, O(n) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 40 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "minimum total price", many overlapping ways to cover the same later days. Try a greedy rule ("cheapest per day") and look for a counterexample.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: on the first uncovered day, try each pass, jump to the first day it does not cover, recurse. Exponential — the same suffix is solved again and again.

</details>

<details><summary>Hint 3</summary>

**The key idea.** State: `dp[i]` = cheapest way to cover `days[i..]`. `dp[i] = min(price + dp[j])` over passes, where `j` is the first index with `days[j] >= days[i] + duration` (binary search). Fill from the back.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** A pass never needs to start on a day you do not visit (shift it to the next planned day). Edge cases: empty days, huge day numbers, one pass type.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

cover(i) tries every pass starting on days[i] and recurses on the first uncovered index, no memo. Exponential.

### APPROACH 2 — Optimal (Dynamic programming over the planned days (+ binary search for the next uncovered day))

```
dp[n] = 0
for i from n-1 down to 0:
  dp[i] = min over (dur, price) of price + dp[lowerBound(days, days[i] + dur)]
answer dp[0]
```

### Dry run

```
days [1,2,3,10], passes [[1,4],[3,9]]
  dp[4]=0
  dp[3] day10: min(4+0, 9+0) = 4
  dp[2] day3:  min(4+4, 9+dp[3]=13) = 8
  dp[1] day2:  min(4+8, 9+dp[3]=13) = 12
  dp[0] day1:  min(4+12, 9+dp[3]=13) = 13
```

### Complexity

O(n * p * log n) time, O(n) space. (A moving pointer per pass makes it O(n * p).)

### Common mistakes

- Allocating `dp` by calendar day: 10^9 entries.
- Greedy by price-per-day: fails on sparse days (example 2).
- Off-by-one in coverage: a pass of duration d covers d days including the start.

Full JavaScript solution with tests: [10_gym_passes.js](../solutions/10_gym_passes.js). Run it with `node 10_gym_passes.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/04_coin_change_min_coins.md) · [solution](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/solutions/04_coin_change_min_coins.js)
- [statement](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/03_Hard/10_maximum_profit_job_scheduling.md) · [solution](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/solutions/10_maximum_profit_job_scheduling.js)
- Pattern lesson: [Dynamic Programming (families)](../../01_Concepts/patterns/17_dynamic_programming_families.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
