# Matrix and List Conversion

| | |
|---|---|
| **Topic** | Graphs (representation) |
| **Difficulty** | Easy |
| **Pattern** | representation conversion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [03_matrix_list_conversion.js](../solutions/03_matrix_list_conversion.js) — open only after a real attempt |

## Problem

Part A: given an `n x n` adjacency matrix of 0/1 values (`matrix[u][v] = 1` means an edge `u -> v`),
return the adjacency list with neighbours ascending.
Part B: given an adjacency list with `n` vertices, return the `n x n` 0/1 matrix.
Converting A and then B must give back the original matrix.

## Examples

```
Input (A): [[0,1,1],[0,0,1],[0,0,0]]
Output:    [[1,2],[2],[]]

Input (B): [[1],[0],[]]
Output:    [[0,1,0],[1,0,0],[0,0,0]]
```

## Constraints & clarifying questions

```
- Is the matrix always square? (yes)
- Only 0 and 1 values? (yes)
- What does a 1 on the diagonal mean? (a self loop)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Graph representations: the same graph stored two ways, with different costs.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Collect every (u, v) pair with a 1 into one big edge list, then group it by u.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Row u of the matrix already lists u's neighbours, just written as 0/1 flags in column order.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0          -> [] both ways
- all zeros      -> n empty lists
- diagonal 1     -> self loop u -> u
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Collect all edges into one list, then for each vertex filter that whole list. O(n² · E) in the worst case.

### APPROACH 2 — Optimal

Walk each row once and keep the column indices holding 1; columns are visited in order, so lists are sorted for free. The reverse direction sets `matrix[u][v] = 1` for every v in `adj[u]`. O(n²) time, which is the size of the matrix itself.

```
[[0,1,1],[0,0,1],[0,0,0]]
row 0: columns 1, 2 -> [1,2]
row 1: column 2     -> [2]
row 2: none         -> []
```

Full JavaScript solution with tests: [03_matrix_list_conversion.js](../solutions/03_matrix_list_conversion.js). Run it with `node 03_matrix_list_conversion.js` from the solutions folder.

</details>

## Common mistakes

- Mixing up rows and columns, which silently reverses every directed edge.
- Building rows with `new Array(n).fill(new Array(n).fill(0))`, so all rows are the same array.
- Choosing a matrix for a huge sparse graph (n = 10^5 means 10^10 cells).

## Related follow-ups

- [Edge List to Adjacency List](01_edge_list_to_adjacency_list.md)
- [Reverse a Directed Graph](../02_Medium/04_reverse_directed_graph.md)
- [Number of Provinces](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/04_number_of_provinces.md) (27_Union_Find_Disjoint_Set) — its input is an adjacency matrix

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
