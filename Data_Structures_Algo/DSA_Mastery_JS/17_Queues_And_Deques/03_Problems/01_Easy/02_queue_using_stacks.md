# Implement Queue using Stacks

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Easy |
| **Pattern** | two stacks, amortized |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #232 — https://leetcode.com/problems/implement-queue-using-stacks/ |
| **Solution file** | [02_queue_using_stacks.js](../solutions/02_queue_using_stacks.js) — open only after a real attempt |

## Problem

Implement a FIFO queue (push, pop, peek, empty) using only stacks
(push to top, pop from top, peek top, size, isEmpty).
(Also in 16_Stacks/problems/03 - it belongs to both topics. Here the focus
is the amortized analysis, which queue questions love to ask about.)

## Examples

```
push(1) push(2)  peek() -> 1  pop() -> 1  empty() -> false
```

## Constraints & clarifying questions

```
- pop/peek only on a non-empty queue? (yes)
- "Amortized O(1)" acceptable? (yes - and be ready to explain what it means)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two stacks, amortized* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (inbox + outbox, amortized O(1)). push:      inbox.push(x) pop/peek:  if outbox is empty, pour ALL of inbox into outbox (reverses order).

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- never pour while outbox still has elements (breaks FIFO)
- empty() checks both stacks
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (inbox + outbox, amortized O(1))

```
push:      inbox.push(x)
  pop/peek:  if outbox is empty, pour ALL of inbox into outbox (reverses order).
             Then use outbox's top.

Amortized argument: each element is pushed onto inbox once, popped from inbox
once, pushed onto outbox once, popped from outbox once - 4 operations in its
whole life. n elements -> at most 4n operations -> O(1) per operation on average,
even though one particular pop can cost O(n).

Dry run: push(1) push(2) pop() push(3) pop() pop()
  push 1,2    inbox [1,2]  outbox []
  pop: pour   inbox []     outbox [2,1]  -> 1
  push 3      inbox [3]    outbox [2]
  pop -> 2    (outbox not empty, don't pour!)
  pop: outbox empty, pour -> outbox [3] -> 3
```

### NAIVE APPROACH   O(n) push, O(1) pop

```
Keep a single stack in queue order: on push, pour everything into a helper,
push the new value, pour everything back. The newest value is at the bottom,
so pop from the top returns the oldest. Every push costs O(n).
```

### Edge cases

```
- never pour while outbox still has elements (breaks FIFO)
- empty() checks both stacks
```

Full JavaScript solution with tests: [02_queue_using_stacks.js](../solutions/02_queue_using_stacks.js). Run it with `node 02_queue_using_stacks.js` from the solutions folder.

</details>

## Common mistakes

- Transferring from `in` to `out` when `out` is not empty, which breaks FIFO order.
- Copying back after every pop (O(n) per op instead of amortized O(1)).
- Implementing `peek` without the same lazy transfer as `pop`.

## Related follow-ups

- [Implement Stack using Queues](01_stack_using_queues.md)
- [Implement Queue using Stacks](../../../16_Stacks/03_Problems/01_Easy/03_queue_using_stacks.md) (16_Stacks)
- [Design Circular Queue](../02_Medium/03_design_circular_queue.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
