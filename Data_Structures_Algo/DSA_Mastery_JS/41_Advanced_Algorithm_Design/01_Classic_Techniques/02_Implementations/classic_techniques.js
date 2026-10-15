/**
 * Classic interview techniques in JavaScript, one function each.
 *
 *   kadane(nums)                      max subarray sum, O(n)
 *   majorityVote(nums)                Boyer-Moore: the element appearing > n/2 times (assumed to exist), O(n)
 *   majorityVoteK(nums, k)            all elements appearing > n/k times, O(n*k) time, O(k) space
 *   floydFindDuplicate(nums)          the duplicate in an array of n+1 values in 1..n, O(n) time O(1) space
 *   dutchNationalFlag(nums)           in-place 3-way partition of 0/1/2, O(n)
 *   reservoirSample(iterable, k)      k uniformly random items from a stream of unknown length
 *   fisherYates(array)                in-place uniform shuffle, O(n)
 *   quickSelect(nums, k)              k-th smallest (0-indexed), expected O(n)
 *   cyclicSort(nums)                  sorts a permutation of 1..n in place, O(n)
 *   binaryLiftingLCA(n, parent, root) -> { depth, up, lca(u, v), kthAncestor(v, k) }, O(n log n) build, O(log n) query
 *   sqrtDecompositionRangeSum(nums)   -> { update(i, value), query(l, r) }, O(1) update, O(sqrt n) query
 */

// ---------- Kadane ----------
// best ending here = nums[i] + max(0, best ending at i-1): either extend or start fresh.
function kadane(nums) {
  let bestEndingHere = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    bestEndingHere = Math.max(nums[i], bestEndingHere + nums[i]);
    best = Math.max(best, bestEndingHere);
  }
  return best;
}

// ---------- Boyer-Moore majority vote ----------
// Pair up each element with a different one and cancel both; a true majority survives.
function majorityVote(nums) {
  let candidate = null;
  let count = 0;
  for (const x of nums) {
    if (count === 0) candidate = x;
    count += x === candidate ? 1 : -1;
  }
  return candidate;
}

// Generalisation: at most k-1 elements can appear more than n/k times. Keep k-1 candidate
// slots; an element not matching any slot decrements ALL of them (cancels k distinct values
// at once). Survivors must be verified with a second pass.
function majorityVoteK(nums, k) {
  const candidates = new Map();              // value -> count, at most k-1 entries
  for (const x of nums) {
    if (candidates.has(x)) {
      candidates.set(x, candidates.get(x) + 1);
    } else if (candidates.size < k - 1) {
      candidates.set(x, 1);
    } else {
      for (const [value, count] of candidates) {
        if (count === 1) candidates.delete(value);
        else candidates.set(value, count - 1);
      }
    }
  }
  const result = [];
  for (const value of candidates.keys()) {
    let count = 0;
    for (const x of nums) if (x === value) count++;
    if (count > nums.length / k) result.push(value);
  }
  return result;
}

// ---------- Floyd's tortoise and hare on an array ----------
// Treat i -> nums[i] as a linked list. n+1 slots with values in 1..n means some value is
// pointed to twice: the entry of a cycle. Phase 1 finds a meeting point inside the cycle,
// phase 2 walks two pointers at speed 1 from the start and the meeting point; they meet at
// the cycle entrance = the duplicate value.
function floydFindDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}

// ---------- Dutch national flag ----------
// [0, low) are 0s, [low, mid) are 1s, (high, n) are 2s, [mid, high] unknown.
function dutchNationalFlag(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;                                  // do NOT advance mid: the swapped-in value is unknown
    } else {
      mid++;
    }
  }
  return nums;
}

// ---------- Reservoir sampling ----------
// Keep the first k items. The i-th item (1-indexed, i > k) replaces a random slot with
// probability k / i. Every item ends up chosen with probability exactly k / n.
function reservoirSample(iterable, k) {
  const reservoir = [];
  let seen = 0;
  for (const item of iterable) {
    seen++;
    if (reservoir.length < k) {
      reservoir.push(item);
    } else {
      const j = Math.floor(Math.random() * seen);   // 0..seen-1
      if (j < k) reservoir[j] = item;                // probability k / seen
    }
  }
  return reservoir;
}

// ---------- Fisher-Yates shuffle ----------
// For i from the end down: swap i with a random index in [0, i]. Every permutation is
// equally likely. (sort(() => Math.random() - 0.5) is NOT uniform.)
function fisherYates(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ---------- Quickselect ----------
// k-th smallest (0-indexed). Partition around a random pivot; recurse into the one side
// that contains k. Expected O(n): n + n/2 + n/4 + ... = 2n.
function quickSelect(nums, k) {
  const arr = nums.slice();
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const pivotIndex = lo + Math.floor(Math.random() * (hi - lo + 1));
    const pivot = arr[pivotIndex];
    // 3-way partition: [lo, lt) < pivot, [lt, gt] == pivot, (gt, hi] > pivot
    let lt = lo;
    let gt = hi;
    let i = lo;
    while (i <= gt) {
      if (arr[i] < pivot) [arr[lt++], arr[i++]] = [arr[i], arr[lt]];
      else if (arr[i] > pivot) [arr[gt--], arr[i]] = [arr[i], arr[gt]];
      else i++;
    }
    if (k < lt) hi = lt - 1;
    else if (k > gt) lo = gt + 1;
    else return pivot;
  }
  return arr[lo];
}

// ---------- Cyclic sort ----------
// Values are exactly 1..n: value v belongs at index v-1. Swap each element into its home
// until the current slot holds the right value. Each swap places one element permanently.
function cyclicSort(nums) {
  let i = 0;
  while (i < nums.length) {
    const home = nums[i] - 1;
    if (nums[i] !== nums[home]) [nums[i], nums[home]] = [nums[home], nums[i]];
    else i++;
  }
  return nums;
}

// ---------- Binary lifting / LCA ----------
// up[k][v] = the 2^k-th ancestor of v (or root if it would go past the root).
// up[0][v] = parent[v];  up[k][v] = up[k-1][ up[k-1][v] ]   (jump 2^(k-1) twice).
// kthAncestor(v, k): decompose k into powers of two and jump.
// lca(u, v): lift the deeper node to the same depth, then lift both together with the
// LARGEST jumps that keep them different; their parent is the LCA.
function binaryLiftingLCA(n, parent, root = 0) {
  const LOG = Math.max(1, Math.ceil(Math.log2(n + 1)));
  const children = Array.from({ length: n }, () => []);
  for (let v = 0; v < n; v++) if (v !== root) children[parent[v]].push(v);

  // depths by iterative DFS (no recursion limit issues)
  const depth = new Array(n).fill(0);
  const order = [];
  const stack = [root];
  while (stack.length) {
    const v = stack.pop();
    order.push(v);
    for (const c of children[v]) {
      depth[c] = depth[v] + 1;
      stack.push(c);
    }
  }

  const up = Array.from({ length: LOG }, () => new Array(n).fill(root));
  for (let v = 0; v < n; v++) up[0][v] = v === root ? root : parent[v];
  for (let k = 1; k < LOG; k++) {
    for (let v = 0; v < n; v++) up[k][v] = up[k - 1][up[k - 1][v]];
  }

  function kthAncestor(v, k) {
    if (k > depth[v]) return -1;
    for (let bit = 0; k > 0 && bit < LOG; bit++, k >>= 1) {
      if (k & 1) v = up[bit][v];
    }
    return v;
  }

  function lca(u, v) {
    if (depth[u] < depth[v]) [u, v] = [v, u];
    u = kthAncestor(u, depth[u] - depth[v]);          // equalise depths
    if (u === v) return u;
    for (let k = LOG - 1; k >= 0; k--) {
      if (up[k][u] !== up[k][v]) {                    // jump only if still different
        u = up[k][u];
        v = up[k][v];
      }
    }
    return up[0][u];
  }

  return { depth, up, lca, kthAncestor, order };
}

// ---------- Sqrt decomposition ----------
// Split the array into blocks of size ~sqrt(n) and keep each block's sum. A range query
// adds whole blocks in the middle (at most sqrt n of them) plus the partial edges
// (at most 2 sqrt n elements). Point update touches one element and one block sum.
function sqrtDecompositionRangeSum(nums) {
  const values = nums.slice();
  const n = values.length;
  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
  const blocks = new Array(Math.ceil(n / blockSize) || 1).fill(0);
  for (let i = 0; i < n; i++) blocks[Math.floor(i / blockSize)] += values[i];

  return {
    update(index, value) {
      blocks[Math.floor(index / blockSize)] += value - values[index];
      values[index] = value;
    },
    query(l, r) {                                     // inclusive
      let sum = 0;
      let i = l;
      while (i <= r) {
        if (i % blockSize === 0 && i + blockSize - 1 <= r) {   // whole block fits
          sum += blocks[i / blockSize];
          i += blockSize;
        } else {
          sum += values[i];
          i++;
        }
      }
      return sum;
    },
  };
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}
function randomArray(len, lo, hi) {
  return Array.from({ length: len }, () => randomInt(lo, hi));
}

for (let trial = 0; trial < 200; trial++) {
  // kadane vs O(n^2)
  const nums = randomArray(randomInt(1, 20), -10, 10);
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) { sum += nums[j]; best = Math.max(best, sum); }
  }
  assert.strictEqual(kadane(nums), best);

  // majority vote: build an array with a guaranteed majority
  const n = randomInt(1, 15);
  const majority = randomInt(0, 3);
  const arr = Array.from({ length: n }, () => randomInt(0, 3));
  for (let i = 0; i < Math.floor(n / 2) + 1; i++) arr[i] = majority;
  fisherYates(arr);
  assert.strictEqual(majorityVote(arr), majority);

  // majorityVoteK vs counting
  const k = randomInt(2, 4);
  const arr2 = randomArray(randomInt(0, 20), 0, 4);
  const counts = new Map();
  for (const x of arr2) counts.set(x, (counts.get(x) || 0) + 1);
  const expected = [...counts].filter(([, c]) => c > arr2.length / k).map(([v]) => v).sort((a, b) => a - b);
  assert.deepStrictEqual(majorityVoteK(arr2, k).sort((a, b) => a - b), expected);

  // floyd: n+1 numbers in 1..n with exactly one repeated value (possibly many times)
  const m = randomInt(1, 12);
  const dup = randomInt(1, m);
  const pool = Array.from({ length: m }, (_, i) => i + 1).filter((v) => v !== dup);
  const arr3 = fisherYates(pool.slice(0, randomInt(0, pool.length)));
  while (arr3.length < m + 1) arr3.push(dup);
  fisherYates(arr3);
  assert.strictEqual(floydFindDuplicate(arr3), dup);

  // dutch flag
  const flag = randomArray(randomInt(0, 15), 0, 2);
  assert.deepStrictEqual(dutchNationalFlag(flag.slice()), flag.slice().sort((a, b) => a - b));

  // quickselect vs sort
  const qs = randomArray(randomInt(1, 20), -5, 5);
  const idx = randomInt(0, qs.length - 1);
  assert.strictEqual(quickSelect(qs, idx), qs.slice().sort((a, b) => a - b)[idx]);

  // cyclic sort
  const perm = fisherYates(Array.from({ length: randomInt(0, 15) }, (_, i) => i + 1));
  assert.deepStrictEqual(cyclicSort(perm.slice()), perm.slice().sort((a, b) => a - b));

  // sqrt decomposition vs loop
  const base = randomArray(randomInt(1, 30), -10, 10);
  const sq = sqrtDecompositionRangeSum(base);
  for (let op = 0; op < 30; op++) {
    if (Math.random() < 0.4) {
      const i = randomInt(0, base.length - 1);
      const v = randomInt(-10, 10);
      base[i] = v;
      sq.update(i, v);
    } else {
      const l = randomInt(0, base.length - 1);
      const r = randomInt(l, base.length - 1);
      let s = 0;
      for (let i = l; i <= r; i++) s += base[i];
      assert.strictEqual(sq.query(l, r), s);
    }
  }
}

// LCA / kth ancestor vs naive walk-up on random trees
for (let trial = 0; trial < 100; trial++) {
  const n = randomInt(1, 30);
  const parent = new Array(n).fill(-1);
  for (let v = 1; v < n; v++) parent[v] = randomInt(0, v - 1);   // random tree rooted at 0
  const tree = binaryLiftingLCA(n, parent, 0);
  function naiveAncestors(v) {
    const path = [];
    while (v !== -1) { path.push(v); v = parent[v]; }
    return path;   // v, parent, grandparent, ..., root
  }
  for (let q = 0; q < 20; q++) {
    const u = randomInt(0, n - 1);
    const v = randomInt(0, n - 1);
    const pu = naiveAncestors(u);
    const pv = new Set(naiveAncestors(v));
    const expectedLca = pu.find((x) => pv.has(x));
    assert.strictEqual(tree.lca(u, v), expectedLca);
    const k = randomInt(0, n);
    assert.strictEqual(tree.kthAncestor(u, k), k < pu.length ? pu[k] : -1);
    assert.strictEqual(tree.depth[u], pu.length - 1);
  }
}

// reservoir sampling: each of 5 items chosen with probability k/n = 2/5 over many trials (wide band)
{
  const trials = 4000;
  const hits = new Array(5).fill(0);
  for (let t = 0; t < trials; t++) for (const x of reservoirSample([0, 1, 2, 3, 4], 2)) hits[x]++;
  for (const h of hits) assert.ok(h > trials * 0.3 && h < trials * 0.5, `reservoir bias: ${hits}`);
  assert.deepStrictEqual(reservoirSample([7], 3), [7]);
}

// fisher-yates: every permutation of [0,1,2] appears roughly equally (1/6 each, wide band)
{
  const trials = 6000;
  const seen = new Map();
  for (let t = 0; t < trials; t++) {
    const key = fisherYates([0, 1, 2]).join('');
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  assert.strictEqual(seen.size, 6);
  for (const c of seen.values()) assert.ok(c > trials / 6 * 0.6 && c < trials / 6 * 1.4);
}

assert.strictEqual(kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
assert.strictEqual(majorityVote([2, 2, 1, 1, 1, 2, 2]), 2);
assert.deepStrictEqual(majorityVoteK([3, 2, 3], 3), [3]);
assert.strictEqual(floydFindDuplicate([1, 3, 4, 2, 2]), 2);
assert.deepStrictEqual(dutchNationalFlag([2, 0, 2, 1, 1, 0]), [0, 0, 1, 1, 2, 2]);
assert.strictEqual(quickSelect([3, 2, 1, 5, 6, 4], 4), 5);

console.log('✓ classic-techniques.js self-test passed');

module.exports = {
  kadane,
  majorityVote,
  majorityVoteK,
  floydFindDuplicate,
  dutchNationalFlag,
  reservoirSample,
  fisherYates,
  quickSelect,
  cyclicSort,
  binaryLiftingLCA,
  sqrtDecompositionRangeSum,
};
