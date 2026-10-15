# Flood Fill

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Easy |
| **Pattern** | DFS flood fill |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #733 — https://leetcode.com/problems/flood-fill/ |
| **Solution file** | [01_flood_fill.js](../solutions/01_flood_fill.js) — open only after a real attempt |

## Problem

You are given an image as a grid of integers (colours), a start cell (sr, sc) and a new
colour. Repaint the start cell and every cell connected to it (4-directionally) that has
the SAME colour as the start cell. Return the repainted image. This is the paint-bucket
tool in an image editor.

## Examples

```
Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
Explanation: all 1s reachable from the centre become 2; the bottom-right 1 is not
connected (diagonals do not count), so it stays.

Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0   Output: unchanged
```

## Constraints & clarifying questions

```
- Can I modify the input in place? (usually yes)
- What if the new colour equals the old colour? (return as is - and this guard also
  prevents an infinite loop)
- Diagonals connected? (no, 4 directions only)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS flood fill* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O((m*n)^2) time, O(1) extra space. Repeat: scan the whole grid, repaint any old-colour cell that is adjacent to an already-repainted cell.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS flood fill)   O(m*n) time, O(m*n) space (recursion). The start cell is a node; same-colour neighbours are its edges.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- new colour === old colour -> return immediately (otherwise infinite recursion)
- 1 x 1 image
- start cell is isolated (no same-colour neighbours) -> only it changes
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((m*n)^2) time, O(1) extra space

```
Repeat: scan the whole grid, repaint any old-colour cell that is adjacent to an
already-repainted cell. Stop when a full scan changes nothing. Each scan is O(m*n) and
in the worst case (a long snake) we need O(m*n) scans.
```

### APPROACH 2 — Optimal (DFS flood fill)   O(m*n) time, O(m*n) space (recursion)

```
The start cell is a node; same-colour neighbours are its edges. Run DFS:
  1. If out of bounds or the cell is not the old colour, stop.
  2. Repaint the cell (this IS the visited mark - repainted cells no longer match).
  3. Recurse into the 4 neighbours.

Dry run on [[1,1,0],[1,0,0]], start (0,0), colour 2:
  fill(0,0): 1 -> 2        image = [[2,1,0],[1,0,0]]
    fill(1,0): 1 -> 2      image = [[2,1,0],[2,0,0]]
      fill(2,0) out, fill(0,0) is 2 != 1 stop, fill(1,1) is 0 stop, fill(1,-1) out
    fill(-1,0) out
    fill(0,1): 1 -> 2      image = [[2,2,0],[2,0,0]]
      neighbours: (1,1)=0 stop, (0,2)=0 stop, (0,0)=2 stop
    fill(0,-1) out
  done.
```

### Edge cases

```
- new colour === old colour -> return immediately (otherwise infinite recursion)
- 1 x 1 image
- start cell is isolated (no same-colour neighbours) -> only it changes
```

Full JavaScript solution with tests: [01_flood_fill.js](../solutions/01_flood_fill.js). Run it with `node 01_flood_fill.js` from the solutions folder.

</details>

## Common mistakes

- Not returning early when the new colour equals the old one, causing infinite recursion.
- Filling diagonal neighbours (only 4 directions count).
- Reading `image[r][c]` before the bounds check.

## Related follow-ups

- [Number of Islands](../02_Medium/05_number_of_islands.md)
- [Max Area of Island](../02_Medium/06_max_area_of_island.md)
- [Surrounded Regions](../02_Medium/13_surrounded_regions.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
