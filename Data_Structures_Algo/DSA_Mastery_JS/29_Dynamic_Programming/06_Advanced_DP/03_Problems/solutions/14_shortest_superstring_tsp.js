/**
 * 14. Find the Shortest Superstring / Travelling Salesman for small n   (LeetCode 943 — Hard)
 *
 * PROBLEM
 * Given words (none is a substring of another), return the shortest string that
 * contains every word as a substring. If several, any is accepted.
 *
 * EXAMPLES
 * Input: ["alex","loves","leetcode"]   Output: "alexlovesleetcode" (any order works, no overlap)
 * Input: ["catg","ctaagt","gcta","ttca","atgcatc"]   Output: "gctaagttcatgcatc"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 12, word length <= 20. n <= 12 -> 2^12 * 12 * 12 ~ 600k ops: bitmask DP.
 * - Why is this TSP? Each word is a city. Placing word j right after word i costs
 *   len(j) - overlap(i, j) extra characters. We need the cheapest ORDER visiting every
 *   city once: exactly the Travelling Salesman Problem (path version).
 *
 * APPROACH 1 — Brute force (plain recursion over permutations)   O(n! * n) time
 * Try every order, merge greedily with max overlap, keep the shortest. Fine for n <= 7.
 *
 * APPROACH 2 — Bitmask DP (Held-Karp)   O(2^n * n^2) time, O(2^n * n) space
 * Precompute overlap[i][j] = longest suffix of word i that is a prefix of word j.
 * STATE      dp[mask][last] = minimum total length of a superstring that uses exactly
 *            the words in `mask` and ENDS with word `last`.
 * RECURRENCE dp[mask | (1<<j)][j] = min( dp[mask][last] + len(j) - overlap[last][j] )
 *            for every j not in mask.
 * BASE CASES dp[1 << i][i] = len(words[i]).
 * ANSWER     min over last of dp[full][last]; keep a parent[mask][last] table to
 *            rebuild the actual order (path reconstruction), then merge the words.
 *
 * Dry run words = ["ab", "bc", "ca"] (overlap ab->bc = 1, bc->ca = 1, ca->ab = 1, others 0):
 *   mask 001 (ab) last 0 : 2      mask 010 (bc) last 1 : 2      mask 100 (ca) last 2 : 2
 *   mask 011 last 1 (ab then bc) : 2 + 2 - 1 = 3     mask 011 last 0 (bc then ab): 4
 *   mask 110 last 2 (bc then ca) : 3                 mask 101 last 0 (ca then ab): 3
 *   mask 111 last 2 : from 011/last1 -> 3 + 2 - 1 = 4  ("abca")
 *   answer length 4, e.g. "abca" (or "bcab", "cabc")
 *
 * EDGE CASES
 * - one word -> that word
 * - no overlaps at all -> any concatenation, total = sum of lengths
 */

function overlapTable(words) {
  const n = words.length;
  const overlap = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const maxLen = Math.min(words[i].length, words[j].length) - 1; // strict: no word is a substring
      for (let len = maxLen; len > 0; len--) {
        if (words[i].endsWith(words[j].slice(0, len))) { overlap[i][j] = len; break; }
      }
    }
  }
  return overlap;
}

function mergeInOrder(words, order, overlap) {
  let result = words[order[0]];
  for (let p = 1; p < order.length; p++) {
    const prev = order[p - 1], next = order[p];
    result += words[next].slice(overlap[prev][next]);
  }
  return result;
}

function bruteForce(words) {
  const n = words.length;
  const overlap = overlapTable(words);
  let best = null;
  function permute(order, used) {
    if (order.length === n) {
      const candidate = mergeInOrder(words, order, overlap);
      if (best === null || candidate.length < best.length) best = candidate;
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used & (1 << i)) continue;
      order.push(i);
      permute(order, used | (1 << i));
      order.pop();
    }
  }
  permute([], 0);
  return best;
}

function memo(words) {
  const n = words.length;
  const overlap = overlapTable(words);
  const full = (1 << n) - 1;
  const cache = new Map(); // key mask * n + last -> [minExtraLength, nextWord]
  // remaining(mask, last) = min extra characters needed to add all words NOT in mask
  function remaining(mask, last) {
    if (mask === full) return [0, -1];
    const key = mask * n + last;
    if (cache.has(key)) return cache.get(key);
    let best = [Infinity, -1];
    for (let j = 0; j < n; j++) {
      if (mask & (1 << j)) continue;
      const [rest] = remaining(mask | (1 << j), j);
      const cost = words[j].length - overlap[last][j] + rest;
      if (cost < best[0]) best = [cost, j];
    }
    cache.set(key, best);
    return best;
  }
  let bestStart = 0, bestLength = Infinity;
  for (let i = 0; i < n; i++) {
    const [rest] = remaining(1 << i, i);
    if (words[i].length + rest < bestLength) { bestLength = words[i].length + rest; bestStart = i; }
  }
  // follow the stored "next" pointers to rebuild the order
  const order = [bestStart];
  let mask = 1 << bestStart, last = bestStart;
  while (mask !== full) {
    const [, next] = remaining(mask, last);
    order.push(next);
    mask |= 1 << next;
    last = next;
  }
  return mergeInOrder(words, order, overlap);
}

function tabulation(words) {
  const n = words.length;
  const overlap = overlapTable(words);
  const size = 1 << n;
  const full = size - 1;
  const dp = Array.from({ length: size }, () => new Array(n).fill(Infinity));
  const parent = Array.from({ length: size }, () => new Array(n).fill(-1));
  for (let i = 0; i < n; i++) dp[1 << i][i] = words[i].length;

  for (let mask = 1; mask < size; mask++) {
    for (let last = 0; last < n; last++) {
      if (dp[mask][last] === Infinity) continue; // unreachable state
      for (let j = 0; j < n; j++) {
        if (mask & (1 << j)) continue;
        const nextMask = mask | (1 << j);
        const cost = dp[mask][last] + words[j].length - overlap[last][j];
        if (cost < dp[nextMask][j]) {
          dp[nextMask][j] = cost;
          parent[nextMask][j] = last;
        }
      }
    }
  }
  // best ending word, then walk parents backwards
  let last = 0;
  for (let i = 1; i < n; i++) if (dp[full][i] < dp[full][last]) last = i;
  const order = [];
  let mask = full;
  while (last !== -1) {
    order.push(last);
    const prev = parent[mask][last];
    mask ^= 1 << last;
    last = prev;
  }
  order.reverse();
  return mergeInOrder(words, order, overlap);
}

// ---------- tests ----------
const assert = require('assert');
function containsAll(result, words) {
  return words.every((word) => result.includes(word));
}
const cases = [
  [['alex', 'loves', 'leetcode'], 17],
  [['catg', 'ctaagt', 'gcta', 'ttca', 'atgcatc'], 16],
  [['ab', 'bc', 'ca'], 4],
  [['abc'], 3],
  [['abcd', 'cdef', 'efgh'], 8],
  [['x', 'y', 'z'], 3],
];
for (const solve of [bruteForce, memo, tabulation]) {
  for (const [words, expectedLength] of cases) {
    const result = solve(words);
    assert.strictEqual(result.length, expectedLength, `${solve.name} on ${words}`);
    assert.ok(containsAll(result, words), `${solve.name} output misses a word`);
  }
}
console.log('✓ 14-shortest-superstring-tsp passed');

module.exports = { bruteForce, memo, tabulation };
