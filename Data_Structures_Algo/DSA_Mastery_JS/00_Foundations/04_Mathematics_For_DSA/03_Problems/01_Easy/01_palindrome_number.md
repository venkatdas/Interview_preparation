# Palindrome Number

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Easy |
| **Pattern** | digit reversal |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #9 — https://leetcode.com/problems/palindrome-number/ |
| **Solution file** | [01_palindrome_number.js](../solutions/01_palindrome_number.js) — open only after a real attempt |

## Problem

Given an integer x, return true if x reads the same forwards and backwards.

## Examples

```
Input: 121    Output: true
Input: -121   Output: false   Explanation: reads "121-" backwards, the minus breaks it
Input: 10     Output: false   Explanation: "01" is not "10"
Input: 0      Output: true
```

## Constraints & clarifying questions

```
- Are negative numbers ever palindromes? (no, by definition here)
- Can I convert to a string? (allowed, but the follow-up asks for no string conversion)
- Range: 32-bit signed integer
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *digit reversal* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (string)   O(d) time, O(d) space, d = number of digits. Convert to a string, reverse it, compare.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (reverse half the digits)   O(d) time, O(1) space. Reverse digits from the right into a new number until the reversed part is >= what is left.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- negative           -> false
- ends with 0 (10, 100) but not 0 itself -> false (a leading zero is impossible)
- single digit       -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (string)   O(d) time, O(d) space, d = number of digits

```
Convert to a string, reverse it, compare. Simple but allocates two strings.
```

### APPROACH 2 — Optimal (reverse half the digits)   O(d) time, O(1) space

```
Reverse digits from the right into a new number until the reversed part is >= what is
left. Then the two halves must match (for odd length, drop the middle digit with / 10).
Reversing only half avoids overflow of the reversed number.

Dry run on 1221:
  x=1221 rev=0    -> rev=1,   x=122
  x=122  rev=1    -> rev=12,  x=12
  x=12   rev=12   stop (rev >= x)  -> x === rev -> true
Dry run on 12321:
  x=12321 rev=0   -> rev=1,   x=1232
  x=1232  rev=1   -> rev=12,  x=123
  x=123   rev=12  -> rev=123, x=12
  x=12    rev=123 stop -> x === Math.floor(rev / 10) (12 === 12) -> true
```

### Edge cases

```
- negative           -> false
- ends with 0 (10, 100) but not 0 itself -> false (a leading zero is impossible)
- single digit       -> true
```

Full JavaScript solution with tests: [01_palindrome_number.js](../solutions/01_palindrome_number.js). Run it with `node 01_palindrome_number.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that negative numbers are never palindromes.
- Reversing the whole number when reversing half is enough and avoids overflow concerns.
- Missing numbers ending in 0 (except 0 itself), which cannot be palindromes.

## Related follow-ups

- [Valid Palindrome](../../../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md) — the string version
- [Reverse Integer](../02_Medium/02_reverse_integer.md) — digit reversal with overflow checks
- [Palindrome Linked List](../../../../15_Linked_Lists/03_Problems/01_Easy/07_palindrome_linked_list.md) — reverse half, compare

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
