/**
 * 08. Distinct Echo Substrings   (LeetCode 1316 — Hard)
 *
 * PROBLEM
 * An "echo" substring is some string concatenated with itself (a + a). Return the number
 * of DISTINCT echo substrings of text.
 *
 * EXAMPLES
 * Input: "abcabcabc"   Output: 3   ("abcabc", "bcabca", "cabcab")
 * Input: "leetcodeleetcode"   Output: 2   ("ee", "leetcodeleetcode")
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 2000 -> O(n^2) candidates (start, half-length), each must be checked fast
 * - Distinct means by content, not by position
 *
 * APPROACH 1 — Brute force   O(n^3) time
 * For every start and every even length, compare the two halves character by character and
 * put the substring in a Set.
 *
 * APPROACH 2 — Optimal (Prefix hashes: O(1) substring comparison)   O(n^2) time, O(n) space
 * Precompute prefix[i] = hash of text[0..i) and powers of the base so that
 *   hash(l, r) = prefix[r] - prefix[l] * B^(r - l)   (mod M)
 * in O(1). For each start i and half-length len, the substring is an echo iff
 *   hash(i, i + len) === hash(i + len, i + 2 * len)
 * Record the hash of the whole echo (hash(i, i + 2 len) together with its length) in a Set
 * to count distinct ones. Collisions are extremely unlikely with a 1e9+7 modulus; a
 * paranoid version verifies with a real string compare when adding to the Set.
 * JS trap: prefix[l] * B^k is ~1e18 > 2^53 and would lose precision; use a safe mulMod.
 *
 * Dry run on "abcabcabc" (n = 9):
 *   len = 3: i=0 "abc"=="abc" yes -> add "abcabc"; i=1 "bca"=="bca" -> add; i=2 "cab"=="cab" -> add;
 *            i=3 "abc"=="abc" -> "abcabc" again (same hash, Set ignores)
 *   len = 1, 2, 4: no equal halves -> total 3
 *
 * EDGE CASES
 * - no echoes -> 0
 * - "aaaa" -> "aa" and "aaaa" -> 2
 * - length 1 -> 0
 */

function bruteForce(text) {
  const seen = new Set();
  for (let i = 0; i < text.length; i++) {
    for (let len = 1; i + 2 * len <= text.length; len++) {
      if (text.slice(i, i + len) === text.slice(i + len, i + 2 * len)) {
        seen.add(text.slice(i, i + 2 * len));
      }
    }
  }
  return seen.size;
}

const BASE = 131;
const MOD = 1_000_000_007;

// a * b mod MOD without losing precision: a plain product can exceed 2^53 (1e9 * 1e9),
// so split b into 16-bit halves and keep every intermediate below 2^47.
function mulMod(a, b) {
  const high = Math.floor(b / 65536);
  const low = b % 65536;
  return ((a * high) % MOD * 65536 + a * low) % MOD;
}

function optimal(text) {
  const n = text.length;
  const prefix = new Array(n + 1).fill(0);
  const power = new Array(n + 1).fill(1);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = (prefix[i] * BASE + text.charCodeAt(i)) % MOD;
    power[i + 1] = (power[i] * BASE) % MOD;
  }
  function hash(l, r) {                             // text[l..r)
    const v = (prefix[r] - mulMod(prefix[l], power[r - l])) % MOD;
    return v < 0 ? v + MOD : v;
  }

  const seen = new Set();                            // "hash:length" of whole echo strings
  for (let len = 1; 2 * len <= n; len++) {
    for (let i = 0; i + 2 * len <= n; i++) {
      if (hash(i, i + len) === hash(i + len, i + 2 * len)) {
        seen.add(hash(i, i + 2 * len) + ':' + len);
      }
    }
  }
  return seen.size;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('abcabcabc'), 3);
  assert.strictEqual(solve('leetcodeleetcode'), 2);
  assert.strictEqual(solve('aaaa'), 2);
  assert.strictEqual(solve('a'), 0);
  assert.strictEqual(solve('abcd'), 0);
  assert.strictEqual(solve('abab'), 1);
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const s = randomString(Math.floor(Math.random() * 16));
  assert.strictEqual(optimal(s), bruteForce(s));
}
console.log('✓ 08-distinct-echo-substrings passed');

module.exports = { optimal, bruteForce };
