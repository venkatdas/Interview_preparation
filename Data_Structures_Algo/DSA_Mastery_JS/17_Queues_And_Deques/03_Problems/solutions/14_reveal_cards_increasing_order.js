/**
 * 14. Reveal Cards In Increasing Order   (LeetCode 950 — Medium)
 *
 * PROBLEM
 * You have a deck of unique integers. You reveal cards with this process:
 *   1. take the top card, reveal it
 *   2. move the next top card to the bottom of the deck
 *   3. repeat until empty
 * Return an ordering of the deck so that the revealed cards come out in
 * increasing order.
 *
 * EXAMPLES
 * Input: [17,13,11,2,3,5,7]   Output: [2,13,3,11,5,17,7]
 *   reveal 2, move 13 down ; reveal 3, move 11 down ; reveal 5, move 17 down ;
 *   reveal 7, move 13 down ; reveal 11, move 17 down ; reveal 13 ; reveal 17
 * Input: [1,1000]             Output: [1,1000]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values unique? (yes)
 * - Any valid ordering, or a specific one? (only one exists, since the process is deterministic)
 *
 * APPROACH 1 — Brute force (simulate the reveal on index positions)   O(n^2) time with shift, O(n) space
 * Sort the cards. Simulate the reveal process on a queue of INDICES
 * 0..n-1: the k-th revealed index gets the k-th smallest card. This is already
 * the standard idea; it's "brute" only because we use array shift() (O(n)).
 *
 * APPROACH 2 — Optimal (reverse the process with a deque)   O(n log n) time (sort), O(n) space
 * Run the process BACKWARDS. The last card revealed is the largest. Undo each
 * step: "move top to bottom" undone is "move bottom to top"; "reveal top"
 * undone is "put the card on top".
 *   for each card from largest to smallest:
 *     if the deque is not empty: move the BACK card to the FRONT
 *     push the card to the FRONT
 *
 * Dry run on sorted [2,3,5,7,11,13,17], processed from 17 down:
 *   17          deque [17]
 *   13          move back to front: [17] ; push front: [13,17]
 *   11          [17,13] -> [11,17,13]
 *   7           [13,11,17] -> [7,13,11,17]
 *   5           [17,7,13,11] -> [5,17,7,13,11]
 *   3           [11,5,17,7,13] -> [3,11,5,17,7,13]
 *   2           [13,3,11,5,17,7] -> [2,13,3,11,5,17,7]   matches
 *
 * EDGE CASES
 * - single card
 * - two cards
 * - already sorted input (output is still interleaved)
 */

const { Deque } = require('../../02_Implementations/queue');

function bruteForce(deck) {
  const sorted = [...deck].sort((a, b) => a - b);
  const n = deck.length;
  const result = new Array(n);
  const indices = Array.from({ length: n }, (_, i) => i);
  let next = 0;
  while (indices.length) {
    result[indices.shift()] = sorted[next++]; // reveal: this position gets the next smallest
    if (indices.length) indices.push(indices.shift()); // move the next position to the bottom
  }
  return result;
}

function optimal(deck) {
  const sorted = [...deck].sort((a, b) => a - b);
  const deque = new Deque();
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (!deque.isEmpty()) deque.pushFront(deque.popBack()); // undo "move top to bottom"
    deque.pushFront(sorted[i]);                              // undo "reveal top"
  }
  return deque.toArray();
}

// Verify by actually running the reveal process.
function reveal(deck) {
  const queue = [...deck];
  const out = [];
  while (queue.length) {
    out.push(queue.shift());
    if (queue.length) queue.push(queue.shift());
  }
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([17, 13, 11, 2, 3, 5, 7]), [2, 13, 3, 11, 5, 17, 7]);
  assert.deepStrictEqual(solve([1, 1000]), [1, 1000]);
  assert.deepStrictEqual(solve([42]), [42]);
  assert.deepStrictEqual(solve([1, 2, 3, 4]), [1, 3, 2, 4]);
  assert.deepStrictEqual(solve([]), []);
  for (const deck of [[5, 1, 4, 2, 3], [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], [-3, 0, 7, -1]]) {
    const arranged = solve(deck);
    assert.deepStrictEqual(reveal(arranged), [...deck].sort((a, b) => a - b));
  }
}
console.log('✓ 14-reveal-cards-increasing-order passed');

module.exports = { optimal, bruteForce };
