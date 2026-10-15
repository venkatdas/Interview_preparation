# Intervals and Sweep Line

Interval problems give you ranges like meetings, bookings or trips and ask you to merge them, find conflicts, count how many overlap at once, or find the gaps. Almost all of them become a sort followed by one careful scan; the craft is in the overlap condition, the touching-endpoints rule and the tie-breaks.

**Prerequisites:** [Sorting](../11_Sorting/README.md), [Heaps And Priority Queues](../19_Heaps_And_Priority_Queues/README.md)

**Assess yourself:** [Quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) · tests: [tests/intervals.test.js](tests/intervals.test.js)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 31_Intervals` (from the curriculum root).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `interval_utils.js` |
| [03_Problems](03_Problems) | 15 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Meeting Rooms | Easy | sort + adjacent check | [statement](03_Problems/01_Easy/01_meeting_rooms.md) | [solution](03_Problems/solutions/01_meeting_rooms.js) |
| 02 | Teemo Attacking | Easy | adjacent overlap clip | [statement](03_Problems/01_Easy/02_teemo_attacking.md) | [solution](03_Problems/solutions/02_teemo_attacking.js) |
| 03 | Merge Intervals | Medium | sort by start + merge | [statement](03_Problems/02_Medium/03_merge_intervals.md) | [solution](03_Problems/solutions/03_merge_intervals.js) |
| 04 | Insert Interval | Medium | three-phase insert | [statement](03_Problems/02_Medium/04_insert_interval.md) | [solution](03_Problems/solutions/04_insert_interval.js) |
| 05 | Interval List Intersections | Medium | two pointers | [statement](03_Problems/02_Medium/05_interval_list_intersections.md) | [solution](03_Problems/solutions/05_interval_list_intersections.js) |
| 06 | Non-overlapping Intervals | Medium | greedy by end | [statement](03_Problems/02_Medium/06_non_overlapping_intervals.md) | [solution](03_Problems/solutions/06_non_overlapping_intervals.js) |
| 07 | Minimum Number of Arrows to Burst Balloons | Medium | greedy by end | [statement](03_Problems/02_Medium/07_minimum_number_of_arrows.md) | [solution](03_Problems/solutions/07_minimum_number_of_arrows.js) |
| 08 | Remove Covered Intervals | Medium | sort start asc, end desc | [statement](03_Problems/02_Medium/08_remove_covered_intervals.md) | [solution](03_Problems/solutions/08_remove_covered_intervals.js) |
| 09 | Meeting Rooms II | Medium | sweep line / heap of ends | [statement](03_Problems/02_Medium/09_meeting_rooms_ii.md) | [solution](03_Problems/solutions/09_meeting_rooms_ii.js) |
| 10 | Car Pooling | Medium | sweep line with weights | [statement](03_Problems/02_Medium/10_car_pooling.md) | [solution](03_Problems/solutions/10_car_pooling.js) |
| 11 | My Calendar I | Medium | sorted list + overlap check | [statement](03_Problems/02_Medium/11_my_calendar_i.md) | [solution](03_Problems/solutions/11_my_calendar_i.js) |
| 12 | My Calendar II | Medium | double-booking list | [statement](03_Problems/02_Medium/12_my_calendar_ii.md) | [solution](03_Problems/solutions/12_my_calendar_ii.js) |
| 13 | Data Stream as Disjoint Intervals | Hard | sorted insert + merge neighbours | [statement](03_Problems/03_Hard/13_data_stream_as_disjoint_intervals.md) | [solution](03_Problems/solutions/13_data_stream_as_disjoint_intervals.js) |
| 14 | Employee Free Time | Hard | merge all, read the gaps | [statement](03_Problems/03_Hard/14_employee_free_time.md) | [solution](03_Problems/solutions/14_employee_free_time.js) |
| 15 | Minimum Interval to Include Each Query | Hard | offline queries + heap | [statement](03_Problems/03_Hard/15_minimum_interval_to_include_each_query.md) | [solution](03_Problems/solutions/15_minimum_interval_to_include_each_query.js) |

