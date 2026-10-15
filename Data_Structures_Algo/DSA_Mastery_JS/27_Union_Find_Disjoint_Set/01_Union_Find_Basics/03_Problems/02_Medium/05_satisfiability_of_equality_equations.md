# Satisfiability of Equality Equations

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | union equals, check not-equals |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #990 — https://leetcode.com/problems/satisfiability-of-equality-equations/ |
| **Solution file** | [05_satisfiability_of_equality_equations.js](../solutions/05_satisfiability_of_equality_equations.js) — open only after a real attempt |

## Problem

Each equation is a 4-character string "a==b" or "a!=b" over single lowercase letters.
Return true if it is possible to assign values to the letters so that ALL equations
hold at once.

## Examples

```
Input: ["a==b","b!=a"]            Output: false
Input: ["b==a","a==b"]            Output: true
Input: ["a==b","b==c","a==c"]     Output: true
Input: ["a==b","b!=c","c==a"]     Output: false
Input: ["c==c","b==d","x!=z"]     Output: true
```

## Constraints & clarifying questions

```
- "a!=a" alone? (impossible -> false; the algorithm handles it since find(a)===find(a))
- Only 26 variables -> UnionFind(26) indexed by charCode - 97
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *union equals, check not-equals* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (build == graph, DFS components, then check !=)   O(E + 26). Build an adjacency list from "==" edges, label each letter with its component via DFS, then every "!=" must have different labels.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find in two passes)   O(E * alpha(26)) time, O(1) space. Pass 1: for every "==" equation, union(a, b).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no "!=" at all -> true
- "a!=a" -> false
- letters that appear only in "!=" -> never unioned, fine
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (build == graph, DFS components, then check !=)   O(E + 26)

```
Build an adjacency list from "==" edges, label each letter with its component via DFS,
then every "!=" must have different labels. Correct and the same complexity; it is just
more code than union-find.
```

### APPROACH 2 — Optimal (Union-Find in two passes)   O(E * alpha(26)) time, O(1) space

```
Pass 1: for every "==" equation, union(a, b).
  Pass 2: for every "!=" equation, if find(a) === find(b) -> contradiction -> false.
The two-pass order matters: a "!=" seen before a later "==" that joins them would be
missed if we checked in a single pass.

Dry run ["a==b","b!=c","c==a"]:
  pass 1: union(a,b), union(c,a) -> {a,b,c} one set
  pass 2: b!=c -> find(b) === find(c) -> false
```

### Edge cases

```
- no "!=" at all -> true
- "a!=a" -> false
- letters that appear only in "!=" -> never unioned, fine
```

Full JavaScript solution with tests: [05_satisfiability_of_equality_equations.js](../solutions/05_satisfiability_of_equality_equations.js). Run it with `node 05_satisfiability_of_equality_equations.js` from the solutions folder.

</details>

## Common mistakes

- Processing equations in one pass in input order; an `!=` seen before the `==` that contradicts it is missed. Do all `==` first.
- Forgetting `a!=a` is always a contradiction.
- Reading the wrong character indices: the variables are at positions 0 and 3, the operator at 1.

## Related follow-ups

- [Satisfiability of Equality Equations (advanced folder)](../../../02_Advanced_Union_Find/03_Problems/02_Medium/01_satisfiability_of_equality_equations.md)
- [Lexicographically Smallest Equivalent String](../../../02_Advanced_Union_Find/03_Problems/02_Medium/02_lexicographically_smallest_equivalent_string.md)
- [Is Graph Bipartite?](../../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/02_Medium/01_is_graph_bipartite.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
