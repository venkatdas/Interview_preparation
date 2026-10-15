# Valid Palindrome

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Easy |
| **Pattern** | two pointers, filtering |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #125 — https://leetcode.com/problems/valid-palindrome/ |
| **Solution file** | [02_valid_palindrome.js](../solutions/02_valid_palindrome.js) — open only after a real attempt |

## Problem

A phrase is a palindrome if, after converting all uppercase letters to lowercase and
removing every character that is not a letter or digit, it reads the same forwards and
backwards. Return true if the given string is a palindrome.

## Examples

```
Input: "A man, a plan, a canal: Panama"   Output: true   Explanation: "amanaplanacanalpanama"
Input: "race a car"                        Output: false  Explanation: "raceacar" is not a palindrome
Input: " "                                 Output: true   Explanation: nothing left -> empty string is a palindrome
```

## Constraints & clarifying questions

```
- Which characters count? (letters and digits only, case-insensitive)
- Is an empty string a palindrome? (yes)
- ASCII only? (assume yes; makes the "is alphanumeric" check a simple code range test)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two pointers, filtering* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Build a cleaned string (lowercase, alphanumeric only), reverse it, compare with ===.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers)   O(n) time, O(1) space. left starts at 0, right at n-1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""  or only punctuation  -> true
- single character          -> true
- digits mixed in: "0P"     -> false ('0' !== 'p'), do not lowercase-compare digits wrongly
- uppercase vs lowercase    -> must compare case-insensitively
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Build a cleaned string (lowercase, alphanumeric only), reverse it, compare with ===.
Simple and fine in practice; the "waste" is the two extra strings.
```

### APPROACH 2 — Optimal (two pointers)   O(n) time, O(1) space

```
left starts at 0, right at n-1. Skip non-alphanumeric characters on each side, then
compare the lowercased characters. Mismatch -> false. Pointers cross -> true.

Dry run on "A man, a plan":   (shortened to show the skipping)
  left='A' right='n'  compare a vs n -> false
Dry run on "a.b,a":
  left=0 'a'   right=4 'a'   equal, move in
  left=1 '.'   skip -> left=2 'b'
  right=3 ','  skip -> right=2
  left is not < right -> true
```

### Edge cases

```
- ""  or only punctuation  -> true
- single character          -> true
- digits mixed in: "0P"     -> false ('0' !== 'p'), do not lowercase-compare digits wrongly
- uppercase vs lowercase    -> must compare case-insensitively
```

Full JavaScript solution with tests: [02_valid_palindrome.js](../solutions/02_valid_palindrome.js). Run it with `node 02_valid_palindrome.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to lower-case before comparing, so "A" and "a" do not match.
- Treating digits as non-alphanumeric; digits must be kept.
- Skipping non-alphanumerics with `while` loops that run past the other pointer (missing the `left < right` guard).

## Related follow-ups

- [Valid Palindrome II](../../../06_Two_Pointers/03_Problems/01_Easy/02_valid_palindrome_ii.md) — allow deleting one character
- [Palindrome Number](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/01_Easy/01_palindrome_number.md) — the same check on digits without a string
- [Palindrome Linked List](../../../15_Linked_Lists/03_Problems/01_Easy/07_palindrome_linked_list.md) — palindrome check without random access

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
