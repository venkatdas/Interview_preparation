# Two-Stack Queue Move Count

| | |
|---|---|
| **Topic** | Amortized Analysis |
| **Difficulty** | Easy |
| **Pattern** | accounting method, lazy transfer |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [02_queue_two_stacks_moves.js](../solutions/02_queue_two_stacks_moves.js) — open only after a real attempt |

## Problem

You are given a list of operations on a FIFO queue: ['enq', x] or ['deq'].
Implement the queue with two stacks and return { outputs, moves } where outputs are
the dequeued values (or null for a dequeue on an empty queue) and moves is the number
of elements moved between the stacks. Compare two strategies:
  - eager: before every dequeue move everything from `in` to `out`, pop, then move
    everything back (so `in` always holds the queue)
  - lazy: refill `out` from `in` only when `out` is empty
Show that lazy makes at most one move per enqueued element.

## Examples

```
ops: enq 1, enq 2, enq 3, deq, enq 4, deq, deq, deq
  outputs: [1, 2, 3, 4]
  lazy moves: 4 (3 on the first deq, 1 on the last)
  eager moves: 3+2 + 3+2 ... (quadratic in the queue size)
ops: deq           outputs: [null], moves 0
```

## Constraints & clarifying questions

```
- Up to 1e5 operations.
- Values are any JS values (use null only as the "empty" signal).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Accounting method*. Sections 5.2 and 8 (dry run with credits) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (eager transfer both ways)   O(n) per dequeue, O(n²) total. Each dequeue pours `in` into `out` (size s moves), pops, then pours back (s - 1 moves).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Refill `out` only when it is empty. Then every element travels from `in` to `out` exactly once and never comes back, so total moves ≤ number of enqueues. Charge 3 per enqueue (push + 2 credits for its one move) and 1 per dequeue.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- dequeue on empty -> null, no moves
- interleaved enq/deq: elements arriving after a refill wait in `in`
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (eager transfer both ways)   O(n) per dequeue, O(n²) total

```
Each dequeue pours `in` into `out` (size s moves), pops, then pours back (s - 1 moves).
```

### APPROACH 2 — Optimal (lazy transfer)   O(1) amortized per operation, O(n) total

```
Pour only when `out` is empty. Elements in `out` are already in FIFO order (oldest on top).
Each element moves from `in` to `out` exactly once and never goes back: total moves <= #enqueues.
Accounting: charge enqueue 3 (1 push + 2 credits for its future move), dequeue 1.

Dry run (example 1, lazy):
  enq 1,2,3 -> in [1,2,3]
  deq: out empty -> move 3 -> out [3,2,1], pop 1
  enq 4 -> in [4]
  deq -> pop 2; deq -> pop 3 (no moves, out not empty)
  deq: out empty -> move 1 -> pop 4.   moves = 4
```

### Edge cases

```
- dequeue on empty -> null, no moves
- interleaved enq/deq: elements arriving after a refill wait in `in`
```

### Common mistakes

```
- Refilling when `in` is non-empty even though `out` still has elements (breaks FIFO order).
- Moving elements back to `in` (eager): correct but O(n) per operation.
```

Full JavaScript solution with tests: [02_queue_two_stacks_moves.js](../solutions/02_queue_two_stacks_moves.js). Run it with `node 02_queue_two_stacks_moves.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #232 Implement Queue using Stacks.
- LeetCode #225 Implement Stack using Queues (why it is NOT amortized O(1) both ways).
- A deque from two stacks with rebalancing in halves.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
