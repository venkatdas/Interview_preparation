# Meeting Rooms

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Easy |
| **Pattern** | sort + adjacent check |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #252 — https://leetcode.com/problems/meeting-rooms/ |
| **Solution file** | [01_meeting_rooms.js](../solutions/01_meeting_rooms.js) — open only after a real attempt |

## Problem

Given meeting time intervals [start, end), return true if one person could attend all
of them (no two meetings overlap). A meeting ending at 10 and one starting at 10 are fine.

## Examples

```
Input: [[0,30],[5,10],[15,20]]   Output: false   Explanation: [0,30] overlaps both others
Input: [[7,10],[2,4]]            Output: true
Input: [[1,5],[5,8]]             Output: true    Explanation: touching is allowed
```

## Constraints & clarifying questions

```
- Are ends exclusive (touching allowed)? (yes)
- Is the input sorted? (no)
- Empty list? (true)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + adjacent check* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Check every pair with the overlap formula a.start &lt; b.end && b.start &lt; a.end.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by start, compare neighbours)   O(n log n) time, O(1) extra. After sorting by start, an overlap can only happen between ADJACENT meetings: if meeting i overlaps some later meeting j, then it also overlaps meeting i+1 (which starts no later than j).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] or one meeting -> true
- identical meetings -> false
- touching [1,5],[5,8] -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Check every pair with the overlap formula a.start < b.end && b.start < a.end.
```

### APPROACH 2 — Optimal (sort by start, compare neighbours)   O(n log n) time, O(1) extra

```
After sorting by start, an overlap can only happen between ADJACENT meetings: if meeting i
overlaps some later meeting j, then it also overlaps meeting i+1 (which starts no later
than j). So one pass comparing each start with the previous end is enough.

Dry run on [[0,30],[5,10],[15,20]]:
  sorted: [0,30],[5,10],[15,20]
  5 < 30 -> conflict -> false
```

### Edge cases

```
- [] or one meeting -> true
- identical meetings -> false
- touching [1,5],[5,8] -> true
```

Full JavaScript solution with tests: [01_meeting_rooms.js](../solutions/01_meeting_rooms.js). Run it with `node 01_meeting_rooms.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to sort first and only comparing neighbours in input order.
- Treating touching meetings (`[1,5]`, `[5,8]`) as a conflict when the problem allows back-to-back meetings.
- Comparing every pair (O(n²)) when one sort makes a single neighbour check enough.

## Related follow-ups

- [Meeting Rooms II](../02_Medium/09_meeting_rooms_ii.md)
- [My Calendar I](../02_Medium/11_my_calendar_i.md)
- [Merge Intervals](../02_Medium/03_merge_intervals.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
