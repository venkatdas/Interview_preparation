# Find the City With the Smallest Number of Neighbors at a Threshold Distance

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Medium |
| **Pattern** | Floyd-Warshall |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1334 — https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/ |
| **Solution file** | [07_find_the_city.js](../solutions/07_find_the_city.js) — open only after a real attempt |

## Problem

n cities, edges[i] = [u, v, weight] (undirected), and distanceThreshold. For each city
count how many OTHER cities are reachable with total path weight <= threshold. Return
the city with the SMALLEST count; on a tie return the city with the GREATEST index.

## Examples

```
Input: n=4, edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]], threshold=4   Output: 3
Explanation: counts are 0:2 (1,2), 1:3, 2:3, 3:2 (1,2). Tie between 0 and 3 -> 3.
Input: n=5, edges=[[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], threshold=2
Output: 0
```

## Constraints & clarifying questions

```
- n <= 100 -> O(n^3) is only 10^6, so Floyd-Warshall is ideal
- Weights positive? (yes)

We need distances from EVERY city to every other: an all-pairs shortest path problem.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Floyd-Warshall* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (Dijkstra from each city)   O(n * (V + E) log V). Run Dijkstra n times.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal for small n (Floyd-Warshall)   O(n^3) time, O(n^2) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no edges -> every count 0 -> return n - 1 (largest index)
- threshold 0 -> same as no edges
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (Dijkstra from each city)   O(n * (V + E) log V)

```
Run Dijkstra n times. Asymptotically better on sparse graphs, more code.
Shown as `dijkstraVersion`.
```

### APPROACH 2 — Optimal for small n (Floyd-Warshall)   O(n^3) time, O(n^2) space

```
1. dist[i][j] = weight, dist[i][i] = 0, else Infinity.
  2. Triple loop with k outermost.
  3. For each city count dist <= threshold (excluding itself); pick min count, ties ->
     larger index (iterate i ascending and use <= when updating).

Dry run example 1 after Floyd-Warshall:
  dist[0] = [0,3,4,5]  count (<=4, not self) = 2
  dist[1] = [3,0,1,2]  count 3
  dist[2] = [4,1,0,1]  count 3
  dist[3] = [5,2,1,0]  count 2   -> tie with 0, pick 3
```

### Edge cases

```
- no edges -> every count 0 -> return n - 1 (largest index)
- threshold 0 -> same as no edges
```

Full JavaScript solution with tests: [07_find_the_city.js](../solutions/07_find_the_city.js). Run it with `node 07_find_the_city.js` from the solutions folder.

</details>

## Common mistakes

- Putting `k` in an inner loop of Floyd-Warshall; the intermediate node must be the OUTER loop.
- Breaking ties toward the smaller index; the problem wants the LARGEST index among ties.
- Counting the city itself as one of its neighbours.

## Related follow-ups

- [Network Delay Time](01_network_delay_time.md)
- [Evaluate Division](../../../03_SCC_Bridges_Bipartite_Euler/03_Problems/02_Medium/04_evaluate_division.md)
- [Number of Ways to Arrive at Destination](06_number_of_ways_to_arrive_at_destination.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
