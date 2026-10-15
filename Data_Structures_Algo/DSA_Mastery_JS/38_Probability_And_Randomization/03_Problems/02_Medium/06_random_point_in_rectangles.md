# Random Point in Non-overlapping Rectangles

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | weighted pick by point count |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #497 — https://leetcode.com/problems/random-point-in-non-overlapping-rectangles/ (statement paraphrased, not copied) |
| **Solution file** | [06_random_point_in_rectangles.js](../solutions/06_random_point_in_rectangles.js) — open only after a real attempt |

## Problem

You get a list of non-overlapping axis-aligned rectangles. Each is `[a, b, x, y]`: bottom-left corner (a, b), top-right corner (x, y). Implement `pick()`, which returns an **integer** point `[u, v]` inside or on the border of one of the rectangles, so that every integer point covered by the rectangles is equally likely.

## Examples

```
rects = [[-2, -2, 1, 1], [2, 2, 4, 6]]
first rectangle: 4 x 4 = 16 integer points, second: 3 x 5 = 15
pick() -> [1, -2], [3, 5], ...  each of the 31 points with probability 1/31
```

## Constraints & clarifying questions

```
- Borders count? (yes: width = x - a + 1, height = y - b + 1)
- Can a rectangle be a single point or a line? (yes)
- Coordinates up to 1e9 -> you cannot list all points
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Two-stage pick: choose a rectangle *by weight*, then a point inside it uniformly. Re-read Random Pick with Weight and section 5.6 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** List every integer point in one big array and pick a random index. Correct for tiny inputs; why does it fail for big coordinates?

</details>

<details><summary>Hint 3</summary>

**The key idea.** Weight each rectangle by its number of integer points, (x - a + 1) * (y - b + 1), not by area and not equally. Draw an integer r in [0, total), binary-search the rectangle, and turn the leftover offset into (column, row) with % and /.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** A 1x1 rectangle has area 0 but 1 point. Negative coordinates are just offsets from (a, b).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Enumerate all points)   O(P) build and space, O(1) per pick

```
Push every integer point of every rectangle into an array; return a random one.
P can reach 1e18 for large rectangles, so this is only a reference.
```

### APPROACH 2 — Optimal (Weighted pick by point count)   O(n) build, O(log n) per pick, O(n) space

```
count[i] = (x - a + 1) * (y - b + 1)
prefix sums over counts, total = last prefix
r = floor(rng() * total)
i = first prefix > r
off = r - prefix[i-1]
u = a + off % width,  v = b + floor(off / width)
```

### Dry run

```
rects [[-2,-2,1,1],[2,2,4,6]] -> counts [16, 15], prefix [16, 31], r = 20
  first prefix > 20 is index 1
  off = 20 - 16 = 4, width = 3
  u = 2 + 4 % 3 = 3, v = 2 + floor(4/3) = 3 -> [3, 3]
```

### Complexity

- Brute force: O(P) build and space, O(1) per pick
- Optimal: O(n) build, O(log n) per pick, O(n) space

### Edge cases

```
- single-point rectangle -> always that point
- one rectangle -> plain uniform pick in a grid
- integer r is essential so offsets map to exact cells
```

### Common mistakes

- Picking a rectangle uniformly (small rectangles get over-picked).
- Weighting by area (x - a) * (y - b): ignores border points; degenerate rectangles get 0.
- Picking u and v with floating randoms then rounding: border cells get half the chance.

Full JavaScript solution with tests: [06_random_point_in_rectangles.js](../solutions/06_random_point_in_rectangles.js). Run it with `node 06_random_point_in_rectangles.js` from the solutions folder.

</details>

## Related follow-ups

- Random Pick with Weight (LeetCode 528)
- Generate Random Point in a Circle (LeetCode 478)
- Random Flip Matrix (LeetCode 519)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
