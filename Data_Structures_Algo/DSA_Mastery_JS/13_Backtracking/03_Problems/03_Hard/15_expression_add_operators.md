# Expression Add Operators

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Hard |
| **Pattern** | string building with running value + last operand |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #282 — https://leetcode.com/problems/expression-add-operators/ |
| **Solution file** | [15_expression_add_operators.js](../solutions/15_expression_add_operators.js) — open only after a real attempt |

## Problem

Given a string of digits and a target, insert the binary operators '+', '-', '*'
between the digits (or none, to form multi-digit numbers) so that the expression
evaluates to target. Return all such expressions. Numbers must not have leading zeros.

## Examples

```
Input: num = "123", target = 6     Output: ["1*2*3","1+2+3"]
Input: num = "232", target = 8     Output: ["2*3+2","2+3*2"]
Input: num = "105", target = 5     Output: ["1*0+5","10-5"]
Input: num = "00",  target = 0     Output: ["0*0","0+0","0-0"]   ("00" is a leading zero)
Input: num = "3456237490", target = 9191   Output: []
```

## Constraints & clarifying questions

```
- Length <= 10, so 4^9 ~ 262k operator placements at most
- Operator precedence: '*' binds tighter than '+'/'-' (normal math)
- No unary minus, no parentheses, no division
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *string building with running value + last operand* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(4^n * n). Generate every expression string (at each gap: nothing, +, -, *), then evaluate each one with a small parser (handle * first, then + and -).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking carrying `value` and `lastOperand`)   O(4^n * n), O(n) stack. Build the expression left to right and keep two numbers: value        = result of the expression so far lastOperand  = the last term that was ADDED (with sign), so that a '*' can undo it For the next number `cur`: '+'  -> value + cur,                       las

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Leading zeros: "105" cannot use "05"
- Numbers can overflow 32-bit in other languages; JS doubles are safe up to 2^53
- Single digit input: just compare the number to target
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(4^n * n)

```
Generate every expression string (at each gap: nothing, +, -, *), then evaluate
each one with a small parser (handle * first, then + and -). Simple to reason
about, but evaluates each expression from scratch.
```

### APPROACH 2 — Optimal (Backtracking carrying `value` and `lastOperand`)   O(4^n * n), O(n) stack

```
Build the expression left to right and keep two numbers:
  value        = result of the expression so far
  lastOperand  = the last term that was ADDED (with sign), so that a '*' can undo it
For the next number `cur`:
  '+'  -> value + cur,                       lastOperand = cur
  '-'  -> value - cur,                       lastOperand = -cur
  '*'  -> value - lastOperand + lastOperand * cur,   lastOperand = lastOperand * cur
The '*' trick: "2+3*2": after "2+3" value=5, last=3. Now '*2': remove the 3 (5-3=2),
add 3*2=6 -> 8. That is how precedence is respected without a parser.
The first number has no operator in front, so it is handled separately.
Skip numbers with leading zero: if num[start] === '0', only the 1-digit piece "0" is allowed.

Dry run "232", target 8:
  first "2": value=2,last=2
    "+3": value=5,last=3 -> "*2": value=5-3+6=8 -> end, 8===8 record "2+3*2"
    "*3": value=2-2+6=6,last=6 -> "+2": 8 record "2*3+2"
  first "23": "+2"=25, "-2"=21, "*2"=46 -> none
  first "232": value 232 -> no operators left, != 8
```

### Edge cases

```
- Leading zeros: "105" cannot use "05"
- Numbers can overflow 32-bit in other languages; JS doubles are safe up to 2^53
- Single digit input: just compare the number to target
```

Full JavaScript solution with tests: [15_expression_add_operators.js](../solutions/15_expression_add_operators.js). Run it with `node 15_expression_add_operators.js` from the solutions folder.

</details>

## Common mistakes

- Handling `*` without undoing the previous operand: you must track the last multiplied term.
- Allowing numbers with leading zeros like `05`.
- Overflowing intermediate values; very long digit strings need care (JS numbers are exact only up to 2^53).

## Related follow-ups

- [Basic Calculator II](../../../16_Stacks/03_Problems/02_Medium/11_basic_calculator.md) (16_Stacks)
- [Target Sum](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/07_target_sum.md) (29_Dynamic_Programming/02_Knapsack)
- [Restore IP Addresses](../02_Medium/14_restore_ip_addresses.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
