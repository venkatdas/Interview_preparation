/**
 * 04. Create Sorted Array through Instructions   (LeetCode 1649 — Hard)
 *
 * PROBLEM
 * You insert the numbers of `instructions` one by one into an initially empty sorted list.
 * Inserting instructions[i] costs min(number of elements currently < instructions[i],
 * number of elements currently > instructions[i]). Return the total cost modulo 1e9+7.
 *
 * EXAMPLES
 * Input: [1,5,6,2]   Output: 1
 *   insert 1 -> cost min(0,0)=0  [1]
 *   insert 5 -> cost min(1,0)=0  [1,5]
 *   insert 6 -> cost min(2,0)=0  [1,5,6]
 *   insert 2 -> cost min(1,2)=1  [1,2,5,6]
 * Input: [1,2,3,6,5,4]   Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5, values 1..10^5 -> values can index the BIT directly (no compression)
 * - Equal elements count as neither smaller nor greater
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * Keep an array; for each new value count smaller and greater with a loop, then insert.
 *
 * APPROACH 2 — Optimal (Fenwick tree of counts over values)   O(n log M), M = max value
 * Keep counts of inserted values in a BIT indexed by value.
 *   smaller = prefixCount(v - 1)
 *   greater = inserted - prefixCount(v)
 *   cost += min(smaller, greater); add(v, 1)
 *
 * Dry run on [1,5,6,2]:
 *   v=1: smaller=0, greater=0-0=0 -> 0; insert
 *   v=5: smaller=1, greater=1-1=0 -> 0; insert
 *   v=6: smaller=2, greater=2-2=0 -> 0; insert
 *   v=2: smaller=1, greater=3-1=2 -> 1; total 1
 *
 * EDGE CASES
 * - duplicates: [1,1,1] -> every insert has 0 smaller and 0 greater -> 0
 * - answer must be taken mod 1e9+7 (costs can reach ~n^2/4)
 * - n = 1 -> 0
 */

const MOD = 1_000_000_007;

function bruteForce(instructions) {
  const list = [];
  let cost = 0;
  for (const v of instructions) {
    let smaller = 0;
    let greater = 0;
    for (const x of list) {
      if (x < v) smaller++;
      else if (x > v) greater++;
    }
    cost = (cost + Math.min(smaller, greater)) % MOD;
    list.push(v);
  }
  return cost;
}

function optimal(instructions) {
  const maxValue = Math.max(0, ...instructions);
  const tree = new Array(maxValue + 1).fill(0);   // 1-indexed by VALUE directly

  function add(value) {
    for (let i = value; i <= maxValue; i += i & -i) tree[i]++;
  }
  function prefixCount(value) {                    // how many inserted values <= value
    let sum = 0;
    for (let i = value; i > 0; i -= i & -i) sum += tree[i];
    return sum;
  }

  let cost = 0;
  let inserted = 0;
  for (const v of instructions) {
    const smaller = prefixCount(v - 1);
    const greater = inserted - prefixCount(v);
    cost = (cost + Math.min(smaller, greater)) % MOD;
    add(v);
    inserted++;
  }
  return cost;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 5, 6, 2]), 1);
  assert.strictEqual(solve([1, 2, 3, 6, 5, 4]), 3);
  assert.strictEqual(solve([1, 3, 3, 3, 2, 4, 2, 1, 2]), 4);
  assert.strictEqual(solve([1, 1, 1]), 0);
  assert.strictEqual(solve([7]), 0);
  assert.strictEqual(solve([]), 0);
}
for (let trial = 0; trial < 100; trial++) {
  const n = Math.floor(Math.random() * 20);
  const instructions = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 10));
  assert.strictEqual(optimal(instructions), bruteForce(instructions));
}
console.log('✓ 04-create-sorted-array-through-instructions passed');

module.exports = { optimal, bruteForce };
