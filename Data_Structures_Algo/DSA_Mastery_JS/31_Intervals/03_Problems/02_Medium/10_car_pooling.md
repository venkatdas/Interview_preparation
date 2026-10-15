# Car Pooling

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | sweep line with weights |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1094 — https://leetcode.com/problems/car-pooling/ |
| **Solution file** | [10_car_pooling.js](../solutions/10_car_pooling.js) — open only after a real attempt |

## Problem

A car with `capacity` seats drives east only. trips[i] = [numPassengers, from, to]:
pick up numPassengers at location `from`, drop them at `to`. Return true if every trip
can be served without ever exceeding capacity. Dropping off at x and picking up at x
happen in that order (drop first).

## Examples

```
Input: trips = [[2,1,5],[3,3,7]], capacity = 4   Output: false   Explanation: 5 people between 3 and 5
Input: trips = [[2,1,5],[3,3,7]], capacity = 5   Output: true
Input: trips = [[2,1,5],[3,5,7]], capacity = 3   Output: true    Explanation: drop at 5 before pickup at 5
```

## Constraints & clarifying questions

```
- Locations are small integers (0..1000)? (yes -> a difference array works too)
- Drop-off before pick-up at the same location? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sweep line with weights* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * range) time, O(range) space. For every location, add up passengers from all trips covering it; compare to capacity.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sweep line with weighted events)   O(n log n) time, O(n) space. Each trip becomes two events: (+passengers at from) and (-passengers at to).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no trips -> true
- a single trip bigger than capacity -> false
- pickup and dropoff at the same location (drop first) -> fine
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * range) time, O(range) space

```
For every location, add up passengers from all trips covering it; compare to capacity.
```

### APPROACH 2 — Optimal (sweep line with weighted events)   O(n log n) time, O(n) space

```
Each trip becomes two events: (+passengers at from) and (-passengers at to). Sort by
location; on ties process drop-offs (negative) first. Scan with a running total; if it
ever exceeds capacity -> false.
Because locations are <= 1000, a difference array (O(n + 1000)) avoids the sort entirely:
diff[from] += p, diff[to] -= p, then prefix-sum. Shown as `optimalDiffArray`.

Dry run on [[2,1,5],[3,3,7]], capacity 4:
  events: (1,+2) (3,+3) (5,-2) (7,-3)
  running: 2, 5 -> 5 > 4 -> false
```

### Edge cases

```
- no trips -> true
- a single trip bigger than capacity -> false
- pickup and dropoff at the same location (drop first) -> fine
```

Full JavaScript solution with tests: [10_car_pooling.js](../solutions/10_car_pooling.js). Run it with `node 10_car_pooling.js` from the solutions folder.

</details>

## Common mistakes

- Picking up before dropping off at the same location, which overcounts by one trip.
- Treating the drop-off location as still occupied (it is half-open: `[from, to)`).
- Sizing the difference array too small (needs index `to`, not `to - 1`).

## Related follow-ups

- [Meeting Rooms II](../02_Medium/09_meeting_rooms_ii.md)
- [My Calendar II](../02_Medium/12_my_calendar_ii.md)
- Corporate Flight Bookings (LeetCode #1109)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
