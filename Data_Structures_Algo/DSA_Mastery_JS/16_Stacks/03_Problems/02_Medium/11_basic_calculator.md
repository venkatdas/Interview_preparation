# Basic Calculator II

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | expression eval |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #227 — https://leetcode.com/problems/basic-calculator-ii/ |
| **Solution file** | [11_basic_calculator.js](../solutions/11_basic_calculator.js) — open only after a real attempt |

## Problem

Evaluate a string expression containing non-negative integers, the operators
+ - * /, and spaces. No parentheses. Integer division truncates toward zero.
Standard precedence: * and / before + and -.

## Examples

```
Input: "3+2*2"      Output: 7
Input: " 3/2 "      Output: 1
Input: " 3+5 / 2 "  Output: 5
Input: "14-3/2"     Output: 13   Explanation: 3/2 = 1, 14 - 1
```

## Constraints & clarifying questions

```
- Parentheses? (no for 227; the stack-of-frames version handles LeetCode 224 - see bonus)
- Negative numbers in the input? (no, but intermediate results can be negative)
- Division truncates toward zero? (yes -> Math.trunc)
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

**Start simple.** APPROACH 1 — Brute force (two passes over a token list)   O(n) time, O(n) space. Tokenize into numbers and operators.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (stack of signed terms)   O(n) time, O(n) space. The trick: treat the expression as a SUM of terms.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- spaces anywhere
- multi-digit numbers
- single number
- "0-3*2" -> negative result
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (two passes over a token list)   O(n) time, O(n) space

```
Tokenize into numbers and operators. Pass 1: collapse every * and / into
their neighbours. Pass 2: sum up the + and - terms. Works, but needs splice
which is O(n) per operation, so really O(n^2) worst case.
```

### APPROACH 2 — Optimal (stack of signed terms)   O(n) time, O(n) space

```
The trick: treat the expression as a SUM of terms. "3+2*2" = (+3) + (+2*2).
Keep the last operator seen. When a number is complete (next char is an
operator or the end):
  '+' -> push  number
  '-' -> push -number
  '*' -> push  stack.pop() * number     (multiply into the previous term)
  '/' -> push  trunc(stack.pop() / number)
At the end, sum the stack.

Dry run on "3+5/2":
  '3' number=3 ; '+' -> push 3 (op was '+')   stack [3]  op='+'
  '5' number=5 ; '/' -> push 5                stack [3,5]  op='/'
  '2' number=2 ; end -> op '/' : pop 5, push trunc(5/2)=2   stack [3,2]
  sum = 5
```

### Edge cases

```
- spaces anywhere
- multi-digit numbers
- single number
- "0-3*2" -> negative result
```

Full JavaScript solution with tests: [11_basic_calculator.js](../solutions/11_basic_calculator.js). Run it with `node 11_basic_calculator.js` from the solutions folder.

</details>

## Common mistakes

- Applying the current operator instead of the previous one when a new operator is read.
- Forgetting to process the final number at the end of the string.
- Ignoring spaces incorrectly, or splitting multi-digit numbers.

## Related follow-ups

- [Evaluate Reverse Polish Notation](04_evaluate_rpn.md)
- Basic Calculator (LeetCode #224)
- [Expression Add Operators](../../../13_Backtracking/03_Problems/03_Hard/15_expression_add_operators.md) (13_Backtracking)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
