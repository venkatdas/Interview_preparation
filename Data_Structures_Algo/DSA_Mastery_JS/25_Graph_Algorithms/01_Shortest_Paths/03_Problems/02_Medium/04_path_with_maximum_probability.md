# Path With Maximum Probability

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Medium |
| **Pattern** | Dijkstra with max-heap / product |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1514 — https://leetcode.com/problems/path-with-maximum-probability/ |
| **Solution file** | [04_path_with_maximum_probability.js](../solutions/04_path_with_maximum_probability.js) — open only after a real attempt |

## Problem

Undirected graph with n nodes; edges[i] = [a, b] has success probability succProb[i].
Return the maximum probability of a path from start to end (product of edge
probabilities). Return 0 if there is no path.

## Examples

```
Input: n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.2], start=0, end=2
Output: 0.25   (0 -> 1 -> 2 = 0.5 * 0.5 beats the direct 0.2)
Input: same, succProb=[0.5,0.5,0.3]   Output: 0.3
Input: n=3, edges=[[0,1]], succProb=[0.5], start=0, end=2   Output: 0
```

## Constraints & clarifying questions

```
- Probabilities in [0, 1]? (yes - multiplying never increases, so "longest" product
  path behaves like a shortest path: Dijkstra's greedy argument holds with a MAX heap)
- Precision tolerance? (1e-5)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dijkstra with max-heap / product* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (Bellman-Ford style, n - 1 rounds of relaxation)   O(V * E). prob[v] = max(prob[v], prob[u] * p).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dijkstra with a max-heap)   O((V + E) log V). Our MinHeap pops the smallest key; push NEGATIVE probabilities to get a max-heap.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- start === end -> 1
- unreachable -> 0
- edge with probability 0 -> never helps
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Bellman-Ford style, n - 1 rounds of relaxation)   O(V * E)

```
prob[v] = max(prob[v], prob[u] * p). Repeat n - 1 times (or until no change).
```

### APPROACH 2 — Optimal (Dijkstra with a max-heap)   O((V + E) log V)

```
Our MinHeap pops the smallest key; push NEGATIVE probabilities to get a max-heap.
Relax: candidate = prob[u] * p; keep it if larger.

Dry run example 1:
  prob [1, 0, 0]  heap [(-1, 0)]
  pop 0 (1.0): 1 -> 0.5, 2 -> 0.2      heap [(-0.5,1), (-0.2,2)]
  pop 1 (0.5): 2 -> 0.25 > 0.2 update  heap [(-0.25,2), (-0.2,2)]
  pop 2 (0.25): end reached -> 0.25
```

### Edge cases

```
- start === end -> 1
- unreachable -> 0
- edge with probability 0 -> never helps
```

Full JavaScript solution with tests: [04_path_with_maximum_probability.js](../solutions/04_path_with_maximum_probability.js). Run it with `node 04_path_with_maximum_probability.js` from the solutions folder.

</details>

## Common mistakes

- Using a min-heap on probabilities; you want the LARGEST product first (push the negative, or use a max-heap).
- Adding probabilities instead of multiplying them.
- Returning -1 or Infinity for an unreachable end; the expected answer is 0.

## Related follow-ups

- [Network Delay Time](01_network_delay_time.md)
- [Path With Minimum Effort](03_path_with_minimum_effort.md)
- [Evaluate Division](../../../03_SCC_Bridges_Bipartite_Euler/03_Problems/02_Medium/04_evaluate_division.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
