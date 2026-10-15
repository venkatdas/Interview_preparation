# My Calendar III

| | |
|---|---|
| **Topic** | Segment Tree |
| **Difficulty** | Hard |
| **Pattern** | sweep line vs dynamic tree with lazy range-add |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #732 — https://leetcode.com/problems/my-calendar-iii/ |
| **Solution file** | [04_my_calendar_iii.js](../solutions/04_my_calendar_iii.js) — open only after a real attempt |

## Problem

Implement MyCalendarThree with book(start, end) (half-open interval [start, end)).
After each booking return k, the maximum number of events that overlap at any
single point in time, considering ALL bookings so far.

## Examples

```
book(10, 20) -> 1
book(50, 60) -> 1
book(10, 40) -> 2     ([10,20) and [10,40) overlap)
book(5, 15)  -> 3     (at time 10..15 three events overlap)
book(5, 10)  -> 3
book(25, 55) -> 3
```

## Constraints & clarifying questions

```
- Number of calls? (up to 400 -> even O(n^2) total works; interviewers want the idea)
- Times up to 10^9 -> cannot allocate an array per unit of time.
- Touching intervals ([10,20) and [20,30)) do not overlap.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sweep line vs dynamic tree with lazy range-add* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force / Sweep line with a sorted map   O(n^2) time per call (n calls). Keep a map time -> delta where start gets +1 and end gets -1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dynamic segment tree, range add + global max)   O(log C) per call. Think of a segment tree over the whole time axis [0, 1e9).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- identical bookings repeated (k grows by 1 each time)
- touching intervals (should not count as overlap -> use end - 1)
- a booking that spans everything
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / Sweep line with a sorted map   O(n^2) time per call (n calls)

```
Keep a map time -> delta where start gets +1 and end gets -1. After each booking,
walk the keys in sorted order and keep a running sum; the max running sum is k.
Sorting the keys each call costs O(n log n), the walk O(n). Simple and it passes.
```

### APPROACH 2 — Optimal (Dynamic segment tree, range add + global max)   O(log C) per call

```
Think of a segment tree over the whole time axis [0, 1e9). We cannot allocate it, so
we create nodes only when a booking touches them (a "dynamic" / "sparse" tree).
Each node stores: max = largest overlap count anywhere in its range,
                  lazy = +value that applies to the whole range (not yet pushed down).
book(start, end) = rangeAdd(start, end - 1, +1); answer = root.max.
A node that is fully covered just increments its max and its lazy and stops, so a
booking touches O(log C) nodes, C = 1e9 -> about 30 levels.

Dry run (small axis 0..7 for readability):
  book(1, 4) -> add +1 on [1,3]
    root[0,7] partial -> left[0,3] partial -> [0,1] partial -> [1,1] covered: max 1, lazy 1
                                              [2,3] covered: max 1, lazy 1
    root.max = 1 -> return 1
  book(2, 6) -> add +1 on [2,5]
    [2,3] covered again: max 2, lazy 2
    [4,5] covered: max 1
    root.max = 2 -> return 2
```

### Edge cases

```
- identical bookings repeated (k grows by 1 each time)
- touching intervals (should not count as overlap -> use end - 1)
- a booking that spans everything
```

Full JavaScript solution with tests: [04_my_calendar_iii.js](../solutions/04_my_calendar_iii.js). Run it with `node 04_my_calendar_iii.js` from the solutions folder.

</details>

## Common mistakes

- Treating bookings as closed intervals; `[start, end)` means an event ending at 10 and one starting at 10 do not overlap.
- Allocating an array over the full 0..10^9 range; use a dynamic (node-on-demand) segment tree or a sweep-line map.
- Returning the maximum for the current booking only instead of the global maximum so far.

## Related follow-ups

- [My Calendar I](../../../../35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/03_Problems/02_Medium/01_my_calendar_i.md)
- My Calendar II (LeetCode #731)
- [Meeting rooms / intervals](../../../../31_Intervals/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
