# Bit Fields in 64-bit BigInts

| | |
|---|---|
| **Topic** | Bitwise Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | BigInt shifts and masks |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_bigint_bit_fields.js](../solutions/06_bigint_bit_fields.js) — open only after a real attempt |

## Problem

A 64-bit unsigned ID (as a BigInt) is laid out like a snowflake ID:
  bits 63..22  timestamp (42 bits)
  bits 21..12  machine   (10 bits)
  bits 11..0   sequence  (12 bits)
Write pack({ timestamp, machine, sequence }) -> BigInt and unpack(id) -> the three
fields (as BigInts), plus popcount(id) and bitLength(id). Values exceed 2^53, so
Number bitwise operators (32-bit!) cannot be used.

## Examples

```
Input: pack({ timestamp: 1n, machine: 0n, sequence: 0n })     Output: 4194304n   (1n << 22n)
Input: unpack(4194305n)                                       Output: { timestamp: 1n, machine: 0n, sequence: 1n }
Input: pack({ timestamp: 2n**42n - 1n, machine: 1023n, sequence: 4095n })   Output: 2n**64n - 1n
Input: popcount(2n**64n - 1n)                                 Output: 64
```

## Constraints & clarifying questions

```
- Fields out of range (e.g. machine = 1024n)? (throw RangeError)
- IDs are always within [0, 2^64)? (yes; validate)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *BigInt bitwise*. Section 5.7 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (binary strings)   O(64) per op with string building. Pad each field's toString(2) to its width, concatenate, BigInt('0b' + s). unpack slices the 64-char string. popcount counts '1' chars. Easy to follow, allocation-heavy.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Each field is `(id >> offset) & ((1n << width) - 1n)`, and packing is the reverse: shift each field to its offset and OR them. Every literal must be a BigInt (`22n`), and validate field ranges so one field never bleeds into the next.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all-zero ID -> all fields 0n, bitLength 0
- all-ones ID -> max fields
- field overflow -> RangeError, never silently bleed into the neighbour field
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (binary strings)   O(64) per op with string building

```
Pad each field's toString(2) to its width, concatenate, BigInt('0b' + s). unpack slices
the 64-char string. popcount counts '1' chars. Easy to follow, allocation-heavy.
```

### APPROACH 2 — Optimal (BigInt shifts and masks)   O(1) word ops (O(64) for popcount)

```
mask(w) = (1n << w) - 1n
pack   = (timestamp << 22n) | (machine << 12n) | sequence
unpack = timestamp: id >> 22n; machine: (id >> 12n) & mask(10n); sequence: id & mask(12n)
popcount: Kernighan x &= x - 1n; bitLength: shift right until 0 (or toString(2).length).
BigInt has no >>> and cannot mix with Number: every literal needs the n suffix.

Dry run unpack(4194305n):
  4194305 = 2^22 + 1
  timestamp = 4194305n >> 22n = 1n
  machine   = (4194305n >> 12n) & 1023n = 1024n & 1023n = 0n
  sequence  = 4194305n & 4095n = 1n
```

### Edge cases

```
- all-zero ID -> all fields 0n, bitLength 0
- all-ones ID -> max fields
- field overflow -> RangeError, never silently bleed into the neighbour field
```

### Common mistakes

```
- 1n << 22 (mixing BigInt and Number) -> TypeError.
- Using Number(id) >> 22 -> precision loss AND the 32-bit funnel.
- Forgetting to mask the middle field (machine would include the timestamp bits).
```

Full JavaScript solution with tests: [06_bigint_bit_fields.js](../solutions/06_bigint_bit_fields.js). Run it with `node 06_bigint_bit_fields.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #190 Reverse Bits (do it for 64 bits with BigInt).
- Encode (row, col) pairs of a huge grid into one BigInt key.
- Pack RGBA colours into 32 bits and unpack them with `>>>`.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
