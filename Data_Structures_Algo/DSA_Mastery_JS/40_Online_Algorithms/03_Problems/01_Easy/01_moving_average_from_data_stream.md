# Moving Average from Data Stream

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Easy |
| **Pattern** | fixed window, circular buffer + running sum |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #346 — https://leetcode.com/problems/moving-average-from-data-stream/ |
| **Solution file** | [01_moving_average_from_data_stream.js](../solutions/01_moving_average_from_data_stream.js) — open only after a real attempt |

## Problem

Create an object with a window size. Every call `next(val)` feeds one more number from a
stream and must return the average of the most recent `size` numbers. If fewer than `size`
numbers have arrived yet, average all of them.

## Examples

```
size = 3
next(1)  -> 1
next(10) -> 5.5        (1 + 10) / 2
next(3)  -> 4.66667    (1 + 10 + 3) / 3
next(5)  -> 6          (10 + 3 + 5) / 3   the 1 left the window
```

## Constraints & clarifying questions

```
- size >= 1, values can be negative integers
- up to 10^4 calls; return a floating-point number
- Ask: should memory stay O(size)? (yes, that is the point of a stream)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** A *fixed-size sliding window* over a stream. Re-read "Moving averages" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Store every value and sum the last `size` of them on each call: O(size) per call and O(n) memory.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Keep a running `sum`. When a value leaves the window, subtract it; when one enters, add it. A circular buffer of length `size` tells you which value leaves: the one in the slot you are about to overwrite.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Divide by the number of values seen so far (not by `size`) until the window fills. `size = 1` returns the latest value.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Push every value into an array. On each call take the last `size` values and sum them.
O(size) per call, O(n) memory that never shrinks.

### Optimized approach

Circular buffer + running sum, O(1) per call, O(size) memory.
```
if window full: sum -= buf[head]      // value being evicted
buf[head] = val; sum += val
head = (head + 1) % size
return sum / count
```

### Dry run

```
size = 3
call  val  buf        head  count  sum  return
1     1    [1,_,_]    1     1      1    1
2     10   [1,10,_]   2     2      11   5.5
3     3    [1,10,3]   0     3      14   4.667
4     5    [5,10,3]   1     3      18   6
```

### Complexity

O(1) time per `next`, O(size) space.

### Edge cases

- fewer values than `size`
- `size = 1`
- negative values

### Common mistakes

- Dividing by `size` before the window is full.
- Using `array.shift()` as the eviction: O(size) per call.
- Floating drift is negligible here, but for very long streams with huge values you can recompute the sum occasionally.

Full JavaScript solution with tests: [01_moving_average_from_data_stream.js](../solutions/01_moving_average_from_data_stream.js). Run it with `node 01_moving_average_from_data_stream.js` from the solutions folder.

</details>

## Related follow-ups

- Sliding Window Maximum (LeetCode #239)
- Exponential moving average (see `Ema` in streaming.js)
- Design Hit Counter (problem 04)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
