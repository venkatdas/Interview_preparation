# Valid Palindrome II

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | opposite ends, one skip |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #680 — https://leetcode.com/problems/valid-palindrome-ii/ |
| **Solution file** | [02_valid_palindrome_ii.js](../solutions/02_valid_palindrome_ii.js) — open only after a real attempt |

## Problem

Given a string s, return true if it can be a palindrome after deleting AT MOST one character.

## Examples

```
Input: "aba"    Output: true    Explanation: already a palindrome
Input: "abca"   Output: true    Explanation: delete 'c' -> "aba"
Input: "abc"    Output: false
```

## Constraints & clarifying questions

```
- Lowercase only? (yes on LeetCode; the algorithm doesn't care)
- "At most one" includes zero deletions? (yes)
- Empty / single char? (true)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *opposite ends, one skip* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. Try deleting each index (plus deleting nothing) and check if the result is a palindrome.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (opposite ends with one allowed skip)   O(n) time, O(1) space. Walk left and right inward while characters match.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Already a palindrome -> true (no deletion needed)
- Length <= 2 -> always true (delete one, one char remains)
- Mismatch where only the right-skip works: "cbbcc" -> skip last... see tests
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
Try deleting each index (plus deleting nothing) and check if the result is a palindrome.
n + 1 candidates, each O(n) to check.
```

### APPROACH 2 — Optimal (opposite ends with one allowed skip)   O(n) time, O(1) space

```
Walk left and right inward while characters match. At the FIRST mismatch we have exactly
two options: delete s[left] or delete s[right]. Check whether the remaining inner range
is a plain palindrome for either option. There is no third choice because any earlier
character already matched its partner and deleting it would break that match.

Dry run on "abca":
  left=0 'a' right=3 'a' match -> left=1, right=2
  left=1 'b' right=2 'c' mismatch
    skip left: check s[2..2] = "c" -> palindrome -> true

Dry run on "abc":
  left=0 'a' right=2 'c' mismatch
    skip left:  s[1..2] = "bc" -> no
    skip right: s[0..1] = "ab" -> no  -> false
```

### Edge cases

```
- Already a palindrome -> true (no deletion needed)
- Length <= 2 -> always true (delete one, one char remains)
- Mismatch where only the right-skip works: "cbbcc" -> skip last... see tests
```

Full JavaScript solution with tests: [02_valid_palindrome_ii.js](../solutions/02_valid_palindrome_ii.js). Run it with `node 02_valid_palindrome_ii.js` from the solutions folder.

</details>

## Common mistakes

- Deleting the left character only; on a mismatch you must try skipping left *and* skipping right.
- Allowing more than one deletion by recursing again inside the helper.
- Building new substrings for each check (extra O(n) copies) instead of checking index ranges.

## Related follow-ups

- [Valid Palindrome](../../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md) — no deletions allowed
- Valid Palindrome III (LeetCode #1216) — up to k deletions, needs DP
- [Longest Palindromic Substring](../../../04_Strings/03_Problems/02_Medium/07_longest_palindromic_substring.md) — expand around centers

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
