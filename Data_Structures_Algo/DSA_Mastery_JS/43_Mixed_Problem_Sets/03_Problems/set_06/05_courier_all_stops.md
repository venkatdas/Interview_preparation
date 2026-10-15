# Courier All Stops

| | |
|---|---|
| **Set** | [Mixed Set 06](README.md) — problem 05 of 5 |
| **Difficulty** | Hard |
| **Time box** | 40 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [05_courier_all_stops.js](solutions/05_courier_all_stops.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A city has n junctions (0..n-1) and two-way streets [u, v, minutes]. A courier starts at
junction `start` and must visit every junction listed in `stops` (up to 12 distinct
junctions, any order, passing through other junctions is allowed). The courier does not
need to come back. Return the minimum total minutes, or -1 if some stop is unreachable.

## Examples

```
Input: n = 4, streets = [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 10]], start = 0, stops = [3, 1]
Output: 3   Explanation: 0 -> 1 -> 2 -> 3 (stop 1 on the way)
Input: n = 3, streets = [[0, 1, 4]], start = 0, stops = [2]   Output: -1
Input: n = 2, streets = [], start = 1, stops = []             Output: 0
```

## Constraints & clarifying questions

```
- n up to 10^4, streets up to 5 * 10^4, at most 12 stops.
- Can start itself be a stop? (yes, then it is visited at time 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 40 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Dijkstra from each key point + Held-Karp DP over bitmasks of stops. See [Shortest Paths](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md) and [Advanced DP (bitmask)](../../../29_Dynamic_Programming/06_Advanced_DP/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Compute pairwise shortest distances between start and stops, then try every order of stops.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Only start and the stops matter. dp[mask][last] = cheapest way to visit exactly the stops in mask ending at last.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no stops -> 0
- duplicate stops or start in stops -> dedupe; cost 0 legs are fine
- any unreachable stop -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(s! * s + (s + 1) * E log n) time

```
Dijkstra from start and from every stop to get pairwise distances, then try every order
of the stops (permutations) and sum the legs.
```

### APPROACH 2 — Optimal (Dijkstra from each key point + Held-Karp DP over bitmasks)   O((s + 1) * E log n + 2^s * s^2) time, O(2^s * s) space

```
Same distance table, but instead of every order: dp[mask][last] = cheapest way to start
at `start`, visit exactly the stops in mask, and end at stop `last`.
dp[{i}][i] = dist(start, i); dp[mask | {j}][j] = min(dp[mask][i] + dist(i, j)).
Answer = min over last of dp[full][last]. Orders that share a prefix set and end point
are merged, which is why 2^s * s^2 beats s!.

Dry run on example 1 (stops s0=3, s1=1):
  dist(start=0, 3)=3, dist(0, 1)=1, dist(3, 1)=2
  dp[{s0}][s0]=3, dp[{s1}][s1]=1
  dp[{s0,s1}][s1] = 3 + 2 = 5;  dp[{s0,s1}][s0] = 1 + 2 = 3
  answer min(5, 3) = 3
```

### Edge cases

```
- no stops -> 0
- duplicate stops or start in stops -> dedupe; cost 0 legs are fine
- any unreachable stop -> -1
```

### Common mistakes

```
- Running BFS on a weighted graph.
- Using dp over ALL n junctions as a bitmask (2^n is far too big): only the stops matter.
```

Full JavaScript solution with tests: [05_courier_all_stops.js](solutions/05_courier_all_stops.js). Run it with `node solutions/05_courier_all_stops.js` from this folder.

</details>

## Related follow-ups

- Must return to start (classic TSP)
- Stops have time windows
- Grid with keys and doors (BFS over (cell, keys) states, LeetCode #864)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
