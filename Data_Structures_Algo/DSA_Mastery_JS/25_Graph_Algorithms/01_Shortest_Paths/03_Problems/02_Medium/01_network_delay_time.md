# Network Delay Time

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Medium |
| **Pattern** | Dijkstra, max of dist |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #743 — https://leetcode.com/problems/network-delay-time/ |
| **Solution file** | [01_network_delay_time.js](../solutions/01_network_delay_time.js) — open only after a real attempt |

## Problem

n nodes labelled 1..n. times[i] = [u, v, w]: a signal sent from u reaches v after w
time units (directed). A signal starts at node k. Return the time until ALL nodes have
received it, or -1 if some node never does.

## Examples

```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2   Output: 2
Input: times = [[1,2,1]], n = 2, k = 1                   Output: 1
Input: times = [[1,2,1]], n = 2, k = 2                   Output: -1
```

## Constraints & clarifying questions

```
- 1-indexed nodes? (yes, allocate n + 1)
- Weights non-negative? (yes, 0 <= w <= 100 -> Dijkstra is safe)
- Directed? (yes)

"Time until all receive" = the LARGEST shortest-path distance from k.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dijkstra, max of dist* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (Bellman-Ford)   O(V * E) time, O(V) space. Relax all edges n - 1 times.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dijkstra)   O((V + E) log V) time, O(V + E) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 0 (k already has it)
- unreachable node -> -1
- parallel edges with different weights -> relaxation picks the smaller
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Bellman-Ford)   O(V * E) time, O(V) space

```
Relax all edges n - 1 times. Works, slower than Dijkstra, but a good sanity check.
```

### APPROACH 2 — Optimal (Dijkstra)   O((V + E) log V) time, O(V + E) space

```
1. Build weighted adjacency list.
  2. Dijkstra from k.
  3. Answer = max(dist[1..n]); if any is Infinity -> -1.

Dry run times [[2,1,1],[2,3,1],[3,4,1]], k=2:
  dist[2]=0, heap [(0,2)]
  pop 2: 1 -> 1, 3 -> 1                  heap [(1,1),(1,3)]
  pop 1: no out-edges;  pop 3: 4 -> 2    heap [(2,4)]
  pop 4: done. dist = [_,1,0,1,2] max 2
```

### Edge cases

```
- n = 1 -> 0 (k already has it)
- unreachable node -> -1
- parallel edges with different weights -> relaxation picks the smaller
```

Full JavaScript solution with tests: [01_network_delay_time.js](../solutions/01_network_delay_time.js). Run it with `node 01_network_delay_time.js` from the solutions folder.

</details>

## Common mistakes

- Returning the distance to one node instead of the MAXIMUM over all nodes (the signal reaches everyone only when the slowest node gets it).
- Forgetting to return -1 when some node stays at Infinity.
- Mixing 1-indexed node labels with a 0-indexed distance array (off-by-one on `n`).
- Treating the edges as undirected; signals only travel u -> v.

## Related follow-ups

- [Path With Maximum Probability](04_path_with_maximum_probability.md)
- [Number of Ways to Arrive at Destination](06_number_of_ways_to_arrive_at_destination.md)
- [Cheapest Flights Within K Stops](02_cheapest_flights_within_k_stops.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
