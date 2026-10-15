# Top Interview Questions by Company Style

Different kinds of companies lean on different kinds of problems.
This file groups **commonly reported** question styles so you can tilt your practice toward the job you want.

**Important:** nothing here is an official question bank. These are patterns people commonly report
after interviews, and they change over time. Treat them as "practice this more", not "this will be asked".

---

## Quick guide: where to spend your time

| You are interviewing at... | Spend most time on | Also practice |
|----------------------------|--------------------|---------------|
| Big tech (generalist SWE / frontend SWE) | arrays, strings, hashing, trees, graphs, DP | heaps, intervals, binary search, design-ish problems |
| Startups / product companies | hashing, strings, "design a small system" problems | arrays, two pointers, sliding window, trees |
| Frontend-focused roles | string parsing, trees (DOM-like), recursion, hashing | queues/stacks, intervals, JavaScript-specific utilities |

---

## 1. Big-tech generalist (arrays / strings / graphs / DP)

Commonly reported style: one or two medium problems in 45 minutes, strong focus on
**optimal complexity**, clean code, and talking through trade-offs. Hard DP and graph problems appear
more often in later rounds and for senior roles.

### Commonly reported problems

| Area | Problems (LC #) | Difficulty | Folder |
|------|-----------------|------------|--------|
| Arrays / hashing | Two Sum ([LC 1](https://leetcode.com/problems/two-sum/) · [statement](../../03_Arrays/03_Problems/01_Easy/01_two_sum.md)), Group Anagrams ([LC 49](https://leetcode.com/problems/group-anagrams/) · [statement](../../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md)), Product of Array Except Self ([LC 238](https://leetcode.com/problems/product-of-array-except-self/) · [statement](../../03_Arrays/03_Problems/02_Medium/08_product_of_array_except_self.md)), Longest Consecutive Sequence ([LC 128](https://leetcode.com/problems/longest-consecutive-sequence/) · [statement](../../05_Hashing/03_Problems/02_Medium/10_longest_consecutive_sequence.md)), Top K Frequent Elements ([LC 347](https://leetcode.com/problems/top-k-frequent-elements/) · [statement](../../05_Hashing/03_Problems/02_Medium/09_top_k_frequent_elements.md)) | Easy–Medium | [`03_Arrays`](../../03_Arrays/README.md), [`05_Hashing`](../../05_Hashing/README.md) |
| Two pointers / window | 3Sum ([LC 15](https://leetcode.com/problems/3sum/) · [statement](../../06_Two_Pointers/03_Problems/02_Medium/13_three_sum.md)), Container With Most Water ([LC 11](https://leetcode.com/problems/container-with-most-water/) · [statement](../../06_Two_Pointers/03_Problems/02_Medium/11_container_with_most_water.md)), Trapping Rain Water ([LC 42](https://leetcode.com/problems/trapping-rain-water/) · [statement](../../06_Two_Pointers/03_Problems/03_Hard/12_trapping_rain_water.md)), Longest Substring Without Repeating Characters ([LC 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) · [statement](../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md)), Minimum Window Substring ([LC 76](https://leetcode.com/problems/minimum-window-substring/) · [statement](../../07_Sliding_Window/03_Problems/03_Hard/14_minimum_window_substring.md)) | Medium–Hard | [`06_Two_Pointers`](../../06_Two_Pointers/README.md), [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| Strings | Valid Palindrome ([LC 125](https://leetcode.com/problems/valid-palindrome/) · [statement](../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md)), Longest Palindromic Substring ([LC 5](https://leetcode.com/problems/longest-palindromic-substring/) · [statement](../../04_Strings/03_Problems/02_Medium/07_longest_palindromic_substring.md)), String to Integer atoi ([LC 8](https://leetcode.com/problems/string-to-integer-atoi/) · [statement](../../04_Strings/03_Problems/02_Medium/06_string_to_integer_atoi.md)), Decode String ([LC 394](https://leetcode.com/problems/decode-string/) · [statement](../../16_Stacks/03_Problems/02_Medium/08_decode_string.md)) | Easy–Medium | [`04_Strings`](../../04_Strings/README.md), [`16_Stacks`](../../16_Stacks/README.md) |
| Linked lists | Reverse Linked List ([LC 206](https://leetcode.com/problems/reverse-linked-list/) · [statement](../../15_Linked_Lists/03_Problems/01_Easy/01_reverse_linked_list.md)), Merge K Sorted Lists ([LC 23](https://leetcode.com/problems/merge-k-sorted-lists/) · [statement](../../15_Linked_Lists/03_Problems/03_Hard/18_merge_k_sorted_lists.md)), LRU Cache ([LC 146](https://leetcode.com/problems/lru-cache/) · [statement](../../15_Linked_Lists/03_Problems/02_Medium/20_lru_cache.md)), Copy List with Random Pointer ([LC 138](https://leetcode.com/problems/copy-list-with-random-pointer/) · [statement](../../15_Linked_Lists/03_Problems/02_Medium/16_copy_list_with_random_pointer.md)) | Easy–Hard | [`15_Linked_Lists`](../../15_Linked_Lists/README.md), [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md) |
| Trees | Level Order Traversal ([LC 102](https://leetcode.com/problems/binary-tree-level-order-traversal/) · [statement](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/10_level_order_traversal.md)), Validate BST ([LC 98](https://leetcode.com/problems/validate-binary-search-tree/) · [statement](../../21_Binary_Search_Trees/03_Problems/02_Medium/07_validate_bst.md)), LCA of a Binary Tree ([LC 236](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) · [statement](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/17_lowest_common_ancestor.md)), Binary Tree Maximum Path Sum ([LC 124](https://leetcode.com/problems/binary-tree-maximum-path-sum/) · [statement](../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/19_maximum_path_sum.md)), Serialize/Deserialize ([LC 297](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) · [statement](../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/20_serialize_deserialize.md)) | Medium–Hard | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md), [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| Graphs | Number of Islands ([LC 200](https://leetcode.com/problems/number-of-islands/) · [statement](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/14_number_of_islands.md)), Clone Graph ([LC 133](https://leetcode.com/problems/clone-graph/) · [statement](../../24_Graph_Traversal/03_Problems/02_Medium/09_clone_graph.md)), Course Schedule ([LC 207](https://leetcode.com/problems/course-schedule/) · [statement](../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md)), Word Ladder ([LC 127](https://leetcode.com/problems/word-ladder/) · [statement](../../24_Graph_Traversal/03_Problems/03_Hard/18_word_ladder.md)), Alien Dictionary ([LC 269](https://leetcode.com/problems/alien-dictionary/) · [statement](../../26_Topological_Sorting/03_Problems/03_Hard/08_alien_dictionary.md)), Network Delay Time ([LC 743](https://leetcode.com/problems/network-delay-time/) · [statement](../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/01_network_delay_time.md)) | Medium–Hard | [`23_Graphs/*`](../../23_Graphs/README.md) |
| DP | Coin Change (322), Longest Increasing Subsequence (300), Edit Distance (72), Word Break (139), Longest Common Subsequence (1143), Unique Paths (62) | Medium–Hard | [`29_Dynamic_Programming/*`](../../29_Dynamic_Programming/README.md) |
| Heaps / intervals | Meeting Rooms II ([LC 253](https://leetcode.com/problems/meeting-rooms-ii/) · [statement](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/11_meeting_rooms_ii.md)), Merge Intervals ([LC 56](https://leetcode.com/problems/merge-intervals/) · [statement](../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md)), Kth Largest Element ([LC 215](https://leetcode.com/problems/kth-largest-element-in-an-array/) · [statement](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/01_kth_largest_element.md)), Find Median from Data Stream ([LC 295](https://leetcode.com/problems/find-median-from-data-stream/) · [statement](../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/08_find_median_data_stream.md)), Task Scheduler ([LC 621](https://leetcode.com/problems/task-scheduler/) · [statement](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/09_task_scheduler.md)) | Medium–Hard | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md), [`31_Intervals`](../../31_Intervals/README.md) |
| Backtracking | Subsets ([LC 78](https://leetcode.com/problems/subsets/) · [statement](../../13_Backtracking/03_Problems/02_Medium/01_subsets.md)), Permutations ([LC 46](https://leetcode.com/problems/permutations/) · [statement](../../13_Backtracking/03_Problems/02_Medium/03_permutations.md)), Combination Sum ([LC 39](https://leetcode.com/problems/combination-sum/) · [statement](../../13_Backtracking/03_Problems/02_Medium/06_combination_sum.md)), Word Search ([LC 79](https://leetcode.com/problems/word-search/) · [statement](../../13_Backtracking/03_Problems/02_Medium/11_word_search.md)), N-Queens ([LC 51](https://leetcode.com/problems/n-queens/) · [statement](../../13_Backtracking/03_Problems/03_Hard/12_n_queens.md)) | Medium–Hard | [`13_Backtracking`](../../13_Backtracking/README.md) |

### What they tend to probe

- "Can you do better than O(n log n)?" Know when the answer is "no, because sorting-based lower bound" vs "yes, with a hash map / counting."
- Follow-ups that change one constraint: "What if the input does not fit in memory?", "What if it is a stream?", "What if k is huge?"
- Edge cases without being told: empty input, one element, all duplicates, negative numbers, overflow.

### How to prepare

Work the full 12-week plan in [ROADMAP.md](../../ROADMAP.md). Finish Blind 75, then NeetCode 150. Do all ten [mock sets](../../44_Mock_Interviews/README.md) under time.

---

## 2. Startups / product companies (hashing + design-ish problems)

Commonly reported style: fewer "pure algorithm" questions, more **practical** problems that look like
real code: caches, rate limiters, event systems, parsers, schedulers. They care about clean, working
code, good naming, and tests. Complexity still matters, but "it works and I can read it" matters more.

### Commonly reported problems

| Problem | What it tests | Difficulty | Folder |
|---------|---------------|------------|--------|
| LRU Cache ([LC 146](https://leetcode.com/problems/lru-cache/) · [statement](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/02_Medium/01_lru_cache.md)) | hash map + doubly linked list, or `Map` insertion order | Medium | [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md) |
| LFU Cache ([LC 460](https://leetcode.com/problems/lfu-cache/) · [statement](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/03_Hard/02_lfu_cache.md)) | two-level maps, frequency buckets | Hard | [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md) |
| Design a rate limiter (sliding window log / token bucket) | queue of timestamps, hash map per user | Medium | [`17_Queues_And_Deques`](../../17_Queues_And_Deques/README.md), [`05_Hashing`](../../05_Hashing/README.md) |
| Design an event emitter (`on`, `off`, `emit`, `once`) | hash map of arrays, closures, removing while iterating | Easy–Medium | [`05_Hashing`](../../05_Hashing/README.md) |
| Design Hit Counter ([LC 362](https://leetcode.com/problems/design-hit-counter/) · [statement](../../17_Queues_And_Deques/03_Problems/02_Medium/11_design_hit_counter.md)) | queue of timestamps, sliding window | Medium | [`17_Queues_And_Deques`](../../17_Queues_And_Deques/README.md) |
| Time Based Key-Value Store ([LC 981](https://leetcode.com/problems/time-based-key-value-store/) · [statement](../../10_Searching/03_Problems/02_Medium/15_time_based_key_value_store.md)) | hash map + binary search | Medium | [`10_Searching`](../../10_Searching/README.md) |
| Insert Delete GetRandom O([LC 1](https://leetcode.com/problems/two-sum/) · [statement](../../05_Hashing/03_Problems/01_Easy/01_two_sum.md)) ([LC 380](https://leetcode.com/problems/insert-delete-getrandom-o1/)) | hash map + array swap-remove | Medium | [`05_Hashing`](../../05_Hashing/README.md) |
| Design Twitter ([LC 355](https://leetcode.com/problems/design-twitter/)) | hash maps + heap merge | Medium | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| Logger Rate Limiter ([LC 359](https://leetcode.com/problems/logger-rate-limiter/)) | hash map of last-seen times | Easy | [`05_Hashing`](../../05_Hashing/README.md) |
| Top K Frequent Words ([LC 692](https://leetcode.com/problems/top-k-frequent-words/) · [statement](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/06_top_k_frequent_words.md)) | hash map + heap with custom comparator | Medium | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| Group Anagrams ([LC 49](https://leetcode.com/problems/group-anagrams/) · [statement](../../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md)), Valid Sudoku ([LC 36](https://leetcode.com/problems/valid-sudoku/) · [statement](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/12_valid_sudoku.md)) | choosing a good hash key | Medium | [`05_Hashing`](../../05_Hashing/README.md) |
| Merge Intervals ([LC 56](https://leetcode.com/problems/merge-intervals/) · [statement](../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md)), Meeting Rooms II ([LC 253](https://leetcode.com/problems/meeting-rooms-ii/) · [statement](../../31_Intervals/03_Problems/02_Medium/09_meeting_rooms_ii.md)) | calendar / scheduling logic | Medium | [`31_Intervals`](../../31_Intervals/README.md) |
| Evaluate expression / Basic Calculator ([LC 224](https://leetcode.com/problems/basic-calculator/), [LC 227](https://leetcode.com/problems/basic-calculator-ii/) · [statement](../../16_Stacks/03_Problems/02_Medium/11_basic_calculator.md)) | stack-based parsing | Medium–Hard | [`16_Stacks`](../../16_Stacks/README.md) |
| Task Scheduler ([LC 621](https://leetcode.com/problems/task-scheduler/) · [statement](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/09_task_scheduler.md)) | greedy + heap | Medium | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| Flatten nested list / dict | recursion, iterators | Easy–Medium | [`13_Backtracking`](../../13_Backtracking/README.md) |
| Implement `deepEqual`, `deepClone` | recursion over objects, cycle handling | Medium | [`13_Backtracking`](../../13_Backtracking/README.md) |

### What they tend to probe

- "How would you test this?" Write asserts as you go; it is a huge plus.
- "What happens with concurrent calls / a million users?" Talk about memory growth and eviction.
- Naming and structure. A class with clear methods beats a clever one-liner.

### How to prepare

Weeks 1–8 of the plan plus [`31_Intervals`](../../31_Intervals/README.md), [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md). Practice building small
classes (`LRUCache`, `RateLimiter`, `EventEmitter`) from scratch with tests in under 20 minutes.

---

## 3. Frontend-focused DSA (string parsing + tree-shaped data)

Commonly reported style: DSA questions that look like UI work. Trees that resemble the DOM, strings that
resemble templates or paths, recursion over nested JSON. Expect at least one "JavaScript-specific"
question that is not DSA at all (see the box below).

### Commonly reported problems

| Problem | Pattern | Difficulty | Folder |
|---------|---------|------------|--------|
| Valid Parentheses ([LC 20](https://leetcode.com/problems/valid-parentheses/) · [statement](../../16_Stacks/03_Problems/01_Easy/01_valid_parentheses.md)), Minimum Remove to Make Valid Parentheses ([LC 1249](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/)) | stack matching | Easy–Medium | [`16_Stacks`](../../16_Stacks/README.md) |
| Decode String ([LC 394](https://leetcode.com/problems/decode-string/) · [statement](../../16_Stacks/03_Problems/02_Medium/08_decode_string.md)) | nested stack parsing (think template expansion) | Medium | [`16_Stacks`](../../16_Stacks/README.md) |
| Simplify Path ([LC 71](https://leetcode.com/problems/simplify-path/) · [statement](../../16_Stacks/03_Problems/02_Medium/07_simplify_path.md)) | stack of path segments | Medium | [`16_Stacks`](../../16_Stacks/README.md) |
| String Compression ([LC 443](https://leetcode.com/problems/string-compression/) · [statement](../../04_Strings/03_Problems/02_Medium/11_string_compression.md)), Run-length encode/decode | two pointers on strings | Medium | [`04_Strings`](../../04_Strings/README.md), [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| Reverse Words in a String ([LC 151](https://leetcode.com/problems/reverse-words-in-a-string/) · [statement](../../04_Strings/03_Problems/02_Medium/10_reverse_words_in_a_string.md)) | string parsing | Medium | [`04_Strings`](../../04_Strings/README.md) |
| Longest Substring Without Repeating Characters ([LC 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) · [statement](../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md)) | sliding window | Medium | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| Flatten a nested array / object (recursion, depth parameter) | recursion | Easy–Medium | [`13_Backtracking`](../../13_Backtracking/README.md) |
| Nested List Weight Sum ([LC 339](https://leetcode.com/problems/nested-list-weight-sum/)) | recursion / DFS with depth | Medium | [`20_Trees/02_N_Ary_Trees_And_Misc`](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md) |
| N-ary Tree Level Order Traversal ([LC 429](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) · [statement](../../20_Trees/02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/03_n_ary_level_order.md)), Max Depth of N-ary Tree ([LC 559](https://leetcode.com/problems/maximum-depth-of-n-ary-tree/) · [statement](../../20_Trees/02_N_Ary_Trees_And_Misc/03_Problems/01_Easy/02_max_depth_n_ary.md)) | tree BFS / DFS (DOM-like) | Medium / Easy | [`20_Trees/02_N_Ary_Trees_And_Misc`](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md) |
| Lowest Common Ancestor ([LC 236](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) · [statement](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/17_lowest_common_ancestor.md)) | DFS on tree (think: closest common parent element) | Medium | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| Find all nodes at distance K ([LC 863](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/) · [statement](../../20_Trees/02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/06_all_nodes_distance_k.md)) | tree -> graph + BFS | Medium | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| Serialize / Deserialize ([LC 297](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) · [statement](../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/20_serialize_deserialize.md)), build a tree from a flat list with `parentId` | tree building with hash map | Medium–Hard | [`20_Trees/02_N_Ary_Trees_And_Misc`](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md), [`05_Hashing`](../../05_Hashing/README.md) |
| Implement Trie / autocomplete ([LC 208](https://leetcode.com/problems/implement-trie-prefix-tree/) · [statement](../../22_Tries/03_Problems/02_Medium/01_implement_trie.md)), Design Search Autocomplete ([LC 642](https://leetcode.com/problems/design-search-autocomplete-system/)) | trie | Medium–Hard | [`22_Tries`](../../22_Tries/README.md) |
| Merge Intervals ([LC 56](https://leetcode.com/problems/merge-intervals/) · [statement](../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md)) | calendar UI logic | Medium | [`31_Intervals`](../../31_Intervals/README.md) |
| Kth Largest / Top K | heap | Medium | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| Course Schedule ([LC 207](https://leetcode.com/problems/course-schedule/) · [statement](../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md)) | topological sort (think: module dependency order, build graphs) | Medium | [`26_Topological_Sorting`](../../26_Topological_Sorting/README.md) |
| Number of Islands ([LC 200](https://leetcode.com/problems/number-of-islands/) · [statement](../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md)), Flood Fill ([LC 733](https://leetcode.com/problems/flood-fill/) · [statement](../../24_Graph_Traversal/03_Problems/01_Easy/01_flood_fill.md)) | grid BFS/DFS (think: paint-bucket tool) | Easy–Medium | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md), [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| Spiral Matrix ([LC 54](https://leetcode.com/problems/spiral-matrix/) · [statement](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/07_spiral_matrix.md)), Rotate Image ([LC 48](https://leetcode.com/problems/rotate-image/) · [statement](../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/06_rotate_image.md)) | matrix traversal | Medium | [`09_Matrix_And_Multidimensional_Arrays`](../../09_Matrix_And_Multidimensional_Arrays/README.md) |
| Implement `getElementsByClassName`-style search over a tree | DFS over an object tree | Easy–Medium | [`20_Trees/02_N_Ary_Trees_And_Misc`](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md) |
| Implement a virtual-DOM diff for two trees (simplified) | parallel DFS (Same Tree, 100) | Medium | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |

### Not DSA, but it will be asked (know where it belongs)

These are **JavaScript / frontend engineering** questions. They are not data-structure problems, so they
are not in this curriculum, but they show up in the same interview loop. Keep a separate note for them.

| Question | What it really tests | Belongs to |
|----------|----------------------|------------|
| Implement `debounce` / `throttle` | closures, `setTimeout`, `this` and arguments | JavaScript fundamentals (not DSA) |
| Implement `Promise.all` / `Promise.race` / `promisify` | async, promise semantics | JavaScript fundamentals |
| Implement `bind` / `call` / `curry` / `compose` / `pipe` | functions as values, `this` | JavaScript fundamentals |
| Implement `memoize` | closures + hash map (overlaps with [`05_Hashing`](../../05_Hashing/README.md) and DP memoization) | JS fundamentals; see `templates.js` `memoize` |
| Deep clone / deep equal | recursion over objects (overlaps with [`13_Backtracking`](../../13_Backtracking/README.md)) | JS fundamentals + recursion |
| Event emitter / pub-sub | hash map of arrays (overlaps with [`05_Hashing`](../../05_Hashing/README.md)) | JS fundamentals + design |
| Implement `Array.prototype.flat`, `reduce`, `map` | recursion / iteration basics | JS fundamentals |
| Virtual list / infinite scroll, `IntersectionObserver` | browser APIs, performance | Frontend system design |
| LRU for an image cache / request cache | same as LRU Cache ([LC 146](https://leetcode.com/problems/lru-cache/) · [statement](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/02_Medium/01_lru_cache.md)) | [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md) |

The [`00_Foundations/01_JavaScript_For_DSA`](../../00_Foundations/01_JavaScript_For_DSA/README.md) folder covers the JavaScript you need **for DSA**
(Map, Set, sorting, array methods, recursion depth, number limits). The utilities above are a separate study track.

### How to prepare

Weeks 1–8 of the plan, with extra time on [`04_Strings`](../../04_Strings/README.md), [`16_Stacks`](../../16_Stacks/README.md), `20_Trees/*`, [`22_Tries`](../../22_Tries/README.md),
[`24_Graph_Traversal`](../../24_Graph_Traversal/README.md). Then one hour per week on the "not DSA" list above with your own tests.

---

## 4. Problems that show up everywhere

If you only have time for 20 problems, these are commonly reported across all three styles:

| # | Problem | LC # | Folder |
|---|---------|------|--------|
| 1 | [Two Sum](../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) | [1](https://leetcode.com/problems/two-sum/) | [`05_Hashing`](../../05_Hashing/README.md) |
| 2 | [Valid Parentheses](../../16_Stacks/03_Problems/01_Easy/01_valid_parentheses.md) | [20](https://leetcode.com/problems/valid-parentheses/) | [`16_Stacks`](../../16_Stacks/README.md) |
| 3 | [Merge Intervals](../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md) | [56](https://leetcode.com/problems/merge-intervals/) | [`31_Intervals`](../../31_Intervals/README.md) |
| 4 | [Longest Substring Without Repeating Characters](../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md) | [3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | [`07_Sliding_Window`](../../07_Sliding_Window/README.md) |
| 5 | [Group Anagrams](../../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md) | [49](https://leetcode.com/problems/group-anagrams/) | [`05_Hashing`](../../05_Hashing/README.md) |
| 6 | [Reverse Linked List](../../15_Linked_Lists/03_Problems/01_Easy/01_reverse_linked_list.md) | [206](https://leetcode.com/problems/reverse-linked-list/) | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| 7 | [Merge Two Sorted Lists](../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) | [21](https://leetcode.com/problems/merge-two-sorted-lists/) | [`15_Linked_Lists`](../../15_Linked_Lists/README.md) |
| 8 | [LRU Cache](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/02_Medium/01_lru_cache.md) | [146](https://leetcode.com/problems/lru-cache/) | [`35_Advanced_Data_Structures`](../../35_Advanced_Data_Structures/README.md) |
| 9 | [Binary Tree Level Order Traversal](../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/10_level_order_traversal.md) | [102](https://leetcode.com/problems/binary-tree-level-order-traversal/) | [`20_Trees/01_Binary_Trees`](../../20_Trees/01_Binary_Trees/README.md) |
| 10 | [Validate Binary Search Tree](../../21_Binary_Search_Trees/03_Problems/02_Medium/07_validate_bst.md) | [98](https://leetcode.com/problems/validate-binary-search-tree/) | [`21_Binary_Search_Trees`](../../21_Binary_Search_Trees/README.md) |
| 11 | [Number of Islands](../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md) | [200](https://leetcode.com/problems/number-of-islands/) | [`24_Graph_Traversal`](../../24_Graph_Traversal/README.md) |
| 12 | [Course Schedule](../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) | [207](https://leetcode.com/problems/course-schedule/) | [`26_Topological_Sorting`](../../26_Topological_Sorting/README.md) |
| 13 | [Top K Frequent Elements](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/05_top_k_frequent_elements.md) | [347](https://leetcode.com/problems/top-k-frequent-elements/) | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| 14 | [Kth Largest Element in an Array](../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/01_kth_largest_element.md) | [215](https://leetcode.com/problems/kth-largest-element-in-an-array/) | [`19_Heaps_And_Priority_Queues`](../../19_Heaps_And_Priority_Queues/README.md) |
| 15 | [Coin Change](../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/04_coin_change_min_coins.md) | [322](https://leetcode.com/problems/coin-change/) | [`29_Dynamic_Programming/02_Knapsack`](../../29_Dynamic_Programming/02_Knapsack/README.md) |
| 16 | [Climbing Stairs](../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/01_Easy/02_climbing_stairs.md) | [70](https://leetcode.com/problems/climbing-stairs/) | [`29_Dynamic_Programming/01_One_Dimensional_DP`](../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md) |
| 17 | [Product of Array Except Self](../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/04_product_of_array_except_self.md) | [238](https://leetcode.com/problems/product-of-array-except-self/) | [`08_Prefix_Sums_And_Difference_Arrays`](../../08_Prefix_Sums_And_Difference_Arrays/README.md) |
| 18 | [3Sum](../../06_Two_Pointers/03_Problems/02_Medium/13_three_sum.md) | [15](https://leetcode.com/problems/3sum/) | [`06_Two_Pointers`](../../06_Two_Pointers/README.md) |
| 19 | [Search in Rotated Sorted Array](../../10_Searching/03_Problems/02_Medium/07_search_rotated_sorted_array.md) | [33](https://leetcode.com/problems/search-in-rotated-sorted-array/) | [`10_Searching`](../../10_Searching/README.md) |
| 20 | [Subsets](../../13_Backtracking/03_Problems/02_Medium/01_subsets.md) | [78](https://leetcode.com/problems/subsets/) | [`13_Backtracking`](../../13_Backtracking/README.md) |

---

## 5. Interview format notes (commonly reported)

| Format | What to expect | Practice with |
|--------|----------------|---------------|
| Phone screen (45 min) | 1 medium problem, maybe an easy warm-up | [MOCK_SET_01](../../44_Mock_Interviews/MOCK_SET_01.md), [MOCK_SET_02](../../44_Mock_Interviews/MOCK_SET_02.md) |
| Onsite coding (45–60 min) | 1–2 mediums or 1 hard, follow-ups | [MOCK_SET_03](../../44_Mock_Interviews/MOCK_SET_03.md) to [MOCK_SET_10](../../44_Mock_Interviews/MOCK_SET_10.md) |
| Take-home | a small working program with tests | the "design-ish" list above |
| Pair programming | a problem built up in stages, lots of talking | any set; explain every line out loud |

Whatever the format: restate the problem, ask two clarifying questions, brute force first, name the pattern, code, dry-run, state complexity. Every time.
