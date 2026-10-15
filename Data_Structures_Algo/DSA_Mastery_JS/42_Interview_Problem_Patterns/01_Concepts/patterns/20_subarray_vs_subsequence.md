# 20. Subarray vs Subsequence Problems

One word in the statement changes the whole solution:

- **Subarray / substring** = **contiguous**: `[2, 3]` is a subarray of `[1, 2, 3, 4]`; `[1, 3]` is not.
- **Subsequence** = keep the order, **gaps allowed**: `[1, 3]` is a subsequence of `[1, 2, 3, 4]`.
- **Subset** = any choice, order does not matter.

Counts differ wildly: an array of n elements has n(n+1)/2 subarrays (O(n^2)) but 2^n
subsequences. So subarray problems usually get O(n) tricks (sliding window, prefix sums,
Kadane), while subsequence problems usually need DP, greedy with binary search, or two pointers
for matching.

**Teaches in depth:** [Arrays](../../../03_Arrays/README.md), [Sliding Window](../../../07_Sliding_Window/README.md), [Prefix Sums](../../../08_Prefix_Sums_And_Difference_Arrays/README.md), [DP: Strings & Sequences](../../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md)

---

## 1. Recognition clues

| Words in the problem | Likely tool |
|---|---|
| "maximum sum **subarray**" | Kadane |
| "**subarray** sum equals / divisible by k" | prefix sums + map ([04](04_prefix_sums_and_difference_arrays.md)) |
| "longest **substring** with condition" | sliding window ([03](03_sliding_window.md)) |
| "is s a **subsequence** of t" | two pointers |
| "longest increasing **subsequence**" | DP O(n^2) or patience sorting O(n log n) |
| "longest common **subsequence**", "edit distance" | 2D DP |
| "number of distinct **subsequences**" | DP over both strings |
| "maximum product **subarray**" | Kadane tracking max and min |
| "**subsequence** with max sum, no two adjacent" | linear DP (House Robber) |

**Constraint hints**

- n up to 10^5 and "subarray" -> O(n) or O(n log n).
- n up to 10^3 and "subsequence" of two strings -> O(n*m) DP is expected.

## 2. When it applies (preconditions)

Read the word carefully, then check:

- Subarray: does extending by one element update the answer in O(1)? -> Kadane / window / prefix.
- Subsequence: does the answer for a prefix depend only on a small state (last index, last value, length)? -> DP.

## 3. When it does NOT apply

- **Kadane on a subsequence question.** "Max sum subsequence" of `[3, -1, 4]` is `3 + 4 = 7` (skip -1); Kadane returns 6 (`3 - 1 + 4`), because it must stay contiguous. For subsequences just add all positives (or the max element if none are positive).
- **Sliding window for LIS.** `[1, 5, 2, 3]`: LIS is `[1, 2, 3]`, not contiguous; no window captures it.
- **Prefix sums for subsequence sums.** "Is there a subsequence with sum k?" is subset sum (knapsack DP), not prefix sums.

## 4. The template

```js
// Kadane: max sum of a non-empty CONTIGUOUS subarray
function maxSubarraySum(nums) {
  let best = -Infinity;
  let endingHere = 0;
  for (const x of nums) {
    endingHere = Math.max(x, endingHere + x);      // extend the run, or start fresh at x
    best = Math.max(best, endingHere);
  }
  return best;
}

// Is s a subsequence of t? Two pointers, O(|t|)
function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) if (s[i] === t[j]) i++;
  return i === s.length;
}
```

`lisLength` and `lcsLength` (subsequence DP) are shown in [17](17_dynamic_programming_families.md).
Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`maxSubarraySum`, `isSubsequence`, `lisLength`, `lcsLength`) and [tests/patterns.test.js](../../tests/patterns.test.js) (Kadane vs all O(n^2) subarrays; `isSubsequence` vs brute force over masks).

**Dry run** Kadane on `[-2, 1, -3, 4, -1, 2, 1]`:

| x | endingHere | best |
|---|---|---|
| -2 | -2 | -2 |
| 1 | 1 | 1 |
| -3 | -2 | 1 |
| 4 | 4 | 4 |
| -1 | 3 | 4 |
| 2 | 5 | 5 |
| 1 | 6 | 6 |

## 5. Variations

- **Maximum product subarray:** track both `maxHere` and `minHere` (a negative times a negative flips).
- **Circular max subarray:** `max(kadane, total - minSubarray)`, unless all values are negative.
- **Count subarrays with property:** often "sum over right of (number of valid lefts)".
- **LIS reconstruction:** keep parent indices along with `tails` positions.
- **Many "is subsequence" queries:** precompute next-occurrence tables, or binary search over position lists per character.
- **Longest palindromic subsequence:** LCS of `s` and `reverse(s)`, or interval DP.

## 6. Common pitfalls

1. Reading "subsequence" as "substring" (or the other way round). Underline the word.
2. Kadane initialized with `best = 0`: wrong for all-negative arrays (answer should be the largest negative).
3. Generating all subarrays with `slice` inside two loops: O(n^3). Use running sums.
4. Treating "subset" problems as subsequence problems with order — order usually does not matter, so sort if it helps.
5. LIS `tails` is **not** an actual LIS, only lengths; do not return it as the sequence.

## 7. Representative problems

| # | Problem | Difficulty | Subarray or subsequence | Page |
|---|---|---|---|---|
| 1 | Is Subsequence | Easy | subsequence, two pointers | [statement](../../../06_Two_Pointers/03_Problems/01_Easy/09_is_subsequence.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/09_is_subsequence.js) |
| 2 | Maximum Subarray | Medium | subarray, Kadane | [statement](../../../03_Arrays/03_Problems/02_Medium/04_maximum_subarray.md) · [solution](../../../03_Arrays/03_Problems/solutions/04_maximum_subarray.js) |
| 3 | Maximum Product Subarray | Medium | subarray, max/min Kadane | [statement](../../../03_Arrays/03_Problems/02_Medium/14_maximum_product_subarray.md) · [solution](../../../03_Arrays/03_Problems/solutions/14_maximum_product_subarray.js) |
| 4 | Subarray Sum Equals K | Medium | subarray, prefix + map | [statement](../../../05_Hashing/03_Problems/02_Medium/11_subarray_sum_equals_k.md) · [solution](../../../05_Hashing/03_Problems/solutions/11_subarray_sum_equals_k.js) |
| 5 | Longest Increasing Subsequence | Medium | subsequence, DP / patience | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/03_longest_increasing_subsequence.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/03_longest_increasing_subsequence.js) |
| 6 | Longest Common Subsequence | Medium | subsequence, 2D DP | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/01_longest_common_subsequence.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/01_longest_common_subsequence.js) |
| 7 | Longest Common Substring | Medium | substring, 2D DP with reset | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/02_longest_common_substring.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/02_longest_common_substring.js) |
| 8 | Longest Palindromic Subsequence | Medium | subsequence, interval DP | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/06_longest_palindromic_subsequence.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/06_longest_palindromic_subsequence.js) |
| 9 | Distinct Subsequences | Hard | subsequence counting | [statement](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/03_Hard/11_distinct_subsequences.md) · [solution](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/solutions/11_distinct_subsequences.js) |
| 10 | Constrained Subsequence Sum | Hard | subsequence + monotonic deque | [statement](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/03_Hard/13_constrained_subsequence_sum.md) · [solution](../../../29_Dynamic_Programming/06_Advanced_DP/03_Problems/solutions/13_constrained_subsequence_sum.js) |

## 8. Self-check

**Q1.** How many subarrays and how many subsequences does an array of length 4 have?

<details><summary>Answer</summary>

Subarrays: 4 * 5 / 2 = 10 (non-empty). Subsequences: 2^4 = 16 including the empty one (15 non-empty).

</details>

**Q2.** How does "longest common substring" differ from LCS in the DP transition?

<details><summary>Answer</summary>

Substring: if characters match, `dp[i][j] = dp[i-1][j-1] + 1`, otherwise **0** (the run breaks), and the answer is the max cell. LCS: on mismatch take `max(dp[i-1][j], dp[i][j-1])`, and the answer is the last cell.

</details>

**Q3.** Why does Kadane reset to `x` instead of continuing when `endingHere + x < x`?

<details><summary>Answer</summary>

`endingHere + x < x` means `endingHere < 0`: the best run ending at the previous index only hurts. Starting fresh at `x` is better for every subarray that ends at or after this index.

</details>

---

Previous: [19. Matrix Traversal](19_matrix_traversal.md) · Next: [21. String Matching & Trie-based Problems](21_string_matching_and_tries.md) · [Pattern index](../../README.md)
