/**
 * Runnable examples for every common complexity class.
 *
 * Each function counts its own basic steps in a `steps` counter so you can SEE the growth
 * instead of trusting a formula. At the bottom there is a tiny timing demo that compares an
 * O(n^2) and an O(n) solution to the same problem.
 *
 * Run: node complexity-examples.js
 */

// Reset this before each experiment; each function increments it once per "basic step".
let steps = 0;

// ---------- O(1): constant ----------
// No matter how long the array is, we do one thing.
function getFirst(arr) {
  steps++;
  return arr[0];
}

// ---------- O(log n): logarithmic ----------
// Every iteration throws away half of the remaining range.
function binarySearch(sortedArr, target) {
  let low = 0;
  let high = sortedArr.length - 1;
  while (low <= high) {
    steps++;
    const mid = (low + high) >> 1; // same as Math.floor((low + high) / 2)
    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

// ---------- O(n): linear ----------
// One pass, constant work per element.
function sumAll(arr) {
  let total = 0;
  for (const value of arr) {
    steps++;
    total += value;
  }
  return total;
}

// ---------- O(n log n): linearithmic ----------
// Merge sort: split in half (log n levels), merge costs O(n) per level.
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  // merge: each element is looked at once per level
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    steps++;
    if (left[i] <= right[j]) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) { steps++; merged.push(left[i++]); }
  while (j < right.length) { steps++; merged.push(right[j++]); }
  return merged;
}

// ---------- O(n^2): quadratic ----------
// Every element compared with every other element.
function hasDuplicatePair(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      steps++;
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// ---------- O(a * b): two different inputs ----------
// NOT O(n^2). The sizes are independent, so they get their own variables.
function countCommon(listA, listB) {
  let common = 0;
  for (const a of listA) {
    for (const b of listB) {
      steps++;
      if (a === b) common++;
    }
  }
  return common;
}

// ---------- O(2^n): exponential ----------
// Each element is either in the subset or not: 2 choices, n times = 2^n subsets.
function allSubsets(arr) {
  if (arr.length === 0) {
    steps++;
    return [[]];
  }
  const withoutFirst = allSubsets(arr.slice(1));
  const withFirst = withoutFirst.map((subset) => {
    steps++;
    return [arr[0], ...subset];
  });
  return [...withoutFirst, ...withFirst];
}

// Naive fibonacci: two recursive calls per level, each shrinking by 1 -> about 2^n calls.
function fibNaive(n) {
  steps++;
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Same problem, memoized: every n is computed once -> O(n).
function fibMemo(n, memo = new Map()) {
  steps++;
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, value);
  return value;
}

// ---------- O(n!): factorial ----------
// n choices for the first slot, n-1 for the second, ... -> n! permutations.
function allPermutations(arr) {
  if (arr.length <= 1) {
    steps++;
    return [arr];
  }
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of allPermutations(rest)) {
      steps++;
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

// ---------- amortized O(1): dynamic array push ----------
// Simulates what the engine does: when full, double the capacity and copy everything.
// Total copies for n pushes is < 2n, so each push is O(1) on average.
function simulatePushes(n) {
  let capacity = 1;
  let size = 0;
  let totalCopies = 0;
  for (let i = 0; i < n; i++) {
    if (size === capacity) {
      totalCopies += size; // copy every existing element into the bigger array
      capacity *= 2;
    }
    size++;
  }
  return totalCopies;
}

// ---------- helpers for the demo ----------
function measureSteps(label, fn) {
  steps = 0;
  fn();
  return { label, steps };
}

function range(n) {
  return Array.from({ length: n }, (_, i) => i);
}

// ---------- self-test ----------
const assert = require('assert');

// O(1): steps do not change with n
assert.strictEqual(measureSteps('', () => getFirst(range(10))).steps, 1);
assert.strictEqual(measureSteps('', () => getFirst(range(10000))).steps, 1);

// O(log n): 1024 elements -> at most 11 steps
const logSteps = measureSteps('', () => binarySearch(range(1024), 1023)).steps;
assert.ok(logSteps <= 11, `binary search took ${logSteps} steps`);

// O(n): steps == n
assert.strictEqual(measureSteps('', () => sumAll(range(500))).steps, 500);

// O(n log n): 1024 elements -> about 1024 * 10 steps, definitely < 1024^2
const sortSteps = measureSteps('', () => mergeSort(range(1024).reverse())).steps;
assert.ok(sortSteps > 1024 && sortSteps < 1024 * 11, `merge sort took ${sortSteps} steps`);
assert.deepStrictEqual(mergeSort([5, 1, 4, 2, 3]), [1, 2, 3, 4, 5]);

// O(n^2): n(n-1)/2 steps when no duplicate found
assert.strictEqual(measureSteps('', () => hasDuplicatePair(range(100))).steps, (100 * 99) / 2);

// O(a * b): 10 * 50 = 500
assert.strictEqual(measureSteps('', () => countCommon(range(10), range(50))).steps, 500);

// O(2^n): 10 elements -> 1024 subsets
let subsetsResult;
measureSteps('', () => { subsetsResult = allSubsets(range(10)); });
assert.strictEqual(subsetsResult.length, 1024);

// fib: naive explodes, memo stays linear
const naiveSteps = measureSteps('', () => fibNaive(20)).steps;
const memoSteps = measureSteps('', () => fibMemo(20)).steps;
assert.ok(naiveSteps > 20000, `naive fib(20) took ${naiveSteps} calls`);
assert.ok(memoSteps < 50, `memo fib(20) took ${memoSteps} calls`);
assert.strictEqual(fibNaive(20), fibMemo(20));

// O(n!): 5 elements -> 120 permutations
let permsResult;
measureSteps('', () => { permsResult = allPermutations(range(5)); });
assert.strictEqual(permsResult.length, 120);

// amortized push: total copies < 2n
assert.ok(simulatePushes(1000) < 2000);

console.log('✓ complexity-examples.js self-test passed');

// ---------- tiny timing demo (only runs when executed directly) ----------
if (require.main === module) {
  console.log('\nStep counts (watch how each column grows when n doubles):');
  console.log('      n |  O(log n) |  O(n)  | O(n log n) |  O(n^2)');
  for (const n of [64, 128, 256, 512]) {
    const sorted = range(n);
    const log = measureSteps('', () => binarySearch(sorted, n - 1)).steps;
    const lin = measureSteps('', () => sumAll(sorted)).steps;
    const nlogn = measureSteps('', () => mergeSort([...sorted].reverse())).steps;
    const quad = measureSteps('', () => hasDuplicatePair(sorted)).steps;
    console.log(
      `${String(n).padStart(7)} | ${String(log).padStart(9)} | ${String(lin).padStart(6)} | ${String(nlogn).padStart(10)} | ${String(quad).padStart(7)}`
    );
  }

  // Real wall-clock time: "includes inside a loop" vs "Set lookup"
  const n = 20000;
  const data = range(n);
  const lookups = range(n);

  let t0 = process.hrtime.bigint();
  let foundSlow = 0;
  for (const x of lookups) if (data.includes(x)) foundSlow++; // O(n) per lookup -> O(n^2)
  const slowMs = Number(process.hrtime.bigint() - t0) / 1e6;

  t0 = process.hrtime.bigint();
  const set = new Set(data);
  let foundFast = 0;
  for (const x of lookups) if (set.has(x)) foundFast++;       // O(1) per lookup -> O(n)
  const fastMs = Number(process.hrtime.bigint() - t0) / 1e6;

  console.log(`\nn = ${n} lookups:`);
  console.log(`  array.includes in a loop (O(n^2)): ${slowMs.toFixed(1)} ms`);
  console.log(`  Set.has in a loop        (O(n)):   ${fastMs.toFixed(1)} ms`);
  console.log(`  (same answer: ${foundSlow} === ${foundFast})`);
}

module.exports = {
  getFirst,
  binarySearch,
  sumAll,
  mergeSort,
  hasDuplicatePair,
  countCommon,
  allSubsets,
  fibNaive,
  fibMemo,
  allPermutations,
  simulatePushes,
};
