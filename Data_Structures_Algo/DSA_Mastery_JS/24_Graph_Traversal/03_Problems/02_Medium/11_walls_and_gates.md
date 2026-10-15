# Walls and Gates

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | multi-source BFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #286 — https://leetcode.com/problems/walls-and-gates/ |
| **Solution file** | [11_walls_and_gates.js](../solutions/11_walls_and_gates.js) — open only after a real attempt |

## Problem

Grid with three kinds of cells: -1 wall, 0 gate, INF (2^31 - 1) empty room. Fill every
empty room with the distance to its NEAREST gate. Leave INF if no gate is reachable.

## Examples

```
Input:                      Output:
  INF  -1   0  INF            3  -1   0   1
  INF INF INF  -1             2   2   1  -1
  INF  -1 INF  -1             1  -1   2  -1
    0  -1 INF INF             0  -1   3   4
```

## Constraints & clarifying questions

```
- Modify in place? (yes)
- Multiple gates? (yes - this is the whole point)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *multi-source BFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS from EACH room)   O((m*n)^2) time. For every empty room run a BFS until you hit a gate.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (multi-source BFS from all gates)   O(m*n) time, O(m*n) space. Flip the question: instead of "how far is each room from a gate", ask "how far does each gate reach".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no gates -> grid unchanged
- rooms boxed in by walls stay INF
- empty grid
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS from EACH room)   O((m*n)^2) time

```
For every empty room run a BFS until you hit a gate. m*n rooms, each BFS O(m*n).
(A slightly better brute force: BFS from each GATE and keep the min - still O(g * m*n).)
```

### APPROACH 2 — Optimal (multi-source BFS from all gates)   O(m*n) time, O(m*n) space

```
Flip the question: instead of "how far is each room from a gate", ask "how far does
each gate reach". Put ALL gates in the queue at distance 0 and BFS outward. The first
time BFS touches a room is from its nearest gate. Writing the distance into the cell
doubles as the visited mark (only INF cells get expanded).

Dry run (small):
    INF  0           queue [(0,1),(1,0)]
     0  INF          pop (0,1): (0,0)=1, (1,1)=1    pop (1,0): both already 1
  result [[1,0],[0,1]]
```

### Edge cases

```
- no gates -> grid unchanged
- rooms boxed in by walls stay INF
- empty grid
```

Full JavaScript solution with tests: [11_walls_and_gates.js](../solutions/11_walls_and_gates.js). Run it with `node 11_walls_and_gates.js` from the solutions folder.

</details>

## Common mistakes

- Running BFS from every empty room instead of from all gates at once.
- Overwriting walls or gates.
- Using a visited set when "INF still unchanged" already means unvisited.

## Related follow-ups

- [Rotting Oranges](10_rotting_oranges.md)
- [01 Matrix](12_01_matrix.md)
- [Walls and Gates / 01 Matrix](../../../17_Queues_And_Deques/03_Problems/02_Medium/10_walls_and_gates_01_matrix.md) (17_Queues_And_Deques)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
