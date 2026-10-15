# Find Eventual Safe States

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Medium |
| **Pattern** | reverse graph + Kahn / 3-colour DFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #802 — https://leetcode.com/problems/find-eventual-safe-states/ |
| **Solution file** | [03_find_eventual_safe_states.js](../solutions/03_find_eventual_safe_states.js) — open only after a real attempt |

## Problem

Directed graph given as graph[i] = list of nodes i points to. A node is "terminal" if
it has no outgoing edges. A node is "safe" if EVERY path from it leads to a terminal
node (i.e. you can never get stuck in a cycle). Return all safe nodes in ascending order.

## Examples

```
Input: [[1,2],[2,3],[5],[0],[5],[],[]]   Output: [2,4,5,6]
Explanation: 5 and 6 are terminal. 2 -> 5 and 4 -> 5 only reach terminals.
0,1,3 can enter the cycle 0 -> 1 -> 3 -> 0.
Input: [[1,2,3,4],[1,2],[3,4],[0,4],[]]   Output: [4]
```

## Constraints & clarifying questions

```
- Output sorted? (yes)
- Self loops? (a node with a self loop is unsafe)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reverse graph + Kahn / 3-colour DFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (3-colour DFS with memo)   O(V + E) time, O(V) space. DFS from each node.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (reverse graph + Kahn)   O(V + E) time, O(V + E) space. Flip every edge.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all terminal -> all nodes
- single node self loop -> []
- graph with no edges at all
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (3-colour DFS with memo)   O(V + E) time, O(V) space

```
DFS from each node. GRAY = on the current path. If we reach a gray node the current
node is unsafe. A node is safe iff all its neighbours are safe. Memoise the colour so
each node is resolved once: BLACK after the DFS returns, with safe[node] stored.
Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (reverse graph + Kahn)   O(V + E) time, O(V + E) space

```
Flip every edge. In the reversed graph, terminal nodes have in-degree 0... wait, no:
in the reversed graph the OUT-degree of the original becomes the in-degree. So:
  1. outdeg[i] = graph[i].length; reverse adjacency rev[j].push(i) for each i -> j.
  2. Queue every node with outdeg 0 (terminals). They are safe.
  3. Pop node u: for each predecessor p (rev[u]), decrement outdeg[p]; when it reaches
     0 ALL of p's successors have been proven safe -> p is safe, push it.
  4. Nodes never popped are stuck in / lead into cycles.

Dry run on [[1,2],[2,3],[5],[0],[5],[],[]]:
  outdeg [2,2,1,1,1,0,0]  rev: 5:[2,4] 0:[3] 1:[0] 2:[0,1] 3:[1]
  queue [5,6]
  pop 5: outdeg[2]=0 push 2, outdeg[4]=0 push 4
  pop 6: no predecessors
  pop 2: outdeg[0]=1, outdeg[1]=1
  pop 4: no predecessors
  done. safe = {2,4,5,6} sorted -> [2,4,5,6]
```

### Edge cases

```
- all terminal -> all nodes
- single node self loop -> []
- graph with no edges at all
```

Full JavaScript solution with tests: [03_find_eventual_safe_states.js](../solutions/03_find_eventual_safe_states.js). Run it with `node 03_find_eventual_safe_states.js` from the solutions folder.

</details>

## Common mistakes

- Running Kahn on the original graph: you must reverse edges (or count OUT-degrees) because terminal nodes are the starting point.
- Marking a node safe as soon as it is visited; with DFS, a node is safe only once it finishes BLACK.
- Forgetting to return the answer sorted in ascending order.

## Related follow-ups

- [Course Schedule](01_course_schedule.md)
- [Minimum Height Trees](04_minimum_height_trees.md)
- [Keys and Rooms](../../../24_Graph_Traversal/03_Problems/02_Medium/04_keys_and_rooms.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
