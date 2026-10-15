# Implement Queue using Stacks

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Easy |
| **Pattern** | two stacks |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #232 — https://leetcode.com/problems/implement-queue-using-stacks/ |
| **Solution file** | [03_queue_using_stacks.js](../solutions/03_queue_using_stacks.js) — open only after a real attempt |

## Problem

Implement a FIFO queue (push, pop, peek, empty) using only stack operations
(push to top, pop from top, peek top, size, isEmpty).

## Examples

```
push(1) push(2)  peek() -> 1  pop() -> 1  empty() -> false
```

## Constraints & clarifying questions

```
- Are pop/peek called only on a non-empty queue? (yes)
- Is amortized O(1) acceptable, or must every call be O(1)? (amortized is the follow-up goal)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two stacks* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (two stacks: inbox and outbox, amortized O(1)). push(x):  inbox.push(x) pop/peek: if outbox is empty, pour ALL of inbox into outbox (this reverses the order, so the oldest element is now on top of outbox).

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- interleaved pushes and pops (never pour while outbox still has items,
  or the order breaks)
- empty() must consider both stacks
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (two stacks: inbox and outbox, amortized O(1))

```
push(x):  inbox.push(x)
  pop/peek: if outbox is empty, pour ALL of inbox into outbox (this reverses
            the order, so the oldest element is now on top of outbox).
            Then pop/peek from outbox.
Each element is moved from inbox to outbox at most ONCE in its lifetime, so
over n operations the total work is O(n) -> amortized O(1) per operation.

Dry run: push(1) push(2) push(3) pop() push(4) pop() pop() pop()
  push 1,2,3      inbox [1,2,3]   outbox []
  pop: pour ->    inbox []        outbox [3,2,1]  pop -> 1
  push 4          inbox [4]       outbox [3,2]
  pop -> 2 (outbox not empty, no pouring)
  pop -> 3
  pop: outbox empty, pour -> outbox [4]  pop -> 4
```

### NAIVE APPROACH   O(n) push, O(1) pop

```
Keep the stack in "queue order" at all times: on every push, move everything
to a helper stack, push the new value, move everything back. The new element
ends up at the BOTTOM, so pop from the top gives the oldest element.
Works, but every push costs O(n).
```

### Edge cases

```
- interleaved pushes and pops (never pour while outbox still has items,
  or the order breaks)
- empty() must consider both stacks
```

Full JavaScript solution with tests: [03_queue_using_stacks.js](../solutions/03_queue_using_stacks.js). Run it with `node 03_queue_using_stacks.js` from the solutions folder.

</details>

## Common mistakes

- Transferring from `in` to `out` on every pop even when `out` still has items (breaks order).
- Moving items back to `in` after each pop: correct but O(n) per operation.
- Forgetting `peek` needs the same lazy transfer as `pop`.

## Related follow-ups

- [Implement Stack using Queues](../../../17_Queues_And_Deques/03_Problems/01_Easy/01_stack_using_queues.md) (17_Queues_And_Deques)
- [Implement Queue using Stacks](../../../17_Queues_And_Deques/03_Problems/01_Easy/02_queue_using_stacks.md) (17_Queues_And_Deques)
- [Min Stack](../02_Medium/02_min_stack.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
