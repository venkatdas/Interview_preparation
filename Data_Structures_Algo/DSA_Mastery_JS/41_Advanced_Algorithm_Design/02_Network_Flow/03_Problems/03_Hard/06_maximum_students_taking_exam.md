# Maximum Students Taking Exam

| | |
|---|---|
| **Topic** | Network Flow (Advanced) |
| **Difficulty** | Hard |
| **Pattern** | bipartite max independent set = V - max matching (König) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [01 Maximum Bipartite Matching](../02_Medium/01_maximum_bipartite_matching.md) |
| **Source** | LeetCode #1349 — https://leetcode.com/problems/maximum-students-taking-exam/ |
| **Solution file** | [06_maximum_students_taking_exam.js](../solutions/06_maximum_students_taking_exam.js) — open only after a real attempt |

## Problem

A classroom is an `m x n` grid: `'.'` is a usable seat, `'#'` is broken. A student can see
the paper of anyone sitting directly left, directly right, upper-left or upper-right of
them. Seat as many students as possible so nobody can see anybody else's paper.

## Examples

```
Input: ["#.##.#", ".####.", "#.##.#"]                       Output: 4
Input: [".#", "##", "#.", "##", ".#"]                       Output: 3
Input: ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"]        Output: 10
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 8 (so a row bitmask DP also passes).
- Seeing is symmetric for us: if A sees B, they can't both sit.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Pick the most cells so that no two conflicting cells are both picked" =
maximum independent set. In general that's NP-hard, but look at which columns conflict.
See "König's theorem" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** With n <= 8, a row-by-row bitmask DP works: dp[row][mask] where mask must
have no adjacent bits and must not clash diagonally with the previous row's mask.
O(m · 4^n).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Every conflict (left, right, diagonal) joins a seat in an even column
to a seat in an odd column. So the conflict graph is bipartite, and
max independent set = good seats - maximum matching.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all seats broken -> 0
- one column -> no conflicts, answer = good seats
- one row -> only side-by-side conflicts
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / bitmask DP

```
Brute force: every subset of good seats, O(2^seats). Tiny only.
Row DP: dp over rows with a mask per row, O(m · 4^n) ~ 8 · 65536 — passes on LeetCode.
```

### APPROACH 2 — Optimal (König)   O(V · E) with Kuhn, V = seats, E <= 6V

```
1. Number the good seats.
2. For each seat in an EVEN column, list its conflicting neighbours (all in odd columns):
   left, right, and the four diagonals.
3. Kuhn's matching from even-column seats.
4. answer = (good seats) - (matching size)

Dry run (example 1): seats (0,1) (0,4) (1,0) (1,5) (2,1) (2,4)  -> 6
  even-column seats: (1,0), (0,4), (2,4)
  (1,0) conflicts with (0,1), (2,1); (0,4) with (1,5); (2,4) with (1,5)
  matching: (1,0)-(0,1), (0,4)-(1,5); (2,4) can't be matched -> size 2
  answer = 6 - 2 = 4
```

### Why V - matching?

König: in a bipartite graph, minimum vertex cover = maximum matching. The complement of a
vertex cover is an independent set, so max independent set = V - min vertex cover.

### Common mistakes

```
- Only adding "upper" diagonals for even seats but also needing "lower" ones: when you
  build edges from one side only, include all six directions.
- Assuming general max independent set is easy: it's only easy because the graph is bipartite.
```

Full JavaScript solution with tests: [06_maximum_students_taking_exam.js](../solutions/06_maximum_students_taking_exam.js). Run it with `node 06_maximum_students_taking_exam.js` from the solutions folder.

</details>

## Related follow-ups

- Place maximum non-attacking kings on a board with holes -> NOT bipartite (vertical conflicts break parity); needs DP.
- Minimum vertex cover in a bipartite graph -> equals max matching (König).
- LeetCode 1820 Maximum Number of Accepted Invitations — plain bipartite matching.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
