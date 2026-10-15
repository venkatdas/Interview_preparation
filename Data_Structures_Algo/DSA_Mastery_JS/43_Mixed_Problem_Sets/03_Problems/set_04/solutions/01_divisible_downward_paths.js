/**
 * 01. Divisible Downward Paths   (Original — Medium)
 *
 * PROBLEM
 * A binary tree (given as a level-order array with null for missing children) stores an
 * integer in each node. A "downward path" starts at any node and goes down through
 * children only, ending at that node or any descendant (a single node is a path).
 * Return how many downward paths have a sum divisible by k (k >= 1).
 *
 * EXAMPLES
 * Input: tree = [1, 2, 3], k = 3     Output: 2   Explanation: [3] and [1,2]
 * Input: tree = [4, -4, 2], k = 2    Output: 5   Explanation: [4],[−4],[2],[4,−4],[4,2]
 * Input: tree = [], k = 5            Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 nodes; values may be negative.
 * - Is 0 divisible by k? (yes)
 * - The tree can be a long chain (depth up to n).
 *
 * APPROACH 1 — Brute force   O(n * h) time (O(n^2) on a chain), O(h) space
 * From every node, walk down every descendant path, keeping a running sum, and count
 * sums divisible by k.
 *
 * APPROACH 2 — Optimal (DFS + prefix sums mod k in a hash map, with backtracking)   O(n) time, O(n) space
 * Let P = sum from the root down to the current node. A downward path ending here starts
 * just below some ancestor A with prefix Q, and its sum P - Q is divisible by k iff
 * P mod k === Q mod k. Keep counts of "prefix mod k" for the CURRENT root-to-node chain
 * (seed {0: 1} for the empty prefix). At each node add counts[P mod k], then increment
 * counts[P mod k], recurse, and decrement on the way back (backtracking keeps only
 * ancestors in the map).
 *
 * Dry run on [1, 2, 3], k = 3:
 *   counts {0:1}
 *   node 1: P=1 mod 1 -> +0          counts {0:1, 1:1}
 *     node 2: P=3 mod 0 -> +1 ([1,2]) counts {0:2, 1:1}, then undo -> {0:1, 1:1}
 *     node 3: P=4 mod 1 -> +1 ([3])   counts {0:1, 1:2}, then undo
 *   answer 2
 *
 * EDGE CASES
 * - empty tree -> 0
 * - k = 1 -> every path counts: sum over nodes of depth (1-based)
 * - negative values -> normalise the modulo
 *
 * COMMON MISTAKES
 * - JS % keeps the sign: (-4) % 3 === -1, which would never match 2.
 * - Forgetting to undo the count after visiting children: sibling subtrees then see each other.
 */

// Build a binary tree from a LeetCode-style level-order array (null = missing child).
function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1, head = 0;
  while (i < arr.length && head < queue.length) { // extra entries under missing parents are ignored
    const node = queue[head++];
    if (i < arr.length && arr[i] !== null) { node.left = { val: arr[i], left: null, right: null }; queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = { val: arr[i], left: null, right: null }; queue.push(node.right); }
    i++;
  }
  return root;
}
// Random level-order array generator for tests (complete-ish shape with holes).
function randomLevelArray(rand, maxN, valFn) {
  const n = Math.floor(rand() * (maxN + 1));
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(i > 0 && rand() < 0.25 ? null : valFn());
  return arr;
}

function bruteForce(arr, k) {
  const root = buildTree(arr);
  let total = 0;
  function down(node, sum) {
    if (!node) return;
    sum += node.val;
    if (sum % k === 0) total++;
    down(node.left, sum); down(node.right, sum);
  }
  function each(node) { if (!node) return; down(node, 0); each(node.left); each(node.right); }
  each(root);
  return total;
}

function optimal(arr, k) {
  const root = buildTree(arr);
  const counts = new Map([[0, 1]]);
  let total = 0;
  function dfs(node, prefix) {
    if (!node) return;
    const p = prefix + node.val;
    const m = ((p % k) + k) % k;
    total += counts.get(m) || 0;
    counts.set(m, (counts.get(m) || 0) + 1);
    dfs(node.left, p); dfs(node.right, p);
    counts.set(m, counts.get(m) - 1); // backtrack: this node is no longer an ancestor
  }
  dfs(root, 0);
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3], 3), 2);
  assert.strictEqual(solve([4, -4, 2], 2), 5);
  assert.strictEqual(solve([], 5), 0);
  assert.strictEqual(solve([5], 5), 1);
  assert.strictEqual(solve([1, 1, null, 1], 1), 6);
  assert.strictEqual(solve([2, null, 2, null, 2], 4), 2); // chain 2-2-2: [2,2] twice
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(401);
for (let t = 0; t < 300; t++) {
  const arr = randomLevelArray(rand, 15, () => Math.floor(rand() * 13) - 6);
  const k = 1 + Math.floor(rand() * 5);
  assert.strictEqual(optimal(arr, k), bruteForce(arr, k));
}
console.log('✓ set_04/01_divisible_downward_paths passed');
module.exports = { optimal, bruteForce, buildTree };
