/**
 * 15. Ugly Number II   (LeetCode 264 — Medium)
 *
 * PROBLEM
 * An ugly number is a positive integer whose only prime factors are 2, 3 and 5.
 * Return the n-th ugly number. (1 counts as the first.)
 *
 * EXAMPLES
 * Input: n = 10   Output: 12   Explanation: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12
 * Input: n = 1    Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1690 (the answer fits in 32 bits)
 * - Is 1 ugly? (yes, by convention)
 *
 * APPROACH 1 — Brute force   O(answer * log answer) time, O(1) space
 * Count up from 1, test each integer by dividing out 2, 3, 5 and checking if
 * 1 remains. Ugly numbers get sparse fast, so this checks huge numbers of
 * candidates for larger n.
 *
 * APPROACH 2 — Optimal (min-heap + set to generate in order)   O(n log n) time, O(n) space
 * Every ugly number except 1 is (a smaller ugly number) * 2, 3 or 5. So we can
 * GENERATE them in increasing order: start the heap with 1; pop the smallest
 * (that's the next ugly number), push smallest*2, *3, *5. A Set prevents
 * duplicates (6 = 2*3 = 3*2). The n-th pop is the answer.
 *
 * Dry run for n = 5:
 *   heap {1}        pop 1  -> push 2,3,5
 *   heap {2,3,5}    pop 2  -> push 4,6,10
 *   heap {3,4,5,6,10}      pop 3 -> push 6(dup, skip),9,15
 *   heap {4,5,6,9,10,15}   pop 4 -> push 8,12,20
 *   heap {5,6,8,...}       pop 5 -> 5th ugly number is 5
 *
 * (The classic DP with three pointers is O(n) time; see 29_Dynamic_Programming.
 * The heap version generalizes to "super ugly number" with any set of primes.)
 *
 * EDGE CASES
 * - n = 1 -> 1
 * - duplicates from different factor paths must not be counted twice
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function isUgly(num) {
  for (const factor of [2, 3, 5]) {
    while (num % factor === 0) num /= factor;
  }
  return num === 1;
}

function bruteForce(n) {
  let count = 0;
  for (let candidate = 1; ; candidate++) {
    if (isUgly(candidate)) {
      count++;
      if (count === n) return candidate;
    }
  }
}

function optimal(n) {
  const heap = new MinHeap();
  const seen = new Set([1]);
  heap.push(1);
  let current = 1;
  for (let i = 0; i < n; i++) {
    current = heap.pop(); // the i-th smallest ugly number
    for (const factor of [2, 3, 5]) {
      const next = current * factor;
      if (!seen.has(next)) {
        seen.add(next);
        heap.push(next);
      }
    }
  }
  return current;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(2), 2);
  assert.strictEqual(solve(7), 8);
  assert.strictEqual(solve(10), 12);
  assert.strictEqual(solve(11), 15);
  assert.strictEqual(solve(15), 24);
}
assert.strictEqual(optimal(1690), 2123366400);
for (let n = 1; n <= 60; n++) assert.strictEqual(optimal(n), bruteForce(n));
console.log('✓ 15-ugly-number-ii passed');

module.exports = { optimal, bruteForce };
