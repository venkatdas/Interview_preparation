# Nearest Charger

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Medium |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [06_nearest_charger.js](../solutions/06_nearest_charger.js) — open only after a real attempt |

## Problem

A warehouse floor is a grid of strings: `'.'` open floor, `'#'` shelf (blocked), `'C'` charger.
Robots move up/down/left/right one cell per step and cannot enter shelves. Return a grid of numbers:
for each open cell or charger, the minimum number of steps to reach **any** charger (0 on a
charger); `-1` for shelves and for cells that cannot reach a charger.

## Examples

```
Input: ["C.#",
        "..#",
        "#.C"]
Output: [[ 0, 1, -1],
         [ 1, 2, -1],
         [-1, 1,  0]]

Input: ["..", ".."]   Output: [[-1, -1], [-1, -1]]   (no charger)
```

## Constraints & clarifying questions

```
- 1 <= rows, cols <= 300; zero or many chargers
- No diagonal moves; robots may pass through chargers.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Multi-source BFS on a grid. Lesson: [Graph Traversal & Shortest Paths](../../01_Concepts/patterns/14_graph_traversal_and_shortest_paths.md).

**Target:** O(R * C) time and space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "minimum steps", "nearest of many targets", every move costs 1.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: one BFS from every charger, keep the minimum per cell. O(K * R * C) with K chargers.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Start ONE BFS with **all** chargers in the queue at distance 0. BFS grows in rings, so the first time a cell is reached it is by its nearest charger.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Edge cases: no chargers (all -1), chargers walled in by shelves, 1x1 grid. Use a head index instead of `shift()`.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

BFS from each charger separately and take the per-cell minimum. O(K * R * C).

### APPROACH 2 — Optimal (Multi-source BFS on a grid)

```
dist = all -1; push every 'C' with dist 0
BFS: for each neighbor that is not '#' and dist === -1: dist = dist[cur] + 1, push
```

### Dry run

```
queue starts [(0,0), (2,2)]
  ring 1: (0,1), (1,0) from (0,0); (2,1) from (2,2)
  ring 2: (1,1)
  shelves and unreachable cells stay -1
```

### Complexity

O(R * C) time — every cell enters the queue at most once. O(R * C) space.

### Common mistakes

- Marking visited when popping (cells get queued several times).
- `queue.shift()` makes BFS O(n^2) in JS.
- Rows created with `fill([])` share memory.

Full JavaScript solution with tests: [06_nearest_charger.js](../solutions/06_nearest_charger.js). Run it with `node 06_nearest_charger.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/12_01_matrix.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/12_01_matrix.js)
- [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/10_rotting_oranges.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/10_rotting_oranges.js)
- Pattern lesson: [Graph Traversal & Shortest Paths](../../01_Concepts/patterns/14_graph_traversal_and_shortest_paths.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
