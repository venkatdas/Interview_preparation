# K Closest Points to Origin

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | top K (max-heap size k) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #973 — https://leetcode.com/problems/k-closest-points-to-origin/ |
| **Solution file** | [04_k_closest_points.js](../solutions/04_k_closest_points.js) — open only after a real attempt |

## Problem

Given points [[x, y], ...] and an integer k, return the k points closest to
(0, 0) by Euclidean distance. Any order is accepted.

## Examples

```
Input: points = [[1,3],[-2,2]], k = 1          Output: [[-2,2]]
  Explanation: dist^2: (1,3) -> 10, (-2,2) -> 8, so (-2,2) is closer
Input: points = [[3,3],[5,-1],[-2,4]], k = 2   Output: [[3,3],[-2,4]]
```

## Constraints & clarifying questions

```
- Is the answer unique? (yes, guaranteed) Order matters? (no)
- Can I compare squared distances? (yes: sqrt is monotonic, skip it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *top K (max-heap size k)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space. Sort all points by squared distance and take the first k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (MAX-heap of size k)   O(n log k) time, O(k) space. "k closest" = "k smallest distances".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = n -> return everything
- points at the origin (distance 0)
- ties in distance (any of the tied points is fine)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space

```
Sort all points by squared distance and take the first k.
```

### APPROACH 2 — Optimal (MAX-heap of size k)   O(n log k) time, O(k) space

```
"k closest" = "k smallest distances". Keep a MAX-heap of the k closest seen
so far: its top is the FARTHEST of the candidates, the one to evict when a
closer point arrives. This is the mirror of problem 01 (min-heap for k largest).
Rule to remember: top K largest -> min-heap, top K smallest -> max-heap.

Dry run on [[3,3],[5,-1],[-2,4]], k = 2  (dist^2: 18, 26, 20):
  push (3,3):18          heap = {18}
  push (5,-1):26         heap = {26,18}
  push (-2,4):20 -> size 3 -> pop farthest 26 -> heap = {20,18}
  answer = [[3,3],[-2,4]]
```

### Edge cases

```
- k = n -> return everything
- points at the origin (distance 0)
- ties in distance (any of the tied points is fine)
```

Full JavaScript solution with tests: [04_k_closest_points.js](../solutions/04_k_closest_points.js). Run it with `node 04_k_closest_points.js` from the solutions folder.

</details>

## Common mistakes

- Taking `Math.sqrt` (unnecessary; compare squared distances).
- Using a min-heap of all points instead of a max-heap of size k.
- Expecting a particular output order when any order is allowed.

## Related follow-ups

- [Kth Largest Element in an Array](01_kth_largest_element.md)
- [Top K Frequent Elements](05_top_k_frequent_elements.md)
- Find K Closest Elements (LeetCode #658)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
