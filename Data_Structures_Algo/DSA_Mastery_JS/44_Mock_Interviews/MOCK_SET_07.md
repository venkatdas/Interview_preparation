# Mock Interview Set 07 — Advanced Graphs

**Time:** 75 minutes total. Problem 1: 35 min. Problem 2: 30 min. 10 min to review.
**Covers:** [`26_Topological_Sorting`](../26_Topological_Sorting/README.md), [`25_Graph_Algorithms/01_Shortest_Paths`](../25_Graph_Algorithms/01_Shortest_Paths/README.md) (and [`05_Hashing`](../05_Hashing/README.md), [`19_Heaps_And_Priority_Queues`](../19_Heaps_And_Priority_Queues/README.md) underneath)
**When:** after the 12-week plan, or after finishing [Mixed Set 05](../43_Mixed_Problem_Sets/03_Problems/set_05/README.md)

**Rules**

- Timer on. Before any code, say out loud: directed or undirected? weighted? can it have cycles?
- Build the graph explicitly (adjacency list) and show it on one example.
- Open the Hints only when the problem's time is half gone and you have nothing.
- Score yourself afterwards with the [rubric](RUBRIC.md).

---

## Problem 1 — Alien Dictionary (LeetCode 269, Hard) — 35 min

**Links:** [LeetCode #269](https://leetcode.com/problems/alien-dictionary/) · [curriculum statement + hints](../26_Topological_Sorting/03_Problems/03_Hard/08_alien_dictionary.md) (open after the mock)

An alien language uses lowercase English letters in an unknown order. You get a list of words that is
**already sorted** in the alien order. Return any string of the letters that appear in the words, in an order
consistent with the list. If no order is possible, return `""`.

```
Input:  ["wrt", "wrf", "er", "ett", "rftt"]   Output: "wertf"
Input:  ["z", "x"]                             Output: "zx"
Input:  ["z", "x", "z"]                        Output: ""      Explanation: z < x and x < z is a cycle
Input:  ["abc", "ab"]                          Output: ""      Explanation: a longer word before its own prefix is invalid
```

**Clarifying questions you should ask**

- Do letters that never get compared still need to appear in the output? (yes, anywhere)
- If several orders are valid, can I return any? (yes)
- Is a prefix appearing after the longer word invalid input or "no order"? (return `""`)

<details>
<summary>Hints</summary>

1. Compare only **adjacent** words. The first position where they differ gives one edge `a -> b` ("a comes before b"). Nothing after that position tells you anything.
2. Collect every letter as a node first (so isolated letters are not lost), then add edges.
3. Topological sort (Kahn's algorithm with in-degrees). If the output is shorter than the number of distinct letters, there is a cycle -> `""`.
4. Prefix check: if no differing position is found and the first word is longer than the second, return `""`.

</details>

**Expected complexity:** O(C) time where C = total characters in all words (edges are at most n - 1), O(1) extra space for the 26-letter graph (O(U + E) in general).

**Follow-up questions an interviewer may ask**

- Return the lexicographically smallest valid order. (min-heap instead of a queue in Kahn)
- How do you know the order is **unique**? (the Kahn queue never holds more than one node)
- Why compare only adjacent words, not all pairs? (sortedness is transitive; all-pairs adds no information and costs O(n^2))
- Do it with DFS instead. (three colors; a "visiting" neighbour means a cycle; reverse the post-order)

---

## Problem 2 — Network Delay Time (LeetCode 743, Medium) — 30 min

**Links:** [LeetCode #743](https://leetcode.com/problems/network-delay-time/) · [curriculum statement + hints](../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/01_network_delay_time.md) (open after the mock)

There are `n` nodes labelled `1..n` and a list of directed, weighted edges `[u, v, w]` (a signal from `u` reaches
`v` after `w` time). A signal is sent from node `k`. Return the time it takes for **all** nodes to receive it, or
`-1` if some node never does.

```
Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2   Output: 2
Input: times = [[1,2,1]], n = 2, k = 1                   Output: 1
Input: times = [[1,2,1]], n = 2, k = 2                   Output: -1
```

**Clarifying questions you should ask**

- Are weights non-negative? (yes, 0..100) -> Dijkstra is allowed.
- Nodes 1-indexed? (yes; easy off-by-one trap)
- Can there be several edges between the same pair? (no, but your code should not care)

<details>
<summary>Hints</summary>

1. "Time for all nodes" = the **largest** shortest-path distance from `k`.
2. Non-negative weights + single source -> Dijkstra with a min-heap of `[dist, node]`.
3. Skip stale heap entries (`d > dist[node]`). The answer is `max(dist)`, or `-1` if any is still `Infinity`.
4. Tiny graphs: Bellman-Ford (relax all edges n - 1 times) is O(V·E) and simpler to write under pressure. Say both.

</details>

**Expected complexity:** O(E log V) time with a binary heap, O(V + E) space.

**Follow-up questions an interviewer may ask**

- What if some weights were negative? (Bellman-Ford; Dijkstra's "pop means final" breaks)
- Only care about one target node? (stop when it is popped)
- At most `k` edges allowed on the path? (Bellman-Ford limited to k rounds, LeetCode 787)
- Return the actual paths? (store a parent array during relaxation)

---

## Self-review (10 min)

- [ ] I extracted exactly one edge per adjacent pair, and handled the prefix case.
- [ ] I included letters with no edges in the alien order.
- [ ] I used the "output length < node count" check to detect cycles.
- [ ] I explained why Dijkstra needs non-negative weights.
- [ ] I finished both problems within time.

Fill in the [self-review template](SELF_REVIEW_TEMPLATE.md) and score yourself with the [rubric](RUBRIC.md).
