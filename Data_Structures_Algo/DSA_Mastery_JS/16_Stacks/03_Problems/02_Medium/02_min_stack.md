# Min Stack

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | two stacks |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #155 — https://leetcode.com/problems/min-stack/ |
| **Solution file** | [02_min_stack.js](../solutions/02_min_stack.js) — open only after a real attempt |

## Problem

Design a stack that supports push, pop, top and getMin, ALL in O(1) time.
getMin returns the smallest value currently in the stack.

## Examples

```
push(-2) push(0) push(-3)  getMin() -> -3
pop()                      top() -> 0   getMin() -> -2
```

## Constraints & clarifying questions

```
- Are pop/top/getMin always called on a non-empty stack? (LeetCode: yes)
- Can values repeat? (yes -> be careful when popping a value equal to the min)
- Is O(n) extra space acceptable? (yes)
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

**Start simple.** APPROACH — Optimal (second stack of running minimums)   O(1) all ops, O(n) space. Keep a parallel stack `mins`.

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- duplicates of the minimum
- popping down to empty and pushing again
- negative numbers
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (second stack of running minimums)   O(1) all ops, O(n) space

```
Keep a parallel stack `mins`. Its top is ALWAYS the minimum of everything
currently in the main stack.
  push(x): push x on main; if mins is empty or x <= mins.top, also push x on mins.
  pop():   pop from main; if the popped value === mins.top, pop mins too.
The `<=` (not `<`) matters: with duplicates like push(3), push(3), pop(), the
min must still be 3, so both 3s must be recorded.

Dry run: push(-2) push(0) push(-3) getMin pop getMin
  push(-2)  main [-2]        mins [-2]
  push(0)   main [-2,0]      mins [-2]        (0 > -2, don't record)
  push(-3)  main [-2,0,-3]   mins [-2,-3]
  getMin -> -3
  pop()     main [-2,0]      mins [-2]        (-3 was the min, pop it too)
  getMin -> -2

Variation (saves space): push a pair [value, currentMin] on a single stack.
```

### NAIVE APPROACH   O(1) push/pop, O(n) getMin

```
A normal array stack where getMin scans the whole array with Math.min(...).
Correct, but getMin is O(n) and the question demands O(1).
```

### Edge cases

```
- duplicates of the minimum
- popping down to empty and pushing again
- negative numbers
```

Full JavaScript solution with tests: [02_min_stack.js](../solutions/02_min_stack.js). Run it with `node 02_min_stack.js` from the solutions folder.

</details>

## Common mistakes

- Pushing to the min stack only on strictly smaller values (`<`), which breaks with duplicate minimums.
- Recomputing the minimum by scanning on every `getMin` (O(n)).
- Forgetting to pop from the min stack when the popped value is the current minimum.

## Related follow-ups

- Max Stack (LeetCode #716)
- [Implement Queue using Stacks](../01_Easy/03_queue_using_stacks.md)
- [Sliding Window Maximum](../../../17_Queues_And_Deques/03_Problems/03_Hard/07_sliding_window_maximum.md) (17_Queues_And_Deques)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
