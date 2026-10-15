# String Algorithms

Searching for a pattern inside a text is the "hello world" of string algorithms, and the
naive way (try every position) is O(n·m). The algorithms here get to **linear time** by
never re-reading text they have already understood: **KMP** remembers how much of the pattern
still matches after a mismatch, **Rabin-Karp** compares fingerprints (hashes) instead of
characters, the **Z-function** reuses matches found earlier, **Manacher's** reuses palindromes
by mirror symmetry, and a **suffix array** sorts all suffixes once so many questions become
binary searches. Think of a proof-reader who, having read a sentence once, does not start
again from the first letter after every typo.

## Prerequisites

- [Strings](../../04_Strings/README.md) — slicing, comparing, char codes.
- [Hashing](../../05_Hashing/README.md) — needed for Rabin-Karp and substring hashing.
- [Tries](../../22_Tries/README.md) — helpful context for multi-pattern search.
- [Binary search](../../10_Searching/README.md) — used in "binary search on length + hash".

**Essential vs Advanced:** KMP / LPS, Z-function and rolling hash are **Essential** for top-tier interviews. Manacher's algorithm and suffix arrays are **Advanced** — know the idea, code them only if asked.

---

## Why it matters / when to use

- "Find / count occurrences of pattern in text", "first index of" → **KMP** (or Rabin-Karp)
- "Longest prefix that is also a suffix", "is the string a repetition", "shortest palindrome
  by prepending" → **KMP failure table (LPS)**
- "Longest common prefix of s and every suffix", "sum of scores" → **Z-function**
- "Longest palindromic substring" in O(n) → **Manacher's**
- "Compare two substrings in O(1)", "longest duplicate substring", "distinct echo substrings"
  → **polynomial hashing** (+ binary search on length)
- "Sort all suffixes", "number of distinct substrings", "longest repeated substring"
  → **suffix array + LCP array**
- Many patterns in one text → Aho-Corasick (a trie with failure links; mention only)

Frontend relevance: search-as-you-type highlighting, diffing, autocomplete, and any
"does this input contain" check at scale.

---

## How it works

### 1. Naive matching — O(n·m)

```
text:    a a b a a a b
pattern: a a b                 at i=0: a a b  match
            a a b              at i=1: a a vs a b -> mismatch at j=1
              a a b            at i=2: mismatch at j=0
                ...
```
After a mismatch we slide by ONE and compare from scratch. Worst case `"aaaa...a"` with
pattern `"aaab"`: about `m` comparisons at each of `n` positions.

### 2. KMP — the failure table (LPS), drawn step by step

`lps[i]` = length of the longest **proper** prefix of `pattern[0..i]` that is also a suffix
of it. It says: *"if I matched i+1 characters and the next one fails, the last lps[i]
characters I matched are also the start of the pattern, so I can continue from there."*

Building `lps` for `pattern = "aabaaab"`:

```
index:    0   1   2   3   4   5   6
pattern:  a   a   b   a   a   a   b
lps:      0   1   0   1   2   2   3

i=1 'a': compare with pattern[len=0]='a' -> match, len=1          lps[1]=1
i=2 'b': compare with pattern[1]='a' -> no; len=lps[0]=0;
         compare with pattern[0]='a' -> no                        lps[2]=0
i=3 'a': compare with pattern[0]='a' -> match, len=1              lps[3]=1
i=4 'a': compare with pattern[1]='a' -> match, len=2              lps[4]=2
i=5 'a': compare with pattern[2]='b' -> no; len=lps[1]=1;
         compare with pattern[1]='a' -> match, len=2              lps[5]=2
i=6 'b': compare with pattern[2]='b' -> match, len=3              lps[6]=3
```
Why `len = lps[len-1]` on mismatch? The first `len` chars matched the current suffix. We want
the next-longest prefix that is also a suffix of *those* `len` chars - that is exactly
`lps[len-1]`. We never move `i` backwards.

Matching `text = "aabaabaaab"` with the same table (j = chars matched so far):

```
i: 0 1 2 3 4 5 6 7 8 9
t: a a b a a b a a a b
j after step:
   1 2 3 4 5 (t[5]='b' vs p[5]='a' mismatch -> j=lps[4]=2; p[2]='b' matches -> 3)
             3 4 5 6 7 -> j === m at i=9 -> match at 9-7+1 = 3
```
Text pointer `i` only moves forward; `j` can fall back, but every fall-back is "paid for" by an
earlier increment, so the total is O(n + m).

### 3. Rabin-Karp — rolling hash

Treat a string as a number in base B (we use 131) modulo M (1e9+7):
`hash("abc") = a·B² + b·B + c (mod M)`. Sliding the window one step right:

```
hash(next) = (hash(cur) - text[i] * B^(m-1)) * B + text[i+m]      (mod M)
              ^ drop the leading char      ^ shift   ^ append
```
Compare the window's hash with the pattern's hash; on equality **verify** the characters
(hashes can collide). Expected O(n + m); worst case O(n·m) only with adversarial collisions.
Double hashing (two different M's) makes collisions practically impossible.

Pitfalls in JS: `%` of a negative number is negative (add M back), and `B · M` must stay
below 2^53 so products are exact: `131 · 1e9+7 ≈ 1.3e11` is fine, but **`prefix[l] · B^k`
in prefix hashing reaches 1e18 and is NOT** - use `mulMod` (16-bit split) or BigInt there.

### 4. Z-algorithm

`z[i]` = length of the longest common prefix of `s` and `s[i..]`.

```
s = a a b a a a b           z = [7, 1, 0, 2, 1, 0, 0]  (z[0] = n by convention)
                                     ^ s[3..] = "aaab" shares "aa" with s
Keep the rightmost Z-box [l, r): a segment s[l..r) known to equal s[0..r-l).
For i inside the box, s[i..r) equals s[i-l..r-l), so z[i] >= min(z[i-l], r-i) for free;
extend by direct comparison only beyond r. r only moves forward -> O(n).
```
Pattern search with Z: compute `z` of `pattern + '\u0001' + text`; positions with `z >= m`
are matches. Z and LPS are two views of the same information.

### 5. Manacher's — longest palindromic substring in O(n) (Advanced)

Insert `#` between characters (and sentinels `^`, `$`) so every palindrome has odd length:
`"abba"` → `"^#a#b#b#a#$"`. `radius[i]` = how far the palindrome centred at `i` extends.

```
t:       ^  #  a  #  b  #  b  #  a  #  $
radius:  0  0  1  0  1  4  1  0  1  0  0
                         ^ centre 5: "#b#b#" ... "a#b#b#a" -> radius 4 -> length 4 in s

mirror trick: if i is inside the rightmost known palindrome (centre C, right edge R), then
              radius[i] >= min(radius[2C - i], R - i)   (the mirror of i around C)
```
Each expansion step pushes `R` to the right, and `R` can only move `n` times → O(n).
Length in `s` = `radius[i]`; start in `s` = `(i - radius[i] - 1) / 2`.

### 6. Suffix array + LCP (simple O(n log² n)) (Advanced)

Sort all suffixes by **prefix doubling**: round `k` sorts by the pair
`(rank[i], rank[i + k])`, i.e. by the first `2k` characters, reusing the previous round's
ranks. `log n` rounds of an O(n log n) sort.

```
s = banana          suffixes sorted:   a  ana  anana  banana  na  nana
                    sa = [5, 3, 1, 0, 4, 2]
                    lcp = [0, 1, 3, 0, 0, 2]   (lcp[i] = common prefix of sa[i-1] and sa[i])
```
**Kasai** builds `lcp` in O(n): if suffix `i` shares `h` characters with its predecessor,
suffix `i+1` shares at least `h-1` with its predecessor. Uses: longest repeated substring =
`max(lcp)`; number of distinct substrings = `n(n+1)/2 - sum(lcp)`; LCP of any two suffixes
= range-min over `lcp` ([Sparse Table](../../34_Range_Query_Data_Structures/03_Sparse_Table/README.md)).

### 7. String hashing for comparison

`PolynomialHash` precomputes `prefix[i]` and `B^i`; then `hash(l, r) = prefix[r] - prefix[l]·B^(r-l)`
gives any substring's hash in O(1). Combine with binary search on the length for
"longest duplicate substring" (if a duplicate of length L exists, so does one of every
shorter length → monotonic).

---

## Pseudocode (Essential)

```
buildLPS(p):
  lps[0] = 0; len = 0; i = 1
  while i < m:
    if p[i] == p[len]: len += 1; lps[i] = len; i += 1
    else if len > 0:   len = lps[len - 1]          # fall back, do NOT move i
    else:              lps[i] = 0; i += 1

kmpSearch(t, p):
  j = 0                                            # characters of p matched so far
  for i in 0..n-1:
    while j > 0 and t[i] != p[j]: j = lps[j - 1]
    if t[i] == p[j]: j += 1
    if j == m: report i - m + 1; j = lps[j - 1]   # keep going for overlapping matches

zFunction(s):
  z[0] = n; l = r = 0                              # [l, r) = rightmost Z-box
  for i in 1..n-1:
    if i < r: z[i] = min(r - i, z[i - l])
    while i + z[i] < n and s[z[i]] == s[i + z[i]]: z[i] += 1
    if i + z[i] > r: l = i; r = i + z[i]

rabinKarp(t, p):
  hp = hash(p); hw = hash(t[0..m-1])
  for each window start i:
    if hw == hp and t[i..i+m-1] == p: report i     # verify: hashes can collide
    hw = ((hw - t[i]*B^(m-1)) * B + t[i+m]) mod M  # roll
```

---

## Dry run — KMP searching "aab" in "aaab" (Essential)

`lps("aab") = [0, 1, 0]`

| step | i | t[i] | j before | action | j after | match? |
|---|---|---|---|---|---|---|
| 1 | 0 | a | 0 | t[0] == p[0] → j++ | 1 | |
| 2 | 1 | a | 1 | t[1] == p[1] → j++ | 2 | |
| 3 | 2 | a | 2 | t[2]='a' != p[2]='b' → j = lps[1] = 1; now t[2] == p[1] → j++ | 2 | |
| 4 | 3 | b | 2 | t[3] == p[2] → j++ | 3 | j == m → report 3 - 3 + 1 = **1**, j = lps[2] = 0 |

Notice step 3: naive matching would restart at text index 2 with j = 0. KMP keeps the `"a"` it already knows matches, and the text pointer never goes back.

---

## Operations & complexity

| Algorithm | Preprocessing | Per query / total | Space | Finds |
|-----------|---------------|-------------------|-------|-------|
| Naive search | - | O(n·m) | O(1) | all occurrences |
| KMP | O(m) build LPS | O(n) | O(m) | all occurrences, periods, borders |
| Rabin-Karp | O(m) | O(n) expected | O(1) | all occurrences (verify on hash hit) |
| Z-function | O(n) | - | O(n) | prefix matches at every position |
| Manacher | O(n) | - | O(n) | longest palindromic substring |
| Suffix array (doubling) | O(n log² n) | O(m log n) per pattern search | O(n) | sorted suffixes |
| LCP (Kasai) | O(n) | O(1) with RMQ | O(n) | repeats, distinct substrings |
| Prefix hashing | O(n) | O(1) substring hash | O(n) | equality tests |

---

## JavaScript implementation

Full code with randomized tests against naive references: [02_Implementations/string_algorithms.js](../02_Implementations/string_algorithms.js)
(`naiveSearch`, `buildLPS`, `kmpSearch`, `rabinKarp`, `zFunction`, `manacher`, `suffixArray`,
`lcpArray`, `PolynomialHash`, `mulMod`). The KMP core:

```js
function buildLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (len > 0 && pattern[i] !== pattern[len]) len = lps[len - 1];   // fall back
    if (pattern[i] === pattern[len]) len++;
    lps[i] = len;
  }
  return lps;
}

function kmpSearch(text, pattern) {
  const lps = buildLPS(pattern), matches = [];
  for (let i = 0, j = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = lps[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) { matches.push(i - j + 1); j = lps[j - 1]; }
  }
  return matches;
}
```

---

## Patterns / variations

### 1. LPS of the whole string answers "border" questions

```js
const p = lps[n - 1];                       // longest proper prefix == suffix
const isRepetition = p > 0 && n % (n - p) === 0;   // smallest period divides n
const happyPrefix = s.slice(0, p);
```
Use when: Repeated Substring Pattern, Longest Happy Prefix.

### 2. Glue two strings with a separator, then run KMP / Z

```js
const lps = buildLPS(s + '#' + reverse(s));  // longest palindromic prefix of s
const z = zFunction(pattern + '\u0001' + text);
```
The separator must not appear in either string so matches cannot cross it.
Use when: Shortest Palindrome, pattern search via Z.

### 3. Binary search on length + rolling hash

```js
let lo = 1, hi = n - 1;
while (lo <= hi) { const mid = (lo + hi) >> 1; if (hasDuplicateOfLength(s, mid)) lo = mid + 1; else hi = mid - 1; }
```
Use when: Longest Duplicate Substring, Longest Common Substring of two strings.

### 4. Bound the search space, then search

Repeated String Match: only `ceil(m/n)` and `ceil(m/n) + 1` copies can ever matter.

### 5. Prefix hashes for O(1) substring equality

Use when: Distinct Echo Substrings (`hash(i, i+L) === hash(i+L, i+2L)`), palindrome checks
with a reversed-string hash, comparing rotations.

---

## Alternatives and trade-offs

| Approach | Time | Space | Use when |
|---|---|---|---|
| Naive / `indexOf` | O(n·m) worst, fast on random text | O(1) | one-off search in an interview warm-up or production code with short patterns |
| KMP | O(n + m) | O(m) | guaranteed linear search; border / period questions |
| Z-function | O(n + m) | O(n + m) | "common prefix with every suffix" questions; often easier to code than KMP |
| Rabin-Karp / prefix hashes | O(n + m) expected | O(n) | many substring comparisons, binary search on length, many same-length patterns |
| Expand around center | O(n^2) | O(1) | longest palindrome when n ≤ a few thousand (the usual interview answer) |
| Manacher | O(n) | O(n) | longest palindrome with n up to 10^5–10^6 |
| Suffix array + LCP | O(n log^2 n) build | O(n) | many queries about repeated / distinct substrings |
| Trie / Aho-Corasick | O(total length + matches) | O(alphabet · nodes) | many patterns at once |

---

## When this does NOT apply

- **Subsequences, not substrings** (characters may skip) → two pointers or DP ([Strings & Sequences DP](../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md)).
- **Approximate matching** (allow k edits) → edit-distance style DP.
- **Anagram / permutation-in-string** → sliding window with character counts ([Sliding Window](../../07_Sliding_Window/README.md)).
- **Many dictionary words / prefix lookups** → [Tries](../../22_Tries/README.md).
- **Tiny inputs** (n ≤ 1000) → `indexOf` / `includes` is clearer and fast enough; say so in the interview.

---

## Common mistakes & edge cases

- **Negative modulo**: `(x - y) % M` can be negative in JS; add `M` when `< 0`.
- **Precision past 2^53**: `prefix[l] * power[k]` with both ~1e9 is ~1e18 - silently wrong.
  Use `mulMod` (split into 16-bit halves), BigInt, or a modulus < 2^26.
- LPS: start the loop at `i = 1` with `len = 0`; `lps[0]` is always 0. Fall back with
  `lps[len - 1]`, not `lps[len]` or `lps[i - 1]`.
- KMP: after a full match set `j = lps[j - 1]` to keep finding **overlapping** matches.
- Z: `z[0]` is undefined by some conventions; we set it to `n`. Start the loop at `i = 1`.
- Manacher: map back carefully: `start = (center - radius - 1) / 2` with the `^#` prefix.
- Suffix array: compare `rank[i + k]` as `-1` when `i + k >= n` so shorter suffixes sort first.
- Empty pattern / empty text: decide the convention (we return `[]` / `0`) and test it.

---

## Interview tips

- Start with the naive solution and its O(n·m) worst case; then say *"KMP avoids re-scanning
  with a failure table"* and draw the LPS table for a 6-7 char pattern.
- Explain `lps` in one sentence: *"longest proper prefix that is also a suffix"* - and show the
  fall-back `len = lps[len-1]` on paper before coding.
- For hashing, always mention collisions and how you handle them (verify, or double hash).
- Manacher is rarely required; expand-around-center O(n²) is the expected answer, Manacher the
  bonus. Know the mirror idea well enough to explain it.
- Suffix arrays: know what they are and the O(n log² n) build; nobody expects SA-IS.
- Many "hard" string problems are KMP table + one observation (period, border, reversal).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Find the Index of the First Occurrence (strStr) | Easy | KMP search | 03_Problems/solutions/01_find_index_of_first_occurrence.js |
| 02 | Repeated Substring Pattern | Easy | LPS period trick | 03_Problems/solutions/02_repeated_substring_pattern.js |
| 03 | Repeated String Match | Medium | bound copies + KMP | 03_Problems/solutions/03_repeated_string_match.js |
| 04 | Longest Happy Prefix | Hard | lps[n-1] | 03_Problems/solutions/04_longest_happy_prefix.js |
| 05 | Longest Palindromic Substring | Medium | Manacher (and expand-around-center) | 03_Problems/solutions/05_longest_palindromic_substring.js |
| 06 | Shortest Palindrome | Hard | KMP on s + '#' + reverse(s) | 03_Problems/solutions/06_shortest_palindrome.js |
| 07 | Longest Duplicate Substring | Hard | binary search + rolling hash | 03_Problems/solutions/07_longest_duplicate_substring.js |
| 08 | Distinct Echo Substrings | Hard | prefix hashes, O(1) substring equality | 03_Problems/solutions/08_distinct_echo_substrings.js |
| 09 | Sum of Scores of Built Strings | Hard | Z-function | 03_Problems/solutions/09_sum_of_scores_of_built_strings.js |

---

## Practice more

Easy: Find the Index of the First Occurrence in a String (28), Repeated Substring Pattern (459),
Rotate String (796), Longest Common Prefix (14)

Medium: Longest Palindromic Substring (5), Repeated String Match (686), Longest Repeating
Substring (1062), Palindromic Substrings (647), Implement a Trie (208), Find All Anagrams in a
String (438), Number of Matching Subsequences (792), Minimum Number of Operations to Make a
String Sorted-ish variants, Remove All Occurrences of a Substring (1910), Count Prefixes (2255)

Hard: Shortest Palindrome (214), Longest Duplicate Substring (1044), Longest Happy Prefix (1392),
Distinct Echo Substrings (1316), Sum of Scores of Built Strings (2223), Palindrome Pairs (336),
Number of Distinct Substrings in a String (1698), Maximum Deletions on a String (2430),
Longest Common Subpath (1923), Shortest Common Supersequence (1092)
