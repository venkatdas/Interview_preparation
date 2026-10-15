# Satisfiability of Equality Equations

| | |
|---|---|
| **Topic** | Advanced Union-Find |
| **Difficulty** | Medium |
| **Pattern** | two-pass constraints |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #990 — https://leetcode.com/problems/satisfiability-of-equality-equations/ |
| **Solution file** | [01_satisfiability_of_equality_equations.js](../solutions/01_satisfiability_of_equality_equations.js) — open only after a real attempt |

## Problem

You get equations of the form "a==b" or "a!=b" over single lowercase letters.
Return true if some assignment of integers to the letters satisfies all of them.

## Examples

```
Input: ["a==b","b!=a"]            Output: false
Input: ["b==a","a==b"]            Output: true
Input: ["a==b","b==c","a==c"]     Output: true
Input: ["a==b","b!=c","c==a"]     Output: false
Input: ["a!=a"]                   Output: false
```

## Constraints & clarifying questions

```
- Variables are single letters a-z (26 nodes)
- Can the same equation appear twice? (yes, harmless)
- Is "a!=a" possible? (yes -> false)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-pass constraints* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(26! ...) no; practical brute: BFS components   O(n + 26). Build a graph of "==" edges, flood-fill to label components, then check each "!=".

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find in two passes)   O(n * alpha(26)) time, O(26) space. Equality is transitive, so letters joined by "==" form components.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "a!=a" -> false immediately
- only "!=" equations -> true
- empty list -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(26! ...) no; practical brute: BFS components   O(n + 26)

```
Build a graph of "==" edges, flood-fill to label components, then check each "!=".
This is fine, but union-find is the expected tool and shorter.
```

### APPROACH 2 — Optimal (Union-Find in two passes)   O(n * alpha(26)) time, O(26) space

```
Equality is transitive, so letters joined by "==" form components. Process every "=="
first (union), THEN every "!=" (find both; if same root -> contradiction).
Order matters: a "!=" seen before a later "==" could be wrongly accepted.

Dry run on ["a==b","b!=c","c==a"]:
  pass 1: union(a,b): {a,b}; union(c,a): {a,b,c}
  pass 2: b!=c: find(b) === find(c) -> false
```

### Edge cases

```
- "a!=a" -> false immediately
- only "!=" equations -> true
- empty list -> true
```

Full JavaScript solution with tests: [01_satisfiability_of_equality_equations.js](../solutions/01_satisfiability_of_equality_equations.js). Run it with `node 01_satisfiability_of_equality_equations.js` from the solutions folder.

</details>

## Common mistakes

- Checking `!=` constraints before all `==` constraints are applied.
- Forgetting `a!=a` is unsatisfiable.
- Comparing parents instead of roots.

## Related follow-ups

- [Satisfiability of Equality Equations (basics folder)](../../../01_Union_Find_Basics/03_Problems/02_Medium/05_satisfiability_of_equality_equations.md)
- [Evaluate Division](03_evaluate_division.md)
- [Possible Bipartition](../../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/02_Medium/02_possible_bipartition.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
