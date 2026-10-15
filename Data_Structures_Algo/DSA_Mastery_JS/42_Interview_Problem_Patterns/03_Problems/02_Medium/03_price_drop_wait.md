# Price Drop Wait

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Medium |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [03_price_drop_wait.js](../solutions/03_price_drop_wait.js) — open only after a real attempt |

## Problem

`prices[i]` is the price of a gadget on day `i`. For every day, a shopper wants to know how many
days they must wait until the price is **strictly lower** than that day's price. If it never drops,
the answer for that day is `0`. Return the array of waits.

## Examples

```
Input: prices = [50, 55, 45, 60, 40]   Output: [2, 1, 2, 1, 0]
Input: prices = [10, 10, 9]            Output: [2, 1, 0]   (equal is not lower)
Input: prices = [1, 2, 3]              Output: [0, 0, 0]
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^5, prices are positive integers
- "Lower" means strictly lower.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Monotonic stack (next strictly smaller element). Lesson: [Monotonic Stack & Queue](../../01_Concepts/patterns/09_monotonic_stack_and_queue.md).

**Target:** O(n) time, O(n) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "for every day", "until the first later day that is lower". n is 10^5, so scanning right from each day is too slow in the worst case.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: for each i, scan j = i+1, i+2, ... until a lower price. O(n^2) on an increasing array.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Keep a stack of days whose answer is still unknown. When today is lower than the day on top, today **is** that day's answer: pop it and record `i - top`. Repeat, then push today.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Edge cases: equal prices (must not pop each other: use `>`), empty input, days left on the stack at the end keep 0.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

For each i scan forward until prices[j] < prices[i]. O(n^2) time, O(1) extra space.

### APPROACH 2 — Optimal (Monotonic stack (next strictly smaller element))

```
stack of indices, prices non-decreasing bottom -> top
for i: while prices[top] > prices[i]: ans[top] = i - top; pop
       push i
```

### Dry run

```
[50,55,45,60,40]
  i=0 push            stack [0]
  i=1 push            stack [0,1]
  i=2 pop 1 (ans 1), pop 0 (ans 2), push   stack [2]
  i=3 push            stack [2,3]
  i=4 pop 3 (ans 1), pop 2 (ans 2), push   stack [4]
  result [2,1,2,1,0]
```

### Complexity

O(n) time — each index is pushed once and popped at most once. O(n) space.

### Common mistakes

- Popping on `>=`: equal prices would wrongly count as a drop.
- Storing prices instead of indices: you lose the distance.

Full JavaScript solution with tests: [03_price_drop_wait.js](../solutions/03_price_drop_wait.js). Run it with `node 03_price_drop_wait.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../16_Stacks/03_Problems/02_Medium/05_daily_temperatures.md) · [solution](../../../16_Stacks/03_Problems/solutions/05_daily_temperatures.js)
- [statement](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/01_online_stock_span.md) · [solution](../../../18_Monotonic_Stacks_And_Queues/03_Problems/solutions/01_online_stock_span.js)
- Pattern lesson: [Monotonic Stack & Queue](../../01_Concepts/patterns/09_monotonic_stack_and_queue.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
