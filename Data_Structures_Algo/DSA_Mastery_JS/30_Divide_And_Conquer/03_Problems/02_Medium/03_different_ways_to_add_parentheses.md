# Different Ways to Add Parentheses

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Medium |
| **Pattern** | split at every operator + memo |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #241 — https://leetcode.com/problems/different-ways-to-add-parentheses/ |
| **Solution file** | [03_different_ways_to_add_parentheses.js](../solutions/03_different_ways_to_add_parentheses.js) — open only after a real attempt |

## Problem

Given a string of numbers and the operators + - *, return all results from every
possible way of grouping the expression with parentheses (duplicates allowed, any order).

## Examples

```
Input: "2-1-1"      Output: [0, 2]        ((2-1)-1) = 0, (2-(1-1)) = 2
Input: "2*3-4*5"    Output: [-34,-14,-10,-10,10]
```

## Constraints & clarifying questions

```
- Length up to 20, numbers up to 99 -> output size is a Catalan number, small
- Only + - *, no division, no unary minus
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *split at every operator + memo* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (enumerate parenthesisations explicitly). Generating every bracket placement and then evaluating is messy and does the same work as the D&C below without the structure.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Divide at every operator + memoize)   O(Catalan(n)) results. Pick any operator as the LAST one applied: everything left of it is one sub-expression, everything right is another.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- a single number -> [that number]
- two numbers -> one result
- repeated results are kept (e.g. -10 twice in the example)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (enumerate parenthesisations explicitly)

```
Generating every bracket placement and then evaluating is messy and does the same work as
the D&C below without the structure. We keep an honest "brute force" here: recursion
WITHOUT memoization (recomputes the same substrings many times).
```

### APPROACH 2 — Optimal (Divide at every operator + memoize)   O(Catalan(n)) results

```
Pick any operator as the LAST one applied: everything left of it is one sub-expression,
everything right is another. Results(expr) = for each operator at i:
  for a in Results(left) for b in Results(right): a op b
Base case: no operator -> [number]. Memoize by substring (the same substring appears
in many splits).

Dry run "2-1-1":
  split at first '-': left "2" -> [2], right "1-1" -> [0]  -> 2-0 = 2
  split at second '-': left "2-1" -> [1], right "1" -> [1] -> 1-1 = 0
  -> [2, 0]
```

### Edge cases

```
- a single number -> [that number]
- two numbers -> one result
- repeated results are kept (e.g. -10 twice in the example)
```

Full JavaScript solution with tests: [03_different_ways_to_add_parentheses.js](../solutions/03_different_ways_to_add_parentheses.js). Run it with `node 03_different_ways_to_add_parentheses.js` from the solutions folder.

</details>

## Common mistakes

- Parsing only single-digit numbers - multi-digit operands like "12" must stay together.
- Forgetting the base case: a string with no operator is just a number.
- No memo: the same substring is solved again and again (exponential blow-up).

## Related follow-ups

- Unique Binary Search Trees II (LeetCode #95)
- Burst Balloons (LeetCode #312)
- [Interval DP](../../../29_Dynamic_Programming/05_Interval_DP/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
