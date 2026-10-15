# Sorting

**Prerequisites:** [Arrays](../03_Arrays/README.md), [Recursion](../12_Recursion/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 11_Sorting` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `quickselect.js`, `sorting_algorithms.js` |
| [03_Problems](03_Problems) | 14 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Sort an Array | Medium | merge sort / quick sort | [statement](03_Problems/02_Medium/01_sort_an_array.md) | [solution](03_Problems/solutions/01_sort_an_array.js) |
| 02 | Sort Colors | Medium | Dutch national flag | [statement](03_Problems/02_Medium/02_sort_colors.md) | [solution](03_Problems/solutions/02_sort_colors.js) |
| 03 | Merge Intervals | Medium | sort by start + sweep | [statement](03_Problems/02_Medium/03_merge_intervals.md) | [solution](03_Problems/solutions/03_merge_intervals.js) |
| 04 | Kth Largest Element in an Array | Medium | quickselect | [statement](03_Problems/02_Medium/04_kth_largest_element.md) | [solution](03_Problems/solutions/04_kth_largest_element.js) |
| 05 | Largest Number | Medium | custom comparator | [statement](03_Problems/02_Medium/05_largest_number.md) | [solution](03_Problems/solutions/05_largest_number.js) |
| 06 | Meeting Rooms II | Medium | sort starts & ends (teaser for intervals) | [statement](03_Problems/02_Medium/06_meeting_rooms_ii.md) | [solution](03_Problems/solutions/06_meeting_rooms_ii.js) |
| 07 | Sort Characters By Frequency | Medium | counting + bucket | [statement](03_Problems/02_Medium/07_sort_characters_by_frequency.md) | [solution](03_Problems/solutions/07_sort_characters_by_frequency.js) |
| 08 | Relative Sort Array | Easy | counting sort | [statement](03_Problems/01_Easy/08_relative_sort_array.md) | [solution](03_Problems/solutions/08_relative_sort_array.js) |
| 09 | Maximum Gap | Medium | bucket / radix idea | [statement](03_Problems/02_Medium/09_maximum_gap.md) | [solution](03_Problems/solutions/09_maximum_gap.js) |
| 10 | H-Index | Medium | counting sort | [statement](03_Problems/02_Medium/10_h_index.md) | [solution](03_Problems/solutions/10_h_index.js) |
| 11 | Wiggle Sort II | Medium | sort + interleave (virtual indexing) | [statement](03_Problems/02_Medium/11_wiggle_sort_ii.md) | [solution](03_Problems/solutions/11_wiggle_sort_ii.js) |
| 12 | Sort List | Medium | merge sort on a linked list | [statement](03_Problems/02_Medium/12_sort_list.md) | [solution](03_Problems/solutions/12_sort_list.js) |
| 13 | Count of Smaller Numbers After Self | Hard | merge sort with counting | [statement](03_Problems/03_Hard/13_count_smaller_after_self.md) | [solution](03_Problems/solutions/13_count_smaller_after_self.js) |
| 14 | Reverse Pairs | Hard | merge sort with counting | [statement](03_Problems/03_Hard/14_reverse_pairs.md) | [solution](03_Problems/solutions/14_reverse_pairs.js) |

