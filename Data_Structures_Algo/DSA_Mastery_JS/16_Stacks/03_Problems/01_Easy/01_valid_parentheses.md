# Valid Parentheses

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Easy |
| **Pattern** | matching |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #20 — https://leetcode.com/problems/valid-parentheses/ |
| **Solution file** | [01_valid_parentheses.js](../solutions/01_valid_parentheses.js) — open only after a real attempt |

## Problem

Given a string containing only the characters '(', ')', '{', '}', '[', ']',
return true if every opening bracket is closed by the same type of bracket,
in the correct order.

## Examples

```
Input: "()[]{}"   Output: true
Input: "([)]"     Output: false   Explanation: ']' closes '[' but '(' is still open inside
Input: "{[]}"     Output: true
Input: "("        Output: false   Explanation: never closed
```

## Constraints & clarifying questions

```
- Can the string be empty? (yes -> return true)
- Only bracket characters, or other characters too? (assume only brackets)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *matching* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. Repeatedly delete any adjacent pair "()", "[]", "{}" from the string until nothing changes.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Stack)   O(n) time, O(n) space. Walk the string once: - opening bracket  -> push it (we'll need to match it later) - closing bracket  -> the MOST RECENT unmatched opener must match it, and the most recent thing is exactly the top of a stack.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""            -> true
- ")"           -> false (pop from empty stack -> undefined !== '(')
- odd length    -> always false (quick early exit)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
Repeatedly delete any adjacent pair "()", "[]", "{}" from the string until nothing
changes. If the string becomes empty it was valid. Each pass is O(n) and there can
be up to n/2 passes.
```

### APPROACH 2 — Optimal (Stack)   O(n) time, O(n) space

```
Walk the string once:
  - opening bracket  -> push it (we'll need to match it later)
  - closing bracket  -> the MOST RECENT unmatched opener must match it, and the most
                        recent thing is exactly the top of a stack. Pop and compare.
At the end the stack must be empty (no openers left unmatched).

Dry run on "{[]}":
  '{' push          stack = ['{']
  '[' push          stack = ['{', '[']
  ']' pop '[' ok    stack = ['{']
  '}' pop '{' ok    stack = []
  end, empty -> true

Dry run on "([)]":
  '(' push          stack = ['(']
  '[' push          stack = ['(', '[']
  ')' pop '[' != '(' -> false
```

### Edge cases

```
- ""            -> true
- ")"           -> false (pop from empty stack -> undefined !== '(')
- odd length    -> always false (quick early exit)
```

Full JavaScript solution with tests: [01_valid_parentheses.js](../solutions/01_valid_parentheses.js). Run it with `node 01_valid_parentheses.js` from the solutions folder.

</details>

## Common mistakes

- Returning `true` without checking the stack is empty at the end.
- Popping from an empty stack and comparing `undefined` without thinking about it (works, but know why).
- Using a counter per bracket type, which accepts interleaved invalid strings like `([)]`.

## Related follow-ups

- [Generate Parentheses](../../../13_Backtracking/03_Problems/02_Medium/09_generate_parentheses.md) (13_Backtracking)
- [Decode String](../02_Medium/08_decode_string.md)
- Minimum Remove to Make Valid Parentheses (LeetCode #1249)
- Longest Valid Parentheses (LeetCode #32)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
