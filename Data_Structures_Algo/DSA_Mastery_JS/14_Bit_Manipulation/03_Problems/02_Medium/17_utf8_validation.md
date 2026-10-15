# UTF-8 Validation

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | leading-bit masks |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #393 — https://leetcode.com/problems/utf-8-validation/ |
| **Solution file** | [17_utf8_validation.js](../solutions/17_utf8_validation.js) — open only after a real attempt |

## Problem

data is an array of integers; only the lowest 8 bits of each matter (one byte each).
Return true if the bytes form a valid UTF-8 encoding. Rules:
  1-byte char : 0xxxxxxx
  2-byte char : 110xxxxx 10xxxxxx
  3-byte char : 1110xxxx 10xxxxxx 10xxxxxx
  4-byte char : 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
Every continuation byte must start with 10.

## Examples

```
Input: [197,130,1]       Output: true    Explanation: 11000101 10000010 | 00000001
Input: [235,140,4]       Output: false   Explanation: 11101011 says 3-byte, but 00000100 is not 10xxxxxx
```

## Constraints & clarifying questions

```
- Can integers be > 255? (yes; use only the low 8 bits: byte & 0xFF)
- Is an empty array valid? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *leading-bit masks* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (string prefixes)   O(n) time, O(8) space. Convert each byte to an 8-char binary string and use startsWith on '0', '110', '1110', '11110', '10'.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bit masks)   O(n) time, O(1) space. Keep `remaining` = number of continuation bytes still expected.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- starts with a continuation byte -> false
- truncated multi-byte char at the end -> false (remaining > 0)
- 11111xxx leading byte (5+ bytes) -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (string prefixes)   O(n) time, O(8) space

```
Convert each byte to an 8-char binary string and use startsWith on '0', '110', '1110',
'11110', '10'. Same logic as the optimal one, slower and clunkier.
```

### APPROACH 2 — Optimal (bit masks)   O(n) time, O(1) space

```
Keep `remaining` = number of continuation bytes still expected.
  if remaining === 0: read the leading byte and decide how many follow:
    (byte >> 7) === 0b0      -> 1-byte, remaining = 0
    (byte >> 5) === 0b110    -> remaining = 1
    (byte >> 4) === 0b1110   -> remaining = 2
    (byte >> 3) === 0b11110  -> remaining = 3
    anything else (10xxxxxx or 11111xxx) -> false
  else: byte must be 10xxxxxx, i.e. (byte >> 6) === 0b10; remaining--.
At the end remaining must be 0.

Dry run on [197,130,1]:
  197 = 11000101: >>5 = 110 -> remaining 1
  130 = 10000010: >>6 = 10  ok, remaining 0
  1   = 00000001: >>7 = 0   -> 1-byte, remaining 0
  end, remaining 0 -> true
```

### Edge cases

```
- starts with a continuation byte -> false
- truncated multi-byte char at the end -> false (remaining > 0)
- 11111xxx leading byte (5+ bytes) -> false
```

Full JavaScript solution with tests: [17_utf8_validation.js](../solutions/17_utf8_validation.js). Run it with `node 17_utf8_validation.js` from the solutions folder.

</details>

## Common mistakes

- Checking the leading-byte masks in the wrong order (test `11110` before `1110` before `110` using exact masks).
- Accepting a leading byte of `10xxxxxx` as a start byte.
- Forgetting to fail when the data ends before all continuation bytes arrive.

## Related follow-ups

- [Number of 1 Bits](../01_Easy/02_number_of_1_bits.md)
- [Reverse Bits](../01_Easy/07_reverse_bits.md)
- Validate IP Address (LeetCode #468)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
