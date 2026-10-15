/**
 * Runnable space-complexity demonstrations.
 *
 * 1. In place vs copy                  (O(1) vs O(n) extra)
 * 2. Recursion depth                   (linear vs logarithmic stack)
 * 3. The slice-inside-recursion trap   (hidden O(n) copy per call)
 * 4. String building                   (immutable strings, array join)
 * 5. Where Node's call stack gives up  (RangeError) and the iterative fix
 *
 * Run: node space-examples.js
 */

// ---------- 1. In place vs copy ----------

// O(1) extra space: only two index variables, input is modified.
function reverseInPlace(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}

// O(n) extra space: builds a brand-new array, input is untouched.
function reversedCopy(arr) {
  return [...arr].reverse(); // the spread is the copy
}

// ---------- 2. Recursion depth ----------

// Linear recursion: n frames alive at the deepest point -> O(n) stack space.
// We track the max depth to make the invisible stack visible.
let maxDepthSeen = 0;
function sumToLinear(n, depth = 1) {
  maxDepthSeen = Math.max(maxDepthSeen, depth);
  if (n === 0) return 0;
  return n + sumToLinear(n - 1, depth + 1);
}

// Logarithmic recursion: halves n each call -> O(log n) stack space.
function powerLog(base, exponent, depth = 1) {
  maxDepthSeen = Math.max(maxDepthSeen, depth);
  if (exponent === 0) return 1;
  const half = powerLog(base, exponent >> 1, depth + 1);
  return exponent % 2 === 1 ? half * half * base : half * half;
}

// ---------- 3. The slice trap ----------

// Counts how many array ELEMENTS get copied in total.
let elementsCopied = 0;

// Bad: every call copies the rest of the array. n calls * O(n) copy = O(n^2) copies.
function sumWithSlice(arr) {
  if (arr.length === 0) return 0;
  const rest = arr.slice(1);
  elementsCopied += rest.length;
  return arr[0] + sumWithSlice(rest);
}

// Good: pass an index, never copy. O(n) stack, zero copies.
function sumWithIndex(arr, index = 0) {
  if (index === arr.length) return 0;
  return arr[index] + sumWithIndex(arr, index + 1);
}

// ---------- 4. String building ----------

// Strings are immutable: each += creates a new string in theory (V8's ropes hide the cost,
// but you cannot rely on that in every engine or in an interview).
function buildWithConcat(n) {
  let result = '';
  for (let i = 0; i < n; i++) result += 'a';
  return result;
}

// Safe pattern: push pieces into an array (amortized O(1) each), join once at the end.
function buildWithJoin(n) {
  const pieces = [];
  for (let i = 0; i < n; i++) pieces.push('a');
  return pieces.join('');
}

// ---------- 5. Call stack limit ----------

// Recursion that goes deep enough will throw RangeError. We catch it and report the depth.
function findStackLimit() {
  let depth = 0;
  function dive() {
    depth++;
    dive();
  }
  try {
    dive();
  } catch (error) {
    // RangeError: Maximum call stack size exceeded
    return depth;
  }
  return Infinity;
}

// Recursive sum crashes for large n; the loop version uses O(1) space and never crashes.
function sumToRecursive(n) {
  return n === 0 ? 0 : n + sumToRecursive(n - 1);
}
function sumToIterative(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}

// ---------- self-test ----------
const assert = require('assert');

// 1. in place modifies the input, copy does not
const original = [1, 2, 3, 4];
const copyResult = reversedCopy(original);
assert.deepStrictEqual(copyResult, [4, 3, 2, 1]);
assert.deepStrictEqual(original, [1, 2, 3, 4]); // untouched
reverseInPlace(original);
assert.deepStrictEqual(original, [4, 3, 2, 1]); // modified
assert.deepStrictEqual(reverseInPlace([]), []);
assert.deepStrictEqual(reverseInPlace([7]), [7]);

// 2. recursion depth: linear is n + 1 frames, log is about log2(n) + 2
maxDepthSeen = 0;
assert.strictEqual(sumToLinear(100), 5050);
assert.strictEqual(maxDepthSeen, 101);

maxDepthSeen = 0;
assert.strictEqual(powerLog(2, 1024), 2 ** 1024);
assert.ok(maxDepthSeen <= 12, `powerLog depth was ${maxDepthSeen}`); // log2(1024) = 10

// 3. slice trap: n = 100 copies 99 + 98 + ... + 0 = 4950 elements
elementsCopied = 0;
const hundred = Array.from({ length: 100 }, (_, i) => i + 1);
assert.strictEqual(sumWithSlice(hundred), 5050);
assert.strictEqual(elementsCopied, 4950);
assert.strictEqual(sumWithIndex(hundred), 5050);

// 4. both builders give the same string
assert.strictEqual(buildWithConcat(1000), buildWithJoin(1000));
assert.strictEqual(buildWithJoin(0), '');

// 5. deep recursion throws, iteration does not
const limit = findStackLimit();
assert.ok(limit > 1000 && limit < 10_000_000, `stack limit was ${limit}`);
assert.throws(() => sumToRecursive(limit * 2), RangeError);
assert.strictEqual(sumToIterative(1_000_000), 500000500000);

console.log('✓ space-examples.js self-test passed');

if (require.main === module) {
  console.log(`\nNode's call stack on this machine gives up at roughly ${limit} nested calls.`);
  console.log('Linked lists / trees with more nodes than that must be processed iteratively.');
  console.log(`sumWithSlice(100) copied ${elementsCopied} elements; sumWithIndex copied 0.`);
}

module.exports = {
  reverseInPlace,
  reversedCopy,
  sumToLinear,
  powerLog,
  sumWithSlice,
  sumWithIndex,
  buildWithConcat,
  buildWithJoin,
  findStackLimit,
  sumToRecursive,
  sumToIterative,
};
