# Evaluate Division

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Medium |
| **Pattern** | weighted DFS / weighted UF |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #399 — https://leetcode.com/problems/evaluate-division/ |
| **Solution file** | [04_evaluate_division.js](../solutions/04_evaluate_division.js) — open only after a real attempt |

## Problem

equations[i] = [A, B] with values[i] = A / B. Answer queries [C, D] = C / D using the
known ratios, or -1.0 if it cannot be determined (unknown variable or no connection).

## Examples

```
Input: equations = [["a","b"],["b","c"]], values = [2.0,3.0],
       queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
Output: [6.0, 0.5, -1.0, 1.0, -1.0]
```

## Constraints & clarifying questions

```
- Values are positive, no division by zero? (yes)
- A variable that never appears (even "x"/"x") -> -1
- Contradictory equations? (assume consistent)

MODEL: a weighted DIRECTED graph. Edge A -> B with weight A/B, and B -> A with weight
B/A. The value of C / D is the PRODUCT of the weights along any path C -> D.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *weighted DFS / weighted UF* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (weighted DFS per query)   O(Q * (V + E)). For each query, DFS from C to D multiplying weights.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (weighted union-find)   O((E + Q) * alpha) after building. Keep parent[x] and weight[x] = x / parent[x].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- query with unknown variable -> -1
- query x / x where x exists -> 1
- two disconnected groups -> -1 between them
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (weighted DFS per query)   O(Q * (V + E))

```
For each query, DFS from C to D multiplying weights. Simple and usually accepted.
Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (weighted union-find)   O((E + Q) * alpha) after building

```
Keep parent[x] and weight[x] = x / parent[x]. find(x) compresses the path and updates
weight[x] = x / root. union(a, b, ratio) attaches root(a) under root(b) with the weight
that makes a / b = ratio consistent:
  weight[rootA] = ratio * weight[b] / weight[a]
Query C / D: same root? -> weight[C] / weight[D]  (both are relative to the root).

Dry run equations a/b=2, b/c=3:
  union(a,b,2): rootA = a, rootB = b -> parent[a] = b, weight[a] = 2
  union(b,c,3): rootB = b, rootC = c -> parent[b] = c, weight[b] = 3
  query a/c: find(a) compresses: weight[a] = 2 * 3 = 6, parent c; find(c) = c, weight 1
             -> 6 / 1 = 6.   query b/a: weight[b]=3, weight[a]=6 -> 3/6 = 0.5
```

### Edge cases

```
- query with unknown variable -> -1
- query x / x where x exists -> 1
- two disconnected groups -> -1 between them
```

Full JavaScript solution with tests: [04_evaluate_division.js](../solutions/04_evaluate_division.js). Run it with `node 04_evaluate_division.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the reverse edge b -> a with weight 1 / value.
- Answering x / x = 1 for a variable never seen in the equations (the answer is -1).
- Reusing a visited set across queries in the DFS version.

## Related follow-ups

- [Evaluate Division (weighted union-find version)](../../../../27_Union_Find_Disjoint_Set/02_Advanced_Union_Find/03_Problems/02_Medium/03_evaluate_division.md)
- [Path With Maximum Probability](../../../01_Shortest_Paths/03_Problems/02_Medium/04_path_with_maximum_probability.md)
- [Satisfiability of Equality Equations](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/05_satisfiability_of_equality_equations.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
