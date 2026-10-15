# Game of Life

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | in-place extra states |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #289 — https://leetcode.com/problems/game-of-life/ |
| **Solution file** | [13_game_of_life.js](../solutions/13_game_of_life.js) — open only after a real attempt |

## Problem

Each cell is 1 (live) or 0 (dead). Compute the next generation, where every cell updates
SIMULTANEOUSLY based on its 8 neighbours in the current generation:
  - live cell with < 2 live neighbours dies
  - live cell with 2 or 3 live neighbours lives
  - live cell with > 3 live neighbours dies
  - dead cell with exactly 3 live neighbours becomes live
Follow-up: do it in place.

## Examples

```
Input: [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]   Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
Input: [[1,1],[1,0]]                       Output: [[1,1],[1,1]]
```

## Constraints & clarifying questions

```
- Cells outside the board are dead? (yes)
- In place required? (follow-up; the extra-states trick does it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *in-place extra states* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (copy)   O(m n) time, O(m n) space. Copy the board, read neighbour counts from the copy, write into the original.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (encode old and new state in the same cell)   O(m n) time, O(1) space. Use the bits of each cell: bit 0 = current state, bit 1 = next state.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all dead -> all dead
- 1x1 -> always dies (0 neighbours)
- border cells (fewer neighbours)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (copy)   O(m n) time, O(m n) space

```
Copy the board, read neighbour counts from the copy, write into the original.
Simple and correct; just uses an extra grid.
```

### APPROACH 2 — Optimal (encode old and new state in the same cell)   O(m n) time, O(1) space

```
Use the bits of each cell: bit 0 = current state, bit 1 = next state.
  pass 1: for each cell count live neighbours using (cell & 1) - the ORIGINAL state, even
          if that neighbour was already marked. If it should be alive next, set bit 1 (|= 2).
  pass 2: every cell >>= 1, which drops the old state and keeps the new one.
Because the old state is never overwritten during pass 1, simultaneity is preserved.

Dry run on [[1,1],[1,0]]:
  (0,0): 2 live nbrs, alive -> lives: 1|2=3. (0,1): 2 nbrs -> 3. (1,0): 2 nbrs -> 3.
  (1,1): nbrs (0,0)&1=1,(0,1)&1=1,(1,0)&1=1 = 3, dead -> born: 0|2=2
  shift: [[1,1],[1,1]]
```

### Edge cases

```
- all dead -> all dead
- 1x1 -> always dies (0 neighbours)
- border cells (fewer neighbours)
```

Full JavaScript solution with tests: [13_game_of_life.js](../solutions/13_game_of_life.js). Run it with `node 13_game_of_life.js` from the solutions folder.

</details>

## Common mistakes

- Updating cells in place without encoding the old state, so neighbours see next-generation values.
- Counting the cell itself as its own neighbour.
- Missing out-of-bounds checks on edge and corner cells.

## Related follow-ups

- [Set Matrix Zeroes](09_set_matrix_zeroes.md) — in-place update with markers
- [Number of Islands](14_number_of_islands.md) — 4-direction neighbours
- [Rotting Oranges](../../../17_Queues_And_Deques/03_Problems/02_Medium/09_rotting_oranges.md) — grid state changing over time

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
