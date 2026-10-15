# Design Circular Deque

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | ring buffer, both ends |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #641 — https://leetcode.com/problems/design-circular-deque/ |
| **Solution file** | [04_design_circular_deque.js](../solutions/04_design_circular_deque.js) — open only after a real attempt |

## Problem

Design a fixed-size double-ended queue of capacity k:
  insertFront(v), insertLast(v) -> true/false (false if full)
  deleteFront(), deleteLast()   -> true/false (false if empty)
  getFront(), getRear()         -> value or -1
  isEmpty(), isFull()
All in O(1).

## Examples

```
MyCircularDeque(3): insertLast(1) true, insertLast(2) true, insertFront(3) true,
insertFront(4) false, getRear() 2, isFull() true, deleteLast() true,
insertFront(4) true, getFront() 4
```

## Constraints & clarifying questions

```
- Values non-negative (so -1 means empty)? (yes)
- Fixed array, no push/unshift/shift? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *ring buffer, both ends* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (ring buffer with head index + count)   O(1) all ops, O(k) space. Same as the circular queue, plus: insertFront: head = (head - 1 + k) % k, write there.

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- negative modulo in JavaScript: (-1) % 3 === -1, so always add k first
- k = 1
- mixing front and back inserts until the buffer wraps both ways
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (ring buffer with head index + count)   O(1) all ops, O(k) space

```
Same as the circular queue, plus:
  insertFront: head = (head - 1 + k) % k, write there.   (+k avoids negative modulo!)
  deleteLast:  count-- (the back slot is simply forgotten)
The back index is always (head + count - 1) % k.

Dry run, k = 3:
  insertLast 1, 2     [1,2,_]  head=0 count=2
  insertFront 3       head=(0-1+3)%3=2 -> [1,2,3]  head=2 count=3   (3 sits at index 2 but is the FRONT)
  getRear  -> items[(2+3-1)%3]=items[1]=2
  deleteLast          count=2  -> logical order: 3,1
  insertFront 4       head=(2-1+3)%3=1 -> items[1]=4 -> logical order 4,3,1
  getFront -> 4
```

### NAIVE APPROACH   O(n) for front operations

```
A JS array with unshift/shift for the front and push/pop for the back.
unshift and shift are O(n).
```

### Edge cases

```
- negative modulo in JavaScript: (-1) % 3 === -1, so always add k first
- k = 1
- mixing front and back inserts until the buffer wraps both ways
```

Full JavaScript solution with tests: [04_design_circular_deque.js](../solutions/04_design_circular_deque.js). Run it with `node 04_design_circular_deque.js` from the solutions folder.

</details>

## Common mistakes

- Negative modulo when moving front backwards: use `(front - 1 + k) % k`.
- Updating the index before writing (or after) inconsistently between insertFront and insertLast.
- Returning `undefined` instead of `-1` from getFront/getRear on empty.

## Related follow-ups

- [Design Circular Queue](03_design_circular_queue.md)
- [Sliding Window Maximum](../03_Hard/07_sliding_window_maximum.md)
- Design Front Middle Back Queue (LeetCode #1670)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
