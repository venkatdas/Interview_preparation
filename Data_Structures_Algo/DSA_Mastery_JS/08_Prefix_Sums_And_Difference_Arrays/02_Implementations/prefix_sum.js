/**
 * Prefix-sum structures in JavaScript.
 *
 * 1. buildPrefix(nums)   - prefix[i] = sum of nums[0..i-1]; prefix has length n + 1
 * 2. NumArray            - O(1) range-sum queries on a static 1D array  (LeetCode 303)
 * 3. NumMatrix           - O(1) rectangle-sum queries on a static 2D grid (LeetCode 304)
 * 4. DifferenceArray     - O(1) range UPDATES, then one O(n) pass to materialise
 * 5. prefixXor / prefixMax helpers - the same idea with other operations
 *
 * Build: O(n) (or O(rows * cols)). Query: O(1).
 */

// ---------- 1. Build a prefix array ----------
// We use length n + 1 with prefix[0] = 0 so that sum(l..r) = prefix[r + 1] - prefix[l]
// works even when l = 0 (no special case).
function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

// ---------- 2. NumArray: range sum query, immutable ----------
class NumArray {
  #prefix;

  constructor(nums) {
    this.#prefix = buildPrefix(nums);
  }

  // inclusive on both ends
  sumRange(left, right) {
    return this.#prefix[right + 1] - this.#prefix[left];
  }
}

// ---------- 3. NumMatrix: 2D range sum ----------
// sums[r][c] = sum of the rectangle from (0,0) to (r-1,c-1). Padded with a zero row/col.
// Inclusion-exclusion:
//   sums[r+1][c+1] = grid[r][c] + sums[r][c+1] + sums[r+1][c] - sums[r][c]
//   rect(r1,c1,r2,c2) = sums[r2+1][c2+1] - sums[r1][c2+1] - sums[r2+1][c1] + sums[r1][c1]
class NumMatrix {
  #sums;

  constructor(matrix) {
    const rows = matrix.length;
    const cols = rows ? matrix[0].length : 0;
    this.#sums = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.#sums[r + 1][c + 1] =
          matrix[r][c] + this.#sums[r][c + 1] + this.#sums[r + 1][c] - this.#sums[r][c];
      }
    }
  }

  sumRegion(row1, col1, row2, col2) {
    const s = this.#sums;
    return s[row2 + 1][col2 + 1] - s[row1][col2 + 1] - s[row2 + 1][col1] + s[row1][col1];
  }
}

// ---------- 4. DifferenceArray: many range updates, then read ----------
// To add `value` to every element in [left, right]:
//   diff[left] += value; diff[right + 1] -= value
// A prefix sum over diff then yields the final array. Each update is O(1).
class DifferenceArray {
  #diff;
  #length;

  constructor(length) {
    this.#length = length;
    this.#diff = new Array(length + 1).fill(0); // extra slot so right + 1 never overflows
  }

  addToRange(left, right, value) {
    this.#diff[left] += value;
    this.#diff[right + 1] -= value;
  }

  // Materialise the final array: running sum of diff.
  toArray() {
    const result = new Array(this.#length);
    let running = 0;
    for (let i = 0; i < this.#length; i++) {
      running += this.#diff[i];
      result[i] = running;
    }
    return result;
  }
}

// ---------- 5. Other prefix operations ----------
// XOR has an inverse (itself): xor(l..r) = prefixXor[r + 1] ^ prefixXor[l]
function buildPrefixXor(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] ^ nums[i];
  return prefix;
}

// Max has NO inverse, so prefixMax only answers "max of nums[0..i]", not arbitrary ranges.
function buildPrefixMax(nums) {
  const prefix = new Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    prefix[i] = i === 0 ? nums[0] : Math.max(prefix[i - 1], nums[i]);
  }
  return prefix;
}

// Suffix sums: suffix[i] = sum of nums[i..n-1]; suffix[n] = 0
function buildSuffix(nums) {
  const suffix = new Array(nums.length + 1).fill(0);
  for (let i = nums.length - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + nums[i];
  return suffix;
}

// ---------- self-test ----------
const assert = require('assert');

assert.deepStrictEqual(buildPrefix([1, 2, 3, 4]), [0, 1, 3, 6, 10]);
assert.deepStrictEqual(buildPrefix([]), [0]);

const numArray = new NumArray([-2, 0, 3, -5, 2, -1]);
assert.strictEqual(numArray.sumRange(0, 2), 1);
assert.strictEqual(numArray.sumRange(2, 5), -1);
assert.strictEqual(numArray.sumRange(0, 5), -3);
assert.strictEqual(numArray.sumRange(3, 3), -5);

const numMatrix = new NumMatrix([
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5],
]);
assert.strictEqual(numMatrix.sumRegion(2, 1, 4, 3), 8);
assert.strictEqual(numMatrix.sumRegion(1, 1, 2, 2), 11);
assert.strictEqual(numMatrix.sumRegion(1, 2, 2, 4), 12);
assert.strictEqual(numMatrix.sumRegion(0, 0, 0, 0), 3);
assert.strictEqual(new NumMatrix([]).sumRegion !== undefined, true);

const diff = new DifferenceArray(5);
diff.addToRange(1, 3, 10);
diff.addToRange(0, 4, 1);
diff.addToRange(4, 4, -5);
assert.deepStrictEqual(diff.toArray(), [1, 11, 11, 11, -4]);
assert.deepStrictEqual(new DifferenceArray(3).toArray(), [0, 0, 0]);

const px = buildPrefixXor([5, 2, 7]);
assert.strictEqual(px[3] ^ px[1], 2 ^ 7); // xor of nums[1..2]
assert.deepStrictEqual(buildPrefixMax([3, 1, 4, 1, 5]), [3, 3, 4, 4, 5]);
assert.deepStrictEqual(buildSuffix([1, 2, 3]), [6, 5, 3, 0]);

console.log('✓ prefix-sum.js self-test passed');

module.exports = { buildPrefix, NumArray, NumMatrix, DifferenceArray, buildPrefixXor, buildPrefixMax, buildSuffix };
