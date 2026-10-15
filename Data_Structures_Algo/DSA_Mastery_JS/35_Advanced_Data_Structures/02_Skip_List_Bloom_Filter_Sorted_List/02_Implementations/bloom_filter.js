/**
 * Bloom Filter in JavaScript: a tiny, probabilistic "have I seen this?" set.
 *
 * - m bits, all 0 at the start
 * - k hash functions, each maps an item to a bit position in [0, m)
 * - add(item): set all k bits
 * - mightContain(item): are all k bits set?
 *     false  -> DEFINITELY not added (no false negatives)
 *     true   -> PROBABLY added (false positives happen when other items set those bits)
 *
 * Why anyone uses it: memory. 1 million URLs at 1% false positive rate need ~1.2 MB of
 * bits, versus tens of MB for the strings themselves. Browsers (unsafe-URL lists), CDNs,
 * databases (skip disk reads for missing keys), spell checkers, and "already recommended
 * this article" checks all use one.
 *
 * Formulas (n items, m bits, k hashes):
 *   false positive rate  p ~= (1 - e^(-k n / m))^k
 *   optimal bits         m  = -n ln(p) / (ln 2)^2
 *   optimal hash count   k  = (m / n) ln 2
 *
 * We derive k hash positions from TWO base hashes (Kirsch-Mitzenmacher "double hashing"):
 *   h_i(x) = (h1(x) + i * h2(x)) mod m          for i = 0 .. k-1
 * which behaves like k independent hashes but costs only two string hashes.
 */

// FNV-1a 32-bit
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// djb2 32-bit
function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(hash, 33) + str.charCodeAt(i)) >>> 0;
  }
  return hash >>> 0;
}

class BloomFilter {
  constructor(numBits, numHashes) {
    this.m = numBits;
    this.k = numHashes;
    this.bits = new Uint8Array(Math.ceil(numBits / 8));   // 8 bits per byte
    this.count = 0;
  }

  // choose m and k for an expected number of items and a target false positive rate
  static forCapacity(expectedItems, falsePositiveRate) {
    const m = Math.ceil((-expectedItems * Math.log(falsePositiveRate)) / (Math.LN2 * Math.LN2));
    const k = Math.max(1, Math.round((m / expectedItems) * Math.LN2));
    return new BloomFilter(m, k);
  }

  #positions(item) {
    const str = String(item);
    const h1 = fnv1a(str);
    const h2 = djb2(str) | 1;            // make h2 odd so successive positions differ
    const positions = [];
    for (let i = 0; i < this.k; i++) {
      // h1 + i*h2 can exceed 2^32; use modular arithmetic step by step to stay exact
      positions.push((h1 + ((i * h2) % this.m)) % this.m);
    }
    return positions;
  }

  add(item) {
    for (const pos of this.#positions(item)) this.bits[pos >> 3] |= 1 << (pos & 7);
    this.count++;
  }

  mightContain(item) {
    for (const pos of this.#positions(item)) {
      if ((this.bits[pos >> 3] & (1 << (pos & 7))) === 0) return false;   // a 0 bit -> never added
    }
    return true;
  }

  // estimated false positive rate given how many items were added
  estimatedFalsePositiveRate() {
    return Math.pow(1 - Math.exp((-this.k * this.count) / this.m), this.k);
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomWord() {
  const len = 4 + Math.floor(Math.random() * 8);
  let s = '';
  for (let i = 0; i < len; i++) s += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return s;
}

const n = 2000;
const targetRate = 0.02;
const filter = BloomFilter.forCapacity(n, targetRate);
assert.ok(filter.m > n);                       // more bits than items
assert.ok(filter.k >= 1 && filter.k <= 20);

const added = new Set();
while (added.size < n) added.add(randomWord());
for (const w of added) filter.add(w);

// 1. zero false negatives: everything added must be reported present
for (const w of added) assert.strictEqual(filter.mightContain(w), true);

// 2. false positive rate on words that were NOT added stays near the target
let falsePositives = 0;
const probes = 5000;
let probed = 0;
while (probed < probes) {
  const w = randomWord();
  if (added.has(w)) continue;
  probed++;
  if (filter.mightContain(w)) falsePositives++;
}
const observed = falsePositives / probes;
assert.ok(observed < targetRate * 2.5, `false positive rate too high: ${observed}`);
assert.ok(Math.abs(filter.estimatedFalsePositiveRate() - targetRate) < 0.02);

// 3. an empty filter contains nothing
const empty = new BloomFilter(64, 3);
assert.strictEqual(empty.mightContain('anything'), false);
empty.add('anything');
assert.strictEqual(empty.mightContain('anything'), true);

console.log('✓ bloom-filter.js self-test passed');

module.exports = { BloomFilter, fnv1a, djb2 };
