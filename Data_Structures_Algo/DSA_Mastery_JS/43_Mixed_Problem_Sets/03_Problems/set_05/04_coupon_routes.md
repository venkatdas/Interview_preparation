# Coupon Routes

| | |
|---|---|
| **Set** | [Mixed Set 05](README.md) — problem 04 of 5 |
| **Difficulty** | Hard |
| **Time box** | 35 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [04_coupon_routes.js](solutions/04_coupon_routes.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A country has n cities (0..n-1) and two-way roads [u, v, toll]. You travel from src to
dst and own k coupons. A coupon used on a road halves its toll (rounded down:
Math.floor(toll / 2)); at most one coupon per road crossing. Return the minimum total
toll, or -1 if dst is unreachable.

## Examples

```
Input: n = 3, roads = [[0, 1, 10], [1, 2, 10], [0, 2, 25]], src = 0, dst = 2, k = 1   Output: 12   Explanation: 0-2 with coupon
Input: same roads, k = 2   Output: 10   Explanation: 5 + 5
Input: n = 2, roads = [], src = 0, dst = 1, k = 3   Output: -1
```

## Constraints & clarifying questions

```
- n up to 10^4, roads up to 10^5, k up to 10. Tolls non-negative integers.
- src === dst -> 0.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Dijkstra on an expanded state graph (city, coupons used). See [Shortest Paths](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md) and [Heaps](../../../19_Heaps_And_Priority_Queues/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Bellman-Ford style relaxation over states (city, used) until nothing changes.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A path that has used fewer coupons is a different situation. Make (city, used) the node, add a "use coupon" edge, and run Dijkstra.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- src === dst -> 0
- k = 0 -> plain Dijkstra
- unreachable -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k * E * n * k) time (Bellman-Ford style), O(n * k) space

```
dist[node][used]. Relax every road in both directions, with and without a coupon, until
nothing changes.
```

### APPROACH 2 — Optimal (Dijkstra on an expanded state graph (city, coupons used))   O(E * k * log(n * k)) time, O(n * k) space

```
Each state (city, used) has edges to (next, used) at cost toll and to (next, used + 1)
at cost floor(toll / 2) when used < k. All costs are non-negative, so Dijkstra applies.
The answer is the smallest dist[dst][used] over all used (the first time dst pops).

Dry run on example 1 (k = 1):
  pop (0,0) d=0: push (1,0)=10, (1,1)=5, (2,0)=25, (2,1)=12
  pop (1,1) d=5: push (2,1)=min(12, 5+10=15) -> stays 12
  pop (1,0) d=10: (2,0)=20, (2,1)=min(12, 15) -> 12
  pop (2,1) d=12 -> dst reached, answer 12
```

### Edge cases

```
- src === dst -> 0
- k = 0 -> plain Dijkstra
- unreachable -> -1
```

### Common mistakes

```
- Keeping only dist[city]: a path that saved coupons may be worse now but better later.
- Forgetting roads are two-way.
```

Full JavaScript solution with tests: [04_coupon_routes.js](solutions/04_coupon_routes.js). Run it with `node solutions/04_coupon_routes.js` from this folder.

</details>

## Related follow-ups

- At most k stops instead of k coupons (LeetCode #787)
- Coupons make the road free
- Return the route

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
