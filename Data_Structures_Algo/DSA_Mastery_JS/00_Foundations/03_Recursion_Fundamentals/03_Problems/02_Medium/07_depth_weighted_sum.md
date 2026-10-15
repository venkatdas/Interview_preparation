# Depth-Weighted Deep Sum

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | nested recursion → explicit stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [07_depth_weighted_sum.js](../solutions/07_depth_weighted_sum.js) — open only after a real attempt |

## Problem

Given a nested array of integers, return the sum of every integer multiplied by
its depth. The outer array is depth 1. Write the natural recursive version, then
an iterative version with an explicit stack that also works when the nesting is
100,000 levels deep (where recursion overflows Node's call stack).

## Examples

```
Input: [1, [2, 3], [[4]]]   Output: 1*1 + 2*2 + 3*2 + 4*3 = 23
Input: [[1, 1], 2, [1, 1]]  Output: 10   (four 1s at depth 2 = 8, plus 2 at depth 1)
Input: []                   Output: 0
Input: [[[]]]               Output: 0
```

## Constraints & clarifying questions

```
- Depth up to 1e5 -> recursion fails, need explicit stack.
- Total integers up to 1e5; sums fit in a Number.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Recursion on nested data*, then *explicit stack*. Sections 5.4 and 5.5 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (recursion)   O(N) time, O(D) stack (D = max depth). sum(arr, depth) = for each x: array ? sum(x, depth + 1) : x * depth. Clean, but each nesting level is one frame -> RangeError around 10k levels.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Carry the depth with each array: recursively `sum(x, depth + 1)` for sub-arrays and `x * depth` for numbers. For the iterative version push `[array, depth]` pairs; addition order does not matter, so a plain stack is enough.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty arrays at any depth contribute 0
- negative integers (fine)
- extremely deep nesting (explicit stack only)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (recursion)   O(N) time, O(D) stack (D = max depth)

```
sum(arr, depth) = for each x: array ? sum(x, depth + 1) : x * depth.
Clean, but each nesting level is one frame -> RangeError around 10k levels.
```

### APPROACH 2 — Optimal (explicit stack of [array, depth])   O(N) time, O(N) heap

```
stack = [[input, 1]]. Pop [arr, d]; for each x: if array push [x, d + 1], else total += x * d.
Addition is commutative, so visiting order does not matter (the "easy" conversion).

Dry run [1, [2, 3], [[4]]]:
  pop [root,1]: 1 -> total 1; push [[2,3],2]; push [[[4]],2]
  pop [[[4]],2]: push [[4],3]
  pop [[4],3]: 4*3 -> total 13
  pop [[2,3],2]: 2*2 + 3*2 -> total 23
```

### Edge cases

```
- empty arrays at any depth contribute 0
- negative integers (fine)
- extremely deep nesting (explicit stack only)
```

### Common mistakes

```
- Starting depth at 0 (every product off by one level).
- Incrementing depth for numbers instead of for arrays.
```

Full JavaScript solution with tests: [07_depth_weighted_sum.js](../solutions/07_depth_weighted_sum.js). Run it with `node 07_depth_weighted_sum.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #339 Nested List Weight Sum.
- LeetCode #364 Nested List Weight Sum II (inverse depth).
- Maximum nesting depth of a nested array, iteratively.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
