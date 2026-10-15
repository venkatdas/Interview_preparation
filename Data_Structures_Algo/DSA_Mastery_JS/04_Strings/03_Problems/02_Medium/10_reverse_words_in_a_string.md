# Reverse Words in a String

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | split / reverse / join, two pointers |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #151 — https://leetcode.com/problems/reverse-words-in-a-string/ |
| **Solution file** | [10_reverse_words_in_a_string.js](../solutions/10_reverse_words_in_a_string.js) — open only after a real attempt |

## Problem

Given a string of words separated by spaces, return the words in reverse order,
joined by a single space. Leading/trailing spaces are removed and multiple spaces
between words collapse to one.

## Examples

```
Input: "the sky is blue"       Output: "blue is sky the"
Input: "  hello world  "       Output: "world hello"   Explanation: outer spaces dropped
Input: "a good   example"      Output: "example good a"   Explanation: inner spaces collapsed
```

## Constraints & clarifying questions

```
- Only ' ' as whitespace, or tabs too? (assume ' ')
- Can I use split/join? (usually yes; the follow-up is "do it in place on a char array")
- Is the string guaranteed to have at least one word? (yes on LeetCode; handle "" anyway)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *split / reverse / join, two pointers* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. s.trim().split(/\s+/).reverse().join(' ').

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two-pointer word scan, build from the end)   O(n) time, O(n) space. Walk from the END of the string.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""  or "   "       -> ""
- "hello"            -> "hello" (single word)
- tabs / other whitespace if the interviewer allows them (use /\s/ test)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
s.trim().split(/\s+/).reverse().join(' '). One line, and honestly fine in JS.
The interviewer will then ask how you would do it without the built-ins.
```

### APPROACH 2 — Optimal (two-pointer word scan, build from the end)   O(n) time, O(n) space

```
Walk from the END of the string. Skip spaces to find the end of a word, then walk
left to find its start. Push that word into an output array. Repeat. The output
naturally comes out in reversed word order. (True O(1) extra space is only possible
on a mutable char array: reverse the whole array, then reverse each word.)

Dry run on "  hello world  " (walking from the right):
  right=14 ' ' skip, 13 ' ' skip, 12 'd' -> wordEnd=12
  move left while not space: left stops at 6 (' ') -> word = s.slice(7, 13) = "world"
  continue: right=6 ' ' skip, 5 'o' -> wordEnd=5, left stops at 1 -> "hello"
  right=1 ' ', 0 ' ', done -> ["world","hello"].join(' ')
```

### Edge cases

```
- ""  or "   "       -> ""
- "hello"            -> "hello" (single word)
- tabs / other whitespace if the interviewer allows them (use /\s/ test)
```

Full JavaScript solution with tests: [10_reverse_words_in_a_string.js](../solutions/10_reverse_words_in_a_string.js). Run it with `node 10_reverse_words_in_a_string.js` from the solutions folder.

</details>

## Common mistakes

- Splitting on a single space, which produces empty words for repeated spaces.
- Leaving leading or trailing spaces in the output.
- Claiming O(1) space in JavaScript; strings are immutable, so any approach builds new storage.

## Related follow-ups

- [Reverse String](../01_Easy/01_reverse_string.md) — the in-place building block
- [Rotate Array](../../../03_Arrays/03_Problems/02_Medium/07_rotate_array.md) — reverse whole, then reverse parts
- Reverse Words in a String III (LeetCode #557) — reverse each word but keep order

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
