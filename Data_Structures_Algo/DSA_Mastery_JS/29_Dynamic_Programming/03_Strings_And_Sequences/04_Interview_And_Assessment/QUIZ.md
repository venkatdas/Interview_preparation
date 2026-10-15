# DP on Strings and Sequences — Quiz

Try each on paper first, then open the answer. Back to the [sub-topic README](../README.md).

**1. (Define the state) Edit distance between `word1` and `word2`: what is `dp[i][j]`?**

<details><summary>Answer</summary>

The minimum number of insert/delete/replace operations to turn the first `i` characters of `word1` into the first `j` characters of `word2`.
</details>

**2. (Compute) LCS of `"abcde"` and `"ace"`?**

<details><summary>Answer</summary>

**3** (`"ace"`).
</details>

**3. (Compute) Edit distance of `"horse"` → `"ros"`?**

<details><summary>Answer</summary>

**3**: horse → rorse (replace h) → rose (delete r) → ros (delete e).
</details>

**4. (Multiple choice) Longest common SUBSTRING mismatch rule:**
a) `max(dp[i-1][j], dp[i][j-1])`  b) `dp[i-1][j-1]`  c) `0`  d) `dp[i-1][j-1] + 1`

<details><summary>Answer</summary>

c) The contiguous run breaks, so the value resets to 0.
</details>

**5. (Spot the bug)**

```js
for (let i = 1; i <= m; i++)
  for (let j = 1; j <= n; j++)
    dp[i][j] = a[i-1] === b[j-1] ? Math.max(dp[i-1][j], dp[i][j-1]) + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
```

<details><summary>Answer</summary>

On a match it should be `dp[i-1][j-1] + 1` (diagonal). Using top/left + 1 can count one character twice (e.g. `a = "a"`, `b = "aa"` gives 2 instead of 1).
</details>

**6. (Complexity) LIS with "ends at i" DP vs patience sorting?**

<details><summary>Answer</summary>

O(n^2) time / O(n) space vs O(n log n) time / O(n) space.
</details>

**7. (Predict) Patience-sorting `tails` after processing `[3, 1, 4, 1, 5]`?**

<details><summary>Answer</summary>

3 → [3]; 1 → [1]; 4 → [1,4]; 1 → [1,4] (replaces 1 with 1); 5 → [1,4,5]. LIS length **3**.
</details>

**8. (Spot the bug) Longest palindromic substring table filled with `for (l = 0; l < n; l++) for (r = l; r < n; r++) isPal[l][r] = s[l] === s[r] && (r - l < 2 || isPal[l+1][r-1]);`**

<details><summary>Answer</summary>

`isPal[l+1][r-1]` belongs to a later `l` and is not computed yet. Iterate `l` from n-1 down to 0, or by increasing length.
</details>

**9. (Multiple choice) Minimum insertions to make `"mbadm"` a palindrome equals:**
a) n - LCS(s, s)  b) n - LPS(s)  c) number of distinct characters  d) n / 2

<details><summary>Answer</summary>

b) LPS("mbadm") = 3 ("mam" / "mbm"), so 5 - 3 = **2**.
</details>

**10. (Define the state) Distinct Subsequences: what are `dp[i][0]` and `dp[0][j]` (j > 0)?**

<details><summary>Answer</summary>

`dp[i][0] = 1` (the empty `t` is formed exactly one way: pick nothing); `dp[0][j] = 0` (a non-empty `t` cannot come from an empty `s`).
</details>

**11. (Spot the bug) 1D Distinct Subsequences loops `j` from 1 up to n.**

<details><summary>Answer</summary>

Going left to right overwrites `dp[j-1]` (the previous row's value) before `dp[j]` reads it, so one character of `s` is used twice. Loop `j` from n down to 1.
</details>

**12. (Predict) Regex: does `"aab"` match `"c*a*b"`?**

<details><summary>Answer</summary>

**Yes**: `c*` matches zero c's, `a*` matches "aa", `b` matches "b".
</details>

**13. (Complexity) Interleaving String with a table, and with one row?**

<details><summary>Answer</summary>

O(m·n) time; O(m·n) space with the full table, O(n) with one row.
</details>

## Mastery checklist

- [ ] I can write LCS and edit distance from memory, including base cases, and shrink them to one row.
- [ ] I can explain subsequence vs substring in one sentence and change the recurrence accordingly.
- [ ] I can code LIS in O(n log n) and explain why it uses lower bound.
- [ ] I can fill an interval (palindrome) table in a valid order.
- [ ] I can reconstruct an actual answer (LCS string or SCS) by walking the table backwards.
