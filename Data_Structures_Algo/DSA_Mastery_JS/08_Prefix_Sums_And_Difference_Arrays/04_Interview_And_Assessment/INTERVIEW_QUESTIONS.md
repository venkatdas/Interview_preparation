# Prefix Sums & Difference Arrays — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. What is a prefix sum and what does it buy you?

<details><summary>Model answer</summary>

`prefix[i]` is the sum of the first i elements (`prefix[0] = 0`). Building it is O(n). Afterwards any range sum `[l, r]` is `prefix[r + 1] − prefix[l]` in O(1). It turns "many range-sum queries" from O(n) each into O(1) each.

</details>

### 2. Why use an array of length n + 1 with `prefix[0] = 0`?

<details><summary>Model answer</summary>

It represents the empty prefix, so ranges starting at index 0 need no special case: `sum(0, r) = prefix[r + 1] − prefix[0]`. It also pairs naturally with the hash-map trick, where the seed `{0: 1}` is the same idea.

</details>

### 3. How do you count subarrays whose sum is exactly k in O(n)?

<details><summary>Model answer</summary>

Walk with a running prefix `p`. A subarray ending here has sum k iff some earlier prefix equals `p − k`. Keep a map prefix → count seeded with `{0: 1}`; add `count[p − k]` to the answer, then increment `count[p]`. Works with negatives.

</details>

### 4. How do you find the longest subarray with sum k? What changes compared to counting?

<details><summary>Model answer</summary>

Store the *first* index at which each prefix sum appears (seed `{0: −1}`), and never overwrite it. At index i, if `p − k` was seen at j, the length is `i − j`. Keeping the earliest index maximises the length; for the shortest you would keep the latest.

</details>

### 5. Subarray Sums Divisible by K: what is the trick, and the JavaScript pitfall?

<details><summary>Model answer</summary>

Two prefixes with the same remainder mod k bound a subarray whose sum is divisible by k. Count remainders and add `count[r]` each step. Pitfall: `%` in JS keeps the sign, so a negative prefix gives a negative remainder; normalise with `((p % k) + k) % k`.

</details>

### 6. What is a difference array and when do you use it?

<details><summary>Model answer</summary>

To add v to every element of `[l, r]` many times and read the final array once: do `diff[l] += v`, `diff[r + 1] −= v` (O(1) per update), then take a running sum of `diff` (O(n) once). It is the inverse of prefix sums. Used in Corporate Flight Bookings, Car Pooling, range coverage counts.

</details>

### 7. How do 2D prefix sums work?

<details><summary>Model answer</summary>

`S[r + 1][c + 1] = grid[r][c] + S[r][c + 1] + S[r + 1][c] − S[r][c]` (inclusion–exclusion). A rectangle sum is `S[r2+1][c2+1] − S[r1][c2+1] − S[r2+1][c1] + S[r1][c1]`. Build O(m·n), query O(1).

</details>

### 8. Prefix sums vs Fenwick tree vs segment tree: how do you choose?

<details><summary>Model answer</summary>

No updates: prefix sums (O(1) query). Point updates + range sums: Fenwick tree (O(log n) both, simple). Range updates, min/max queries or more complex merges: segment tree (O(log n), more code). Many range updates then one read: difference array.

</details>

### 9. How does "Contiguous Array" (equal 0s and 1s) become a prefix-sum problem?

<details><summary>Model answer</summary>

Map 0 → −1 and 1 → +1. A subarray with equal counts now has sum 0, which means two equal prefix sums. Store the first index of each prefix (seed `{0: −1}`) and maximise `i − first[p]`.

</details>

### 10. Can prefix sums answer range maximum queries?

<details><summary>Model answer</summary>

No. Sums are invertible (you can subtract a prefix), but max is not: knowing the max of `[0, r]` and `[0, l − 1]` does not give the max of `[l, r]`. Use a sparse table (static) or a segment tree. Prefix max is still useful for "max so far" questions.

</details>

### 11. What overflow concerns exist with prefix sums in JavaScript?

<details><summary>Model answer</summary>

Numbers are doubles; integers are exact up to 2^53 − 1 (≈ 9·10^15). With n = 10^5 values up to 10^9 the total is 10^14, which is fine. Larger totals need `BigInt` or modular arithmetic.

</details>
