# Reverse String & Reverse Vowels of a String

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | opposite ends, swap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #344 — https://leetcode.com/problems/reverse-string/; LeetCode #345 — https://leetcode.com/problems/reverse-vowels-of-a-string/ |
| **Solution file** | [01_reverse_string_and_vowels.js](../solutions/01_reverse_string_and_vowels.js) — open only after a real attempt |

## Problem

(a) Reverse String: given an array of characters, reverse it IN PLACE with O(1) extra memory.
(b) Reverse Vowels: given a string, reverse only the vowels (a, e, i, o, u, any case)
    and leave every other character where it is.

## Examples

```
(a) Input: ["h","e","l","l","o"]   Output: ["o","l","l","e","h"]
(b) Input: "hello"                  Output: "holle"
(b) Input: "leetcode"               Output: "leotcede"
```

## Constraints & clarifying questions

```
- Must it be in place? (yes for 344; strings are immutable in JS so 345 builds an array)
- Are uppercase vowels vowels? (yes: "aA" -> "Aa")
- Is 'y' a vowel? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *opposite ends, swap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. (a) Build a new array by reading from the end.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (opposite-end pointers, swap)   O(n) time, O(1) extra space. (a) left = 0, right = n - 1; swap, move both inward, stop when they cross.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty string / array
- No vowels at all -> unchanged
- One vowel -> unchanged
- Odd length: middle element stays
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
(a) Build a new array by reading from the end. (b) Collect the vowels into a list,
then walk the string again and hand them out in reverse order. Both use extra space.
```

### APPROACH 2 — Optimal (opposite-end pointers, swap)   O(n) time, O(1) extra space

```
(a) left = 0, right = n - 1; swap, move both inward, stop when they cross.
(b) Same, but each pointer first SKIPS forward/backward until it is on a vowel.
    Then swap the two vowels and move both.

Dry run (b) on "hello":
  left=0 'h' not vowel -> left=1 'e'
  right=4 'o' vowel
  swap -> "hollo"? no: swap positions 1 and 4: h,o,l,l,e -> "holle"
  left=2, right=3: 'l','l' both skipped, pointers cross -> done
```

### Edge cases

```
- Empty string / array
- No vowels at all -> unchanged
- One vowel -> unchanged
- Odd length: middle element stays
```

Full JavaScript solution with tests: [01_reverse_string_and_vowels.js](../solutions/01_reverse_string_and_vowels.js). Run it with `node 01_reverse_string_and_vowels.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting uppercase vowels ("A", "E", ...).
- In the vowel version, moving both pointers each step even when only one side is on a vowel.
- Trying to swap characters inside a JS string; convert to an array first and join at the end.

## Related follow-ups

- [Reverse String (Strings)](../../../04_Strings/03_Problems/01_Easy/01_reverse_string.md) — the plain reversal
- [Valid Palindrome](../../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md) — skip-and-compare with the same pointers
- Reverse Only Letters (LeetCode #917) — skip non-letters instead of non-vowels

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
