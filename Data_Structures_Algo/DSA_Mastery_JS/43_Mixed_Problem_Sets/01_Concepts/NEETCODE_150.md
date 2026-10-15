# NeetCode 150

The NeetCode 150 is the Blind 75 plus 75 more problems that fill the gaps
(more stack, binary search, heap, backtracking, graph and 2-D DP practice).

**How to use**

- `B75` column: `*` means the problem is also in the Blind 75 (see [BLIND_75.md](BLIND_75.md)). Do those first.
- Tick the box only when you solved it **without looking at a solution**.
- "Folder" = where this curriculum teaches the pattern.

Progress: ___ / 150 (Blind 75 part: ___ / 75)

---

## Arrays & Hashing (9)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Contains Duplicate](../../03_Arrays/03_Problems/01_Easy/03_contains_duplicate.md) | [217](https://leetcode.com/problems/contains-duplicate/) | Easy | hash set | [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | * | [Valid Anagram](../../04_Strings/03_Problems/01_Easy/03_valid_anagram.md) | [242](https://leetcode.com/problems/valid-anagram/) | Easy | frequency count | [`04_Strings`](../../04_Strings/README.md), [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | * | [Two Sum](../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) | [1](https://leetcode.com/problems/two-sum/) | Easy | hash map (complement) | [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | * | [Group Anagrams](../../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md) | [49](https://leetcode.com/problems/group-anagrams/) | Medium | canonical key | [`05_Hashing`](../../05_Hashing/README.md) |
| - [ ] | * | [Top K Frequent Elements](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/05_top_k_frequent_elements.md) | [347](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | heap / bucket sort | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| - [ ] | * | [Encode and Decode Strings](../../04_Strings/03_Problems/02_Medium/09_encode_and_decode_strings.md) | [271](https://leetcode.com/problems/encode-and-decode-strings/) | Medium | length-prefix parsing | [`04_Strings`](../../04_Strings/README.md) |
| - [ ] | * | [Product of Array Except Self](../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/04_product_of_array_except_self.md) | [238](https://leetcode.com/problems/product-of-array-except-self/) | Medium | prefix / suffix product | [`08_Prefix_Sums_And_Difference_Arrays`](../../08_Prefix_Sums_And_Difference_Arrays/README.md) |
| - [ ] |  | [Valid Sudoku](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/12_valid_sudoku.md) | [36](https://leetcode.com/problems/valid-sudoku/) | Medium | hash sets per row/col/box | [`05_Hashing`](../../05_Hashing/README.md), [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| - [ ] | * | [Longest Consecutive Sequence](../../05_Hashing/03_Problems/02_Medium/10_longest_consecutive_sequence.md) | [128](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | hash set, start-of-run | [`05_Hashing`](../../05_Hashing/README.md) |

## Two Pointers (5)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Valid Palindrome](../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md) | [125](https://leetcode.com/problems/valid-palindrome/) | Easy | opposite ends | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| - [ ] |  | [Two Sum II - Input Array Is Sorted](../../06_Two_Pointers/03_Problems/02_Medium/03_two_sum_ii_sorted.md) | [167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | Medium | opposite ends on sorted | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| - [ ] | * | [3Sum](../../06_Two_Pointers/03_Problems/02_Medium/13_three_sum.md) | [15](https://leetcode.com/problems/3sum/) | Medium | sort + two pointers | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| - [ ] | * | [Container With Most Water](../../06_Two_Pointers/03_Problems/02_Medium/11_container_with_most_water.md) | [11](https://leetcode.com/problems/container-with-most-water/) | Medium | opposite ends, move shorter | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| - [ ] |  | [Trapping Rain Water](../../06_Two_Pointers/03_Problems/03_Hard/12_trapping_rain_water.md) | [42](https://leetcode.com/problems/trapping-rain-water/) | Hard | two pointers with left/right max | [`06_Two_Pointers`](../../06_Two_Pointers/README.md), [`16_Stacks`](../../16_Stacks/README.md) |

## Sliding Window (6)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Best Time to Buy and Sell Stock](../../03_Arrays/03_Problems/01_Easy/02_best_time_to_buy_and_sell_stock.md) | [121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | running min | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| - [ ] | * | [Longest Substring Without Repeating Characters](../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md) | [3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium | variable window + set | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| - [ ] | * | [Longest Repeating Character Replacement](../../07_Sliding_Window/03_Problems/02_Medium/04_longest_repeating_character_replacement.md) | [424](https://leetcode.com/problems/longest-repeating-character-replacement/) | Medium | variable window + max freq | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| - [ ] |  | [Permutation in String](../../07_Sliding_Window/03_Problems/02_Medium/06_permutation_in_string.md) | [567](https://leetcode.com/problems/permutation-in-string/) | Medium | fixed window + counts | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| - [ ] | * | [Minimum Window Substring](../../07_Sliding_Window/03_Problems/03_Hard/14_minimum_window_substring.md) | [76](https://leetcode.com/problems/minimum-window-substring/) | Hard | variable window + need/have | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| - [ ] |  | [Sliding Window Maximum](../../17_Queues_And_Deques/03_Problems/03_Hard/07_sliding_window_maximum.md) | [239](https://leetcode.com/problems/sliding-window-maximum/) | Hard | monotonic deque | [`17_Queues_And_Deques`](../../17_Queues_And_Deques/README.md), [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md) |

## Stack (7)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Valid Parentheses](../../16_Stacks/03_Problems/01_Easy/01_valid_parentheses.md) | [20](https://leetcode.com/problems/valid-parentheses/) | Easy | matching stack | [`16_Stacks`](../../16_Stacks/README.md) |
| - [ ] |  | [Min Stack](../../16_Stacks/03_Problems/02_Medium/02_min_stack.md) | [155](https://leetcode.com/problems/min-stack/) | Medium | two stacks | [`16_Stacks`](../../16_Stacks/README.md) |
| - [ ] |  | [Evaluate Reverse Polish Notation](../../16_Stacks/03_Problems/02_Medium/04_evaluate_rpn.md) | [150](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | Medium | expression stack | [`16_Stacks`](../../16_Stacks/README.md) |
| - [ ] |  | [Generate Parentheses](../../13_Backtracking/03_Problems/02_Medium/09_generate_parentheses.md) | [22](https://leetcode.com/problems/generate-parentheses/) | Medium | backtracking with open/close counts | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] |  | [Daily Temperatures](../../16_Stacks/03_Problems/02_Medium/05_daily_temperatures.md) | [739](https://leetcode.com/problems/daily-temperatures/) | Medium | monotonic stack | [`16_Stacks`](../../16_Stacks/README.md) |
| - [ ] |  | Car Fleet | [853](https://leetcode.com/problems/car-fleet/) | Medium | sort + stack of arrival times | [`16_Stacks`](../../16_Stacks/README.md) |
| - [ ] |  | [Largest Rectangle in Histogram](../../16_Stacks/03_Problems/03_Hard/12_largest_rectangle_histogram.md) | [84](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Hard | monotonic stack | [`16_Stacks`](../../16_Stacks/README.md) |

## Binary Search (7)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] |  | [Binary Search](../../10_Searching/03_Problems/01_Easy/01_binary_search.md) | [704](https://leetcode.com/problems/binary-search/) | Easy | classic | [`10_Searching`](../../10_Searching/README.md) |
| - [ ] |  | [Search a 2D Matrix](../../10_Searching/03_Problems/02_Medium/11_search_2d_matrix.md) | [74](https://leetcode.com/problems/search-a-2d-matrix/) | Medium | binary search on flattened index | [`10_Searching`](../../10_Searching/README.md) |
| - [ ] |  | [Koko Eating Bananas](../../10_Searching/03_Problems/02_Medium/12_koko_eating_bananas.md) | [875](https://leetcode.com/problems/koko-eating-bananas/) | Medium | binary search on answer | [`10_Searching`](../../10_Searching/README.md) |
| - [ ] | * | [Find Minimum in Rotated Sorted Array](../../10_Searching/03_Problems/02_Medium/09_find_minimum_rotated_sorted_array.md) | [153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | modified binary search | [`10_Searching`](../../10_Searching/README.md) |
| - [ ] | * | [Search in Rotated Sorted Array](../../10_Searching/03_Problems/02_Medium/07_search_rotated_sorted_array.md) | [33](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Medium | modified binary search | [`10_Searching`](../../10_Searching/README.md) |
| - [ ] |  | [Time Based Key-Value Store](../../10_Searching/03_Problems/02_Medium/15_time_based_key_value_store.md) | [981](https://leetcode.com/problems/time-based-key-value-store/) | Medium | hash map + binary search (upper bound) | [`10_Searching`](../../10_Searching/README.md) |
| - [ ] |  | [Median of Two Sorted Arrays](../../10_Searching/03_Problems/03_Hard/16_median_of_two_sorted_arrays.md) | [4](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard | binary search on partition | [`10_Searching`](../../10_Searching/README.md) |

## Linked List (11)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Reverse Linked List](../../15_Linked_Lists/03_Problems/01_Easy/01_reverse_linked_list.md) | [206](https://leetcode.com/problems/reverse-linked-list/) | Easy | in-place reversal | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | * | [Merge Two Sorted Lists](../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) | [21](https://leetcode.com/problems/merge-two-sorted-lists/) | Easy | dummy head | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | * | [Reorder List](../../15_Linked_Lists/03_Problems/02_Medium/14_reorder_list.md) | [143](https://leetcode.com/problems/reorder-list/) | Medium | middle + reverse + merge | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | * | [Remove Nth Node From End of List](../../15_Linked_Lists/03_Problems/02_Medium/06_remove_nth_from_end.md) | [19](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | Medium | two pointers with gap | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] |  | [Copy List with Random Pointer](../../15_Linked_Lists/03_Problems/02_Medium/16_copy_list_with_random_pointer.md) | [138](https://leetcode.com/problems/copy-list-with-random-pointer/) | Medium | hash map old -> new | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] |  | [Add Two Numbers](../../15_Linked_Lists/03_Problems/02_Medium/11_add_two_numbers.md) | [2](https://leetcode.com/problems/add-two-numbers/) | Medium | digit-by-digit with carry | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] | * | [Linked List Cycle](../../15_Linked_Lists/03_Problems/01_Easy/03_linked_list_cycle.md) | [141](https://leetcode.com/problems/linked-list-cycle/) | Easy | fast & slow | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| - [ ] |  | [Find the Duplicate Number](../../41_Advanced_Algorithm_Design/01_Classic_Techniques/03_Problems/02_Medium/02_find_the_duplicate_number.md) | [287](https://leetcode.com/problems/find-the-duplicate-number/) | Medium | fast & slow on array (Floyd) | [`15_Linked_Lists`](../../15_Linked_Lists/README.md), `41_Advanced_Algorithm_Design` |
| - [ ] |  | [LRU Cache](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/02_Medium/01_lru_cache.md) | [146](https://leetcode.com/problems/lru-cache/) | Medium | hash map + doubly linked list (or Map) | [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md) |
| - [ ] | * | [Merge K Sorted Lists](../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/07_merge_k_sorted_lists.md) | [23](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | k-way merge (heap) | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| - [ ] |  | [Reverse Nodes in k-Group](../../15_Linked_Lists/03_Problems/03_Hard/17_reverse_nodes_in_k_group.md) | [25](https://leetcode.com/problems/reverse-nodes-in-k-group/) | Hard | reverse in chunks | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |

## Trees (15)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Invert Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/04_invert_binary_tree.md) | [226](https://leetcode.com/problems/invert-binary-tree/) | Easy | tree DFS | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | * | [Maximum Depth of Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/01_maximum_depth.md) | [104](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Easy | tree DFS | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] |  | [Diameter of Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/07_diameter_of_binary_tree.md) | [543](https://leetcode.com/problems/diameter-of-binary-tree/) | Easy | post-order, return height | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] |  | [Balanced Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/06_balanced_binary_tree.md) | [110](https://leetcode.com/problems/balanced-binary-tree/) | Easy | post-order, return height or -1 | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | * | [Same Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/03_same_tree.md) | [100](https://leetcode.com/problems/same-tree/) | Easy | parallel DFS | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | * | [Subtree of Another Tree](../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/09_subtree_of_another_tree.md) | [572](https://leetcode.com/problems/subtree-of-another-tree/) | Easy | DFS + same tree | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | * | [Lowest Common Ancestor of a BST](../../21_Binary_Search_Trees/03_Problems/02_Medium/06_lowest_common_ancestor_bst.md) | [235](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | Medium | BST walk | [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| - [ ] | * | [Binary Tree Level Order Traversal](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/10_level_order_traversal.md) | [102](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium | tree BFS | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] |  | [Binary Tree Right Side View](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/12_right_side_view.md) | [199](https://leetcode.com/problems/binary-tree-right-side-view/) | Medium | BFS, last of each level | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] |  | [Count Good Nodes in Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/13_count_good_nodes.md) | [1448](https://leetcode.com/problems/count-good-nodes-in-binary-tree/) | Medium | DFS carrying max so far | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | * | [Validate Binary Search Tree](../../21_Binary_Search_Trees/03_Problems/02_Medium/07_validate_bst.md) | [98](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | DFS with bounds | [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| - [ ] | * | [Kth Smallest Element in a BST](../../21_Binary_Search_Trees/03_Problems/02_Medium/08_kth_smallest_in_bst.md) | [230](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Medium | inorder | [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| - [ ] | * | [Construct Binary Tree from Preorder and Inorder](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/18_construct_from_preorder_inorder.md) | [105](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | Medium | recursion + index map | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | * | [Binary Tree Maximum Path Sum](../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/19_maximum_path_sum.md) | [124](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Hard | post-order, global max | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| - [ ] | * | [Serialize and Deserialize Binary Tree](../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/20_serialize_deserialize.md) | [297](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Hard | pre-order with nulls | [`20_Trees/02_N_Ary_Trees_And_Misc`](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md) |

## Tries (3)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Implement Trie (Prefix Tree)](../../22_Tries/03_Problems/02_Medium/01_implement_trie.md) | [208](https://leetcode.com/problems/implement-trie-prefix-tree/) | Medium | trie | [`22_Tries`](../../22_Tries/README.md) |
| - [ ] | * | [Design Add and Search Words Data Structure](../../22_Tries/03_Problems/02_Medium/02_add_and_search_words.md) | [211](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Medium | trie + wildcard DFS | [`22_Tries`](../../22_Tries/README.md) |
| - [ ] | * | [Word Search II](../../22_Tries/03_Problems/03_Hard/10_word_search_ii.md) | [212](https://leetcode.com/problems/word-search-ii/) | Hard | trie + grid backtracking | [`22_Tries`](../../22_Tries/README.md) |

## Heap / Priority Queue (7)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] |  | [Kth Largest Element in a Stream](../../19_Heaps_And_Priority_Queues/03_Problems/01_Easy/02_kth_largest_in_stream.md) | [703](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy | min-heap of size k | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| - [ ] |  | [Last Stone Weight](../../19_Heaps_And_Priority_Queues/03_Problems/01_Easy/03_last_stone_weight.md) | [1046](https://leetcode.com/problems/last-stone-weight/) | Easy | max-heap simulation | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| - [ ] |  | [K Closest Points to Origin](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/04_k_closest_points.md) | [973](https://leetcode.com/problems/k-closest-points-to-origin/) | Medium | max-heap of size k | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| - [ ] |  | [Kth Largest Element in an Array](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/01_kth_largest_element.md) | [215](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | min-heap of size k / quickselect | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md), [`11_Sorting`](../../11_Sorting/README.md) |
| - [ ] |  | [Task Scheduler](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/09_task_scheduler.md) | [621](https://leetcode.com/problems/task-scheduler/) | Medium | max-heap + cooldown queue (or math) | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md), [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] |  | Design Twitter | [355](https://leetcode.com/problems/design-twitter/) | Medium | hash maps + heap merge | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| - [ ] | * | [Find Median from Data Stream](../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/08_find_median_data_stream.md) | [295](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | two heaps | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |

## Backtracking (9)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] |  | [Subsets](../../13_Backtracking/03_Problems/02_Medium/01_subsets.md) | [78](https://leetcode.com/problems/subsets/) | Medium | include / exclude | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] | * | [Combination Sum](../../13_Backtracking/03_Problems/02_Medium/06_combination_sum.md) | [39](https://leetcode.com/problems/combination-sum/) | Medium | backtracking with reuse | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] |  | [Permutations](../../13_Backtracking/03_Problems/02_Medium/03_permutations.md) | [46](https://leetcode.com/problems/permutations/) | Medium | backtracking with used set | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] |  | [Subsets II](../../13_Backtracking/03_Problems/02_Medium/02_subsets_ii.md) | [90](https://leetcode.com/problems/subsets-ii/) | Medium | sort + skip duplicates | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] |  | [Combination Sum II](../../13_Backtracking/03_Problems/02_Medium/07_combination_sum_ii.md) | [40](https://leetcode.com/problems/combination-sum-ii/) | Medium | sort + skip duplicates, no reuse | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] | * | [Word Search](../../13_Backtracking/03_Problems/02_Medium/11_word_search.md) | [79](https://leetcode.com/problems/word-search/) | Medium | grid backtracking | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] |  | [Palindrome Partitioning](../../13_Backtracking/03_Problems/02_Medium/10_palindrome_partitioning.md) | [131](https://leetcode.com/problems/palindrome-partitioning/) | Medium | backtracking over cut points | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] |  | [Letter Combinations of a Phone Number](../../13_Backtracking/03_Problems/02_Medium/08_letter_combinations_phone.md) | [17](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Medium | backtracking over choices | [`13_Backtracking`](../../13_Backtracking/README.md) |
| - [ ] |  | [N-Queens](../../13_Backtracking/03_Problems/03_Hard/12_n_queens.md) | [51](https://leetcode.com/problems/n-queens/) | Hard | backtracking with column/diagonal sets | [`13_Backtracking`](../../13_Backtracking/README.md) |

## Graphs (13)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Number of Islands](../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md) | [200](https://leetcode.com/problems/number-of-islands/) | Medium | grid BFS/DFS | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] |  | [Max Area of Island](../../24_Graph_Traversal/03_Problems/02_Medium/06_max_area_of_island.md) | [695](https://leetcode.com/problems/max-area-of-island/) | Medium | grid DFS returning size | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] | * | [Clone Graph](../../24_Graph_Traversal/03_Problems/02_Medium/09_clone_graph.md) | [133](https://leetcode.com/problems/clone-graph/) | Medium | DFS + map of copies | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] |  | [Walls and Gates](../../24_Graph_Traversal/03_Problems/02_Medium/11_walls_and_gates.md) | [286](https://leetcode.com/problems/walls-and-gates/) | Medium | multi-source BFS | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] |  | [Rotting Oranges](../../24_Graph_Traversal/03_Problems/02_Medium/10_rotting_oranges.md) | [994](https://leetcode.com/problems/rotting-oranges/) | Medium | multi-source BFS by levels | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md), [`17_Queues_And_Deques`](../../17_Queues_And_Deques/README.md) |
| - [ ] | * | [Pacific Atlantic Water Flow](../../24_Graph_Traversal/03_Problems/02_Medium/14_pacific_atlantic_water_flow.md) | [417](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Medium | DFS from borders | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] |  | [Surrounded Regions](../../24_Graph_Traversal/03_Problems/02_Medium/13_surrounded_regions.md) | [130](https://leetcode.com/problems/surrounded-regions/) | Medium | DFS from borders, then flip | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| - [ ] | * | [Course Schedule](../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) | [207](https://leetcode.com/problems/course-schedule/) | Medium | topological sort | [`26_Topological_Sorting`](../../26_Topological_Sorting/README.md) |
| - [ ] |  | [Course Schedule II](../../26_Topological_Sorting/03_Problems/02_Medium/02_course_schedule_ii.md) | [210](https://leetcode.com/problems/course-schedule-ii/) | Medium | topological sort (Kahn) | [`26_Topological_Sorting`](../../26_Topological_Sorting/README.md) |
| - [ ] | * | [Graph Valid Tree](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/02_graph_valid_tree.md) | [261](https://leetcode.com/problems/graph-valid-tree/) | Medium | union-find | [`27_Union_Find_Disjoint_Set/01_Union_Find_Basics`](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| - [ ] | * | [Number of Connected Components in an Undirected Graph](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/01_number_of_connected_components.md) | [323](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Medium | union-find | [`27_Union_Find_Disjoint_Set/01_Union_Find_Basics`](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| - [ ] |  | [Redundant Connection](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/03_redundant_connection.md) | [684](https://leetcode.com/problems/redundant-connection/) | Medium | union-find, first cycle edge | [`27_Union_Find_Disjoint_Set/01_Union_Find_Basics`](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| - [ ] |  | [Word Ladder](../../24_Graph_Traversal/03_Problems/03_Hard/18_word_ladder.md) | [127](https://leetcode.com/problems/word-ladder/) | Hard | BFS over word patterns | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |

## Advanced Graphs (6)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] |  | [Reconstruct Itinerary](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/03_Hard/08_reconstruct_itinerary.md) | [332](https://leetcode.com/problems/reconstruct-itinerary/) | Hard | Eulerian path (Hierholzer) | [`25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler`](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) |
| - [ ] |  | [Min Cost to Connect All Points](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/03_Problems/02_Medium/02_min_cost_to_connect_all_points.md) | [1584](https://leetcode.com/problems/min-cost-to-connect-all-points/) | Medium | MST (Prim / Kruskal) | [`25_Graph_Algorithms/02_Minimum_Spanning_Trees`](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md) |
| - [ ] |  | [Network Delay Time](../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/01_network_delay_time.md) | [743](https://leetcode.com/problems/network-delay-time/) | Medium | Dijkstra | [`25_Graph_Algorithms/01_Shortest_Paths`](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| - [ ] |  | [Swim in Rising Water](../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/03_Hard/05_swim_in_rising_water.md) | [778](https://leetcode.com/problems/swim-in-rising-water/) | Hard | Dijkstra on grid / binary search + BFS | [`25_Graph_Algorithms/01_Shortest_Paths`](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| - [ ] | * | [Alien Dictionary](../../26_Topological_Sorting/03_Problems/03_Hard/08_alien_dictionary.md) | [269](https://leetcode.com/problems/alien-dictionary/) | Hard | topological sort | [`26_Topological_Sorting`](../../26_Topological_Sorting/README.md) |
| - [ ] |  | [Cheapest Flights Within K Stops](../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/02_cheapest_flights_within_k_stops.md) | [787](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Medium | Bellman-Ford (k rounds) | [`25_Graph_Algorithms/01_Shortest_Paths`](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |

## 1-D Dynamic Programming (12)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Climbing Stairs](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/01_Easy/02_climbing_stairs.md) | [70](https://leetcode.com/problems/climbing-stairs/) | Easy | fibonacci DP | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] |  | [Min Cost Climbing Stairs](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/01_Easy/03_min_cost_climbing_stairs.md) | [746](https://leetcode.com/problems/min-cost-climbing-stairs/) | Easy | 1-D DP | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | * | [House Robber](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/05_house_robber.md) | [198](https://leetcode.com/problems/house-robber/) | Medium | take / skip | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | * | [House Robber II](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/06_house_robber_ii.md) | [213](https://leetcode.com/problems/house-robber-ii/) | Medium | circular, run twice | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | * | [Longest Palindromic Substring](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/05_longest_palindromic_substring.md) | [5](https://leetcode.com/problems/longest-palindromic-substring/) | Medium | expand around center | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |
| - [ ] | * | [Palindromic Substrings](../../04_Strings/03_Problems/02_Medium/13_palindromic_substrings.md) | [647](https://leetcode.com/problems/palindromic-substrings/) | Medium | expand around center | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |
| - [ ] | * | [Decode Ways](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/10_decode_ways.md) | [91](https://leetcode.com/problems/decode-ways/) | Medium | 1-D DP, 2 choices | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | * | [Coin Change](../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/04_coin_change_min_coins.md) | [322](https://leetcode.com/problems/coin-change/) | Medium | unbounded knapsack (min) | [`29_Dynamic_Programming/02_Knapsack`](../../29_Dynamic_Programming/02_Knapsack/README.md) |
| - [ ] | * | [Maximum Product Subarray](../../03_Arrays/03_Problems/02_Medium/14_maximum_product_subarray.md) | [152](https://leetcode.com/problems/maximum-product-subarray/) | Medium | track max and min | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | * | [Word Break](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/17_word_break.md) | [139](https://leetcode.com/problems/word-break/) | Medium | DP over prefixes | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] | * | [Longest Increasing Subsequence](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/03_longest_increasing_subsequence.md) | [300](https://leetcode.com/problems/longest-increasing-subsequence/) | Medium | O(n^2) DP / patience | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| - [ ] |  | [Partition Equal Subset Sum](../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/03_subset_sum_partition_equal.md) | [416](https://leetcode.com/problems/partition-equal-subset-sum/) | Medium | 0/1 knapsack (boolean) | [`29_Dynamic_Programming/02_Knapsack`](../../29_Dynamic_Programming/02_Knapsack/README.md) |

## 2-D Dynamic Programming (11)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Unique Paths](../../29_Dynamic_Programming/04_Grid_DP/03_Problems/02_Medium/01_unique_paths.md) | [62](https://leetcode.com/problems/unique-paths/) | Medium | grid DP | [`29_Dynamic_Programming/04_Grid_DP`](../../29_Dynamic_Programming/04_Grid_DP/README.md) |
| - [ ] | * | [Longest Common Subsequence](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/01_longest_common_subsequence.md) | [1143](https://leetcode.com/problems/longest-common-subsequence/) | Medium | 2-D string DP | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |
| - [ ] |  | [Best Time to Buy and Sell Stock with Cooldown](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/18_stock_with_cooldown.md) | [309](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | Medium | state machine DP | [`29_Dynamic_Programming/06_Advanced_DP`](../../29_Dynamic_Programming/06_Advanced_DP/README.md) |
| - [ ] |  | [Coin Change II](../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/05_coin_change_ii.md) | [518](https://leetcode.com/problems/coin-change-ii/) | Medium | unbounded knapsack (count) | [`29_Dynamic_Programming/02_Knapsack`](../../29_Dynamic_Programming/02_Knapsack/README.md) |
| - [ ] |  | [Target Sum](../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/07_target_sum.md) | [494](https://leetcode.com/problems/target-sum/) | Medium | 0/1 knapsack (count) | [`29_Dynamic_Programming/02_Knapsack`](../../29_Dynamic_Programming/02_Knapsack/README.md) |
| - [ ] |  | [Interleaving String](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/12_interleaving_string.md) | [97](https://leetcode.com/problems/interleaving-string/) | Medium | 2-D string DP | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |
| - [ ] |  | [Longest Increasing Path in a Matrix](../../29_Dynamic_Programming/04_Grid_DP/03_Problems/03_Hard/08_longest_increasing_path_in_matrix.md) | [329](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) | Hard | DFS + memo on grid | [`29_Dynamic_Programming/04_Grid_DP`](../../29_Dynamic_Programming/04_Grid_DP/README.md) |
| - [ ] |  | [Distinct Subsequences](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/03_Hard/11_distinct_subsequences.md) | [115](https://leetcode.com/problems/distinct-subsequences/) | Hard | 2-D string DP | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |
| - [ ] |  | [Edit Distance](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/10_edit_distance.md) | [72](https://leetcode.com/problems/edit-distance/) | Medium | 2-D string DP | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |
| - [ ] |  | [Burst Balloons](../../29_Dynamic_Programming/05_Interval_DP/03_Problems/03_Hard/06_burst_balloons.md) | [312](https://leetcode.com/problems/burst-balloons/) | Hard | interval DP | [`29_Dynamic_Programming/05_Interval_DP`](../../29_Dynamic_Programming/05_Interval_DP/README.md) |
| - [ ] |  | [Regular Expression Matching](../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/03_Hard/16_regular_expression_matching.md) | [10](https://leetcode.com/problems/regular-expression-matching/) | Hard | 2-D string DP | [`29_Dynamic_Programming/03_Strings_And_Sequences`](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) |

## Greedy (8)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Maximum Subarray](../../03_Arrays/03_Problems/02_Medium/04_maximum_subarray.md) | [53](https://leetcode.com/problems/maximum-subarray/) | Medium | Kadane | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] | * | [Jump Game](../../28_Greedy_Algorithms/03_Problems/02_Medium/05_jump_game.md) | [55](https://leetcode.com/problems/jump-game/) | Medium | farthest reach | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] |  | [Jump Game II](../../28_Greedy_Algorithms/03_Problems/02_Medium/06_jump_game_ii.md) | [45](https://leetcode.com/problems/jump-game-ii/) | Medium | greedy BFS-like levels | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] |  | [Gas Station](../../28_Greedy_Algorithms/03_Problems/02_Medium/07_gas_station.md) | [134](https://leetcode.com/problems/gas-station/) | Medium | reset start when tank < 0 | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] |  | [Hand of Straights](../../28_Greedy_Algorithms/03_Problems/02_Medium/12_hand_of_straights.md) | [846](https://leetcode.com/problems/hand-of-straights/) | Medium | sorted map, consume runs | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] |  | [Merge Triplets to Form Target Triplet](../../28_Greedy_Algorithms/03_Problems/02_Medium/13_merge_triplets.md) | [1899](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/) | Medium | filter + check each index | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] |  | [Partition Labels](../../28_Greedy_Algorithms/03_Problems/02_Medium/09_partition_labels.md) | [763](https://leetcode.com/problems/partition-labels/) | Medium | last occurrence + sweep | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |
| - [ ] |  | [Valid Parenthesis String](../../28_Greedy_Algorithms/03_Problems/02_Medium/14_valid_parenthesis_string.md) | [678](https://leetcode.com/problems/valid-parenthesis-string/) | Medium | min/max open count | [`28_Greedy_Algorithms`](../../28_Greedy_Algorithms/README.md) |

## Intervals (6)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Insert Interval](../../31_Intervals/03_Problems/02_Medium/04_insert_interval.md) | [57](https://leetcode.com/problems/insert-interval/) | Medium | three-phase scan | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] | * | [Merge Intervals](../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md) | [56](https://leetcode.com/problems/merge-intervals/) | Medium | sort + merge | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] | * | [Non-overlapping Intervals](../../31_Intervals/03_Problems/02_Medium/06_non_overlapping_intervals.md) | [435](https://leetcode.com/problems/non-overlapping-intervals/) | Medium | sort by end, greedy | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] | * | [Meeting Rooms](../../31_Intervals/03_Problems/01_Easy/01_meeting_rooms.md) | [252](https://leetcode.com/problems/meeting-rooms/) | Easy | sort + overlap check | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] | * | [Meeting Rooms II](../../31_Intervals/03_Problems/02_Medium/09_meeting_rooms_ii.md) | [253](https://leetcode.com/problems/meeting-rooms-ii/) | Medium | min-heap / sweep line | [`31_Intervals`](../../31_Intervals/README.md) |
| - [ ] |  | [Minimum Interval to Include Each Query](../../31_Intervals/03_Problems/03_Hard/15_minimum_interval_to_include_each_query.md) | [1851](https://leetcode.com/problems/minimum-interval-to-include-each-query/) | Hard | sort + min-heap by size | [`31_Intervals`](../../31_Intervals/README.md), [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |

## Math & Geometry (8)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] | * | [Rotate Image](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/06_rotate_image.md) | [48](https://leetcode.com/problems/rotate-image/) | Medium | transpose + reverse | [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| - [ ] | * | [Spiral Matrix](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/07_spiral_matrix.md) | [54](https://leetcode.com/problems/spiral-matrix/) | Medium | boundary shrinking | [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| - [ ] | * | [Set Matrix Zeroes](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/09_set_matrix_zeroes.md) | [73](https://leetcode.com/problems/set-matrix-zeroes/) | Medium | first row/col markers | [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| - [ ] |  | [Happy Number](../../00_Foundations/04_Mathematics_For_DSA/03_Problems/01_Easy/05_happy_number.md) | [202](https://leetcode.com/problems/happy-number/) | Easy | cycle detection (set / fast-slow) | [`00_Foundations/04_Mathematics_For_DSA`](../../00_Foundations/04_Mathematics_For_DSA/README.md) |
| - [ ] |  | Plus One | [66](https://leetcode.com/problems/plus-one/) | Easy | carry propagation | [`03_Arrays`](../../03_Arrays/README.md) |
| - [ ] |  | [Pow(x, n)](../../00_Foundations/04_Mathematics_For_DSA/03_Problems/02_Medium/06_pow_x_n.md) | [50](https://leetcode.com/problems/powx-n/) | Medium | fast exponentiation | [`00_Foundations/04_Mathematics_For_DSA`](../../00_Foundations/04_Mathematics_For_DSA/README.md) |
| - [ ] |  | [Multiply Strings](../../04_Strings/03_Problems/02_Medium/14_multiply_strings.md) | [43](https://leetcode.com/problems/multiply-strings/) | Medium | digit grid multiplication | [`04_Strings`](../../04_Strings/README.md) |
| - [ ] |  | Detect Squares | [2013](https://leetcode.com/problems/detect-squares/) | Medium | hash map of point counts | [`05_Hashing`](../../05_Hashing/README.md) |

## Bit Manipulation (7)

| Done | B75 | Problem | LC # | Difficulty | Pattern | Folder |
|------|-----|---------|------|------------|---------|--------|
| - [ ] |  | [Single Number](../../14_Bit_Manipulation/03_Problems/01_Easy/01_single_number.md) | [136](https://leetcode.com/problems/single-number/) | Easy | XOR everything | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | * | [Number of 1 Bits](../../14_Bit_Manipulation/03_Problems/01_Easy/02_number_of_1_bits.md) | [191](https://leetcode.com/problems/number-of-1-bits/) | Easy | n & (n - 1) | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | * | [Counting Bits](../../14_Bit_Manipulation/03_Problems/01_Easy/06_counting_bits.md) | [338](https://leetcode.com/problems/counting-bits/) | Easy | DP on bits | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | * | [Reverse Bits](../../14_Bit_Manipulation/03_Problems/01_Easy/07_reverse_bits.md) | [190](https://leetcode.com/problems/reverse-bits/) | Easy | shift and or | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | * | [Missing Number](../../14_Bit_Manipulation/03_Problems/01_Easy/04_missing_number.md) | [268](https://leetcode.com/problems/missing-number/) | Easy | XOR / sum | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] | * | [Sum of Two Integers](../../14_Bit_Manipulation/03_Problems/02_Medium/11_sum_of_two_integers.md) | [371](https://leetcode.com/problems/sum-of-two-integers/) | Medium | XOR + carry | [`14_Bit_Manipulation`](../../14_Bit_Manipulation/README.md) |
| - [ ] |  | [Reverse Integer](../../00_Foundations/04_Mathematics_For_DSA/03_Problems/02_Medium/02_reverse_integer.md) | [7](https://leetcode.com/problems/reverse-integer/) | Medium | digit peel with overflow check | [`00_Foundations/04_Mathematics_For_DSA`](../../00_Foundations/04_Mathematics_For_DSA/README.md) |

---

## Counts by topic

| Topic | Total | In Blind 75 |
|-------|-------|-------------|
| Arrays & Hashing | 9 | 8 |
| Two Pointers | 5 | 3 |
| Sliding Window | 6 | 4 |
| Stack | 7 | 1 |
| Binary Search | 7 | 2 |
| Linked List | 11 | 6 |
| Trees | 15 | 11 |
| Tries | 3 | 3 |
| Heap | 7 | 1 |
| Backtracking | 9 | 2 |
| Graphs | 13 | 6 |
| Advanced Graphs | 6 | 1 |
| 1-D DP | 12 | 10 |
| 2-D DP | 11 | 2 |
| Greedy | 8 | 2 |
| Intervals | 6 | 5 |
| Math & Geometry | 8 | 3 |
| Bit Manipulation | 7 | 5 |
| **Total** | **150** | **75** |
