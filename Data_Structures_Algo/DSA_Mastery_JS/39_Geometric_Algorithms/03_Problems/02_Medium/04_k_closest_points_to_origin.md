# K Closest Points to Origin

| | |
|---|---|
| **Topic** | Geometric Algorithms |
| **Difficulty** | Medium |
| **Pattern** | squared distance + quickselect |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #973 — https://leetcode.com/problems/k-closest-points-to-origin/ |
| **Solution file** | [04_k_closest_points_to_origin.js](../solutions/04_k_closest_points_to_origin.js) — open only after a real attempt |

## Problem

Given points [x, y] and an integer k, return the k points closest to the origin (0, 0)
by Euclidean distance. The answer may be in any order.

## Examples

```
Input: points = [[1,3],[-2,2]], k = 1   Output: [[-2,2]]
Input: points = [[3,3],[5,-1],[-2,4]], k = 2   Output: [[3,3],[-2,4]]
```

## Constraints & clarifying questions

```
- Ties: any valid set is accepted (LeetCode guarantees a unique answer)
- n up to 10^4; k <= n
- Compare SQUARED distances: no sqrt, no floating point
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *squared distance + quickselect* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) time. Sort all points by squared distance and take the first k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Quickselect on squared distance)   expected O(n) time, O(1) extra. Partition the points around a random pivot distance so that the k smallest end up in the first k slots (their internal order does not matter).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = n -> all points
- k = 1
- points with equal distances
- the origin itself among the points
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) time

```
Sort all points by squared distance and take the first k.
(A max-heap of size k gives O(n log k): see ../../../19_Heaps_And_Priority_Queues/.)
```

### APPROACH 2 — Optimal (Quickselect on squared distance)   expected O(n) time, O(1) extra

```
Partition the points around a random pivot distance so that the k smallest end up in the
first k slots (their internal order does not matter). Recurse only into the side that
contains the k-th boundary. Expected O(n) total.

Dry run on [[3,3],[5,-1],[-2,4]], k = 2: distances 18, 26, 20
  pivot (say) 20: partition -> [18, 20 | 26]; boundary at index 2 = k -> done
  first two points: [3,3], [-2,4]
```

### Edge cases

```
- k = n -> all points
- k = 1
- points with equal distances
- the origin itself among the points
```

Full JavaScript solution with tests: [04_k_closest_points_to_origin.js](../solutions/04_k_closest_points_to_origin.js). Run it with `node 04_k_closest_points_to_origin.js` from the solutions folder.

</details>

## Common mistakes

- Taking `Math.sqrt` for every point; squared distance keeps the same order and avoids floats.
- Using a min-heap of all n points (O(n log n)) when a max-heap of size k gives O(n log k).
- Quickselect with a fixed first-element pivot, which degrades to O(n^2) on sorted input.

## Related follow-ups

- [Heaps: top-k problems](../../../19_Heaps_And_Priority_Queues/README.md)
- Kth Largest Element in an Array (LeetCode #215)
- Find K Closest Elements (LeetCode #658)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
