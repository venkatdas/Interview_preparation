# 18. Bit Manipulation

Every integer is a row of bits. Bit tricks let you store a small set in one number (a
**bitmask**), cancel pairs with **XOR**, and test or clear bits in O(1). They often turn an O(n)
memory solution into O(1) memory.

Five facts carry most problems:

- `x ^ x = 0` and `x ^ 0 = x`, so XOR of all values cancels every pair.
- `x & (x - 1)` clears the lowest set bit. `x & -x` isolates it.
- `(x >> i) & 1` reads bit i; `x | (1 << i)` sets it; `x & ~(1 << i)` clears it.
- `(n & (n - 1)) === 0` (for n > 0) means n is a power of two.
- In JavaScript, bitwise operators work on **32-bit signed** integers.

**Teaches in depth:** [Bit Manipulation](../../../14_Bit_Manipulation/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at bits |
|---|---|
| "every element appears twice except one" | XOR cancels pairs |
| "O(1) extra space" + duplicates / missing number | XOR of indices and values |
| "count set bits", "Hamming distance" | popcount, `x & (x - 1)` |
| "power of two / four" | single set bit |
| "all subsets", n <= 20 | iterate masks `0..2^n - 1` |
| "visit all nodes", state includes "which ones used", n <= 20 | bitmask DP / BFS |
| "maximum XOR of two numbers" | bitwise trie, greedy from the high bit |
| "add without +", "divide without /" | carries with `&` and `<<` |

**Constraint hints**

- n <= 20 -> 2^20 ≈ 10^6 masks is fine; 2^30 is too many to enumerate.
- Values up to 2^31 - 1 -> bitwise ops are safe; beyond that, use `BigInt` (`1n << 40n`).

## 2. When it applies (preconditions)

- The values are integers within 32 bits (or you use `BigInt`).
- The property you need is about parity, presence, or combinations of a small set.

## 3. When it does NOT apply

- **"Three times except one" with plain XOR.** `[2, 2, 2, 5]`: XOR is `2 ^ 5 = 7`, wrong. Use per-bit counts mod 3 (Single Number II).
- **Numbers beyond 32 bits.** `(2 ** 32) | 0` is `0`; `(2 ** 31) | 0` is negative. For 64-bit IDs use `BigInt` or arithmetic.
- **Large sets.** A bitmask over 100 items does not fit in a number; use a `Set` or a boolean array.

## 4. The template

```js
function popcount(x) {
  let n = x >>> 0;                                 // treat as unsigned 32-bit
  let count = 0;
  while (n) { n &= n - 1; count++; }               // clears the lowest set bit each time
  return count;
}

function singleNumber(nums) {
  return nums.reduce((acc, x) => acc ^ x, 0);
}

function subsetsBitmask(nums) {
  const res = [];
  for (let mask = 0; mask < (1 << nums.length); mask++) {
    const subset = [];
    for (let i = 0; i < nums.length; i++) if (mask & (1 << i)) subset.push(nums[i]);
    res.push(subset);
  }
  return res;
}

function isPowerOfTwo(n) {
  return Number.isInteger(n) && n > 0 && n <= 2 ** 30 && (n & (n - 1)) === 0;
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`popcount`, `singleNumber`, `subsetsBitmask`, `isPowerOfTwo`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `popcount(12)` (binary `1100`):

| n (binary) | n - 1 | n & (n - 1) | count |
|---|---|---|---|
| 1100 | 1011 | 1000 | 1 |
| 1000 | 0111 | 0000 | 2 |

## 5. Variations

- **Missing number:** XOR all indices 0..n and all values; the leftover is the missing one.
- **Single Number III (two singles):** XOR all -> `x ^ y`; split the numbers by its lowest set bit.
- **Counting bits for 0..n:** `bits[i] = bits[i >> 1] + (i & 1)` — a tiny DP.
- **Reverse bits:** shift-and-mask loop; finish with `>>> 0` for an unsigned result.
- **Bitmask DP:** `dp[mask]` or `dp[mask][last]` over subsets (Partition to K Equal Sum Subsets, TSP).
- **Maximum XOR pair:** insert numbers into a binary trie; for each number greedily take the opposite bit.

## 6. Common pitfalls

1. **32-bit signed results:** `1 << 31` is `-2147483648`. Use `>>> 0` to read it as unsigned.
2. `>>` keeps the sign; `>>>` fills with zeros. `-8 >> 1` is `-4`, `-8 >>> 1` is `2147483644`.
3. Precedence: `x & 1 === 0` parses as `x & (1 === 0)`. Write `(x & 1) === 0`.
4. `~x` equals `-x - 1`; it flips all 32 bits, not just the "meaningful" ones.
5. Shift counts are taken mod 32: `1 << 32 === 1`.
6. Using a bit trick without explaining it. Say what each line does.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Single Number | Easy | XOR cancels pairs | [statement](../../../14_Bit_Manipulation/03_Problems/01_Easy/01_single_number.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/01_single_number.js) |
| 2 | Number of 1 Bits | Easy | `x & (x - 1)` | [statement](../../../14_Bit_Manipulation/03_Problems/01_Easy/02_number_of_1_bits.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/02_number_of_1_bits.js) |
| 3 | Power of Two | Easy | single set bit | [statement](../../../14_Bit_Manipulation/03_Problems/01_Easy/03_power_of_two.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/03_power_of_two.js) |
| 4 | Missing Number | Easy | XOR indices and values | [statement](../../../14_Bit_Manipulation/03_Problems/01_Easy/04_missing_number.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/04_missing_number.js) |
| 5 | Counting Bits | Easy | `bits[i >> 1]` DP | [statement](../../../14_Bit_Manipulation/03_Problems/01_Easy/06_counting_bits.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/06_counting_bits.js) |
| 6 | Reverse Bits | Easy | shift + `>>> 0` | [statement](../../../14_Bit_Manipulation/03_Problems/01_Easy/07_reverse_bits.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/07_reverse_bits.js) |
| 7 | Single Number II | Medium | bit counts mod 3 | [statement](../../../14_Bit_Manipulation/03_Problems/02_Medium/09_single_number_ii.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/09_single_number_ii.js) |
| 8 | Single Number III | Medium | split by lowest set bit | [statement](../../../14_Bit_Manipulation/03_Problems/02_Medium/10_single_number_iii.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/10_single_number_iii.js) |
| 9 | Subsets (bitmask) | Medium | masks as subsets | [statement](../../../14_Bit_Manipulation/03_Problems/02_Medium/14_subsets_bitmask.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/14_subsets_bitmask.js) |
| 10 | Maximum XOR of Two Numbers | Medium | bitwise trie / greedy | [statement](../../../14_Bit_Manipulation/03_Problems/02_Medium/15_maximum_xor_of_two_numbers.md) · [solution](../../../14_Bit_Manipulation/03_Problems/solutions/15_maximum_xor_of_two_numbers.js) |

## 8. Self-check

**Q1.** What does `(1 << 31) >>> 0` evaluate to, and why does `>>> 0` matter?

<details><summary>Answer</summary>

`2147483648`. `1 << 31` alone is `-2147483648` because the result is a signed 32-bit integer; `>>> 0` reinterprets the same bits as unsigned.

</details>

**Q2.** How do you iterate all sub-masks of a mask `m`?

<details><summary>Answer</summary>

`for (let s = m; s > 0; s = (s - 1) & m) { ... }`, and handle `s = 0` separately. Over all masks this totals O(3^n).

</details>

**Q3.** What is the bug in `if (n & (n - 1) === 0)`?

<details><summary>Answer</summary>

`===` binds tighter than `&`, so it computes `n & false` which is `n & 0` = 0 — always falsy. Write `(n & (n - 1)) === 0`, and also require `n > 0`.

</details>

---

Previous: [17. Dynamic Programming (families)](17_dynamic_programming_families.md) · Next: [19. Matrix Traversal](19_matrix_traversal.md) · [Pattern index](../../README.md)
