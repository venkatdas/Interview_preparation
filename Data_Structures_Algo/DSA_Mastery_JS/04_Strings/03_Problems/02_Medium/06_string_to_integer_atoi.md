# String to Integer

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | parsing state machine |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #8 — https://leetcode.com/problems/string-to-integer-atoi/ |
| **Solution file** | [06_string_to_integer_atoi.js](../solutions/06_string_to_integer_atoi.js) — open only after a real attempt |

## Problem

Convert a string to a 32-bit signed integer following these rules:
  1. Ignore leading whitespace.
  2. An optional '+' or '-' sets the sign.
  3. Read digits until a non-digit (or the end). No digits -> 0.
  4. Clamp the result into [-2^31, 2^31 - 1] = [-2147483648, 2147483647].

## Examples

```
Input: "42"            Output: 42
Input: "   -042"       Output: -42      Explanation: whitespace skipped, leading zeros fine
Input: "1337c0d3"      Output: 1337     Explanation: stop at 'c'
Input: "words 987"     Output: 0        Explanation: first non-space char is not a sign/digit
Input: "-91283472332"  Output: -2147483648   Explanation: clamped
```

## Constraints & clarifying questions

```
- Which whitespace? (only ' ' on LeetCode)
- "+-12" ? (second char is not a digit -> 0)
- Is "  +0 123" 0? (yes, stop at the space)
- Clamp or throw on overflow? (clamp)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *parsing state machine* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Use a regex to grab the leading "optional sign + digits" after trimming, parseInt it, then clamp with Math.min/Math.max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (parsing state machine)   O(n) time, O(1) space. One index walks the string through four states: skip spaces -> read sign -> accumulate digits (result = result * 10 + digit) -> stop.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""  or "   "        -> 0
- "-"  or "+"         -> 0 (careful: -1 * 0 is -0 in JS, strictEqual treats it as different)
- "0000000000012"     -> 12
- "2147483648"        -> 2147483647 (clamped)
- "-2147483649"       -> -2147483648 (clamped)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Use a regex to grab the leading "optional sign + digits" after trimming, parseInt it,
then clamp with Math.min/Math.max. Short, but interviewers usually want the manual
state machine because parseInt hides every edge case.
```

### APPROACH 2 — Optimal (parsing state machine)   O(n) time, O(1) space

```
One index walks the string through four states:
  skip spaces -> read sign -> accumulate digits (result = result * 10 + digit) -> stop.
Clamp inside the digit loop (or at the end; JS numbers do not overflow at 2^31, so
clamping once at the end is safe as long as the input length is reasonable).

Dry run on "   -042":
  i=0..2 spaces skipped, i=3 '-' -> sign=-1, i=4
  '0' result=0, '4' result=4, '2' result=42, end
  return -1 * 42 = -42
```

### Edge cases

```
- ""  or "   "        -> 0
- "-"  or "+"         -> 0 (careful: -1 * 0 is -0 in JS, strictEqual treats it as different)
- "0000000000012"     -> 12
- "2147483648"        -> 2147483647 (clamped)
- "-2147483649"       -> -2147483648 (clamped)
```

Full JavaScript solution with tests: [06_string_to_integer_atoi.js](../solutions/06_string_to_integer_atoi.js). Run it with `node 06_string_to_integer_atoi.js` from the solutions folder.

</details>

## Common mistakes

- Using `parseInt` and calling it done; interviewers expect the manual state machine and explicit clamping.
- Skipping all whitespace, not just the leading spaces, or accepting a second sign like "+-12".
- Clamping only after the loop; with very long digit strings the number becomes imprecise, so clamp as you go.

## Related follow-ups

- [Reverse Integer](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/02_Medium/02_reverse_integer.md) — 32-bit overflow checks on digits
- [Roman to Integer & Integer to Roman](../01_Easy/15_roman_to_integer_and_integer_to_roman.md) — another parsing problem
- Valid Number (LeetCode #65) — the full state-machine version

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
