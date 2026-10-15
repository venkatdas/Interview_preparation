# Cheapest Flights Within K Stops

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Medium |
| **Pattern** | Bellman-Ford k rounds |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #787 — https://leetcode.com/problems/cheapest-flights-within-k-stops/ |
| **Solution file** | [02_cheapest_flights_within_k_stops.js](../solutions/02_cheapest_flights_within_k_stops.js) — open only after a real attempt |

## Problem

n cities, flights[i] = [from, to, price] (directed). Find the cheapest price from src
to dst using AT MOST k stops (so at most k + 1 flights). Return -1 if impossible.

## Examples

```
Input: n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1
Output: 700   (0 -> 1 -> 3; the cheaper 0 -> 1 -> 2 -> 3 = 400 needs 2 stops)
Input: n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1   Output: 200
Input: same, k=0   Output: 500
```

## Constraints & clarifying questions

```
- "k stops" = k intermediate cities = k + 1 edges? (yes)
- Prices non-negative? (yes)
- Why not plain Dijkstra? Because the cheapest path to an intermediate city may use
  too many stops; Dijkstra's "popped = final" breaks under the stop limit.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Bellman-Ford k rounds* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS all paths up to k+1 edges)   O(n^(k+1)) time. Explore every route with at most k + 1 flights, track the minimum.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Bellman-Ford limited to k + 1 rounds)   O(k * E) time, O(n) space. After i rounds of relaxation, dist[v] = cheapest price using at most i flights.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- src === dst -> 0
- dst unreachable within k -> -1
- k larger than n -> same as unlimited
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS all paths up to k+1 edges)   O(n^(k+1)) time

```
Explore every route with at most k + 1 flights, track the minimum. Exponential.
```

### APPROACH 2 — Optimal (Bellman-Ford limited to k + 1 rounds)   O(k * E) time, O(n) space

```
After i rounds of relaxation, dist[v] = cheapest price using at most i flights.
We want at most k + 1 flights -> run k + 1 rounds. CRUCIAL: relax from a COPY of the
previous round, otherwise one round could chain two flights.

Dry run n=3, flights [[0,1,100],[1,2,100],[0,2,500]], src 0, dst 2, k=1 (2 rounds):
  dist [0, inf, inf]
  round 1 (from copy): 0->1: 100, 0->2: 500          dist [0,100,500]
  round 2 (from copy): 1->2: 100+100 = 200 < 500     dist [0,100,200]
  answer 200.  With k=0 only round 1 runs -> 500.

(Alternative: Dijkstra over state (city, stopsUsed) - see 25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/06.)
```

### Edge cases

```
- src === dst -> 0
- dst unreachable within k -> -1
- k larger than n -> same as unlimited
```

Full JavaScript solution with tests: [02_cheapest_flights_within_k_stops.js](../solutions/02_cheapest_flights_within_k_stops.js). Run it with `node 02_cheapest_flights_within_k_stops.js` from the solutions folder.

</details>

## Common mistakes

- Confusing stops with edges: k stops means at most k + 1 flights (k + 1 relaxation rounds).
- Relaxing in place during a Bellman-Ford round, which lets one round chain several flights; relax from a copy of the previous round.
- Plain Dijkstra that stores only the best price per city: a cheaper path with too many stops can block a valid, slightly pricier one.

## Related follow-ups

- [Cheapest Flights Within K Stops (Dijkstra + state)](../../../03_SCC_Bridges_Bipartite_Euler/03_Problems/02_Medium/06_cheapest_flights_dijkstra_state.md)
- [Network Delay Time](01_network_delay_time.md)
- [Shortest Path in a Grid with Obstacles Elimination](../03_Hard/09_shortest_path_with_obstacles_elimination.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
