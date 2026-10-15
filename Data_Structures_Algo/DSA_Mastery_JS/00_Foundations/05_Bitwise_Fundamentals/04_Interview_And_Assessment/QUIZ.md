# Bitwise Fundamentals — Self-Assessment Quiz

Answer each question before opening the answer. Back to the [topic README](../README.md).

**Q1. Write 13 in 8-bit binary, then −13 in 8-bit two's complement.**
<details><summary>Answer</summary>`00001101`; flip → `11110010`; +1 → `11110011`.</details>

**Q2. Predict: `~7`**
<details><summary>Answer</summary>−8 (`~x = −x − 1`).</details>

**Q3. Predict: `2 ** 31 | 0` and `2 ** 32 | 0`.**
<details><summary>Answer</summary>−2147483648 and 0.</details>

**Q4. Predict: `-9 >> 1`, `Math.trunc(-9 / 2)`, `-9 >>> 28`.**
<details><summary>Answer</summary>−5 (floor), −4 (trunc), 15 (top 4 bits of …11110111 are 1111).</details>

**Q5. Spot the bug.**
```js
function countOnes(n) { let c = 0; while (n !== 0) { c += n & 1; n >>= 1; } return c; }
countOnes(-1);
```
<details><summary>Answer</summary>`-1 >> 1` stays −1, so it loops forever. Use `n >>>= 1` (or Kernighan on `n >>> 0`).</details>

**Q6. Spot the bug.**
```js
if (mask & FLAG === FLAG) grant();
```
<details><summary>Answer</summary>Precedence: parses as `mask & (FLAG === FLAG)` → `mask & true` → `mask & 1`. Write `(mask & FLAG) === FLAG`.</details>

**Q7. Multiple choice: which gives the low 32 one-bits as a positive number?** (a) `(1 << 32) - 1` (b) `-1 >>> 0` (c) `~0`
<details><summary>Answer</summary>(b) = 4294967295. (a) is 0, (c) is −1.</details>

**Q8. Convert `0b101101` to hex by nibbles.**
<details><summary>Answer</summary>Pad to `0010 1101` → `2d`.</details>

**Q9. Predict: `1n << 3`**
<details><summary>Answer</summary>TypeError: cannot mix BigInt and other types.</details>

**Q10. Complexity: testing bit i of a Number vs of a 10,000-bit BigInt.**
<details><summary>Answer</summary>O(1) for the Number; `(x >> BigInt(i)) & 1n` on a BigInt creates a shifted copy, O(b/64) word operations.</details>

**Q11. Predict: `-3.9 | 0`, `Math.floor(-3.9)`.**
<details><summary>Answer</summary>−3 and −4.</details>

**Q12. Which expression extracts bits 4..11 (8 bits) of x?**
<details><summary>Answer</summary>`(x >>> 4) & 0xff`.</details>

## Mastery checklist

- [ ] I can convert by hand between decimal, binary and hex, including negative numbers in two's complement.
- [ ] I can explain the ToInt32 conversion and predict results for values ≥ 2^31 and for fractions.
- [ ] I know when to use `>>` vs `>>>` and why `x >>> 0` exists.
- [ ] I can set / clear / toggle / test bits and build multi-bit masks without looking.
- [ ] I can do 64-bit bit-field work with BigInt and know its restrictions; next stop: [Bit Manipulation](../../../14_Bit_Manipulation/README.md).
