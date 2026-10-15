# Trapping Rain Water

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Hard |
| **Pattern** | opposite ends + running max |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #42 — https://leetcode.com/problems/trapping-rain-water/ |
| **Solution file** | [12_trapping_rain_water.js](../solutions/12_trapping_rain_water.js) — open only after a real attempt |

## Problem

Given an elevation map (array of non-negative bar heights, each of width 1), compute
how much water it can trap after raining.

## Examples

```
Input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]   Output: 6
Input: [4, 2, 0, 3, 2, 5]                     Output: 9
```

## Constraints & clarifying questions

```
- Non-negative integers? (yes)
- Fewer than 3 bars? (can't trap anything -> 0)
- O(1) space required? (follow-up; the two-pointer version delivers it)

The key formula: water above bar i = min(maxLeftOf(i), maxRightOf(i)) - height[i]
(clamped at 0). Water is held by the tallest wall on each side; the lower of the two
sets the level.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *opposite ends + running max* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each i, scan left for the max and scan right for the max, apply the formula.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers with running maxes)   O(n) time, O(1) space. Keep leftMax (tallest seen from the left) and rightMax (tallest seen from the right).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Fewer than 3 bars -> 0
- Monotonic (always rising or falling) -> 0
- All equal -> 0
- Deep single pit: [5, 0, 5] -> 5
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each i, scan left for the max and scan right for the max, apply the formula.
(Precomputing leftMax[] and rightMax[] arrays gives O(n) time with O(n) space; that is
the "prefix max" idea from 08_Prefix_Sums_And_Difference_Arrays. We go one step further below.)
```

### APPROACH 2 — Optimal (two pointers with running maxes)   O(n) time, O(1) space

```
Keep leftMax (tallest seen from the left) and rightMax (tallest seen from the right).
If height[left] < height[right], then rightMax >= height[right] > height[left], so for
position `left` the RIGHT side is guaranteed to have a wall at least as tall as
leftMax... more precisely: the water level at `left` is min(leftMax, trueRightMax), and
trueRightMax >= height[right] >= height[left]. Whatever the true right max is, if
leftMax <= height[right] the level is leftMax. So we can settle `left` using leftMax
alone: water += leftMax - height[left]. Then left++. Symmetric for the right side.
Each step settles one bar permanently -> O(n).

Dry run on [4, 2, 0, 3, 2, 5]:
  L=0 R=5 leftMax=4 rightMax=5: h[L]=4 < h[R]=5 -> settle L: 4-4=0, L=1
  L=1 h=2 < 5 -> leftMax=4, water += 4-2=2, L=2
  L=2 h=0 < 5 -> water += 4-0=4 (total 6), L=3
  L=3 h=3 < 5 -> water += 4-3=1 (total 7), L=4
  L=4 h=2 < 5 -> water += 4-2=2 (total 9), L=5
  L=5 == R -> stop. 9
```

### Edge cases

```
- Fewer than 3 bars -> 0
- Monotonic (always rising or falling) -> 0
- All equal -> 0
- Deep single pit: [5, 0, 5] -> 5
```

Full JavaScript solution with tests: [12_trapping_rain_water.js](../solutions/12_trapping_rain_water.js). Run it with `node 12_trapping_rain_water.js` from the solutions folder.

</details>

## Common mistakes

- Using the taller side to decide which pointer to move; move the side with the smaller max.
- Forgetting that water at a bar is `min(maxLeft, maxRight) - height`, and can be 0 but never negative.
- Counting water above the first and last bars.

## Related follow-ups

- [Container With Most Water](../02_Medium/11_container_with_most_water.md) — one container, not all bars
- [Product of Array Except Self](../../../03_Arrays/03_Problems/02_Medium/08_product_of_array_except_self.md) — left pass and right pass
- Trapping Rain Water II (LeetCode #407) — the 2D version with a heap

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
