# Repeated String Match

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Medium |
| **Pattern** | bound copies + KMP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #686 — https://leetcode.com/problems/repeated-string-match/ |
| **Solution file** | [03_repeated_string_match.js](../solutions/03_repeated_string_match.js) — open only after a real attempt |

## Problem

Return the minimum number of times you must repeat string a so that b is a substring
of the result, or -1 if that is impossible.

## Examples

```
Input: a = "abcd", b = "cdabcdab"   Output: 3   ("abcdabcdabcd" contains b; 2 copies do not)
Input: a = "a", b = "aa"            Output: 2
Input: a = "abc", b = "wxyz"        Output: -1
```

## Constraints & clarifying questions

```
- Lengths up to 10^4
- b non-empty
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bound copies + KMP* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O((n + m) * m) worst case. Keep appending a until the length is >= m + n, checking includes() after each append.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bound the repeat count, then KMP)   O(n + m) time. How many copies could ever be needed?

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- b shorter than a and inside a -> 1
- b made of characters not in a -> -1
- a === b -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((n + m) * m) worst case

```
Keep appending a until the length is >= m + n, checking includes() after each append.
```

### APPROACH 2 — Optimal (bound the repeat count, then KMP)   O(n + m) time

```
How many copies could ever be needed? b must fit: at least ceil(m / n) copies. One more
copy can be needed when b starts in the middle of a copy. If b is not in a repeated
ceil(m / n) + 1 times, adding more copies cannot help (the extra text is out of b's
reach). So test k = ceil(m / n) and k + 1 with KMP.

Dry run: a = "abcd", b = "cdabcdab": n = 4, m = 8, k = 2
  "abcdabcd" contains "cdabcdab"? no (would need 'ab' after position 6)
  k + 1 = 3: "abcdabcdabcd" -> b found at index 2 -> 3
```

### Edge cases

```
- b shorter than a and inside a -> 1
- b made of characters not in a -> -1
- a === b -> 1
```

Full JavaScript solution with tests: [03_repeated_string_match.js](../solutions/03_repeated_string_match.js). Run it with `node 03_repeated_string_match.js` from the solutions folder.

</details>

## Common mistakes

- Stopping at `ceil(|b| / |a|)` copies; a match can start in the middle of a copy, so one extra copy is needed.
- Looping "until it fits" with no upper bound, which never terminates when the answer is -1.
- Using `includes` on a huge repeated string inside a loop, giving O(k * n * m) work.

## Related follow-ups

- [Find the Index of the First Occurrence](../01_Easy/01_find_index_of_first_occurrence.md)
- [Repeated Substring Pattern](../01_Easy/02_repeated_substring_pattern.md)
- Rotate String (LeetCode #796)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
