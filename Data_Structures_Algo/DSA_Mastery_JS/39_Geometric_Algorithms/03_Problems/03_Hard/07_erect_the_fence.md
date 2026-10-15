# Erect the Fence

| | |
|---|---|
| **Topic** | Geometric Algorithms |
| **Difficulty** | Hard |
| **Pattern** | convex hull (monotone chain, keep collinear) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #587 — https://leetcode.com/problems/erect-the-fence/ |
| **Solution file** | [07_erect_the_fence.js](../solutions/07_erect_the_fence.js) — open only after a real attempt |

## Problem

Trees stand at integer coordinates. Fence them all with the shortest possible rope.
Return the trees that lie ON the fence (the convex hull), INCLUDING trees that sit on a
straight edge of the fence. Any order is accepted.

## Examples

```
Input: [[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]   Output: [[1,1],[2,0],[3,3],[2,4],[4,2]]
  (2,2) is strictly inside and is left out
Input: [[1,2],[2,2],[4,2]]   Output: [[1,2],[2,2],[4,2]]   (all collinear -> all on the fence)
```

## Constraints & clarifying questions

```
- Up to 3000 points -> O(n^3) brute force is too slow; O(n log n) expected
- Points are distinct
- Collinear boundary points must be INCLUDED (this is what makes the problem "hard")
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *convex hull (monotone chain, keep collinear)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time. A point p is on the hull iff there is another point q such that every other point lies on one side of (or on) the line pq.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Andrew's monotone chain, keeping collinear points)   O(n log n). Sort points by x then y.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- fewer than 3 points -> all of them
- all collinear -> all of them
- a point strictly inside -> excluded
- duplicate points in the input (dedupe first to be safe)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time

```
A point p is on the hull iff there is another point q such that every other point lies
on one side of (or on) the line pq. Test every pair with cross products.
```

### APPROACH 2 — Optimal (Andrew's monotone chain, keeping collinear points)   O(n log n)

```
Sort points by x then y. Build the LOWER hull left to right: push each point, and while
the last two points plus the new one make a CLOCKWISE turn (cross < 0) pop the middle
one. Build the UPPER hull right to left the same way. Using "cross < 0" instead of
"cross <= 0" keeps collinear points. Concatenate the chains and remove duplicates
(the two endpoints appear in both chains; a fully collinear set appears twice).

Dry run on [[1,2],[2,2],[4,2]] (all collinear):
  lower: push (1,2), push (2,2), (4,2): cross((1,2),(2,2),(4,2)) = 0, not < 0 -> keep -> [(1,2),(2,2),(4,2)]
  upper (right to left): [(4,2),(2,2),(1,2)]
  union, deduped -> all three
```

### Edge cases

```
- fewer than 3 points -> all of them
- all collinear -> all of them
- a point strictly inside -> excluded
- duplicate points in the input (dedupe first to be safe)
```

Full JavaScript solution with tests: [07_erect_the_fence.js](../solutions/07_erect_the_fence.js). Run it with `node 07_erect_the_fence.js` from the solutions folder.

</details>

## Common mistakes

- Popping collinear boundary points (`cross <= 0`); this problem wants trees on the fence edges kept (`cross < 0`).
- Returning duplicates when all points are collinear, because the lower and upper chains contain the same points.
- Forgetting to sort points by x then y before building the chains.

## Related follow-ups

- [Max Points on a Line](06_max_points_on_a_line.md)
- Convex Polygon (LeetCode #469)
- [Sorting](../../../11_Sorting/README.md) (the hull is sort + stack)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
