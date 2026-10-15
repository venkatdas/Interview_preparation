# Letter Combinations of a Phone Number

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | build string position by position |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #17 — https://leetcode.com/problems/letter-combinations-of-a-phone-number/ |
| **Solution file** | [08_letter_combinations_phone.js](../solutions/08_letter_combinations_phone.js) — open only after a real attempt |

## Problem

Given a string of digits 2-9, return all letter combinations the number could
represent on an old phone keypad (2 = abc, 3 = def, ..., 9 = wxyz).

## Examples

```
Input: "23"   Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
Input: ""     Output: []
Input: "2"    Output: ["a","b","c"]
```

## Constraints & clarifying questions

```
- Digits 0 and 1 have no letters; can they appear? (no, 2-9 only)
- Length <= 4, so at most 4^4 = 256 results
- Empty input returns [] not [""] (LeetCode's choice; ask!)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *build string position by position* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (iterative cartesian product)   O(4^n * n) time. Start with [""]; for each digit, replace the list with every existing string extended by every letter of that digit.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking, build string position by position)   O(4^n * n), O(n) stack. go(index, current): if index === digits.length, record current.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" -> []
- single digit -> its letters
- digits 7 and 9 have FOUR letters
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (iterative cartesian product)   O(4^n * n) time

```
Start with [""]; for each digit, replace the list with every existing string
extended by every letter of that digit. BFS-style, no recursion. Honestly this is
also a fine answer; it's listed as "brute" only because it is the non-recursive form.
```

### APPROACH 2 — Optimal (Backtracking, build string position by position)   O(4^n * n), O(n) stack

```
go(index, current): if index === digits.length, record current. Otherwise for every
letter of digits[index], recurse with current + letter. Strings are immutable in JS,
so `current + letter` is a new string: nothing to undo.

Dry run "23":
  go(0,"")
    'a' -> go(1,"a") -> 'd' "ad" record, 'e' "ae" record, 'f' "af" record
    'b' -> go(1,"b") -> "bd","be","bf"
    'c' -> go(1,"c") -> "cd","ce","cf"
```

### Edge cases

```
- "" -> []
- single digit -> its letters
- digits 7 and 9 have FOUR letters
```

Full JavaScript solution with tests: [08_letter_combinations_phone.js](../solutions/08_letter_combinations_phone.js). Run it with `node 08_letter_combinations_phone.js` from the solutions folder.

</details>

## Common mistakes

- Returning `[""]` for an empty input instead of `[]`.
- Hard-coding a loop depth for exactly 2 or 3 digits instead of recursing per digit.
- Wrong letters for 7 and 9 (they have four letters: pqrs, wxyz).

## Related follow-ups

- [Generate Parentheses](09_generate_parentheses.md)
- [Subsets](01_subsets.md)
- Letter Case Permutation (LeetCode #784)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
