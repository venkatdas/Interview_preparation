# Reverse String

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Easy |
| **Pattern** | two pointers, in place |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #344 — https://leetcode.com/problems/reverse-string/ |
| **Solution file** | [01_reverse_string.js](../solutions/01_reverse_string.js) — open only after a real attempt |

## Problem

You are given an array of characters. Reverse it IN PLACE (modify the array you were
given, do not return a new one) using O(1) extra memory.

## Examples

```
Input: ['h','e','l','l','o']   Output: ['o','l','l','e','h']
Input: ['H','a','n','n','a','h']   Output: ['h','a','n','n','a','H']
```

## Constraints & clarifying questions

```
- Is the input a string or an array of characters? (array; strings are immutable in JS,
  so a real string could not be reversed in place at all)
- Can it be empty? (yes -> nothing to do)
- Do I need to return it? (LeetCode says no, but returning it makes testing easier)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two pointers, in place* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Copy the array, then write it back from the end: chars[i] = copy[n - 1 - i].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers)   O(n) time, O(1) space. Put one pointer at the start and one at the end.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- []          -> []  (loop never runs)
- ['a']       -> ['a']
- even length -> pointers cross; odd length -> pointers meet on the middle char
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Copy the array, then write it back from the end: chars[i] = copy[n - 1 - i].
Correct, but uses an extra array, which the problem forbids.
```

### APPROACH 2 — Optimal (two pointers)   O(n) time, O(1) space

```
Put one pointer at the start and one at the end. Swap the two characters, move both
pointers toward the middle, stop when they meet or cross. Every character is visited once.

Dry run on ['h','e','l','l','o']:
  left=0 right=4  swap h,o   -> ['o','e','l','l','h']
  left=1 right=3  swap e,l   -> ['o','l','l','e','h']
  left=2 right=2  left is not < right, stop
```

### Edge cases

```
- []          -> []  (loop never runs)
- ['a']       -> ['a']
- even length -> pointers cross; odd length -> pointers meet on the middle char
```

Full JavaScript solution with tests: [01_reverse_string.js](../solutions/01_reverse_string.js). Run it with `node 01_reverse_string.js` from the solutions folder.

</details>

## Common mistakes

- Calling `s.reverse()` on a string; strings are immutable and have no `reverse`. The input here is a char array to change in place.
- Looping `i < n` instead of `i < n / 2`, which swaps everything twice and leaves the array unchanged.
- Returning a new array instead of modifying the given one.

## Related follow-ups

- [Reverse String & Reverse Vowels of a String](../../../06_Two_Pointers/03_Problems/01_Easy/01_reverse_string_and_vowels.md) — swap only selected characters
- [Valid Palindrome](02_valid_palindrome.md) — the same two pointers, comparing instead of swapping
- [Reverse Words in a String](../02_Medium/10_reverse_words_in_a_string.md) — reverse at word granularity

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
