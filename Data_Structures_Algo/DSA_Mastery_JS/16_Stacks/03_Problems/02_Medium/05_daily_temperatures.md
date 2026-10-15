# Daily Temperatures

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | monotonic stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #739 — https://leetcode.com/problems/daily-temperatures/ |
| **Solution file** | [05_daily_temperatures.js](../solutions/05_daily_temperatures.js) — open only after a real attempt |

## Problem

Given an array of daily temperatures, return an array where answer[i] is the
number of days you have to wait after day i for a warmer temperature.
If no warmer day exists, answer[i] = 0.

## Examples

```
Input: [73,74,75,71,69,72,76,73]   Output: [1,1,4,2,1,1,0,0]
Input: [30,40,50,60]               Output: [1,1,1,0]
Input: [30,60,90]                  Output: [1,1,0]
```

## Constraints & clarifying questions

```
- "Warmer" means strictly greater? (yes)
- Return distances in days (index difference), not the temperatures? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *monotonic stack* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) extra space. For each day, scan forward until you find a warmer day.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (monotonic decreasing stack of indices)   O(n) time, O(n) space. Walk left to right keeping a stack of indices whose temperatures are DECREASING from bottom to top.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- strictly decreasing input -> all zeros
- equal temperatures are NOT warmer (use strict <)
- single element -> [0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) extra space

```
For each day, scan forward until you find a warmer day. Worst case (decreasing
temperatures) scans the whole rest of the array for every day.
```

### APPROACH 2 — Optimal (monotonic decreasing stack of indices)   O(n) time, O(n) space

```
Walk left to right keeping a stack of indices whose temperatures are
DECREASING from bottom to top. These are the days still "waiting" for a
warmer day. When the current day is warmer than the top of the stack, that
day's wait is over: answer[top] = i - top. Pop and keep checking.
Each index is pushed once and popped at most once -> O(n).

Dry run on [73,74,75,71,69,72,76,73]:
  i=0 73   push            stack [0]
  i=1 74   74>73 pop 0 ans[0]=1   push   stack [1]
  i=2 75   75>74 pop 1 ans[1]=1   push   stack [2]
  i=3 71   push            stack [2,3]
  i=4 69   push            stack [2,3,4]
  i=5 72   72>69 pop 4 ans[4]=1 ; 72>71 pop 3 ans[3]=2 ; 72<75 stop ; push   stack [2,5]
  i=6 76   pop 5 ans[5]=1 ; pop 2 ans[2]=4 ; push   stack [6]
  i=7 73   push            stack [6,7]
  leftover indices 6,7 stay 0.
```

### Edge cases

```
- strictly decreasing input -> all zeros
- equal temperatures are NOT warmer (use strict <)
- single element -> [0]
```

Full JavaScript solution with tests: [05_daily_temperatures.js](../solutions/05_daily_temperatures.js). Run it with `node 05_daily_temperatures.js` from the solutions folder.

</details>

## Common mistakes

- Storing temperatures instead of indices, so you cannot compute the number of days.
- Popping on `>=` instead of `>` (equal temperatures are not warmer).
- Double loop that is O(n²) on decreasing input.

## Related follow-ups

- [Next Greater Element I & II](../01_Easy/06_next_greater_element.md)
- [Online Stock Span](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/01_online_stock_span.md) (18_Monotonic_Stacks_And_Queues)
- [Largest Rectangle in Histogram](../03_Hard/12_largest_rectangle_histogram.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
