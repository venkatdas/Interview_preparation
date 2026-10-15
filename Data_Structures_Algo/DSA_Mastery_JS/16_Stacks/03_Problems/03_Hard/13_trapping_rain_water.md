# Trapping Rain Water

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Hard |
| **Pattern** | monotonic stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #42 — https://leetcode.com/problems/trapping-rain-water/ |
| **Solution file** | [13_trapping_rain_water.js](../solutions/13_trapping_rain_water.js) — open only after a real attempt |

## Problem

Given an elevation map (bar heights, width 1 each), compute how much water
is trapped after it rains.

## Examples

```
Input: [0,1,0,2,1,0,1,3,2,1,2,1]   Output: 6
Input: [4,2,0,3,2,5]               Output: 9
Input: [3,0,2]                     Output: 2
```

## Constraints & clarifying questions

```
- Heights are non-negative integers? (yes)
- Water above a bar is bounded by the tallest bar on its left AND right? (yes:
  water at i = min(maxLeft, maxRight) - height[i], if positive)
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

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each bar, scan left for the max and scan right for the max, then add min(maxLeft, maxRight) - height[i].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (monotonic decreasing stack, fill "valleys" horizontally)   O(n) time, O(n) space. Think of water in horizontal LAYERS instead of vertical columns.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- fewer than 3 bars -> 0
- monotonic (always rising or falling) -> 0
- flat ground -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each bar, scan left for the max and scan right for the max, then add
min(maxLeft, maxRight) - height[i]. Correct, slow.
```

### APPROACH 2 — Optimal (monotonic decreasing stack, fill "valleys" horizontally)   O(n) time, O(n) space

```
Think of water in horizontal LAYERS instead of vertical columns.
Keep a stack of indices with DECREASING heights (the left walls of possible
valleys). When the current bar is taller than the top:
  bottom = pop          (the floor of the valley)
  if the stack is now empty there is no left wall -> stop
  leftWall = new top
  width  = i - leftWall - 1
  height = min(heights[leftWall], heights[i]) - heights[bottom]
  water += width * height
Keep popping while the current bar is taller (it may close several layers).

Dry run on [3,0,2,0,4]:
  i=0 h=3 push               [0]
  i=1 h=0 push               [0,1]
  i=2 h=2  2>0: pop 1 (bottom h=0). left=0. width=2-0-1=1, height=min(3,2)-0=2 -> +2
           2<3 stop. push    [0,2]
  i=3 h=0 push               [0,2,3]
  i=4 h=4  4>0: pop 3 (h=0). left=2. width=1, height=min(2,4)-0=2 -> +2  (total 4)
           4>2: pop 2 (h=2). left=0. width=4-0-1=3, height=min(3,4)-2=1 -> +3  (total 7)
           4>3: pop 0. stack empty -> stop. push [4]
  answer 7

(The two-pointer O(1) space solution lives in 06_Two_Pointers. Both are worth knowing.)
```

### Edge cases

```
- fewer than 3 bars -> 0
- monotonic (always rising or falling) -> 0
- flat ground -> 0
```

Full JavaScript solution with tests: [13_trapping_rain_water.js](../solutions/13_trapping_rain_water.js). Run it with `node 13_trapping_rain_water.js` from the solutions folder.

</details>

## Common mistakes

- Counting water at the edges, where it always spills out.
- Using `max(left, right)` instead of `min(left, right) - height`.
- Forgetting the bounded width in the stack version (`i - left - 1`).

## Related follow-ups

- [Largest Rectangle in Histogram](12_largest_rectangle_histogram.md)
- Container With Most Water (LeetCode #11)
- Trapping Rain Water II (LeetCode #407)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
