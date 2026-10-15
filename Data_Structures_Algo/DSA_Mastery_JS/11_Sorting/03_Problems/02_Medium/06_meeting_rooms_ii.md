# Meeting Rooms II

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | sort starts & ends (teaser for intervals) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #253 — https://leetcode.com/problems/meeting-rooms-ii/ |
| **Solution file** | [06_meeting_rooms_ii.js](../solutions/06_meeting_rooms_ii.js) — open only after a real attempt |

## Problem

Given meeting time intervals [start, end), return the minimum number of
conference rooms required so that no two overlapping meetings share a room.
(Teaser for 31_Intervals; the sort-based trick here is worth knowing on its own.)

## Examples

```
Input: [[0,30],[5,10],[15,20]]   Output: 2   ([0,30] overlaps both others; they do not overlap each other)
Input: [[7,10],[2,4]]            Output: 1
```

## Constraints & clarifying questions

```
- If one meeting ends at 10 and another starts at 10, can they share a room? (yes, half-open)
- Empty list -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort starts & ends (teaser for intervals)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. For every meeting, count how many other meetings overlap it; the answer is the max over all meetings of (overlaps with meetings that started at or before it) + 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort starts and ends separately, two pointers)   O(n log n) time, O(n) space. The number of rooms needed at any moment = meetings started - meetings ended.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- all meetings identical -> n rooms
- back-to-back [[1,5],[5,10]] -> 1 room
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
For every meeting, count how many other meetings overlap it; the answer is the max
over all meetings of (overlaps with meetings that started at or before it) + 1.
Simpler: for every start time, count meetings that are "in progress" at that moment.
```

### APPROACH 2 — Optimal (sort starts and ends separately, two pointers)   O(n log n) time, O(n) space

```
The number of rooms needed at any moment = meetings started - meetings ended.
Sort all starts, sort all ends. Walk through the starts in order; before taking a
new start, if the earliest unprocessed end is <= this start, that room is free
(advance the end pointer, do not add a room). Otherwise add a room. The max rooms
in use is the answer. We do not care WHICH meeting ended, only that one did.
(A min-heap of end times is the other classic solution, see `19_Heaps_And_Priority_Queues`.)

Dry run [[0,30],[5,10],[15,20]]:
  starts = [0,5,15]  ends = [10,20,30]  endPtr=0 rooms=0 best=0
  start 0:  ends[0]=10 > 0  -> rooms=1
  start 5:  ends[0]=10 > 5  -> rooms=2
  start 15: ends[0]=10 <= 15 -> free a room (endPtr=1), then take it: rooms stays 2
  answer 2
```

### Edge cases

```
- [] -> 0
- all meetings identical -> n rooms
- back-to-back [[1,5],[5,10]] -> 1 room
```

Full JavaScript solution with tests: [06_meeting_rooms_ii.js](../solutions/06_meeting_rooms_ii.js). Run it with `node 06_meeting_rooms_ii.js` from the solutions folder.

</details>

## Common mistakes

- Freeing a room only when `end < start`; a meeting ending at 10 frees the room for one starting at 10.
- Sorting intervals but not separating starts and ends in the two-array approach.
- Counting the number of overlapping pairs instead of the maximum simultaneous meetings.

## Related follow-ups

- [Meeting Rooms](../../../31_Intervals/03_Problems/01_Easy/01_meeting_rooms.md) — just check for any overlap
- [Meeting Rooms II (Heaps)](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/11_meeting_rooms_ii.md) — the min-heap of end times
- [Car Pooling](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/13_car_pooling.md) — the same overlap with a difference array

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
