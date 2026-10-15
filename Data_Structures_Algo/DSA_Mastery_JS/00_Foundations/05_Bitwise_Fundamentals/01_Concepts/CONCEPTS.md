# Bitwise Fundamentals

Computers store integers as **bits** (0s and 1s). Bitwise operators let you read and change those bits directly.
This topic is the *foundation* layer: how numbers look in binary, how negative numbers are stored (two's complement),
and the JavaScript-specific rule that surprises everyone: **every bitwise operator first converts its operands to 32-bit integers**.
The problem-solving *patterns* (XOR tricks, Kernighan, subset masks, Gray code...) live in [Bit Manipulation](../../../14_Bit_Manipulation/README.md); come back to them after this.

---

## 1. Prerequisites (Essential)

- [JavaScript for DSA](../../01_JavaScript_For_DSA/README.md), section 5 "Bitwise basics" (the operator cheat sheet). This guide explains *why* those results happen.
- [Mathematics for DSA](../../04_Mathematics_For_DSA/README.md): division, remainder, powers of two.
- [Programming Fundamentals](../../02_Programming_Fundamentals/README.md): number types and BigInt.

---

## 2. Intuition (Essential)

A binary number is a row of light switches. Switch `i` (counting from the right, starting at 0) is worth `2^i`.
The number is the sum of the values of the switches that are ON.

```
bit index:   7   6   5   4   3   2   1   0
value:     128  64  32  16   8   4   2   1
13 =         0   0   0   0   1   1   0   1      = 8 + 4 + 1
```

Bitwise operators flip, test and combine switches **all at once**, which is why they are fast and why a single
integer can act as a tiny set of up to 32 yes/no flags.

---

## 3. Mental model / analogy + visuals (Essential)

**Two's complement is an odometer.** A 4-bit odometer at `0000` rolled back by one shows `1111`. So in 4 bits, `1111` means −1, `1110` means −2, and so on.
The top bit has a **negative** weight: in w bits, bit `w−1` is worth `−2^(w−1)`.

```
4-bit two's complement wheel

        0000 (0)
  1111 (-1)    0001 (1)
 1110 (-2)       0010 (2)
1101 (-3)          0011 (3)
1100 (-4)          0100 (4)
 1011 (-5)       0101 (5)
  1010 (-6)    0110 (6)
    1001 (-7)  0111 (7)
        1000 (-8)

-x = ~x + 1   (flip all bits, add one)
 5 = 0101 -> ~5 = 1010 -> +1 = 1011 = -5
```

**The JS 32-bit funnel.** Numbers are 64-bit floats, but bitwise operators squeeze them through a funnel first:

```
any Number --ToInt32--> 32-bit signed int --operator--> 32-bit result --> back to Number
            (drop fraction, wrap modulo 2^32)
```

`>>>` uses ToUint32 instead and returns an **unsigned** result (0 .. 2^32 − 1).

---

## 4. Why it exists (what problem it solves) (Essential)

- **Compact sets:** 32 booleans in one integer; union is `|`, intersection is `&`, membership is `(mask >> i) & 1`.
- **Speed:** multiply/divide by powers of two, parity checks, power-of-two tests in one instruction.
- **Exact control of representation:** hashing, checksums, packing fields (RGB colours, permissions, flags in React's internals).
- **Enumerating subsets:** every integer from 0 to 2^n − 1 *is* a subset of n items.

---

## 5. How it works, step by step

### 5.1 Converting between bases (Essential)

| Task | JavaScript | By hand |
|---|---|---|
| number → binary string | `n.toString(2)` | repeatedly divide by 2, read remainders bottom-up |
| binary string → number | `parseInt(s, 2)` or `Number('0b' + s)` | `value = value * 2 + bit` left to right |
| binary ↔ hex | `toString(16)` / `parseInt(s, 16)` | group bits in 4s from the right (one hex digit per nibble) |
| literal | `0b1101`, `0o15`, `0xd` | |
| pad to width | `n.toString(2).padStart(8, '0')` | |

Careful: `(-5).toString(2)` is `'-101'` (sign + magnitude), **not** two's complement. For the 32-bit pattern use `(-5 >>> 0).toString(2)`.

### 5.2 Two's complement (Essential)

In w bits:
- range is `[−2^(w−1), 2^(w−1) − 1]`; for 32 bits: `[−2147483648, 2147483647]`;
- `−x = ~x + 1`, so `~x = −x − 1`;
- the pattern for negative x is the unsigned value `2^w + x`;
- the top bit is the sign bit.

### 5.3 The six operators (Essential)

| Op | Name | Rule per bit | Example |
|---|---|---|---|
| `a & b` | AND | 1 if both 1 | `12 & 10 = 8` (1100 & 1010 = 1000) |
| `a \| b` | OR | 1 if either 1 | `12 \| 10 = 14` |
| `a ^ b` | XOR | 1 if different | `12 ^ 10 = 6` |
| `~a` | NOT | flip every bit | `~12 = -13` |
| `a << k` | left shift | move left, fill 0s | `3 << 4 = 48` |
| `a >> k` | arithmetic right shift | move right, **copy the sign bit** in | `-16 >> 2 = -4` |
| `a >>> k` | logical right shift | move right, **fill 0s** | `-16 >>> 28 = 15` |

Shift counts are taken **mod 32**: `1 << 32 === 1`, `x >> 33 === x >> 1`.

### 5.4 The 32-bit conversion (ToInt32) (Essential)

Before `& | ^ ~ << >>`, JavaScript applies ToInt32:

1. `NaN`, `±Infinity` → 0.
2. Truncate toward zero (drop the fraction).
3. Take the result modulo 2^32 (into 0 .. 2^32 − 1).
4. If ≥ 2^31, subtract 2^32.

Consequences you must know:

```js
2 ** 31 | 0          // -2147483648   (wrapped into the negative half)
2 ** 32 | 0          // 0
(2 ** 32 + 5) | 0    // 5
3.9 | 0              // 3      ("x | 0" truncates, like Math.trunc for small x)
-3.9 | 0             // -3     (toward zero, NOT Math.floor)
1 << 31              // -2147483648
(1 << 31) >>> 0      // 2147483648 (reinterpret as unsigned)
~~1e10               // 1410065408  (garbage: 1e10 does not fit in 32 bits)
```

So bitwise tricks are only safe for integers in the int32 range (or when you *want* wrap-around, e.g. hashing).
For bigger integers use arithmetic (`Math.floor(x / 2)`) or BigInt.

### 5.5 `>>` vs `>>>` (Essential)

- `>>` (sign-propagating): `x >> k === Math.floor(x / 2^k)` for int32 x. Use it for halving signed numbers, mid-point `(lo + hi) >> 1` (when the sum fits in int32).
- `>>>` (zero-fill): treats the bits as unsigned. `x >>> 0` is the idiom for "give me the unsigned 32-bit value". Use it for bit counting loops on negative inputs, hashing, and printing two's-complement patterns.

### 5.6 Masks (Essential)

| Goal | Expression |
|---|---|
| bit i as a mask | `1 << i` |
| test bit i | `(x >> i) & 1` or `(x & (1 << i)) !== 0` |
| set bit i | `x \| (1 << i)` |
| clear bit i | `x & ~(1 << i)` |
| toggle bit i | `x ^ (1 << i)` |
| low k bits all ones | `(1 << k) - 1` (k < 31), or `-1 >>> (32 - k)` for 1 ≤ k ≤ 32 |
| keep low k bits | `x & ((1 << k) - 1)` |
| extract field [lo, lo+len) | `(x >>> lo) & ((1 << len) - 1)` |

### 5.7 BigInt bitwise (Advanced)

BigInt supports `& | ^ ~ << >>` with **arbitrary precision** (no 32-bit funnel), with infinite two's complement for negatives.
There is **no `>>>`** for BigInt (TypeError), and you cannot mix BigInt and Number (`1n << 3` throws). Use `BigInt.asUintN(64, x)` / `BigInt.asIntN(64, x)` to wrap to a fixed width.

```js
(1n << 64n) - 1n         // 18446744073709551615n  (64 ones)
BigInt.asIntN(64, (1n << 64n) - 1n)   // -1n
(123n >> 2n) & 1n        // test bit 2 of a BigInt
```

---

## 6. Pseudocode

```
toBinary(n, w):                 // two's complement pattern of n in w bits (w <= 32)
  u = n mod 2^w (non-negative)  // same as 2^w + n for negative n
  bits = ""
  repeat w times: bits = (u mod 2) + bits; u = floor(u / 2)
  return bits

fromBinary(bits):               // interpret as signed w-bit
  u = 0; for b in bits: u = 2*u + b
  if bits[0] == 1: u = u - 2^w
  return u

toInt32(x):
  if x not finite: return 0
  t = trunc(x); u = ((t mod 2^32) + 2^32) mod 2^32
  return u >= 2^31 ? u - 2^32 : u
```

---

## 7. JavaScript implementation

[`02_Implementations/bits.js`](../02_Implementations/bits.js): `toBinary` / `fromBinary` (two's complement at any width ≤ 32), `toInt32` / `toUint32` written with arithmetic (verified against `x | 0` and `x >>> 0`), `getBit` / `setBit` / `clearBit` / `toggleBit`, `lowMask`, `extractField`, and BigInt helpers (`bigBitLength`, `bigPopcount`, `bigGetBit`). Run it: `node 02_Implementations/bits.js`.

---

## 8. Dry run on a concrete example

`-6` in 8-bit two's complement, then `>>` and `>>>` on the 32-bit version:

| Step | Value | Bits |
|---|---|---|
| 6 | 6 | `00000110` |
| ~6 (flip) | −7 | `11111001` |
| +1 | −6 | `11111010` |
| check: −128 + 64 + 32 + 16 + 8 + 2 | −6 | ✓ |
| −6 >> 1 (32-bit) | −3 | `1111...11111101` (sign bit copied in) |
| −6 >>> 1 | 2147483645 | `0111...11111101` (zero filled in) |
| −6 >>> 0 | 4294967290 | `1111...11111010` read as unsigned = 2^32 − 6 |

---

## 9. Edge cases

- Numbers ≥ 2^31 wrap negative under `|`, `&`, `<<`: `2147483648 | 0 === -2147483648`.
- `1 << 31` is negative; `1 << 32` is 1 (shift count mod 32).
- `~~x` and `x | 0` truncate **toward zero** (not floor) and garble values outside int32.
- `-0 | 0 === 0`; `NaN | 0 === 0`.
- `(-5).toString(2)` is `'-101'`, not the two's complement pattern.
- BigInt and Number cannot be mixed; BigInt has no `>>>`.
- Operator precedence: `x & 1 === 0` parses as `x & (1 === 0)`. Always parenthesize: `(x & 1) === 0`.

---

## 10. Complexity analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| `& \| ^ ~ << >> >>>` on Numbers | O(1) | O(1) | one machine instruction on 32 bits |
| test / set / clear / toggle bit | O(1) | O(1) | one shift + one logical op |
| `toBinary(n, w)` | O(w) | O(w) | one character per bit |
| count bits by looping all 32 | O(32) = O(1) | O(1) | fixed width |
| BigInt op on b-bit values | O(b / 64) | O(b) | arbitrary precision arithmetic |
| `n.toString(2)` | O(log n) | O(log n) | one digit per bit |

---

## 11. Alternatives (trade-offs)

| Bitwise | Arithmetic / other | When to prefer the alternative |
|---|---|---|
| `x >> 1` | `Math.floor(x / 2)` | x may exceed int32 (e.g. sums near 2^31, timestamps) |
| `x \| 0` | `Math.trunc(x)` | x may be outside int32 |
| int bitmask set | `Set` of names | more than 31 flags, or readability matters more than speed |
| Number bits | BigInt | values above 2^31 (or 2^53) need exact bit access |
| `(x & 1) === 0` | `x % 2 === 0` | both fine; `%` is clearer and works for any safe integer |

---

## 12. Common mistakes (and why they happen)

1. **Forgetting the 32-bit funnel**: using `>> 1` to halve a number above 2^31 gives garbage.
2. **Precedence**: `===` binds tighter than `&`, so `n & 1 === 1` is wrong. Parenthesize.
3. **Infinite loop counting bits of a negative number with `>>`**: `-1 >> 1` is still `-1`. Use `>>>`.
4. **Building masks with `1 << 31` or `1 << 32`** and expecting 2^31 or 2^32.
5. **Reading `toString(2)` of a negative** as its two's complement.
6. **Mixing BigInt and Number**, or trying `>>>` on BigInt.
7. **Treating `~~x` as floor** for negative numbers (it truncates toward zero).

---

## 13. Patterns / variations with templates

```js
const getBit    = (x, i) => (x >> i) & 1;
const setBit    = (x, i) => x | (1 << i);
const clearBit  = (x, i) => x & ~(1 << i);
const toggleBit = (x, i) => x ^ (1 << i);
const isPowerOfTwo = x => x > 0 && (x & (x - 1)) === 0;
const unsigned32 = x => x >>> 0;
const pattern32  = x => (x >>> 0).toString(2).padStart(32, '0');
const field = (x, lo, len) => (x >>> lo) & ((1 << len) - 1);   // len <= 30
const pack  = (r, g, b) => (r << 16) | (g << 8) | b;           // RGB in 24 bits
// iterate over set bits
for (let m = mask; m !== 0; m &= m - 1) { const lowest = m & -m; /* ... */ }
```

More patterns (XOR cancel, Kernighan count, subset enumeration, Gray code, maximum XOR) are in [Bit Manipulation](../../../14_Bit_Manipulation/README.md).

---

## 14. Recognition clues

**Use bitwise tools when:**
- you need a set of at most ~30 small items (letters, visited nodes in a tiny graph, flags);
- you see "power of two", "parity", "binary representation", "XOR", "flip", "toggle", "subset of n ≤ 20 items";
- you pack several small fields into one integer.

**Do NOT use them when:**
- values can exceed 2^31 − 1 (use arithmetic or BigInt);
- readability matters more and speed is irrelevant (`x % 2` reads better than `x & 1` for many teammates);
- you need more than 32 flags (use an array of ints or BigInt or a Set).

---

## 15. Interview application

**Talk track:**
- "JavaScript bitwise ops work on 32-bit signed integers, so I'll make sure values stay below 2^31, or use `>>> 0` when I want the unsigned view."
- "To print the bit pattern of a negative number I use `(x >>> 0).toString(2)`, because `toString(2)` on a negative gives a minus sign."
- "I'm parenthesizing `(mask & bit) !== 0` because of precedence."

**What to clarify:** range of the inputs (fits in int32?), signed or unsigned interpretation, bit width the problem assumes (32? 64?).

---

## 16. Problems in this topic

| # | Problem | Difficulty | Focus |
|---|---|---|---|
| 01 | [Two's Complement at Any Width](../03_Problems/01_Easy/01_twos_complement_width.md) | Easy | binary representation, signed patterns |
| 02 | [Simulate ToInt32 and ToUint32](../03_Problems/01_Easy/02_simulate_toint32.md) | Easy | the 32-bit conversion |
| 03 | [Binary ↔ Hex by Nibbles](../03_Problems/01_Easy/03_binary_hex_nibbles.md) | Easy | base conversion via 4-bit groups |
| 04 | [Permission Flags with Masks](../03_Problems/02_Medium/04_permission_flags.md) | Medium | masks: set / clear / toggle / test |
| 05 | [Divide by Powers of Two with Shifts](../03_Problems/02_Medium/05_shift_division.md) | Medium | `>>` vs `>>>`, floor vs trunc |
| 06 | [Bit Fields in 64-bit BigInts](../03_Problems/02_Medium/06_bigint_bit_fields.md) | Medium | BigInt bitwise, field extraction |

**Practice more (LeetCode):** 191 Number of 1 Bits, 231 Power of Two, 342 Power of Four, 405 Convert a Number to Hexadecimal, 476 Number Complement, 693 Binary Number with Alternating Bits, 762 Prime Number of Set Bits in Binary Representation, 868 Binary Gap, 1009 Complement of Base 10 Integer, 1290 Convert Binary Number in a Linked List to Integer. Then continue with [Bit Manipulation](../../../14_Bit_Manipulation/README.md).
