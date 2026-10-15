# My Calendar I

| | |
|---|---|
| **Topic** | Skip List, Bloom Filter and Sorted List |
| **Difficulty** | Medium |
| **Pattern** | sorted intervals + neighbour check |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #729 — https://leetcode.com/problems/my-calendar-i/ |
| **Solution file** | [01_my_calendar_i.js](../solutions/01_my_calendar_i.js) — open only after a real attempt |

## Problem

Implement MyCalendar with book(start, end) for the half-open interval [start, end).
Return true and add the booking if it does not overlap any existing booking,
otherwise return false and do not add it.

## Examples

```
book(10, 20) -> true
book(15, 25) -> false   (overlaps [10,20))
book(20, 30) -> true    (touching at 20 is fine)
```

## Constraints & clarifying questions

```
- Up to 1000 calls -> O(n) per call passes; O(log n) is the "ordered map" answer
- Half-open intervals: [10,20) and [20,30) do not overlap
- start < end always
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sorted intervals + neighbour check* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per call. Keep a list of bookings; a new [s, e) overlaps [a, b) when s &lt; b and a &lt; e.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Sorted list of intervals by start + bisect)   O(log n) search + O(n) splice. Keep bookings sorted by start.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- first booking
- identical booking twice -> second is false
- touching intervals on both sides
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per call

```
Keep a list of bookings; a new [s, e) overlaps [a, b) when s < b and a < e. Scan all.
```

### APPROACH 2 — Optimal (Sorted list of intervals by start + bisect)   O(log n) search + O(n) splice

```
Keep bookings sorted by start. For a new [s, e), only two neighbours can overlap:
  - the booking just BEFORE s (largest start < s): must end <= s
  - the booking just AFTER (smallest start >= s): must start >= e
Find them with binary search (bisect by start), check both, insert if clear.
In Java/C++ this is TreeMap.floorKey / ceilingKey; in JS we use SortedList from
../sorted-list.js (sorted array + binary search).

Dry run: bookings = [] ; book(10,20): no neighbours -> insert [[10,20]] -> true
  book(15,25): before = [10,20] (start 10 < 15), ends 20 > 15 -> false
  book(20,30): before = [10,20], ends 20 <= 20 ok; after = none -> insert -> true
  book(5,10): before = none; after = [10,20], starts 10 >= 10 ok -> true
```

### Edge cases

```
- first booking
- identical booking twice -> second is false
- touching intervals on both sides
```

Full JavaScript solution with tests: [01_my_calendar_i.js](../solutions/01_my_calendar_i.js). Run it with `node 01_my_calendar_i.js` from the solutions folder.

</details>

## Common mistakes

- Treating intervals as closed: `[10, 20)` and `[20, 30)` do not overlap.
- Checking only the next booking; you must check both the floor (previous) and ceiling (next) neighbours.
- Inserting into an unsorted array and scanning everything, O(n) per booking, without saying so.

## Related follow-ups

- [My Calendar III](../../../../34_Range_Query_Data_Structures/01_Segment_Tree/03_Problems/03_Hard/04_my_calendar_iii.md)
- My Calendar II (LeetCode #731)
- [Intervals](../../../../31_Intervals/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
