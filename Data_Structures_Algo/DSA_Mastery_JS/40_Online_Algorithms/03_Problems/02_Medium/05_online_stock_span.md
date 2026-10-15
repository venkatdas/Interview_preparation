# Online Stock Span

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Medium |
| **Pattern** | monotonic stack with absorbed counts |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #901 — https://leetcode.com/problems/online-stock-span/ |
| **Solution file** | [05_online_stock_span.js](../solutions/05_online_stock_span.js) — open only after a real attempt |

## Problem

Daily stock prices arrive one at a time. `next(price)` returns today's span: the number of
consecutive days, ending today and counting today, on which the price was less than or equal
to today's price.

## Examples

```
prices: 100  80  60  70  60  75  85
spans:    1   1   1   2   1   4   6
```

## Constraints & clarifying questions

```
- prices are positive integers, up to 10^4 calls
- equal prices are included in the span (<=)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Previous greater element" in a stream -> *monotonic stack*. See [18_Monotonic_Stacks_And_Queues](../../../18_Monotonic_Stacks_And_Queues/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Store all prices and walk backwards from today while the price is <= today's.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Once today's price beats an older day, that older day can never be the day that stops a future span — today stops it first. So pop it and absorb its span into today's. Store [price, span] pairs.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Increasing prices (span grows every day), equal prices (pop them), the very first day (span 1).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Walk backwards each call. O(n) per call, O(n^2) total on an increasing series.

### Optimized approach

Stack of [price, span] with strictly decreasing prices. O(1) amortised per call.
```
span = 1
while top.price <= price: span += pop().span
push([price, span]); return span
```

### Dry run

```
price  pops          span  stack
100    -             1     [100:1]
80     -             1     [100:1, 80:1]
60     -             1     [.., 60:1]
70     60:1          2     [.., 80:1, 70:2]
60     -             1     [.., 70:2, 60:1]
75     60:1, 70:2    4     [100:1, 80:1, 75:4]
85     75:4, 80:1    6     [100:1, 85:6]
```

### Complexity

O(1) amortised per call (each price pushed and popped once), O(n) space worst case.

### Edge cases

- strictly increasing
- strictly decreasing (stack keeps everything)
- equal prices

### Common mistakes

- Popping with `<` instead of `<=`.
- Storing only prices and losing the absorbed counts (forces a rescan).

Full JavaScript solution with tests: [05_online_stock_span.js](../solutions/05_online_stock_span.js). Run it with `node 05_online_stock_span.js` from the solutions folder.

</details>

## Related follow-ups

- Daily Temperatures (LeetCode #739)
- Next Greater Element II (LeetCode #503)
- Largest Rectangle in Histogram (LeetCode #84)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
