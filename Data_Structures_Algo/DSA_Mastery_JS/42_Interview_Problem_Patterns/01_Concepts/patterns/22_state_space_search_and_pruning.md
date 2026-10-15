# 22. State-space Search & Pruning

Some problems are not about a given graph but about **configurations**: the digits on a lock,
the board of a sliding puzzle, which nodes you have visited so far, a word you are transforming.
Each configuration is a **state**; each legal move connects two states. Now the problem *is* a
graph problem on states:

- **Minimum number of moves** -> BFS over states (each move costs 1).
- **Any valid / all valid configurations** -> DFS (backtracking) over states.
- **Huge state space** -> **prune**: skip states that cannot lead to an answer (constraint checks,
  bounds, symmetry, memoized dead ends), or search from both ends (bidirectional BFS).

The craft is choosing a **compact state** (string key, bitmask, tuple) and generating neighbors correctly.

**Teaches in depth:** [Graph Traversal](../../../24_Graph_Traversal/README.md), [Backtracking](../../../13_Backtracking/README.md), [SCC / Bipartite / Euler and state graphs](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at state-space search |
|---|---|
| "minimum number of moves / turns / transformations" | BFS on states |
| "lock", "puzzle", "board", "jug", "knight moves" | configurations are nodes |
| "change one letter at a time" | Word Ladder: words are states |
| "visit all nodes", "shortest path visiting every..." | state = (node, visitedMask) |
| "with at most k obstacles removed / k stops" | state = (position, budget left) |
| "place items so that no conflicts" (N-Queens, Sudoku) | DFS with constraint pruning |
| "deadends", "forbidden states" | pre-mark them as visited |

**Constraint hints**

- Count the states first: lock 10^4, 2x3 puzzle 6! = 720, `(node, mask)` with n = 12 -> 12 * 4096 ≈ 5 * 10^4. If the count fits in ~10^6–10^7, BFS works.
- If the count is astronomical (N-Queens n = 12 has 12^12 raw placements), you need strong pruning or a different method.

## 2. When it applies (preconditions)

- You can encode a state as a hashable key (string, number, bitmask).
- From any state you can list the legal next states.
- For BFS minimality: every move costs the same. (Different costs -> Dijkstra over states.)

## 3. When it does NOT apply

- **The state space is too big and has structure.** "Minimum coins for amount 10^4": BFS over amounts works, but DP over the amount is simpler and the same size; if the target were 10^12, neither works and you need math/greedy.
- **Weighted moves with BFS.** Moves with costs 1 and 5: BFS returns the fewest moves, not the cheapest. Use Dijkstra over states ([14](14_graph_traversal_and_shortest_paths.md)).
- **Pruning that cuts valid answers.** In Combination Sum, `break` when `c[i] > remaining` is only correct because the candidates are **sorted**. On unsorted `[5, 2]` with target 2, breaking at 5 misses `[2]`.

## 4. The template

```js
// Generic BFS over states. key(state) -> string for the visited set; neighbors(state) -> states.
function bfsStates(start, isGoal, neighbors, key = String) {
  const seen = new Set([key(start)]);
  let frontier = [start];
  let steps = 0;
  while (frontier.length) {
    const next = [];
    for (const s of frontier) {
      if (isGoal(s)) return steps;
      for (const t of neighbors(s)) {
        const k = key(t);
        if (!seen.has(k)) { seen.add(k); next.push(t); }
      }
    }
    frontier = next;
    steps++;
  }
  return -1;
}

// DFS with pruning: N-Queens count with O(1) conflict checks
function nQueensCount(n) {
  const cols = new Set();
  const diag = new Set();                          // r - c is constant on a "\" diagonal
  const anti = new Set();                          // r + c is constant on a "/" diagonal
  let count = 0;
  (function place(r) {
    if (r === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue; // prune dead branches early
      cols.add(c); diag.add(r - c); anti.add(r + c);
      place(r + 1);
      cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    }
  })(0);
  return count;
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`bfsStates`, `nQueensCount`) and [tests/patterns.test.js](../../tests/patterns.test.js) (Open-the-Lock style puzzles and known N-Queens counts 1, 0, 0, 2, 10, 4, 40, 92).

**Dry run** `bfsStates('00', s => s === '11', turnOneWheel)` on a 2-wheel lock:

| steps | frontier (new states) |
|---|---|
| 0 | 00 |
| 1 | 10, 90, 01, 09 |
| 2 | ..., 11 found when popped -> answer 2 |

## 5. Variations

- **Dead ends / forbidden states:** add them to `seen` before starting (and check the start itself).
- **Bidirectional BFS:** expand the smaller frontier from both start and goal; meet in the middle (Word Ladder on big dictionaries).
- **State with budget:** `(r, c, kLeft)` for "shortest path with k obstacle eliminations".
- **State with mask:** `(node, mask)` for "shortest path visiting all nodes"; start from every node at once.
- **Pruning toolbox:** sort + break, bound by best-so-far (branch and bound), memoize failed states, symmetry (fix the first choice), constraint sets (N-Queens, Sudoku).
- **A\*:** BFS ordered by `steps + heuristic`; heuristic must never overestimate.

## 6. Common pitfalls

1. **Arrays as `Set` keys.** `seen.has([1, 2])` is always false (reference identity). Use `state.join(',')` or a number encoding.
2. Marking visited when popping instead of when pushing: the frontier blows up with duplicates.
3. Forgetting to check whether the **start** is a goal or a dead end.
4. Generating neighbors that mutate the current state in place (shared arrays). Copy, or build strings.
5. Using `queue.shift()` on 10^5+ states: O(n) each. Use level arrays (as above) or a head index.
6. Under-estimating the state count: always multiply out the dimensions before coding.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Open the Lock | Medium | BFS over 10^4 lock states | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/17_open_the_lock.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/17_open_the_lock.js) |
| 2 | Word Ladder | Hard | BFS over words | [statement](../../../24_Graph_Traversal/03_Problems/03_Hard/18_word_ladder.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/18_word_ladder.js) |
| 3 | Keys and Rooms | Medium | reachability over rooms | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/04_keys_and_rooms.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/04_keys_and_rooms.js) |
| 4 | Bus Routes | Hard | BFS over routes, not stops | [statement](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/03_Hard/05_bus_routes.md) · [solution](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/solutions/05_bus_routes.js) |
| 5 | Shortest Path Visiting All Nodes | Hard | state = (node, mask) | [statement](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/03_Hard/10_shortest_path_visiting_all_nodes.md) · [solution](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/solutions/10_shortest_path_visiting_all_nodes.js) |
| 6 | Shortest Path with Obstacle Elimination | Hard | state = (r, c, k) | [statement](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/03_Hard/09_shortest_path_with_obstacles_elimination.md) · [solution](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/solutions/09_shortest_path_with_obstacles_elimination.js) |
| 7 | N-Queens | Hard | DFS + constraint sets | [statement](../../../13_Backtracking/03_Problems/03_Hard/12_n_queens.md) · [solution](../../../13_Backtracking/03_Problems/solutions/12_n_queens.js) |
| 8 | Sudoku Solver | Hard | DFS + constraint pruning | [statement](../../../13_Backtracking/03_Problems/03_Hard/13_sudoku_solver.md) · [solution](../../../13_Backtracking/03_Problems/solutions/13_sudoku_solver.js) |
| 9 | Partition to K Equal Sum Subsets | Medium | DFS / bitmask with pruning | [statement](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/02_Medium/11_partition_k_equal_sum_subsets.md) · [solution](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/solutions/11_partition_k_equal_sum_subsets.js) |
| 10 | Expression Add Operators | Hard | DFS over expressions | [statement](../../../13_Backtracking/03_Problems/03_Hard/15_expression_add_operators.md) · [solution](../../../13_Backtracking/03_Problems/solutions/15_expression_add_operators.js) |

## 8. Self-check

**Q1.** How many states does "Shortest Path Visiting All Nodes" have for n = 12, and what is BFS's cost?

<details><summary>Answer</summary>

n * 2^n = 12 * 4096 = 49,152 states. BFS is O(n * 2^n * degree), which is easily fast enough.

</details>

**Q2.** In Open the Lock, why add dead ends to `seen` before starting?

<details><summary>Answer</summary>

So BFS never enters them; they behave like walls. Also check the start: if `"0000"` is a dead end, the answer is -1 immediately.

</details>

**Q3.** When does bidirectional BFS help, and by how much?

<details><summary>Answer</summary>

When the branching factor b is large and the goal is known. One-sided BFS explores about b^d states; two searches meeting in the middle explore about 2 * b^(d/2) — an exponential saving.

</details>

---

Previous: [21. String Matching & Trie-based Problems](21_string_matching_and_tries.md) · [Pattern index](../../README.md)
