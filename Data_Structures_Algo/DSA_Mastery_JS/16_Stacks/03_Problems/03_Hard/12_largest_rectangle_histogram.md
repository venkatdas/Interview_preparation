# Largest Rectangle in Histogram

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Hard |
| **Pattern** | monotonic stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #84 — https://leetcode.com/problems/largest-rectangle-in-histogram/ |
| **Solution file** | [12_largest_rectangle_histogram.js](../solutions/12_largest_rectangle_histogram.js) — open only after a real attempt |

## Problem

Given bar heights (each bar has width 1), return the area of the largest
rectangle that fits entirely inside the histogram.

## Examples

```
Input: [2,1,5,6,2,3]   Output: 10   Explanation: bars 5 and 6 -> height 5, width 2
Input: [2,4]           Output: 4
Input: [1,1,1,1]       Output: 4    Explanation: height 1, width 4
```

## Constraints & clarifying questions

```
- Can heights be 0? (yes - a 0 bar splits the histogram)
- Empty array -> 0?
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

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every bar i, extend left and right while the neighbours are >= heights[i].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (monotonic increasing stack)   O(n) time, O(n) space. Same idea as the brute force - every rectangle is "some bar as the shortest bar, extended as far as it can go" - but compute the extents in one pass.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all equal heights -> height * n
- strictly increasing / decreasing
- zeros inside
- single bar
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every bar i, extend left and right while the neighbours are >= heights[i].
The rectangle with bar i as its SHORTEST bar has area heights[i] * width.
Take the max over all i.
```

### APPROACH 2 — Optimal (monotonic increasing stack)   O(n) time, O(n) space

```
Same idea as the brute force - every rectangle is "some bar as the shortest
bar, extended as far as it can go" - but compute the extents in one pass.
Keep a stack of indices with INCREASING heights. When the current bar is
SHORTER than the top, the top bar can't extend further right, so its
rectangle is finished:
  height = heights[popped]
  right boundary = i (exclusive)
  left boundary  = new stack top (exclusive), or -1 if the stack is empty
  width = i - leftBoundary - 1
Append a sentinel height 0 at the end to flush the whole stack.

Dry run on [2,1,5,6,2,3] + sentinel 0:
  i=0 h=2  push              [0]
  i=1 h=1  1<2: pop 0, width = 1-(-1)-1 = 1, area 2 ; push   [1]
  i=2 h=5  push              [1,2]
  i=3 h=6  push              [1,2,3]
  i=4 h=2  2<6: pop 3, width = 4-2-1 = 1, area 6
           2<5: pop 2, width = 4-1-1 = 2, area 10  <- best
           push              [1,4]
  i=5 h=3  push              [1,4,5]
  i=6 h=0  pop 5 (w=1,a=3), pop 4 (w=6-1-1=4,a=8), pop 1 (w=6-(-1)-1=6,a=6)
  answer 10
```

### Edge cases

```
- all equal heights -> height * n
- strictly increasing / decreasing
- zeros inside
- single bar
```

Full JavaScript solution with tests: [12_largest_rectangle_histogram.js](../solutions/12_largest_rectangle_histogram.js). Run it with `node 12_largest_rectangle_histogram.js` from the solutions folder.

</details>

## Common mistakes

- Computing width as `i - top` instead of `i - newTop - 1` after popping.
- Forgetting a sentinel (height 0) at the end, leaving bars unprocessed.
- O(n²) expand-from-each-bar on large inputs.

## Related follow-ups

- [Maximal Rectangle](../../../18_Monotonic_Stacks_And_Queues/03_Problems/03_Hard/05_maximal_rectangle.md) (18_Monotonic_Stacks_And_Queues)
- [Largest Rectangle in Histogram](../../../18_Monotonic_Stacks_And_Queues/03_Problems/03_Hard/04_largest_rectangle_in_histogram.md) (18_Monotonic_Stacks_And_Queues)
- [Trapping Rain Water](13_trapping_rain_water.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
