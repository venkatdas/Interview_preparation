/**
 * Algorithms whose total work is bounded by an amortized argument, with counters.
 *
 * 1. BinaryCounter        - increment flips < 2 bits on average; checks the potential function at every step
 * 2. nextGreaterCounted   - monotonic stack: total pops <= n
 * 3. UnionFind            - union by rank + path compression; counts parent-pointer steps
 */

// ---------- 1. Binary counter ----------
class BinaryCounter {
  constructor(bits = 64) { this.bits = new Array(bits).fill(0); this.flips = 0; }
  ones() { return this.bits.reduce((a, b) => a + b, 0); }  // the potential Φ
  increment() {
    let i = 0, cost = 0;
    while (i < this.bits.length && this.bits[i] === 1) { this.bits[i++] = 0; cost++; } // clear trailing ones
    if (i < this.bits.length) { this.bits[i] = 1; cost++; }
    this.flips += cost;
    return cost;
  }
  value() { return this.bits.reduceRight((acc, b) => acc * 2 + b, 0); }
}

// ---------- 2. Monotonic stack with counters ----------
function nextGreaterCounted(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = [];
  let pushes = 0, pops = 0;
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) { res[stack.pop()] = nums[i]; pops++; }
    stack.push(i); pushes++;
  }
  return { res, pushes, pops };
}

// ---------- 3. Union-find ----------
class UnionFind {
  constructor(n, { rank = true, compress = true } = {}) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.useRank = rank; this.useCompress = compress;
    this.steps = 0;       // parent pointers followed
    this.components = n;
  }
  find(x) {
    let root = x;
    while (this.parent[root] !== root) { root = this.parent[root]; this.steps++; }
    if (this.useCompress) {
      while (this.parent[x] !== root) { const next = this.parent[x]; this.parent[x] = root; x = next; }
    }
    return root;
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.useRank) {
      if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
      this.parent[rb] = ra;
      if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    } else {
      this.parent[ra] = rb; // naive: always hang a under b (can build a long chain)
    }
    this.components--;
    return true;
  }
  connected(a, b) { return this.find(a) === this.find(b); }
}

function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // binary counter: potential argument checked at EVERY step: cost + ΔΦ <= 2
  const c = new BinaryCounter(32);
  for (let n = 1; n <= 5000; n++) {
    const before = c.ones();
    const cost = c.increment();
    assert.ok(cost + (c.ones() - before) <= 2, 'amortized cost <= 2');
    assert.strictEqual(c.value(), n);
  }
  assert.ok(c.flips < 2 * 5000);

  // monotonic stack: pops <= pushes = n, and matches brute force
  const rand = mulberry32(502);
  for (let t = 0; t < 200; t++) {
    const a = Array.from({ length: Math.floor(rand() * 60) }, () => Math.floor(rand() * 20));
    const { res, pushes, pops } = nextGreaterCounted(a);
    const brute = a.map((x, i) => { for (let j = i + 1; j < a.length; j++) if (a[j] > x) return a[j]; return -1; });
    assert.deepStrictEqual(res, brute);
    assert.strictEqual(pushes, a.length);
    assert.ok(pops <= a.length);
  }
  // worst single step pops n-1 elements, total still n-1
  const spike = nextGreaterCounted([...Array.from({ length: 1000 }, (_, i) => 1000 - i), 5000]);
  assert.strictEqual(spike.pops, 1000);

  // union-find: same answers with and without optimisations; optimised does far fewer steps
  const n = 20000;
  const fast = new UnionFind(n), naive = new UnionFind(n, { rank: false, compress: false });
  for (let i = 1; i < n; i++) { fast.union(i - 1, i); naive.union(i - 1, i); } // builds a chain for naive
  let ops = 0;
  for (let k = 0; k < 2000; k++) {
    const a = Math.floor(rand() * n), b = Math.floor(rand() * n);
    assert.strictEqual(fast.connected(a, b), naive.connected(a, b));
    ops++;
  }
  assert.ok(fast.steps < 10 * (n + 2 * ops), `fast steps ${fast.steps}`);
  assert.ok(naive.steps > 50 * fast.steps, 'naive chain is dramatically slower');
  assert.strictEqual(fast.components, 1);

  console.log('✓ amortized_algorithms.js self-test passed');
}

module.exports = { BinaryCounter, nextGreaterCounted, UnionFind, mulberry32 };
