# Skip List, Bloom Filter and Sorted List

**Prerequisites:** [Linked Lists](../../15_Linked_Lists/README.md), [Hashing](../../05_Hashing/README.md), [Searching](../../10_Searching/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/tests/skip_list_bloom_filter_sorted_list.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `bloom_filter.js`, `skip_list.js`, `sorted_list.js` |
| [03_Problems](03_Problems) | 5 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `skip_list_bloom_filter_sorted_list.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | My Calendar I | Medium | sorted intervals + neighbour check | [statement](03_Problems/02_Medium/01_my_calendar_i.md) | [solution](03_Problems/solutions/01_my_calendar_i.js) |
| 02 | Contains Duplicate III | Hard | sorted sliding window + ceiling | [statement](03_Problems/03_Hard/02_contains_duplicate_iii.md) | [solution](03_Problems/solutions/02_contains_duplicate_iii.js) |
| 03 | Exam Room | Medium | sorted occupied seats, scan gaps | [statement](03_Problems/02_Medium/03_exam_room.md) | [solution](03_Problems/solutions/03_exam_room.js) |
| 04 | Design Skiplist | Hard | skip list from scratch | [statement](03_Problems/03_Hard/04_design_skiplist.md) | [solution](03_Problems/solutions/04_design_skiplist.js) |
| 05 | Count of Range Sum, sorted-list version | Hard | prefix sums + countBetween | [statement](03_Problems/03_Hard/05_count_of_range_sum_sorted_list.md) | [solution](03_Problems/solutions/05_count_of_range_sum_sorted_list.js) |

