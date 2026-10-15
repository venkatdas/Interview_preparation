# How To Solve A Problem

This is the workflow to use for **every** problem in this curriculum and in every interview.
Print it, keep it next to you, and follow it until it becomes automatic.
Copy `02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem/02_Implementations/problem_template.js` for each new problem.

---

## The 15 steps

| # | Step | What you actually do | Say out loud in an interview |
|---|------|----------------------|------------------------------|
| 1 | **Restate** | Say the problem in your own words. | "So I'm given X and I need to return Y, where..." |
| 2 | **Inputs, outputs, constraints** | Types, sizes (n up to 10^5? 10^9?), value ranges, can it be empty, sorted or not, duplicates allowed? | "What's the maximum size of the input? Can values be negative?" |
| 3 | **Clarify ambiguity** | Ask about ties, empty input, invalid input, what to return when no answer exists. | "If there is no valid answer, should I return -1 or an empty array?" |
| 4 | **Work examples by hand** | Take the given example AND make a tiny one of your own (n = 1, 2, 3). Write the expected output. | "Let me trace a small example to make sure I understand." |
| 5 | **Brute force** | The most obvious solution. Nested loops, try everything. It is always acceptable to start here. | "A brute force would be to try every pair, which is..." |
| 6 | **Complexity of brute force** | Time and auxiliary space. | "...O(n²) time and O(1) space." |
| 7 | **Find the bottleneck** | Which part is repeated? What do you recompute? What are you searching for again and again? | "The expensive part is searching for the complement inside the loop." |
| 8 | **Match a pattern / data structure** | Use the signals table below. Sorted → binary search / two pointers. Lookup → hash map. Nested/matching → stack. Min/max over window → monotonic deque / heap. Choices → DP/backtracking. | "Lookups suggest a hash map. That would make each check O(1)." |
| 9 | **Optimized approach** | Describe it fully in words BEFORE coding. Re-check against the examples. | "I'll iterate once, storing each number's index in a map..." |
| 10 | **Prove correctness** | State the **invariant**: what is always true after each step? Why does the loop/recursion end? Why can't it skip an answer? | "The invariant is: everything left of `i` has been processed and the map contains exactly those values." |
| 11 | **Dry run** | Trace your optimized algorithm on an example, writing the variables after each step. | "Let me walk through [2, 7, 11, 15] with target 9..." |
| 12 | **Edge cases** | Empty, one element, all equal, negatives, zeros, max size, already sorted, reversed, no answer, overflow. | "Edge cases: empty array returns [], duplicates like [3, 3]..." |
| 13 | **Implement cleanly** | Descriptive names, small helper functions, comments only where the *why* is not obvious. Write the tests first if you can. | Narrate as you type. Silence is the enemy. |
| 14 | **Analyze complexity again** | The real implementation may differ from the plan (e.g., you used `.includes` inside a loop). | "Final complexity: O(n) time, O(n) space for the map." |
| 15 | **Explain as in an interview** | 60-second summary: problem, approach, why it works, complexity, trade-offs. | "To summarize..." |

---

## Pattern signals (step 8 cheat sheet)

| Signal in the statement | Reach for | Folder |
|---|---|---|
| "sorted array", "find in sorted", "minimum X such that condition holds" | binary search / binary search on the answer | 10_Searching |
| "pair / triplet summing to", sorted input, "in-place" | two pointers | 06_Two_Pointers |
| "contiguous subarray / substring", "longest / shortest window", "at most k" | sliding window | 07_Sliding_Window |
| "sum of range", "subarray sum equals k", many range queries | prefix sums (+ hash map) | 08_Prefix_Sums_And_Difference_Arrays |
| "count / frequency / duplicates / seen before / group by" | hash map / hash set | 05_Hashing |
| "matching", "nested", "undo", "most recent", "next greater" | stack / monotonic stack | 16_Stacks, 18_Monotonic_Stacks_And_Queues |
| "first-come", "level by level", "shortest path (unweighted)" | queue / BFS | 17_Queues_And_Deques, 24_Graph_Traversal |
| "top k", "k-th largest", "merge k sorted", "median of stream" | heap | 19_Heaps_And_Priority_Queues |
| "prefix", "autocomplete", "dictionary of words" | trie | 22_Tries |
| "all combinations / permutations / subsets", "place queens", "solve the puzzle" | backtracking | 13_Backtracking |
| "number of ways", "minimum cost", "longest … subsequence", "can we reach" with overlapping choices | dynamic programming | 29_Dynamic_Programming |
| "choose the best at each step", "schedule / intervals / minimum number of" | greedy (+ sorting) | 28_Greedy_Algorithms, 31_Intervals |
| "cities / roads / network / dependencies / prerequisites" | graph (BFS/DFS/topological/union-find/Dijkstra) | 23–27 |
| "connected components", "are they in the same group", dynamic merging | union-find | 27_Union_Find_Disjoint_Set |
| "XOR", "single number", "bits", "power of two" | bit manipulation | 14_Bit_Manipulation |
| "range update + range query", "many updates and queries" | segment tree / Fenwick tree | 34_Range_Query_Data_Structures |
| n ≤ 20 with "subsets" | bitmask DP / meet in the middle | 29_Dynamic_Programming, 32_Meet_In_The_Middle |
| "cycle in linked list", "find duplicate without extra space" | fast & slow pointers | 15_Linked_Lists |

Constraint hints: n ≤ 20 → exponential OK (2^n). n ≤ 500 → O(n³). n ≤ 5,000 → O(n²). n ≤ 10^5..10^6 → O(n log n) or O(n). n ≥ 10^9 → O(log n) or O(1), think math or binary search.

---

## Checklist (tick before you say "done")

- [ ] I restated the problem and confirmed inputs/outputs.
- [ ] I asked about empty input, duplicates, negatives, ties, and "no answer".
- [ ] I traced at least two examples by hand, including a tiny one.
- [ ] I gave a brute force and its complexity before optimizing.
- [ ] I named the bottleneck and the pattern that removes it.
- [ ] I stated the invariant / why the algorithm is correct.
- [ ] I dry-ran the final algorithm on an example.
- [ ] I listed edge cases and my code handles them.
- [ ] Variable names are descriptive; no magic numbers.
- [ ] I stated the final time and space complexity and the trade-offs.
- [ ] I ran the tests (`node file.js`) and they print ✓.

---

## Worked example: Two Sum

**Problem.** Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Exactly one answer exists; you may not use the same element twice.

1. **Restate.** Find two different positions whose values sum to the target. Return those positions.
2. **I/O & constraints.** Input: array of ints (n up to 10^4, values in ±10^9), int target. Output: array of two indices. Exactly one solution.
3. **Clarify.** Order of the returned indices? (any). Negative numbers? (yes). Can nums be empty? (no, at least 2).
4. **Examples.** `[2,7,11,15], 9 → [0,1]`. Tiny: `[3,3], 6 → [0,1]`. `[-1, 5], 4 → [0,1]`.
5. **Brute force.** For every i, for every j > i, check `nums[i] + nums[j] === target`.
6. **Complexity.** O(n²) time, O(1) space.
7. **Bottleneck.** For each `i` we *search* the rest of the array for `target - nums[i]`. Searching is the repeated expensive step.
8. **Pattern.** "Have I seen value X?" → hash map gives O(1) lookup.
9. **Optimized.** Walk once. For each number compute `need = target - num`. If `need` is in the map, done. Otherwise store `num → index` in the map.
10. **Correctness.** Invariant: when we are at index `i`, the map contains every value from indices `0..i-1`. So if a partner exists to the left we find it now; if it exists to the right, we'll find the current number when we reach the partner. Every pair is checked exactly once, from its right element. Terminates after n steps.
11. **Dry run.** `[2,7,11,15]`, 9: i=0 num=2 need=7 not in map → map {2:0}. i=1 num=7 need=2 in map → return [0,1]. ✓
12. **Edge cases.** Duplicates `[3,3]` works because we check *before* inserting. Negatives fine. Target zero fine. Same element twice prevented by checking before inserting.
13. **Implement.**

```js
function twoSum(nums, target) {
  const indexOf = new Map();                 // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (indexOf.has(need)) return [indexOf.get(need), i];
    indexOf.set(nums[i], i);                 // insert AFTER checking: never pairs an element with itself
  }
  return [];                                 // no answer (problem says this cannot happen)
}
```

14. **Complexity again.** One pass, O(1) map operations → O(n) time, O(n) space.
15. **Explain.** "I use a hash map from value to index. For each element I check whether its complement was seen earlier; if so I return both indices, otherwise I record the element. This is one pass, O(n) time and O(n) extra space, versus O(n²) for checking every pair. If the array were sorted and I needed O(1) space, I'd use two pointers instead."

---

## When you are stuck (the 5-minute protocol)

1. Re-read the constraints. Small n? Then brute force / backtracking is the intended answer.
2. Solve a smaller version (n = 1, 2, 3). What changes when you add one more element? That is often the recurrence.
3. Sort the input in your head. Does the problem become easier? Then sorting (n log n) is probably allowed.
4. Say what you are recomputing. Cache it (hash map, prefix sum, memo).
5. Draw it. Arrays as boxes, trees as nodes, graphs as circles and lines. Most bugs are visible in a drawing.
6. Still stuck after 30 minutes? Open Hint 1 of the problem page. Never open the solution before you have written a brute force.
