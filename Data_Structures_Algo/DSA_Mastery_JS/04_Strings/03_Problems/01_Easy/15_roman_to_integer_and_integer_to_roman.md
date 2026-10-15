# Roman to Integer & Integer to Roman

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Easy |
| **Pattern** | parsing, greedy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #13 — https://leetcode.com/problems/roman-to-integer/; LeetCode #12 — https://leetcode.com/problems/integer-to-roman/ |
| **Solution file** | [15_roman_to_integer_and_integer_to_roman.js](../solutions/15_roman_to_integer_and_integer_to_roman.js) — open only after a real attempt |

## Problem

Roman numerals use seven symbols: I=1 V=5 X=10 L=50 C=100 D=500 M=1000.
Symbols are written largest to smallest and added up, EXCEPT six subtractive pairs:
IV=4 IX=9 XL=40 XC=90 CD=400 CM=900 (a smaller symbol before a larger one is subtracted).
  Part A (LC 13): given a valid roman numeral string, return its integer value.
  Part B (LC 12): given an integer 1..3999, return its roman numeral.

## Examples

```
Input: "III"       Output: 3
Input: "LVIII"     Output: 58     Explanation: L=50, V=5, III=3
Input: "MCMXCIV"   Output: 1994   Explanation: M=1000, CM=900, XC=90, IV=4
Input: 58          Output: "LVIII"
Input: 1994        Output: "MCMXCIV"
```

## Constraints & clarifying questions

```
- Is the input always a valid numeral in [1, 3999]? (yes; no validation needed)
- Uppercase only? (yes)
- Should intToRoman produce the canonical form ("IV", never "IIII")? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *parsing, greedy* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(1) space. romanToInt: scan left to right, and whenever the current two characters form one of the six subtractive pairs (looked up in a map), take the pair's value and skip two chars.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal. romanToInt (look-ahead comparison)   O(n) time, O(1) space For each symbol: if its value is SMALLER than the next symbol's value, subtract it, otherwise add it.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single symbol "I" -> 1, "M" -> 1000
- all subtractive: "CDXLIV" -> 444
- 3999 -> "MMMCMXCIX" (longest output)
- 4 -> "IV", not "IIII"
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(1) space

```
romanToInt: scan left to right, and whenever the current two characters form one of the
six subtractive pairs (looked up in a map), take the pair's value and skip two chars.
intToRoman: for each of the 13 values (1000, 900, ..., 4, 1), repeatedly subtract while
it fits and append its symbol. Both are already efficient; the "optimal" versions are
just the cleaner one-pass formulations.
```

### APPROACH 2 — Optimal

```
romanToInt (look-ahead comparison)   O(n) time, O(1) space
  For each symbol: if its value is SMALLER than the next symbol's value, subtract it,
  otherwise add it. That single rule covers all six subtractive pairs without a table.
  intToRoman (greedy table)   O(1) time, O(1) space (output length <= 15)
  Greedy works because the 13 values include the subtractive pairs, so the largest
  value that fits is always the canonical choice.

Dry run romanToInt("MCMXCIV"):
  M(1000) next C(100)  -> 1000 >= 100 add      total 1000
  C(100)  next M(1000) -> 100 < 1000 subtract  total 900
  M(1000) next X(10)   -> add                  total 1900
  X(10)   next C(100)  -> subtract             total 1890
  C(100)  next I(1)    -> add                  total 1990
  I(1)    next V(5)    -> subtract             total 1989
  V(5)    last         -> add                  total 1994

Dry run intToRoman(1994):
  1000 fits -> "M", 994 left; 900 fits -> "CM", 94; 90 fits -> "XC", 4; 4 fits -> "IV", 0
  "MCMXCIV"
```

### Edge cases

```
- single symbol "I" -> 1, "M" -> 1000
- all subtractive: "CDXLIV" -> 444
- 3999 -> "MMMCMXCIX" (longest output)
- 4 -> "IV", not "IIII"
```

Full JavaScript solution with tests: [15_roman_to_integer_and_integer_to_roman.js](../solutions/15_roman_to_integer_and_integer_to_roman.js). Run it with `node 15_roman_to_integer_and_integer_to_roman.js` from the solutions folder.

</details>

## Common mistakes

- Roman to integer: forgetting the subtractive rule (a smaller symbol before a larger one is subtracted, as in IV or CM).
- Integer to Roman: building the value table without the six subtractive pairs (900, 400, 90, 40, 9, 4), which produces "IIII".
- Iterating the table in the wrong order; greedy only works from the largest value down.

## Related follow-ups

- [Excel Sheet Column Number & Column Title](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/01_Easy/03_excel_sheet_column_number.md) — another base-conversion pair
- [String to Integer](../02_Medium/06_string_to_integer_atoi.md) — parsing numbers from text
- Integer to English Words (LeetCode #273) — a harder number-to-text conversion

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
