# Binary ↔ Hex by Nibbles

| | |
|---|---|
| **Topic** | Bitwise Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | base conversion by grouping |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [03_binary_hex_nibbles.js](../solutions/03_binary_hex_nibbles.js) — open only after a real attempt |

## Problem

Write binToHex(bits) and hexToBin(hex) for unsigned values of ANY length (longer
than 53 bits too, so no parseInt/Number conversion of the whole string). Use the
fact that one hex digit is exactly 4 bits (a nibble). Output hex in lowercase
without leading zeros ("0" for zero); output binary without leading zeros ("0" for zero).

## Examples

```
Input: binToHex("11010110")          Output: "d6"
Input: binToHex("101")               Output: "5"      (pad on the LEFT to "0101")
Input: hexToBin("1f")                Output: "11111"
Input: binToHex("0000")              Output: "0"
Input: binToHex("1" + "0".repeat(64))  Output: "1" + "0".repeat(16)
```

## Constraints & clarifying questions

```
- Input length up to 1e5 characters.
- Uppercase hex input allowed? (yes, accept both)
- Leading zeros in input? (allowed; strip them in output)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Base conversion*. Section 5.1 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BigInt via the whole value)   O(L^2) time in the worst case. BigInt('0b' + bits).toString(16) and BigInt('0x' + hex).toString(2). Correct for any length, but builds a huge integer; conversions of very long strings are quadratic-ish. Used as the oracle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** 16 = 2^4, so every hex digit is exactly 4 bits. Left-pad the binary string to a multiple of 4 and translate group by group; for hex to binary, expand each digit to a 4-character group. No big number is ever built.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all zeros -> "0"
- length not a multiple of 4 -> pad on the LEFT (padding on the right multiplies by 16!)
- uppercase hex
- very long strings (no Number conversion)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BigInt via the whole value)   O(L^2) time in the worst case

```
BigInt('0b' + bits).toString(16) and BigInt('0x' + hex).toString(2). Correct for any
length, but builds a huge integer; conversions of very long strings are quadratic-ish.
Used as the oracle.
```

### APPROACH 2 — Optimal (nibble grouping)   O(L) time, O(L) space

```
binToHex: left-pad bits to a multiple of 4; for each group of 4, value = b0*8 + b1*4 + b2*2 + b3
(or parseInt of 4 chars), map to '0123456789abcdef'. Strip leading zeros.
hexToBin: each hex digit -> its 4-bit string (value.toString(2).padStart(4, '0')); join; strip.
Grouping works because 16 = 2^4: each hex digit covers exactly 4 binary places.

Dry run binToHex("101101"):
  pad to "00101101" -> groups "0010" "1101" -> 2, 13 -> "2d"
```

### Edge cases

```
- all zeros -> "0"
- length not a multiple of 4 -> pad on the LEFT (padding on the right multiplies by 16!)
- uppercase hex
- very long strings (no Number conversion)
```

### Common mistakes

```
- Grouping from the left without padding first (groups misaligned).
- parseInt(bits, 2) on more than 53 bits (precision loss).
- Stripping zeros until the string is empty (should leave "0").
```

Full JavaScript solution with tests: [03_binary_hex_nibbles.js](../solutions/03_binary_hex_nibbles.js). Run it with `node 03_binary_hex_nibbles.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #67 Add Binary.
- LeetCode #405 Convert a Number to Hexadecimal.
- Binary ↔ octal by 3-bit groups.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
