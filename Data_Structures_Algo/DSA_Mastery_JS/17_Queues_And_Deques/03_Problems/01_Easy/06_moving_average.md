# Moving Average from Data Stream

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Easy |
| **Pattern** | fixed window + running sum |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #346 — https://leetcode.com/problems/moving-average-from-data-stream/ |
| **Solution file** | [06_moving_average.js](../solutions/06_moving_average.js) — open only after a real attempt |

## Problem

Implement MovingAverage(size) with next(val): add val to the stream and
return the average of the last `size` values.

## Examples

```
MovingAverage(3): next(1) -> 1,  next(10) -> 5.5,  next(3) -> 4.667,  next(5) -> 6
Explanation: (1+10)/2, (1+10+3)/3, (10+3+5)/3
```

## Constraints & clarifying questions

```
- Before the window fills, average over however many values exist? (yes)
- Floating point result is fine? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fixed window + running sum* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (queue + running sum)   O(1) per next, O(size) space. Keep a queue of the last `size` values and the running `sum`.

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- size 1 -> always the latest value
- negative values
- fewer values than size so far
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (queue + running sum)   O(1) per next, O(size) space

```
Keep a queue of the last `size` values and the running `sum`.
  enqueue val, sum += val
  if queue.size > size: sum -= dequeue()
  return sum / queue.size
The sum is updated incrementally: add the newcomer, subtract the one that fell out.

Dry run, size 3: 1, 10, 3, 5
  next 1    queue [1]        sum 1    -> 1
  next 10   queue [1,10]     sum 11   -> 5.5
  next 3    queue [1,10,3]   sum 14   -> 4.667
  next 5    queue [1,10,3,5] -> too big, drop 1: [10,3,5]  sum 18 -> 6

A CircularQueue of capacity `size` works too (fixed memory, no allocation).
```

### NAIVE APPROACH   O(size) per next

```
Keep all values in an array; on each next, slice the last `size` values and
sum them. Re-summing the window every time is wasted work.
```

### Edge cases

```
- size 1 -> always the latest value
- negative values
- fewer values than size so far
```

Full JavaScript solution with tests: [06_moving_average.js](../solutions/06_moving_average.js). Run it with `node 06_moving_average.js` from the solutions folder.

</details>

## Common mistakes

- Re-summing the whole window each call (O(size)).
- Dividing by `size` before the window is full instead of the current count.
- Integer division by accident in other languages (JS divides as floats).

## Related follow-ups

- [Number of Recent Calls](05_number_of_recent_calls.md)
- [Design Circular Queue](../02_Medium/03_design_circular_queue.md)
- Maximum Average Subarray I (LeetCode #643)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
