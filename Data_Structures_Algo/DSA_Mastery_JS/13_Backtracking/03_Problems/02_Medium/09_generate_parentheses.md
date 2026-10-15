# Generate Parentheses

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | constrained string building |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #22 — https://leetcode.com/problems/generate-parentheses/ |
| **Solution file** | [09_generate_parentheses.js](../solutions/09_generate_parentheses.js) — open only after a real attempt |

## Problem

Given n pairs of parentheses, generate all strings of well-formed parentheses.

## Examples

```
Input: n = 3   Output: ["((()))","(()())","(())()","()(())","()()()"]
Input: n = 1   Output: ["()"]
```

## Constraints & clarifying questions

```
- 1 <= n <= 8. The count is the Catalan number C(n): 1, 2, 5, 14, 42, 132, 429, 1430
- Only one bracket type
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *constrained string building* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^(2n) * n) time. Generate every string of length 2n made of '(' and ')' (2^(2n) of them), keep the valid ones (check with a counter).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking with pruning rules)   O(C(n) * n) time, O(n) stack. Build the string left to right, tracking how many '(' and ')' are used: - may add '(' if open &lt; n           (still have openers left) - may add ')' if close &lt; open       (never close more than we opened) These two rules mean we NEVER generate an invalid prefix

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> [""]
- n = 1 -> ["()"]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^(2n) * n) time

```
Generate every string of length 2n made of '(' and ')' (2^(2n) of them), keep the
valid ones (check with a counter). For n=3 that is 64 candidates for 5 answers;
for n=8, 65,536 candidates for 1,430 answers.
```

### APPROACH 2 — Optimal (Backtracking with pruning rules)   O(C(n) * n) time, O(n) stack

```
Build the string left to right, tracking how many '(' and ')' are used:
  - may add '(' if open < n           (still have openers left)
  - may add ')' if close < open       (never close more than we opened)
These two rules mean we NEVER generate an invalid prefix, so every leaf is an answer.

Dry run n=2:
  ""  open=0 close=0
  "(" open=1 close=0
    "((" open=2 close=0 -> only ')' allowed -> "(()" -> "(())" record
    "()" open=1 close=1 -> "()(" -> "()()" record
```

### Edge cases

```
- n = 0 -> [""]
- n = 1 -> ["()"]
```

Full JavaScript solution with tests: [09_generate_parentheses.js](../solutions/09_generate_parentheses.js). Run it with `node 09_generate_parentheses.js` from the solutions folder.

</details>

## Common mistakes

- Generating all 2^(2n) strings and validating each instead of pruning with open/close counts.
- Allowing a `)` when `close >= open`, which creates invalid prefixes like `())`.
- Allowing more than n opening brackets.

## Related follow-ups

- [Valid Parentheses](../../../16_Stacks/03_Problems/01_Easy/01_valid_parentheses.md) (16_Stacks)
- [Letter Combinations of a Phone Number](08_letter_combinations_phone.md)
- Remove Invalid Parentheses (LeetCode #301)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
