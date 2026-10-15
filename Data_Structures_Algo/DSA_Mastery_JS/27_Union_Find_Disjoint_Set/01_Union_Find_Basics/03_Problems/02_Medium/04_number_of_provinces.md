# Number of Provinces

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | adjacency matrix unions |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #547 — https://leetcode.com/problems/number-of-provinces/ |
| **Solution file** | [04_number_of_provinces.js](../solutions/04_number_of_provinces.js) — open only after a real attempt |

## Problem

isConnected is an n x n adjacency MATRIX: isConnected[i][j] = 1 if city i and city j
are directly connected. A province is a group of directly or indirectly connected
cities. Return the number of provinces.

## Examples

```
Input: [[1,1,0],[1,1,0],[0,0,1]]   Output: 2
Input: [[1,0,0],[0,1,0],[0,0,1]]   Output: 3
```

## Constraints & clarifying questions

```
- Matrix is symmetric and diagonal is 1? (yes)
- n up to 200 -> O(n^2) is fine
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *adjacency matrix unions* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS on the matrix)   O(n^2) time, O(n) space. For each unvisited city, DFS: scanning row i gives the neighbours.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find)   O(n^2 * alpha(n)) time, O(n) space. For every pair i &lt; j with isConnected[i][j] === 1, union(i, j).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1
- identity matrix -> n
- all ones -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS on the matrix)   O(n^2) time, O(n) space

```
For each unvisited city, DFS: scanning row i gives the neighbours. Count starts.
Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (Union-Find)   O(n^2 * alpha(n)) time, O(n) space

```
For every pair i < j with isConnected[i][j] === 1, union(i, j). Answer = uf.count().
Only the upper triangle is needed because the matrix is symmetric.

Dry run [[1,1,0],[1,1,0],[0,0,1]]:
  count 3. (0,1)=1 -> union -> count 2. (0,2)=0, (1,2)=0. answer 2.
```

### Edge cases

```
- n = 1 -> 1
- identity matrix -> n
- all ones -> 1
```

Full JavaScript solution with tests: [04_number_of_provinces.js](../solutions/04_number_of_provinces.js). Run it with `node 04_number_of_provinces.js` from the solutions folder.

</details>

## Common mistakes

- Treating the matrix as a grid of cells (like Number of Islands); it is an adjacency matrix where row i and column j are cities.
- Scanning the full matrix including the diagonal and lower half; harmless but twice the work. Scan j > i only.
- Forgetting cities with no friends are provinces of their own.

## Related follow-ups

- [Number of Connected Components](01_number_of_connected_components.md)
- [Number of Islands](../../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md)
- Number of Operations to Make Network Connected (LeetCode #1319)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
