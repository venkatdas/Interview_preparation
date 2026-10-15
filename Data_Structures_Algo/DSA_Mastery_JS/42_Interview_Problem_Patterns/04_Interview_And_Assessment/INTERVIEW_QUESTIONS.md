# Interview Problem Patterns — Interview Questions

These are the "meta" questions interviewers ask while you solve: *why this approach, why not that
one, how do you know it is correct?* Answer each out loud in under two minutes, then compare with
the model answer. Back to the [pattern index](../README.md).

---

**1. You read a new problem. Walk me through how you decide which approach to use.**

<details><summary>Model answer</summary>

I restate it, then look at three things: the **input shape** (array, string, tree, graph, grid, intervals), the **question word** (all / count / min-max / exists), and the **constraint n**. The constraint tells me the budget: n <= 20 allows 2^n, n <= 10^4 allows O(n^2), n up to 10^5–10^6 needs O(n log n) or O(n). Then I match clues: "contiguous" -> window or prefix sums; "sorted" -> two pointers or binary search; "all combinations" -> backtracking; "minimum steps" -> BFS; "count ways / min cost" with overlapping choices -> DP. I state the brute force first and ask what work it repeats. See the [flowchart](../README.md).

</details>

**2. When does a sliding window fail, and what do you use instead?**

<details><summary>Model answer</summary>

When validity is not monotonic in the window size. The classic case: sum conditions with **negative numbers** — adding an element can lower the sum, so "grow until valid, then shrink" misses answers. For "sum equals k" I use prefix sums + a hash map; for "shortest subarray with sum >= k" with negatives I use prefix sums + a monotonic deque. Subsequence problems are never windows.

</details>

**3. Hash map or sorting + two pointers for Two Sum? Defend your choice.**

<details><summary>Model answer</summary>

Hash map: O(n) time, O(n) space, keeps original indices. Sorting + two pointers: O(n log n) time, O(1) extra space (if sorting in place is allowed) but loses indices unless I sort `[value, index]` pairs. If the input is already sorted, two pointers wins (O(n), O(1)). If memory is tight and indices are not needed, sorting. Otherwise the map.

</details>

**4. How do you convince me a greedy algorithm is correct?**

<details><summary>Model answer</summary>

With an exchange argument: take any optimal solution; if its first choice differs from the greedy choice, swap it for the greedy one and show the solution stays valid and no worse. Repeat for the rest. Before that, I try to break the greedy rule on small inputs (e.g. coins [1, 3, 4] for amount 6 breaks "largest coin first"). If I find a counterexample, I switch to DP.

</details>

**5. BFS vs DFS vs Dijkstra vs Bellman-Ford: when each?**

<details><summary>Model answer</summary>

BFS: shortest path when every edge costs the same, and level-by-level questions. DFS: reachability, components, cycle detection, topological order, backtracking — not shortest paths. Dijkstra: weighted shortest paths with non-negative weights, O((V + E) log V). Bellman-Ford: negative weights, negative-cycle detection, or "at most k edges" (run k rounds), O(V * E).

</details>

**6. What is "binary search on the answer", and what must be true to use it?**

<details><summary>Model answer</summary>

Instead of searching an array, I search the range of possible answers [lo, hi] using a feasibility check `can(x)`. It requires **monotonicity**: once `can(x)` is true, it stays true for bigger x (or the reverse). Examples: Koko's speed, ship capacity, split array largest sum. Cost: O(check * log(range)). I must choose bounds that surely contain the answer.

</details>

**7. Union-find or DFS for connected components?**

<details><summary>Model answer</summary>

For a static graph and one question, both are O(V + E); DFS is often simpler. Union-find wins when edges arrive **over time** and I answer connectivity after each one (near O(1) per operation with path compression and union by rank), or for Kruskal's MST. Union-find cannot handle edge deletions or directed reachability.

</details>

**8. Top-down memoization vs bottom-up tabulation: trade-offs?**

<details><summary>Model answer</summary>

Top-down is easier to derive from the recursion and only computes reachable states, but uses the call stack (JS overflows near ~10^4 frames) and has function-call overhead. Bottom-up needs a correct fill order but has no recursion limit and often allows rolling arrays to cut memory from O(n*m) to O(m). In interviews I often write top-down first, then convert if asked.

</details>

**9. A problem says "return all valid ...". Why is exponential time acceptable, and how do you make it faster?**

<details><summary>Model answer</summary>

The output itself can be exponential (2^n subsets, n! permutations), so no algorithm can beat the output size. I make it faster by **pruning**: sort and break when the remaining budget is exceeded, keep constraint sets for O(1) conflict checks (N-Queens), skip duplicates at the same depth, and stop branches that cannot reach the goal.

</details>

**10. Why do you avoid `array.shift()` in BFS in JavaScript?**

<details><summary>Model answer</summary>

`shift()` re-indexes the array, which is O(n) per call, turning BFS into O(n^2) on large inputs. I keep a `head` index into the queue array (or process level arrays). The same applies to deques for sliding window max.

</details>

**11. Monotonic stack: what is the invariant and why is it O(n)?**

<details><summary>Model answer</summary>

The stack keeps indices whose values are sorted (e.g. decreasing for "next greater"). Every element that breaks the order pops the elements it "beats", and each pop resolves that element's answer. Each index is pushed once and popped at most once, so the total work is O(n) even with the inner `while`.

</details>

**12. How do you recognize a DP problem, and what do you say first?**

<details><summary>Model answer</summary>

Clues: count ways, min/max cost, feasibility, choices at each step that lead to the same smaller subproblem. I first say the **state** in one sentence ("dp[i] = the cheapest way to cover days i..n"), then the **transition**, **base cases**, **fill order** and **where the answer lives**, then the complexity (#states x work per state).

</details>

**13. When would you use a heap instead of sorting?**

<details><summary>Model answer</summary>

When I only need the top k of n items (O(n log k) with a size-k heap), when items arrive as a stream, or when I repeatedly need the current best while inserting new items (Dijkstra, scheduling, merging k lists). If I need everything sorted once, sorting is simpler with the same O(n log n).

</details>

**14. You are stuck for 10 minutes. What do you do in the interview?**

<details><summary>Model answer</summary>

Say so, and fall back to a plan: write or describe the brute force and its complexity, run it on a small example by hand, and look for repeated work. Ask about constraints I may have missed (sorted? range of values? can I modify the input?). Try the pattern questions from the flowchart. A clear brute force with a correct complexity is worth far more than silence.

</details>

**15. How do you test your solution before saying "done"?**

<details><summary>Model answer</summary>

Dry run on the given example, then on edge cases: empty input, single element, all duplicates, negatives, already sorted / reverse sorted, disconnected graph or cycle, the maximum size (complexity check). In my own practice I also compare against the brute force on random inputs, like the tests in [patterns.test.js](../tests/patterns.test.js).

</details>
