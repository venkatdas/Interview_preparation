/**
 * 06. All Nodes Distance K in Binary Tree   (LeetCode 863 — Medium)
 *
 * PROBLEM
 * Given a binary tree, a target node and an integer k, return the values of all nodes
 * that are exactly k edges away from target (going up through parents is allowed).
 *
 * EXAMPLES
 * Input: root=[3,5,1,6,2,0,8,null,null,7,4], target=5, k=2   Output: [7,4,1]
 * Input: root=[1], target=1, k=3                              Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values unique? (yes)  - k = 0 -> [target.val]
 * - Any output order? (yes; tests sort)
 *
 * Key insight: a tree is a graph. Nodes can only go DOWN with left/right, so first give
 * every node a way to go UP (a parent map), then it is a plain BFS from target.
 *
 * APPROACH 1 — Brute force (distance from target to EVERY node, pick those equal to k)   O(n^2), O(h)
 * For every node, compute the distance target -> node via the lowest common ancestor:
 * dist = depth(target) + depth(node) - 2 * depth(lca). Each LCA/depth is O(n).
 *
 * APPROACH 2 — Optimal (parent map + BFS)   O(n) time, O(n) space
 * 1. DFS once to record parent[node] in a Map.
 * 2. BFS from target over neighbours {left, right, parent}, with a visited set
 *    (otherwise we bounce between a node and its parent). After k rounds the queue
 *    holds exactly the nodes at distance k.
 *
 * Dry run on root 3, target 5, k=2:
 *   parents: 5->3, 1->3, 6->5, 2->5, 0->1, 8->1, 7->2, 4->2
 *   round 0: [5]           visited {5}
 *   round 1: [6, 2, 3]     (left, right, parent)
 *   round 2: [7, 4, 1]     (6 has nothing new; 2 -> 7, 4; 3 -> 1; 5 already visited)
 *   k reached -> [7, 4, 1]
 *
 * EDGE CASES
 * - k = 0 -> the target itself
 * - k larger than the tree -> []
 * - target is the root or a leaf
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root, target, k) {
  function depth(node, goal, d) {       // depth of goal from node, or -1
    if (!node) return -1;
    if (node === goal) return d;
    const left = depth(node.left, goal, d + 1);
    return left !== -1 ? left : depth(node.right, goal, d + 1);
  }
  function lca(node, a, b) {
    if (!node || node === a || node === b) return node;
    const left = lca(node.left, a, b), right = lca(node.right, a, b);
    return left && right ? node : (left || right);
  }
  const result = [];
  (function visit(node) {
    if (!node) return;
    const ancestor = lca(root, target, node);
    const dist = depth(root, target, 0) + depth(root, node, 0) - 2 * depth(root, ancestor, 0);
    if (dist === k) result.push(node.val);
    visit(node.left);
    visit(node.right);
  })(root);
  return result;
}

function optimal(root, target, k) {
  // 1. parent pointers
  const parent = new Map();
  (function dfs(node, par) {
    if (!node) return;
    parent.set(node, par);
    dfs(node.left, node);
    dfs(node.right, node);
  })(root, null);

  // 2. BFS outward from target, k rounds
  let frontier = [target];
  const visited = new Set([target]);
  for (let distance = 0; distance < k; distance++) {
    const next = [];
    for (const node of frontier) {
      for (const neighbour of [node.left, node.right, parent.get(node)]) {
        if (neighbour && !visited.has(neighbour)) {
          visited.add(neighbour);
          next.push(neighbour);
        }
      }
    }
    frontier = next;
    if (frontier.length === 0) return [];   // ran out of tree before reaching k
  }
  return frontier.map((node) => node.val);
}

// ---------- tests ----------
const assert = require('assert');
function find(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return find(root.left, val) || find(root.right, val);
}
const sorted = (arr) => [...arr].sort((a, b) => a - b);
for (const solve of [bruteForce, optimal]) {
  const tree = buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
  assert.deepStrictEqual(sorted(solve(tree, find(tree, 5), 2)), [1, 4, 7]);
  assert.deepStrictEqual(sorted(solve(tree, find(tree, 5), 0)), [5]);
  assert.deepStrictEqual(sorted(solve(tree, find(tree, 5), 1)), [2, 3, 6]);
  assert.deepStrictEqual(sorted(solve(tree, find(tree, 7), 3)), [3, 6]);     // 7-2-5-3 and 7-2-5-6
  assert.deepStrictEqual(sorted(solve(tree, find(tree, 3), 2)), [0, 2, 6, 8]);
  assert.deepStrictEqual(solve(tree, find(tree, 5), 10), []);
  const single = buildTree([1]);
  assert.deepStrictEqual(solve(single, single, 3), []);
}
console.log('✓ 06-all-nodes-distance-k passed');

module.exports = { optimal, bruteForce };
