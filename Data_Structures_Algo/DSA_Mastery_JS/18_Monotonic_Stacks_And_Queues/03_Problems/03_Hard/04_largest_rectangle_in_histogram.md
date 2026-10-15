# Largest Rectangle in Histogram

| | |
|---|---|
| **Topic** | Monotonic Stacks and Queues |
| **Difficulty** | Hard |
| **Pattern** | boundary arrays and one-pass sentinel |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #84 — https://leetcode.com/problems/largest-rectangle-in-histogram/ |
| **Solution file** | [04_largest_rectangle_in_histogram.js](../solutions/04_largest_rectangle_in_histogram.js) — open only after a real attempt |

## Problem

heights[i] is the height of bar i (width 1). Return the area of the largest rectangle
that fits inside the histogram.

## Examples

```
Input: [2,1,5,6,2,3]   Output: 10   Explanation: bars 5 and 6, height 5, width 2
Input: [2,4]           Output: 4
```

## Constraints & clarifying questions

```
- Heights >= 0; n up to 10^5 -> O(n^2) too slow
- Width of each bar is 1
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *boundary arrays and one-pass sentinel* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every pair (i, j) track the minimum height and compute minHeight * (j - i + 1).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (previous/next smaller arrays, or one-pass monotonic stack)   O(n). The best rectangle uses some bar i at FULL height: it extends left until a strictly lower bar and right until a strictly lower bar.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> 0
- single bar -> its height
- all equal heights -> h * n
- zeros in the middle split the histogram
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every pair (i, j) track the minimum height and compute minHeight * (j - i + 1).
```

### APPROACH 2 — Optimal (previous/next smaller arrays, or one-pass monotonic stack)   O(n)

```
The best rectangle uses some bar i at FULL height: it extends left until a strictly
lower bar and right until a strictly lower bar. So
  area(i) = heights[i] * (nextSmaller[i] - prevSmaller[i] - 1)
Two helper arrays from a monotonic stack give both boundaries in O(n).
One-pass variant: keep an increasing stack of indices; when heights[i] is lower than the
top, pop the top and resolve it right there (its right boundary is i, left boundary is
the new top). A sentinel height 0 at the end flushes everything.

Dry run (one-pass) on [2,1,5,6,2,3] + sentinel 0:
  i=0 (2): push                       stack [0]
  i=1 (1): pop 0: h=2, left=-1, w=1-(-1)-1=1, area 2; push    stack [1]
  i=2 (5): push                       stack [1,2]
  i=3 (6): push                       stack [1,2,3]
  i=4 (2): pop 3: h=6, left=2, w=4-2-1=1, area 6
           pop 2: h=5, left=1, w=4-1-1=2, area 10  <- best
           push                       stack [1,4]
  i=5 (3): push                       stack [1,4,5]
  i=6 (0): pop 5: h=3, w=6-4-1=1 -> 3; pop 4: h=2, left=1, w=6-1-1=4 -> 8;
           pop 1: h=1, left=-1, w=6 -> 6
  answer 10
```

### Edge cases

```
- empty -> 0
- single bar -> its height
- all equal heights -> h * n
- zeros in the middle split the histogram
```

Full JavaScript solution with tests: [04_largest_rectangle_in_histogram.js](../solutions/04_largest_rectangle_in_histogram.js). Run it with `node 04_largest_rectangle_in_histogram.js` from the solutions folder.

</details>

## Common mistakes

- Wrong width after popping (it is `i - newTop - 1`, or `i` if the stack is empty).
- No sentinel at the end, so bars left on the stack are never measured.
- Checking every pair of bars (O(n²)) on large input.

## Related follow-ups

- [Maximal Rectangle](05_maximal_rectangle.md)
- [Largest Rectangle in Histogram](../../../16_Stacks/03_Problems/03_Hard/12_largest_rectangle_histogram.md) (16_Stacks)
- [Trapping Rain Water](../../../06_Two_Pointers/03_Problems/03_Hard/12_trapping_rain_water.md) (06_Two_Pointers)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
