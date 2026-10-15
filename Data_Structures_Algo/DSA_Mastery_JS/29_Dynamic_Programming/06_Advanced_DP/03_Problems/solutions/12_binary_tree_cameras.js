/**
 * 12. Binary Tree Cameras   (LeetCode 968 — Hard)
 *
 * PROBLEM
 * A camera placed on a node monitors that node, its parent and its children.
 * Return the minimum number of cameras so that every node is monitored.
 *
 * EXAMPLES
 * Input: [0,0,null,0,0]        Output: 1   Explanation: one camera on the middle node
 *        0
 *       /
 *      0      <- camera here covers root and both leaves
 *     / \
 *    0   0
 * Input: [0,0,null,0,null,0,null,null,0]   Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 1000 nodes, all values are 0 (values do not matter).
 * - Single node -> 1 camera.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(h) space
 * For each node decide camera / no camera, recursing with flags "is my parent covering
 * me?" and "does my parent need me to cover it?" without caching. Exponential-ish.
 *
 * APPROACH 2 — Tree DP with 3 states per node (post-order)   O(n) time, O(h) space
 * Every node returns a triple of minimum cameras for its subtree under three conditions:
 * STATE      [hasCamera, coveredNoCamera, notCovered]
 *              hasCamera        : this node holds a camera (so its children are covered)
 *              coveredNoCamera  : no camera here, but a CHILD's camera covers it
 *              notCovered       : no camera here and not covered by children
 *                                 (its PARENT must cover it)
 * RECURRENCE with L = left triple, R = right triple:
 *   hasCamera       = 1 + min(L) + min(R)            // children can be in any state
 *   notCovered      = L.coveredNoCamera + R.coveredNoCamera   // no child camera, children
 *                                                    // must already be covered themselves
 *   coveredNoCamera = min over (at least one child has a camera):
 *                       L.hasCamera + min(R.hasCamera, R.coveredNoCamera),
 *                       R.hasCamera + min(L.hasCamera, L.coveredNoCamera)
 * BASE CASES null node -> [Infinity, 0, 0]: it can't hold a camera, it needs nothing.
 * ANSWER     min(root.hasCamera, root.coveredNoCamera)  (root has no parent to cover it).
 *
 * Dry run on the first example (post-order):
 *   leaf        : hasCamera = 1 + 0 + 0 = 1, notCovered = 0 + 0 = 0,
 *                 coveredNoCamera = Inf (no child can have a camera) -> [1, Inf, 0]
 *   middle node : L = R = [1, Inf, 0]
 *                 hasCamera = 1 + 0 + 0 = 1
 *                 notCovered = Inf + Inf = Inf
 *                 coveredNoCamera = min(1 + min(1, Inf), 1 + min(1, Inf)) = 2  -> [1, 2, Inf]
 *   root        : L = [1, 2, Inf], R = null [Inf, 0, 0]
 *                 hasCamera = 1 + 1 + 0 = 2
 *                 notCovered = 2 + 0 = 2
 *                 coveredNoCamera = min(1 + min(Inf, 0), Inf + ...) = 1  -> [2, 1, 2]
 *   answer min(2, 1) = 1
 *
 * APPROACH 3 — Greedy post-order (the famous O(n) trick)
 * Return a state code: 0 = not covered, 1 = covered, 2 = has camera. If any child is
 * NOT covered, place a camera here. It is the same DP with the optimal choice baked in.
 *
 * EDGE CASES
 * - single node -> 1
 * - straight line of 3 -> 1 (camera in the middle)
 */

function buildTree(values) {
  if (!values.length || values[0] === null) return null;
  const root = { val: values[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < values.length) {
    const node = queue.shift();
    if (i < values.length && values[i] !== null) {
      node.left = { val: values[i], left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < values.length && values[i] !== null) {
      node.right = { val: values[i], left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// shared transition: combine the two child triples into this node's triple
function combine(left, right) {
  const hasCamera = 1 + Math.min(...left) + Math.min(...right);
  const notCovered = left[1] + right[1];
  const coveredNoCamera = Math.min(
    left[0] + Math.min(right[0], right[1]),
    right[0] + Math.min(left[0], left[1]),
  );
  return [hasCamera, coveredNoCamera, notCovered];
}
const NULL_TRIPLE = [Infinity, 0, 0];

function bruteForce(root) {
  // Plain recursion over (node, parentHasCamera, mustCoverParent). No caching, so shared
  // sub-states are recomputed -> exponential in the worst case.
  function solve(node, parentHasCamera, mustCoverParent) {
    if (!node) return mustCoverParent ? Infinity : 0;
    // option A: camera here
    const withCamera = 1 + solve(node.left, true, false) + solve(node.right, true, false);
    if (mustCoverParent) return withCamera;
    // option B: no camera here. If the parent covers us, children are free; otherwise
    // at least one child must have a camera.
    let withoutCamera;
    if (parentHasCamera) {
      withoutCamera = solve(node.left, false, false) + solve(node.right, false, false);
    } else {
      withoutCamera = Math.min(
        solve(node.left, false, true) + solve(node.right, false, false),
        solve(node.left, false, false) + solve(node.right, false, true),
      );
    }
    return Math.min(withCamera, withoutCamera);
  }
  return solve(root, false, false);
}

function memo(root) {
  const cache = new Map(); // node -> triple
  function triple(node) {
    if (!node) return NULL_TRIPLE;
    if (cache.has(node)) return cache.get(node);
    const result = combine(triple(node.left), triple(node.right));
    cache.set(node, result);
    return result;
  }
  const [hasCamera, coveredNoCamera] = triple(root);
  return Math.min(hasCamera, coveredNoCamera);
}

function tabulation(root) {
  if (!root) return 0;
  const order = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    order.push(node);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  const triples = new Map();
  const get = (node) => (node ? triples.get(node) : NULL_TRIPLE);
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    triples.set(node, combine(get(node.left), get(node.right)));
  }
  const [hasCamera, coveredNoCamera] = triples.get(root);
  return Math.min(hasCamera, coveredNoCamera);
}

function optimized(root) {
  // Greedy post-order: 0 = not covered, 1 = covered, 2 = has camera.
  let cameras = 0;
  function state(node) {
    if (!node) return 1; // null is "covered": it needs nothing
    const left = state(node.left);
    const right = state(node.right);
    if (left === 0 || right === 0) { cameras++; return 2; } // a child is exposed -> camera here
    if (left === 2 || right === 2) return 1;                // a child's camera covers me
    return 0;                                               // nobody covers me yet
  }
  if (state(root) === 0) cameras++; // root left uncovered -> it needs its own camera
  return cameras;
}

// ---------- tests ----------
const assert = require('assert');
const cases = [
  [[0, 0, null, 0, 0], 1],
  [[0, 0, null, 0, null, 0, null, null, 0], 2],
  [[0], 1],
  [[0, 0, 0], 1],
  [[0, 0, null, 0], 1],                 // line of 3
  [[0, 0, 0, 0, 0, 0, 0], 2],           // perfect tree of height 2: cameras on both level-1 nodes
];
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  for (const [values, expected] of cases) {
    assert.strictEqual(solve(buildTree(values)), expected, `${solve.name} on ${values}`);
  }
}
console.log('✓ 12-binary-tree-cameras passed');

module.exports = { bruteForce, memo, tabulation, optimized, buildTree };
