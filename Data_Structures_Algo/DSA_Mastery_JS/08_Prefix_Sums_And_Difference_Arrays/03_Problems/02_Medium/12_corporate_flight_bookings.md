# Corporate Flight Bookings

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | difference array |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1109 — https://leetcode.com/problems/corporate-flight-bookings/ |
| **Solution file** | [12_corporate_flight_bookings.js](../solutions/12_corporate_flight_bookings.js) — open only after a real attempt |

## Problem

There are n flights labelled 1..n. bookings[i] = [first, last, seats] means `seats`
seats were booked on EVERY flight from first to last (inclusive). Return an array
answer of length n where answer[i] is the total seats booked on flight i + 1.

## Examples

```
Input: bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5   Output: [10, 55, 45, 25, 25]
  Explanation: flight 1: 10 | flight 2: 10+20+25 | flight 3: 20+25 | flights 4,5: 25
Input: bookings = [[1,2,10],[2,2,15]], n = 2            Output: [10, 25]
```

## Constraints & clarifying questions

```
- 1-indexed flights? (yes -> subtract 1)
- Up to 2*10^4 bookings and flights -> O(n * bookings) = 4*10^8 is too slow
- Are we asked for point values only at the end? (yes -> difference array fits perfectly)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *difference array* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * bookings) time, O(n) space. For each booking, loop from first to last and add seats.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (difference array)   O(n + bookings) time, O(n) space. A range update [first, last] += seats becomes two point updates on a difference array: diff[first - 1] += seats      (seats "switch on" at first) diff[last]      -= seats      (seats "switch off" after last) After all bookings, the running sum of diff is the a

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Booking covers all flights
- Booking of a single flight (first === last)
- No bookings -> all zeros
- last === n (diff needs n + 1 slots)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * bookings) time, O(n) space

```
For each booking, loop from first to last and add seats.
```

### APPROACH 2 — Optimal (difference array)   O(n + bookings) time, O(n) space

```
A range update [first, last] += seats becomes two point updates on a difference array:
  diff[first - 1] += seats      (seats "switch on" at first)
  diff[last]      -= seats      (seats "switch off" after last)
After all bookings, the running sum of diff is the answer.

Dry run on [[1,2,10],[2,3,20],[2,5,25]], n = 5:
  diff (length 6): start [0,0,0,0,0,0]
  [1,2,10]: diff[0]+=10, diff[2]-=10  -> [10, 0, -10, 0, 0, 0]
  [2,3,20]: diff[1]+=20, diff[3]-=20  -> [10, 20, -10, -20, 0, 0]
  [2,5,25]: diff[1]+=25, diff[5]-=25  -> [10, 45, -10, -20, 0, -25]
  running sum: 10, 55, 45, 25, 25
```

### Edge cases

```
- Booking covers all flights
- Booking of a single flight (first === last)
- No bookings -> all zeros
- last === n (diff needs n + 1 slots)
```

Full JavaScript solution with tests: [12_corporate_flight_bookings.js](../solutions/12_corporate_flight_bookings.js). Run it with `node 12_corporate_flight_bookings.js` from the solutions folder.

</details>

## Common mistakes

- Mixing 1-based flight labels with 0-based array indices.
- Writing the end marker at `last` instead of `last + 1` (in 1-based terms), so the booking stops one flight early.
- Applying each booking to every flight in its range (O(n·m)).

## Related follow-ups

- [Car Pooling](13_car_pooling.md) — the same difference array with a capacity check
- Range Addition (LeetCode #370) — the textbook difference-array problem
- [Minimum Number of K Consecutive Bit Flips](../../../07_Sliding_Window/03_Problems/03_Hard/15_min_k_consecutive_bit_flips.md) — difference marks used on the fly

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
