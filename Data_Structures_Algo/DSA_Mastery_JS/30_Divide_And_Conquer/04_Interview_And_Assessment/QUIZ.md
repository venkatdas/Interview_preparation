# Divide and Conquer: Quiz

Try every question before opening the answer.
Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [interview questions](INTERVIEW_QUESTIONS.md)

---

### 1. (Complexity) Solve `T(n) = 2T(n/2) + O(n)`.

<details><summary>Answer</summary>

**O(n log n)** (master theorem case 2: merge sort, inversions, skyline).

</details>

### 2. (Complexity) Solve `T(n) = T(n/2) + O(1)`.

<details><summary>Answer</summary>

**O(log n)** (binary search, fast power).

</details>

### 3. (Complexity) Solve `T(n) = T(n/2) + O(n)`.

<details><summary>Answer</summary>

**O(n)**: `n + n/2 + n/4 + ... < 2n` (quickselect on average).

</details>

### 4. (Multiple choice) Which recurrence describes Karatsuba multiplication?

A) `4T(n/2) + n`   B) `3T(n/2) + n`   C) `2T(n/2) + n`   D) `T(n-1) + n`

<details><summary>Answer</summary>

**B**, giving O(n^log2(3)) ≈ O(n^1.585). Option A is the naive split, which is still O(n²).

</details>

### 5. (Predict the output)

```js
const { countInversions } = require('../02_Implementations/divide_and_conquer');
console.log(countInversions([3, 1, 2]));
```

<details><summary>Answer</summary>

**2**: pairs (3,1) and (3,2).

</details>

### 6. (Predict the output)

```js
const { maxSubarrayDC } = require('../02_Implementations/divide_and_conquer');
console.log(maxSubarrayDC([-4, -2, -7]));
```

<details><summary>Answer</summary>

**-2**: with all negatives, the best subarray is the single largest element.

</details>

### 7. (Spot the bug)

```js
function pow(x, n) {
  if (n === 0) return 1;
  if (n % 2 === 0) return pow(x, n / 2) * pow(x, n / 2);
  return x * pow(x, n - 1);
}
```

<details><summary>Answer</summary>

Calling `pow(x, n / 2)` twice gives `T(n) = 2T(n/2) + 1`, which is O(n), not O(log n).
Compute `const half = pow(x, n / 2)` once and return `half * half`. It also does not handle
negative `n`.

</details>

### 8. (Spot the bug) Crossing sum in maximum subarray:

```js
let bestLeft = 0, sum = 0;
for (let i = mid; i >= lo; i--) { sum += nums[i]; bestLeft = Math.max(bestLeft, sum); }
```

<details><summary>Answer</summary>

`bestLeft` must start at `-Infinity`. Starting at 0 lets the crossing part "take nothing" from
the left, which is not a valid crossing subarray and gives wrong answers on all-negative input.

</details>

### 9. (Multiple choice) Merging k sorted lists one after another (1+2, then +3, ...) costs:

A) O(N log k)   B) O(N k)   C) O(N)   D) O(k log N)

<details><summary>Answer</summary>

**B.** Elements of the first list are copied about k times. Pairwise D&C gives O(N log k).

</details>

### 10. (Multiple choice) Which problem is best solved by memoised D&C (that is, DP)?

A) Merge sort   B) Count inversions   C) Different Ways to Add Parentheses   D) Binary search

<details><summary>Answer</summary>

**C.** The same substrings are split many times, so sub-problems overlap.

</details>

### 11. (Predict the output) Beautiful Array construction: from `[1, 2]` (beautiful for n = 2), apply odd = `2x - 1`, even = `2x`. What array do you get for n = 4?

<details><summary>Answer</summary>

Odds `[1, 3]` then evens `[2, 4]` → **`[1, 3, 2, 4]`**. No `k` between `i` and `j` with
`2·a[k] = a[i] + a[j]`, because an odd plus an even is odd.

</details>

### 12. (Spot the bug) Median of two sorted arrays binary search loops over the LONGER array. What goes wrong?

<details><summary>Answer</summary>

`j = half - i` can become negative or larger than the shorter array's length, so you read
out of range (undefined) and comparisons break. Always binary search the shorter array.
It also costs O(log max) instead of O(log min).

</details>

### 13. (Complexity) What is the extra space of top-down merge sort that slices arrays?

<details><summary>Answer</summary>

**O(n)** extra memory alive at any time (the merged arrays), plus O(log n) recursion depth.
Total allocations over the run are O(n log n), but garbage is freed level by level.

</details>

### 14. (Multiple choice) Quick sort on an already-sorted array with the FIRST element as pivot:

A) O(n)   B) O(n log n)   C) O(n²)   D) O(log n)

<details><summary>Answer</summary>

**C.** Every partition peels off one element, so `T(n) = T(n-1) + n`.

</details>

---

## Mastery checklist

- [ ] I can solve any `aT(n/b) + f(n)` recurrence with the master theorem in under a minute.
- [ ] I can write merge sort and count inversions from memory, with correct tie handling.
- [ ] I can explain the crossing case of maximum subarray and why Kadane is still preferred.
- [ ] I can implement fast power (iterative) and the median of two sorted arrays without off-by-one errors.
- [ ] I can tell when D&C sub-problems overlap and switch to memoisation / DP.
