# Pattern Identification Quiz

25 short problem descriptions. For each one, write down **the pattern** and **the target
complexity** before opening the answer. Aim for 60 seconds per question. Score 1 point for the
right pattern family; 22+ means you are ready for the [mock interviews](../../44_Mock_Interviews).
Lessons: [pattern index](../README.md).

---

**1.** Given an unsorted array and a number k, return true if any two distinct elements differ by exactly k.

<details><summary>Answer</summary>

**Hash map / set** ([01](../01_Concepts/patterns/01_hash_map_and_frequency_counting.md)): for each x, check `x + k` and `x - k` in a set (careful with k = 0: need a count of 2). O(n).

</details>

**2.** A sorted array of integers; return the number of pairs whose sum is less than a target.

<details><summary>Answer</summary>

**Two pointers** ([02](../01_Concepts/patterns/02_two_pointers.md)): when `a[l] + a[r] < target`, add `r - l` and move l. O(n).

</details>

**3.** Find the length of the longest substring containing at most two distinct characters.

<details><summary>Answer</summary>

**Sliding window** ([03](../01_Concepts/patterns/03_sliding_window.md)) with a count map, shrink while distinct > 2. O(n).

</details>

**4.** An array with negative numbers; count subarrays whose sum is divisible by 7.

<details><summary>Answer</summary>

**Prefix sums + map of remainders** ([04](../01_Concepts/patterns/04_prefix_sums_and_difference_arrays.md)); normalize negative remainders with `((x % 7) + 7) % 7`. O(n).

</details>

**5.** A function maps each number to the sum of the cubes of its digits. Starting from n, does the sequence ever reach 1, or does it loop?

<details><summary>Answer</summary>

**Fast & slow pointers** ([05](../01_Concepts/patterns/05_fast_and_slow_pointers.md)) on the implicit sequence (or a visited set). O(1) extra memory with Floyd.

</details>

**6.** Workers must finish n tasks in order within H hours; each hour a worker processes up to s units. Find the minimum s.

<details><summary>Answer</summary>

**Binary search on the answer** ([06](../01_Concepts/patterns/06_binary_search_and_search_on_answer.md)) with a feasibility check. O(n log(max)).

</details>

**7.** Choose the maximum number of talks to attend; talks are [start, end] and you cannot be in two at once.

<details><summary>Answer</summary>

**Sorting + greedy** ([07](../01_Concepts/patterns/07_sorting_and_greedy_selection.md)): sort by end time, take every talk that starts after the last end. O(n log n).

</details>

**8.** Given booked time slots, return all the free gaps between 9:00 and 17:00.

<details><summary>Answer</summary>

**Intervals** ([08](../01_Concepts/patterns/08_intervals_and_sweep_line.md)): sort, merge, read the gaps. O(n log n).

</details>

**9.** For each building, how many buildings to its right can it see before a taller-or-equal one blocks the view?

<details><summary>Answer</summary>

**Monotonic stack** ([09](../01_Concepts/patterns/09_monotonic_stack_and_queue.md)). O(n).

</details>

**10.** A stream of scores arrives; after each one, report the 3rd highest score so far.

<details><summary>Answer</summary>

**Heap / top-K** ([10](../01_Concepts/patterns/10_top_k_and_heaps.md)): min-heap of size 3, the root is the answer. O(log k) per score.

</details>

**11.** Each of 500 servers has a sorted log of timestamps. Produce one sorted log.

<details><summary>Answer</summary>

**K-way merge** ([11](../01_Concepts/patterns/11_k_way_merge.md)): heap of the current head of each log. O(N log k).

</details>

**12.** Return every way to split a string into pieces that are all valid dictionary words.

<details><summary>Answer</summary>

**Backtracking** ([12](../01_Concepts/patterns/12_recursion_and_backtracking.md)), optionally memoized by start index (Word Break II). Exponential output.

</details>

**13.** For a binary tree, return the largest value on each level.

<details><summary>Answer</summary>

**Tree BFS by levels** ([13](../01_Concepts/patterns/13_tree_traversal_and_properties.md)). O(n).

</details>

**14.** Cities connected by roads with travel times; find the fastest route from city A to city B.

<details><summary>Answer</summary>

**Dijkstra** ([14](../01_Concepts/patterns/14_graph_traversal_and_shortest_paths.md)) — non-negative weights. O((V + E) log V).

</details>

**15.** Given recipe steps and "step x requires step y", output a valid order or report it is impossible.

<details><summary>Answer</summary>

**Topological sort** ([15](../01_Concepts/patterns/15_topological_sort.md)) — Kahn's algorithm; fewer than n output means a cycle. O(V + E).

</details>

**16.** Users merge accounts when they share a phone number. How many distinct people are there?

<details><summary>Answer</summary>

**Union-find** ([16](../01_Concepts/patterns/16_union_find.md)): union accounts that share a phone, count roots. Near O(n).

</details>

**17.** Count the number of ways to make change for an amount using unlimited coins of given denominations.

<details><summary>Answer</summary>

**DP — unbounded knapsack, combinations** ([17](../01_Concepts/patterns/17_dynamic_programming_families.md)): coins in the outer loop. O(amount * coins).

</details>

**18.** Every number appears three times except one which appears once. Find it in O(1) extra space.

<details><summary>Answer</summary>

**Bit manipulation** ([18](../01_Concepts/patterns/18_bit_manipulation.md)): count each bit mod 3. O(32 n).

</details>

**19.** Print an n x m matrix in a zigzag order along anti-diagonals.

<details><summary>Answer</summary>

**Matrix traversal** ([19](../01_Concepts/patterns/19_matrix_traversal.md)): group cells by `r + c`, reverse every other group. O(nm).

</details>

**20.** Find the length of the longest sequence of elements (not necessarily adjacent, original order kept) that is strictly increasing.

<details><summary>Answer</summary>

**Subsequence -> DP / patience sorting** ([20](../01_Concepts/patterns/20_subarray_vs_subsequence.md)): LIS in O(n log n).

</details>

**21.** Count how many times a DNA pattern of length 10^5 occurs in a genome of length 10^6 (overlaps allowed).

<details><summary>Answer</summary>

**String matching — KMP / Z / rolling hash** ([21](../01_Concepts/patterns/21_string_matching_and_tries.md)). O(n + m).

</details>

**22.** A 3x3 sliding tile puzzle: find the minimum number of moves to reach the solved board.

<details><summary>Answer</summary>

**State-space BFS** ([22](../01_Concepts/patterns/22_state_space_search_and_pruning.md)): board as a string key, 9!/2 reachable states. O(states).

</details>

**23.** For each element of an array, the product of all other elements, without division.

<details><summary>Answer</summary>

**Prefix and suffix products** ([04](../01_Concepts/patterns/04_prefix_sums_and_difference_arrays.md)). O(n).

</details>

**24.** In a grid of land and water, find the size of the largest lake (connected water cells, 4 directions).

<details><summary>Answer</summary>

**Matrix traversal / graph DFS-BFS** ([19](../01_Concepts/patterns/19_matrix_traversal.md), [14](../01_Concepts/patterns/14_graph_traversal_and_shortest_paths.md)). O(R * C).

</details>

**25.** Given n <= 16 cities and the distance between each pair, find the shortest route that visits every city once and returns to the start.

<details><summary>Answer</summary>

**Bitmask DP** ([17](../01_Concepts/patterns/17_dynamic_programming_families.md), [18](../01_Concepts/patterns/18_bit_manipulation.md)): `dp[mask][last]`. O(2^n * n^2).

</details>

---

## Mastery checklist

- [ ] I scored at least 22 / 25 on this quiz without looking at the lessons.
- [ ] I can redraw the [decision flowchart](../README.md) from memory.
- [ ] For every one of the 22 patterns I can state one case where it does NOT apply.
- [ ] I typed every template in `pattern_templates.js` from memory and the tests passed.
- [ ] I named the pattern correctly in Step 0 for at least 8 of the 10 drills.
