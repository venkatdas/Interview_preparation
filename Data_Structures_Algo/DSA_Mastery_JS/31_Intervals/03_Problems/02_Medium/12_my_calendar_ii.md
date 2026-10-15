# My Calendar II

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | double-booking list |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #731 — https://leetcode.com/problems/my-calendar-ii/ |
| **Solution file** | [12_my_calendar_ii.js](../solutions/12_my_calendar_ii.js) — open only after a real attempt |

## Problem

Like My Calendar I, but DOUBLE bookings are allowed and TRIPLE bookings are not.
book(start, end) returns true and records the event if adding it never makes three events
overlap at the same time; otherwise false (and nothing is recorded).

## Examples

```
book(10,20) -> true
book(50,60) -> true
book(10,40) -> true    (double booking on [10,20))
book(5,15)  -> false   (would be a triple on [10,15))
book(5,10)  -> true
book(25,55) -> true    (double on [25,40) and [50,55))
```

## Constraints & clarifying questions

```
- Half-open intervals? (yes)
- Up to 1000 calls -> O(n) per call fine
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *double-booking list* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) per book. Store all bookings.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (keep a list of double-booked ranges)   O(n) per book, O(n) space. Keep two lists: `singles` (every booking) and `doubles` (every range already covered by two bookings).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- three identical bookings -> third is false
- touching bookings never count as overlapping
- a booking that overlaps two DIFFERENT singles that do not overlap each other -> fine
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) per book

```
Store all bookings. For a new one, for every pair of existing bookings check if all
three share a point: max of the three starts < min of the three ends.
```

### APPROACH 2 — Optimal (keep a list of double-booked ranges)   O(n) per book, O(n) space

```
Keep two lists: `singles` (every booking) and `doubles` (every range already covered by
two bookings). A new booking is a triple iff it overlaps something in `doubles`. If it is
allowed, every overlap between it and a single becomes a new double range.
(The general "k bookings" version uses a sweep line over a sorted map of +1/-1 events -
My Calendar III.)

Dry run: book(10,20), book(10,40), book(5,15):
  [10,20]: doubles empty -> ok; singles [[10,20]]
  [10,40]: no doubles; overlap with [10,20] -> doubles [[10,20]]; singles + [10,40]
  [5,15] : overlaps double [10,20] (5 < 20 && 10 < 15) -> false
```

### Edge cases

```
- three identical bookings -> third is false
- touching bookings never count as overlapping
- a booking that overlaps two DIFFERENT singles that do not overlap each other -> fine
```

Full JavaScript solution with tests: [12_my_calendar_ii.js](../solutions/12_my_calendar_ii.js). Run it with `node 12_my_calendar_ii.js` from the solutions folder.

</details>

## Common mistakes

- Storing overlaps as a count but not as intervals, so a triple booking cannot be detected later.
- Recording overlaps before checking for a triple booking, leaving the state dirty after a rejection.
- Using inclusive overlap on half-open bookings.

## Related follow-ups

- [My Calendar I](../02_Medium/11_my_calendar_i.md)
- [Car Pooling](../02_Medium/10_car_pooling.md)
- My Calendar III (LeetCode #732)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
