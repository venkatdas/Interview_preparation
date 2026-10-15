# Max Points on a Line

| | |
|---|---|
| **Topic** | Geometric Algorithms |
| **Difficulty** | Hard |
| **Pattern** | normalised direction keys per anchor |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #149 — https://leetcode.com/problems/max-points-on-a-line/ |
| **Solution file** | [06_max_points_on_a_line.js](../solutions/06_max_points_on_a_line.js) — open only after a real attempt |

## Problem

Given distinct points with integer coordinates, return the maximum number of points that
lie on the same straight line.

## Examples

```
Input: [[1,1],[2,2],[3,3]]                        Output: 3
Input: [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]      Output: 4
Input: [[0,0]]                                    Output: 1
```

## Constraints & clarifying questions

```
- Up to 300 points -> O(n^2) fine, O(n^3) borderline but okay for a brute force
- Points are distinct (no duplicates to count twice)
- Vertical lines exist -> never compute slope as dy/dx with division
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *normalised direction keys per anchor* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time. For every pair (i, j), count the points k collinear with them using the cross product (x_j - x_i)(y_k - y_i) - (y_j - y_i)(x_k - x_i) === 0.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Anchor + normalised slope counting)   O(n^2) time, O(n) space. For each anchor point i, every other point j defines a direction (dx, dy).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1; n = 2 -> 2
- all points on a vertical line
- negative coordinates (sign normalisation matters)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time

```
For every pair (i, j), count the points k collinear with them using the cross product
(x_j - x_i)(y_k - y_i) - (y_j - y_i)(x_k - x_i) === 0. No division, no floats.
```

### APPROACH 2 — Optimal (Anchor + normalised slope counting)   O(n^2) time, O(n) space

```
For each anchor point i, every other point j defines a direction (dx, dy). Two points
are on the same line through i iff their directions are parallel. Normalise:
  g = gcd(|dx|, |dy|); dx /= g; dy /= g;  then fix the sign so (dx, dy) and (-dx, -dy)
  are the same key (e.g. make dx > 0, or dx === 0 and dy > 0).
Count directions in a Map; the best line through i has (max count + 1) points.
Vertical lines become (0, 1); horizontal (1, 0). Integer keys, exact.

Dry run on [[1,1],[2,2],[3,3]], anchor (1,1):
  (2,2): d = (1,1) -> gcd 1 -> "1,1"
  (3,3): d = (2,2) -> gcd 2 -> "1,1"
  map { "1,1": 2 } -> 2 + 1 = 3
```

### Edge cases

```
- n = 1 -> 1; n = 2 -> 2
- all points on a vertical line
- negative coordinates (sign normalisation matters)
```

Full JavaScript solution with tests: [06_max_points_on_a_line.js](../solutions/06_max_points_on_a_line.js). Run it with `node 06_max_points_on_a_line.js` from the solutions folder.

</details>

## Common mistakes

- Using floating-point slopes as Map keys: vertical lines divide by zero and nearly equal slopes collide or split.
- Not normalising the sign of (dx, dy), so (1, 2) and (-1, -2) become different keys.
- Forgetting that a single point is a line by itself (answer 1 for n = 1).

## Related follow-ups

- [Erect the Fence](07_erect_the_fence.md)
- Check If It Is a Straight Line (LeetCode #1232)
- Number of Boomerangs (LeetCode #447)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
