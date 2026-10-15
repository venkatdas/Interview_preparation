# Find if Path Exists in Graph

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Easy |
| **Pattern** | BFS reachability |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1971 — https://leetcode.com/problems/find-if-path-exists-in-graph/ |
| **Solution file** | [03_find_if_path_exists.js](../solutions/03_find_if_path_exists.js) — open only after a real attempt |

## Problem

There are n nodes 0..n-1 and an undirected edge list. Return true if there is a path
from `source` to `destination`.

## Examples

```
Input: n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2   Output: true
Input: n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5
Output: false   Explanation: {0,1,2} and {3,4,5} are separate components
```

## Constraints & clarifying questions

```
- Can source === destination? (yes -> true)
- Duplicate edges / self loops? (possible, harmless with a visited set)
- n up to 2*10^5, so the solution must be O(n + e)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS reachability* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS over the raw edge list)   O(V * E) time, O(V) space. Do not build an adjacency list; for every node we visit, scan ALL edges to find its neighbours.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS on adjacency list)   O(V + E) time, O(V + E) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- source === destination -> true even with no edges
- n = 1
- no edges at all -> false unless source === destination
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS over the raw edge list)   O(V * E) time, O(V) space

```
Do not build an adjacency list; for every node we visit, scan ALL edges to find its
neighbours. Correct, but each of the V visits costs O(E).
```

### APPROACH 2 — Optimal (BFS on adjacency list)   O(V + E) time, O(V + E) space

```
1. Build the adjacency list (both directions).
  2. BFS from source with a visited array. If we ever pop destination -> true.
  3. Queue empties -> false.

Dry run on n=3, edges [[0,1],[1,2],[2,0]], 0 -> 2:
  adj = {0:[1,2], 1:[0,2], 2:[1,0]}
  queue [0]  visited {0}
  pop 0: push 1, 2         visited {0,1,2}
  pop 1: 1 !== 2, neighbours already visited
  pop 2: === destination -> true

(Union-Find also solves this; see 27_Union_Find_Disjoint_Set/01_Union_Find_Basics.)
```

### Edge cases

```
- source === destination -> true even with no edges
- n = 1
- no edges at all -> false unless source === destination
```

Full JavaScript solution with tests: [03_find_if_path_exists.js](../solutions/03_find_if_path_exists.js). Run it with `node 03_find_if_path_exists.js` from the solutions folder.

</details>

## Common mistakes

- Building a directed list for an undirected graph.
- Not handling `source === destination` (always true).
- Recursive DFS on 2·10^5 nodes overflowing the JS stack.

## Related follow-ups

- [Number of Connected Components in an Undirected Graph](../02_Medium/07_number_of_connected_components.md)
- [Keys and Rooms](../02_Medium/04_keys_and_rooms.md)
- [Number of Provinces](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/04_number_of_provinces.md) (27_Union_Find_Disjoint_Set/01_Union_Find_Basics)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
