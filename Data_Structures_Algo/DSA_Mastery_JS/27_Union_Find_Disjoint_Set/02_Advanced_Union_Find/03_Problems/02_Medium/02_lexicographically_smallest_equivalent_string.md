# Lexicographically Smallest Equivalent String

| | |
|---|---|
| **Topic** | Advanced Union-Find |
| **Difficulty** | Medium |
| **Pattern** | chosen representative (smallest letter) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1061 — https://leetcode.com/problems/lexicographically-smallest-equivalent-string/ |
| **Solution file** | [02_lexicographically_smallest_equivalent_string.js](../solutions/02_lexicographically_smallest_equivalent_string.js) — open only after a real attempt |

## Problem

s1 and s2 have the same length; s1[i] and s2[i] are "equivalent" characters.
Equivalence is reflexive, symmetric and transitive. For baseStr, replace every
character by the smallest character equivalent to it and return the result.

## Examples

```
Input: s1 = "parker", s2 = "morris", baseStr = "parser"   Output: "makkek"
  groups: {m,p}, {a,o}, {k,r}, {e,i}, {s}
Input: s1 = "hello", s2 = "world", baseStr = "hold"       Output: "hdld"
Input: s1 = "leetcode", s2 = "programs", baseStr = "sourcecode"   Output: "aauaaaaada"
```

## Constraints & clarifying questions

```
- Only lowercase letters (26 nodes)
- baseStr may contain letters not in s1/s2 (they map to themselves)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *chosen representative (smallest letter)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(26 * (n + 26)) time. Build an adjacency list of equivalences; for each character of baseStr do a DFS over its component and take the minimum letter.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find where the root is always the smallest letter). O((n + m) * alpha(26)) time, O(26) space Union every pair (s1[i], s2[i]).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- s1 === s2 (all no-ops)
- a chain a-b, b-c, c-d -> all map to a
- empty baseStr -> ""
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(26 * (n + 26)) time

```
Build an adjacency list of equivalences; for each character of baseStr do a DFS over its
component and take the minimum letter. Repeated DFS per character is wasteful but fine
for 26 letters.
```

### APPROACH 2 — Optimal (Union-Find where the root is always the smallest letter)

```
O((n + m) * alpha(26)) time, O(26) space
Union every pair (s1[i], s2[i]). When merging two roots, make the SMALLER letter the
parent. Then find(ch) directly returns the smallest equivalent letter. The trick of
choosing the representative on purpose replaces union-by-size (no balance needed for
26 nodes).

Dry run: s1 = "parker", s2 = "morris"
  p-m -> root m; a-o -> root a; r-r no-op; k-r -> root k; e-i -> root e; r-s -> find(r)=k, s -> k
  baseStr "parser": p->m, a->a, r->k, s->k, e->e, r->k  -> "makkek"
```

### Edge cases

```
- s1 === s2 (all no-ops)
- a chain a-b, b-c, c-d -> all map to a
- empty baseStr -> ""
```

Full JavaScript solution with tests: [02_lexicographically_smallest_equivalent_string.js](../solutions/02_lexicographically_smallest_equivalent_string.js). Run it with `node 02_lexicographically_smallest_equivalent_string.js` from the solutions folder.

</details>

## Common mistakes

- Using union by size, which can make a bigger letter the root; here the root must be the smallest letter of the group.
- Mapping characters of baseStr that never appear in s1/s2; they simply map to themselves.
- Forgetting the relation is transitive: a=b and b=c means a=c even if never stated.

## Related follow-ups

- [Smallest String With Swaps](../../../01_Union_Find_Basics/03_Problems/02_Medium/08_smallest_string_with_swaps.md)
- [Satisfiability of Equality Equations](01_satisfiability_of_equality_equations.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
