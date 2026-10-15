# 23 — Advanced Algorithms

The algorithms in this folder are the ones that turn a "hard" interview question into a
known one: linear-time string matching, divide & conquer with its recurrences, the named
classic tricks (voting, cycle finding, reservoir sampling, quickselect, meet in the middle,
binary lifting), and a light dose of geometry. Each sub-folder explains from zero, provides a
runnable implementation with randomized tests against a brute-force reference, and a set of
problems in the standard format. Finish `../35_Advanced_Data_Structures/` first (or at
least segment tree, Fenwick and monotonic structures), since several problems here point to it.

---

## Overview

| Algorithm / technique | What problem it solves | Complexity | Folder |
|-----------------------|------------------------|------------|--------|
| Naive string search | find pattern in text (baseline) | O(n·m) | [33_String_Algorithms_Advanced](../../33_String_Algorithms_Advanced) |
| KMP + failure table (LPS) | find all occurrences; periods; longest prefix that is also a suffix | O(n + m) | 33_String_Algorithms_Advanced |
| Rabin-Karp rolling hash | search by fingerprint; compare substrings in O(1) | O(n + m) expected | 33_String_Algorithms_Advanced |
| Z-function | longest common prefix of s and every suffix | O(n) | 33_String_Algorithms_Advanced |
| Manacher | longest palindromic substring | O(n) | 33_String_Algorithms_Advanced |
| Suffix array + LCP | sorted suffixes; repeats; distinct substrings | O(n log² n) build | 33_String_Algorithms_Advanced |
| Polynomial hashing | O(1) substring equality, binary search on length | O(n) build | 33_String_Algorithms_Advanced |
| Merge sort / count inversions | sort; count pairs out of order | O(n log n) | [30_Divide_And_Conquer](../../30_Divide_And_Conquer) |
| Maximum subarray (D&C) | best subarray via left / right / crossing | O(n log n) | 30_Divide_And_Conquer |
| Fast exponentiation | x^n, a^b mod m, matrix power | O(log n) | 30_Divide_And_Conquer |
| Merge k sorted lists | pairwise merge | O(N log k) | 30_Divide_And_Conquer |
| Median of two sorted arrays | binary search on the partition | O(log min(m, n)) | 30_Divide_And_Conquer |
| Skyline (D&C merge) | union outline of buildings | O(n log n) | 30_Divide_And_Conquer |
| Master theorem | solve T(n) = aT(n/b) + f(n) | - | 30_Divide_And_Conquer |
| Kadane | maximum subarray sum | O(n) | [41_Advanced_Algorithm_Design/01_Classic_Techniques](../01_Classic_Techniques) |
| Boyer-Moore majority vote | element appearing > n/2 (or > n/k) times | O(n), O(1) space | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Floyd's tortoise & hare | duplicate in an array / cycle entrance | O(n), O(1) space | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Dutch national flag | 3-way partition in place | O(n) | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Reservoir sampling | uniform sample from a stream of unknown length | O(n) | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Fisher-Yates | uniform shuffle | O(n) | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Quickselect | k-th smallest without sorting | expected O(n) | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Meet in the middle | subset problems with n <= 40 | O(2^(n/2) · n) | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Cyclic sort | permutations of 1..n, missing / duplicate numbers | O(n), O(1) space | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Sqrt decomposition | range query + point update, simple | O(√n) query | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Binary lifting / LCA | k-th ancestor, lowest common ancestor, many queries | O(n log n) build, O(log n) query | 41_Advanced_Algorithm_Design/01_Classic_Techniques |
| Cross product / orientation | left/right/collinear without division | O(1) | [39_Geometric_Algorithms](../../39_Geometric_Algorithms) |
| Convex hull (monotone chain) | outer boundary of a point set | O(n log n) | 39_Geometric_Algorithms |
| Shoelace formula | area of a polygon | O(n) | 39_Geometric_Algorithms |
| Rectangle overlap / area | axis-aligned rectangles | O(1) | 39_Geometric_Algorithms |
| Segment intersection | do two segments cross | O(1) | 39_Geometric_Algorithms |

---

## How to recognise which one you need

```
"find / count a pattern", "prefix that is also a suffix", "is it periodic"   -> KMP (LPS)
"compare many substrings", "longest duplicate substring"                       -> rolling hash (+ binary search)
"longest palindromic substring" and O(n) is demanded                           -> Manacher
"same problem on both halves + some combining work"                            -> divide & conquer
"k-th largest" / "closest k" without sorting                                    -> quickselect
"majority", "duplicate with O(1) space", "missing number"                       -> voting / Floyd / cyclic sort
"random", "stream", "uniform"                                                   -> reservoir / Fisher-Yates
"n <= 40 and subsets"                                                           -> meet in the middle
"k-th ancestor", "LCA, many queries"                                            -> binary lifting
"points", "collinear", "fence", "rectangles"                                    -> geometry (cross product first)
```

---

## Study order

1. **41_Advanced_Algorithm_Design/01_Classic_Techniques** — short, self-contained, and the most frequently asked. Do Kadane,
   voting, Floyd, Fisher-Yates and reservoir sampling first; quickselect and meet in the middle
   next; binary lifting last.
2. **30_Divide_And_Conquer** — you already know merge sort and binary search; this folder names
   the pattern and teaches the recurrence/master theorem you'll be asked to analyse.
3. **33_String_Algorithms_Advanced** — learn KMP's LPS table thoroughly (it answers five different
   problems here), then rolling hash. Treat Z, Manacher and suffix arrays as "understand and
   be able to explain".
4. **39_Geometric_Algorithms** — one evening: cross product, rectangles, convex hull.

Every `.js` file runs with `node <file>` and prints a check mark when its tests pass.

---

## Sub-folders

| Folder | Implementation file | Problems |
|--------|--------------------|----------|
| 33_String_Algorithms_Advanced/ | string-algorithms.js | 9 |
| 30_Divide_And_Conquer/ | divide-and-conquer.js | 8 |
| 41_Advanced_Algorithm_Design/01_Classic_Techniques/ | classic-techniques.js | 10 |
| 39_Geometric_Algorithms/ | geometry.js | 7 |

Previous: `../35_Advanced_Data_Structures/`. Next: `../42_Interview_Problem_Patterns/` and
`../45_Revision_And_Spaced_Repetition/`.
