# Flatten to Depth

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | recursion vs explicit stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [05_flatten_depth.js](../solutions/05_flatten_depth.js) — open only after a real attempt |

## Problem

Given a nested array and a depth d (default Infinity), return a NEW array where
nested arrays are expanded up to d levels. depth 0 returns a shallow copy.
Behave like Array.prototype.flat(d), but write it yourself, and make it safe for
very deeply nested input (100,000 levels) where recursion would overflow the stack.

## Examples

```
Input: [1, [2, [3, [4]]]], d = 1          Output: [1, 2, [3, [4]]]
Input: [1, [2, [3, [4]]]], d = Infinity   Output: [1, 2, 3, 4]
Input: [[], [[]], 5],      d = Infinity   Output: [5]
Input: [1, 2],             d = 0          Output: [1, 2]   (a copy)
```

## Constraints & clarifying questions

```
- Can elements be objects? (yes, keep them as-is: only ARRAYS are expanded)
- Is input order preserved? (yes)
- How deep can nesting be? (up to 1e5 -> recursion depth is a real risk)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** A *nested structure walk*. Recursion works but has a depth limit; see the edge cases in [the concepts guide](../../01_Concepts/CONCEPTS.md) and [Recursion Fundamentals](../../../03_Recursion_Fundamentals/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (recursion)   O(total elements) time, O(depth) call stack. For each element: if it is an array and depth > 0, recurse with depth - 1 and push all results; otherwise push the element. Simple, but each nesting level is a stack frame, so ~10k+ levels throws RangeError: Maximum call stack size exceeded.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Replace the call stack with your own array of `[element, remainingDepth]` pairs. Push children in reverse so they pop in order. Expand only arrays whose remaining depth is above 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty nested arrays     -> vanish when expanded
- depth 0                 -> shallow copy, new outer array
- objects / strings       -> never expanded (strings are not arrays)
- 100,000 levels deep     -> explicit stack still works
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (recursion)   O(total elements) time, O(depth) call stack

```
For each element: if it is an array and depth > 0, recurse with depth - 1 and
push all results; otherwise push the element. Simple, but each nesting level is a
stack frame, so ~10k+ levels throws RangeError: Maximum call stack size exceeded.
```

### APPROACH 2 — Optimal (explicit stack of [element, depth])   O(total elements) time, O(total) heap space

```
Push the top-level elements onto a stack in REVERSE order (so popping yields them
left to right), each tagged with the remaining depth. Pop one:
  - an array with depth > 0 -> push its children (reversed) with depth - 1
  - anything else           -> append to output
The heap holds the stack, so depth is limited only by memory.

Dry run [1, [2, [3]]], d = 1:
  stack (top on right): [[2,[3]],1] [1,1]           out []
  pop 1         -> out [1]
  pop [2,[3]] d=1 -> push [[3],0] [2,0]
  pop 2         -> out [1,2]
  pop [3] d=0   -> depth exhausted, out [1,2,[3]]
```

### Edge cases

```
- empty nested arrays     -> vanish when expanded
- depth 0                 -> shallow copy, new outer array
- objects / strings       -> never expanded (strings are not arrays)
- 100,000 levels deep     -> explicit stack still works
```

### Common mistakes

```
- Pushing children in normal order onto the stack (output comes out reversed).
- Expanding strings by iterating them (for...of over 'ab' gives 'a', 'b').
- Returning the input itself for depth 0 (caller then aliases it).
```

Full JavaScript solution with tests: [05_flatten_depth.js](../solutions/05_flatten_depth.js). Run it with `node 05_flatten_depth.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #2625 Flatten Deeply Nested Array.
- LeetCode #341 Flatten Nested List Iterator (lazy version).
- Sum of a nested array where each level multiplies by its depth (LeetCode #339 idea).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
