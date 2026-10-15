/**
 * 06. Sequence Reconstruction   (LeetCode 444 — Medium)
 *
 * PROBLEM
 * nums is a permutation of 1..n. sequences is a list of subsequences of nums. Return true
 * if nums is the ONLY shortest supersequence consistent with all the subsequences - in
 * other words, the ordering constraints given by `sequences` determine nums uniquely.
 *
 * EXAMPLES
 * Input: nums = [1,2,3], sequences = [[1,2],[1,3]]         Output: false
 * Explanation: [1,3,2] also satisfies both subsequences.
 * Input: nums = [1,2,3], sequences = [[1,2],[1,3],[2,3]]   Output: true
 * Input: nums = [1,2,3], sequences = [[1,2]]               Output: false (3 unconstrained)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can sequences contain numbers outside 1..n? (assume no / return false)
 * - Can a sequence be a single element? (yes, gives no edge)
 *
 * Each consecutive pair (a, b) in a sequence is an edge a -> b. nums is the unique
 * topological order iff Kahn's queue has exactly ONE node at every step AND the order
 * produced equals nums.
 *
 * APPROACH 1 — Brute force (check every adjacent pair of nums is forced)   O(n + total)
 * nums is unique iff for every i, the pair (nums[i], nums[i+1]) appears as consecutive
 * elements in some sequence. Collect all consecutive pairs into a set and check. Also
 * every sequence must be consistent with nums (positions increasing). This is elegant
 * but relies on a non-obvious fact; the Kahn version is the general tool.
 *
 * APPROACH 2 — Optimal (Kahn with uniqueness check)   O(n + total length)
 *   1. Build edges from consecutive pairs; in-degree.
 *   2. Kahn: if the queue ever holds more than one node -> two valid orders -> false.
 *   3. The popped node must equal nums[index]; else false.
 *   4. All n nodes popped -> true.
 *
 * Dry run nums [1,2,3], sequences [[1,2],[1,3],[2,3]]:
 *   edges 1->2, 1->3, 2->3. indeg [_,0,1,2]. queue [1] (size 1 ok) pop 1 === nums[0]
 *   indeg[2]=0, indeg[3]=1. queue [2] pop 2 === nums[1]. indeg[3]=0 queue [3] pop 3. true.
 * With sequences [[1,2],[1,3]]: after popping 1, queue [2,3] size 2 -> false.
 *
 * EDGE CASES
 * - n = 1 with sequences [[1]] -> true
 * - sequence referencing a number > n -> false
 * - cycle in sequences -> false (Kahn stops early)
 */

function bruteForce(nums, sequences) {
  const n = nums.length;
  const position = new Map(nums.map((v, i) => [v, i]));
  const consecutive = new Set();
  for (const seq of sequences) {
    for (let i = 0; i < seq.length; i++) {
      if (!position.has(seq[i])) return false;
      if (i > 0) {
        if (position.get(seq[i - 1]) >= position.get(seq[i])) return false; // contradicts nums
        consecutive.add(`${seq[i - 1]},${seq[i]}`);
      }
    }
  }
  for (let i = 0; i + 1 < n; i++) {
    if (!consecutive.has(`${nums[i]},${nums[i + 1]}`)) return false;        // not forced
  }
  return true;
}

function optimal(nums, sequences) {
  const n = nums.length;
  const adj = Array.from({ length: n + 1 }, () => []);
  const indegree = new Array(n + 1).fill(0);
  for (const seq of sequences) {
    for (const value of seq) if (value < 1 || value > n) return false;
    for (let i = 0; i + 1 < seq.length; i++) {
      adj[seq[i]].push(seq[i + 1]);
      indegree[seq[i + 1]]++;
    }
  }

  const queue = [];
  for (let v = 1; v <= n; v++) if (indegree[v] === 0) queue.push(v);

  let index = 0;
  let head = 0;
  while (head < queue.length) {
    if (queue.length - head > 1) return false;   // a choice exists -> not unique
    const current = queue[head++];
    if (current !== nums[index++]) return false; // order differs from nums
    for (const next of adj[current]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }
  return index === n;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3], [[1, 2], [1, 3]]), false);
  assert.strictEqual(solve([1, 2, 3], [[1, 2], [1, 3], [2, 3]]), true);
  assert.strictEqual(solve([1, 2, 3], [[1, 2]]), false);
  assert.strictEqual(solve([1], [[1]]), true);
  assert.strictEqual(solve([4, 1, 5, 2, 6, 3], [[5, 2, 6, 3], [4, 1, 5, 2]]), true);
  assert.strictEqual(solve([1, 2, 3], [[1, 2], [2, 3], [3, 1]]), false);     // cycle
  assert.strictEqual(solve([1, 2], [[1, 2], [2, 7]]), false);                // out of range
}
console.log('✓ 06-sequence-reconstruction passed');

module.exports = { optimal, bruteForce };
