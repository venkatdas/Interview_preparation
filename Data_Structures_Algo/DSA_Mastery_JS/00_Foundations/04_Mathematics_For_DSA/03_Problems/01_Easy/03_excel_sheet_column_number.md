# Excel Sheet Column Number & Column Title

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Easy |
| **Pattern** | base conversion (bijective base 26) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #171 — https://leetcode.com/problems/excel-sheet-column-number/; LeetCode #168 — https://leetcode.com/problems/excel-sheet-column-title/ |
| **Solution file** | [03_excel_sheet_column_number.js](../solutions/03_excel_sheet_column_number.js) — open only after a real attempt |

## Problem

Excel names columns A, B, ..., Z, AA, AB, ..., ZZ, AAA, ...
171: given a title like "AB", return its number (28).
168: given a number like 28, return its title ("AB").

## Examples

```
Input: "A"    Output: 1
Input: "Z"    Output: 26
Input: "AA"   Output: 27     Explanation: 1 * 26 + 1
Input: "ZY"   Output: 701    Explanation: 26 * 26 + 25
Input: 701    Output: "ZY"
```

## Constraints & clarifying questions

```
- Only uppercase A-Z? (yes)
- Max length? (7 letters, fits in 32-bit)
- Is there a "zero" letter? (no: this is bijective base 26, digits are 1..26)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *base conversion (bijective base 26)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (count up)   O(26^k) time. Generate titles in order A, B, ..., Z, AA, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (base conversion without a zero digit)   O(k) time, O(1) space. Title -> number: like reading a base-26 number, value = value * 26 + (ch - 'A' + 1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "Z" -> 26 and 26 -> "Z" (the -1 shift is what makes this work; without it 26 -> "A0")
- 52 -> "AZ", 53 -> "BA"
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (count up)   O(26^k) time

```
Generate titles in order A, B, ..., Z, AA, ... until you reach the target. Correct but
exponential in the title length; useful only as a mental model.
```

### APPROACH 2 — Optimal (base conversion without a zero digit)   O(k) time, O(1) space

```
Title -> number: like reading a base-26 number, value = value * 26 + (ch - 'A' + 1).
Number -> title: like converting to base 26, but digits run 1..26 instead of 0..25, so
subtract 1 before taking % 26 and before dividing. That shift is the whole trick.

Dry run title "ZY":
  'Z': value = 0 * 26 + 26 = 26
  'Y': value = 26 * 26 + 25 = 701
Dry run number 701:
  n=701: n-1=700, 700 % 26 = 24 -> 'Y',  n = floor(700 / 26) = 26
  n=26:  n-1=25,  25 % 26 = 25  -> 'Z',  n = floor(25 / 26) = 0
  reversed: "ZY"
```

### Edge cases

```
- "Z" -> 26 and 26 -> "Z" (the -1 shift is what makes this work; without it 26 -> "A0")
- 52 -> "AZ", 53 -> "BA"
```

Full JavaScript solution with tests: [03_excel_sheet_column_number.js](../solutions/03_excel_sheet_column_number.js). Run it with `node 03_excel_sheet_column_number.js` from the solutions folder.

</details>

## Common mistakes

- Treating the system as base 26 with digits 0..25; it has no zero (A = 1, Z = 26).
- For column title, forgetting to subtract 1 before `% 26`, so 26 becomes "A@" instead of "Z".
- Building the title in reverse and forgetting to reverse it.

## Related follow-ups

- [Roman to Integer & Integer to Roman](../../../../04_Strings/03_Problems/01_Easy/15_roman_to_integer_and_integer_to_roman.md) — another numeral system
- [Add Digits](04_add_digits.md) — digit arithmetic
- Convert a Number to Hexadecimal (LeetCode #405) — standard base conversion

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
