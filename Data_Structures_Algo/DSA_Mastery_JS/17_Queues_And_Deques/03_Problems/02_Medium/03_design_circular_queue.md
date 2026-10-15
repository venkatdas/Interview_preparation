# Design Circular Queue

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | ring buffer |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #622 — https://leetcode.com/problems/design-circular-queue/ |
| **Solution file** | [03_design_circular_queue.js](../solutions/03_design_circular_queue.js) — open only after a real attempt |

## Problem

Design a queue of fixed size k with these operations, all O(1):
  enQueue(value) -> true if inserted, false if full
  deQueue()      -> true if removed, false if empty
  Front()        -> front value or -1
  Rear()         -> back value or -1
  isEmpty(), isFull()

## Examples

```
MyCircularQueue(3): enQueue(1) true, enQueue(2) true, enQueue(3) true,
enQueue(4) false, Rear() 3, isFull() true, deQueue() true, enQueue(4) true, Rear() 4
```

## Constraints & clarifying questions

```
- Values are non-negative, so -1 can mean "empty"? (yes)
- Must I use a fixed-size array (no built-in push/shift)? (yes, that's the point)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *ring buffer* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (ring buffer: array + head index + count)   O(1) all ops, O(k) space. Keep `head` (index of the front) and `count`.

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- k = 1
- Rear when the back has wrapped to index 0
- enQueue on full / deQueue on empty return false and change nothing
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (ring buffer: array + head index + count)   O(1) all ops, O(k) space

```
Keep `head` (index of the front) and `count`. The back slot is
(head + count) % k. Enqueue writes there; dequeue moves head forward with
wrap-around: head = (head + 1) % k. Nothing is ever shifted.

Dry run, k = 3:
  enQueue 1,2,3    items [1,2,3]  head=0 count=3  (full)
  deQueue          items [_,2,3]  head=1 count=2
  enQueue 4        back=(1+2)%3=0 -> items [4,2,3]  head=1 count=3
  Front -> items[1]=2 ; Rear -> items[(1+3-1)%3]=items[0]=4
```

### NAIVE APPROACH   O(n) deQueue

```
Use a JS array with push() and shift() and check length against k. shift()
moves every element left, so deQueue is O(n). Also misses the point of the
exercise (the ring buffer).
```

### Edge cases

```
- k = 1
- Rear when the back has wrapped to index 0
- enQueue on full / deQueue on empty return false and change nothing
```

Full JavaScript solution with tests: [03_design_circular_queue.js](../solutions/03_design_circular_queue.js). Run it with `node 03_design_circular_queue.js` from the solutions folder.

</details>

## Common mistakes

- Not wrapping the rear index with `% capacity`.
- Confusing empty and full when `front === rear`; keep a count.
- Returning the wrong end in `Rear()` after wraparound (`(front + count - 1) % capacity`).

## Related follow-ups

- [Design Circular Deque](04_design_circular_deque.md)
- [Moving Average from Data Stream](../01_Easy/06_moving_average.md)
- [Design Hit Counter](11_design_hit_counter.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
