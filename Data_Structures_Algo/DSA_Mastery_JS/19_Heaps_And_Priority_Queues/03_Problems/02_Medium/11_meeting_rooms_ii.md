# Meeting Rooms II

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | heap of end times |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #253 — https://leetcode.com/problems/meeting-rooms-ii/ |
| **Solution file** | [11_meeting_rooms_ii.js](../solutions/11_meeting_rooms_ii.js) — open only after a real attempt |

## Problem

Given meeting intervals [start, end), return the minimum number of
conference rooms needed so that no two overlapping meetings share a room.

## Examples

```
Input: [[0,30],[5,10],[15,20]]   Output: 2   Explanation: [0,30] overlaps both others
Input: [[7,10],[2,4]]            Output: 1
```

## Constraints & clarifying questions

```
- If one meeting ends at 10 and another starts at 10, can they share? (yes, [start, end) )
- Empty input -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *heap of end times* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. For every meeting, count how many meetings are "in progress" at its start time (start_j &lt;= start_i &lt; end_j).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by start + min-heap of end times)   O(n log n) time, O(n) space. Sort by start.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- all meetings at the same time -> n rooms
- back-to-back meetings [1,5],[5,9] -> 1 room
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
For every meeting, count how many meetings are "in progress" at its start
time (start_j <= start_i < end_j). The max over all meetings is the answer,
because the room count peaks at some meeting's start.
```

### APPROACH 2 — Optimal (sort by start + min-heap of end times)   O(n log n) time, O(n) space

```
Sort by start. Walk the meetings in order and keep a MIN-heap of the end
times of meetings currently occupying a room. The top is the room that
frees up FIRST.
  - if heap.top <= meeting.start: that room is free -> pop it (reuse)
  - push this meeting's end (it now occupies a room)
The heap size after processing is the number of rooms in use; the maximum
size ever reached is the answer (it's also just the final size since we
never shrink by more than we grow... but tracking the max is clearer).

Dry run on [[0,30],[5,10],[15,20]] (already sorted by start):
  [0,30]:  heap empty -> push 30          heap={30}     rooms=1
  [5,10]:  top 30 > 5, no free room -> push 10   heap={10,30}  rooms=2
  [15,20]: top 10 <= 15 -> pop 10 (reuse) -> push 20  heap={20,30} rooms=2
  answer 2

(See 31_Intervals for the "sweep line / two sorted arrays" version.)
```

### Edge cases

```
- [] -> 0
- all meetings at the same time -> n rooms
- back-to-back meetings [1,5],[5,9] -> 1 room
```

Full JavaScript solution with tests: [11_meeting_rooms_ii.js](../solutions/11_meeting_rooms_ii.js). Run it with `node 11_meeting_rooms_ii.js` from the solutions folder.

</details>

## Common mistakes

- Not sorting meetings by start time first.
- Treating a meeting that starts exactly when another ends as overlapping.
- Heap ordered by start time instead of end time.

## Related follow-ups

- [Meeting Rooms](../../../31_Intervals/03_Problems/01_Easy/01_meeting_rooms.md) (31_Intervals)
- [Merge Intervals](../../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md) (31_Intervals)
- Car Pooling (LeetCode #1094)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
