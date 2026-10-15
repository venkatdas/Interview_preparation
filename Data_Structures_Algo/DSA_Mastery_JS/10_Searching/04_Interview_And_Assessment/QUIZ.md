# Searching — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Multiple choice — maximum number of comparisons for binary search on 1,000,000 sorted items

A) about 10  B) about 20  C) about 1,000  D) about 500,000

<details><summary>Answer</summary>

**B.** log2(10^6) ≈ 20.

</details>

### Q2. Predict the output

```js
function lowerBound(a, x) { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] < x) lo = m + 1; else hi = m; } return lo; }
console.log(lowerBound([1, 3, 3, 5], 3), lowerBound([1, 3, 3, 5], 4), lowerBound([1, 3, 3, 5], 9));
```

<details><summary>Answer</summary>

`1 3 4`.

</details>

### Q3. Spot the bug

```js
let lo = 0, hi = a.length - 1;
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (a[mid] === x) return mid;
  if (a[mid] < x) lo = mid + 1; else hi = mid - 1;
}
return -1;
```

<details><summary>Answer</summary>

With `lo < hi` the last remaining element is never checked: searching 5 in `[5]` returns −1. Use `while (lo <= hi)` for this exact-match template.

</details>

### Q4. Spot the bug (search last true)

```js
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (ok(mid)) lo = mid; else hi = mid - 1;
}
```

<details><summary>Answer</summary>

When `hi = lo + 1` and `ok(lo)` is true, mid equals lo and `lo = mid` never changes: infinite loop. Round up: `mid = Math.floor((lo + hi + 1) / 2)`.

</details>

### Q5. Complexity — Koko Eating Bananas with n piles and max pile size M

<details><summary>Answer</summary>

O(n log M) time, O(1) space.

</details>

### Q6. Predict the output

```js
console.log((2 ** 31 + 2) >> 1, Math.floor((2 ** 31 + 2) / 2));
```

<details><summary>Answer</summary>

`-1073741823 1073741825`. `>>` works on 32-bit signed integers, so large values wrap.

</details>

### Q7. Multiple choice — in a rotated sorted array (distinct values), at every mid

A) both halves are sorted  B) at least one half is sorted  C) neither half is sorted  D) the left half is always sorted

<details><summary>Answer</summary>

**B.**

</details>

### Q8. Spot the bug (find minimum in rotated sorted array)

```js
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (a[mid] > a[hi]) lo = mid + 1; else hi = mid - 1;
}
return a[lo];
```

<details><summary>Answer</summary>

`hi = mid − 1` can skip the minimum when `a[mid]` is the minimum. Use `hi = mid`.

</details>

### Q9. Complexity — searching a fully sorted m × n matrix (each row starts after the previous row ends)

<details><summary>Answer</summary>

O(log(m·n)) with one binary search over the flattened index.

</details>

### Q10. Multiple choice — which is NOT a valid binary search target?

A) smallest capacity that ships packages in D days  B) a peak element in an unsorted array  C) any element in an unsorted array  D) first bad version

<details><summary>Answer</summary>

**C.** There is no monotone property to halve on.

</details>

### Q11. Predict the answer

Single Element in a Sorted Array: `[1, 1, 2, 3, 3, 4, 4]`. Which index holds the single element, and what does `nums[mid] === nums[mid ^ 1]` tell you at mid = 2?

<details><summary>Answer</summary>

Index 2 (value 2). At mid = 2, `mid ^ 1` = 3 and `nums[2] !== nums[3]`, so the pairing is already broken at or before mid; search left (`hi = mid`).

</details>

### Q12. Spot the bug (capacity to ship)

```js
let lo = 1, hi = weights.reduce((a, b) => a + b, 0);
```

<details><summary>Answer</summary>

The lower bound must be `Math.max(...weights)`: a capacity smaller than the heaviest package can never work, and the feasibility check may wrongly accept it or loop.

</details>

## Mastery checklist

- [ ] I can write exact-match, lower-bound and upper-bound templates without off-by-one errors.
- [ ] I can recognise "binary search on the answer" and write the feasibility check.
- [ ] I can solve Search in Rotated Sorted Array and Find Minimum in Rotated Sorted Array.
- [ ] I know when `>> 1` is unsafe in JavaScript.
- [ ] I scored at least 10/12 on this quiz.
