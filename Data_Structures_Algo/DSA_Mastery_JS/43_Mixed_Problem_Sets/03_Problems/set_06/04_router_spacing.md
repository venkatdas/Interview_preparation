# Router Spacing

| | |
|---|---|
| **Set** | [Mixed Set 06](README.md) — problem 04 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [04_router_spacing.js](solutions/04_router_spacing.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A long corridor has candidate mounting points at integer `positions` (distinct, not
sorted). You must install exactly k routers (2 <= k <= positions.length) on k different
points. To reduce interference, maximize the smallest distance between any two routers.
Return that maximum possible smallest distance.

## Examples

```
Input: positions = [1, 2, 8, 4, 9], k = 3   Output: 3   Explanation: 1, 4, 8 (or 1, 4, 9)
Input: positions = [5, 1], k = 2            Output: 4
Input: positions = [0, 10, 20, 30], k = 4   Output: 10
```

## Constraints & clarifying questions

```
- Up to 10^5 positions in [0, 10^9]. Distinct? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Sorting + binary search on the answer + greedy placement. See [Searching / Binary Search](../../../10_Searching/README.md), [Greedy](../../../28_Greedy_Algorithms/README.md) and [Sorting](../../../11_Sorting/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Try every combination of k points (only for tiny n).

</details>

<details><summary>Hint 3</summary>

**The key idea.** For a fixed distance d, placing each router as early as possible is optimal. "Can we place k with gap ≥ d?" is monotonic in d.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = n -> the smallest adjacent gap
- k = 2 -> max - min
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(C(n, k) * k) time

```
Sort, try every combination of k points, take the best minimum gap.
```

### APPROACH 2 — Optimal (sort + binary search on the answer + greedy placement)   O(n log n + n log(range)) time, O(1) extra

```
Check(d): can k routers be placed with every gap >= d? Greedy: put one at the first
point, then always at the next point that is >= last + d. Placing as early as possible
never hurts later choices, so greedy finds the maximum count. Check is monotonic
(true for small d, false for large) -> binary search the largest true d.

Dry run on sorted [1, 2, 4, 8, 9], k = 3 (lo=1, hi=8):
  d=5: 1, 8 -> only 2   false -> hi=4
  d=3: 1, 4, 8 -> 3     true  -> lo=3  (mid computed as upper middle)
  d=4: 1, 8 -> 2        false -> hi=3
  answer 3
```

### Edge cases

```
- k = n -> the smallest adjacent gap
- k = 2 -> max - min
```

### Common mistakes

```
- Lower middle with lo = mid: infinite loop. Use mid = (lo + hi + 1) >> 1 when searching for the last true.
- Forgetting to sort.
```

Full JavaScript solution with tests: [04_router_spacing.js](solutions/04_router_spacing.js). Run it with `node solutions/04_router_spacing.js` from this folder.

</details>

## Related follow-ups

- Points are on a circle
- Minimize the maximum gap instead
- Two kinds of routers with different spacing rules

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
