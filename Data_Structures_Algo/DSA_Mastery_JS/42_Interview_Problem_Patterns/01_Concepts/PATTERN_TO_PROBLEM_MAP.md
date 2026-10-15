# Pattern to Problem Map

Most interview problems are one of about 25 patterns wearing a costume.
This file helps you **recognize the pattern from the wording**, pick the right **template**
(see [templates.js](../02_Implementations/templates.js) and [pattern_templates.js](../02_Implementations/pattern_templates.js); each pattern has a full lesson in [patterns/](patterns) indexed in the [topic README](../README.md)), and practice it on 5–8 problems.

**How to use:** when you read a problem, scan the "Recognize it" column first. If two patterns match, try the simpler one first.

---

## Pattern index

| # | Pattern | Recognize it (keywords) | Template | Folder |
|---|---------|-------------------------|----------|--------|
| 1 | Two Pointers | sorted array, pair/triplet, palindrome, in-place remove | `twoPointersOppositeEnds` | [06_Two_Pointers](../../06_Two_Pointers) |
| 2 | Sliding Window | contiguous subarray/substring, longest/shortest/at most k | `longestUniqueSubstring`, `longestWithAtMostKDistinct` | [07_Sliding_Window](../../07_Sliding_Window) |
| 3 | Fast & Slow Pointers | cycle, middle of list, happy number | `hasCycle`, `middleNode`, `cycleStart` | [15_Linked_Lists](../../15_Linked_Lists) |
| 4 | Merge Intervals | intervals, overlapping, meetings, schedule | `mergeIntervals`, `maxOverlap` | [31_Intervals](../../31_Intervals) |
| 5 | Cyclic Sort | numbers in range 1..n, missing/duplicate, O(1) space | swap each value to index value-1 (see `findDuplicateFloyd` for the O(1)-space alternative) | [03_Arrays](../../03_Arrays) |
| 6 | In-place Reversal of Linked List | reverse sublist, k-group, reorder | `reverseList` | [15_Linked_Lists](../../15_Linked_Lists) |
| 7 | Tree BFS | level order, level by level, zigzag, right side view | `levelOrder` | [20_Trees/01_Binary_Trees](../../20_Trees/01_Binary_Trees) |
| 8 | Tree DFS | path sum, depth, diameter, ancestor, subtree | `maxDepth`, `isValidBST` | [20_Trees/01_Binary_Trees](../../20_Trees/01_Binary_Trees) |
| 9 | Two Heaps | median of stream, balance two halves | two `MinHeap`s (one with a max comparator) | [19_Heaps_And_Priority_Queues](../../19_Heaps_And_Priority_Queues) |
| 10 | Subsets / Backtracking | all combinations, permutations, generate all | `subsets`, `permutations`, `combinationSum` | [13_Backtracking](../../13_Backtracking) |
| 11 | Modified Binary Search | sorted/rotated, "minimum X such that", monotonic answer | `lowerBound` / `binarySearchOnAnswer` | [10_Searching](../../10_Searching) |
| 12 | Bitwise XOR | single number, missing number, O(1) space pairs | `singleNumber` | [14_Bit_Manipulation](../../14_Bit_Manipulation) |
| 13 | Top K Elements | k largest/smallest/frequent/closest | `MinHeap` of size k | [19_Heaps_And_Priority_Queues](../../19_Heaps_And_Priority_Queues) |
| 14 | K-way Merge | k sorted lists/arrays, smallest range | `MinHeap` with (value, listIndex) | [19_Heaps_And_Priority_Queues](../../19_Heaps_And_Priority_Queues) |
| 15 | 0/1 Knapsack | pick each item once, capacity, subset sum, partition | `knapsack01` | [29_Dynamic_Programming/02_Knapsack](../../29_Dynamic_Programming/02_Knapsack) |
| 16 | Unbounded Knapsack | unlimited reuse, coins, cut rod | `coinChangeMin` | [29_Dynamic_Programming/02_Knapsack](../../29_Dynamic_Programming/02_Knapsack) |
| 17 | Topological Sort | prerequisites, dependency order, DAG, build order | `topoSortKahn` | [26_Topological_Sorting](../../26_Topological_Sorting) |
| 18 | Union-Find | connected components, "are they connected", redundant edge | `UnionFind` | [27_Union_Find_Disjoint_Set/01_Union_Find_Basics](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics) |
| 19 | Monotonic Stack | next greater/smaller, span, histogram | `nextGreater`, `slidingWindowMax` | [16_Stacks](../../16_Stacks) |
| 20 | Prefix Sum | range sum, subarray sum equals k, running total | `buildPrefixSum`, `countSubarraysWithSum` | [08_Prefix_Sums_And_Difference_Arrays](../../08_Prefix_Sums_And_Difference_Arrays) |
| 21 | Trie | prefix, autocomplete, word dictionary, many string lookups | `Trie` | [22_Tries](../../22_Tries) |
| 22 | Greedy | local best choice, intervals, jumps, scheduling | (sort + sweep) | [28_Greedy_Algorithms](../../28_Greedy_Algorithms) |
| 23 | DP Families | optimal/count ways, overlapping subproblems | `memoize`, tabulation | [29_Dynamic_Programming/*](../../29_Dynamic_Programming) |
| 24 | Matrix Traversal | grid, islands, rotate, spiral, flood fill | `bfsGrid` / `countIslands`, `spiralOrder` | [09_Matrix_And_Multidimensional_Arrays](../../09_Matrix_And_Multidimensional_Arrays), [24_Graph_Traversal](../../24_Graph_Traversal) |
| 25 | Graph Shortest Path | shortest/cheapest path, weighted, minimum time | `bfsGraph` (unweighted), `dijkstra` (weighted) | [25_Graph_Algorithms/01_Shortest_Paths](../../25_Graph_Algorithms/01_Shortest_Paths) |

---

## 1. Two Pointers

**Recognize it:** "sorted array", "find a pair / triplet that sums to", "palindrome", "remove duplicates in place",
"move zeroes", "compare from both ends". Usually O(n^2) brute force becomes O(n).

**Template:** `twoPointersOppositeEnds` (left = 0, right = n - 1, move the one that helps) or
"same direction" (slow writer, fast reader).

| Problem | LC # | Difficulty |
|---------|------|------------|
| Valid Palindrome | 125 | Easy |
| Two Sum II - Input Array Is Sorted | 167 | Medium |
| Remove Duplicates from Sorted Array | 26 | Easy |
| Move Zeroes | 283 | Easy |
| 3Sum | 15 | Medium |
| Container With Most Water | 11 | Medium |
| Sort Colors | 75 | Medium |
| Trapping Rain Water | 42 | Hard |

## 2. Sliding Window

**Recognize it:** "contiguous subarray / substring", "longest / shortest / count of windows", "at most k distinct",
"window of size k", "minimum window containing". Never for subsequences (non-contiguous).

**Template:** `longestWithAtMostKDistinct` / `minSubarrayLenAtLeast` ([lesson 03](patterns/03_sliding_window.md)) — expand `right` every step, shrink `left` while the window is invalid, record the answer.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Maximum Average Subarray I | 643 | Easy |
| Longest Substring Without Repeating Characters | 3 | Medium |
| Minimum Size Subarray Sum | 209 | Medium |
| Longest Repeating Character Replacement | 424 | Medium |
| Permutation in String | 567 | Medium |
| Fruit Into Baskets | 904 | Medium |
| Minimum Window Substring | 76 | Hard |
| Sliding Window Maximum | 239 | Hard |

## 3. Fast & Slow Pointers

**Recognize it:** "linked list", "cycle", "middle node", "detect loop", "happy number", "find the duplicate" with O(1) space.

**Template:** `hasCycle` / `middleNode` / `cycleStart` ([lesson 05](patterns/05_fast_and_slow_pointers.md)) — slow moves 1, fast moves 2; they meet inside a cycle; when fast hits the end, slow is at the middle.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Linked List Cycle | 141 | Easy |
| Middle of the Linked List | 876 | Easy |
| Happy Number | 202 | Easy |
| Palindrome Linked List | 234 | Easy |
| Linked List Cycle II | 142 | Medium |
| Find the Duplicate Number | 287 | Medium |
| Reorder List | 143 | Medium |

## 4. Merge Intervals

**Recognize it:** "intervals", "overlapping", "meeting rooms", "merge", "insert", "free time", "minimum number of rooms".

**Template:** `mergeIntervals` — sort by start; if `current.start <= last.end` extend `last.end`, else push.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Meeting Rooms | 252 | Easy |
| Merge Intervals | 56 | Medium |
| Insert Interval | 57 | Medium |
| Non-overlapping Intervals | 435 | Medium |
| Meeting Rooms II | 253 | Medium |
| Interval List Intersections | 986 | Medium |
| Employee Free Time | 759 | Hard |

## 5. Cyclic Sort

**Recognize it:** "array contains numbers from 1 to n" (or 0 to n), "find missing / duplicate", "O(1) extra space".
Each number has a "home index" = value - 1.

**Template:** cyclic sort (write it inline; no library function) — while `nums[i] !== nums[nums[i] - 1]` swap `nums[i]` to its home.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Missing Number | 268 | Easy |
| Find All Numbers Disappeared in an Array | 448 | Easy |
| Find the Duplicate Number | 287 | Medium |
| Find All Duplicates in an Array | 442 | Medium |
| Set Mismatch | 645 | Easy |
| First Missing Positive | 41 | Hard |

## 6. In-place Reversal of Linked List

**Recognize it:** "reverse a linked list", "reverse between positions", "reverse in groups of k", "reorder", "swap pairs".

**Template:** `reverseList` — `prev = null; while (curr) { next = curr.next; curr.next = prev; prev = curr; curr = next; }`.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Reverse Linked List | 206 | Easy |
| Swap Nodes in Pairs | 24 | Medium |
| Reverse Linked List II | 92 | Medium |
| Reorder List | 143 | Medium |
| Rotate List | 61 | Medium |
| Reverse Nodes in k-Group | 25 | Hard |

## 7. Tree BFS

**Recognize it:** "level order", "level by level", "zigzag", "right side view", "minimum depth", "average of levels", "connect next right".

**Template:** `levelOrder` ([lesson 13](patterns/13_tree_traversal_and_properties.md)) — queue; for each level, record `size = queue.length`, process exactly `size` nodes.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Binary Tree Level Order Traversal | 102 | Medium |
| Average of Levels in Binary Tree | 637 | Easy |
| Minimum Depth of Binary Tree | 111 | Easy |
| Binary Tree Zigzag Level Order Traversal | 103 | Medium |
| Binary Tree Right Side View | 199 | Medium |
| Populating Next Right Pointers in Each Node | 116 | Medium |
| Binary Tree Level Order Traversal II | 107 | Medium |

## 8. Tree DFS

**Recognize it:** "path sum", "max depth", "diameter", "balanced", "lowest common ancestor", "same tree / subtree", "count good nodes".
Ask: do I need info from children (post-order) or from parents (pre-order with parameters)?

**Template:** `maxDepth` / `isValidBST` ([lesson 13](patterns/13_tree_traversal_and_properties.md)) — recursive function that returns something from the subtree; a closure variable tracks the global answer.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Maximum Depth of Binary Tree | 104 | Easy |
| Invert Binary Tree | 226 | Easy |
| Diameter of Binary Tree | 543 | Easy |
| Path Sum | 112 | Easy |
| Count Good Nodes in Binary Tree | 1448 | Medium |
| Lowest Common Ancestor of a Binary Tree | 236 | Medium |
| Validate Binary Search Tree | 98 | Medium |
| Binary Tree Maximum Path Sum | 124 | Hard |

## 9. Two Heaps

**Recognize it:** "median of a stream", "balance two halves", "schedule / capital with max profit", "sliding window median".

**Template:** two `MinHeap`s, one with `(a, b) => b - a` ([lesson 10](patterns/10_top_k_and_heaps.md)) — a max-heap for the smaller half, a min-heap for the larger half; rebalance so sizes differ by at most 1.
(JS has no built-in heap: use the `MinHeap` from [templates.js](../02_Implementations/templates.js); negate values for a max-heap.)

| Problem | LC # | Difficulty |
|---------|------|------------|
| Find Median from Data Stream | 295 | Hard |
| Sliding Window Median | 480 | Hard |
| IPO | 502 | Hard |
| Maximize Capital (same as IPO) | 502 | Hard |
| Last Stone Weight (single heap warm-up) | 1046 | Easy |

## 10. Subsets / Backtracking

**Recognize it:** "all subsets", "all permutations", "all combinations", "generate all valid", "n-queens", "sudoku", "word search", "partition into palindromes".
Output size is exponential, so brute force IS the solution; backtracking just prunes.

**Template:** `backtrack(path, choices)` — choose, recurse, un-choose. Sort first and skip duplicates when input has repeats.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Subsets | 78 | Medium |
| Subsets II | 90 | Medium |
| Permutations | 46 | Medium |
| Combination Sum | 39 | Medium |
| Letter Combinations of a Phone Number | 17 | Medium |
| Generate Parentheses | 22 | Medium |
| Word Search | 79 | Medium |
| N-Queens | 51 | Hard |

## 11. Modified Binary Search

**Recognize it:** "sorted", "rotated sorted", "find first / last position", "minimum X such that condition holds",
"minimum speed / capacity / days", "peak element". If you can write `canDo(x)` that is false...false true...true, binary search on x.

**Template:** `lowerBound` / `upperBound` (first index where condition flips) and `binarySearchOnAnswer`.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Binary Search | 704 | Easy |
| First Bad Version | 278 | Easy |
| Search Insert Position | 35 | Easy |
| Find First and Last Position of Element in Sorted Array | 34 | Medium |
| Search in Rotated Sorted Array | 33 | Medium |
| Find Minimum in Rotated Sorted Array | 153 | Medium |
| Koko Eating Bananas | 875 | Medium |
| Capacity To Ship Packages Within D Days | 1011 | Medium |
| Median of Two Sorted Arrays | 4 | Hard |

## 12. Bitwise XOR

**Recognize it:** "every element appears twice except one", "missing number", "O(1) extra space", "without using + operator".
Remember: `a ^ a = 0`, `a ^ 0 = a`, XOR is order-independent.

**Template:** `singleNumber` ([lesson 18](patterns/18_bit_manipulation.md)) — XOR everything; what remains is the odd one out.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Single Number | 136 | Easy |
| Missing Number | 268 | Easy |
| Number of 1 Bits | 191 | Easy |
| Counting Bits | 338 | Easy |
| Single Number III | 260 | Medium |
| Sum of Two Integers | 371 | Medium |
| Single Number II | 137 | Medium |

## 13. Top K Elements

**Recognize it:** "k largest / smallest", "k most frequent", "k closest", "kth largest". Heap of size k is O(n log k);
bucket sort or quickselect can be O(n).

**Template:** `MinHeap` of size k for "k largest" (pop when size > k); max-heap (negate) for "k smallest".

| Problem | LC # | Difficulty |
|---------|------|------------|
| Kth Largest Element in a Stream | 703 | Easy |
| Kth Largest Element in an Array | 215 | Medium |
| Top K Frequent Elements | 347 | Medium |
| K Closest Points to Origin | 973 | Medium |
| Top K Frequent Words | 692 | Medium |
| Sort Characters By Frequency | 451 | Medium |
| Reorganize String | 767 | Medium |
| Task Scheduler | 621 | Medium |

## 14. K-way Merge

**Recognize it:** "k sorted lists / arrays", "merge k", "smallest range covering k lists", "kth smallest in a sorted matrix".

**Template:** `MinHeap` holding `[value, listIndex, elementIndex]`; pop the smallest, push the next from the same list.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Merge Two Sorted Lists (warm-up) | 21 | Easy |
| Merge K Sorted Lists | 23 | Hard |
| Kth Smallest Element in a Sorted Matrix | 378 | Medium |
| Find K Pairs with Smallest Sums | 373 | Medium |
| Smallest Range Covering Elements from K Lists | 632 | Hard |
| Merge Sorted Array | 88 | Easy |

## 15. 0/1 Knapsack

**Recognize it:** "each item can be used at most once", "capacity / target sum", "can we partition", "count subsets with sum",
"minimum difference between two subsets".

**Template:** `knapsack01` ([lesson 17](patterns/17_dynamic_programming_families.md)) — `dp[c] = best of (dp[c], dp[c - weight] + value)` iterating capacity **downwards** so each item is used once.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Partition Equal Subset Sum | 416 | Medium |
| Target Sum | 494 | Medium |
| Last Stone Weight II | 1049 | Medium |
| Ones and Zeroes | 474 | Medium |
| Count Subsets with Given Sum (variation of 494) | 494 | Medium |
| Minimum Subset Sum Difference (variation of 1049) | 1049 | Medium |

## 16. Unbounded Knapsack

**Recognize it:** "unlimited supply", "can reuse coins / pieces", "minimum coins", "number of ways to make amount", "cut rod".

**Template:** `coinChangeMin` ([lesson 17](patterns/17_dynamic_programming_families.md)) — same recurrence but iterate capacity **upwards** so an item can be reused.
Order of loops matters: items outside for combinations, items inside for permutations.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Coin Change | 322 | Medium |
| Coin Change II | 518 | Medium |
| Combination Sum IV | 377 | Medium |
| Perfect Squares | 279 | Medium |
| Minimum Cost For Tickets | 983 | Medium |
| Integer Break | 343 | Medium |

## 17. Topological Sort

**Recognize it:** "prerequisites", "dependencies", "order of tasks / courses / builds", "directed acyclic graph", "detect cycle in directed graph",
"alien dictionary" (derive order from comparisons).

**Template:** `topoSortKahn` — in-degree count, queue of zero in-degree nodes, pop and decrement neighbors. If output has fewer than n nodes, there is a cycle.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Course Schedule | 207 | Medium |
| Course Schedule II | 210 | Medium |
| Find Eventual Safe States | 802 | Medium |
| Minimum Height Trees | 310 | Medium |
| Alien Dictionary | 269 | Hard |
| Parallel Courses | 1136 | Medium |
| Sequence Reconstruction | 444 | Medium |

## 18. Union-Find

**Recognize it:** "connected components", "are these two connected", "number of provinces", "redundant connection", "accounts merge",
dynamic connectivity (edges added over time).

**Template:** `UnionFind` with path compression + union by rank; `find`, `union` (returns false if already connected), `count`.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Number of Connected Components in an Undirected Graph | 323 | Medium |
| Number of Provinces | 547 | Medium |
| Graph Valid Tree | 261 | Medium |
| Redundant Connection | 684 | Medium |
| Accounts Merge | 721 | Medium |
| Most Stones Removed with Same Row or Column | 947 | Medium |
| Satisfiability of Equality Equations | 990 | Medium |
| Longest Consecutive Sequence (union-find variant) | 128 | Medium |

## 19. Monotonic Stack

**Recognize it:** "next greater / smaller element", "previous smaller", "days until warmer", "stock span", "largest rectangle",
"remove k digits to make smallest". Each element is pushed and popped once, O(n).

**Template:** `nextGreater` / `slidingWindowMax` ([lesson 09](patterns/09_monotonic_stack_and_queue.md)) — keep stack increasing (or decreasing); when the new element breaks the order, pop and resolve.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Next Greater Element I | 496 | Easy |
| Daily Temperatures | 739 | Medium |
| Next Greater Element II | 503 | Medium |
| Online Stock Span | 901 | Medium |
| Remove K Digits | 402 | Medium |
| Sum of Subarray Minimums | 907 | Medium |
| Largest Rectangle in Histogram | 84 | Hard |
| Trapping Rain Water | 42 | Hard |

## 20. Prefix Sum

**Recognize it:** "sum of range [i, j]" many times, "subarray sum equals k", "count subarrays with sum", "running total",
"product except self" (prefix products), "2-D region sum".

**Template:** `buildPrefixSum` / `countSubarraysWithSum` ([lesson 04](patterns/04_prefix_sums_and_difference_arrays.md)) — `prefix[i + 1] = prefix[i] + nums[i]`; range sum = `prefix[j + 1] - prefix[i]`.
For "subarray sum equals k": hash map of `prefixSum -> count`.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Range Sum Query - Immutable | 303 | Easy |
| Find Pivot Index | 724 | Easy |
| Subarray Sum Equals K | 560 | Medium |
| Product of Array Except Self | 238 | Medium |
| Contiguous Array | 525 | Medium |
| Subarray Sums Divisible by K | 974 | Medium |
| Range Sum Query 2D - Immutable | 304 | Medium |

## 21. Trie

**Recognize it:** "prefix", "starts with", "autocomplete", "dictionary of words", "search with wildcard", "many words on a grid".

**Template:** `Trie` — node = `{ children: Map or object, isEnd }`; `insert`, `search`, `startsWith`.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Implement Trie (Prefix Tree) | 208 | Medium |
| Design Add and Search Words Data Structure | 211 | Medium |
| Longest Word in Dictionary | 720 | Medium |
| Replace Words | 648 | Medium |
| Search Suggestions System | 1268 | Medium |
| Word Search II | 212 | Hard |
| Design Search Autocomplete System | 642 | Hard |

## 22. Greedy

**Recognize it:** "minimum number of", "maximum you can reach", "can you reach the end", "schedule the most", "assign cookies".
Usually: sort by something, then sweep once making the locally best choice. Must be able to argue why local best = global best.

**Template:** sort + single pass. No code template; the proof idea is the template.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Assign Cookies | 455 | Easy |
| Best Time to Buy and Sell Stock II | 122 | Medium |
| Jump Game | 55 | Medium |
| Jump Game II | 45 | Medium |
| Gas Station | 134 | Medium |
| Partition Labels | 763 | Medium |
| Non-overlapping Intervals | 435 | Medium |
| Minimum Number of Arrows to Burst Balloons | 452 | Medium |

## 23. DP Families

**Recognize it:** "maximum / minimum / count the number of ways", "longest", choices at each step, and brute force recursion repeats subproblems.
Decide the **state** (what does `dp[i]` or `dp[i][j]` mean?), the **transition**, the **base case**, and where the answer lives.

**Template:** `memoize` for top-down; nested loops for bottom-up. The DP sub-folders map to families:

| Family | State | Example problems (LC #, difficulty) | Folder |
|--------|-------|-------------------------------------|--------|
| 1-D linear | `dp[i]` = best up to i | Climbing Stairs (70, Easy), House Robber (198, Medium), Decode Ways (91, Medium), LIS (300, Medium), Word Break (139, Medium) | [29_Dynamic_Programming/01_One_Dimensional_DP](../../29_Dynamic_Programming/01_One_Dimensional_DP) |
| Knapsack | `dp[i][cap]` | Partition Equal Subset Sum (416), Coin Change (322), Target Sum (494) | [29_Dynamic_Programming/02_Knapsack](../../29_Dynamic_Programming/02_Knapsack) |
| Two strings / sequences | `dp[i][j]` = answer for prefixes | LCS (1143, Medium), Edit Distance (72, Medium), Distinct Subsequences (115, Hard), Regular Expression Matching (10, Hard) | [29_Dynamic_Programming/03_Strings_And_Sequences](../../29_Dynamic_Programming/03_Strings_And_Sequences) |
| Grid | `dp[r][c]` from top/left | Unique Paths (62), Min Path Sum (64), Longest Increasing Path (329, Hard) | [29_Dynamic_Programming/04_Grid_DP](../../29_Dynamic_Programming/04_Grid_DP) |
| Interval | `dp[i][j]` over subarray i..j | Burst Balloons (312, Hard), Palindromic Substrings (647), Longest Palindromic Subsequence (516) | [29_Dynamic_Programming/05_Interval_DP](../../29_Dynamic_Programming/05_Interval_DP) |
| State machine / bitmask | extra dimension for "state" | Stock with Cooldown (309), Stock with Transaction Fee (714), Partition to K Equal Sum Subsets (698, bitmask) | [29_Dynamic_Programming/06_Advanced_DP](../../29_Dynamic_Programming/06_Advanced_DP) |

## 24. Matrix Traversal

**Recognize it:** "grid", "islands", "flood fill", "rotten oranges", "spiral", "rotate", "surrounded regions", "word search on a board".
Treat each cell as a graph node with up to 4 (or 8) neighbors.

**Template:** `bfsGrid` / `countIslands` ([lesson 19](patterns/19_matrix_traversal.md)) with a `directions = [[1,0],[-1,0],[0,1],[0,-1]]` array and an `inBounds` check.

| Problem | LC # | Difficulty |
|---------|------|------------|
| Flood Fill | 733 | Easy |
| Number of Islands | 200 | Medium |
| Max Area of Island | 695 | Medium |
| Rotting Oranges | 994 | Medium |
| Spiral Matrix | 54 | Medium |
| Rotate Image | 48 | Medium |
| Set Matrix Zeroes | 73 | Medium |
| Surrounded Regions | 130 | Medium |
| Pacific Atlantic Water Flow | 417 | Medium |

## 25. Graph Shortest Path

**Recognize it:** "shortest path", "minimum number of steps / moves", "cheapest", "minimum time for all nodes", "with at most k stops".
Unweighted -> BFS. Weighted non-negative -> Dijkstra. Negative weights or "at most k edges" -> Bellman-Ford. 0/1 weights -> deque BFS.

**Template:** `bfsGraph` (distance = level), `dijkstra` (MinHeap of `[dist, node]`).

| Problem | LC # | Difficulty |
|---------|------|------------|
| Word Ladder | 127 | Hard |
| Shortest Path in Binary Matrix | 1091 | Medium |
| Open the Lock | 752 | Medium |
| Network Delay Time | 743 | Medium |
| Path with Minimum Effort | 1631 | Medium |
| Cheapest Flights Within K Stops | 787 | Medium |
| Swim in Rising Water | 778 | Hard |
| Minimum Cost to Make at Least One Valid Path in a Grid | 1368 | Hard |

---

## When two patterns both fit

| Looks like... | Try first | Then |
|---------------|-----------|------|
| sorted + pair | two pointers | hash map (if not sorted) |
| subarray + sum | prefix sum + hash map | sliding window (only if all numbers are positive) |
| "k-th" anything | heap of size k | quickselect / binary search on answer |
| grid + "shortest" | BFS | Dijkstra (if cells have weights) |
| "minimum X such that" | binary search on answer | greedy / DP |
| count ways + choices | DP | backtracking (only if you must list them all) |
| connected components | union-find | DFS (same complexity, union-find is shorter when edges arrive over time) |
