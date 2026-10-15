# Meet in the Middle — Self-Assessment Quiz

Back to the topic: [README](../README.md)

### Q1. Complexity
n = 40. Roughly how many half sums does meet in the middle create in total?
A) 40  B) 2 · 2^20 ≈ 2·10^6  C) 2^40  D) 40²

<details><summary>Answer</summary>

**B.** Two halves of 20 elements, 2^20 subset sums each.

</details>

### Q2. Choose the combine
"Count subsets whose sum is exactly T" — best combine?
A) two pointers on unsorted lists  B) frequency map  C) a Set  D) nested loops

<details><summary>Answer</summary>

**B.** A Set loses multiplicities; nested loops bring back 2^n.

</details>

### Q3. Predict the output

```js
console.log([10, 9, 1, -5].sort());
```

<details><summary>Answer</summary>

`[ -5, 1, 10, 9 ]` — default sort compares strings ("-5" < "1" < "10" < "9"). Always pass `(a, b) => a - b`.

</details>

### Q4. Predict the output

```js
const { sortedSubsetSums } = require('../02_Implementations/meet_in_the_middle');
console.log(sortedSubsetSums([2, 2]));
```

<details><summary>Answer</summary>

`[0, 2, 2, 4]` — the duplicate 2 is kept because it comes from two different subsets.

</details>

### Q5. Spot the bug

```js
for (const l of L) {
  const p = lowerBound(R, goal - l);
  if (p < R.length) best = Math.min(best, Math.abs(l + R[p] - goal));
}
```

<details><summary>Answer</summary>

It never checks `R[p - 1]`, the largest value below `goal − l`, which can be closer. Add
`if (p > 0) best = Math.min(best, Math.abs(l + R[p - 1] - goal));`.

</details>

### Q6. When NOT to use it
n = 100, values ≤ 50, "is there a subset with sum T?" Use meet in the middle?

<details><summary>Answer</summary>

**No.** 2^50 per half is impossible. Sums are at most 5000, so a DP over sums (O(n · S) = 5·10^5) is ideal.

</details>

### Q7. Complexity of the merge trick
Generating a half's sums in sorted order by repeated merging costs:
A) O(2^h log 2^h)  B) O(2^h)  C) O(h²)  D) O(4^h)

<details><summary>Answer</summary>

**B.** Merges of size 1, 2, 4, …, 2^(h−1) add up to less than 2 · 2^h.

</details>

### Q8. Size-constrained combine
Group must have exactly 5 items from 10 numbers split 5 + 5. A left subset of size 2 must pair with
right subsets of which size?

<details><summary>Answer</summary>

Size **3** (5 − 2).

</details>

### Q9. Two pointers
L = [-1, 0, 2, 3], R = [0, 2, 4, 6], T = 3. How many pairs have l + r ≤ T?

<details><summary>Answer</summary>

**7** (3 + 2 + 1 + 1). This is the dry run from CONCEPTS.md.

</details>

### Q10. Spot the bug

```js
const freq = new Set(R);
let count = 0;
for (const l of L) if (freq.has(T - l)) count++;
```

<details><summary>Answer</summary>

Using a Set: if several right subsets share the sum `T − l`, they are counted once. Use a Map of counts.

</details>

### Q11. Transformation
Equal-sum split of n numbers into labelled groups A and B. What do you look for in each half?

<details><summary>Answer</summary>

All ±-signed totals (+ for A, − for B); count pairs of left total `x` and right total `−x`.

</details>

### Q12. Precision
Why does Split Array With Same Average use `nums[i] * n − total` instead of `nums[i] − total / n`?

<details><summary>Answer</summary>

To stay in integers. `total / n` can be fractional, and floating-point sums may miss an exact 0.

</details>

## Mastery checklist

- [ ] I can explain why 2^40 → 2 · 2^20 and state the n ≈ 40 recognition rule.
- [ ] I can write `subsetSums` (iterative doubling) and `sortedSubsetSums` (merge trick) from memory.
- [ ] I can pick the right combine (hash / binary search / two pointers) for exact / closest / ≤ questions.
- [ ] I solved Partition Array Into Two Arrays (size buckets) without hints.
- [ ] I can say when DP over sums is the better choice.
