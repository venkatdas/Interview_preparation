/**
 * Systematic enumeration of the classic search spaces.
 * Every function visits each candidate EXACTLY ONCE in a fixed order.
 *
 * 1. allPairs(n)               - [i, j] with i < j                      n(n-1)/2
 * 2. allSubarrays(a)           - [i, j, sum] for every i <= j (sums extended, O(1) each)   n(n+1)/2
 * 3. subsetsBitmask(a)         - every subset via masks 0 .. 2^n - 1     2^n
 * 4. subsetsRecursive(a)       - include/exclude recursion (same set, different order)
 * 5. kCombinations(a, k)       - subsets of size exactly k               C(n, k)
 * 6. permutations(a)           - all orders; duplicates in a produce each distinct order once
 * 7. cartesianProduct(lists)   - one choice from each list               product of lengths
 */

function allPairs(n) {
  const out = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out;
}

function allSubarrays(a) {
  const out = [];
  for (let i = 0; i < a.length; i++) {
    let sum = 0;
    for (let j = i; j < a.length; j++) {
      sum += a[j]; // extend the previous subarray instead of re-summing
      out.push([i, j, sum]);
    }
  }
  return out;
}

function subsetsBitmask(a) {
  if (a.length > 25) throw new RangeError('2^n too large to enumerate');
  const out = [];
  for (let mask = 0; mask < 1 << a.length; mask++) {
    const s = [];
    for (let i = 0; i < a.length; i++) if ((mask >> i) & 1) s.push(a[i]);
    out.push(s);
  }
  return out;
}

function subsetsRecursive(a) {
  const out = [], chosen = [];
  (function rec(i) {
    if (i === a.length) { out.push([...chosen]); return; } // copy: chosen keeps changing
    rec(i + 1);                                           // exclude a[i]
    chosen.push(a[i]); rec(i + 1); chosen.pop();          // include a[i], then undo
  })(0);
  return out;
}

function kCombinations(a, k) {
  const out = [], cur = [];
  (function rec(start) {
    if (cur.length === k) { out.push([...cur]); return; }
    // need k - cur.length more items; stop early if not enough remain
    for (let i = start; i <= a.length - (k - cur.length); i++) {
      cur.push(a[i]); rec(i + 1); cur.pop();
    }
  })(0);
  return out;
}

function permutations(a) {
  const sorted = [...a].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
  const out = [], cur = [], used = new Array(sorted.length).fill(false);
  (function rec() {
    if (cur.length === sorted.length) { out.push([...cur]); return; }
    for (let i = 0; i < sorted.length; i++) {
      if (used[i]) continue;
      // skip a duplicate value unless its identical left neighbour is already used in this prefix
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
      used[i] = true; cur.push(sorted[i]);
      rec();
      cur.pop(); used[i] = false;
    }
  })();
  return out;
}

function cartesianProduct(lists) {
  let out = [[]];
  for (const list of lists) {
    const next = [];
    for (const prefix of out) for (const x of list) next.push([...prefix, x]);
    out = next;
  }
  return out;
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const choose = (n, k) => fact(n) / (fact(k) * fact(n - k));
  const keySet = arrs => new Set(arrs.map(x => JSON.stringify(x)));

  for (let n = 0; n <= 7; n++) {
    const a = Array.from({ length: n }, (_, i) => i + 1);
    assert.strictEqual(allPairs(n).length, (n * (n - 1)) / 2 + 0); // + 0 turns -0 (n = 0) into 0
    const subs = allSubarrays(a);
    assert.strictEqual(subs.length, (n * (n + 1)) / 2);
    for (const [i, j, s] of subs) assert.strictEqual(s, a.slice(i, j + 1).reduce((x, y) => x + y, 0));
    const sb = subsetsBitmask(a), sr = subsetsRecursive(a);
    assert.strictEqual(sb.length, 2 ** n);
    assert.strictEqual(keySet(sb).size, 2 ** n, 'no duplicates');
    assert.deepStrictEqual(keySet(sb), keySet(sr), 'both methods produce the same family');
    for (let k = 0; k <= n; k++) assert.strictEqual(kCombinations(a, k).length, choose(n, k));
    const p = permutations(a);
    assert.strictEqual(p.length, fact(n));
    assert.strictEqual(keySet(p).size, fact(n));
  }
  // duplicates: [1,1,2] has 3!/2! = 3 distinct orders
  assert.deepStrictEqual(permutations([1, 1, 2]), [[1, 1, 2], [1, 2, 1], [2, 1, 1]]);
  assert.strictEqual(permutations([2, 2, 2, 3, 3]).length, 10);
  assert.strictEqual(cartesianProduct([[1, 2], ['a', 'b', 'c'], [true]]).length, 6);
  assert.deepStrictEqual(cartesianProduct([]), [[]]);
  assert.deepStrictEqual(subsetsBitmask([]), [[]]);
  assert.deepStrictEqual(allSubarrays([]), []);
  assert.throws(() => subsetsBitmask(new Array(26).fill(0)), RangeError);

  console.log('✓ enumeration.js self-test passed');
}

module.exports = { allPairs, allSubarrays, subsetsBitmask, subsetsRecursive, kCombinations, permutations, cartesianProduct };
