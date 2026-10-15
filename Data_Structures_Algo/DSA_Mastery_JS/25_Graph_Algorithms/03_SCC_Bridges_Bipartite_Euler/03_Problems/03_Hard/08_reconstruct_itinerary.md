# Reconstruct Itinerary

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Hard |
| **Pattern** | Eulerian path (Hierholzer) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #332 — https://leetcode.com/problems/reconstruct-itinerary/ |
| **Solution file** | [08_reconstruct_itinerary.js](../solutions/08_reconstruct_itinerary.js) — open only after a real attempt |

## Problem

tickets[i] = [from, to] are airline tickets (directed edges). Starting from "JFK",
use EVERY ticket exactly once and return the itinerary. If several are possible,
return the one that is lexicographically smallest when read as a single string.
A valid itinerary is guaranteed to exist.

## Examples

```
Input: [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
Output: ["JFK","MUC","LHR","SFO","SJC"]
Input: [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]
Output: ["JFK","ATL","JFK","SFO","ATL","SFO"]
Explanation: ["JFK","SFO","ATL","JFK","ATL","SFO"] also uses all tickets but is larger.
```

## Constraints & clarifying questions

```
- Duplicate tickets? (yes, each is a separate edge)
- Always solvable? (yes - an Eulerian path from JFK exists)

"Use every edge exactly once" = EULERIAN PATH.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Eulerian path (Hierholzer)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (backtracking in lexical order)   exponential worst case. Sort each adjacency list.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Hierholzer)   O(E log E) for sorting + O(E) walk. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single ticket -> [from, to]
- a cycle back to JFK plus a dead end: greedy without Hierholzer would get stuck;
  the post-order fixes it (example 2)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (backtracking in lexical order)   exponential worst case

```
Sort each adjacency list. DFS from JFK trying destinations in order, marking tickets
used, backtracking when stuck. The first complete path found is the answer. Works, but
can blow up on adversarial inputs with many dead ends.
```

### APPROACH 2 — Optimal (Hierholzer)   O(E log E) for sorting + O(E) walk

```
1. adjacency: from -> sorted list of destinations.
  2. Walk greedily from JFK, always taking the smallest unused destination.
  3. When a node has no unused tickets, it is DONE: append it to the result.
  4. The result, reversed, is the itinerary.
Why it works: a dead end can only be the final airport (or a loop end that gets
spliced in automatically by the post-order).

Dry run example 2:
  adj: JFK [ATL, SFO], ATL [JFK, SFO], SFO [ATL]
  stack JFK -> ATL -> JFK -> SFO -> ATL -> SFO (stuck): result [SFO]
  back: ATL stuck -> [SFO, ATL]; SFO stuck -> [SFO, ATL, SFO]; JFK stuck -> [.., JFK]
  ATL stuck -> [.., ATL]; JFK stuck -> [.., JFK]
  reversed: JFK ATL JFK SFO ATL SFO
```

### Edge cases

```
- single ticket -> [from, to]
- a cycle back to JFK plus a dead end: greedy without Hierholzer would get stuck;
  the post-order fixes it (example 2)
```

Full JavaScript solution with tests: [08_reconstruct_itinerary.js](../solutions/08_reconstruct_itinerary.js). Run it with `node 08_reconstruct_itinerary.js` from the solutions folder.

</details>

## Common mistakes

- Plain greedy DFS that appends nodes on entry; it gets stuck in dead ends. Append on EXIT and reverse.
- Forgetting to sort destinations, so the result is not lexically smallest.
- Removing tickets with `array.shift()` in a loop (O(n) each); keep a pointer or sort descending and `pop()`.

## Related follow-ups

- [Course Schedule II](../../../../26_Topological_Sorting/03_Problems/02_Medium/02_course_schedule_ii.md)
- [Critical Connections in a Network](07_critical_connections.md)
- [Alien Dictionary](../../../../26_Topological_Sorting/03_Problems/03_Hard/08_alien_dictionary.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
