# My Calendar I

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | sorted list + overlap check |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #729 — https://leetcode.com/problems/my-calendar-i/ |
| **Solution file** | [11_my_calendar_i.js](../solutions/11_my_calendar_i.js) — open only after a real attempt |

## Problem

Implement MyCalendar with book(start, end) for the half-open interval [start, end).
Return true and add the booking if it does not overlap any existing booking (a "double
booking"); otherwise return false and do not add it.

## Examples

```
book(10,20) -> true
book(15,25) -> false   Explanation: 15 is inside [10,20)
book(20,30) -> true    Explanation: touching at 20 is fine
```

## Constraints & clarifying questions

```
- Half-open intervals (touching ok)? (yes)
- How many calls? (up to 1000 -> O(n) per call is accepted; O(log n) is nicer)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sorted list + overlap check* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per book, O(n) space. Keep an unsorted list.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sorted list + binary search)   O(log n) search + O(n) insert, O(n) space. Keep bookings sorted by start.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- first booking always succeeds
- booking identical to an existing one -> false
- booking that would swallow an existing one ([5,50] over [10,20]) -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per book, O(n) space

```
Keep an unsorted list. For each new booking check every existing one with the overlap
formula start < other.end && other.start < end.
```

### APPROACH 2 — Optimal (sorted list + binary search)   O(log n) search + O(n) insert, O(n) space

```
Keep bookings sorted by start. Binary search for the first booking whose start >= the new
start. The new booking can only collide with that one (it must start before its start...
i.e. end > its start) or with the one just before it (which must end after the new start).
Check those two neighbours only, then splice in. In languages with a TreeMap the insert
is O(log n) too; in JS the splice is O(n) but with a tiny constant.

Dry run: book(10,20), book(20,30), book(15,25):
  [10,20] -> list [[10,20]]
  [20,30] -> idx=1 (no start >= 20 except none); prev [10,20] ends 20 <= 20 ok -> insert
  [15,25] -> idx=1 (first start >= 15 is [20,30]); next starts 20 < 25 -> conflict -> false
```

### Edge cases

```
- first booking always succeeds
- booking identical to an existing one -> false
- booking that would swallow an existing one ([5,50] over [10,20]) -> false
```

Full JavaScript solution with tests: [11_my_calendar_i.js](../solutions/11_my_calendar_i.js). Run it with `node 11_my_calendar_i.js` from the solutions folder.

</details>

## Common mistakes

- Using inclusive overlap on half-open bookings, rejecting valid back-to-back bookings.
- Checking only the next booking and forgetting the previous one (or vice versa).
- Adding the booking before checking, or adding it even when the check fails.

## Related follow-ups

- [My Calendar II](../02_Medium/12_my_calendar_ii.md)
- [Meeting Rooms](../01_Easy/01_meeting_rooms.md)
- My Calendar III (LeetCode #732)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
