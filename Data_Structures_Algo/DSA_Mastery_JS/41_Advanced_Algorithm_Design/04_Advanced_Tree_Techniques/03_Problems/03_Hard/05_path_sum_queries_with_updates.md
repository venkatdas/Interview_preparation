# Path Sum Queries with Updates

| | |
|---|---|
| **Topic** | Advanced Tree Techniques |
| **Difficulty** | Hard |
| **Pattern** | heavy-light decomposition + Fenwick |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Fenwick Tree](../../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/README.md) |
| **Source** | Original exercise |
| **Solution file** | [05_path_sum_queries_with_updates.js](../solutions/05_path_sum_queries_with_updates.js) — open only after a real attempt |

## Problem

A tree has n nodes 0..n-1; node v holds `values[v]`. Process queries in order:

- `['update', v, x]` sets `values[v] = x`.
- `['path', u, v]` asks for the sum of the values of every node on the path from u to v,
  both endpoints included.

Return the answers of all `'path'` queries in order.

## Examples

```
  0(1) - 1(2) - 2(3)
         |
         3(4) - 4(5)

edges = [[0,1],[1,2],[1,3],[3,4]], values = [1,2,3,4,5]
queries = [['path',0,4], ['path',2,4], ['update',1,10], ['path',0,2], ['path',3,3]]
Output: [12, 14, 14, 4]
```

## Constraints & clarifying questions

```
- n and q up to 10^5 -> O(n) per query is too slow.
- u may equal v.
- Are there updates? (yes - otherwise LCA + root prefix sums would be enough)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Path queries WITH updates -> *heavy-light decomposition*. Section 5.6 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Root the tree, store depth and parent. Lift the deeper endpoint one step at a time, adding values, until both meet. O(n) per query.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Give every node its heavy child (largest subtree). Heavy chains laid out contiguously make each chain piece of a path one Fenwick range, and a path touches only O(log n) chains.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** In the loop, always lift the node whose chain HEAD is deeper. Add the LCA exactly once at the end (the final same-chain range includes it).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per query

Climb from the deeper endpoint until u = v, then add the meeting node.

### APPROACH 2 — Optimal (HLD + Fenwick)   O(n) build, O(log^2 n) per path query, O(log n) per update

```
size, heavy child, then walk chains: head[v], pos[v] (consecutive along a chain)
Fenwick over pos.
path(u, v):
  while head[u] != head[v]:
    lift the one with deeper head: s += range(pos[head], pos[node]); node = parent[head]
  s += range(min pos, max pos) on the shared chain

Dry run (root 0): size = [5,4,1,2,1]; heavy: 0->1, 1->3, 3->4
  chain [0,1,3,4] -> pos 0..3, chain [2] -> pos 4
  path(2,4): head[2]=2 is deeper -> add pos 4..4 = 3, u = 1
             same chain: pos 1..3 = 2+4+5 = 11 -> total 14
```

### Edge cases

```
- n = 1, u = v
- u ancestor of v (zero loop iterations)
- long path: one chain; build is iterative
```

### Common mistakes

- Comparing depth of the nodes instead of depth of their chain heads.
- Making light children's chains non-contiguous (assign positions chain by chain).
- Adding the value instead of the difference on update.

Full JavaScript solution with tests: [05_path_sum_queries_with_updates.js](../solutions/05_path_sum_queries_with_updates.js).

</details>

## Related follow-ups

- Path MAXIMUM with updates (segment tree per position array instead of Fenwick)
- Path sums without updates: prefix sums from root + LCA
- Subtree + path queries together (HLD positions also keep subtrees contiguous if heavy child is visited first)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
