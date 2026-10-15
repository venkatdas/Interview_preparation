# Multiply Strings

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | digit-array arithmetic |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #43 — https://leetcode.com/problems/multiply-strings/ |
| **Solution file** | [14_multiply_strings.js](../solutions/14_multiply_strings.js) — open only after a real attempt |

## Problem

Given two non-negative integers as strings (possibly hundreds of digits long),
return their product as a string. You may NOT convert them to numbers directly
(Number() would lose precision past 2^53).

## Examples

```
Input: num1 = "2", num2 = "3"       Output: "6"
Input: num1 = "123", num2 = "456"   Output: "56088"
Input: num1 = "0", num2 = "52"      Output: "0"
```

## Constraints & clarifying questions

```
- No leading zeros except "0" itself? (yes)
- Negative numbers? (no)
- Can I use BigInt? (in real JS yes - BigInt(a) * BigInt(b) - but the interviewer wants
  the schoolbook algorithm; BigInt makes a great "brute force" sanity check)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *digit-array arithmetic* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * m) time, O(n + m) space. (String(BigInt(num1) * BigInt(num2))).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (schoolbook multiplication on a digit array)   O(n * m) time, O(n + m) space. The product of two numbers with n and m digits has at most n + m digits.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- either is "0"      -> "0" (short-circuit, otherwise we'd return "" after stripping)
- "1" x anything     -> that thing
- very long inputs   -> no overflow because each cell holds a single digit after carry
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * m) time, O(n + m) space

```
(String(BigInt(num1) * BigInt(num2))). Uses the language's arbitrary precision.
Correct and short, but it skips the point of the question.
```

### APPROACH 2 — Optimal (schoolbook multiplication on a digit array)   O(n * m) time, O(n + m) space

```
The product of two numbers with n and m digits has at most n + m digits.
Key insight: digit i of num1 (from the right) times digit j of num2 (from the right)
contributes to positions i + j (low) and i + j + 1 (high) of the result, counted from
the right. Use an array `result` of length n + m, add each product into it, carry as
you go, then strip leading zeros.
Indexing from the LEFT (as in the code): product of num1[i] and num2[j] lands at
positions [i + j, i + j + 1] of a result array indexed left to right.

Dry run on "12" x "34" (result length 4, indices 0..3):
  i=1 ('2'), j=1 ('4'): 8  -> pos 3: 8, carry 0                result [0,0,0,8]
  i=1 ('2'), j=0 ('3'): 6  -> pos 2: 6                         result [0,0,6,8]
  i=0 ('1'), j=1 ('4'): 4  -> pos 2: 6+4=10 -> 0, carry 1 to pos 1   [0,1,0,8]
  i=0 ('1'), j=0 ('3'): 3  -> pos 1: 1+3=4                     result [0,4,0,8]
  strip leading zero -> "408"  (12 * 34 = 408)
```

### Edge cases

```
- either is "0"      -> "0" (short-circuit, otherwise we'd return "" after stripping)
- "1" x anything     -> that thing
- very long inputs   -> no overflow because each cell holds a single digit after carry
```

Full JavaScript solution with tests: [14_multiply_strings.js](../solutions/14_multiply_strings.js). Run it with `node 14_multiply_strings.js` from the solutions folder.

</details>

## Common mistakes

- Converting to Number or BigInt, which the problem forbids (and Number loses precision past 2^53).
- Placing the digit product at the wrong index: digits i and j contribute to positions i + j and i + j + 1.
- Leaving leading zeros in the result, or returning "" instead of "0" when one input is "0".

## Related follow-ups

- Add Strings (LeetCode #415) — grade-school addition on strings
- Add Binary (LeetCode #67) — the same carry logic in base 2
- [Pow](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/02_Medium/06_pow_x_n.md) — another arithmetic-by-hand problem

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
