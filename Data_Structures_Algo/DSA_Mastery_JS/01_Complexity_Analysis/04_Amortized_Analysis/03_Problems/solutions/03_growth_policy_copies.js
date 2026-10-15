/**
 * 03. Growth Policy Copy Count   (Original — Medium)
 *
 * PROBLEM
 * A dynamic array starts with capacity 1 and size 0. When a push finds it full, it
 * allocates a new capacity and copies every existing element. Given n pushes and a
 * growth policy, return the total number of element COPIES. Policies:
 *   { type: 'mul', factor: f }  -> newCap = max(cap + 1, floor(cap * f))
 *   { type: 'add', k }          -> newCap = cap + k
 * Compute it without simulating each push (n up to 1e12), and state the amortized
 * cost per push for each policy.
 *
 * EXAMPLES
 * n = 9,  mul 2     -> copies 1 + 2 + 4 + 8 = 15     (resizes at sizes 1, 2, 4, 8)
 * n = 8,  mul 2     -> 7
 * n = 10, add 3     -> capacities 1, 4, 7, 10: copies 1 + 4 + 7 = 12
 * n = 1             -> 0
 * n = 0             -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e12; copies can exceed 2^53 for additive growth -> use BigInt for 'add'.
 * - factor > 1.
 *
 * APPROACH 1 — Brute force (simulate every push)   O(n + copies)
 * Track size and capacity; on a full push add `size` to copies and grow.
 *
 * APPROACH 2 — Optimal (jump from resize to resize)   O(number of resizes)
 * A resize happens exactly when size reaches the current capacity and another push arrives.
 * So walk the capacity sequence c0 = 1, c1, c2, ... and add c_i for every c_i < n.
 *   mul f:  O(log_f n) resizes; copies = 1 + f + f² + ... < n · f/(f-1)  -> amortized O(1)
 *           (f = 2: < 2n; f = 1.5: < 3n — less memory waste, more copying)
 *   add k:  resizes at 1, 1+k, 1+2k, ...: about n/k of them; copies ≈ n²/(2k) -> amortized O(n/k)
 *           Closed form with m = number of capacities below n: copies = m + k·m(m-1)/2.
 *
 * Dry run n = 10, add 3: capacities 1, 4, 7, 10. Below 10: 1, 4, 7 -> m = 3 ->
 *   3 + 3·3·2/2 = 12 ✓
 *
 * EDGE CASES
 * - n = 0 or 1 -> 0 copies (the first element fits in capacity 1)
 * - factor close to 1 (1.1): floor(cap·f) may equal cap for small cap -> max(cap + 1, ...)
 * - huge n with additive growth -> BigInt
 *
 * COMMON MISTAKES
 * - Counting a resize when size equals capacity but no further push arrives (resize happens on the NEXT push).
 * - Believing any growth is fine: additive growth turns n pushes into Θ(n²) work.
 */
const { DynamicArray, mulberry32 } = require('../../02_Implementations/amortized_structures');

function nextCap(cap, policy) {
  return policy.type === 'add' ? cap + policy.k : Math.max(cap + 1, Math.floor(cap * policy.factor));
}

function bruteForce(n, policy) {
  let cap = 1, size = 0, copies = 0;
  for (let i = 0; i < n; i++) {
    if (size === cap) { copies += size; cap = nextCap(cap, policy); }
    size++;
  }
  return copies;
}

function optimal(n, policy) {
  if (policy.type === 'add') {
    if (n <= 1) return 0n;
    const N = BigInt(n), k = BigInt(policy.k);
    const m = (N - 2n) / k + 1n;            // capacities 1, 1+k, ... that are < n
    return m + (k * m * (m - 1n)) / 2n;
  }
  let copies = 0;
  for (let cap = 1; cap < n; cap = nextCap(cap, policy)) copies += cap;
  return copies;
}

// ---------- tests ----------
const assert = require('assert');
const mul2 = { type: 'mul', factor: 2 };
assert.strictEqual(bruteForce(9, mul2), 15);
assert.strictEqual(optimal(9, mul2), 15);
assert.strictEqual(optimal(8, mul2), 7);
assert.strictEqual(bruteForce(10, { type: 'add', k: 3 }), 12);
assert.strictEqual(optimal(10, { type: 'add', k: 3 }), 12n);
assert.strictEqual(optimal(1, mul2), 0);
assert.strictEqual(optimal(0, mul2), 0);
assert.strictEqual(optimal(0, { type: 'add', k: 5 }), 0n);
// agree with the instrumented DynamicArray
const da = new DynamicArray({ grow: 'factor', factor: 1.5, shrinkAt: 0 });
for (let i = 0; i < 5000; i++) da.push(i);
assert.strictEqual(da.copies, optimal(5000, { type: 'mul', factor: 1.5 }));
// amortized bounds
for (const f of [1.5, 2, 3]) {
  const n = 1e9;
  assert.ok(optimal(n, { type: 'mul', factor: f }) < (n * f) / (f - 1) + 1);
}
assert.ok(optimal(1e12, { type: 'add', k: 1000 }) > 4n * 10n ** 20n, 'additive growth: ~n^2/(2k)');
const rand = mulberry32(513);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 3000);
  const pm = { type: 'mul', factor: 1.1 + rand() * 2 };
  const pa = { type: 'add', k: 1 + Math.floor(rand() * 20) };
  assert.strictEqual(optimal(n, pm), bruteForce(n, pm));
  assert.strictEqual(optimal(n, pa), BigInt(bruteForce(n, pa)));
}
console.log('✓ 03_growth_policy_copies passed');

module.exports = { optimal, bruteForce };
