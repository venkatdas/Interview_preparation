/**
 * 16. Queue Reconstruction by Height   (LeetCode 406 — Medium)
 *
 * PROBLEM
 * people[i] = [h, k]: person i has height h and there are exactly k people in front of them
 * in the queue with height >= h. The array is shuffled. Reconstruct the queue.
 *
 * EXAMPLES
 * Input: [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
 * Output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
 *   Explanation: e.g. [5,2] has exactly two people >= 5 ahead of it ([5,0] and [7,0])
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is a valid answer guaranteed to exist? (yes)
 * - Is it unique? (yes for valid input)
 *
 * APPROACH 1 — Brute force   O(n! * n) time
 * Try every permutation and check the k values. Only for tiny inputs.
 *
 * APPROACH 2 — Optimal (sort tall-first, insert at index k)   O(n^2) time, O(n) space
 * Sort by height descending; for equal heights, by k ascending. Then insert each person
 * into the result at index k.
 *
 * WHY GREEDY WORKS
 * Process tallest people first. When we insert a person, everyone already placed is at
 * least as tall, so "k people >= me in front" simply means "put me at index k". Shorter
 * people inserted LATER cannot break this: they are shorter, so they do not count toward
 * anyone taller's k, no matter where they land. Ties: for equal height, smaller k must come
 * first so that the later one counts the earlier one.
 *
 * Dry run on [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]:
 *   sorted: [7,0],[7,1],[6,1],[5,0],[5,2],[4,4]
 *   insert [7,0] at 0 -> [[7,0]]
 *   insert [7,1] at 1 -> [[7,0],[7,1]]
 *   insert [6,1] at 1 -> [[7,0],[6,1],[7,1]]
 *   insert [5,0] at 0 -> [[5,0],[7,0],[6,1],[7,1]]
 *   insert [5,2] at 2 -> [[5,0],[7,0],[5,2],[6,1],[7,1]]
 *   insert [4,4] at 4 -> [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
 *
 * EDGE CASES
 * - single person -> same
 * - all same height -> sorted by k gives 0,1,2,...
 * - empty -> []
 */

function bruteForce(people) {
  const n = people.length;
  const used = new Array(n).fill(false);
  const current = [];
  let answer = null;

  function isValid(queue) {
    return queue.every(([h, k], i) => queue.slice(0, i).filter(([h2]) => h2 >= h).length === k);
  }
  function go() {
    if (answer) return;
    if (current.length === n) { if (isValid(current)) answer = [...current]; return; }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true; current.push(people[i]);
      go();
      current.pop(); used[i] = false;
    }
  }
  go();
  return answer || [];
}

function optimal(people) {
  const sorted = [...people].sort((a, b) => (a[0] !== b[0] ? b[0] - a[0] : a[1] - b[1]));
  const queue = [];
  for (const person of sorted) {
    queue.splice(person[1], 0, person); // everyone already placed is >= this height
  }
  return queue;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    solve([[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]),
    [[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]]
  );
  assert.deepStrictEqual(solve([[6, 0], [5, 0], [4, 0], [3, 2], [2, 2], [1, 4]]),
    [[4, 0], [5, 0], [2, 2], [3, 2], [1, 4], [6, 0]]);
  assert.deepStrictEqual(solve([[1, 0]]), [[1, 0]]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[2, 1], [2, 0], [2, 2]]), [[2, 0], [2, 1], [2, 2]]);
}
console.log('✓ 16-queue-reconstruction-by-height passed');

module.exports = { optimal, bruteForce };
