/**
 * Classic greedy algorithms in JavaScript.
 *
 * 1. activitySelection   - max number of non-overlapping intervals (sort by END)
 * 2. fractionalKnapsack  - sort by value/weight ratio, take fractions
 * 3. huffmanCodeLengths  - merge two smallest frequencies (small inline min-heap)
 * 4. minCoinsCanonical   - biggest coin first; ONLY correct for canonical coin systems
 *
 * Each function has a short "why greedy works" note.
 */

// ---------- 1. Activity selection ----------
// Pick the interval that FINISHES earliest, drop everything that overlaps it, repeat.
// Why it works (exchange argument): any optimal answer can swap its first interval for the
// earliest-finishing one without breaking anything, because an earlier end never collides
// with more intervals than a later end would.
function activitySelection(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]); // copy, do not mutate caller
  const chosen = [];
  let lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) {   // compatible with everything chosen so far
      chosen.push([start, end]);
      lastEnd = end;
    }
  }
  return chosen;
}

// ---------- 2. Fractional knapsack ----------
// items: [{ weight, value }], capacity: number. Returns max total value.
// Why it works: because we may take FRACTIONS, the item with the best value-per-weight is
// always worth filling with first. Taking any other item first and swapping a slice of it for
// the same weight of the best-ratio item never lowers the total. (0/1 knapsack needs DP.)
function fractionalKnapsack(items, capacity) {
  const byRatio = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
  let remaining = capacity;
  let total = 0;
  for (const { weight, value } of byRatio) {
    if (remaining === 0) break;
    const take = Math.min(weight, remaining);   // whole item if it fits, else a fraction
    total += (take / weight) * value;
    remaining -= take;
  }
  return total;
}

// ---------- 3. Huffman code lengths ----------
// Given symbol frequencies, returns the code length of each symbol in Huffman's optimal
// prefix-free code (same order as input), plus the total encoded cost.
// Why it works: the two rarest symbols can always be siblings at the deepest level in SOME
// optimal tree (exchange argument: swapping them with the deepest pair never increases cost).
// Merge them, treat the pair as one symbol, repeat.

// A small min-heap keyed by `freq`. Enough for this file; see 19_Heaps_And_Priority_Queues/.
class MinHeap {
  #data = [];
  #key;

  constructor(key = (x) => x) {
    this.#key = key;
  }

  size() {
    return this.#data.length;
  }

  push(item) {
    const data = this.#data;
    data.push(item);
    let index = data.length - 1;
    while (index > 0) {                          // bubble up while smaller than parent
      const parent = (index - 1) >> 1;
      if (this.#key(data[parent]) <= this.#key(data[index])) break;
      [data[parent], data[index]] = [data[index], data[parent]];
      index = parent;
    }
  }

  pop() {
    const data = this.#data;
    const top = data[0];
    const last = data.pop();
    if (data.length > 0) {
      data[0] = last;
      let index = 0;
      while (true) {                             // sift down to the smaller child
        const left = 2 * index + 1;
        const right = left + 1;
        let smallest = index;
        if (left < data.length && this.#key(data[left]) < this.#key(data[smallest])) smallest = left;
        if (right < data.length && this.#key(data[right]) < this.#key(data[smallest])) smallest = right;
        if (smallest === index) break;
        [data[smallest], data[index]] = [data[index], data[smallest]];
        index = smallest;
      }
    }
    return top;
  }
}

function huffmanCodeLengths(freqs) {
  if (freqs.length === 0) return { lengths: [], totalCost: 0 };
  if (freqs.length === 1) return { lengths: [1], totalCost: freqs[0] }; // single symbol: 1 bit

  // Each heap node remembers which original symbols live inside it.
  const heap = new MinHeap((node) => node.freq);
  freqs.forEach((freq, index) => heap.push({ freq, symbols: [index] }));

  const lengths = new Array(freqs.length).fill(0);
  let totalCost = 0;

  while (heap.size() > 1) {
    const a = heap.pop();
    const b = heap.pop();
    const merged = { freq: a.freq + b.freq, symbols: [...a.symbols, ...b.symbols] };
    // every symbol inside the merged subtree gets one bit deeper
    for (const symbol of merged.symbols) lengths[symbol]++;
    totalCost += merged.freq;
    heap.push(merged);
  }
  return { lengths, totalCost };
}

// ---------- 4. Minimum coins (canonical systems only) ----------
// Biggest coin first. Correct for 1/5/10/25 (US), 1/2/5/10/20/50 (euro), and any system where
// each coin is a multiple of the previous one. WRONG for [1, 3, 4] with amount 6
// (greedy: 4+1+1 = 3 coins, optimal: 3+3 = 2 coins) - that needs DP.
function minCoinsCanonical(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a); // biggest first
  let count = 0;
  let remaining = amount;
  for (const coin of sorted) {
    const uses = Math.floor(remaining / coin);
    count += uses;
    remaining -= uses * coin;
  }
  return remaining === 0 ? count : -1;
}

// ---------- self-test ----------
const assert = require('assert');

// activity selection
assert.deepStrictEqual(
  activitySelection([[1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16]]),
  [[1, 4], [5, 7], [8, 11], [12, 16]]
);
assert.deepStrictEqual(activitySelection([]), []);
assert.deepStrictEqual(activitySelection([[1, 2]]), [[1, 2]]);
assert.deepStrictEqual(activitySelection([[1, 3], [2, 4], [3, 5]]), [[1, 3], [3, 5]]); // touching is ok

// fractional knapsack: classic textbook example -> 240
assert.strictEqual(
  fractionalKnapsack([{ weight: 10, value: 60 }, { weight: 20, value: 100 }, { weight: 30, value: 120 }], 50),
  240
);
assert.strictEqual(fractionalKnapsack([{ weight: 5, value: 10 }], 0), 0);
assert.strictEqual(fractionalKnapsack([{ weight: 5, value: 10 }], 100), 10);

// huffman: a=45 b=13 c=12 d=16 e=9 f=5  -> lengths 1,3,3,3,4,4, cost 224 (CLRS example)
const huff = huffmanCodeLengths([45, 13, 12, 16, 9, 5]);
assert.deepStrictEqual(huff.lengths, [1, 3, 3, 3, 4, 4]);
assert.strictEqual(huff.totalCost, 224);
assert.deepStrictEqual(huffmanCodeLengths([7]), { lengths: [1], totalCost: 7 });
assert.deepStrictEqual(huffmanCodeLengths([]), { lengths: [], totalCost: 0 });
assert.deepStrictEqual(huffmanCodeLengths([1, 1]).lengths, [1, 1]);

// canonical coins
assert.strictEqual(minCoinsCanonical([1, 5, 10, 25], 63), 6);  // 25+25+10+1+1+1
assert.strictEqual(minCoinsCanonical([1, 5, 10, 25], 0), 0);
assert.strictEqual(minCoinsCanonical([5, 10], 3), -1);          // impossible
assert.strictEqual(minCoinsCanonical([1, 3, 4], 6), 3);          // greedy answer (optimal is 2!) - shows the trap

console.log('✓ greedy-classics.js self-test passed');

module.exports = { activitySelection, fractionalKnapsack, huffmanCodeLengths, minCoinsCanonical, MinHeap };
