# Connection Time Queries

| | |
|---|---|
| **Set** | [Mixed Set 05](README.md) — problem 02 of 5 |
| **Difficulty** | Hard |
| **Time box** | 35 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [02_connection_time_queries.js](solutions/02_connection_time_queries.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

n computers (0..n-1) start disconnected. `logs` lists cable installations [time, u, v]
(not necessarily in time order); once installed a cable stays. For each query [a, b]
return the EARLIEST time at which a and b became connected (directly or through other
computers). Return 0 when a === b and -1 if they are never connected.

## Examples

```
Input: n = 4, logs = [[5, 0, 1], [2, 2, 3], [9, 1, 2]], queries = [[0, 1], [0, 3], [2, 3], [1, 1]]
Output: [5, 9, 2, 0]
Input: n = 3, logs = [[1, 0, 1]], queries = [[0, 2]]   Output: [-1]
```

## Constraints & clarifying questions

```
- n, logs, queries up to 10^5. Times distinct? (not required)
- Self-loops or repeated cables? (allowed, harmless)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Sorting + union-find without path compression, with edges stamped by time (a "time-stamped DSU forest"). See [Union-Find](../../../27_Union_Find_Disjoint_Set/README.md) and [Sorting](../../../11_Sorting/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Add cables in time order to a DSU; after each one re-check all unanswered queries.

</details>

<details><summary>Hint 3</summary>

**The key idea.** With union by size and no path compression, each attach is a permanent edge with a time. Two nodes became connected at the largest stamp on their paths up to the point where those paths meet.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- a === b -> 0
- different final roots -> -1
- cables that join already-connected computers -> skipped (no new stamp)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m * (n + q) * α) time

```
Sort logs by time. Add cables one at a time to a union-find; after each one, check every
still-unanswered query and record the current time if it just got connected.
```

### APPROACH 2 — Optimal (sort + union-find WITHOUT path compression, edges stamped with time)   O(m log m + (m + q) log n) time, O(n) space

```
Sort logs by time and union by size (keeps trees O(log n) deep). Never compress paths,
and remember stamp[child] = time when child's root was attached under another root.
The DSU forest is then a time-stamped tree: a and b are connected at time T iff the
paths from a and b meet below edges with stamp <= T. So the answer is the maximum stamp
on the two paths up to their lowest common ancestor in the DSU forest (if they share a root).
Walk both nodes up: always move the one with the SMALLER stamp first (stamps increase
going up), until they meet.

Dry run on example 1 (sorted logs: t2 (2,3), t5 (0,1), t9 (1,2)):
  t2: union 2,3 -> parent[3]=2, stamp[3]=2
  t5: union 0,1 -> parent[1]=0, stamp[1]=5
  t9: union roots 0 and 2 (sizes equal) -> parent[2]=0, stamp[2]=9
  query (0,3): 3 -> 2 (stamp 2) -> 0 (stamp 9); 0 is root -> max stamp 9
  query (2,3): meet at 2 after 3 climbs edge stamp 2 -> 2
```

### Edge cases

```
- a === b -> 0
- different final roots -> -1
- cables that join already-connected computers -> skipped (no new stamp)
```

### Common mistakes

```
- Using path compression: it rewires edges and destroys the time stamps.
- Answering with the time the ROOTS merged instead of the max stamp on the meeting paths.
```

Full JavaScript solution with tests: [02_connection_time_queries.js](solutions/02_connection_time_queries.js). Run it with `node solutions/02_connection_time_queries.js` from this folder.

</details>

## Related follow-ups

- Online queries interleaved with installs
- Cables can be removed (offline divide and conquer)
- Minimum bottleneck path on a weighted graph (same idea via a Kruskal tree)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
