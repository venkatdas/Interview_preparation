# Meeting Rooms II

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | sweep line / heap of ends |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #253 — https://leetcode.com/problems/meeting-rooms-ii/ |
| **Solution file** | [09_meeting_rooms_ii.js](../solutions/09_meeting_rooms_ii.js) — open only after a real attempt |

## Problem

Given meeting intervals [start, end), return the minimum number of conference rooms
needed so that no two meetings in the same room overlap. A meeting may start exactly when
another ends in the same room.

## Examples

```
Input: [[0,30],[5,10],[15,20]]   Output: 2
Input: [[7,10],[2,4]]            Output: 1
Input: [[1,5],[5,8]]             Output: 1   Explanation: touching shares a room
```

## Constraints & clarifying questions

```
- Touching allowed in the same room? (yes)
- Need room assignments or just the count? (count)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sweep line / heap of ends* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * T) time, where T = coordinate range. For every unit of time count how many meetings cover it; take the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal A (sweep line / two sorted arrays)   O(n log n) time, O(n) space. The answer is the max number of meetings alive at once.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> 0
- all meetings at the same time -> n
- touching -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * T) time, where T = coordinate range

```
For every unit of time count how many meetings cover it; take the max. Only works for
small integer coordinates; shown with a Map keyed by time.
```

### APPROACH 2 — Optimal A (sweep line / two sorted arrays)   O(n log n) time, O(n) space

```
The answer is the max number of meetings alive at once. Sort starts and ends separately.
Walk the starts; for each start, if the smallest unprocessed end <= start, a room was
freed (advance the end pointer, do not count a new room). Otherwise open a new room.
```

### APPROACH 2 — Optimal B (min-heap of end times)   O(n log n) time, O(n) space

```
Sort by start. Heap holds the end times of meetings occupying rooms. For each meeting pop
every end <= its start (those rooms are free again), push its end. Max heap size = rooms.
Both are implemented below; `optimal` uses the two-array sweep, `optimalHeap` the heap.

Dry run (sweep) on [[0,30],[5,10],[15,20]]:
  starts [0,5,15], ends [10,20,30]
  start 0 : ends[0]=10 > 0  -> rooms 1
  start 5 : ends[0]=10 > 5  -> rooms 2
  start 15: ends[0]=10 <=15 -> reuse, endPtr=1; rooms stays 2   -> 2
```

### Edge cases

```
- empty -> 0
- all meetings at the same time -> n
- touching -> 1
```

Full JavaScript solution with tests: [09_meeting_rooms_ii.js](../solutions/09_meeting_rooms_ii.js). Run it with `node 09_meeting_rooms_ii.js` from the solutions folder.

</details>

## Common mistakes

- Wrong tie-break in the sweep: an end and a start at the same time must free the room first.
- Using a max-heap or not popping all finished meetings before pushing.
- Returning the final heap size instead of the maximum size seen.

## Related follow-ups

- [Meeting Rooms](../01_Easy/01_meeting_rooms.md)
- [Car Pooling](../02_Medium/10_car_pooling.md)
- [My Calendar II](../02_Medium/12_my_calendar_ii.md)
- [Task Scheduler](../../../28_Greedy_Algorithms/03_Problems/02_Medium/15_task_scheduler.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
