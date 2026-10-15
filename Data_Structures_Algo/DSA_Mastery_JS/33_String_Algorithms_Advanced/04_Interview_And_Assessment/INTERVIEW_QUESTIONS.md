# Advanced String Algorithms — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. Why is naive pattern matching O(n·m), and what input shows the worst case?

<details><summary>Model answer</summary>

At each of the `n - m + 1` start positions we may compare up to `m` characters before a mismatch. Text `"aaaa...a"` with pattern `"aa...ab"` matches `m - 1` characters every time and fails on the last one, so the total is about `n·m`. Random text usually fails fast, which is why naive search is fine in practice but not in the worst case.
</details>

### 2. Define the LPS (failure) array in one sentence and say why KMP needs it.

<details><summary>Model answer</summary>

`lps[i]` is the length of the longest proper prefix of `pattern[0..i]` that is also a suffix of it. When a mismatch happens after matching `j` characters, the last `lps[j-1]` characters we matched are already a prefix of the pattern, so we continue from `j = lps[j-1]` instead of restarting. The text pointer never moves backwards, giving O(n + m).
</details>

### 3. Why is KMP's total running time linear even though there is an inner `while` loop?

<details><summary>Model answer</summary>

Amortized argument: `j` (matched length) increases by at most 1 per text character, so it increases at most `n` times overall. Every iteration of the fallback `while` loop strictly decreases `j`. You cannot decrease more than you increased, so the total number of fallbacks is at most `n`. Same argument gives O(m) for building LPS.
</details>

### 4. How does Rabin-Karp roll the hash in O(1), and what can go wrong?

<details><summary>Model answer</summary>

With `hash = c0·B^(m-1) + ... + c(m-1)` mod M, sliding one step is `hash = (hash - c_out·B^(m-1))·B + c_in` mod M. Problems: (1) collisions — two different windows with the same hash, so verify characters on a hash match or use double hashing; (2) JavaScript `%` can return negatives, so add M; (3) products above 2^53 lose precision in JS Numbers — keep `B·M` small, split the multiplication (mulMod), or use BigInt.
</details>

### 5. What does the Z-function compute and how do you search a pattern with it?

<details><summary>Model answer</summary>

`z[i]` is the length of the longest common prefix of `s` and `s[i..]`. Build `z` for `pattern + SEP + text` where SEP appears in neither string. Every position `i` in the text part with `z[i] >= m` is a match at `i - m - 1`. The separator guarantees no z value exceeds `m`. Total O(n + m).
</details>

### 6. KMP vs Z-function vs Rabin-Karp — which do you pick in an interview?

<details><summary>Model answer</summary>

All are O(n + m) for single-pattern search. KMP is the classic answer and the LPS table also solves border/period questions. Z is often easier to code correctly and directly answers "common prefix with every suffix" questions. Rabin-Karp shines when you need to compare many substrings or search for many same-length patterns, and combines with binary search on length; it is probabilistic. Pick the one you can code bug-free and explain.
</details>

### 7. How do you check whether a string is made of a repeated block, in O(n)?

<details><summary>Model answer</summary>

Compute `L = lps[n-1]`. The smallest period is `p = n - L`. The string is a repetition iff `L > 0` and `n % p === 0`. Alternative trick: `s` is a repetition iff `s` occurs in `(s + s)` with first and last character removed.
</details>

### 8. Explain the idea behind Manacher's algorithm without code.

<details><summary>Model answer</summary>

Insert separators (`#`) so every palindrome has odd length. Keep the palindrome that reaches furthest right, with center `C` and right edge `R`. For a new position `i < R`, its mirror `2C - i` already has a known radius, and by symmetry `i` has at least `min(radius[mirror], R - i)`. Only expand beyond that. Since `R` only moves right, total work is O(n). In interviews, expand-around-center O(n^2) is usually enough; Manacher is the bonus.
</details>

### 9. How do you find the longest substring that appears at least twice?

<details><summary>Model answer</summary>

Binary search on the length L: if some length-L substring repeats, every shorter length repeats too (take a prefix), so the predicate is monotonic. For a fixed L, roll a hash over all windows and look for a repeated hash (verify on collision). O(n log n) expected. Alternative: suffix array + LCP array; the answer is the max LCP value, O(n log n) or O(n log^2 n) with simple construction.
</details>

### 10. What is a suffix array and what is the LCP array used for?

<details><summary>Model answer</summary>

The suffix array lists start indices of all suffixes in sorted order. The LCP array stores the common prefix length of neighbours in that order (Kasai builds it in O(n)). Uses: longest repeated substring (max LCP), number of distinct substrings (`n(n+1)/2 - sum(LCP)`), pattern search via binary search over sorted suffixes.
</details>

### 11. How do you find the shortest palindrome you can make by adding characters only at the front?

<details><summary>Model answer</summary>

Find the longest palindromic prefix of `s`. Build `t = s + '#' + reverse(s)` and compute LPS; `lps[last]` is that prefix length `k`. Answer = `reverse(s.slice(k)) + s`. The `#` stops a border from running across both halves. O(n).
</details>

### 12. How would you compare two arbitrary substrings for equality in O(1)?

<details><summary>Model answer</summary>

Precompute prefix hashes `prefix[i]` and powers `B^i` mod M in O(n). Then `hash(l, r) = prefix[r] - prefix[l]·B^(r-l)` (mod M, made non-negative). Equal hashes mean equal substrings with high probability; use two moduli for safety when correctness is critical.
</details>

### 13. Name a problem where these algorithms do NOT help and something else is better.

<details><summary>Model answer</summary>

Many patterns searched at once in one text → Aho-Corasick or a trie. Approximate matching (edit distance ≤ k) → DP. Subsequence (not substring) questions → two pointers or DP. Prefix lookups across a dictionary → trie. Anagram searches → sliding window with counts, not exact matching.
</details>

### 14. What edge cases do you always test for string matching code?

<details><summary>Model answer</summary>

Empty pattern and empty text (agree on a convention), pattern longer than text, pattern equal to text, overlapping matches (`"aaaa"` / `"aa"`), a match at the very start and very end, all-same-character strings (worst case for naive), and a two-letter alphabet random test against `indexOf`.
</details>
