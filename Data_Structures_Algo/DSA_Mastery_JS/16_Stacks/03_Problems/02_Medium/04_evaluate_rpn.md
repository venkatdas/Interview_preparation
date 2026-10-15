# Evaluate Reverse Polish Notation

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | expression eval |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #150 — https://leetcode.com/problems/evaluate-reverse-polish-notation/ |
| **Solution file** | [04_evaluate_rpn.js](../solutions/04_evaluate_rpn.js) — open only after a real attempt |

## Problem

You are given an array of tokens representing an arithmetic expression in
Reverse Polish Notation (postfix): the operator comes AFTER its two operands.
Evaluate it. Operators are + - * /. Division truncates toward zero.

## Examples

```
Input: ["2","1","+","3","*"]           Output: 9    Explanation: (2 + 1) * 3
Input: ["4","13","5","/","+"]          Output: 6    Explanation: 4 + (13 / 5) = 4 + 2
Input: ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]   Output: 22
```

## Constraints & clarifying questions

```
- Is the expression always valid? (yes)
- Division: truncate toward zero or floor? (toward zero: -7/2 = -3, not -4)
- Can numbers be negative, like "-11"? (yes - don't confuse with the minus operator)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *expression eval* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (repeated rewrite)   O(n^2) time, O(n) space. Scan for the first operator, compute it with the two tokens before it, splice the three tokens out and put the result in.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (stack)   O(n) time, O(n) space. Read tokens left to right: number   -> push operator -> pop b (right operand), pop a (left operand), push a op b The order of pops matters for - and /: the SECOND pop is the left operand.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single number token
- negative numbers as tokens
- division of negatives truncating toward zero (Math.trunc, not Math.floor)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (repeated rewrite)   O(n^2) time, O(n) space

```
Scan for the first operator, compute it with the two tokens before it,
splice the three tokens out and put the result in. Repeat until one token
remains. Each pass is O(n) and there are O(n) passes.
```

### APPROACH 2 — Optimal (stack)   O(n) time, O(n) space

```
Read tokens left to right:
  number   -> push
  operator -> pop b (right operand), pop a (left operand), push a op b
The order of pops matters for - and /: the SECOND pop is the left operand.

Dry run on ["2","1","+","3","*"]:
  2    push      [2]
  1    push      [2,1]
  +    pop 1,2 -> 3   [3]
  3    push      [3,3]
  *    pop 3,3 -> 9   [9]
  answer 9
```

### Edge cases

```
- single number token
- negative numbers as tokens
- division of negatives truncating toward zero (Math.trunc, not Math.floor)
```

Full JavaScript solution with tests: [04_evaluate_rpn.js](../solutions/04_evaluate_rpn.js). Run it with `node 04_evaluate_rpn.js` from the solutions folder.

</details>

## Common mistakes

- Popping operands in the wrong order for `-` and `/` (the second pop is the left operand).
- Using `Math.floor` for division: it must truncate toward zero (`Math.trunc`).
- Treating `"-3"` as an operator because it starts with `-`.

## Related follow-ups

- [Basic Calculator II](11_basic_calculator.md)
- Basic Calculator (LeetCode #224)
- [Valid Parentheses](../01_Easy/01_valid_parentheses.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
