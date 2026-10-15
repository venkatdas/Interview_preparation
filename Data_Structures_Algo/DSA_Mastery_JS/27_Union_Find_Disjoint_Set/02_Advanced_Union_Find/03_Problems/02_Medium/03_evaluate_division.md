# Evaluate Division

| | |
|---|---|
| **Topic** | Advanced Union-Find |
| **Difficulty** | Medium |
| **Pattern** | weighted union-find (ratios) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #399 — https://leetcode.com/problems/evaluate-division/ |
| **Solution file** | [03_evaluate_division.js](../solutions/03_evaluate_division.js) — open only after a real attempt |

## Problem

You are given equations like a / b = 2.0 (as pairs ["a","b"] and values [2.0]).
Answer queries ["x","y"] = x / y. Return -1.0 when the answer cannot be determined
(unknown variable or no chain of equations connecting them).

## Examples

```
equations = [["a","b"],["b","c"]], values = [2.0, 3.0]
queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
Output: [6.0, 0.5, -1.0, 1.0, -1.0]
```

## Constraints & clarifying questions

```
- No division by zero and no contradictions in the input
- A variable only "exists" if it appears in some equation ("x","x" -> -1)
- Up to 20 equations / queries in the original, but think O(n) per query anyway
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *weighted union-find (ratios)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (graph + DFS per query)   O(q * (V + E)) time. Edge a -> b with weight 2 and b -> a with weight 1/2.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Weighted union-find)   O((n + q) * alpha(n)) time. Each variable stores a weight to its parent meaning value[x] = weight[x] * value[parent].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- x / x for a known x -> 1.0; for an unknown x -> -1.0
- variables in different components -> -1.0
- chains in reverse direction (b / a) -> reciprocal
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (graph + DFS per query)   O(q * (V + E)) time

```
Edge a -> b with weight 2 and b -> a with weight 1/2. For x / y, DFS from x to y
multiplying edge weights along the path. Clear and good enough; most interviewers accept it.
```

### APPROACH 2 — Optimal (Weighted union-find)   O((n + q) * alpha(n)) time

```
Each variable stores a weight to its parent meaning value[x] = weight[x] * value[parent].
find(x) compresses the path and multiplies weights, so afterwards weight[x] = x / root.
union(a, b, k) for a / b = k: ra = find(a), rb = find(b); attach ra under rb with
  weight[ra] = k * weight[b] / weight[a]   (derived from a = w(a)*ra, b = w(b)*rb, a = k*b)
query(x, y): if both exist and share a root -> weight[x] / weight[y], else -1.

Dry run: a/b = 2, b/c = 3
  union(a,b,2): roots a, b; parent[a] = b, weight[a] = 2 * 1 / 1 = 2      (a = 2b)
  union(b,c,3): roots b, c; parent[b] = c, weight[b] = 3 * 1 / 1 = 3      (b = 3c)
  query(a,c): find(a): parent a -> b -> c; weight[a] = 2 * 3 = 6, parent[a] = c
              find(c) = c; answer weight[a] / weight[c] = 6 / 1 = 6
  query(b,a): weight[b] / weight[a] = 3 / 6 = 0.5
```

### Edge cases

```
- x / x for a known x -> 1.0; for an unknown x -> -1.0
- variables in different components -> -1.0
- chains in reverse direction (b / a) -> reciprocal
```

Full JavaScript solution with tests: [03_evaluate_division.js](../solutions/03_evaluate_division.js). Run it with `node 03_evaluate_division.js` from the solutions folder.

</details>

## Common mistakes

- Returning 1 for `x / x` when x never appeared in any equation; the answer is -1.
- Getting the weighted-union formula backwards; derive `w(ra) = k * w(b) / w(a)` on paper first.
- Updating a node weight before its parent has been compressed in `find`.

## Related follow-ups

- [Evaluate Division (graph DFS version)](../../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/02_Medium/04_evaluate_division.md)
- [Satisfiability of Equality Equations](01_satisfiability_of_equality_equations.md)
- Check for Contradictions in Equations (LeetCode #2307)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
