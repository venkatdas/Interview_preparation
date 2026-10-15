# DP on Strings and Sequences

Most "compare two strings" and "find the best subsequence" problems are the same
idea wearing different hats: line the two inputs up in a **2D table**, where cell
`(i, j)` answers the question for the first `i` characters of one and the first `j`
of the other. Think of a diff tool: to show how `horse` became `ros`, it fills a
grid of "cheapest way to turn this prefix into that prefix" and then walks the grid
backwards to print the actual edits. That grid is the DP table, and this folder is
about learning to fill it and read it.

## Prerequisites

- [DP overview](../../01_Concepts/OVERVIEW.md) — the 5-step framework (state, recurrence, base cases, order, answer); this folder applies it to strings and arrays. Shared helpers: [dp_framework.js](../../02_Implementations/dp_framework.js).
- [1D DP](../../01_One_Dimensional_DP/README.md) — "best answer ending at i" thinking, used by LIS.
- [Strings](../../../04_Strings/README.md) — prefixes, subsequences vs substrings.
- [Binary search](../../../10_Searching/README.md) — for the O(n log n) LIS.

**Essential vs Advanced:** LCS, edit distance, LIS (both versions), longest palindromic substring/subsequence and the two-row space trick are **Essential**. Distinct subsequences, interleaving string, shortest common supersequence reconstruction, Russian dolls and wildcard/regex matching are **Advanced** (they appear at top-tier companies, usually as the hard question).

---

## Why it matters / when to use

Signals in the problem statement:

- Two strings/arrays and a question about how they **relate**: "common", "convert",
  "edit", "match", "interleave", "supersequence"
- "**Subsequence**" (skip characters, keep order) or "**substring**" (contiguous)
- "Longest ... increasing / common / palindromic"
- "Minimum number of insertions / deletions / replacements"
- "Count the number of ways to form t from s"
- A pattern with wildcards (`?`, `*`, `.`) that must match the whole string
- "Can we nest / chain these objects?" after sorting (2D LIS)

If the state is "position in string A and position in string B", you are here.

---

## How it works

### The 2D prefix table (LCS drawn step by step)

Longest Common Subsequence of `text1 = "abcde"` and `text2 = "ace"`.

**State**: `dp[i][j]` = LCS length of the first `i` chars of text1 and the first `j`
chars of text2. We allocate `(m+1) x (n+1)` so that row 0 and column 0 mean "empty
prefix". This **padding trick** removes every "is i-1 valid?" check.

**Recurrence**:
```
if text1[i-1] === text2[j-1]:  dp[i][j] = 1 + dp[i-1][j-1]       (match: take it, go diagonal)
else:                           dp[i][j] = max(dp[i-1][j], dp[i][j-1])   (skip one char from either)
```

**Base cases**: `dp[0][*] = dp[*][0] = 0`.

Fill row by row, left to right. Each cell only looks up, left, and up-left:

```
Step 1: borders are 0        Step 2: row 'a'              Step 3: row 'b'
        ""  a  c  e                  ""  a  c  e                  ""  a  c  e
    ""   0  0  0  0              ""   0  0  0  0              ""   0  0  0  0
    a    0                       a    0  1  1  1              a    0  1  1  1
    b    0                       b    0                       b    0  1  1  1
    c    0                       c    0                       c    0
    d    0                       d    0                       d    0
    e    0                       e    0                       e    0

   'a'=='a' -> 1 + diag(0) = 1       'b' never matches -> copy the
   'a' vs 'c' -> max(up 0, left 1)   max of up/left each time
```

```
Step 4: row 'c'              Final table
        ""  a  c  e                  ""  a  c  e
    ""   0  0  0  0              ""   0  0  0  0
    a    0  1  1  1              a    0  1  1  1
    b    0  1  1  1              b    0  1  1  1
    c    0  1  2  2              c    0  1  2  2
    d    0                       d    0  1  2  2
    e    0                       e    0  1  2  3   <- answer = dp[5][3] = 3

   'c'=='c' -> 1 + diag(1) = 2
```

**Answer**: bottom-right cell. Time `O(m*n)` because there are `m*n` cells and each
costs O(1). Space `O(m*n)` for the table, `O(n)` with two rows.

### Subsequence vs substring (the one-line difference)

| | subsequence (LCS) | substring (longest common block) |
|---|---|---|
| chars equal | `1 + dp[i-1][j-1]` | `1 + dp[i-1][j-1]` |
| chars differ | `max(up, left)` -- carry the best so far | `0` -- a mismatch breaks the block |
| answer | bottom-right cell | **max over all cells** |

The substring table for `"abcde"` vs `"ace"` is mostly zeros with a few 1s on the
diagonal. The same rule applies to "max subarray vs max subsequence" on arrays:
contiguous means **reset**, non-contiguous means **carry**.

### Edit distance (three operations)

Turn `word1[0..i)` into `word2[0..j)`. If the last chars match they cost nothing.
Otherwise you must do one of three things, and the neighbour cell tells you the cost
of the rest:

```
                 dp[i-1][j-1]        dp[i-1][j]
                  (replace)           (delete word1[i-1])
                       \               |
                        \              v
          dp[i][j-1]  ->  dp[i][j] = 1 + min(replace, delete, insert)
         (insert word2[j-1])
```

```
"horse" -> "ros"        ""  r  o  s
                    ""   0  1  2  3      row 0: j inserts
                    h    1  1  2  3      col 0: i deletes
                    o    2  2  1  2      o==o -> diagonal (1)
                    r    3  2  2  2
                    s    4  3  3  2      s==s -> diagonal (2)
                    e    5  4  4  3      answer 3
```

Direction = meaning: **diagonal** = match/replace, **up** = delete, **left** = insert.
Delete-only (LC 583) is the same table without the diagonal "replace" option.

### Longest Increasing Subsequence (one sequence, two versions)

**O(n^2)**: `dp[i]` = length of the LIS that **ends at** `i`. Look back at every
`j < i` with `nums[j] < nums[i]` and take `1 + dp[j]`. Answer is `max(dp)`, not
`dp[n-1]`, because the LIS can end anywhere.

```
nums : 10  9  2  5  3  7  101  18
dp   :  1  1  1  2  2  3   4    4     -> 4
```

**O(n log n) patience version**: keep `tails`, where `tails[k]` = the smallest value
that can end an increasing subsequence of length `k+1`. It is always sorted, so for
each number binary-search the first `tails[k] >= num` and overwrite it; if none,
append.

```
10 -> [10]    9 -> [9]    2 -> [2]    5 -> [2,5]    3 -> [2,3]
7  -> [2,3,7]    101 -> [2,3,7,101]    18 -> [2,3,7,18]      length 4
```

Why overwrite? A subsequence of length 2 ending in `3` is strictly better than one
ending in `5`: anything that can follow `5` can follow `3`. **Warning**: `tails` is
NOT an actual LIS. `[2,3,7,18]` happens to be one here, but after `[1,5,2]` tails is
`[1,2]` and `[1,2]` is a real LIS, while after `[3,4,1]` tails is `[1,4]`, which is
not increasing in the original order. Only the **length** is correct. To get the real
subsequence, store for each number the index it replaced and walk back.

### Palindromes: DP on an interval [l, r]

Palindrome questions ask about a **substring of one string**, so the state is the
interval `(l, r)`, and the recurrence shrinks it from both ends:

```
isPal[l][r]   = s[l] === s[r] && (r - l < 2 || isPal[l+1][r-1])
lps[l][r]     = s[l] === s[r] ? 2 + lps[l+1][r-1] : max(lps[l+1][r], lps[l][r-1])
```

`dp[l][r]` depends on `dp[l+1][...]`, so loop `l` from right to left (or by increasing
length). This is the gateway to [Interval DP](../../05_Interval_DP/01_Concepts/CONCEPTS.md), where the split point moves.

Trick: `LPS(s) === LCS(s, reverse(s))`, and "min insertions to make a palindrome" is
`n - LPS(s)`.

### Reconstructing the actual answer

A length is rarely enough in an interview follow-up. Keep the full table and walk
backwards from the answer cell, undoing the recurrence:

```js
let i = m, j = n;
const chars = [];
while (i > 0 && j > 0) {
  if (text1[i - 1] === text2[j - 1]) {   // came from the diagonal: this char is in the LCS
    chars.push(text1[i - 1]); i--; j--;
  } else if (dp[i - 1][j] >= dp[i][j - 1]) {
    i--;                                  // came from above
  } else {
    j--;                                  // came from the left
  }
}
return chars.reverse().join('');
```

For edit distance, the same walk prints the operations; for shortest common
supersequence, you emit the char you "consumed" on every step and the leftover
prefix when one side hits 0.

---

## Pseudocode (Essential)

```
# Two-sequence template (LCS shown). dp has (m+1) x (n+1) cells; row 0 / column 0 = empty prefix.
lcs(a, b):
  dp = (m+1) x (n+1) table of 0
  for i in 1..m:
    for j in 1..n:
      if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] + 1          # use both characters
      else:                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # drop one of them
  return dp[m][n]

# Edit distance only changes the base cases and the mismatch rule:
#   dp[i][0] = i, dp[0][j] = j
#   match:    dp[i][j] = dp[i-1][j-1]
#   mismatch: dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace))

# LIS in O(n log n) (patience sorting)
lis(nums):
  tails = []                     # tails[k] = smallest tail of an increasing subsequence of length k+1
  for x in nums:
    k = first index with tails[k] >= x   (lower bound)
    if k == len(tails): tails.push(x) else: tails[k] = x
  return len(tails)
```

---

## Dry run (Essential) - LIS with patience sorting on [10, 9, 2, 5, 3, 7, 101, 18]

| step | x | lower bound k | action | tails after |
|---|---|---|---|---|
| 1 | 10 | 0 (empty) | push | [10] |
| 2 | 9 | 0 | replace tails[0] | [9] |
| 3 | 2 | 0 | replace tails[0] | [2] |
| 4 | 5 | 1 | push | [2, 5] |
| 5 | 3 | 1 | replace tails[1] | [2, 3] |
| 6 | 7 | 2 | push | [2, 3, 7] |
| 7 | 101 | 3 | push | [2, 3, 7, 101] |
| 8 | 18 | 3 | replace tails[3] | [2, 3, 7, 18] |

Answer = length of `tails` = **4**. Note that `tails` is not necessarily a real subsequence; only its length is meaningful.

---

## Operations & complexity

| Problem shape | Time | Space (table) | Space (optimized) | Note |
|---|---|---|---|---|
| LCS / edit distance / two-string tables | O(m*n) | O(m*n) | O(min(m,n)) | two rows, or one row right-to-left |
| Longest common substring | O(m*n) | O(m*n) | O(n) | answer = max over all cells |
| LIS O(n^2) | O(n^2) | O(n) | O(n) | answer = max(dp) |
| LIS patience | O(n log n) | O(n) | O(n) | length only |
| Palindrome interval DP | O(n^2) | O(n^2) | O(n) | loop l right-to-left |
| Wildcard / regex matching | O(m*n) | O(m*n) | O(n) | star cell looks left and up |
| Reconstructing the answer | O(m+n) extra | needs full table | - | cannot do it from two rows |

Rule: complexity = number of states x work per state. Two-string DP has `m*n` states
with O(1) work each. LIS O(n^2) has `n` states with O(n) work each.

---

## JavaScript implementation

There is no data structure file in this folder; the core is the two-string table
pattern, which every problem file repeats:

```js
function twoStringDP(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  // base cases: fill row 0 and column 0 (often 0, or i / j for edit-style costs)
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}
```

Every problem file has `bruteForce` (plain recursion), `memo` (top-down with a
`Map` keyed `"i,j"`), `tabulation` (the table above) and, where it fits, `optimized`
(two rows or the O(n log n) trick). The tests run all versions on the same inputs.

---

## Patterns / variations

### 1. Two-row space optimisation

Row `i` only reads row `i-1`, so keep `prev` and `curr` and swap:

```js
let prev = new Array(n + 1).fill(0);
let curr = new Array(n + 1).fill(0);
for (let i = 1; i <= m; i++) {
  curr[0] = baseForColumnZero(i);         // 0 for LCS, i for edit distance
  for (let j = 1; j <= n; j++) {
    curr[j] = a[i - 1] === b[j - 1] ? 1 + prev[j - 1] : Math.max(prev[j], curr[j - 1]);
  }
  [prev, curr] = [curr, prev];            // no allocation per row
}
return prev[n];
```
Use when: only the final value is needed. You lose the ability to reconstruct.

### 2. One row, iterate right to left

When a cell reads only `dp[i-1][j]` and `dp[i-1][j-1]` (never `dp[i][j-1]`), a single
row works if you fill `j` from right to left so the diagonal value is still "old":

```js
const dp = new Array(n + 1).fill(0); dp[0] = 1;
for (let i = 1; i <= m; i++) {
  for (let j = n; j >= 1; j--) {
    if (s[i - 1] === t[j - 1]) dp[j] += dp[j - 1];   // Distinct Subsequences
  }
}
```
Same trick as 0/1 knapsack in [Knapsack DP](../../02_Knapsack/01_Concepts/CONCEPTS.md).

### 3. "Ends at i" (LIS family)

```js
const dp = new Array(n).fill(1);
for (let i = 0; i < n; i++)
  for (let j = 0; j < i; j++)
    if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
return Math.max(...dp);
```
Use when: one sequence, "longest chain with a rule between consecutive picks".
Variations: count the number of LIS (carry a `count[]` alongside), 2D LIS after
sorting (Russian Doll Envelopes), longest divisible subset.

### 4. Pattern matching with a star

For wildcard `*` (any run) and regex `x*` (zero or more x), a star cell has two
choices, "match nothing" or "eat one more char and stay":

```js
if (p[j - 1] === '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];           // wildcard
if (p[j - 1] === '*') dp[i][j] = dp[i][j - 2] || (first(s[i-1], p[j-2]) && dp[i - 1][j]); // regex
```
Base row: `dp[0][j]` is true only for patterns that can match the empty string.

### 5. Interval (palindrome) DP

```js
for (let l = n - 1; l >= 0; l--) {
  dp[l][l] = 1;
  for (let r = l + 1; r < n; r++) {
    dp[l][r] = s[l] === s[r] ? 2 + dp[l + 1][r - 1] : Math.max(dp[l + 1][r], dp[l][r - 1]);
  }
}
```
Use when: one string, the question is about a substring's two ends.

### 6. Derive from LCS instead of a new table

- Delete operation for two strings: `m + n - 2 * LCS`
- Shortest common supersequence length: `m + n - LCS`
- Longest palindromic subsequence: `LCS(s, reverse(s))`
- Min insertions to make palindrome: `n - LPS`

Saying these out loud shows you see the shared structure.

---

## Alternatives (Essential)

| Problem shape | Plain recursion | Memo / table | Better / different tool |
|---|---|---|---|
| LCS, edit distance, distinct subsequences | O(2^(m+n)) / O(3^...) | O(m·n) time, O(min(m,n)) space with two rows | Hirschberg for O(n) space + reconstruction (Advanced) |
| LIS | O(2^n) | O(n^2) "ends at i" | O(n log n) patience sorting; a segment tree / BIT when counts are needed |
| Longest palindromic substring | O(n^3) check all | O(n^2) interval table | expand around center O(n^2) time, O(1) space; Manacher O(n) ([Advanced String Algorithms](../../../33_String_Algorithms_Advanced/README.md)) |
| Longest common SUBSTRING | O(n^2·m) | O(m·n) | binary search + rolling hash, or suffix array (O(n log n)) |
| Wildcard matching | exponential | O(m·n) | greedy two-pointer with star backtracking, O(m·n) worst, O(1) space |

---

## When string DP does NOT apply (Essential)

- **Exact substring search** ("does p occur in t") — use KMP / Z / rolling hash, O(n + m) ([Advanced String Algorithms](../../../33_String_Algorithms_Advanced/README.md)).
- **Anagrams, character counts, "contains all of"** — sliding window with a frequency map ([Sliding Window](../../../07_Sliding_Window/README.md)).
- **Is s a subsequence of t?** (yes/no, one query) — two pointers, O(n); DP is overkill.
- **Strings up to 10^5 with a two-string table** — O(m·n) = 10^10 is too slow; look for a greedy, hashing or LIS reduction.
- **Prefix lookups across many words** — [Tries](../../../22_Tries/README.md).

---

## Common mistakes & edge cases

- **Off-by-one with padding**: table index `i` means "first i chars", so the char is
  `s[i-1]`. Mixing `s[i]` and `dp[i]` is the number one bug. Decide once and stick to it.
- **Answer location**: LCS and edit distance use the bottom-right cell; longest common
  substring and LIS use the **max over all cells**; palindromic substring tracks the
  best `(l, r)` while filling.
- **Reset vs carry**: substring resets to 0 on mismatch; subsequence carries the max.
- **Base row for costs**: edit distance needs `dp[i][0] = i` and `dp[0][j] = j`, not 0.
  In the two-row version you must re-set `curr[0]` on every row.
- **Loop order for interval DP**: `dp[l][r]` needs `dp[l+1][r-1]`, so `l` must go
  from right to left (or iterate by length). Top-to-bottom gives garbage.
- **Strict vs non-strict** in LIS: `nums[j] < nums[i]` vs `<=` changes the answer
  for duplicates. For LIS binary search, strict needs `lower bound` (first `>=`).
- **Russian Doll tie-break**: sort heights descending on equal widths; otherwise LIS
  on heights nests two envelopes of the same width.
- **Pattern matching base row**: `dp[0][j]` is not all false; `"a*b*"` and `"***"`
  match the empty string.
- Empty inputs: an empty string is a valid input and usually gives 0 / `true` / the
  other string. Test it.
- Recursion depth: `bruteForce` and `memo` recurse `m + n` deep; fine for interview
  sizes, but for 10^4-length strings use tabulation.

---

## Interview tips

- Name the state in one sentence before writing code: "dp[i][j] is the answer for
  the first i chars of A and the first j chars of B."
- Draw the 3x3 corner of the table on the whiteboard and fill two cells by hand.
  That is faster than explaining the recurrence in words, and it catches off-by-ones.
- Say the complexity as "m times n states, constant work each".
- Always mention the two-row optimisation, and that it costs you reconstruction.
  Then ask whether they want the length or the actual string.
- For LIS, give the O(n^2) first, then say "there is an O(n log n) version with a
  tails array and binary search" and explain why the tails array is not the LIS.
- For palindromes, say "same ends and the inside is a palindrome" and point out the
  loop direction.
- Spot the family: delete-ops, supersequence, LPS and min-insertions are all LCS in
  disguise; say so, and solve the one they asked by reusing LCS.
- Clarify: subsequence or substring? Strict or non-strict? Case sensitive? Need the
  actual sequence or just its length?

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Longest Common Subsequence | Medium | two-string table + reconstruct | [01_longest_common_subsequence.js](../03_Problems/solutions/01_longest_common_subsequence.js) |
| 02 | Longest Common Substring | Medium | two-string table, reset on mismatch | [02_longest_common_substring.js](../03_Problems/solutions/02_longest_common_substring.js) |
| 03 | Longest Increasing Subsequence | Medium | "ends at i" O(n^2), patience O(n log n) | [03_longest_increasing_subsequence.js](../03_Problems/solutions/03_longest_increasing_subsequence.js) |
| 04 | Number of Longest Increasing Subsequence | Medium | LIS with length + count | [04_number_of_longest_increasing_subsequence.js](../03_Problems/solutions/04_number_of_longest_increasing_subsequence.js) |
| 05 | Longest Palindromic Substring | Medium | interval DP, expand around center | [05_longest_palindromic_substring.js](../03_Problems/solutions/05_longest_palindromic_substring.js) |
| 06 | Longest Palindromic Subsequence | Medium | interval DP | [06_longest_palindromic_subsequence.js](../03_Problems/solutions/06_longest_palindromic_subsequence.js) |
| 07 | Minimum Insertions to Make Palindrome | Hard | interval DP, n - LPS | [07_minimum_insertions_to_make_palindrome.js](../03_Problems/solutions/07_minimum_insertions_to_make_palindrome.js) |
| 08 | Delete Operation for Two Strings | Medium | LCS variant | [08_delete_operation_for_two_strings.js](../03_Problems/solutions/08_delete_operation_for_two_strings.js) |
| 09 | Uncrossed Lines | Medium | LCS in disguise | [09_uncrossed_lines.js](../03_Problems/solutions/09_uncrossed_lines.js) |
| 10 | Edit Distance | Medium | three-operation table | [10_edit_distance.js](../03_Problems/solutions/10_edit_distance.js) |
| 11 | Distinct Subsequences | Hard | counting table, one-row right-to-left | [11_distinct_subsequences.js](../03_Problems/solutions/11_distinct_subsequences.js) |
| 12 | Interleaving String | Medium | boolean table (i, j) with k = i + j | [12_interleaving_string.js](../03_Problems/solutions/12_interleaving_string.js) |
| 13 | Shortest Common Supersequence | Hard | LCS + reconstruct the string | [13_shortest_common_supersequence.js](../03_Problems/solutions/13_shortest_common_supersequence.js) |
| 14 | Russian Doll Envelopes | Hard | sort + 2D LIS | [14_russian_doll_envelopes.js](../03_Problems/solutions/14_russian_doll_envelopes.js) |
| 15 | Wildcard Matching | Hard | pattern table with `*` | [15_wildcard_matching.js](../03_Problems/solutions/15_wildcard_matching.js) |
| 16 | Regular Expression Matching | Hard | pattern table with `x*` | [16_regular_expression_matching.js](../03_Problems/solutions/16_regular_expression_matching.js) |

---

## Practice more

Easy: Is Subsequence (392), Longest Common Prefix (14, not DP but a warm-up)

Medium: Maximum Length of Repeated Subarray (718), Palindromic Substrings (647),
Longest Arithmetic Subsequence (1027), Longest String Chain (1048),
Largest Divisible Subset (368), Minimum ASCII Delete Sum for Two Strings (712),
Maximum Length of Pair Chain (646), Longest Repeating Subsequence (classic),
Count Different Palindromic Subsequences (730, harder), Partition Array for Maximum Sum (1043)

Hard: Minimum Window Subsequence (727), Longest Valid Parentheses (32),
Palindrome Partitioning II (132, see [Interval DP](../../05_Interval_DP/README.md)), Count Vowels Permutation (1220, see [Advanced DP](../../06_Advanced_DP/README.md))
