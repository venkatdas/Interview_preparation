# Prefix Sums & Difference Arrays — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Predict the output

```js
const a = [3, -1, 4, 1];
const p = [0];
for (const x of a) p.push(p[p.length - 1] + x);
console.log(p.join(','), p[3] - p[1]);
```

<details><summary>Answer</summary>

`0,3,2,6,7 3`. `p[3] − p[1]` is the sum of `a[1..2]` = −1 + 4.

</details>

### Q2. Multiple choice — the sum of `a[l..r]` (inclusive) with an n + 1 prefix array is

A) `p[r] − p[l]`  B) `p[r + 1] − p[l]`  C) `p[r] − p[l − 1]`  D) `p[r + 1] − p[l + 1]`

<details><summary>Answer</summary>

**B.**

</details>

### Q3. Spot the bug (subarray sum equals k)

```js
const seen = new Map();
let p = 0, ans = 0;
for (const x of nums) { p += x; seen.set(p, (seen.get(p) || 0) + 1); ans += seen.get(p - k) || 0; }
```

<details><summary>Answer</summary>

Two bugs: the map is not seeded with `{0: 1}`, and the current prefix is inserted before the lookup, so for k = 0 every position counts an empty subarray. Seed the map and look up before inserting.

</details>

### Q4. Predict the output

```js
console.log(-7 % 3, ((-7 % 3) + 3) % 3);
```

<details><summary>Answer</summary>

`-1 2`.

</details>

### Q5. Complexity — m range-add updates on an array of length n, then one read of the final array

<details><summary>Answer</summary>

O(m + n) with a difference array, versus O(m · n) applying each update cell by cell.

</details>

### Q6. Predict the output (difference array)

Length 5, updates: add 2 to [1, 3], add 1 to [0, 4], add −3 to [3, 4]. Final array?

<details><summary>Answer</summary>

`[1, 3, 3, 0, -2]`.

</details>

### Q7. Multiple choice — for the LONGEST subarray with sum k, the prefix map should store

A) the latest index  B) the earliest index  C) a count  D) a list of all indices

<details><summary>Answer</summary>

**B.** And seed it with `{0: -1}`.

</details>

### Q8. Spot the bug (2D region sum)

```js
return S[r2 + 1][c2 + 1] - S[r1][c2 + 1] - S[r2 + 1][c1];
```

<details><summary>Answer</summary>

The top-left block was subtracted twice; add back `S[r1][c1]`.

</details>

### Q9. Complexity — Range Sum Query with point updates, using a plain prefix array

<details><summary>Answer</summary>

Query O(1) but each update O(n) (rebuild the suffix of the prefix array). With many updates, use a Fenwick tree for O(log n) each.

</details>

### Q10. Multiple choice — which question can prefix sums NOT answer in O(1) per query?

A) range sum  B) range XOR  C) range maximum  D) count of 1s in a range

<details><summary>Answer</summary>

**C.** Max is not invertible.

</details>

### Q11. Predict the answer

Contiguous Array on `[0, 1, 1, 0, 1]`: what is the longest subarray with equal 0s and 1s?

<details><summary>Answer</summary>

`4`, the subarray `[0, 1, 1, 0]` (indices 0..3). Prefix sums with 0 → −1 are 0, −1, 0, 1, 0, 1 (including the leading 0); the value 0 first appears at index −1 and again after index 3.

</details>

### Q12. Spot the bug (car pooling)

```js
diff[from] += num;
diff[to + 1] -= num;
```

<details><summary>Answer</summary>

Passengers leave the car *at* `to`, so the decrement belongs at `diff[to]`, not `to + 1`. Otherwise a pick-up at the same stop is wrongly counted as overlapping.

</details>

## Mastery checklist

- [ ] I can build 1D and 2D prefix sums and answer range queries without off-by-one errors.
- [ ] I can explain and code the prefix sum + hash map counting pattern, including the `{0: 1}` seed.
- [ ] I can handle negative remainders in JavaScript correctly.
- [ ] I can use a difference array for batch range updates.
- [ ] I scored at least 10/12 on this quiz.
