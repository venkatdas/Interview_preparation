/**
 * 02. BST Pair Count   (Original — Medium)
 *
 * PROBLEM
 * A binary search tree with DISTINCT values is given as a level-order array (null for
 * missing children). Return how many unordered pairs of different nodes have values that
 * add up to `target`.
 *
 * EXAMPLES
 * Input: tree = [5, 3, 8, 1, 4, 6, 9], target = 9    Output: 3   Explanation: (1,8), (3,6), (4,5)
 * Input: tree = [2, 1, 3], target = 4                 Output: 1   Explanation: (1,3)
 * Input: tree = [1], target = 2                       Output: 0   Explanation: a node cannot pair with itself
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 nodes. Values distinct (so each pair is counted once).
 * - Can I use O(n) extra space? (yes; follow-up: O(h) with two iterators)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * Collect all values with any traversal and test every pair.
 *
 * APPROACH 2 — Optimal (in-order traversal gives a sorted array + two pointers)   O(n) time, O(n) space
 * In-order traversal of a BST visits values in increasing order. On the sorted values run
 * opposite-end two pointers: sum too small -> move left up; too big -> move right down;
 * equal -> count and move both (values are distinct).
 *
 * Dry run on [5, 3, 8, 1, 4, 6, 9], target 9:
 *   in-order = [1, 3, 4, 5, 6, 8, 9]
 *   1+9=10 > 9  r--      1+8=9 count=1 l++ r--
 *   3+6=9 count=2        4+5=9 count=3, pointers cross -> answer 3
 *
 * EDGE CASES
 * - empty tree or one node -> 0
 * - target smaller than any pair -> 0
 *
 * COMMON MISTAKES
 * - Running two pointers on a level-order array (it is not sorted).
 * - Counting (a, b) and (b, a) separately.
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

function bruteForce(arr, target) {
  const all = [];
  (function walk(n) { if (!n) return; all.push(n.val); walk(n.left); walk(n.right); })(buildTree(arr));
  let c = 0;
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) if (all[i] + all[j] === target) c++;
  return c;
}

function optimal(arr, target) {
  const sorted = [];
  (function inorder(n) { if (!n) return; inorder(n.left); sorted.push(n.val); inorder(n.right); })(buildTree(arr));
  let l = 0, r = sorted.length - 1, c = 0;
  while (l < r) {
    const s = sorted[l] + sorted[r];
    if (s === target) { c++; l++; r--; } else if (s < target) l++; else r--;
  }
  return c;
}

// Level-order array of a random BST (insert distinct values, then serialise).
function randomBstArray(rand) {
  const n = Math.floor(rand() * 12);
  const set = new Set();
  while (set.size < n) set.add(Math.floor(rand() * 30));
  let root = null;
  const insert = (node, v) => { if (!node) return { val: v, left: null, right: null }; if (v < node.val) node.left = insert(node.left, v); else node.right = insert(node.right, v); return node; };
  for (const v of set) root = insert(root, v);
  const out = [], q = [root];
  for (let h = 0; h < q.length; h++) { const nd = q[h]; out.push(nd ? nd.val : null); if (nd) q.push(nd.left, nd.right); }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([5, 3, 8, 1, 4, 6, 9], 9), 3);
  assert.strictEqual(solve([2, 1, 3], 4), 1);
  assert.strictEqual(solve([1], 2), 0);
  assert.strictEqual(solve([], 0), 0);
  assert.strictEqual(solve([10, 5, 15, null, 7], 22), 1);
  assert.strictEqual(solve([0, -3, 3], 0), 1);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(402);
for (let t = 0; t < 300; t++) {
  const arr = randomBstArray(rand);
  const target = Math.floor(rand() * 60);
  assert.strictEqual(optimal(arr, target), bruteForce(arr, target));
}
console.log('✓ set_04/02_bst_pair_count passed');
module.exports = { optimal, bruteForce, buildTree };
