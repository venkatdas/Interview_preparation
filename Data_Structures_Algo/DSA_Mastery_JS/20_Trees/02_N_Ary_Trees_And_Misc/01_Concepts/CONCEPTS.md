# N-ary Trees and Misc Tree Techniques

> **Prerequisites:** [Binary Trees](../../01_Binary_Trees/README.md) (traversals, recursion on trees), [Trees overview](../../01_Concepts/OVERVIEW.md), [Queues and Deques](../../../17_Queues_And_Deques/README.md) (BFS), [Hashing](../../../05_Hashing/README.md) (maps for parents and serializations).

An **N-ary tree** is a tree where a node can have **any number of children**, stored in an
array: `{ val, children: [] }`. The folder structure on your computer, an org chart, the
HTML DOM and a React component tree are all N-ary trees (a `<ul>` can have 50 `<li>`s).
Everything you learned on binary trees carries over; the only change in the code is
`for (const child of node.children)` instead of `node.left` / `node.right`.

This topic also collects techniques that do not fit "binary tree basics" or "BST":
parent pointers (treating a tree as a graph), hashing subtrees, converting between tree
representations, and a teaser for tree DP.

---

## Why it matters / when to use

- The node has a `children` array (LeetCode "N-ary" problems: 589, 590, 429, 559, 1490)
- Nested data from an API: JSON, file systems, comments with replies, menus
- "Distance between nodes", "nodes k away", "going up" -> add **parent pointers**
- "Duplicate subtrees", "same structure" -> **hash / serialize each subtree**
- The tree is given as a **parent array** (`parent[i]`) or an **edge list** instead of
  node objects -> build children lists first
- "Best value over the whole tree where each node picks from its children" -> **tree DP**

---

## How it works

### N-ary node and the LeetCode array format

```
          1
       /  |  \            [1, null, 3, 2, 4, null, 5, 6]
      3   2   4
     / \                  level order; each node's children group ends with null
    5   6
```

`n_ary_tree.js` has `buildNaryTree(array)` and `toNaryArray(root)` for this format.

### Generic traversal

```js
function preorder(node, out = []) {           // node, then children left to right
  if (!node) return out;
  out.push(node.val);
  for (const child of node.children) preorder(child, out);
  return out;
}
```

Postorder: push after the loop. Level order: `queue.push(...node.children)`.
There is no "inorder" for N-ary trees (where would the node go among 5 children?).

Iterative preorder: pop, visit, push children in **reverse** so the first child is on
top of the stack.

### Parent pointers: a tree is a graph

Nodes only point down. To move up (ancestor, distance k, path between two nodes) do
one DFS that records `parent.set(node, par)`, then treat every node as having
neighbours `[left, right, parent]` and run BFS with a visited set.

```
         3
       /   \          target = 5, k = 2
      5     1         BFS from 5: round 1 -> {6, 2, 3}   (children and PARENT)
     / \   / \                    round 2 -> {7, 4, 1}
    6   2 0   8
       / \
      7   4
```

### Hashing subtrees (Find Duplicate Subtrees)

Serialize each subtree bottom-up: `key = val + "," + leftKey + "," + rightKey` with `#`
for null. Count keys in a Map. The second time a key appears, that subtree is a duplicate.
Each node's key is built from its children's keys, so the whole tree is encoded in one
postorder pass.

### Converting between representations

Trees often arrive without node objects:

```
parent array:   parent = [-1, 0, 0, 1, 1, 2]        (parent[i] = parent of node i, root = -1)

                      0
                    /   \         children lists:  [[1, 2], [3, 4], [5], [], [], []]
                   1     2
                  / \     \
                 3   4     5

edge list:      [[0,1], [0,2], [1,3], [1,4], [2,5]]   (undirected; pick a root, DFS to orient)
```

Build children lists in one pass (`children[parent[i]].push(i)`), then every traversal
above works with `children[node]` instead of `node.children`. The reverse (children lists
to parent array) is one DFS. Both are in `n_ary_tree.js`.

### Tree DP teaser

Many "hard" tree problems are dynamic programming where the state is "the best answer
for this subtree", computed bottom-up (postorder) from the children:

```js
// House Robber III (337): rob a node or skip it; cannot rob a node and its child
function rob(node) {              // returns [bestIfRobbed, bestIfSkipped]
  if (!node) return [0, 0];
  const [leftRob, leftSkip] = rob(node.left);
  const [rightRob, rightSkip] = rob(node.right);
  const robbed = node.val + leftSkip + rightSkip;
  const skipped = Math.max(leftRob, leftSkip) + Math.max(rightRob, rightSkip);
  return [robbed, skipped];
}
```

Diameter and Maximum Path Sum (in [01_Binary_Trees](../../01_Binary_Trees/README.md)) are tree DP too: the "state" is the best
downward arm. More in `29_Dynamic_Programming/`.

---

## Pseudocode

```
PREORDER(node):            if node: visit(node); for child in node.children: PREORDER(child)
POSTORDER(node):           if node: for child in node.children: POSTORDER(child); visit(node)
MAX_DEPTH(node):           if not node: return 0
                           return 1 + max(MAX_DEPTH(c) for c in children, default 0)

LEVEL_ORDER(root):
    queue = [root]
    while queue not empty:
        size = queue.length; level = []
        repeat size times: n = dequeue(); level.append(n.val); enqueue all n.children
        output level

PARENT_ARRAY_TO_CHILDREN(parent):
    children = [[] for each node]
    for v in 0..n-1:
        if parent[v] == -1: root = v
        else: children[parent[v]].append(v)
    return root, children

DISTANCE_K(root, target, k):     # tree -> graph
    record parent of every node (DFS)
    BFS from target over {left, right, parent}, with visited, for k levels
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| N-ary preorder / postorder / level order | O(n) | O(h) or O(w) | sum of children counts = n - 1 edges |
| max depth / size | O(n) | O(h) | |
| deep clone | O(n) | O(n) | Map old -> new handles shared pointers |
| build parent map | O(n) | O(n) | one DFS |
| BFS with parent pointers (distance k) | O(n) | O(n) | visited set required |
| serialize all subtrees (duplicate detection) | O(n) typical, O(n^2) worst | O(n) | string lengths add up on skewed trees; use integer ids for true O(n) |
| vertical order traversal | O(n log n) | O(n) | sort within columns / cells |
| parent array <-> children lists | O(n) | O(n) | |

---

## JavaScript implementation

Full code with tests: `n_ary_tree.js`.

```js
class NaryNode {
  constructor(val, children = []) { this.val = val; this.children = children; }
}
const root = buildNaryTree([1, null, 3, 2, 4, null, 5, 6]);
levelOrder(root);   // [[1], [3, 2, 4], [5, 6]]
maxDepth(root);     // 3
```

Binary tree problems in this folder (duplicate subtrees, distance k, vertical order)
import `20_Trees/02_Implementations/tree_node.js` as usual (`require('../../../02_Implementations/tree_node')` from a solution file).

---

## Dry run

**Level order on `[1, null, 3, 2, 4, null, 5, 6]`:**

| Round | queue at start | size | level output | children enqueued |
|---|---|---|---|---|
| 1 | [1] | 1 | [1] | 3, 2, 4 |
| 2 | [3, 2, 4] | 3 | [3, 2, 4] | 5, 6 (from 3) |
| 3 | [5, 6] | 2 | [5, 6] | - |

**Parent array `[-1, 0, 0, 1, 1]` → children lists:**

| v | parent[v] | action | children after |
|---|---|---|---|
| 0 | -1 | root = 0 | [[], [], [], [], []] |
| 1 | 0 | children[0].push(1) | [[1], [], [], [], []] |
| 2 | 0 | children[0].push(2) | [[1, 2], [], [], [], []] |
| 3 | 1 | children[1].push(3) | [[1, 2], [3], [], [], []] |
| 4 | 1 | children[1].push(4) | [[1, 2], [3, 4], [], [], []] |

---

## Patterns / variations

### 1. "for child of children" recursion

```js
function maxDepth(node) {
  if (!node) return 0;
  let deepest = 0;                    // NOT Math.max(...[]) which is -Infinity
  for (const child of node.children) deepest = Math.max(deepest, maxDepth(child));
  return 1 + deepest;
}
```

### 2. Level order with "current / next" arrays (no shift)

```js
let current = [root];
while (current.length) {
  levels.push(current.map((n) => n.val));
  const next = [];
  for (const node of current) next.push(...node.children);
  current = next;
}
```

### 3. Parent map + BFS

```js
const parent = new Map();
(function dfs(node, par) { if (!node) return; parent.set(node, par); dfs(node.left, node); dfs(node.right, node); })(root, null);
// then BFS over [node.left, node.right, parent.get(node)] with a visited Set
```

### 4. Subtree hashing

```js
function key(node) {
  if (!node) return '#';
  const k = node.val + ',' + key(node.left) + ',' + key(node.right);
  count.set(k, (count.get(k) || 0) + 1);
  if (count.get(k) === 2) duplicates.push(node);
  return k;
}
```

### 5. Coordinates on a grid (vertical / diagonal order)

Give the root (row 0, col 0); left child (row+1, col-1), right child (row+1, col+1).
Collect into a Map keyed by col, then sort inside columns as the problem demands.

### 6. Clone with a Map (works for trees with random/shared pointers too)

```js
function clone(node) {
  if (!node) return null;
  if (copies.has(node)) return copies.get(node);
  const copy = new NaryNode(node.val);
  copies.set(node, copy);
  for (const child of node.children) copy.children.push(clone(child));
  return copy;
}
```

---

## Alternatives (brute force vs optimized)

| Task | Simple approach | Better approach | Trade-off |
|---|---|---|---|
| Distance K | DFS from every node computing distances: O(n²) | Parent map + BFS from target: O(n) | Uses O(n) extra for the parent map |
| Duplicate subtrees | Compare every pair of subtrees: O(n²)–O(n³) | Postorder serialization + Map: O(n²) worst | Integer IDs for serializations: O(n) |
| Vertical order | DFS collecting (col, row, val), sort all: O(n log n) | Same with BFS + per-column buckets sorted per row | Sorting is simplest and fine |
| Deep N-ary trees | Recursion | Explicit stack | Avoids JS stack overflow |
| Tree given as edges | Build node objects | Adjacency lists + parent tracking | Lists are lighter and match graph code |

---

## Common mistakes & edge cases

- `Math.max(...node.children.map(f))` on a leaf returns `-Infinity`. Start from 0.
- Forgetting the visited set when BFS-ing with parent pointers: infinite ping-pong
  between a node and its parent.
- Serializing subtrees without `#` markers or separators: `[1,2]` and `[12]` collide.
- Reporting a duplicate shape more than once: record it exactly when the count hits 2.
- Vertical order: LeetCode 987 sorts ties by VALUE; LeetCode 314 keeps left-to-right
  order. Read the statement.
- Deep copies: mutate the copy in your tests and check the original did not change.
- The LeetCode N-ary array format has a `null` after the root and after each children
  group; trailing nulls are trimmed.

---

## When this does NOT apply

- **Each node has at most two children and order matters (left/right)**: use the binary-tree patterns; inorder only exists there.
- **The structure has cycles or nodes with multiple parents**: it's a graph; use [Graph Traversal](../../../24_Graph_Traversal/README.md) with a visited set.
- **You need ordered search**: use a BST or a trie (a trie is a special N-ary tree keyed by characters: [Tries](../../../22_Tries/README.md)).
- **Questions about ancestors at large scale (many LCA queries)**: plain DFS per query is too slow; use binary lifting or Euler tour + sparse table.

---

## Interview tips

- Say "an N-ary tree is the same recursion with a loop over children" and move on.
- When you need to go up, say "I will add parent pointers with one DFS, then it is a
  graph BFS."
- For "same structure" questions, say "I will serialize each subtree in postorder and
  count the strings in a hash map."
- If the tree comes as a parent array or edge list, build adjacency first, then reuse
  the usual traversals. This is also exactly how 23_Graphs starts.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | N-ary Tree Preorder Traversal | Easy | recursion / explicit stack | 03_Problems/solutions/01_n_ary_preorder.js |
| 02 | Maximum Depth of N-ary Tree | Easy | for-child recursion | 03_Problems/solutions/02_max_depth_n_ary.js |
| 03 | N-ary Tree Level Order Traversal | Medium | BFS current/next | 03_Problems/solutions/03_n_ary_level_order.js |
| 04 | Clone N-ary Tree | Medium | copy with Map | 03_Problems/solutions/04_clone_n_ary_tree.js |
| 05 | Find Duplicate Subtrees | Medium | subtree hashing | 03_Problems/solutions/05_find_duplicate_subtrees.js |
| 06 | All Nodes Distance K in Binary Tree | Medium | parent map + BFS | 03_Problems/solutions/06_all_nodes_distance_k.js |
| 07 | Vertical Order Traversal of a Binary Tree | Hard | grid coordinates + sort | 03_Problems/solutions/07_vertical_order_traversal.js |

---

## Practice more

Easy: N-ary Tree Postorder Traversal (590), Maximum Depth of N-ary Tree (559),
Sum of Root To Leaf Binary Numbers (1022)

Medium: Encode N-ary Tree to Binary Tree (431), Binary Tree Vertical Order Traversal (314),
House Robber III (337), Diameter of N-Ary Tree (1522), Lowest Common Ancestor of Deepest
Leaves (1123), Step-By-Step Directions From a Binary Tree Node to Another (2096),
Time Needed to Inform All Employees (1376, tree from a parent array), Delete Nodes And
Return Forest (1110), Kill Process (582), Most Frequent Subtree Sum (508)

Hard: Serialize and Deserialize N-ary Tree (428), Binary Tree Cameras (968),
Minimum Height Trees (310, graph view), Count Pairs of Nodes with Distance <= k (1530)
