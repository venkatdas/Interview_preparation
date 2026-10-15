# Online Stock Span

| | |
|---|---|
| **Topic** | Monotonic Stacks and Queues |
| **Difficulty** | Medium |
| **Pattern** | stack of (price, span) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #901 — https://leetcode.com/problems/online-stock-span/ |
| **Solution file** | [01_online_stock_span.js](../solutions/01_online_stock_span.js) — open only after a real attempt |

## Problem

Prices arrive one per day. The span of today's price is the number of consecutive days
ending today (including today) whose price was <= today's price. Implement next(price)
that returns the span.

## Examples

```
next(100) -> 1, next(80) -> 1, next(60) -> 1, next(70) -> 2, next(60) -> 1,
next(75) -> 4 (75, 60, 70, 60), next(85) -> 6
```

## Constraints & clarifying questions

```
- Up to 10^4 calls -> O(n) per call is accepted but O(1) amortized is expected
- Equal prices count toward the span (<=)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *stack of (price, span)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per call, O(n) space. Store every price.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Monotonic stack of (price, span))   O(1) amortized per call. Keep a stack where prices are strictly DECREASING from bottom to top.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- strictly increasing prices -> spans 1, 2, 3, ... (stack has one element)
- strictly decreasing prices -> all spans 1
- equal prices -> spans grow
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per call, O(n) space

```
Store every price. Walk backwards while prices are <= today's.
```

### APPROACH 2 — Optimal (Monotonic stack of (price, span))   O(1) amortized per call

```
Keep a stack where prices are strictly DECREASING from bottom to top. For a new price,
pop every entry with price <= today's and add their spans to today's span (those days are
"absorbed": any future price that beats today also beats them, so they never need to be
looked at again). Push (price, span).

Dry run: 100, 80, 60, 70, 60, 75, 85
  100: stack [(100,1)]                                  -> 1
  80:  stack [(100,1),(80,1)]                           -> 1
  60:  stack [(100,1),(80,1),(60,1)]                    -> 1
  70:  pop (60,1): span 2; stack [(100,1),(80,1),(70,2)] -> 2
  60:  stack [..., (70,2), (60,1)]                      -> 1
  75:  pop (60,1) -> 2, pop (70,2) -> 4; stack [(100,1),(80,1),(75,4)] -> 4
  85:  pop (75,4) -> 5, pop (80,1) -> 6; stack [(100,1),(85,6)]          -> 6
```

### Edge cases

```
- strictly increasing prices -> spans 1, 2, 3, ... (stack has one element)
- strictly decreasing prices -> all spans 1
- equal prices -> spans grow
```

Full JavaScript solution with tests: [01_online_stock_span.js](../solutions/01_online_stock_span.js). Run it with `node 01_online_stock_span.js` from the solutions folder.

</details>

## Common mistakes

- Popping only strictly smaller prices; equal prices must also be absorbed (span counts "≤ today").
- Recomputing the span by walking back day by day (O(n) per call).
- Forgetting to add the popped spans to the new span.

## Related follow-ups

- [Daily Temperatures](../../../16_Stacks/03_Problems/02_Medium/05_daily_temperatures.md) (16_Stacks)
- [Next Greater Element I & II](../../../16_Stacks/03_Problems/01_Easy/06_next_greater_element.md) (16_Stacks)
- [Sum of Subarray Minimums](03_sum_of_subarray_minimums.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
