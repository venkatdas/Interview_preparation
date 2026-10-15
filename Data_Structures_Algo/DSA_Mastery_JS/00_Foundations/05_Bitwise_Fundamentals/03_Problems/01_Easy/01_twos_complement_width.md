# Two's Complement at Any Width

| | |
|---|---|
| **Topic** | Bitwise Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | binary representation |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [01_twos_complement_width.js](../solutions/01_twos_complement_width.js) — open only after a real attempt |

## Problem

Write encode(n, w) that returns the w-bit two's complement bit string of the
integer n (1 <= w <= 32), and decode(bits) that turns such a string back into the
signed integer. encode must throw a RangeError if n does not fit in w signed bits.

## Examples

```
Input: encode(5, 4)       Output: "0101"
Input: encode(-5, 4)      Output: "1011"
Input: encode(-1, 8)      Output: "11111111"
Input: decode("1000")     Output: -8
Input: encode(8, 4)       Output: RangeError (4 signed bits hold -8..7)
```

## Constraints & clarifying questions

```
- Range for w bits is [-2^(w-1), 2^(w-1) - 1].
- decode infers the width from the string length.
- Why not n.toString(2)? Because (-5).toString(2) is "-101" (sign + magnitude).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Signed binary representation*. Sections 3 (odometer wheel) and 5.2 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (definition: flip and add one)   O(w) time, O(w) space. For n >= 0 write the binary digits and pad with zeros. For n < 0, write |n| in w bits, flip every bit, then add 1 with a manual carry loop from the right. decode: if the top bit is 1, do the reverse (subtract 1, flip) and negate.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The w-bit pattern of n is the unsigned number `n mod 2^w` (that is `2^w + n` for negatives). `n >>> 0` already gives the 32-bit pattern; read its low w bits. To decode, the top bit weighs `-2^(w-1)`: subtract `2^w` if it is set.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = -2^(w-1) (the most negative) -> "1000...0" (no positive counterpart!)
- w = 1: the only values are 0 ("0") and -1 ("1")
- w = 32: u can be >= 2^31, so build u with arithmetic, not << (which would wrap)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (definition: flip and add one)   O(w) time, O(w) space

```
For n >= 0 write the binary digits and pad with zeros. For n < 0, write |n| in w bits,
flip every bit, then add 1 with a manual carry loop from the right.
decode: if the top bit is 1, do the reverse (subtract 1, flip) and negate.
```

### APPROACH 2 — Optimal (modular view + bit ops)   O(w) time, O(w) space

```
The w-bit pattern of n is the unsigned number (n mod 2^w), i.e. 2^w + n for negatives.
With the 32-bit funnel: u = (n >>> 0) gives the 32-bit pattern; read its low w bits
with (u >>> i) & 1 for i = w-1 .. 0.
decode: u = sum of bits; the top bit has weight -2^(w-1), so value = u - 2^w when the top bit is 1.

Dry run encode(-5, 4):
  -5 >>> 0 = 4294967291 = ...11111011
  bits 3..0: 1 0 1 1 -> "1011"
  check: -8 + 0 + 2 + 1 = -5
```

### Edge cases

```
- n = -2^(w-1) (the most negative) -> "1000...0" (no positive counterpart!)
- w = 1: the only values are 0 ("0") and -1 ("1")
- w = 32: u can be >= 2^31, so build u with arithmetic, not << (which would wrap)
```

### Common mistakes

```
- Using toString(2) on negatives.
- Building the value in decode with (u << 1) | b: wraps negative at 32 bits.
- Forgetting the range check (encode(8, 4) would silently give "1000" = -8).
```

Full JavaScript solution with tests: [01_twos_complement_width.js](../solutions/01_twos_complement_width.js). Run it with `node 01_twos_complement_width.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #476 Number Complement.
- LeetCode #405 Convert a Number to Hexadecimal (two's complement for negatives).
- Sign-extend a w-bit value to 32 bits with `(x << (32 - w)) >> (32 - w)`.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
