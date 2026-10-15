/**
 * Two-pointer templates in JavaScript (runnable).
 *
 * 1. oppositeEnds        - left/right walk toward each other (sorted pair sum)
 * 2. readWrite           - slow "write" pointer, fast "read" pointer (in-place filter)
 * 3. twoArrays           - one pointer per array (merge two sorted arrays)
 * 4. partition           - Dutch flag: low/mid/high, three regions in one pass
 * 5. floydCycle          - fast & slow pointers on a linked list (cycle detection)
 *
 * Each template is generic. The problems/ folder applies them to real questions.
 */

// ---------- 1. Opposite ends (requires SORTED input) ----------
// Find two numbers in a sorted array that add to target. Return their indices or null.
// Invariant: the answer pair (if it exists) is always inside [left, right].
// Proof: if nums[left] + nums[right] < target, nums[left] can't pair with ANY index
// <= right (they're all even smaller), so left is useless -> move it. Symmetric for right.
function oppositeEnds(sortedNums, target) {
  let left = 0;
  let right = sortedNums.length - 1;

  while (left < right) {
    const sum = sortedNums[left] + sortedNums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // need a bigger sum: only moving left can increase it
    else right--;               // need a smaller sum: only moving right can decrease it
  }
  return null;
}

// ---------- 2. Read / write (same direction, in-place) ----------
// Keep every element that passes `keep`; return the new length. Order is preserved.
// Invariant: everything before `write` is the finished output; `read` scans the input.
// write never passes read, so we never overwrite something we still need.
function readWrite(nums, keep) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (keep(nums[read])) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write; // nums[0..write-1] is the result
}

// ---------- 3. Two arrays (one pointer each) ----------
// Merge two sorted arrays into one sorted array.
function twoArrays(a, b) {
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) merged.push(a[i++]);
    else merged.push(b[j++]);
  }
  // one of these loops runs, the other is empty
  while (i < a.length) merged.push(a[i++]);
  while (j < b.length) merged.push(b[j++]);
  return merged;
}

// ---------- 4. Partition (Dutch national flag) ----------
// Rearrange so that values < pivot come first, then === pivot, then > pivot. In place.
// Regions: [0, low) less | [low, mid) equal | [mid, high] unknown | (high, end] greater
function partition(nums, pivot) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] < pivot) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++; // the value swapped in from `low` is already classified
    } else if (nums[mid] > pivot) {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--; // do NOT advance mid: the swapped-in value is unknown
    } else {
      mid++;
    }
  }
  return nums;
}

// ---------- 5. Fast & slow (Floyd's cycle detection) ----------
// Linked list node: { value, next }. Returns true if the list loops.
// slow moves 1 step, fast moves 2. If there's a cycle, fast laps slow and they meet.
// If there's no cycle, fast hits null first.
function floydCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// ---------- self-test ----------
const assert = require('assert');

assert.deepStrictEqual(oppositeEnds([1, 2, 4, 7, 11], 9), [1, 3]);
assert.deepStrictEqual(oppositeEnds([1, 2, 4, 7, 11], 100), null);
assert.deepStrictEqual(oppositeEnds([], 5), null);

const filtered = [3, 1, 4, 1, 5, 9, 2, 6];
const newLength = readWrite(filtered, (x) => x % 2 === 1);
assert.deepStrictEqual(filtered.slice(0, newLength), [3, 1, 1, 5, 9]);
assert.strictEqual(readWrite([], () => true), 0);

assert.deepStrictEqual(twoArrays([1, 3, 5], [2, 4, 6, 8]), [1, 2, 3, 4, 5, 6, 8]);
assert.deepStrictEqual(twoArrays([], [1]), [1]);
assert.deepStrictEqual(twoArrays([1, 1], [1]), [1, 1, 1]);

const partitioned = partition([5, 1, 9, 3, 5, 7, 2, 5], 5);
const lessCount = partitioned.filter((x) => x < 5).length;
assert.ok(partitioned.slice(0, lessCount).every((x) => x < 5));
assert.ok(partitioned.slice(lessCount, lessCount + 3).every((x) => x === 5));
assert.ok(partitioned.slice(lessCount + 3).every((x) => x > 5));

const node3 = { value: 3, next: null };
const node2 = { value: 2, next: node3 };
const node1 = { value: 1, next: node2 };
assert.strictEqual(floydCycle(node1), false);
node3.next = node2; // make a loop
assert.strictEqual(floydCycle(node1), true);
assert.strictEqual(floydCycle(null), false);

console.log('✓ two-pointer-templates.js self-test passed');

module.exports = { oppositeEnds, readWrite, twoArrays, partition, floydCycle };
