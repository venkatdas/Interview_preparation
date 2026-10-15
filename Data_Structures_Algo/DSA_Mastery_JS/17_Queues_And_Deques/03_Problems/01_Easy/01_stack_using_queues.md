# Implement Stack using Queues

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Easy |
| **Pattern** | rotate on push |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #225 — https://leetcode.com/problems/implement-stack-using-queues/ |
| **Solution file** | [01_stack_using_queues.js](../solutions/01_stack_using_queues.js) — open only after a real attempt |

## Problem

Implement a LIFO stack (push, pop, top, empty) using only queue operations
(enqueue at back, dequeue from front, peek front, size, isEmpty).

## Examples

```
push(1) push(2)  top() -> 2  pop() -> 2  empty() -> false
```

## Constraints & clarifying questions

```
- pop/top only called on a non-empty stack? (yes)
- One queue or two? (follow-up: do it with ONE queue)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *rotate on push* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (one queue, rotate on push)   O(n) push, O(1) pop/top. After enqueueing the new element, rotate the queue n-1 times (dequeue front, enqueue it at the back).

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- push after popping to empty
- single element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (one queue, rotate on push)   O(n) push, O(1) pop/top

```
After enqueueing the new element, rotate the queue n-1 times (dequeue front,
enqueue it at the back). The newest element ends up at the FRONT, so the
queue's front is always the stack's top. pop and top become plain dequeue/peek.

Dry run: push(1) push(2) push(3) pop()
  push 1   [1]                  (rotate 0 times)
  push 2   [1,2] -> rotate 1 -> [2,1]
  push 3   [2,1,3] -> rotate 2 -> [1,3,2] -> [3,2,1]
  pop  -> dequeue front = 3 ; queue [2,1]
  top  -> 2

Both versions are O(n) somewhere - that is unavoidable with FIFO primitives.
Pick the one that makes the MORE FREQUENT operation cheap.
```

### NAIVE APPROACH (two queues)   O(1) push, O(n) pop

```
push: enqueue into q1. pop: move all but the last element from q1 to q2,
dequeue the last one (that's the top), then swap q1 and q2.
```

### Edge cases

```
- push after popping to empty
- single element
```

Full JavaScript solution with tests: [01_stack_using_queues.js](../solutions/01_stack_using_queues.js). Run it with `node 01_stack_using_queues.js` from the solutions folder.

</details>

## Common mistakes

- Using array index access or `pop()` on the "queue", which secretly makes it a stack.
- Rotating `size` times instead of `size - 1` after a push, putting the new item back at the end.
- Forgetting that `top` must not remove the element.

## Related follow-ups

- [Implement Queue using Stacks](02_queue_using_stacks.md)
- [Min Stack](../../../16_Stacks/03_Problems/02_Medium/02_min_stack.md) (16_Stacks)
- [Design Circular Queue](../02_Medium/03_design_circular_queue.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
