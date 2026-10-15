# Number of Ways to Arrive at Destination

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Medium |
| **Pattern** | Dijkstra + path counting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1976 — https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/ |
| **Solution file** | [06_number_of_ways_to_arrive_at_destination.js](../solutions/06_number_of_ways_to_arrive_at_destination.js) — open only after a real attempt |

## Problem

n intersections 0..n-1, roads[i] = [u, v, time] (undirected). Return the number of
different ways to travel from 0 to n-1 in the SHORTEST possible time, modulo 1e9 + 7.

## Examples

```
Input: n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],
                       [2,5,1],[0,4,5],[4,6,2]]
Output: 4   (shortest time is 7; four routes achieve it)
Input: n = 2, roads = [[1,0,10]]   Output: 1
```

## Constraints & clarifying questions

```
- Times positive? (yes -> Dijkstra)
- Count can overflow? (mod 1e9+7)
- Graph connected? (yes per constraints)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dijkstra + path counting* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS enumerating every simple path)   exponential. Explore all simple paths 0 -> n-1, track the best time and how many paths hit it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dijkstra + ways counter)   O((V + E) log V). Run Dijkstra and carry ways[v] = number of shortest paths to v: - strictly better distance found:  dist[v] = d + w;  ways[v] = ways[u] - equal distance found:            ways[v] += ways[u] Because Dijkstra finalises u before relaxing from it (non-negative weig

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1 (you are already there)
- a single road -> 1
- parallel roads with equal time count as separate ways
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS enumerating every simple path)   exponential

```
Explore all simple paths 0 -> n-1, track the best time and how many paths hit it.
```

### APPROACH 2 — Optimal (Dijkstra + ways counter)   O((V + E) log V)

```
Run Dijkstra and carry ways[v] = number of shortest paths to v:
  - strictly better distance found:  dist[v] = d + w;  ways[v] = ways[u]
  - equal distance found:            ways[v] += ways[u]
Because Dijkstra finalises u before relaxing from it (non-negative weights), ways[u]
is complete when it is used.

Dry run on a diamond 0-1 (1), 0-2 (1), 1-3 (1), 2-3 (1):
  pop 0: dist[1]=1 ways 1, dist[2]=1 ways 1
  pop 1: dist[3]=2 ways 1
  pop 2: dist[3]=2 equal -> ways[3] = 1 + 1 = 2
  answer 2
```

### Edge cases

```
- n = 1 -> 1 (you are already there)
- a single road -> 1
- parallel roads with equal time count as separate ways
```

Full JavaScript solution with tests: [06_number_of_ways_to_arrive_at_destination.js](../solutions/06_number_of_ways_to_arrive_at_destination.js). Run it with `node 06_number_of_ways_to_arrive_at_destination.js` from the solutions folder.

</details>

## Common mistakes

- Adding to `ways[v]` on a strictly better distance instead of RESETTING it to `ways[u]`.
- Forgetting the modulo 1e9+7, or applying it to distances instead of counts.
- Distances can exceed 2^53 in the original constraints; mention BigInt or note the safe range.
- Processing stale heap entries, which double-counts ways.

## Related follow-ups

- [Network Delay Time](01_network_delay_time.md)
- [Word Ladder II (all shortest paths)](../../../03_SCC_Bridges_Bipartite_Euler/03_Problems/03_Hard/09_word_ladder_ii.md)
- [Reachable Nodes in Subdivided Graph](../03_Hard/10_reachable_nodes_in_subdivided_graph.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
