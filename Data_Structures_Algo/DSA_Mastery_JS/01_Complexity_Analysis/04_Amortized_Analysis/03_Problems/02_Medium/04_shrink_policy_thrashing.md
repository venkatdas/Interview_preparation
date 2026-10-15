# Shrink Policy Thrashing

| | |
|---|---|
| **Topic** | Amortized Analysis |
| **Difficulty** | Medium |
| **Pattern** | adversarial sequences |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [04_shrink_policy_thrashing.js](../solutions/04_shrink_policy_thrashing.js) — open only after a real attempt |

## Problem

A dynamic array doubles when a push finds it full, and halves its capacity after a pop
when it becomes "too empty". Two shrink rules are proposed:
  - naive:  shrink when size <= capacity / 2
  - safe:   shrink when size <= capacity / 4
Given a sequence of operations ('push' or 'pop'), simulate the array and return
{ values, copies } where values are the popped values and copies counts element copies
during resizes. Build an adversarial sequence that makes the naive rule cost Θ(n) per
operation, and show the safe rule stays O(1) amortized for ANY sequence.

## Examples

```
ops: push x4 (values 0..3), then push, pop, push, pop (alternating at the boundary)
  after 4 pushes: cap 4, size 4 (copies so far 1 + 2 = 3)
  naive: push #5 -> grow to 8 (4 copies); pop -> size 4 <= 8/2 -> shrink to 4 (4 copies);
         push -> full -> grow to 8 (4 copies); pop -> shrink again (4 copies) ...
         every operation copies about n elements
  safe:  after growing to 8, a pop leaves size 4 > 8/4: no more resizes
  values popped (both rules): [4, 5]
ops: ['pop'] on empty -> values [null]
```

## Constraints & clarifying questions

```
- Popping an empty array returns null and does nothing.
- Capacity never drops below 1.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Find the adversary*: a sequence that sits on a resize boundary. Section 5.3 (shrinking arrays) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (naive shrink at 1/2)   Θ(n) per op in the worst case. Right after a resize (in either direction) the array is exactly half full, so ONE push or pop can trigger the next resize: alternating push/pop at a power of two resizes on every operation -> Θ(n²) total for n operations.

</details>

<details><summary>Hint 3</summary>

**The key idea.** After any resize the array is exactly half full. If the shrink threshold is 1/2, one pop shrinks and the next push grows again: Θ(n) every operation. With threshold 1/4, Θ(capacity) operations must happen before the next resize, which pays for its copies.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- pop on empty -> null
- the very first pushes (cap 1 -> 2 -> 4) count as copies too
- long pop runs: capacity keeps halving, never below 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (naive shrink at 1/2)   Θ(n) per op in the worst case

```
Right after a resize (in either direction) the array is exactly half full, so ONE
push or pop can trigger the next resize: alternating push/pop at a power of two
resizes on every operation -> Θ(n²) total for n operations.
```

### APPROACH 2 — Optimal (shrink at 1/4)   O(1) amortized

```
After any resize the array is half full. To trigger the next grow you need about
capacity/2 pushes; to trigger the next shrink you need about capacity/4 pops.
Either way, Θ(capacity) cheap operations pay for the Θ(capacity) copies of the
next resize (accounting: charge 3 per op). Total copies <= 3·(number of ops).

Dry run (safe), start cap 8 size 5: pop -> 4 (4 > 2, no shrink), pop -> 3, pop -> 2 -> 2 <= 8/4 -> shrink to 4 (copy 2).
  Now size 2 of cap 4: half full again.
```

### Edge cases

```
- pop on empty -> null
- the very first pushes (cap 1 -> 2 -> 4) count as copies too
- long pop runs: capacity keeps halving, never below 1
```

### Common mistakes

```
- Shrinking at 1/2 "to save memory" (thrashing).
- Shrinking by more than half (e.g. to exactly size): the next push resizes immediately.
```

Full JavaScript solution with tests: [04_shrink_policy_thrashing.js](../solutions/04_shrink_policy_thrashing.js). Run it with `node 04_shrink_policy_thrashing.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #641 Design Circular Deque (with resizing).
- Hash table shrinking: pick thresholds for growth and shrinkage.
- De-amortize: move 2 elements per operation into the new array (incremental resizing).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
