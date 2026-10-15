/**
 * 03. Maximum Units on a Truck   (LeetCode 1710 — Easy)
 *
 * PROBLEM
 * boxTypes[i] = [numberOfBoxes, unitsPerBox]. The truck holds at most truckSize boxes.
 * Return the maximum total number of units you can load.
 *
 * EXAMPLES
 * Input: boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4   Output: 8
 *   Explanation: take the 1 box of 3 units, the 2 boxes of 2 units, and 1 box of 1 unit
 * Input: boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10   Output: 91
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - All boxes are the same size (each takes one slot)? (yes)
 * - Can truckSize be bigger than the total number of boxes? (yes, take everything)
 *
 * APPROACH 1 — Brute force   O(2^total boxes) time
 * Treat every individual box as an item and try every subset of size <= truckSize.
 * Exponential; here implemented as a simple recursion for tiny inputs.
 *
 * APPROACH 2 — Optimal (sort by units per box, descending)   O(n log n) time, O(1) extra
 * Every box costs the same (one slot), so fill slots with the most valuable boxes first.
 *
 * WHY GREEDY WORKS
 * This is a fractional-knapsack where every item has weight 1, so "value per weight" is just
 * the units. Exchange argument: if an optimal load contains a box with fewer units while a box
 * with more units was left behind, swap them - same slot count, more units. Repeat until the
 * load is exactly the greedy one.
 *
 * Dry run on [[1,3],[2,2],[3,1]], truckSize 4:
 *   sorted by units desc: [1,3],[2,2],[3,1]
 *   take 1 box x 3 = 3,   slots left 3
 *   take 2 boxes x 2 = 4, slots left 1
 *   take 1 box x 1 = 1,   slots left 0 -> total 8
 *
 * EDGE CASES
 * - truckSize = 0 -> 0
 * - fewer boxes than truckSize -> sum of all units
 * - a type with more boxes than slots left -> take only `slotsLeft` of them
 */

function bruteForce(boxTypes, truckSize) {
  // expand into individual boxes
  const boxes = [];
  for (const [count, units] of boxTypes) for (let i = 0; i < count; i++) boxes.push(units);

  let best = 0;
  function go(index, slotsLeft, total) {
    best = Math.max(best, total);
    if (index === boxes.length || slotsLeft === 0) return;
    go(index + 1, slotsLeft - 1, total + boxes[index]); // take it
    go(index + 1, slotsLeft, total);                    // skip it
  }
  go(0, truckSize, 0);
  return best;
}

function optimal(boxTypes, truckSize) {
  const sorted = [...boxTypes].sort((a, b) => b[1] - a[1]); // most units per box first
  let slotsLeft = truckSize;
  let total = 0;
  for (const [count, unitsPerBox] of sorted) {
    if (slotsLeft === 0) break;
    const take = Math.min(count, slotsLeft);
    total += take * unitsPerBox;
    slotsLeft -= take;
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 3], [2, 2], [3, 1]], 4), 8);
  assert.strictEqual(solve([[5, 10], [2, 5], [4, 7], [3, 9]], 10), 91);
  assert.strictEqual(solve([[1, 3]], 0), 0);
  assert.strictEqual(solve([[1, 3], [2, 2]], 100), 7);
  assert.strictEqual(solve([[2, 1], [2, 1]], 3), 3);
  assert.strictEqual(solve([], 5), 0);
}
console.log('✓ 03-maximum-units-on-truck passed');

module.exports = { optimal, bruteForce };
