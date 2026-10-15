# Linked Lists

**Prerequisites:** [Foundations/01 JavaScript For DSA](../00_Foundations/01_JavaScript_For_DSA/README.md), [Recursion](../12_Recursion/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 15_Linked_Lists` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `doubly_linked_list.js`, `list_node.js`, `singly_linked_list.js` |
| [03_Problems](03_Problems) | 20 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Reverse Linked List | Easy | 3-pointer reversal (iter + recursive) | [statement](03_Problems/01_Easy/01_reverse_linked_list.md) | [solution](03_Problems/solutions/01_reverse_linked_list.js) |
| 02 | Merge Two Sorted Lists | Easy | dummy + tail merge | [statement](03_Problems/01_Easy/02_merge_two_sorted_lists.md) | [solution](03_Problems/solutions/02_merge_two_sorted_lists.js) |
| 03 | Linked List Cycle | Easy | Floyd fast/slow | [statement](03_Problems/01_Easy/03_linked_list_cycle.md) | [solution](03_Problems/solutions/03_linked_list_cycle.js) |
| 04 | Linked List Cycle II | Medium | Floyd phase 2 | [statement](03_Problems/02_Medium/04_linked_list_cycle_ii.md) | [solution](03_Problems/solutions/04_linked_list_cycle_ii.js) |
| 05 | Middle of the Linked List | Easy | fast/slow | [statement](03_Problems/01_Easy/05_middle_of_linked_list.md) | [solution](03_Problems/solutions/05_middle_of_linked_list.js) |
| 06 | Remove Nth Node From End of List | Medium | two pointers with gap | [statement](03_Problems/02_Medium/06_remove_nth_from_end.md) | [solution](03_Problems/solutions/06_remove_nth_from_end.js) |
| 07 | Palindrome Linked List | Easy | middle + reverse + compare | [statement](03_Problems/01_Easy/07_palindrome_linked_list.md) | [solution](03_Problems/solutions/07_palindrome_linked_list.js) |
| 08 | Remove Linked List Elements | Easy | dummy + prev | [statement](03_Problems/01_Easy/08_remove_linked_list_elements.md) | [solution](03_Problems/solutions/08_remove_linked_list_elements.js) |
| 09 | Remove Duplicates from Sorted List | Easy | compare with next | [statement](03_Problems/01_Easy/09_remove_duplicates_sorted_list.md) | [solution](03_Problems/solutions/09_remove_duplicates_sorted_list.js) |
| 10 | Intersection of Two Linked Lists | Easy | two pointers switching lists | [statement](03_Problems/01_Easy/10_intersection_of_two_linked_lists.md) | [solution](03_Problems/solutions/10_intersection_of_two_linked_lists.js) |
| 11 | Add Two Numbers | Medium | carry + dummy | [statement](03_Problems/02_Medium/11_add_two_numbers.md) | [solution](03_Problems/solutions/11_add_two_numbers.js) |
| 12 | Odd Even Linked List | Medium | two chains | [statement](03_Problems/02_Medium/12_odd_even_linked_list.md) | [solution](03_Problems/solutions/12_odd_even_linked_list.js) |
| 13 | Swap Nodes in Pairs | Medium | dummy + rewire | [statement](03_Problems/02_Medium/13_swap_nodes_in_pairs.md) | [solution](03_Problems/solutions/13_swap_nodes_in_pairs.js) |
| 14 | Reorder List | Medium | middle + reverse + merge | [statement](03_Problems/02_Medium/14_reorder_list.md) | [solution](03_Problems/solutions/14_reorder_list.js) |
| 15 | Rotate List | Medium | ring and cut | [statement](03_Problems/02_Medium/15_rotate_list.md) | [solution](03_Problems/solutions/15_rotate_list.js) |
| 16 | Copy List with Random Pointer | Medium | Map / interleave | [statement](03_Problems/02_Medium/16_copy_list_with_random_pointer.md) | [solution](03_Problems/solutions/16_copy_list_with_random_pointer.js) |
| 17 | Reverse Nodes in k-Group | Hard | group reversal + reconnect | [statement](03_Problems/03_Hard/17_reverse_nodes_in_k_group.md) | [solution](03_Problems/solutions/17_reverse_nodes_in_k_group.js) |
| 18 | Merge k Sorted Lists | Hard | divide & conquer / min-heap | [statement](03_Problems/03_Hard/18_merge_k_sorted_lists.md) | [solution](03_Problems/solutions/18_merge_k_sorted_lists.js) |
| 19 | Sort List | Medium | merge sort on a list | [statement](03_Problems/02_Medium/19_sort_list.md) | [solution](03_Problems/solutions/19_sort_list.js) |
| 20 | LRU Cache | Medium | doubly linked list + Map | [statement](03_Problems/02_Medium/20_lru_cache.md) | [solution](03_Problems/solutions/20_lru_cache.js) |

