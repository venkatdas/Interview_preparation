# Different Ways to Add Parentheses

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | divide and conquer on operators + memo |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Divide and Conquer](../../../30_Divide_And_Conquer/README.md) |
| **Source** | LeetCode #241 — https://leetcode.com/problems/different-ways-to-add-parentheses/ (statement paraphrased in our own words) |
| **Solution file** | [10_different_ways_to_add_parentheses.js](../solutions/10_different_ways_to_add_parentheses.js) — open only after a real attempt |

## Problem

Given an expression of non-negative integers and the operators + - *, return the
results of ALL possible ways to fully parenthesize it (any order, duplicates kept).

## Examples

```
"2-1-1"     -> [0, 2]                 ((2-1)-1) = 0, (2-(1-1)) = 2
"2*3-4*5"   -> [-34, -14, -10, -10, 10]
"11"        -> [11]
```

## Constraints & clarifying questions

```
- Length <= 20, numbers 0..99, operators only + - *
- Order of the output? (any) Keep duplicates? (yes, one per parenthesization)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Generating all structures: choose the operator that is evaluated LAST, then the two sides are independent subproblems.

</details>

<details><summary>Hint 2</summary>

**Start simple.** If the string has no operator it is a number. Otherwise split at every operator and combine every left result with every right result.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The same substring (like "3-4") appears under many splits. Memoize results by substring.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Multi-digit numbers (parse the whole token). Duplicates in the output are expected.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain divide and conquer)   O(Catalan(ops) * ops) time

```
PROMISE: ways(expr) returns every value expr can take.
  base: expr is a plain number -> [number]
  step: for every operator at position i, split into left and right, recurse on both,
        combine every pair with that operator. The operator we split on is the LAST one
        evaluated, so each split is a different parenthesization.
Substrings like "3-4" get solved again and again.
```

### APPROACH 2 — Optimal (same recursion + memo on the substring)   output-bound

```
Cache ways(expr) by its string. Each distinct substring is expanded once; the total
time is dominated by the size of the output (Catalan growth is unavoidable because we
must LIST every result).

Dry run "2-1-1":
  split at first '-':  left "2" -> [2],  right "1-1" -> [0]          -> 2-0 = 2
  split at second '-': left "2-1" -> [1], right "1" -> [1]           -> 1-1 = 0
  result [2, 0]
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| plain recursion | about O(Catalan(ops) * ops) | O(output) |
| memoized | bounded by output size, each substring expanded once | O(memo + output) |

### Edge cases

```
- single number (possibly multi-digit) -> [that number]
- only one operator -> exactly one result
```

### Common mistakes

- Removing duplicates (the problem keeps them).
- Treating each digit as its own number.
- Thinking memo makes it polynomial: the output itself is Catalan-sized.

Full JavaScript solution with tests: [10_different_ways_to_add_parentheses.js](../solutions/10_different_ways_to_add_parentheses.js). Run it with `node 10_different_ways_to_add_parentheses.js` from the solutions folder.

</details>

## Related follow-ups

- Unique Binary Search Trees II (LeetCode #95)
- Burst Balloons (LeetCode #312)
- Expression Add Operators (LeetCode #282)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
