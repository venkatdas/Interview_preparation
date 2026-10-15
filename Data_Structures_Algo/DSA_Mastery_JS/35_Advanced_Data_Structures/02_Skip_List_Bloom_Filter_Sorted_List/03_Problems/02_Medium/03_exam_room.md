# Exam Room

| | |
|---|---|
| **Topic** | Skip List, Bloom Filter and Sorted List |
| **Difficulty** | Medium |
| **Pattern** | sorted occupied seats, scan gaps |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #855 — https://leetcode.com/problems/exam-room/ |
| **Solution file** | [03_exam_room.js](../solutions/03_exam_room.js) — open only after a real attempt |

## Problem

A row of n seats numbered 0..n-1. seat(): a student sits in the seat that maximises the
distance to the closest other student; on ties choose the LOWEST seat number. Return it.
leave(p): the student in seat p leaves.

## Examples

```
n = 10: seat() -> 0, seat() -> 9, seat() -> 4, seat() -> 2, leave(4), seat() -> 5
```

## Constraints & clarifying questions

```
- n up to 10^9, but at most 10^4 calls -> we must store only occupied seats, not all n
- leave(p) is only called for an occupied seat
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sorted occupied seats, scan gaps* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per seat(). Keep a boolean array of size n.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Sorted list of occupied seats)   O(m) per seat(), O(log m) leave(). Keep occupied seats sorted.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1: seat() -> 0
- room empty again after leaves
- all seats full for small n (not called per problem statement)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per seat()

```
Keep a boolean array of size n. For each empty seat compute the distance to the nearest
occupied seat; pick the best. Only works for small n.
```

### APPROACH 2 — Optimal (Sorted list of occupied seats)   O(m) per seat(), O(log m) leave()

```
Keep occupied seats sorted. The best seat is one of:
  - seat 0 if empty: distance = first occupied seat
  - the midpoint of each gap between neighbours a < b: distance = (b - a) / 2, seat a + dist
  - seat n - 1 if empty: distance = n - 1 - last occupied
Scan the gaps (m = number of students, m << n), choose the largest distance, lowest seat.
leave(p) = remove p from the sorted list (binary search + splice).
(A priority queue of gaps gives O(log m) seat(), but needs lazy deletion; the sorted
scan is what most people write and it passes.)

Dry run, n = 10:
  seat(): empty -> 0                               seats [0]
  seat(): candidates: gap end: 9 (dist 9) -> 9     seats [0, 9]
  seat(): gap 0..9: dist 4, seat 4 -> 4            seats [0, 4, 9]
  seat(): gaps 0..4 -> seat 2 dist 2; 4..9 -> seat 6 dist 2; tie -> 2   seats [0,2,4,9]
  leave(4): seats [0, 2, 9]
  seat(): gaps 0..2 -> seat 1 dist 1; 2..9 -> seat 5 dist 3 -> 5
```

### Edge cases

```
- n = 1: seat() -> 0
- room empty again after leaves
- all seats full for small n (not called per problem statement)
```

Full JavaScript solution with tests: [03_exam_room.js](../solutions/03_exam_room.js). Run it with `node 03_exam_room.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the two edge gaps: seat 0 and seat n-1 are only one-sided, so their distance is the gap length itself, not half.
- Breaking distance ties toward the higher seat; ties must go to the lowest seat number.
- Allocating an array of size n when n can be 10^9; store only occupied seats.

## Related follow-ups

- [My Calendar I](../02_Medium/01_my_calendar_i.md)
- Maximize Distance to Closest Person (LeetCode #849)
- [Heaps](../../../../19_Heaps_And_Priority_Queues/README.md) (lazy-deletion heap version)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
