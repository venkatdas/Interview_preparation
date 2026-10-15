# Bit Manipulation — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Predict the output)**

```js
console.log(5 & 3, 5 | 3, 5 ^ 3, ~5);
```

<details><summary>Answer</summary>`1 7 6 -6`. 101 & 011 = 001; 101 | 011 = 111; 101 ^ 011 = 110; `~x === -x - 1`.</details>

**2. (Predict the output)**

```js
console.log(-8 >> 1, -8 >>> 28, 1 << 31, 2 ** 32 | 0);
```

<details><summary>Answer</summary>`-4 15 -2147483648 0`. `>>` keeps the sign; `>>>` fills zeros (the top 4 bits of -8 are 1111); `1 << 31` sets the sign bit; 2^32 has no bits in the low 32.</details>

**3. (Spot the bug)**

```js
function isEven(n) { return n & 1 === 0; }
```

<details><summary>Answer</summary>Precedence: `1 === 0` runs first, so this returns `n & false` = 0 (falsy) for every n. Write `(n & 1) === 0`.</details>

**4. (Multiple choice)** Which expression clears the lowest set bit of `n`?
A) `n & -n`  B) `n | (n + 1)`  C) `n & (n - 1)`  D) `n ^ (n >> 1)`

<details><summary>Answer</summary>C. A isolates the lowest set bit, B sets the lowest zero bit, D is Gray code.</details>

**5. (Complexity)** Kernighan's popcount on `n = 0b1000000000000001`: how many loop iterations?

<details><summary>Answer</summary>2 — one per set bit.</details>

**6. (Predict the output)**

```js
let x = 0;
for (const v of [4, 1, 2, 1, 2]) x ^= v;
console.log(x);
```

<details><summary>Answer</summary>`4`. Pairs cancel.</details>

**7. (Spot the bug)** Counting bits of possibly negative input:

```js
function popcount(n) { let c = 0; while (n > 0) { c += n & 1; n >>= 1; } return c; }
```

<details><summary>Answer</summary>For negative `n` the loop never runs (returns 0), and if you changed it to `n !== 0` then `>>=` would keep the sign and loop forever. Use `n >>>= 1` with `n !== 0`, or start with `n = n >>> 0`.</details>

**8. (Multiple choice)** You need all subsets of 25 items. Which is the biggest concern?
A) `1 << 25` overflows  B) 2^25 ≈ 33 million subsets is slow but feasible only with tiny per-subset work  C) XOR doesn't work above 16 bits  D) Bitmasks cannot represent 25 items

<details><summary>Answer</summary>B. `1 << 25` is fine (only n ≥ 31 breaks), but the output size is the real cost.</details>

**9. (Predict the output)**

```js
console.log((13).toString(2), parseInt('1101', 2), (-1 >>> 0).toString(2).length);
```

<details><summary>Answer</summary>`1101 13 32`.</details>

**10. (Complexity)** Counting Bits for all numbers 0..n using `ans[i] = ans[i >> 1] + (i & 1)`: time and extra space?

<details><summary>Answer</summary>O(n) time, O(1) extra beyond the O(n) output array.</details>

**11. (Spot the bug)** Power of two check:

```js
const isPow2 = (n) => (n & (n - 1)) === 0;
```

<details><summary>Answer</summary>Returns `true` for `0` (and for `-2147483648`). Add `n > 0 &&`.</details>

**12. (Multiple choice)** Which identity is FALSE?
A) `x ^ x === 0`  B) `x ^ 0 === x`  C) `x & ~x === 0`  D) `x | ~x === 0`

<details><summary>Answer</summary>D. `x | ~x` has every bit set, which is `-1`.</details>

---

## Mastery checklist

- [ ] I can explain JS's 32-bit conversion, `>>` vs `>>>`, and the `x >>> 0` idiom.
- [ ] I can write get/set/clear/toggle bit and `n & (n - 1)`, `n & -n` from memory and explain why they work.
- [ ] I can solve Single Number I, II and III and explain the XOR cancellation and per-bit counting.
- [ ] I can enumerate subsets with a bitmask and use a 26-bit mask as a letter set.
- [ ] I always parenthesize bitwise expressions in comparisons and test negatives and zero.
