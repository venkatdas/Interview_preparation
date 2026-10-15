# Car Pooling

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | difference array over time |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1094 — https://leetcode.com/problems/car-pooling/ |
| **Solution file** | [13_car_pooling.js](../solutions/13_car_pooling.js) — open only after a real attempt |

## Problem

A car with `capacity` seats drives east only. trips[i] = [numPassengers, from, to]:
numPassengers get in at location `from` and get out at `to`. Return true if it is
possible to complete all trips without ever exceeding capacity.

## Examples

```
Input: trips = [[2,1,5],[3,3,7]], capacity = 4   Output: false   Explanation: between 3 and 5 there are 5 people
Input: trips = [[2,1,5],[3,3,7]], capacity = 5   Output: true
Input: trips = [[2,1,5],[3,5,7]], capacity = 3   Output: true    Explanation: the first group leaves exactly when the second boards
```

## Constraints & clarifying questions

```
- Drop-off at `to` happens BEFORE pick-up at the same location? (yes; so `to` is exclusive)
- Locations in a small range? (0 <= from < to <= 1000 -> a fixed-size array works)
- Many trips? (up to 1000)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *difference array over time* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(trips * route length) time, O(route length) space. For each trip, add passengers to every location in [from, to).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (difference array over locations)   O(trips + maxLocation) time, O(maxLocation) space. Each trip is a range update: +passengers on [from, to).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Drop-off and pick-up at the same location (exclusive end handles it)
- Single trip with passengers > capacity -> false
- No trips -> true
- Trips far apart never overlap
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(trips * route length) time, O(route length) space

```
For each trip, add passengers to every location in [from, to). Then check the max.
```

### APPROACH 2 — Optimal (difference array over locations)   O(trips + maxLocation) time, O(maxLocation) space

```
Each trip is a range update: +passengers on [from, to). On a difference array:
  diff[from] += passengers; diff[to] -= passengers
Then a running sum gives the passenger count at every location; fail if any > capacity.
Same pattern as Corporate Flight Bookings, with "time/location" as the index.
(Alternative: sort events by location and sweep; O(trips log trips) but no size limit.)

Dry run on [[2,1,5],[3,3,7]], capacity 4:
  diff: [0, 2, 0, 3, 0, -2, 0, -3, ...]
  running: loc0 0, loc1 2, loc2 2, loc3 5 > 4 -> false
```

### Edge cases

```
- Drop-off and pick-up at the same location (exclusive end handles it)
- Single trip with passengers > capacity -> false
- No trips -> true
- Trips far apart never overlap
```

Full JavaScript solution with tests: [13_car_pooling.js](../solutions/13_car_pooling.js). Run it with `node 13_car_pooling.js` from the solutions folder.

</details>

## Common mistakes

- Dropping passengers off one stop late; at the `to` location they have already left the car.
- Sorting trips and simulating with a heap is valid but more complex than a difference array.
- Sizing the difference array by the number of trips instead of the maximum location.

## Related follow-ups

- [Corporate Flight Bookings](12_corporate_flight_bookings.md) — the same range-add idea
- [Meeting Rooms II](../../../11_Sorting/03_Problems/02_Medium/06_meeting_rooms_ii.md) — the max overlap at any time
- [My Calendar II](../../../31_Intervals/03_Problems/02_Medium/12_my_calendar_ii.md) — overlap counting with a sweep

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
