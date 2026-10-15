# Interview Problem Patterns

Most interview problems are a few patterns in disguise. This topic teaches you to **read a
problem and name its pattern in under a minute**, then reach for a template you have already
tested. Each of the 22 lessons below covers: recognition clues, when the pattern applies, when it
does **not** (with a counterexample), a copy-pasteable JavaScript template, variations, pitfalls,
6–12 practice problems from this curriculum, and a self-check. Then the 10 drills make you
identify the pattern *before* you see any hint.

**Prerequisites:** finish the core topics first — at least [Arrays](../03_Arrays/README.md),
[Hashing](../05_Hashing/README.md), [Two Pointers](../06_Two_Pointers/README.md),
[Sliding Window](../07_Sliding_Window/README.md), [Searching](../10_Searching/README.md),
[Backtracking](../13_Backtracking/README.md), [Stacks](../16_Stacks/README.md),
[Heaps](../19_Heaps_And_Priority_Queues/README.md), [Binary Trees](../20_Trees/01_Binary_Trees/README.md),
[Graph Traversal](../24_Graph_Traversal/README.md) and [1D DP](../29_Dynamic_Programming/01_One_Dimensional_DP/README.md).
This is Stage 11 of the [roadmap](../ROADMAP.md).

## How to study this topic

1. Read the [decision flowchart](#decision-flowchart-read-the-problem--which-pattern) below until you can redraw it from memory.
2. Read one lesson per day in [01_Concepts/patterns](01_Concepts/patterns). Type its template from memory, then compare with [pattern_templates.js](02_Implementations/pattern_templates.js) / [templates.js](02_Implementations/templates.js).
3. Use [PATTERN_TO_PROBLEM_MAP.md](01_Concepts/PATTERN_TO_PROBLEM_MAP.md) for extra LeetCode practice per pattern.
4. Do the 10 drills in [03_Problems](03_Problems). Each one starts with "Step 0: name the pattern" — write your guess before any hint.
5. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) (25 problem descriptions -> pattern) and answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud.
6. Run the tests: `node --test 42_Interview_Problem_Patterns/tests/patterns.test.js` (or `npm run test:topic 42_Interview_Problem_Patterns` from the curriculum root).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/patterns](01_Concepts/patterns) | 22 pattern lessons (table below) |
| [01_Concepts/PATTERN_TO_PROBLEM_MAP.md](01_Concepts/PATTERN_TO_PROBLEM_MAP.md) | 25 patterns, keywords, and LeetCode practice lists |
| [02_Implementations](02_Implementations) | `templates.js` (20 core snippets: heap, union-find, trie, BFS/DFS, Dijkstra, ...) and `pattern_templates.js` (one template per lesson). Both run with `node` and self-test. |
| [03_Problems](03_Problems) | 10 original "which pattern is this?" drills; solutions with brute force + optimal + random tests in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a pattern-identification quiz |
| [tests](tests) | `patterns.test.js`: every template on normal, empty, duplicate and random inputs |

## Pattern lessons

| # | Pattern | Recognition clue (one line) |
|---|---|---|
| 01 | [Hash map & frequency counting](01_Concepts/patterns/01_hash_map_and_frequency_counting.md) | "seen before?", "count", "complement", "anagram/group" on unsorted data |
| 02 | [Two pointers](01_Concepts/patterns/02_two_pointers.md) | sorted array + pair/triplet, palindrome, in-place filtering |
| 03 | [Sliding window](01_Concepts/patterns/03_sliding_window.md) | longest/shortest **contiguous** range satisfying a monotonic condition |
| 04 | [Prefix sums & difference arrays](01_Concepts/patterns/04_prefix_sums_and_difference_arrays.md) | range sums, "subarray sum equals k" (negatives OK), many range updates |
| 05 | [Fast & slow pointers](01_Concepts/patterns/05_fast_and_slow_pointers.md) | cycle / cycle start / middle with O(1) memory |
| 06 | [Binary search & search on the answer](01_Concepts/patterns/06_binary_search_and_search_on_answer.md) | sorted data or "minimum X such that ..." with a monotonic check |
| 07 | [Sorting + greedy selection](01_Concepts/patterns/07_sorting_and_greedy_selection.md) | "max number of ...", "min number of ..." where a sorted local choice is provably safe |
| 08 | [Intervals & sweep line](01_Concepts/patterns/08_intervals_and_sweep_line.md) | ranges, overlaps, "at any moment", rooms, merging |
| 09 | [Monotonic stack & queue](01_Concepts/patterns/09_monotonic_stack_and_queue.md) | "next/previous greater or smaller", window max/min |
| 10 | [Top-K & heaps](01_Concepts/patterns/10_top_k_and_heaps.md) | "k largest/closest/frequent", stream median, repeatedly take the best |
| 11 | [K-way merge](01_Concepts/patterns/11_k_way_merge.md) | k sorted lists/rows -> one sorted stream |
| 12 | [Recursion & backtracking](01_Concepts/patterns/12_recursion_and_backtracking.md) | "return all" combinations / permutations / boards, small n |
| 13 | [Tree traversal & tree properties](01_Concepts/patterns/13_tree_traversal_and_properties.md) | tree + "depth/path/level/ancestor/valid BST" |
| 14 | [Graph traversal & shortest paths](01_Concepts/patterns/14_graph_traversal_and_shortest_paths.md) | connectivity, "minimum steps" (BFS), weighted cheapest path (Dijkstra) |
| 15 | [Topological sort](01_Concepts/patterns/15_topological_sort.md) | prerequisites, dependency order, "possible to finish?" |
| 16 | [Union-find](01_Concepts/patterns/16_union_find.md) | groups that only merge, connectivity queries online, redundant edge |
| 17 | [Dynamic programming (families)](01_Concepts/patterns/17_dynamic_programming_families.md) | count ways / min / max with overlapping subproblems |
| 18 | [Bit manipulation](01_Concepts/patterns/18_bit_manipulation.md) | "appears twice except one", O(1) space tricks, subsets as masks (n <= 20) |
| 19 | [Matrix traversal](01_Concepts/patterns/19_matrix_traversal.md) | grids: spiral, rotate, islands, nearest cell |
| 20 | [Subarray vs subsequence](01_Concepts/patterns/20_subarray_vs_subsequence.md) | the word "contiguous" (window/Kadane/prefix) vs "order kept, gaps allowed" (DP) |
| 21 | [String matching & tries](01_Concepts/patterns/21_string_matching_and_tries.md) | pattern occurrences in O(n + m), many prefix lookups |
| 22 | [State-space search & pruning](01_Concepts/patterns/22_state_space_search_and_pruning.md) | configurations (lock, puzzle, mask) + "minimum moves" or "all valid placements" |

## Decision flowchart: read the problem -> which pattern

Ask the questions from top to bottom. The first "yes" is usually the right family. Then check the
lesson's "When it does NOT apply" section before you commit.

```
READ THE PROBLEM. Underline: input shape, the question word (all / count / min / max / exists),
"contiguous" vs "subsequence", "sorted", and the constraint n.
│
├─ Constraint first:   n <= 10–12 -> permutations OK      n <= 20 -> 2^n subsets / bitmask OK
│                      n <= 10^3–10^4 -> O(n^2) OK          n <= 10^5–10^6 -> O(n log n) or O(n)
│
├─ "Return ALL solutions" (subsets, permutations, boards, partitions)?
│     └─ yes -> BACKTRACKING (12); constraint-heavy boards -> + PRUNING (22)
│
├─ Is the input a TREE?
│     └─ yes -> TREE DFS/BFS (13): per-level -> BFS; from children -> post-order; BST -> in-order
│
├─ Is it a GRAPH (explicit edges, or grid cells / words / states that connect)?
│     ├─ dependencies / "before" / prerequisites ............ TOPOLOGICAL SORT (15)
│     ├─ edges arrive over time, "connected?", groups merge . UNION-FIND (16)
│     ├─ minimum steps, every move costs 1 ................... BFS (14); grids -> MATRIX (19)
│     ├─ weighted cheapest path, weights >= 0 ................ DIJKSTRA (14)
│     ├─ negative weights or "at most k edges" ............... BELLMAN-FORD (14)
│     ├─ nodes are configurations (lock, board, mask) ........ STATE-SPACE BFS (22)
│     └─ count regions / flood fill .......................... DFS/BFS (14, 19)
│
├─ Linked list?
│     ├─ cycle / middle / k-th from end ...................... FAST & SLOW (05)
│     └─ merge k sorted lists ................................ K-WAY MERGE (11)
│
├─ Ranges / intervals / meetings / "at any moment"? .......... INTERVALS & SWEEP LINE (08)
│
├─ Sorted input, or "minimum X such that feasible(X)"?
│     ├─ find a value / boundary ............................. BINARY SEARCH (06)
│     ├─ monotonic yes/no check over the answer .............. BINARY SEARCH ON ANSWER (06)
│     └─ pair / triplet sums, compare from both ends ......... TWO POINTERS (02)
│
├─ CONTIGUOUS subarray / substring?
│     ├─ longest/shortest with a monotonic condition ......... SLIDING WINDOW (03)
│     ├─ sum equals / divisible by k, negatives allowed ...... PREFIX SUM + MAP (04)
│     ├─ best sum ending here ................................ KADANE (20)
│     └─ window max/min, next greater/smaller ................ MONOTONIC STACK / DEQUE (09)
│
├─ SUBSEQUENCE (order kept, gaps allowed)?
│     ├─ is s a subsequence of t ............................. TWO POINTERS (20)
│     └─ longest / count / edit between sequences ............ DP (17, 20)
│
├─ "k largest / smallest / most frequent", stream median? ..... HEAP / TOP-K (10)
│
├─ "count ways" or "min/max cost" with choices that overlap?
│     ├─ a sorted local choice is provably safe .............. GREEDY (07)  (prove it, or find a counterexample)
│     └─ otherwise ........................................... DYNAMIC PROGRAMMING (17)
│
├─ Exact lookups: seen before? how many? complement? group? ... HASH MAP (01)
│
├─ Find pattern in text / many prefix queries? ................ KMP / TRIE (21)
│
└─ "every value twice except one", O(1) space, powers of 2 .... BIT MANIPULATION (18)
```

If two branches match, try the simpler one first (hash map before DP, BFS before Dijkstra, greedy
only with a proof). If nothing matches, write the brute force and ask "what work am I repeating?" —
the answer usually points to a hash map, a prefix sum, a monotonic structure, or memoization.

## Problems ("which pattern is this?" drills)

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Badge Scan Repeat | Easy | identify it first | [statement](03_Problems/01_Easy/01_badge_scan_repeat.md) | [solution](03_Problems/solutions/01_badge_scan_repeat.js) |
| 02 | Playlist Pairs | Easy | identify it first | [statement](03_Problems/01_Easy/02_playlist_pairs.md) | [solution](03_Problems/solutions/02_playlist_pairs.js) |
| 03 | Price Drop Wait | Medium | identify it first | [statement](03_Problems/02_Medium/03_price_drop_wait.md) | [solution](03_Problems/solutions/03_price_drop_wait.js) |
| 04 | Server Peak Demand | Medium | identify it first | [statement](03_Problems/02_Medium/04_server_peak_demand.md) | [solution](03_Problems/solutions/04_server_peak_demand.js) |
| 05 | Build Rounds | Medium | identify it first | [statement](03_Problems/02_Medium/05_build_rounds.md) | [solution](03_Problems/solutions/05_build_rounds.js) |
| 06 | Nearest Charger | Medium | identify it first | [statement](03_Problems/02_Medium/06_nearest_charger.md) | [solution](03_Problems/solutions/06_nearest_charger.js) |
| 07 | Cable Clusters | Medium | identify it first | [statement](03_Problems/02_Medium/07_cable_clusters.md) | [solution](03_Problems/solutions/07_cable_clusters.js) |
| 08 | Smallest Battery | Medium | identify it first | [statement](03_Problems/02_Medium/08_smallest_battery.md) | [solution](03_Problems/solutions/08_smallest_battery.js) |
| 09 | Calm Streak | Hard | identify it first | [statement](03_Problems/03_Hard/09_calm_streak.md) | [solution](03_Problems/solutions/09_calm_streak.js) |
| 10 | Gym Passes | Hard | identify it first | [statement](03_Problems/03_Hard/10_gym_passes.md) | [solution](03_Problems/solutions/10_gym_passes.js) |

<details><summary>Answer key (open only after attempting all ten)</summary>

01 hash map (last-seen index) · 02 two pointers · 03 monotonic stack · 04 sweep line · 05 topological sort by levels · 06 multi-source BFS · 07 union-find with sizes · 08 binary search on the answer · 09 sliding window + monotonic deques · 10 DP over days + binary search

</details>

## Next

Mixed practice under time: [43_Mixed_Problem_Sets](../43_Mixed_Problem_Sets), then [44_Mock_Interviews](../44_Mock_Interviews), and keep everything fresh with [45_Revision_And_Spaced_Repetition](../45_Revision_And_Spaced_Repetition).
