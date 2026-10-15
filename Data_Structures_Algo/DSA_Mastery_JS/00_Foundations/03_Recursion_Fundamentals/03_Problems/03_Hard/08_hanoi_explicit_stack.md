# Tower of Hanoi, Iteratively

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Hard |
| **Pattern** | general recursion → frame stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [08_hanoi_explicit_stack.js](../solutions/08_hanoi_explicit_stack.js) — open only after a real attempt |

## Problem

Move n disks from peg 'A' to peg 'C' using peg 'B', one disk at a time, never
placing a larger disk on a smaller one. Return the list of moves as [disk, from, to].
First write the classic recursion. Then convert it MECHANICALLY into a loop with an
explicit stack of frames (no recursion at all) that produces exactly the same moves.
This is the general recursion -> iteration technique: the recursive version does
work BETWEEN its two calls, so a simple "push children" stack is not enough.

## Examples

```
Input: n = 1   Output: [[1,'A','C']]
Input: n = 2   Output: [[1,'A','B'], [2,'A','C'], [1,'B','C']]
Input: n = 3   Output: 7 moves, starting [1,'A','C'], [2,'A','B'], [1,'C','B'], [3,'A','C'] ...
Input: n = 0   Output: []
```

## Constraints & clarifying questions

```
- n up to 20 -> 2^20 - 1 ~ 1e6 moves (output size dominates).
- Recursion depth is only n here, so the point of the exercise is the TECHNIQUE
  (the same technique rescues deep DFS / postorder traversals).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *General recursion-to-iteration conversion*: frames with a stage. Section 5.5 in [the concepts guide](../../01_Concepts/CONCEPTS.md) and `postorderFrames` in [stack_depth.js](../../02_Implementations/stack_depth.js).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (classic recursion)   O(2^n) time, O(n) stack. hanoi(n, from, to, via): if n === 0 return hanoi(n-1, from, via, to) // clear the way

</details>

<details><summary>Hint 3</summary>

**The key idea.** Store `{ n, from, to, via, stage }`. Peek the top: stage 0 pushes the first child call; stage 1 records the move and pushes the second child call; stage 2 pops. Base case `n === 0` pops immediately.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> no moves
- move count must be 2^n - 1
- every move must be legal (verified by simulating the pegs in the tests)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (classic recursion)   O(2^n) time, O(n) stack

```
hanoi(n, from, to, via):
  if n === 0 return
  hanoi(n-1, from, via, to)      // clear the way
  move disk n from -> to         // work BETWEEN the calls
  hanoi(n-1, via, to, from)      // put the small tower back on top
```

### APPROACH 2 — Optimal (explicit stack of frames with a stage)   O(2^n) time, O(n) heap

```
A frame = { n, from, to, via, stage }. Look at the TOP frame (do not pop yet):
  n === 0             -> pop (base case returns)
  stage 0 -> stage 1, push child frame (n-1, from, via, to)       ["first call"]
  stage 1 -> record move n from->to, stage 2, push (n-1, via, to, from) ["work + second call"]
  stage 2 -> pop                                                  ["return"]
This is exactly what the engine stores: arguments + where to resume.
(Optimisation: the second call is a tail call, so instead of stage 2 we could
replace the frame. Kept explicit here for clarity.)

Dry run n = 2 (stack top on the right):
  [(2,A,C,B,s0)]                    -> s1, push (1,A,B,C)
  [(2,s1),(1,A,B,C,s0)]             -> s1, push (0,..)
  [(2,s1),(1,s1),(0)]               -> pop
  [(2,s1),(1,A,B,C,s1)]             -> move 1 A->B, s2, push (0)
  ... pop, pop (1 done)
  [(2,A,C,B,s1)]                    -> move 2 A->C, s2, push (1,B,C,A)
  (1,B,C,A) -> move 1 B->C; then everything pops
```

### Edge cases

```
- n = 0 -> no moves
- move count must be 2^n - 1
- every move must be legal (verified by simulating the pegs in the tests)
```

### Common mistakes

```
- Popping the frame before its second call (loses "where to resume").
- Pushing both child calls at once: the move between them then happens at the wrong time.
- Mixing up the roles of via/to in the child calls.
```

Full JavaScript solution with tests: [08_hanoi_explicit_stack.js](../solutions/08_hanoi_explicit_stack.js). Run it with `node 08_hanoi_explicit_stack.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #145 Binary Tree Postorder Traversal (iterative).
- Iterative merge sort (bottom-up) vs recursive merge sort.
- Iterative DFS that reports both entry and exit times.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
