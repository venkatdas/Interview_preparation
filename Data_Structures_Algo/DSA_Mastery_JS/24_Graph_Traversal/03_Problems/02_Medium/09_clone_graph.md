# Clone Graph

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS with Map |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #133 — https://leetcode.com/problems/clone-graph/ |
| **Solution file** | [09_clone_graph.js](../solutions/09_clone_graph.js) — open only after a real attempt |

## Problem

Given a reference to a node of a connected undirected graph, return a DEEP copy of
the graph. Each node has `val` (unique) and `neighbors` (array of nodes).

## Examples

```
Input: adjacency [[2,4],[1,3],[2,4],[1,3]]  (node 1 links 2,4; node 2 links 1,3; ...)
Output: a new graph with the same shape; no node object is shared with the input.
Input: null  Output: null
```

## Constraints & clarifying questions

```
- Are values unique? (yes, 1..100 - lets us key a map by val)
- Can the graph have cycles? (yes - it is undirected, so every edge is a 2-cycle;
  this is why we need the map BEFORE recursing)
- Single node with no neighbours? (return a copy with empty neighbors)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS with Map* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (two passes: BFS to collect all nodes, then copy edges). O(V + E) time, O(V) space 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS with a Map old -> new)   O(V + E) time, O(V) space. clone(node): if node already cloned -> return the existing copy   (handles cycles) create copy, STORE IT IN THE MAP NOW (before recursing!) for each neighbour: copy.neighbors.push(clone(neighbour)) return copy Dry run on 1 - 2 (two nodes connected): clone(1): 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- null input -> null
- single node, no neighbours
- must not share any object with the input (test checks identity)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (two passes: BFS to collect all nodes, then copy edges)

```
O(V + E) time, O(V) space
  1. BFS from the given node, collecting every node into a list.
  2. Create a blank copy for every node (map val -> copy).
  3. Second pass: for every original node, for every neighbour, push the copy.
Clear but two passes.
```

### APPROACH 2 — Optimal (DFS with a Map old -> new)   O(V + E) time, O(V) space

```
clone(node):
    if node already cloned -> return the existing copy   (handles cycles)
    create copy, STORE IT IN THE MAP NOW (before recursing!)
    for each neighbour: copy.neighbors.push(clone(neighbour))
    return copy

Dry run on 1 - 2 (two nodes connected):
  clone(1): map {1: 1'}; neighbours [2] -> clone(2)
    clone(2): map {1: 1', 2: 2'}; neighbours [1] -> clone(1) is in map -> 1'
      2'.neighbors = [1']
    1'.neighbors = [2']
  If we stored 1' in the map AFTER recursing, clone(1) inside clone(2) would recurse
  again forever.
```

### Edge cases

```
- null input -> null
- single node, no neighbours
- must not share any object with the input (test checks identity)
```

Full JavaScript solution with tests: [09_clone_graph.js](../solutions/09_clone_graph.js). Run it with `node 09_clone_graph.js` from the solutions folder.

</details>

## Common mistakes

- Creating a new copy every time a node is seen (no Map), producing duplicates or infinite loops on cycles.
- Wiring neighbours to original nodes instead of copies.
- Not handling a null input node.

## Related follow-ups

- [Copy List with Random Pointer](../../../15_Linked_Lists/03_Problems/02_Medium/16_copy_list_with_random_pointer.md) (15_Linked_Lists)
- [Clone N-ary Tree](../../../20_Trees/02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/04_clone_n_ary_tree.md) (20_Trees/02_N_Ary_Trees_And_Misc)
- [Keys and Rooms](04_keys_and_rooms.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
