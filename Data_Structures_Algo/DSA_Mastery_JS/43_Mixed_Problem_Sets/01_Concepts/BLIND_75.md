# Blind 75

The classic list of 75 problems that covers almost every pattern asked in coding interviews.
Grouping follows the widely used NeetCode ordering of the Blind 75.

**How to use**

- Tick the box only when you solved it **without looking at a solution**.
- The "Folder" column tells you where the pattern is taught in this curriculum.
- Re-solve after 3 days / 1 week / 1 month (see [the mixed sets README](../README.md)).

Progress: ___ / 75

---

## Arrays & Hashing (8)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Contains Duplicate](../../03_Arrays/03_Problems/01_Easy/03_contains_duplicate.md) | [217](https://leetcode.com/problems/contains-duplicate/) | Easy | hash set | [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | [Valid Anagram](../../04_Strings/03_Problems/01_Easy/03_valid_anagram.md) | [242](https://leetcode.com/problems/valid-anagram/) | Easy | frequency count | [`04_Strings`](../../04_Strings/README.md), [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | [Two Sum](../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) | [1](https://leetcode.com/problems/two-sum/) | Easy | hash map (complement) | [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | [Group Anagrams](../../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md) | [49](https://leetcode.com/problems/group-anagrams/) | Medium | hash map with canonical key | [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | [Top K Frequent Elements](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/05_top_k_frequent_elements.md) | [347](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | heap / bucket sort | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| - [ ] | [Encode and Decode Strings](../../04_Strings/03_Problems/02_Medium/09_encode_and_decode_strings.md) | [271](https://leetcode.com/problems/encode-and-decode-strings/) | Medium | string parsing (length prefix) | [`04_Strings`](../../04_Strings/README.md) |
| - [ ] | [Product of Array Except Self](../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/04_product_of_array_except_self.md) | [238](https://leetcode.com/problems/product-of-array-except-self/) | Medium | prefix / suffix product | [`08_Prefix_Sums_And_Difference_Arrays`](../../08_Prefix_Sums_And_Difference_Arrays/README.md), [`03_Arrays`](../../03_Arrays/README.md) |
| - [ ] | [Longest Consecutive Sequence](../../05_Hashing/03_Problems/02_Medium/10_longest_consecutive_sequence.md) | [128](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | hash set, start-of-run check | [`05_Hashing`](../../05_Hashing/README.md) |

## Two Pointers (3)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Valid Palindrome](../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md) | [125](https://leetcode.com/problems/valid-palindrome/) | Easy | opposite ends | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| - [ ] | [3Sum](../../06_Two_Pointers/03_Problems/02_Medium/13_three_sum.md) | [15](https://leetcode.com/problems/3sum/) | Medium | sort + two pointers | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| - [ ] | [Container With Most Water](../../06_Two_Pointers/03_Problems/02_Medium/11_container_with_most_water.md) | [11](https://leetcode.com/problems/container-with-most-water/) | Medium | opposite ends, move shorter | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |

## Sliding Window (4)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Best Time to Buy and Sell Stock](../../03_Arrays/03_Problems/01_Easy/02_best_time_to_buy_and_sell_stock.md) | [121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | running min | [`07_Sliding_Window`](../../07_Sliding_Window/README.md), [`03_Arrays`](../../03_Arrays/README.md) |
| - [ ] | [Longest Substring Without Repeating Characters](../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md) | [3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium | variable window + set | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| - [ ] | [Longest Repeating Character Replacement](../../07_Sliding_Window/03_Problems/02_Medium/04_longest_repeating_character_replacement.md) | [424](https://leetcode.com/problems/longest-repeating-character-replacement/) | Medium | variable window + max freq | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| - [ ] | [Minimum Window Substring](../../07_Sliding_Window/03_Problems/03_Hard/14_minimum_window_substring.md) | [76](https://leetcode.com/problems/minimum-window-substring/) | Hard | variable window + need/have counts | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |

## Stack (1)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Valid Parentheses](../../16_Stacks/03_Problems/01_Easy/01_valid_parentheses.md) | [20](https://leetcode.com/problems/valid-parentheses/) | Easy | matching stack | [`16_Stacks`](../../16_Stacks/README.md) |

## Binary Search (2)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Find Minimum in Rotated Sorted Array](../../10_Searching/03_Problems/02_Medium/09_find_minimum_rotated_sorted_array.md) | [153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | modified binary search | [`10_Searching`](../../10_Searching/README.md) |
| - [ ] | [Search in Rotated Sorted Array](../../10_Searching/03_Problems/02_Medium/07_search_rotated_sorted_array.md) | [33](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium | modified binary search | [`10_Searching`](../../10_Searching/README.md) |

## Linked List (6)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Reverse Linked List](../../15_Linked_Lists/03_Problems/01_Easy/01_reverse_linked_list.md) | [206](https://leetcode.com/problems/reverse-linked-list/) | Easy | in-place reversal | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | [Merge Two Sorted Lists](../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) | [21](https://leetcode.com/problems/merge-two-sorted-lists/) | Easy | dummy head + two pointers | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | [Reorder List](../../15_Linked_Lists/03_Problems/02_Medium/14_reorder_list.md) | [143](https://leetcode.com/problems/reorder-list/) | Medium | middle + reverse + merge | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | [Remove Nth Node From End of List](../../15_Linked_Lists/03_Problems/02_Medium/06_remove_nth_from_end.md) | [19](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Medium | two pointers with gap | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | [Linked List Cycle](../../15_Linked_Lists/03_Problems/01_Easy/03_linked_list_cycle.md) | [141](https://leetcode.com/problems/linked-list-cycle/) | Easy | fast & slow pointers | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | [Merge K Sorted Lists](../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/07_merge_k_sorted_lists.md) | [23](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | k-way merge (heap) | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md), [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |

## Trees (11)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Invert Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/04_invert_binary_tree.md) | [226](https://leetcode.com/problems/invert-binary-tree/) | Easy | tree DFS | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | [Maximum Depth of Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/01_maximum_depth.md) | [104](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Easy | tree DFS | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | [Same Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/03_same_tree.md) | [100](https://leetcode.com/problems/same-tree/) | Easy | tree DFS (parallel) | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | [Subtree of Another Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/09_subtree_of_another_tree.md) | [572](https://leetcode.com/problems/subtree-of-another-tree/) | Easy | tree DFS + same tree | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | [Lowest Common Ancestor of a BST](../../21_Binary_Search_Trees/03_Problems/02_Medium/06_lowest_common_ancestor_bst.md) | [235](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | Medium | BST property walk | [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| - [ ] | [Binary Tree Level Order Traversal](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/10_level_order_traversal.md) | [102](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium | tree BFS | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | [Validate Binary Search Tree](../../21_Binary_Search_Trees/03_Problems/02_Medium/07_validate_bst.md) | [98](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | DFS with min/max bounds | [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| - [ ] | [Kth Smallest Element in a BST](../../21_Binary_Search_Trees/03_Problems/02_Medium/08_kth_smallest_in_bst.md) | [230](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Medium | inorder traversal | [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| - [ ] | [Construct Binary Tree from Preorder and Inorder](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/18_construct_from_preorder_inorder.md) | [105](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | Medium | recursion + index map | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | [Binary Tree Maximum Path Sum](../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/19_maximum_path_sum.md) | [124](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Hard | post-order DFS, global max | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | [Serialize and Deserialize Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/20_serialize_deserialize.md) | [297](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Hard | pre-order with null markers | [`20_Trees/02_N_Ary_Trees_And_Misc`](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md) |

## Tries (3)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Implement Trie (Prefix Tree)](../../22_Tries/03_Problems/02_Medium/01_implement_trie.md) | [208](https://leetcode.com/problems/implement-trie-prefix-tree/) | Medium | trie | [`22_Tries`](../../22_Tries/README.md) |
| - [ ] | [Design Add and Search Words Data Structure](../../22_Tries/03_Problems/02_Medium/02_add_and_search_words.md) | [211](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Medium | trie + DFS for wildcard | [`22_Tries`](../../22_Tries/README.md) |
| - [ ] | [Word Search II](../../22_Tries/03_Problems/03_Hard/10_word_search_ii.md) | [212](https://leetcode.com/problems/word-search-ii/) | Hard | trie + grid backtracking | [`22_Tries`](../../22_Tries/README.md) |

## Heap / Priority Queue (1)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Find Median from Data Stream](../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/08_find_median_data_stream.md) | [295](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | two heaps | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |

## Backtracking (2)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Combination Sum](../../13_Backtracking/03_Problems/02_Medium/06_combination_sum.md) | [39](https://leetcode.com/problems/combination-sum/) | Medium | backtracking (reuse allowed) | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] | [Word Search](../../13_Backtracking/03_Problems/02_Medium/11_word_search.md) | [79](https://leetcode.com/problems/word-search/) | Medium | grid backtracking | [`13_Backtracking`](../../13_Backtracking/README.md), [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |

## Graphs (6)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Number of Islands](../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md) | [200](https://leetcode.com/problems/number-of-islands/) | Medium | grid BFS/DFS | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] | [Clone Graph](../../24_Graph_Traversal/03_Problems/02_Medium/09_clone_graph.md) | [133](https://leetcode.com/problems/clone-graph/) | Medium | DFS + hash map of copies | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] | [Pacific Atlantic Water Flow](../../24_Graph_Traversal/03_Problems/02_Medium/14_pacific_atlantic_water_flow.md) | [417](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Medium | multi-source DFS from borders | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] | [Course Schedule](../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) | [207](https://leetcode.com/problems/course-schedule/) | Medium | topological sort / cycle detection | [`26_Topological_Sorting`](../../26_Topological_Sorting/README.md) |
| - [ ] | [Graph Valid Tree](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/02_graph_valid_tree.md) | [261](https://leetcode.com/problems/graph-valid-tree/) | Medium | union-find / DFS | [`27_Union_Find_Disjoint_Set/01_Union_Find_Basics`](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| - [ ] | [Number of Connected Components in an Undirected Graph](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/01_number_of_connected_components.md) | [323](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Medium | union-find | [`27_Union_Find_Disjoint_Set/01_Union_Find_Basics`](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |

## Advanced Graphs (1)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Alien Dictionary](../../26_Topological_Sorting/03_Problems/03_Hard/08_alien_dictionary.md) | [269](https://leetcode.com/problems/alien-dictionary/) | Hard | build graph + topological sort | [`26_Topological_Sorting`](../../26_Topological_Sorting/README.md) |

## 1-D Dynamic Programming (10)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Climbing Stairs](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/01_Easy/02_climbing_stairs.md) | [70](https://leetcode.com/problems/climbing-stairs/) | Easy | fibonacci DP | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | [House Robber](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/05_house_robber.md) | [198](https://leetcode.com/problems/house-robber/) | Medium | take / skip DP | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | [House Robber II](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/06_house_robber_ii.md) | [213](https://leetcode.com/problems/house-robber-ii/) | Medium | DP on circular array (run twice) | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | [Longest Palindromic Substring](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/05_longest_palindromic_substring.md) | [5](https://leetcode.com/problems/longest-palindromic-substring/) | Medium | expand around center | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md), [`04_Strings`](../../04_Strings/README.md) |
| - [ ] | [Palindromic Substrings](../../04_Strings/03_Problems/02_Medium/13_palindromic_substrings.md) | [647](https://leetcode.com/problems/palindromic-substrings/) | Medium | expand around center | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |
| - [ ] | [Decode Ways](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/10_decode_ways.md) | [91](https://leetcode.com/problems/decode-ways/) | Medium | 1-D DP with 2 choices | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | [Coin Change](../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/04_coin_change_min_coins.md) | [322](https://leetcode.com/problems/coin-change/) | Medium | unbounded knapsack (min) | [`29_Dynamic_Programming/02_Knapsack`](../../29_Dynamic_Programming/02_Knapsack/README.md) |
| - [ ] | [Maximum Product Subarray](../../03_Arrays/03_Problems/02_Medium/14_maximum_product_subarray.md) | [152](https://leetcode.com/problems/maximum-product-subarray/) | Medium | track max and min | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md), [`03_Arrays`](../../03_Arrays/README.md) |
| - [ ] | [Word Break](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/17_word_break.md) | [139](https://leetcode.com/problems/word-break/) | Medium | 1-D DP over prefixes | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | [Longest Increasing Subsequence](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/03_longest_increasing_subsequence.md) | [300](https://leetcode.com/problems/longest-increasing-subsequence/) | Medium | O(n^2) DP or patience (binary search) | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |

## 2-D Dynamic Programming (2)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Unique Paths](../../29_Dynamic_Programming/04_Grid_DP/03_Problems/02_Medium/01_unique_paths.md) | [62](https://leetcode.com/problems/unique-paths/) | Medium | grid DP | [`29_Dynamic_Programming/04_Grid_DP`](../../29_Dynamic_Programming/04_Grid_DP/README.md) |
| - [ ] | [Longest Common Subsequence](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/01_longest_common_subsequence.md) | [1143](https://leetcode.com/problems/longest-common-subsequence/) | Medium | 2-D string DP | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |

## Greedy (2)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Maximum Subarray](../../03_Arrays/03_Problems/02_Medium/04_maximum_subarray.md) | [53](https://leetcode.com/problems/maximum-subarray/) | Medium | Kadane's algorithm | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md), [`03_Arrays`](../../03_Arrays/README.md) |
| - [ ] | [Jump Game](../../28_Greedy_Algorithms/03_Problems/02_Medium/05_jump_game.md) | [55](https://leetcode.com/problems/jump-game/) | Medium | greedy farthest reach | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |

## Intervals (5)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Insert Interval](../../31_Intervals/03_Problems/02_Medium/04_insert_interval.md) | [57](https://leetcode.com/problems/insert-interval/) | Medium | three-phase scan | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] | [Merge Intervals](../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md) | [56](https://leetcode.com/problems/merge-intervals/) | Medium | sort by start + merge | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] | [Non-overlapping Intervals](../../31_Intervals/03_Problems/02_Medium/06_non_overlapping_intervals.md) | [435](https://leetcode.com/problems/non-overlapping-intervals/) | Medium | sort by end, greedy | [`31_Intervals`](../../31_Intervals/README.md), [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] | [Meeting Rooms](../../31_Intervals/03_Problems/01_Easy/01_meeting_rooms.md) | [252](https://leetcode.com/problems/meeting-rooms/) | Easy | sort + check overlap | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] | [Meeting Rooms II](../../31_Intervals/03_Problems/02_Medium/09_meeting_rooms_ii.md) | [253](https://leetcode.com/problems/meeting-rooms-ii/) | Medium | min-heap of end times / sweep line | [`31_Intervals`](../../31_Intervals/README.md), [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |

## Math & Geometry (3)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Rotate Image](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/06_rotate_image.md) | [48](https://leetcode.com/problems/rotate-image/) | Medium | transpose + reverse rows | [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| - [ ] | [Spiral Matrix](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/07_spiral_matrix.md) | [54](https://leetcode.com/problems/spiral-matrix/) | Medium | boundary shrinking | [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| - [ ] | [Set Matrix Zeroes](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/09_set_matrix_zeroes.md) | [73](https://leetcode.com/problems/set-matrix-zeroes/) | Medium | first row/col as markers | [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |

## Bit Manipulation (5)

| Done | Problem | LC # | Difficulty | Pattern | Folder |
|------|---------|------|------------|---------|--------|
| - [ ] | [Number of 1 Bits](../../14_Bit_Manipulation/03_Problems/01_Easy/02_number_of_1_bits.md) | [191](https://leetcode.com/problems/number-of-1-bits/) | Easy | n & (n - 1) | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | [Counting Bits](../../14_Bit_Manipulation/03_Problems/01_Easy/06_counting_bits.md) | [338](https://leetcode.com/problems/counting-bits/) | Easy | DP on bits | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | [Reverse Bits](../../14_Bit_Manipulation/03_Problems/01_Easy/07_reverse_bits.md) | [190](https://leetcode.com/problems/reverse-bits/) | Easy | shift and or | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | [Missing Number](../../14_Bit_Manipulation/03_Problems/01_Easy/04_missing_number.md) | [268](https://leetcode.com/problems/missing-number/) | Easy | XOR / sum formula | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | [Sum of Two Integers](../../14_Bit_Manipulation/03_Problems/02_Medium/11_sum_of_two_integers.md) | [371](https://leetcode.com/problems/sum-of-two-integers/) | Medium | XOR + carry (AND << 1) | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |

---

## Suggested order if you only do the Blind 75

1. Arrays & Hashing, Two Pointers, Sliding Window, Stack (weeks 1–3 of the plan)
2. Binary Search, Linked List, Trees (weeks 5–7)
3. Tries, Heap, Backtracking (week 7, week 4)
4. Graphs, Advanced Graphs (weeks 8–9)
5. 1-D DP, 2-D DP, Greedy, Intervals (weeks 9–11)
6. Math & Geometry, Bit Manipulation (week 11)
