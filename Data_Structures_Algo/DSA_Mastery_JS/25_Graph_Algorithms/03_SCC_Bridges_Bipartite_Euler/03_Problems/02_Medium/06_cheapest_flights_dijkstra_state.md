# Cheapest Flights Within K Stops

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Medium |
| **Pattern** | Dijkstra on (city, stops) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #787 — https://leetcode.com/problems/cheapest-flights-within-k-stops/ (same problem as the Shortest Paths version, solved with Dijkstra on state) |
| **Solution file** | [06_cheapest_flights_dijkstra_state.js](../solutions/06_cheapest_flights_dijkstra_state.js) — open only after a real attempt |

## Problem

Same as 25_Graph_Algorithms/01_Shortest_Paths/problems/02: n cities, directed flights [from, to, price],
cheapest route from src to dst with at most k stops, or -1.
This time we solve it as a STATE-SPACE shortest path to show the technique.

## Examples

```
Input: n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1
Output: 700
Input: n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1   Output: 200
```

## Constraints & clarifying questions

```
- Why does plain Dijkstra on cities fail? Because "popped = final" ignores that a
  slightly costlier route to a city may have used FEWER stops and therefore lead to a
  valid (cheaper overall) route later. The fix: make the state (city, stopsUsed).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dijkstra on (city, stops)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (BFS by levels = Bellman-Ford in disguise)   O(k * E). Level i of the BFS = routes with i flights.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dijkstra over (city, stops))   O(E * k log(E * k)) worst case. heap entries: [price, city, stopsUsed] pruning: bestStops[city] = fewest stops with which we have popped this city.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- src === dst -> 0
- k = 0 -> direct flights only
- unreachable -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (BFS by levels = Bellman-Ford in disguise)   O(k * E)

```
Level i of the BFS = routes with i flights. Keep best price per city per level.
Shown as `bfsLevelsVersion`.
```

### APPROACH 2 — Optimal (Dijkstra over (city, stops))   O(E * k log(E * k)) worst case

```
heap entries: [price, city, stopsUsed]
  pruning: bestStops[city] = fewest stops with which we have popped this city. If we
  pop a city with MORE stops than before, that state is dominated (the earlier pop was
  cheaper AND used fewer stops) - skip it. Otherwise relax every outgoing flight if
  stopsUsed <= k.
The first time dst is popped, its price is minimal among valid routes.

Dry run n=3, [[0,1,100],[1,2,100],[0,2,500]], k=1:
  heap [(0, city0, stops 0)]
  pop (0,0,0): push (100,1,1), (500,2,1)
  pop (100,1,1): stops 1 <= k so can fly: push (200,2,2)
  pop (200,2,2): dst -> 200
```

### Edge cases

```
- src === dst -> 0
- k = 0 -> direct flights only
- unreachable -> -1
```

Full JavaScript solution with tests: [06_cheapest_flights_dijkstra_state.js](../solutions/06_cheapest_flights_dijkstra_state.js). Run it with `node 06_cheapest_flights_dijkstra_state.js` from the solutions folder.

</details>

## Common mistakes

- Keeping only `best[city]`; the state is (city, flightsUsed), so a pricier arrival with fewer flights must still be explored.
- Off-by-one between stops and flights (k stops = k + 1 flights).
- Stopping when dst is first PUSHED rather than first POPPED.

## Related follow-ups

- [Cheapest Flights Within K Stops (Bellman-Ford)](../../../01_Shortest_Paths/03_Problems/02_Medium/02_cheapest_flights_within_k_stops.md)
- [Shortest Path in a Grid with Obstacles Elimination](../../../01_Shortest_Paths/03_Problems/03_Hard/09_shortest_path_with_obstacles_elimination.md)
- [Network Delay Time](../../../01_Shortest_Paths/03_Problems/02_Medium/01_network_delay_time.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
