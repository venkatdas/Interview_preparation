# Interval DP — Quiz

Back to the [topic README](../README.md).

**1. (Define the state) Burst Balloons: what exactly does `dp[l][r]` mean on the padded array?**

<details><summary>Answer</summary>

The maximum coins from bursting every balloon strictly between l and r, with balloons l and r still present.
</details>

**2. (Compute) Matrix chain with dims = [10, 20, 30]. Minimum cost?**

<details><summary>Answer</summary>

Only one split: 10 · 20 · 30 = **6000**.
</details>

**3. (Compute) Matrix chain with dims = [2, 3, 4, 5]. Minimum cost?**

<details><summary>Answer</summary>

(AB)C = 2·3·4 + 2·4·5 = 24 + 40 = **64**; A(BC) = 3·4·5 + 2·3·5 = 60 + 30 = 90. Answer 64.
</details>

**4. (Spot the bug)**

```js
for (let l = 0; l < n; l++)
  for (let r = l + 1; r < n; r++)
    for (let k = l; k < r; k++)
      dp[l][r] = Math.min(dp[l][r], dp[l][k] + dp[k + 1][r] + cost(l, k, r));
```

<details><summary>Answer</summary>

`dp[k+1][r]` has a larger l than the current row, so it has not been computed yet. Loop by increasing length, or loop l from n-1 down to 0.
</details>

**5. (Multiple choice) Typical time complexity of a split-at-k interval DP over n elements:**
a) O(n)  b) O(n^2)  c) O(n^3)  d) O(2^n)

<details><summary>Answer</summary>

c) O(n^2) states × O(n) split choices.
</details>

**6. (Predict) Predict the Winner on `[1, 5, 233, 7]` returns?**

<details><summary>Answer</summary>

`true`. Player 1 takes 1, and whatever player 2 takes next, player 1 can take 233.
</details>

**7. (Compute) Burst Balloons on `[3, 1, 5]`?**

<details><summary>Answer</summary>

**35**: burst 1 (3·1·5 = 15), then 3 (1·3·5 = 15), then 5 (1·5·1 = 5).
</details>

**8. (Spot the bug) Minimum Cost to Cut a Stick:** `const c = [0, ...cuts, n];` followed directly by the DP.

<details><summary>Answer</summary>

The cuts are not sorted. The DP assumes `c` is increasing so that `c[j] - c[i]` is the length of the current piece.
</details>

**9. (Multiple choice) Which problem needs a 3D interval state?**
a) Matrix Chain  b) Remove Boxes  c) Burst Balloons  d) Stone Game

<details><summary>Answer</summary>

b) `dp[l][r][k]` with k = boxes equal to `boxes[l]` already attached.
</details>

**10. (Complexity) Palindrome Partitioning II with a precomputed `isPal` table?**

<details><summary>Answer</summary>

O(n^2) time and O(n^2) space (the table), plus O(n) for the cuts array.
</details>

**11. (Define the state) Minimum Score Triangulation: what are the choices for `dp[i][j]`?**

<details><summary>Answer</summary>

Every apex k with i < k < j forms triangle (i, k, j): `dp[i][k] + dp[k][j] + v[i]·v[k]·v[j]`. Base: `dp[i][j] = 0` when `j - i < 2`.
</details>

**12. (Compute) Strange Printer on `"aba"`?**

<details><summary>Answer</summary>

**2**: print "aaa", then print "b" over the middle.
</details>

## Mastery checklist

- [ ] I can write the length-ordered interval DP skeleton from memory.
- [ ] I can solve Matrix Chain and Minimum Cost to Cut a Stick and explain the split cost.
- [ ] I can explain the "last operation" trick and solve Burst Balloons.
- [ ] I can model a two-ends game with a score-difference DP.
- [ ] I can recognise when the state needs an extra dimension (Remove Boxes) or when interval DP does not apply.
