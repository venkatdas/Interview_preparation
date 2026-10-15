# Learning Roadmap: Scratch to Advanced

Follow the stages in order. Each stage lists the folders to study, what you must be able to do before moving on, and a rough time budget (assuming ~2 h on weekdays and ~4 h on weekends, about 18 h/week). Faster is fine; skipping the mastery check is not.

**Mastery criteria for every topic** (tick in `PROGRESS.md` only when all five are true):
1. You can explain the concept to a beginner in two minutes, with an analogy.
2. You can implement the core structure/algorithm from memory, with tests passing.
3. You can solve an unseen variation (pick one from the "Practice more" list) without hints.
4. You can list the edge cases before coding.
5. You can justify the time and space complexity, and name the brute force you beat.

Legend: **Essential** = asked in most interviews. **Advanced** = senior / competitive-programming territory; learn after the essentials.

---

## Stage 1 — JavaScript and programming foundations (week 1)
Folders: `00_Foundations/01_JavaScript_For_DSA`, `00_Foundations/02_Programming_Fundamentals`, `00_Foundations/03_Recursion_Fundamentals`, `00_Foundations/04_Mathematics_For_DSA`, `00_Foundations/05_Bitwise_Fundamentals`
Checkpoint: explain references vs copies, why `shift()` is O(n), what `Number.MAX_SAFE_INTEGER` is, write a recursive function with a correct base case, compute gcd by hand.

## Stage 2 — Complexity analysis and problem-solving fundamentals (week 2)
Folders: `01_Complexity_Analysis/*`, `02_Problem_Solving_Fundamentals/*`, `HOW_TO_SOLVE_A_PROBLEM.md`
Checkpoint: classify 10 code snippets by Big-O, explain amortized O(1) push, state a loop invariant for a simple algorithm, do the 15-step workflow on Two Sum without looking.

## Stage 3 — Arrays, strings, hashing and basic patterns (weeks 3–4) — Essential
Folders: `03_Arrays`, `04_Strings`, `05_Hashing`, `06_Two_Pointers`, `07_Sliding_Window`, `08_Prefix_Sums_And_Difference_Arrays`, `09_Matrix_And_Multidimensional_Arrays`
Checkpoint: solve Two Sum, Valid Anagram, 3Sum, Longest Substring Without Repeating Characters, Subarray Sum Equals K, Rotate Image from memory, each with complexity.

## Stage 4 — Searching, sorting, recursion and backtracking (weeks 5–6) — Essential
Folders: `10_Searching`, `11_Sorting`, `12_Recursion`, `13_Backtracking`, `14_Bit_Manipulation`
Checkpoint: write binary search (lower bound) with no off-by-one bugs, implement merge sort and quick sort, explain stability, solve Subsets / Permutations / Combination Sum, solve Single Number with XOR.

## Stage 5 — Linked lists, stacks, queues and heaps (weeks 7–8) — Essential
Folders: `15_Linked_Lists`, `16_Stacks`, `17_Queues_And_Deques`, `18_Monotonic_Stacks_And_Queues`, `19_Heaps_And_Priority_Queues`
Checkpoint: reverse a linked list iteratively and recursively, detect a cycle, implement a MinHeap from memory in under 10 minutes, solve Daily Temperatures and Kth Largest Element.

## Stage 6 — Trees, BSTs and tries (weeks 9–10) — Essential
Folders: `20_Trees`, `21_Binary_Search_Trees`, `22_Tries`
Checkpoint: all three DFS traversals iteratively, level-order BFS, validate BST with bounds, lowest common ancestor, implement a trie, solve Word Search II.

## Stage 7 — Graphs and graph algorithms (weeks 11–12) — Essential (shortest paths/MST partly Advanced)
Folders: `23_Graphs`, `24_Graph_Traversal`, `26_Topological_Sorting`, `27_Union_Find_Disjoint_Set`, `25_Graph_Algorithms`
Checkpoint: build an adjacency list from edges, BFS/DFS on a grid, Course Schedule (Kahn), Number of Islands, union-find with path compression, Dijkstra with your own heap, explain when Dijkstra fails.

## Stage 8 — Greedy algorithms and intervals (week 13) — Essential
Folders: `28_Greedy_Algorithms`, `31_Intervals`
Checkpoint: give an exchange argument for one greedy problem, solve Merge Intervals, Meeting Rooms II, Jump Game II, Non-overlapping Intervals.

## Stage 9 — Dynamic programming (weeks 14–16) — Essential
Folders: `29_Dynamic_Programming/*` in order (1D → knapsack → strings → grid → interval → advanced)
Checkpoint: for any problem state the state/recurrence/base case out loud, convert memo → tabulation → rolling array, solve Coin Change, LCS, LIS, Edit Distance, House Robber II, Partition Equal Subset Sum.

## Stage 10 — Advanced data structures and algorithms (weeks 17–19) — Advanced
Folders: `30_Divide_And_Conquer`, `32_Meet_In_The_Middle`, `33_String_Algorithms_Advanced`, `34_Range_Query_Data_Structures`, `35_Advanced_Data_Structures`, `36_Number_Theory`, `37_Combinatorics`, `38_Probability_And_Randomization`, `39_Geometric_Algorithms`, `40_Online_Algorithms`, `41_Advanced_Algorithm_Design`
Checkpoint: KMP failure table by hand, segment tree with point update / range query, Fenwick tree, modular inverse, reservoir sampling, LRU cache in O(1), explain max-flow min-cut in words.

## Stage 11 — Interview patterns and mixed problem solving (weeks 20–21)
Folders: `42_Interview_Problem_Patterns`, `43_Mixed_Problem_Sets`
Checkpoint: for each pattern, recite the recognition clues and the template; finish three mixed sets under time.

## Stage 12 — Mock interviews, revision and mastery (week 22 and ongoing)
Folders: `44_Mock_Interviews`, `45_Revision_And_Spaced_Repetition`, `PROGRESS.md`, `PROBLEM_TRACKER.md`
Checkpoint: six 60-minute mocks, each with two problems solved while talking. Revisit every problem you marked "needed hints" on the spaced-repetition schedule (3 days, 1 week, 1 month).

---

## Compressed plans

**4 weeks ("interview in a month")**: Stage 2 (2 days) → Stage 3 (5 days) → Stage 4 (4 days) → Stage 5 (4 days) → Stage 6 (4 days) → Stage 7 (4 days) → Stages 8–9 (5 days, 1D DP + knapsack + LCS only) → mocks (2 days). Use `43_Mixed_Problem_Sets` and the Blind 75 list in `45_Revision_And_Spaced_Repetition`.

**1 week ("crash")**: `HOW_TO_SOLVE_A_PROBLEM.md` + `42_Interview_Problem_Patterns` + one easy and one medium problem from each of: hashing, two pointers, sliding window, stacks, linked lists, trees, graphs (BFS/DFS), 1D DP. Two mocks.

---

## Order dependencies (why the stages are in this order)

```
JS basics ─┬─> Complexity ──> Arrays/Strings/Hashing ──> Two pointers / Sliding window / Prefix sums
           │                         │
           └─> Recursion ────────────┼──> Sorting / Binary search ──> Backtracking ──> DP
                                     │
                                     └──> Linked lists ──> Stacks/Queues ──> Heaps ──> Trees ──> Graphs ──> Advanced
```
