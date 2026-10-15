/**
 * Sparse Table in JavaScript: O(1) range queries on a STATIC array for IDEMPOTENT
 * operations (min, max, gcd, and, or) after an O(n log n) build.
 *
 * table[k][i] = op over the block of length 2^k starting at i:  values[i .. i + 2^k - 1]
 *
 * Build:  table[0][i] = values[i]
 *         table[k][i] = op(table[k-1][i], table[k-1][i + 2^(k-1)])   (two half blocks)
 *
 * Query [l, r]: k = floor(log2(r - l + 1)); the two blocks [l, l + 2^k) and (r - 2^k, r]
 * together cover [l, r] and OVERLAP. Overlap is harmless only when op(x, x) = x
 * (idempotent): min(min(a,b), min(b,c)) is still min(a,b,c), but sum would count b twice.
 *
 * For a non-idempotent op like sum you must split [l, r] into DISJOINT power-of-two blocks
 * (walk the bits of the length): O(log n) per query - see querySumDisjoint below. At that
 * point a prefix-sum array (O(1)) or a Fenwick tree (if updates) is the better tool.
 */

class SparseTable {
  constructor(values, op = Math.min) {
    this.n = values.length;
    this.op = op;
    // log2 lookup: log[x] = floor(log2 x), filled iteratively to avoid Math.log2 float issues
    this.log = new Array(this.n + 1).fill(0);
    for (let i = 2; i <= this.n; i++) this.log[i] = this.log[i >> 1] + 1;

    const levels = this.log[this.n] + 1;
    this.table = [values.slice()];
    for (let k = 1; k < levels; k++) {
      const half = 1 << (k - 1);
      const prev = this.table[k - 1];
      const row = new Array(this.n - (1 << k) + 1);
      for (let i = 0; i + (1 << k) <= this.n; i++) row[i] = op(prev[i], prev[i + half]);
      this.table.push(row);
    }
  }

  // op over values[l..r] inclusive, O(1). Only valid for idempotent op.
  query(l, r) {
    if (l > r) throw new Error('empty range');
    const k = this.log[r - l + 1];
    return this.op(this.table[k][l], this.table[k][r - (1 << k) + 1]);
  }

  // O(log n) query that works for ANY associative op by using disjoint blocks.
  // Shown for contrast; the table must have been built with the same op.
  queryDisjoint(l, r, identity) {
    let result = identity;
    let i = l;
    while (i <= r) {
      // largest k such that block [i, i + 2^k) fits inside [i, r]
      let k = this.log[r - i + 1];
      result = this.op(result, this.table[k][i]);
      i += 1 << k;
    }
    return result;
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}
function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

const ops = [
  { op: Math.min, identity: Infinity },
  { op: Math.max, identity: -Infinity },
  { op: gcd, identity: 0 },
];
for (const { op, identity } of ops) {
  for (let trial = 0; trial < 40; trial++) {
    const n = randomInt(1, 50);
    const values = Array.from({ length: n }, () => randomInt(1, 60));
    const st = new SparseTable(values, op);
    for (let q = 0; q < 100; q++) {
      const l = randomInt(0, n - 1);
      const r = randomInt(l, n - 1);
      let expected = identity;
      for (let i = l; i <= r; i++) expected = op(expected, values[i]);
      assert.strictEqual(st.query(l, r), expected);
      assert.strictEqual(st.queryDisjoint(l, r, identity), expected);
    }
  }
}

// sum via disjoint blocks (NOT via query(), which would double count)
for (let trial = 0; trial < 20; trial++) {
  const n = randomInt(1, 50);
  const values = Array.from({ length: n }, () => randomInt(-20, 20));
  const st = new SparseTable(values, (a, b) => a + b);
  for (let q = 0; q < 50; q++) {
    const l = randomInt(0, n - 1);
    const r = randomInt(l, n - 1);
    let expected = 0;
    for (let i = l; i <= r; i++) expected += values[i];
    assert.strictEqual(st.queryDisjoint(l, r, 0), expected);
  }
}

const st = new SparseTable([5, 2, 8, 6, 3, 1, 7]);
assert.strictEqual(st.query(0, 6), 1);
assert.strictEqual(st.query(2, 4), 3);
assert.strictEqual(st.query(3, 3), 6);
assert.throws(() => st.query(3, 2));

console.log('✓ sparse-table.js self-test passed');

module.exports = { SparseTable };
