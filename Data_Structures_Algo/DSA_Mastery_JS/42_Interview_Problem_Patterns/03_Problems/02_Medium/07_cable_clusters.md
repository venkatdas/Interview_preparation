# Cable Clusters

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Medium |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [07_cable_clusters.js](../solutions/07_cable_clusters.js) — open only after a real attempt |

## Problem

A data center has `n` servers (`0..n-1`), none connected at first. Technicians plug in cables one by
one: `cables[i] = [a, b]` connects servers `a` and `b`. After **each** cable, report
`[number of clusters, size of the largest cluster]`, where a cluster is a group of servers
connected directly or indirectly. Return the list of reports.

## Examples

```
Input: n = 5, cables = [[0,1],[2,3],[1,2],[0,3],[4,4]]
Output: [[4,2], [3,2], [2,4], [2,4], [2,4]]
        ([0,3] joins servers already together; [4,4] is a self-loop)

Input: n = 3, cables = []   Output: []
```

## Constraints & clarifying questions

```
- 1 <= n <= 10^5, 0 <= cables.length <= 10^5
- Cables are never removed. Duplicates and self-loops can appear.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Union-find with sizes (online connectivity). Lesson: [Union-Find](../../01_Concepts/patterns/16_union_find.md).

**Target:** O(n + m * α(n)) time, O(n) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "connected directly or indirectly", edges arrive one at a time, answer after **each** one, never removed.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: after every cable, recount components with DFS. O(m * (n + m)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Groups only merge. Keep a parent array and a size per root. A successful union: clusters--, new size = sum of both sizes; sizes only grow, so a running max is enough.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Edge cases: self-loops and duplicate cables (union finds the same root: no change), no cables.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

After each cable rebuild the adjacency list and DFS all components. O(m * (n + m)).

### APPROACH 2 — Optimal (Union-find with sizes (online connectivity))

```
find with path compression (iterative), union by size
if roots differ: attach smaller under bigger, size += , clusters--, largest = max(largest, size)
push [clusters, largest] after every cable
```

### Dry run

```
n=5: clusters 5, largest 1
  [0,1] -> 4, 2
  [2,3] -> 3, 2
  [1,2] -> 2, 4
  [0,3] -> same root, 2, 4
  [4,4] -> same root, 2, 4
```

### Complexity

O(n + m * α(n)) time, effectively linear. O(n) space.

### Common mistakes

- Comparing `parent[a] === parent[b]` instead of the roots.
- Decrementing the cluster count on a failed union.
- Recursive find without union by size can go 10^5 deep.

Full JavaScript solution with tests: [07_cable_clusters.js](../solutions/07_cable_clusters.js). Run it with `node 07_cable_clusters.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/01_number_of_connected_components.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/01_number_of_connected_components.js)
- [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/03_Hard/10_number_of_islands_ii.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/10_number_of_islands_ii.js)
- Pattern lesson: [Union-Find](../../01_Concepts/patterns/16_union_find.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
