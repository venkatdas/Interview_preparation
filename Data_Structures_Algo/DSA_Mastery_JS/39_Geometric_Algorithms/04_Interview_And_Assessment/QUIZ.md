# Geometric Algorithms — Quiz

Try each question on paper, then open the answer. Back to the [topic README](../README.md).

**1. (Compute) `cross([0,0], [2,0], [1,3])` = ? Which way does the path turn?**

<details><summary>Answer</summary>

`(2)(3) - (0)(1) = 6 > 0` → counter-clockwise (left turn). Area of the triangle = 6 / 2 = 3.
</details>

**2. (Multiple choice) Monotone-chain convex hull runs in:**
a) O(n)  b) O(n log n)  c) O(n h) where h = hull size  d) O(n^2)

<details><summary>Answer</summary>

b) The sort dominates; the two stack passes are O(n).
</details>

**3. (Spot the bug) Max Points on a Line key:** `const key = dy / dx;`

<details><summary>Answer</summary>

Division: vertical lines give `Infinity` / `-Infinity` (two different keys for the same line) and float rounding can split equal slopes. Use the reduced integer pair `(dx/g, dy/g)` with a normalised sign as the key.
</details>

**4. (Predict) Rectangles `[0,0,1,1]` and `[1,1,2,2]` — do they overlap (positive area)?**

<details><summary>Answer</summary>

No. They touch only at the corner (1,1); the overlap width and height are both 0.
</details>

**5. (Compute) Area of the polygon `(0,0), (4,0), (4,3), (0,3)` using shoelace.**

<details><summary>Answer</summary>

Sum = 0·0 - 4·0 + 4·3 - 4·0 + 4·3 - 0·3 + 0·0 - 0·3 = 0 + 12 + 12 + 0 = 24 → area = 12.
</details>

**6. (Spot the bug) Erect the Fence returns too few trees for `[[0,0],[1,0],[2,0],[1,1]]`.** The pop condition is `cross(...) <= 0`. What is wrong?

<details><summary>Answer</summary>

`<= 0` also pops collinear points, so `[1,0]` on the bottom edge is dropped. Erect the Fence needs `cross < 0` to keep boundary points.
</details>

**7. (Multiple choice) Which value is the same for all six pairwise distances of a square?**
a) none — there are exactly two distinct values  b) all six are equal  c) three distinct values  d) depends on rotation

<details><summary>Answer</summary>

a) Four sides `s` and two diagonals `2s` (squared).
</details>

**8. (Complexity) Minimum Area Rectangle by checking every pair as a diagonal with a point Set costs?**

<details><summary>Answer</summary>

O(n^2) time (pairs) with O(1) Set lookups for the other two corners, O(n) space.
</details>

**9. (Define the state) In the lower-hull loop, what does the stack contain at any moment?**

<details><summary>Answer</summary>

The lower hull of all points processed so far (sorted by x), where every consecutive triple turns counter-clockwise.
</details>

**10. (Multiple choice) Squared coordinates up to 10^9 — is `dx*dx + dy*dy` exact in JavaScript?**
a) yes, always  b) no, it can exceed 2^53  c) only for positive numbers  d) only with Math.hypot

<details><summary>Answer</summary>

b) `(2·10^9)^2 ≈ 4·10^18 > 2^53 ≈ 9·10^15`. Use BigInt for exactness.
</details>

**11. (Predict) `segmentsIntersect([0,0],[4,0],[2,0],[6,0])`?**

<details><summary>Answer</summary>

`true` — all orientations are 0 (collinear), and `[2,0]` lies on the first segment, so they overlap.
</details>

**12. (Complexity) K Closest Points with a max-heap of size k?**

<details><summary>Answer</summary>

O(n log k) time, O(k) space.
</details>

## Mastery checklist

- [ ] I can write `cross` from memory and say what its sign and magnitude mean.
- [ ] I can code segment intersection, including the collinear special cases.
- [ ] I can code monotone-chain convex hull in both strict and keep-collinear forms.
- [ ] I can solve Max Points on a Line with exact integer direction keys.
- [ ] I know when to switch to BigInt or an epsilon, and I can explain why.
