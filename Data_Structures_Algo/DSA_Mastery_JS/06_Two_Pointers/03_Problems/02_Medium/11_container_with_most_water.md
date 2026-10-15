# Container With Most Water

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | opposite ends, greedy move |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #11 — https://leetcode.com/problems/container-with-most-water/ |
| **Solution file** | [11_container_with_most_water.js](../solutions/11_container_with_most_water.js) — open only after a real attempt |

## Problem

Given an array height where height[i] is the height of a vertical line at x = i,
pick two lines that together with the x-axis form a container holding the most water.
Return that maximum area. Area = (distance between lines) * min(height of the two lines).

## Examples

```
Input: [1, 8, 6, 2, 5, 4, 8, 3, 7]   Output: 49   Explanation: lines at 1 and 8: (8-1) * min(8,7) = 49
Input: [1, 1]                        Output: 1
```

## Constraints & clarifying questions

```
- At least two lines? (yes)
- Heights non-negative? (yes)
- Can the container be slanted? (no; width * shorter height)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *opposite ends, greedy move* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Try every pair (i, j), compute (j - i) * min(height[i], height[j]), keep the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (opposite ends, always move the SHORTER line)   O(n) time, O(1) space. Start with the widest container (left = 0, right = n - 1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Exactly two lines
- All equal heights -> widest pair wins
- Tallest lines adjacent to each other
- Zero heights
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Try every pair (i, j), compute (j - i) * min(height[i], height[j]), keep the max.
```

### APPROACH 2 — Optimal (opposite ends, always move the SHORTER line)   O(n) time, O(1) space

```
Start with the widest container (left = 0, right = n - 1). The area is limited by the
shorter line. Moving the taller line inward can never help: width shrinks and the
height stays capped by the same shorter line. Moving the SHORTER line inward might
find a taller line, which could beat the lost width. So each step we move the shorter
one. We only ever discard a line that cannot be part of a better answer -> no answer skipped.

Dry run on [1, 8, 6, 2, 5, 4, 8, 3, 7]:
  L=0(1)  R=8(7): area 8*1=8,  best 8,  1 shorter -> L=1
  L=1(8)  R=8(7): area 7*7=49, best 49, 7 shorter -> R=7
  L=1(8)  R=7(3): area 6*3=18,           3 shorter -> R=6
  L=1(8)  R=6(8): area 5*8=40,           tie -> move either, R=5
  L=1(8)  R=5(4): 4*4=16 -> R=4;  L=1 R=4(5): 3*5=15 -> R=3
  L=1 R=3(2): 2*2=4 -> R=2;      L=1 R=2(6): 1*6=6 -> R=1 stop
  best 49
```

### Edge cases

```
- Exactly two lines
- All equal heights -> widest pair wins
- Tallest lines adjacent to each other
- Zero heights
```

Full JavaScript solution with tests: [11_container_with_most_water.js](../solutions/11_container_with_most_water.js). Run it with `node 11_container_with_most_water.js` from the solutions folder.

</details>

## Common mistakes

- Moving the taller line; only moving the shorter one can ever give a larger area.
- Using the sum of heights or the taller height in the area formula; the water level is the shorter line.
- Confusing this with Trapping Rain Water, which counts water above every bar.

## Related follow-ups

- [Trapping Rain Water](../03_Hard/12_trapping_rain_water.md) — water over all bars, not one container
- [Two Sum II - Input Array Is Sorted](03_two_sum_ii_sorted.md) — another converging-pointer elimination argument
- [Largest Rectangle in Histogram](../../../16_Stacks/03_Problems/03_Hard/12_largest_rectangle_histogram.md) — the area question with a stack

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
