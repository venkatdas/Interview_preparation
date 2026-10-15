# Fenwick Tree (BIT) — Quiz

Back to the [topic README](../README.md).

**1. (Compute) What is `12 & -12`?**

<details><summary>Answer</summary>

12 = 1100b, its lowest set bit is 0100b = **4**. So `tree[12]` covers positions 9..12.
</details>

**2. (Compute) Which tree indices does `prefixSum(13)` visit (1-indexed)?**

<details><summary>Answer</summary>

13 (1101) → 12 (1100) → 8 (1000) → 0. Indices **13, 12, 8**, covering [13], [9..12], [1..8].
</details>

**3. (Compute) Which indices does `update(5, +1)` touch when n = 16?**

<details><summary>Answer</summary>

5 → 6 → 8 → 16. Indices **5, 6, 8, 16**.
</details>

**4. (Spot the bug)**

```js
update(i, delta) { for (; i <= this.n; i += i & -i) this.tree[i] += delta; }
// called as bit.update(0, 5) with a 0-indexed position
```

<details><summary>Answer</summary>

With i = 0, `i & -i = 0`, so the loop never advances — infinite loop. Convert to 1-indexed (`i = index + 1`) first.
</details>

**5. (Spot the bug) NumArray.update(index, val) calls `bit.update(index, val)`.**

<details><summary>Answer</summary>

LeetCode's update SETS the value; a BIT adds deltas. Use `bit.update(index, val - nums[index]); nums[index] = val;`.
</details>

**6. (Multiple choice) Which operation can a plain Fenwick tree answer for arbitrary ranges?**
a) min  b) max  c) xor  d) gcd

<details><summary>Answer</summary>

c) xor, because xor is its own inverse: `prefix(r) ^ prefix(l-1)`.
</details>

**7. (Complexity) Count of Smaller Numbers After Self with a BIT?**

<details><summary>Answer</summary>

O(n log n) time (compression + n queries + n updates), O(n) space.
</details>

**8. (Predict) BIT over counts of values 0..4 after inserting 3, 1, 3. What is `prefixSum(2)` (values ≤ 2) and `rangeSum(3, 4)`?**

<details><summary>Answer</summary>

`prefixSum(2) = 1` (just the 1); `rangeSum(3, 4) = 2` (two 3s).
</details>

**9. (Define the state) In "Reverse Pairs" with a BIT scanned left to right, what does the BIT hold when processing index j?**

<details><summary>Answer</summary>

Counts (by compressed rank) of all `nums[i]` with i < j. We ask how many of them are `> 2 * nums[j]`.
</details>

**10. (Multiple choice) O(n) build works because each node…**
a) is visited log n times  b) pushes its total to exactly one parent  c) is sorted  d) uses lazy tags

<details><summary>Answer</summary>

b) The parent of i is `i + lowbit(i)`; one addition per node.
</details>

**11. (Complexity) Space of a BIT over n elements?**

<details><summary>Answer</summary>

O(n) — exactly n + 1 numbers.
</details>

## Mastery checklist

- [ ] I can write `update`, `prefixSum` and `rangeSum` from memory without an off-by-one.
- [ ] I can draw which ranges `tree[1..8]` cover.
- [ ] I can solve Count of Smaller Numbers After Self with compression + BIT.
- [ ] I can explain why a BIT cannot do range min and when to switch to a segment tree.
- [ ] I can describe range-add with a difference BIT.
