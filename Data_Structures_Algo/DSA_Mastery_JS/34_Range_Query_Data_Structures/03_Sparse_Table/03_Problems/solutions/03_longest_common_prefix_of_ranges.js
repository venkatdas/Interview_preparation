/**
 * 03. Longest Common Prefix of two suffixes (LCP queries)   (classic — Hard)
 *
 * PROBLEM
 * Given a string s and many queries (i, j), return the length of the longest common
 * prefix of the suffixes s[i..] and s[j..].
 * Example use: "how long do s[i..] and s[j..] agree?" is the core of repeated-substring,
 * distinct-substring counting and suffix-array based string problems.
 *
 * EXAMPLES
 * s = "banana"
 *   lcp(1, 3) -> "anana" vs "ana"  -> 3
 *   lcp(0, 2) -> "banana" vs "nana" -> 0
 *   lcp(2, 4) -> "nana" vs "na"    -> 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Many queries on one fixed string? (yes -> precompute; one query -> just compare chars)
 * - i === j allowed? (yes, answer = n - i)
 *
 * APPROACH 1 — Brute force   O(n) per query
 * Compare s[i + t] and s[j + t] for t = 0, 1, ... until they differ.
 *
 * APPROACH 2 — Optimal (Suffix array + LCP array + sparse table)   O(n log^2 n) build, O(1) query
 * 1. Suffix array `sa`: the suffix start indices sorted lexicographically, with `rank[i]` =
 *    position of suffix i in that order. Built by prefix doubling: sort by (rank[i], rank[i+k])
 *    pairs, doubling k each round -> O(n log^2 n) with a comparison sort.
 * 2. LCP array (Kasai): lcp[r] = LCP of the suffixes at sorted positions r-1 and r. O(n).
 * 3. Key fact: LCP of two suffixes at sorted positions a < b is the MIN of lcp[a+1..b].
 *    (Suffixes between them in sorted order share at least that much, and no more.)
 *    That is a static range-min query -> sparse table -> O(1).
 *
 * Dry run on "banana":
 *   suffixes sorted: a(5), ana(3), anana(1), banana(0), na(4), nana(2) -> sa = [5,3,1,0,4,2]
 *   rank = [3,2,5,1,4,0]   (rank[i] = where suffix i sits)
 *   lcp (between neighbours in sorted order) = [_, 1, 3, 0, 0, 2]
 *   lcp(1, 3): rank[1]=2, rank[3]=1 -> min(lcp[2..2]) = 3
 *   lcp(2, 4): rank[2]=5, rank[4]=4 -> min(lcp[5..5]) = 2
 *   lcp(0, 2): rank[0]=1, rank[2]=5 -> min(lcp[2..5]) = min(3,0,0,2) = 0
 *
 * EDGE CASES
 * - i === j -> n - i
 * - one suffix is a prefix of the other ("ana" vs "anana" -> 3)
 * - single-character string
 */

function bruteForce(s, queries) {
  return queries.map(([i, j]) => {
    let len = 0;
    while (i + len < s.length && j + len < s.length && s[i + len] === s[j + len]) len++;
    return len;
  });
}

// suffix array by prefix doubling, O(n log^2 n)
function buildSuffixArray(s) {
  const n = s.length;
  let rank = Array.from(s, (ch) => ch.charCodeAt(0));
  const sa = Array.from({ length: n }, (_, i) => i);
  for (let k = 1; ; k *= 2) {
    const key = (i) => [rank[i], i + k < n ? rank[i + k] : -1];
    sa.sort((a, b) => {
      const [a1, a2] = key(a);
      const [b1, b2] = key(b);
      return a1 !== b1 ? a1 - b1 : a2 - b2;
    });
    const newRank = new Array(n);
    newRank[sa[0]] = 0;
    for (let r = 1; r < n; r++) {
      const [p1, p2] = key(sa[r - 1]);
      const [c1, c2] = key(sa[r]);
      newRank[sa[r]] = newRank[sa[r - 1]] + (p1 !== c1 || p2 !== c2 ? 1 : 0);
    }
    rank = newRank;
    if (rank[sa[n - 1]] === n - 1) break;   // all ranks distinct -> sorted
  }
  return { sa, rank };
}

// Kasai: lcp[r] = LCP(sa[r-1], sa[r]) for r >= 1
function buildLCP(s, sa, rank) {
  const n = s.length;
  const lcp = new Array(n).fill(0);
  let h = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] === 0) { h = 0; continue; }
    const j = sa[rank[i] - 1];              // previous suffix in sorted order
    while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
    lcp[rank[i]] = h;
    if (h > 0) h--;                          // the next suffix loses at most one char of LCP
  }
  return lcp;
}

function optimal(s, queries) {
  const n = s.length;
  const { sa, rank } = buildSuffixArray(s);
  const lcp = buildLCP(s, sa, rank);

  // sparse table of mins over lcp
  const log = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) log[i] = log[i >> 1] + 1;
  const table = [lcp.slice()];
  for (let k = 1; (1 << k) <= n; k++) {
    const prev = table[k - 1];
    const half = 1 << (k - 1);
    const row = [];
    for (let i = 0; i + (1 << k) <= n; i++) row.push(Math.min(prev[i], prev[i + half]));
    table.push(row);
  }
  function rangeMin(l, r) {
    const k = log[r - l + 1];
    return Math.min(table[k][l], table[k][r - (1 << k) + 1]);
  }

  return queries.map(([i, j]) => {
    if (i === j) return n - i;
    let a = rank[i];
    let b = rank[j];
    if (a > b) [a, b] = [b, a];
    return rangeMin(a + 1, b);
  });
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve('banana', [[1, 3], [0, 2], [2, 4], [3, 3], [0, 0]]), [3, 0, 2, 3, 6]);
  assert.deepStrictEqual(solve('aaaa', [[0, 1], [0, 3], [2, 3]]), [3, 1, 1]);
  assert.deepStrictEqual(solve('abcd', [[0, 1], [1, 2]]), [0, 0]);
  assert.deepStrictEqual(solve('z', [[0, 0]]), [1]);
  assert.deepStrictEqual(solve('abab', [[0, 2], [1, 3]]), [2, 1]);
}
for (let trial = 0; trial < 60; trial++) {
  const n = 1 + Math.floor(Math.random() * 25);
  const s = Array.from({ length: n }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
  const queries = Array.from({ length: 20 }, () => [
    Math.floor(Math.random() * n),
    Math.floor(Math.random() * n),
  ]);
  assert.deepStrictEqual(optimal(s, queries), bruteForce(s, queries));
}
console.log('✓ 03-longest-common-prefix-of-ranges passed');

module.exports = { optimal, bruteForce, buildSuffixArray, buildLCP };
