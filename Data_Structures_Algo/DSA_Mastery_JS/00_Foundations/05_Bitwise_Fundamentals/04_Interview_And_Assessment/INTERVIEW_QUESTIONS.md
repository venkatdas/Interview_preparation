# Bitwise Fundamentals — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md).

**1. How are negative integers represented in binary?**
<details><summary>Model answer</summary>

Two's complement: in w bits the top bit has weight −2^(w−1). To negate, flip all bits and add one (`−x = ~x + 1`). The range is [−2^(w−1), 2^(w−1) − 1], so there is one more negative value than positive.
</details>

**2. What happens to a JavaScript Number when you apply a bitwise operator?**
<details><summary>Model answer</summary>

It goes through ToInt32 (or ToUint32 for `>>>`): NaN/Infinity become 0, the fraction is truncated toward zero, the value is wrapped modulo 2^32, and values ≥ 2^31 become negative. The result is a 32-bit integer converted back to a Number.
</details>

**3. Difference between `>>` and `>>>`?**
<details><summary>Model answer</summary>

`>>` is arithmetic: it copies the sign bit in, so it equals floor division by 2^k for int32 values (negative stays negative). `>>>` is logical: it fills with zeros and returns an unsigned 32-bit result. `x >>> 0` is the idiom for "unsigned view of x".
</details>

**4. Why is `(-5).toString(2)` not the two's complement bit pattern? How do you get it?**
<details><summary>Model answer</summary>

`toString(2)` prints sign and magnitude: `'-101'`. Use `(-5 >>> 0).toString(2)` for the 32-bit pattern, or compute `(2^w + n)` for a w-bit pattern.
</details>

**5. Why might `(lo + hi) >> 1` be a bug?**
<details><summary>Model answer</summary>

If `lo + hi` exceeds 2^31 − 1, ToInt32 wraps it negative and the mid-point is garbage. Use `lo + ((hi - lo) >> 1)` or `Math.floor((lo + hi) / 2)` (safe up to 2^53).
</details>

**6. How do you set, clear, toggle and test bit i?**
<details><summary>Model answer</summary>

Set `x | (1 << i)`, clear `x & ~(1 << i)`, toggle `x ^ (1 << i)`, test `(x >> i) & 1` or `(x & (1 << i)) !== 0`.
</details>

**7. What does `1 << 32` evaluate to in JavaScript, and why?**
<details><summary>Model answer</summary>

1. Shift counts are taken modulo 32, so it is `1 << 0`. Likewise `1 << 31` is −2147483648 because bit 31 is the sign bit.
</details>

**8. When would you use BigInt for bit work, and what are its limits?**
<details><summary>Model answer</summary>

When values exceed 32 bits (64-bit IDs, hashes, masks over more than 31 items). BigInt supports `& | ^ ~ << >>` with arbitrary precision, but has no `>>>`, cannot be mixed with Number, and is slower. `BigInt.asUintN` / `asIntN` wrap to a fixed width.
</details>

**9. Is `x | 0` the same as `Math.floor(x)`?**
<details><summary>Model answer</summary>

No. It truncates toward zero (`-3.9 | 0 === -3`, floor gives −4), and it wraps values outside int32 (`1e10 | 0 === 1410065408`). Use it only when you know x is a small integer-ish value.
</details>

**10. Why do bitwise expressions need parentheses with comparisons?**
<details><summary>Model answer</summary>

`&`, `|`, `^` have lower precedence than `===`/`!==`. `x & 1 === 0` parses as `x & (1 === 0)` → `x & false` → 0. Write `(x & 1) === 0`.
</details>

**11. How would you store 5 boolean flags compactly, and check that all of a group are set?**
<details><summary>Model answer</summary>

One integer with one bit per flag. Build a query mask `q` by OR-ing the flags; all set means `(mask & q) === q`, any set means `(mask & q) !== 0`.
</details>

**12. How do you convert binary to hex without parsing the whole number?**
<details><summary>Model answer</summary>

Left-pad to a multiple of 4 bits, then map each 4-bit group to one hex digit (16 = 2^4). This is linear in the length and works for arbitrarily long strings.
</details>
