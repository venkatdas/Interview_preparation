# Bit Manipulation

> **Prerequisites:** [Bitwise Fundamentals](../../00_Foundations/05_Bitwise_Fundamentals/README.md), [JavaScript for DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md) (number types), [Mathematics for DSA](../../00_Foundations/04_Mathematics_For_DSA/README.md) (binary numbers, powers of two), [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md), [Arrays](../../03_Arrays/README.md).

**Bit manipulation** means working with a number as a row of 0s and 1s instead of as a value.
Think of a row of 32 light switches: each switch is a **bit**, on = 1, off = 0. A number like
`13` is really the pattern `1101` (8 + 4 + 1). Bit operators flip, test and combine switches
directly, in a single CPU instruction. They are fast, memory-tiny, and show up in interview
problems about "find the odd one out", "count the ones", "every subset", and "power of two".

---

## Why it matters / when to use

Reach for bits when the problem has any of these signals:

- "Every element appears twice except one" / "appears three times except one" → **XOR**
- "Count the number of 1 bits", "Hamming distance", "flip bits"
- "Power of two", "power of four", "is bit i set"
- "Without using + / * / division" → simulate arithmetic with `^`, `&`, `<<`
- "Enumerate all subsets" of a small set (n <= 20) → **bitmask**
- A **set of lowercase letters** that needs O(1) union / membership → 26-bit mask
- DP over subsets ("visited" states in TSP-style problems) → **bitmask DP** (see `29_Dynamic_Programming/`)
- "Missing number" with O(1) space, "single number" with O(1) space

---

## How it works

### Binary representation

```
decimal 13  =  8 + 4 + 0 + 1
bits        =  1   1   0   1      (bit 3, bit 2, bit 1, bit 0 - bit 0 is the rightmost)
```

Bit `i` is worth `2^i`. `13 >> 2` shifts everything two places right → `11` → `3`.
`1 << 3` is `1000` → `8`. In JS you can see the bits with `(13).toString(2)` → `'1101'`.

### Two's complement and negative numbers in JavaScript (read this twice)

JavaScript numbers are 64-bit floats, **but every bitwise operator first converts its operands
to 32-bit signed integers**, does the work, and returns a 32-bit signed integer. Three traps
follow from this:

1. **Negative numbers use two's complement.** `-1` is all 32 bits set: `11111111 11111111 11111111 11111111`.
   To negate: flip all bits and add one. `~x === -x - 1`. So `-x === ~x + 1`.
2. **`>>` vs `>>>`**. `>>` (arithmetic shift) copies the sign bit in from the left, so
   `-8 >> 1 === -4`. `>>>` (logical shift) fills with zeros, so `-8 >>> 1 === 2147483644`.
   Use `>>>` when you want to treat the number as **unsigned** (e.g. "reverse bits", "count
   bits of a negative number"). `x >>> 0` is the idiom to view `x` as an unsigned 32-bit int.
3. **The 2^31 overflow trap.** `1 << 31` is `-2147483648`, not `2147483648`, because bit 31
   is the sign bit. `(1 << 31) >>> 0` gives the positive value. Numbers above `2^32` lose
   their high bits entirely: `(2 ** 33) | 0 === 0`. If you truly need >32-bit math, use
   `BigInt` (`1n << 40n`) or plain arithmetic (`Math.floor(x / 2)` instead of `x >> 1`).

```
 x = 5   : 00000000 00000000 00000000 00000101
~x = -6  : 11111111 11111111 11111111 11111010     (~x = -x - 1)
-x = -5  : 11111111 11111111 11111111 11111011     (~x + 1)
 x & -x  : 00000000 00000000 00000000 00000001     (lowest set bit of 5)
```

### Operators

| Operator | Name | Example (8-bit view) | Result | Meaning |
|----------|------|----------------------|--------|---------|
| `a & b`  | AND | `1100 & 1010` | `1000` | 1 only where **both** are 1 |
| `a \| b` | OR  | `1100 \| 1010` | `1110` | 1 where **either** is 1 |
| `a ^ b`  | XOR | `1100 ^ 1010` | `0110` | 1 where they **differ** |
| `~a`     | NOT | `~0000_1100` | `1111_0011` (= -13) | flip every bit |
| `a << n` | left shift | `0000_0101 << 2` | `0001_0100` (5 → 20) | multiply by 2^n |
| `a >> n` | arithmetic right shift | `-8 >> 1` | `-4` | divide by 2^n, keeps sign |
| `a >>> n`| logical right shift | `-8 >>> 28` | `15` | divide, fills with 0s (unsigned) |

Precedence trap: `&`, `^`, `|` bind **looser** than `===`. Write `(n & 1) === 1`, never
`n & 1 === 1` (which is `n & (1 === 1)` → `n & true`).

### XOR properties (the heart of many problems)

```
a ^ a = 0          a number cancels itself
a ^ 0 = a          zero is the identity
a ^ b = b ^ a      commutative
(a ^ b) ^ c = a ^ (b ^ c)   associative  -> order never matters
```

So `3 ^ 5 ^ 3 ^ 7 ^ 5 = (3^3) ^ (5^5) ^ 7 = 0 ^ 0 ^ 7 = 7`. XOR-ing a list where everything
appears twice except one leaves exactly that one. XOR is also a "difference detector":
`a ^ b` has a 1 bit exactly where `a` and `b` disagree (Hamming distance = popcount of `a ^ b`).

---

## Pseudocode

```
GET_BIT(n, i):      return (n >> i) AND 1
SET_BIT(n, i):      return n OR (1 << i)
CLEAR_BIT(n, i):    return n AND NOT(1 << i)
TOGGLE_BIT(n, i):   return n XOR (1 << i)

POPCOUNT(n):                         # Brian Kernighan
    n = unsigned(n); count = 0
    while n != 0:
        n = n AND (n - 1)            # erase lowest 1
        count += 1
    return count

XOR_SINGLE(nums):                    # all others appear twice
    acc = 0
    for x in nums: acc = acc XOR x
    return acc

ALL_SUBSETS(items):                  # n <= 30
    for mask in 0 .. 2^n - 1:
        subset = [items[i] for i in 0..n-1 if bit i of mask is 1]
```

---

## Operations & complexity

| Trick | Code | Time | Note |
|-------|------|------|------|
| odd / even | `(n & 1) === 1` | O(1) | bit 0 is the "ones" place |
| get bit i | `(n >> i) & 1` | O(1) | |
| set bit i | `n \| (1 << i)` | O(1) | |
| clear bit i | `n & ~(1 << i)` | O(1) | |
| toggle bit i | `n ^ (1 << i)` | O(1) | |
| remove lowest set bit | `n & (n - 1)` | O(1) | `1011000 -> 1010000` |
| isolate lowest set bit | `n & -n` | O(1) | `1011000 -> 0001000` |
| count set bits | Kernighan loop | O(k) | k = number of 1 bits |
| power of two | `n > 0 && (n & (n - 1)) === 0` | O(1) | exactly one bit set |
| all subsets of mask | `for (s = m; s; s = (s-1) & m)` | O(2^k) | k = bits in m |
| all subsets of n items | `for (m = 0; m < 1<<n; m++)` | O(2^n) | n <= ~20 |

---

## JavaScript implementation

Full code with tests: `bit_utils.js`. A taste:

```js
function getBit(n, i)    { return (n >> i) & 1; }
function setBit(n, i)    { return n | (1 << i); }
function clearBit(n, i)  { return n & ~(1 << i); }
function toggleBit(n, i) { return n ^ (1 << i); }

function countSetBits(n) {        // Brian Kernighan: each loop kills one 1 bit
  let count = 0;
  n = n >>> 0;                    // treat as unsigned so negatives terminate
  while (n !== 0) { n &= n - 1; count++; }
  return count;
}

function isPowerOfTwo(n)  { return n > 0 && (n & (n - 1)) === 0; }
function lowestSetBit(n)  { return n & -n; }

function toBinaryString(n, width = 8) {   // handles negatives via >>> 0
  return (n >>> 0).toString(2).padStart(width, '0').slice(-width);
}
```

---

## Dry run

**Kernighan popcount on `n = 44`** (binary `101100`):

| Iteration | n (binary) | n - 1 (binary) | n & (n - 1) | count |
|---|---|---|---|---|
| start | 101100 | - | - | 0 |
| 1 | 101100 | 101011 | 101000 | 1 |
| 2 | 101000 | 100111 | 100000 | 2 |
| 3 | 100000 | 011111 | 000000 | 3 |
| stop | 000000 | - | - | **3** |

Three loop iterations for three set bits, regardless of the number's width.

**XOR single number on `[4, 1, 2, 1, 2]`:**

| x | acc before | acc after (binary) |
|---|---|---|
| 4 | 000 | 100 |
| 1 | 100 | 101 |
| 2 | 101 | 111 |
| 1 | 111 | 110 |
| 2 | 110 | **100** = 4 |

---

## Patterns / variations

### 1. XOR to find the odd one out

```js
function singleNumber(nums) {
  let result = 0;
  for (const num of nums) result ^= num;   // pairs cancel, the single survives
  return result;
}
```
Use when: "every element appears twice except one", "missing number from 0..n"
(XOR all indices and all values), "two single numbers" (split by a differing bit).

### 2. Kernighan's bit count: `n & (n - 1)`

`n - 1` flips the lowest set bit to 0 and all zeros below it to 1. AND-ing with `n` keeps
everything above and erases exactly that lowest 1.

```
n     = 1011000
n - 1 = 1010111
n&n-1 = 1010000   <- lowest 1 removed
```
Use when: counting bits, power-of-two check, "is only one bit set".

### 3. `n & -n` isolates the lowest set bit

`-n` is `~n + 1`; the `+1` carries through the trailing zeros and stops at the lowest 1.
So `n & -n` leaves only that bit. Used in Single Number III and in Fenwick trees.

### 4. Swap without a temp

```js
a = a ^ b;
b = a ^ b;   // (a ^ b) ^ b = a
a = a ^ b;   // (a ^ b) ^ a = b
```
A party trick; in real code use `[a, b] = [b, a]`. Breaks if `a` and `b` are the same
variable (it zeroes it). Interviewers still ask.

### 5. Bitmask as a set (characters a..z)

```js
let mask = 0;
for (const ch of 'hello') mask |= 1 << (ch.charCodeAt(0) - 97);  // add letter
const hasL = (mask >> ('l'.charCodeAt(0) - 97)) & 1;               // membership
const shareLetters = (maskA & maskB) !== 0;                         // intersection non-empty
```
Use when: "two words share no letters" (Maximum Product of Word Lengths), "unique chars in
substring", "visited set" of up to 32 items. 26 letters fit in one number.

### 6. Enumerate subsets with a bitmask

```js
for (let mask = 0; mask < (1 << n); mask++) {     // every subset of n items
  const subset = [];
  for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(nums[i]);
}
// only sub-masks of a given mask m (the trick: s = (s - 1) & m):
for (let s = m; s > 0; s = (s - 1) & m) { /* s is a non-empty subset of m */ }
```
Use when: n <= 20, "all subsets", "all combinations", bitmask DP (`dp[mask][last]`).

### 7. Gray code

A sequence where consecutive numbers differ in exactly one bit: `gray(i) = i ^ (i >> 1)`.
For n = 2: `00, 01, 11, 10`. Used in "Gray Code" (LeetCode 89) and hardware counters.

### 8. Bit-by-bit greedy with a hash set (Maximum XOR)

Build the answer from the top bit down. At each bit, optimistically set it, and use a set of
prefixes to check whether two numbers can actually produce that prefix. Problem 14 below.

### 9. Arithmetic without `+`

`a ^ b` is the sum without carries, `(a & b) << 1` is the carries. Repeat until no carries.

---

## Alternatives (brute force vs optimized)

| Task | Brute force / non-bit approach | Bit approach | Trade-off |
|---|---|---|---|
| Count set bits | `n.toString(2)` and count '1's: O(32) with string allocation | Kernighan O(#ones), no allocation | Strings are easier to read; bits are faster |
| Unique element among pairs | Hash map counts: O(n) time, O(n) space; or sort O(n log n) | XOR all: O(n) time, O(1) space | XOR only works for the "pairs cancel" shape |
| All subsets | Recursion (backtracking) with pruning | Loop over masks 0..2^n-1 | Bitmask is simple but cannot prune; recursion can |
| Set of letters | `new Set(word)` | 26-bit integer mask | Mask gives O(1) intersection/equality and works as a Map key |
| Wide integers (> 32 bits) | Arithmetic with `Math.floor(n / 2)`, `% 2` | `BigInt` bit operators | Plain bitwise ops silently truncate above 32 bits |

---

## Common mistakes & edge cases

- Forgetting that bitwise ops are **32-bit**. `2 ** 31 | 0` is negative; `2 ** 32 | 0` is 0.
- Using `>>` when you meant `>>>` on a negative number (infinite loop in `while (n) n >>= 1`).
- Operator precedence: `n & 1 === 0` is a bug. Parenthesise: `(n & 1) === 0`.
- `1 << 32` is `1`, not `0` (shift amount is taken mod 32).
- `Math.pow(2, i)` and `1 << i` are the same only for `i < 31`.
- `toString(2)` on a negative number gives `'-101'`, not two's complement. Use `(n >>> 0).toString(2)`.
- Subset enumeration with `1 << n` for n > 30 overflows; use recursion or BigInt.
- Negative numbers in Kernighan's loop: convert with `>>> 0` first.

---

## When this does NOT apply

- **Values exceed 32 bits** (timestamps, 64-bit IDs, values above 2^31): JS bitwise ops truncate; use arithmetic or `BigInt`.
- **The universe of items is large or unknown** (arbitrary strings, n > 30): use a Set or Map instead of a mask.
- **Readability matters more than micro-speed** in production code: `x % 2 === 0` is clearer than `(x & 1) === 0` and equally fast.
- **Floats**: bitwise operators drop the fraction (`5.7 | 0 === 5`), so they are wrong for non-integers.
- **"Appears k times" tricks** only work when the counts follow a strict pattern; otherwise count with a hash map.

---

## Interview tips

- Say "XOR cancels pairs" and "n & (n-1) removes the lowest set bit" out loud; they are the
  two tricks that unlock 80% of bit problems.
- Mention the 32-bit conversion in JavaScript before writing shift code; it shows you know
  the language.
- When asked for O(1) space on a "find the special element" problem, think XOR or bit counting.
- Draw the bits for a tiny example (4 bits is enough). Interviewers want to see the pattern,
  not the formula.
- Know the complexity story: Kernighan is O(number of set bits), a full 32-bit loop is O(32) = O(1).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Single Number | Easy | XOR cancel pairs | 03_Problems/solutions/01_single_number.js |
| 02 | Number of 1 Bits | Easy | Kernighan | 03_Problems/solutions/02_number_of_1_bits.js |
| 03 | Power of Two | Easy | n & (n-1) | 03_Problems/solutions/03_power_of_two.js |
| 04 | Missing Number | Easy | XOR indices and values | 03_Problems/solutions/04_missing_number.js |
| 05 | Hamming Distance | Easy | popcount(a ^ b) | 03_Problems/solutions/05_hamming_distance.js |
| 06 | Counting Bits | Easy | dp[i] = dp[i >> 1] + (i & 1) | 03_Problems/solutions/06_counting_bits.js |
| 07 | Reverse Bits | Easy | bit-by-bit with >>> | 03_Problems/solutions/07_reverse_bits.js |
| 08 | Minimum Flips to Make a OR b Equal to c | Medium | per-bit case analysis | 03_Problems/solutions/08_minimum_flips_a_or_b_equal_c.js |
| 09 | Single Number II | Medium | count bits mod 3 | 03_Problems/solutions/09_single_number_ii.js |
| 10 | Single Number III | Medium | split by lowest set bit | 03_Problems/solutions/10_single_number_iii.js |
| 11 | Sum of Two Integers | Medium | XOR + carry | 03_Problems/solutions/11_sum_of_two_integers.js |
| 12 | Total Hamming Distance | Medium | count per bit column | 03_Problems/solutions/12_total_hamming_distance.js |
| 13 | Bitwise AND of Numbers Range | Medium | common prefix | 03_Problems/solutions/13_bitwise_and_of_numbers_range.js |
| 14 | Subsets (bitmask) | Medium | enumerate masks | 03_Problems/solutions/14_subsets_bitmask.js |
| 15 | Maximum XOR of Two Numbers in an Array | Medium | bit-by-bit greedy + set | 03_Problems/solutions/15_maximum_xor_of_two_numbers.js |
| 16 | Find the Duplicate Number | Medium | bit counting | 03_Problems/solutions/16_find_the_duplicate_number.js |
| 17 | UTF-8 Validation | Medium | leading-bit masks | 03_Problems/solutions/17_utf8_validation.js |
| 18 | Divide Two Integers | Medium | shift-and-subtract | 03_Problems/solutions/18_divide_two_integers.js |

---

## Practice more

Easy: Power of Four (342), Binary Number with Alternating Bits (693), Complement of Base 10
Integer (1009), Number Complement (476), Convert a Number to Hexadecimal (405),
Sort Integers by The Number of 1 Bits (1356), XOR Operation in an Array (1486)

Medium: Gray Code (89), Maximum Product of Word Lengths (318), Bitwise ORs of Subarrays (898),
Count Triplets That Can Form Two Arrays of Equal XOR (1442), Decode XORed Array (1720),
Single Number II variant - appears k times, Letter Tile Possibilities (1079),
Shortest Path Visiting All Nodes (847, bitmask BFS), Partition to K Equal Sum Subsets (698)

Hard: Maximum XOR With an Element From Array (1707), Minimum Number of K Consecutive Bit Flips (995),
Smallest Sufficient Team (1125, bitmask DP)
