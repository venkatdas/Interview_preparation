# DP on Strings and Sequences — Interview Questions

Answer out loud first, then open the model answer. Back to the [sub-topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [DP overview](../../01_Concepts/OVERVIEW.md).

### 1. What does `dp[i][j]` mean in a two-string DP, and why is the table `(m+1) x (n+1)`?

<details><summary>Model answer</summary>

`dp[i][j]` is the answer for the first `i` characters of `a` and the first `j` characters of `b` (prefixes). The extra row and column represent the empty prefix, which gives clean base cases (`dp[0][j]`, `dp[i][0]`) and removes all `i - 1 < 0` checks.
</details>

### 2. Explain the LCS recurrence and why it is correct.

<details><summary>Model answer</summary>

If `a[i-1] == b[j-1]`, some optimal LCS can end with that character, so `dp[i][j] = dp[i-1][j-1] + 1`. Otherwise at least one of the two last characters is not in the LCS, so `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`. Every case is covered and each sub-answer is optimal for its prefixes.
</details>

### 3. Subsequence vs substring — how does the recurrence change?

<details><summary>Model answer</summary>

For a common substring the match must be contiguous, so on a mismatch the run resets to 0, and `dp[i][j]` means "longest common substring ENDING at i-1 and j-1". The answer is the maximum over the whole table, not `dp[m][n]`.
</details>

### 4. Walk through the three operations of edit distance.

<details><summary>Model answer</summary>

To turn `a[0..i)` into `b[0..j)`: if the last characters match, `dp[i-1][j-1]`. Otherwise 1 + min of: delete `a[i-1]` → `dp[i-1][j]`, insert `b[j-1]` → `dp[i][j-1]`, replace → `dp[i-1][j-1]`. Base cases `dp[i][0] = i`, `dp[0][j] = j`.
</details>

### 5. How do you reduce the space of a two-string DP to O(n)?

<details><summary>Model answer</summary>

Row i only reads row i-1 and the current row. Keep two rows, or one row plus a `prev` variable holding the old diagonal `dp[i-1][j-1]` before it is overwritten. You lose the ability to reconstruct the answer unless you use Hirschberg's divide-and-conquer.
</details>

### 6. Give two ways to compute LIS and their complexities.

<details><summary>Model answer</summary>

(1) `dp[i]` = LIS ending at i = 1 + max `dp[j]` over j < i with `nums[j] < nums[i]`: O(n^2). (2) Patience sorting: keep `tails[k]` = smallest tail of an increasing subsequence of length k+1; for each x replace the first tail ≥ x (lower bound) or append: O(n log n).
</details>

### 7. Why does patience sorting use lower bound, and is `tails` the actual LIS?

<details><summary>Model answer</summary>

Lower bound (first `>= x`) keeps the subsequence strictly increasing: an equal value replaces instead of extending. For non-decreasing use upper bound. `tails` is not necessarily a real subsequence — only its length is guaranteed; reconstruct with parent pointers if needed.
</details>

### 8. How do you count the number of LIS?

<details><summary>Model answer</summary>

Keep `len[i]` and `count[i]`. For j < i with `nums[j] < nums[i]`: if `len[j] + 1 > len[i]`, set `len[i] = len[j] + 1, count[i] = count[j]`; if equal, `count[i] += count[j]`. Sum counts of all i with the maximum length. O(n^2), or O(n log n) with a segment tree over values.
</details>

### 9. How do you fill a palindrome DP on `[l, r]` in the right order?

<details><summary>Model answer</summary>

`dp[l][r]` depends on `dp[l+1][r-1]`, `dp[l+1][r]`, `dp[l][r-1]` — shorter intervals. Iterate by increasing length, or `l` from n-1 down to 0 and `r` from l up to n-1.
</details>

### 10. Minimum insertions to make a palindrome — what's the shortcut?

<details><summary>Model answer</summary>

`n - LPS(s)`, where LPS is the longest palindromic subsequence (which equals `LCS(s, reverse(s))`). Characters outside the LPS each need a mirrored partner inserted.
</details>

### 11. Wildcard `*` vs regex `*` — how do the recurrences differ?

<details><summary>Model answer</summary>

Wildcard `*` matches any sequence: `dp[i][j] = dp[i][j-1]` (empty) or `dp[i-1][j]` (consume one more char). Regex `x*` means zero or more of x: `dp[i][j] = dp[i][j-2]` (zero copies) or (`s[i-1]` matches x and `dp[i-1][j]`). Both have base rows where an empty string matches star-only patterns.
</details>

### 12. How do you reconstruct the actual LCS / shortest common supersequence?

<details><summary>Model answer</summary>

Keep the full table and walk back from `(m, n)`: on a match emit the character and move diagonally; otherwise move toward the larger neighbour (for SCS, emit the character you skip). Reverse the result at the end and, for SCS, append any leftover prefix.
</details>

### 13. Russian Doll Envelopes: why sort height descending for equal widths?

<details><summary>Model answer</summary>

After sorting by width, the problem is LIS on heights. Envelopes with the same width cannot nest, and sorting their heights descending makes it impossible for LIS to pick two of them (a descending run contributes at most one element). Then O(n log n) LIS on heights.
</details>

### 14. When would you NOT use a string DP table?

<details><summary>Model answer</summary>

Exact substring search (KMP/Z), anagram/frequency questions (sliding window), single "is subsequence" checks (two pointers), and inputs too long for O(m·n) (10^5 x 10^5) where a greedy, hashing or LIS reduction is required.
</details>
