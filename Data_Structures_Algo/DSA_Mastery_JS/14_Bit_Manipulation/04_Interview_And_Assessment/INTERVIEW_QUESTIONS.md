# Bit Manipulation — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. How do JavaScript bitwise operators treat numbers?

<details><summary>Model answer</summary>

JS numbers are 64-bit floats, but every bitwise operator (`& | ^ ~ << >>`) first converts operands to **32-bit signed integers**, works on those, and returns a 32-bit signed result. `>>>` returns an unsigned 32-bit result. So `2 ** 32 | 0 === 0` and `2 ** 31 | 0` is negative. For wider values use `BigInt` or arithmetic.

</details>

### 2. What is the difference between `>>` and `>>>`?

<details><summary>Model answer</summary>

`>>` is an arithmetic shift: it copies the sign bit into the new high bits, so `-8 >> 1 === -4`. `>>>` is a logical shift: it fills with zeros and treats the result as unsigned, so `-8 >>> 1 === 2147483644`. `x >>> 0` is the idiom to view `x` as unsigned (for printing or counting bits of a negative).

</details>

### 3. Explain `n & (n - 1)` and two uses of it.

<details><summary>Model answer</summary>

Subtracting 1 flips the lowest set bit to 0 and all the zeros below it to 1; AND-ing with `n` erases exactly that lowest set bit. Uses: counting set bits in O(number of ones) (Kernighan), and testing a power of two: `n > 0 && (n & (n - 1)) === 0`.

</details>

### 4. Why does XOR find the single number when every other number appears twice?

<details><summary>Model answer</summary>

XOR is associative and commutative, `x ^ x = 0` and `x ^ 0 = x`. XOR-ing the whole array pairs up and cancels every duplicate, leaving the unique value. O(n) time, O(1) space, no sorting or hash map.

</details>

### 5. How does `n & -n` isolate the lowest set bit?

<details><summary>Model answer</summary>

In two's complement `-n = ~n + 1`. `~n` flips every bit; adding 1 carries through the trailing ones (which were the trailing zeros of `n`) and stops at the first zero, which was `n`'s lowest 1. So `n` and `-n` share only that one bit. Used in Single Number III (split by a differing bit) and Fenwick trees.

</details>

### 6. How would you enumerate all subsets with bitmasks? What are the limits?

<details><summary>Model answer</summary>

Loop `mask` from 0 to `(1 << n) - 1`; bit `i` set means element `i` is included. O(n · 2^n) total. Limits: `1 << 31` is negative in JS, so keep n ≤ 30 (and in practice ≤ ~20 for time). It has no recursion but also cannot prune early.

</details>

### 7. How do you add two integers without `+`?

<details><summary>Model answer</summary>

`a ^ b` adds without carries; `(a & b) << 1` is the carry. Repeat with `a = a ^ b, b = carry` until the carry is 0. In JS the 32-bit wraparound makes negatives work and the loop ends within 32 iterations.

</details>

### 8. Single Number II: every number appears three times except one. Describe an O(1)-space approach.

<details><summary>Model answer</summary>

Count bits per position: for each of the 32 bit positions sum the bits across all numbers; the sum mod 3 is the unique number's bit. O(32n). The slicker version keeps two masks `ones` and `twos` that act as a per-bit mod-3 counter. Remember to `| 0` the rebuilt result so bit 31 makes it negative when needed.

</details>

### 9. When should you use a bitmask instead of a Set?

<details><summary>Model answer</summary>

When the universe is small and fixed (26 letters, ≤ 30 items, 9 Sudoku digits) and you need fast union/intersection/equality: `a | b`, `a & b`, `a === b` are single operations, and the mask can be a Map key or DP state (bitmask DP). Use a Set when the universe is large or unknown.

</details>

### 10. Why is "count bits with a 32-iteration loop" O(1), and when is Kernighan better?

<details><summary>Model answer</summary>

The loop count is bounded by the fixed word size (32), not by input size, so it is constant. Kernighan's loop runs once per set bit, which is faster for sparse numbers. For counting bits of 0..n, use DP: `bits[i] = bits[i >> 1] + (i & 1)`, O(n) total.

</details>

### 11. What is the precedence trap with bitwise operators?

<details><summary>Model answer</summary>

`&`, `|`, `^` bind **looser** than `===`. `n & 1 === 0` parses as `n & (1 === 0)`, which is `n & false`, always 0. Always parenthesize: `(n & 1) === 0`.

</details>

### 12. How does the maximum XOR of two numbers problem use bits greedily?

<details><summary>Model answer</summary>

Decide the answer bit by bit from the highest. For each bit, ask "can some pair produce a 1 here, given the prefix chosen so far?" using a Set of prefixes (or a binary trie): if `candidate ^ p` is in the set for some prefix `p`, keep the 1. Higher bits dominate lower ones, so greedy from the top is optimal. O(31 · n).

</details>

### 13. What should you clarify in a bit-manipulation interview question?

<details><summary>Model answer</summary>

Signed or unsigned interpretation, bit width (32? 64?), whether negatives appear, whether overflow must be clamped (Divide Two Integers), and whether you may use built-ins like `toString(2)`. Mention JS's 32-bit conversion before writing shifts.

</details>
