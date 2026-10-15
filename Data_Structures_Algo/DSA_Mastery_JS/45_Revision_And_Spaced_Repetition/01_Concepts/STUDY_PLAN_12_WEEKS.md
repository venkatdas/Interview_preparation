# Study Plan: 12 Weeks from Scratch to Advanced

This plan walks the curriculum folders in order. Each week names the exact folders to study.

**Assumptions**

- Weekdays: 2 hours/day (Mon–Fri = 10 h)
- Weekends: 4 hours/day (Sat–Sun = 8 h)
- Total: ~18 h/week, ~216 h over 12 weeks
- You start from zero. If you already know a topic, finish its problems faster and move on; do not skip the problems.

**Every day starts with 15–20 minutes of re-solves** (spaced repetition, see [SPACED_REPETITION_SCHEDULE.md](SPACED_REPETITION_SCHEDULE.md)).
Those minutes are included in the hours below.

**Every 2 weeks ends with a mock interview** from [44_Mock_Interviews](../../44_Mock_Interviews). Do it on Sunday, timed, 60 minutes, no notes.

---

## Overview

| Week | Folders | Theme | Checkpoint |
|------|---------|-------|------------|
| 1 | [00_Foundations/*](../../00_Foundations), [03_Arrays](../../03_Arrays) | How to think, Big-O, JS tools, arrays | Explain O(n) vs O(n^2) with an example |
| 2 | [04_Strings](../../04_Strings), [05_Hashing](../../05_Hashing) | Strings and hash maps | **Mock set 01** |
| 3 | [06_Two_Pointers](../../06_Two_Pointers), [07_Sliding_Window](../../07_Sliding_Window), [08_Prefix_Sums_And_Difference_Arrays](../../08_Prefix_Sums_And_Difference_Arrays) | Array patterns | Name the pattern from the problem statement |
| 4 | [13_Backtracking](../../13_Backtracking), [11_Sorting](../../11_Sorting) | Recursion, sorting | **Mock set 02** |
| 5 | [10_Searching](../../10_Searching), [15_Linked_Lists](../../15_Linked_Lists) | Searching, pointers | Write binary search bug-free in 3 min |
| 6 | [16_Stacks](../../16_Stacks), [17_Queues_And_Deques](../../17_Queues_And_Deques), [20_Trees/01_Binary_Trees](../../20_Trees/01_Binary_Trees) | Stacks, queues, trees | **Mock set 03** |
| 7 | [21_Binary_Search_Trees](../../21_Binary_Search_Trees), [20_Trees/02_N_Ary_Trees_And_Misc](../../20_Trees/02_N_Ary_Trees_And_Misc), [19_Heaps_And_Priority_Queues](../../19_Heaps_And_Priority_Queues), [22_Tries](../../22_Tries) | Trees, heaps, tries | Write MinHeap + Trie from memory |
| 8 | [24_Graph_Traversal](../../24_Graph_Traversal), [26_Topological_Sorting](../../26_Topological_Sorting), [27_Union_Find_Disjoint_Set/01_Union_Find_Basics](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics) | Graph basics | **Mock set 04** |
| 9 | [25_Graph_Algorithms/01_Shortest_Paths](../../25_Graph_Algorithms/01_Shortest_Paths), [25_Graph_Algorithms/02_Minimum_Spanning_Trees](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees), [25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler), [28_Greedy_Algorithms](../../28_Greedy_Algorithms), [31_Intervals](../../31_Intervals) | Advanced graphs, greedy, intervals | Dijkstra from memory |
| 10 | [29_Dynamic_Programming/01_One_Dimensional_DP](../../29_Dynamic_Programming/01_One_Dimensional_DP), [29_Dynamic_Programming/02_Knapsack](../../29_Dynamic_Programming/02_Knapsack), [29_Dynamic_Programming/03_Strings_And_Sequences](../../29_Dynamic_Programming/03_Strings_And_Sequences) | DP part 1 | **Mock set 05** |
| 11 | [29_Dynamic_Programming/04_Grid_DP](../../29_Dynamic_Programming/04_Grid_DP), [29_Dynamic_Programming/05_Interval_DP](../../29_Dynamic_Programming/05_Interval_DP), [29_Dynamic_Programming/06_Advanced_DP](../../29_Dynamic_Programming/06_Advanced_DP), [14_Bit_Manipulation](../../14_Bit_Manipulation), [09_Matrix_And_Multidimensional_Arrays](../../09_Matrix_And_Multidimensional_Arrays) | DP part 2, bits, matrices | Explain top-down vs bottom-up |
| 12 | [34_Range_Query_Data_Structures](../../34_Range_Query_Data_Structures), [35_Advanced_Data_Structures](../../35_Advanced_Data_Structures), [33_String_Algorithms_Advanced](../../33_String_Algorithms_Advanced), [41_Advanced_Algorithm_Design](../../41_Advanced_Algorithm_Design), [42_Interview_Problem_Patterns](../../42_Interview_Problem_Patterns), core 75 sweep | Polish and review | **Mock set 06** |

---

## Week 1 — Foundations + Arrays

Folders: [02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem](../../02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem), [01_Complexity_Analysis/01_Time_Complexity](../../01_Complexity_Analysis/01_Time_Complexity), [01_Complexity_Analysis/02_Space_Complexity](../../01_Complexity_Analysis/02_Space_Complexity),
[00_Foundations/01_JavaScript_For_DSA](../../00_Foundations/01_JavaScript_For_DSA), [00_Foundations/04_Mathematics_For_DSA](../../00_Foundations/04_Mathematics_For_DSA), [03_Arrays](../../03_Arrays)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | Read [02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem](../../02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem). Read [01_Complexity_Analysis/01_Time_Complexity](../../01_Complexity_Analysis/01_Time_Complexity). Run its .js file. |
| Tue | 2 | Read [01_Complexity_Analysis/02_Space_Complexity](../../01_Complexity_Analysis/02_Space_Complexity) and [00_Foundations/01_JavaScript_For_DSA](../../00_Foundations/01_JavaScript_For_DSA). Practice: Map, Set, array methods, sorting with comparator. |
| Wed | 2 | Read [00_Foundations/04_Mathematics_For_DSA](../../00_Foundations/04_Mathematics_For_DSA) (gcd, modulo, primes). Read [03_Arrays/README.md](../../03_Arrays/README.md). Run the implementation file. |
| Thu | 2 | [03_Arrays/03_Problems](../../03_Arrays/03_Problems) 01–03 (timeboxed). |
| Fri | 2 | [03_Arrays/03_Problems](../../03_Arrays/03_Problems) 04–06. |
| Sat | 4 | [03_Arrays/03_Problems](../../03_Arrays/03_Problems) 07–10. Review: write Big-O of every solution you wrote this week. |
| Sun | 4 | Finish [03_Arrays/03_Problems](../../03_Arrays/03_Problems). Re-solve problems 01–03 from a blank file. Update `PROGRESS.md` (curriculum root). |

**Checkpoint:** You can look at a nested loop and say its complexity, and explain why `arr.shift()` is O(n).

---

## Week 2 — Strings + Hashing

Folders: [04_Strings](../../04_Strings), [05_Hashing](../../05_Hashing)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [04_Strings/README.md](../../04_Strings/README.md) + implementation. Problems 01–02. |
| Tue | 2 | [04_Strings/03_Problems](../../04_Strings/03_Problems) 03–05. |
| Wed | 2 | [04_Strings/03_Problems](../../04_Strings/03_Problems) 06–08. |
| Thu | 2 | [05_Hashing/README.md](../../05_Hashing/README.md) + implementation (how a hash map works). Problems 01–02. |
| Fri | 2 | [05_Hashing/03_Problems](../../05_Hashing/03_Problems) 03–05. |
| Sat | 4 | [05_Hashing/03_Problems](../../05_Hashing/03_Problems) 06–10. Finish any string problems left. |
| Sun | 4 | **Mock interview: [44_Mock_Interviews/MOCK_SET_01.md](../../44_Mock_Interviews/MOCK_SET_01.md)** (60 min). Then review + re-solves. |

**Checkpoint:** Two Sum, Valid Anagram, Group Anagrams solved from memory in under 10 min each.

---

## Week 3 — Two Pointers, Sliding Window, Prefix Sum

Folders: [06_Two_Pointers](../../06_Two_Pointers), [07_Sliding_Window](../../07_Sliding_Window), [08_Prefix_Sums_And_Difference_Arrays](../../08_Prefix_Sums_And_Difference_Arrays)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [06_Two_Pointers/README.md](../../06_Two_Pointers/README.md). Problems 01–03. |
| Tue | 2 | [06_Two_Pointers/03_Problems](../../06_Two_Pointers/03_Problems) 04–07. |
| Wed | 2 | [07_Sliding_Window/README.md](../../07_Sliding_Window/README.md). Problems 01–03. |
| Thu | 2 | [07_Sliding_Window/03_Problems](../../07_Sliding_Window/03_Problems) 04–07. |
| Fri | 2 | [08_Prefix_Sums_And_Difference_Arrays/README.md](../../08_Prefix_Sums_And_Difference_Arrays/README.md). Problems 01–03. |
| Sat | 4 | Finish [07_Sliding_Window](../../07_Sliding_Window) and [08_Prefix_Sums_And_Difference_Arrays](../../08_Prefix_Sums_And_Difference_Arrays) problems. |
| Sun | 4 | Pattern drill: open [the pattern lessons](../../42_Interview_Problem_Patterns/README.md) 02–04, read the three patterns, solve 2 "practice more" problems for each. Re-solves. |

**Checkpoint:** Given a problem statement, you can say "fixed window", "variable window", "opposite-ends two pointers", or "prefix sum" in 30 seconds.

---

## Week 4 — Recursion, Backtracking, Sorting

Folders: [13_Backtracking](../../13_Backtracking), [11_Sorting](../../11_Sorting)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [13_Backtracking/README.md](../../13_Backtracking/README.md). Trace a recursion tree on paper. Problems 01–02. |
| Tue | 2 | Problems 03–05 (subsets, permutations, combinations). |
| Wed | 2 | Problems 06–08 (combination sum, word search, N-Queens style). |
| Thu | 2 | [11_Sorting/README.md](../../11_Sorting/README.md). Implement merge sort and quick sort from memory. |
| Fri | 2 | [11_Sorting/03_Problems](../../11_Sorting/03_Problems) 01–04. |
| Sat | 4 | Finish both folders' problems. |
| Sun | 4 | **Mock interview: [44_Mock_Interviews/MOCK_SET_02.md](../../44_Mock_Interviews/MOCK_SET_02.md)**. Review + re-solves. |

**Checkpoint:** You can write the backtracking skeleton (choose, explore, un-choose) without looking.

---

## Week 5 — Binary Search + Linked Lists

Folders: [10_Searching](../../10_Searching), [15_Linked_Lists](../../15_Linked_Lists)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [10_Searching/README.md](../../10_Searching/README.md). Write classic + lower bound + upper bound from memory. Problems 01–02. |
| Tue | 2 | Problems 03–06 (rotated array, search on answer). |
| Wed | 2 | Finish [10_Searching/03_Problems](../../10_Searching/03_Problems). |
| Thu | 2 | [15_Linked_Lists/README.md](../../15_Linked_Lists/README.md) + implementation. Problems 01–03. |
| Fri | 2 | Problems 04–07 (reverse, middle, cycle, merge). |
| Sat | 4 | Problems 08–12 (reorder, remove nth, k-group). |
| Sun | 4 | Finish linked lists. Re-solve all binary search problems. Tracker update. |

**Checkpoint:** Binary search with `left <= right` and no off-by-one in 3 minutes. Reverse a linked list in 2 minutes.

---

## Week 6 — Stacks, Queues, Binary Tree Basics

Folders: [16_Stacks](../../16_Stacks), [17_Queues_And_Deques](../../17_Queues_And_Deques), [20_Trees/01_Binary_Trees](../../20_Trees/01_Binary_Trees)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [16_Stacks/README.md](../../16_Stacks/README.md) + `stack.js`. Problems 01–04. |
| Tue | 2 | Problems 05–09 (monotonic stack). |
| Wed | 2 | Problems 10–13. [17_Queues_And_Deques/README.md](../../17_Queues_And_Deques/README.md) + implementation. |
| Thu | 2 | [17_Queues_And_Deques/03_Problems](../../17_Queues_And_Deques/03_Problems) 01–05. |
| Fri | 2 | [20_Trees/01_Binary_Trees/README.md](../../20_Trees/01_Binary_Trees/README.md). Write the 4 traversals (pre, in, post, level) from memory. |
| Sat | 4 | [20_Trees/01_Binary_Trees/03_Problems](../../20_Trees/01_Binary_Trees/03_Problems) 01–06. |
| Sun | 4 | **Mock interview: [44_Mock_Interviews/MOCK_SET_03.md](../../44_Mock_Interviews/MOCK_SET_03.md)**. Finish tree basics problems. |

**Checkpoint:** State the monotonic stack invariant out loud. Write BFS on a tree with a queue in 3 minutes.

---

## Week 7 — BST, N-ary Trees, Heaps, Tries

Folders: [21_Binary_Search_Trees](../../21_Binary_Search_Trees), [20_Trees/02_N_Ary_Trees_And_Misc](../../20_Trees/02_N_Ary_Trees_And_Misc), [19_Heaps_And_Priority_Queues](../../19_Heaps_And_Priority_Queues), [22_Tries](../../22_Tries)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [21_Binary_Search_Trees/README.md](../../21_Binary_Search_Trees/README.md). Problems 01–04. |
| Tue | 2 | Finish BST problems. [20_Trees/02_N_Ary_Trees_And_Misc](../../20_Trees/02_N_Ary_Trees_And_Misc) README + problems 01–03. |
| Wed | 2 | [19_Heaps_And_Priority_Queues/README.md](../../19_Heaps_And_Priority_Queues/README.md). Write a MinHeap class from memory (JS has no built-in heap!). |
| Thu | 2 | [19_Heaps_And_Priority_Queues/03_Problems](../../19_Heaps_And_Priority_Queues/03_Problems) 01–05 (top K, k-way merge). |
| Fri | 2 | Finish heap problems. [22_Tries/README.md](../../22_Tries/README.md) + implementation. |
| Sat | 4 | [22_Tries/03_Problems](../../22_Tries/03_Problems) all. Finish anything left this week. |
| Sun | 4 | Re-write MinHeap and Trie from memory with tests. Re-solves. Tracker update. |

**Checkpoint:** MinHeap (push, pop, peek) and Trie (insert, search, startsWith) from memory, with passing asserts.

---

## Week 8 — Graphs Part 1

Folders: [24_Graph_Traversal](../../24_Graph_Traversal), [26_Topological_Sorting](../../26_Topological_Sorting), [27_Union_Find_Disjoint_Set/01_Union_Find_Basics](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [24_Graph_Traversal/README.md](../../24_Graph_Traversal/README.md). Adjacency list vs matrix. BFS and DFS on a graph and on a grid. |
| Tue | 2 | [24_Graph_Traversal/03_Problems](../../24_Graph_Traversal/03_Problems) 01–04 (islands, clone graph, flood fill). |
| Wed | 2 | [24_Graph_Traversal/03_Problems](../../24_Graph_Traversal/03_Problems) 05–08 (multi-source BFS, pacific-atlantic). |
| Thu | 2 | [26_Topological_Sorting/README.md](../../26_Topological_Sorting/README.md). Kahn's algorithm + DFS version. Problems 01–03. |
| Fri | 2 | [27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md). Write UnionFind with path compression from memory. Problems 01–03. |
| Sat | 4 | Finish all three folders' problems. |
| Sun | 4 | **Mock interview: [44_Mock_Interviews/MOCK_SET_04.md](../../44_Mock_Interviews/MOCK_SET_04.md)**. Review + re-solves. |

**Checkpoint:** Grid BFS with a `directions` array and a `visited` set in 5 minutes. Course Schedule from memory.

---

## Week 9 — Graphs Part 2, Greedy, Intervals

Folders: [25_Graph_Algorithms/01_Shortest_Paths](../../25_Graph_Algorithms/01_Shortest_Paths), [25_Graph_Algorithms/02_Minimum_Spanning_Trees](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees), [25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler), [28_Greedy_Algorithms](../../28_Greedy_Algorithms), [31_Intervals](../../31_Intervals)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [25_Graph_Algorithms/01_Shortest_Paths/README.md](../../25_Graph_Algorithms/01_Shortest_Paths/README.md). Dijkstra with your MinHeap. Problems 01–03. |
| Tue | 2 | Bellman-Ford, 0-1 BFS. Finish shortest-path problems. |
| Wed | 2 | [25_Graph_Algorithms/02_Minimum_Spanning_Trees](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees) (Kruskal with UnionFind, Prim with heap). Problems. |
| Thu | 2 | [25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler) README + problems 01–03 (skim the rest; come back in week 12). |
| Fri | 2 | [28_Greedy_Algorithms/README.md](../../28_Greedy_Algorithms/README.md). Problems 01–05. |
| Sat | 4 | Finish greedy. [31_Intervals/README.md](../../31_Intervals/README.md). Problems 01–06 (merge, insert, meeting rooms). |
| Sun | 4 | Finish intervals. Re-solve Dijkstra and Kruskal from memory. Tracker update. |

**Checkpoint:** Explain when greedy works (and when it does not) with Jump Game vs Coin Change.

---

## Week 10 — Dynamic Programming Part 1

Folders: [29_Dynamic_Programming/01_One_Dimensional_DP](../../29_Dynamic_Programming/01_One_Dimensional_DP), [29_Dynamic_Programming/02_Knapsack](../../29_Dynamic_Programming/02_Knapsack), [29_Dynamic_Programming/03_Strings_And_Sequences](../../29_Dynamic_Programming/03_Strings_And_Sequences)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [29_Dynamic_Programming/01_One_Dimensional_DP/README.md](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md). Memoization vs tabulation. Climbing Stairs 3 ways. Problems 01–03. |
| Tue | 2 | [29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems) 04–08 (house robber, decode ways, LIS). |
| Wed | 2 | [29_Dynamic_Programming/02_Knapsack/README.md](../../29_Dynamic_Programming/02_Knapsack/README.md). 0/1 vs unbounded. Problems 01–03 (partition equal subset, coin change). |
| Thu | 2 | Finish knapsack problems (target sum, coin change II). |
| Fri | 2 | [29_Dynamic_Programming/03_Strings_And_Sequences/README.md](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md). LCS and edit distance tables on paper. Problems 01–03. |
| Sat | 4 | Finish string DP problems (palindromes, distinct subsequences). |
| Sun | 4 | **Mock interview: [44_Mock_Interviews/MOCK_SET_05.md](../../44_Mock_Interviews/MOCK_SET_05.md)**. Review + re-solves. |

**Checkpoint:** For any DP problem you can say: state, transition, base case, order of filling, answer location.

---

## Week 11 — DP Part 2, Bits, Matrices

Folders: [29_Dynamic_Programming/04_Grid_DP](../../29_Dynamic_Programming/04_Grid_DP), [29_Dynamic_Programming/05_Interval_DP](../../29_Dynamic_Programming/05_Interval_DP), [29_Dynamic_Programming/06_Advanced_DP](../../29_Dynamic_Programming/06_Advanced_DP), [14_Bit_Manipulation](../../14_Bit_Manipulation), [09_Matrix_And_Multidimensional_Arrays](../../09_Matrix_And_Multidimensional_Arrays)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [29_Dynamic_Programming/04_Grid_DP/README.md](../../29_Dynamic_Programming/04_Grid_DP/README.md). Problems 01–04 (unique paths, min path sum, longest increasing path). |
| Tue | 2 | [29_Dynamic_Programming/05_Interval_DP/README.md](../../29_Dynamic_Programming/05_Interval_DP/README.md). Problems 01–03 (burst balloons, matrix chain style). |
| Wed | 2 | [29_Dynamic_Programming/06_Advanced_DP/README.md](../../29_Dynamic_Programming/06_Advanced_DP/README.md). Problems 01–03 (bitmask DP, state machine DP like stock with cooldown). |
| Thu | 2 | [14_Bit_Manipulation/README.md](../../14_Bit_Manipulation/README.md). Problems 01–06 (XOR tricks, counting bits). |
| Fri | 2 | [09_Matrix_And_Multidimensional_Arrays/README.md](../../09_Matrix_And_Multidimensional_Arrays/README.md). Problems 01–05 (rotate, spiral, set zeroes). |
| Sat | 4 | Finish everything left in these five folders. |
| Sun | 4 | DP review: re-solve one problem from each DP sub-folder from a blank file. Tracker update. |

**Checkpoint:** Rotate image in place and spiral matrix without index bugs. Explain `n & (n - 1)`.

---

## Week 12 — Advanced Topics, Patterns, Final Sweep

Folders: [34_Range_Query_Data_Structures](../../34_Range_Query_Data_Structures), [35_Advanced_Data_Structures](../../35_Advanced_Data_Structures), [33_String_Algorithms_Advanced](../../33_String_Algorithms_Advanced), [41_Advanced_Algorithm_Design](../../41_Advanced_Algorithm_Design), [42_Interview_Problem_Patterns](../../42_Interview_Problem_Patterns), then [CORE_75_PROBLEMS.md](CORE_75_PROBLEMS.md)

| Day | Hours | Do this |
|-----|-------|---------|
| Mon | 2 | [35_Advanced_Data_Structures](../../35_Advanced_Data_Structures) (LRU/LFU cache, skip list, bloom filter) and [34_Range_Query_Data_Structures](../../34_Range_Query_Data_Structures) (segment tree, Fenwick tree, sparse table). Problems 01–03 of each. |
| Tue | 2 | [33_String_Algorithms_Advanced](../../33_String_Algorithms_Advanced) (KMP, Z-function, rolling hash) and [41_Advanced_Algorithm_Design/01_Classic_Techniques](../../41_Advanced_Algorithm_Design/01_Classic_Techniques) (Boyer-Moore voting, Floyd's cycle, reservoir sampling, binary lifting). Skim; solve 2–3 problems. |
| Wed | 2 | [42_Interview_Problem_Patterns](../../42_Interview_Problem_Patterns) README and decision flowchart, then the 22 pattern lessons (skim). Memorize `templates.js` and `pattern_templates.js`. |
| Thu | 2 | Core 75 sweep: solve 6 unchecked problems from [CORE_75_PROBLEMS.md](CORE_75_PROBLEMS.md), timed. |
| Fri | 2 | Core 75 sweep: 6 more. Do 5 of the "which pattern is this?" drills in [42_Interview_Problem_Patterns/03_Problems](../../42_Interview_Problem_Patterns/03_Problems). |
| Sat | 4 | Core 75 sweep: 10 more. Re-write MinHeap, UnionFind, Trie, Dijkstra, backtracking skeleton from memory. |
| Sun | 4 | **Mock interview: [44_Mock_Interviews/MOCK_SET_06.md](../../44_Mock_Interviews/MOCK_SET_06.md)**. Write your "what to study next" list. |

**Checkpoint (ready for interviews):** core 75 complete, all six mock sets done, every template in `templates.js` written from memory at least once.

---

## After week 12

- Continue with the Medium/Hard problems of every Essential topic and the "Practice more" lists in each topic's concepts guide, 1–2 per day.
- Take the [mastery assessments](MASTERY_ASSESSMENTS.md) and the [revision quiz](../04_Interview_And_Assessment/QUIZ.md).
- Keep the re-solve queue alive. Spaced repetition is what keeps you sharp between interviews.
- Re-do the mock sets with the roles swapped: explain the solution out loud as if teaching it.

---

## Compressed 4-Week Plan ("I have an interview soon")

Same hours (18 h/week, 72 h total). You skip the "practice more" lists and solve only the folder problems
marked as classics (first 5–6 in each folder) plus the [core 75](CORE_75_PROBLEMS.md) entries for that topic.

| Week | Folders | Focus | Mock |
|------|---------|-------|------|
| 1 | [00_Foundations](../../00_Foundations) (skim, 1 day), [03_Arrays](../../03_Arrays), [04_Strings](../../04_Strings), [05_Hashing](../../05_Hashing), [06_Two_Pointers](../../06_Two_Pointers), [07_Sliding_Window](../../07_Sliding_Window), [08_Prefix_Sums_And_Difference_Arrays](../../08_Prefix_Sums_And_Difference_Arrays) | Arrays and hash patterns. 3 problems/day. | [MOCK_SET_01](../../44_Mock_Interviews/MOCK_SET_01.md) on Sunday |
| 2 | [13_Backtracking](../../13_Backtracking), [11_Sorting](../../11_Sorting) (skim), [10_Searching](../../10_Searching), [15_Linked_Lists](../../15_Linked_Lists), [16_Stacks](../../16_Stacks), [17_Queues_And_Deques](../../17_Queues_And_Deques) | Pointers, recursion, stacks. 3 problems/day. | [MOCK_SET_02](../../44_Mock_Interviews/MOCK_SET_02.md) + [MOCK_SET_03](../../44_Mock_Interviews/MOCK_SET_03.md) on the weekend |
| 3 | [20_Trees/*](../../20_Trees), [19_Heaps_And_Priority_Queues](../../19_Heaps_And_Priority_Queues), [22_Tries](../../22_Tries), [24_Graph_Traversal](../../24_Graph_Traversal), [26_Topological_Sorting](../../26_Topological_Sorting), [27_Union_Find_Disjoint_Set/01_Union_Find_Basics](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics), [25_Graph_Algorithms/01_Shortest_Paths](../../25_Graph_Algorithms/01_Shortest_Paths) | Trees and graphs. 3 problems/day. | [MOCK_SET_04](../../44_Mock_Interviews/MOCK_SET_04.md) on Sunday |
| 4 | [29_Dynamic_Programming/01_One_Dimensional_DP](../../29_Dynamic_Programming/01_One_Dimensional_DP), [29_Dynamic_Programming/02_Knapsack](../../29_Dynamic_Programming/02_Knapsack), [29_Dynamic_Programming/03_Strings_And_Sequences](../../29_Dynamic_Programming/03_Strings_And_Sequences), [29_Dynamic_Programming/04_Grid_DP](../../29_Dynamic_Programming/04_Grid_DP), [28_Greedy_Algorithms](../../28_Greedy_Algorithms), [31_Intervals](../../31_Intervals), [14_Bit_Manipulation](../../14_Bit_Manipulation), [42_Interview_Problem_Patterns](../../42_Interview_Problem_Patterns) | DP, greedy, intervals. Core 75 sweep on weekend. | [MOCK_SET_05](../../44_Mock_Interviews/MOCK_SET_05.md) + [MOCK_SET_06](../../44_Mock_Interviews/MOCK_SET_06.md) on the weekend |

Daily rhythm: 15 min re-solves, 30 min README, 75 min for 3 problems. Weekends: 4 hours, 6 problems.

Skip in this plan: [25_Graph_Algorithms/02_Minimum_Spanning_Trees](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees), [25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler), [29_Dynamic_Programming/05_Interval_DP](../../29_Dynamic_Programming/05_Interval_DP), [29_Dynamic_Programming/06_Advanced_DP](../../29_Dynamic_Programming/06_Advanced_DP), [33_String_Algorithms_Advanced](../../33_String_Algorithms_Advanced), [34_Range_Query_Data_Structures](../../34_Range_Query_Data_Structures). Come back to them after the interview.

---

## 1-Week Crash Plan ("interview in 7 days")

You cannot learn DSA in a week. You **can** refresh patterns and avoid blanking. ~3–4 hours/day.

| Day | Hours | Do this |
|-----|-------|---------|
| Day 1 | 4 | [02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem](../../02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem) (read). [42_Interview_Problem_Patterns](../../42_Interview_Problem_Patterns) (read). [05_Hashing](../../05_Hashing) + [06_Two_Pointers](../../06_Two_Pointers) + [07_Sliding_Window](../../07_Sliding_Window): 2 classic problems each (Two Sum, Group Anagrams, 3Sum, Container With Most Water, Longest Substring Without Repeating Characters, Minimum Window Substring). |
| Day 2 | 4 | [16_Stacks](../../16_Stacks) (Valid Parentheses, Daily Temperatures, Min Stack). [10_Searching](../../10_Searching) (Binary Search, Search in Rotated Sorted Array, Koko). [15_Linked_Lists](../../15_Linked_Lists) (Reverse, Merge Two, Cycle, Reorder). |
| Day 3 | 4 | [20_Trees/01_Binary_Trees](../../20_Trees/01_Binary_Trees/README.md) + [21_Binary_Search_Trees](../../21_Binary_Search_Trees/README.md) (Max Depth, Invert, Level Order, Validate BST, LCA, Diameter). [19_Heaps_And_Priority_Queues](../../19_Heaps_And_Priority_Queues) (Kth Largest, Top K Frequent). Memorize MinHeap from [templates.js](../../42_Interview_Problem_Patterns/02_Implementations/templates.js). |
| Day 4 | 4 | [24_Graph_Traversal](../../24_Graph_Traversal) (Number of Islands, Clone Graph, Rotting Oranges). [26_Topological_Sorting](../../26_Topological_Sorting) (Course Schedule). [27_Union_Find_Disjoint_Set/01_Union_Find_Basics](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics) (Connected Components). |
| Day 5 | 4 | [29_Dynamic_Programming/01_One_Dimensional_DP](../../29_Dynamic_Programming/01_One_Dimensional_DP) (Climbing Stairs, House Robber, Coin Change, LIS). [29_Dynamic_Programming/03_Strings_And_Sequences](../../29_Dynamic_Programming/03_Strings_And_Sequences) (LCS). [29_Dynamic_Programming/04_Grid_DP](../../29_Dynamic_Programming/04_Grid_DP) (Unique Paths). [13_Backtracking](../../13_Backtracking) (Subsets, Permutations, Combination Sum). |
| Day 6 | 4 | [28_Greedy_Algorithms](../../28_Greedy_Algorithms) + [31_Intervals](../../31_Intervals) (Jump Game, Merge Intervals, Meeting Rooms II). [35_Advanced_Data_Structures](../../35_Advanced_Data_Structures) (LRU Cache). **Mock [MOCK_SET_01](../../44_Mock_Interviews/MOCK_SET_01.md) + [MOCK_SET_04](../../44_Mock_Interviews/MOCK_SET_04.md)**, timed. |
| Day 7 | 3 | Light day. Re-write every snippet in [templates.js](../../42_Interview_Problem_Patterns/02_Implementations/templates.js) from memory. Re-read [HOW_TO_PRACTICE.md](HOW_TO_PRACTICE.md) and the 5-step method. Sleep well. |

Rules for the crash week:

- Do not read new theory after Day 5. Only re-solves.
- If a problem takes more than 30 min, read the solution and move on. You are refreshing, not learning.
- Practice talking out loud. Interviews reward clear thinking more than clever tricks.
