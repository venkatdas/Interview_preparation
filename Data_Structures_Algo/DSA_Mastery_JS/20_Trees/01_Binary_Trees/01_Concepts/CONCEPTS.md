# Binary Tree Basics

> **Prerequisites:** [Trees overview](../../01_Concepts/OVERVIEW.md) (terminology), [Backtracking & Recursion](../../../13_Backtracking/README.md) (recursion basics), [Queues and Deques](../../../17_Queues_And_Deques/README.md) (BFS), [Stacks](../../../16_Stacks/README.md) (iterative DFS).

A **binary tree** is a tree where every node has at most two children, called `left` and
`right`. Each node is a tiny object: `{ val, left, right }`. Think of a tournament bracket,
a decision flow ("is it bigger? go right, otherwise go left"), or a React component that
renders at most two children. Almost every tree question in interviews is a binary tree
question, and almost every one is solved with a short recursion or a queue.

Read [the trees overview](../../01_Concepts/OVERVIEW.md) first for terminology (root, leaf, depth, height, balanced...) and the
"recursive leap of faith".

---

## Why it matters / when to use

- The input is a `root` of type `TreeNode` (defined in [`20_Trees/02_Implementations/tree_node.js`](../../02_Implementations/tree_node.js))
- "depth", "height", "level", "leaf", "path from root", "ancestor", "subtree"
- "left to right by level", "view from the right side", "zigzag" -> BFS
- "rebuild the tree from traversals", "serialize" -> preorder tricks
- Something nested that you would naturally process recursively (file systems, DOM, JSON)

---

## How it works

### Structure

```
        1            node = { val: 1, left: <node 2>, right: <node 3> }
       / \
      2   3          leaves have left = right = null
     / \
    4   5
```

### The three depth-first traversals

They differ only in WHEN you "visit" the node relative to its two children.

```
preorder   (node, left, right)  : 1 2 4 5 3      "copy the tree / serialize"
inorder    (left, node, right)  : 4 2 5 1 3      "sorted order for a BST"
postorder  (left, right, node)  : 4 5 2 3 1      "delete the tree / compute from children"
```

Recursive (3 lines each):

```js
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);          // move this line up for preorder, down for postorder
  inorder(node.right, out);
  return out;
}
```

Iterative with an explicit stack (asked when the interviewer says "without recursion"):

```js
// preorder: pop, visit, push right THEN left (so left comes out first)
function preorderIterative(root) {
  const out = [], stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return out;
}

// inorder: slide down the left spine, pop, visit, step right
function inorderIterative(root) {
  const out = [], stack = [];
  let current = root;
  while (current || stack.length) {
    while (current) { stack.push(current); current = current.left; }
    current = stack.pop();
    out.push(current.val);
    current = current.right;
  }
  return out;
}

// postorder: do (node, right, left) with a stack, then reverse the output
```

### Level order (BFS) with a queue

```
        1          level 0: [1]
       / \         level 1: [2, 3]
      2   3        level 2: [4, 5]
     / \
    4   5
```

```js
function levelOrder(root) {
  const levels = [];
  const queue = root ? [root] : [];
  while (queue.length) {
    const levelSize = queue.length;      // snapshot: nodes currently in the queue = one level
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}
```

The `levelSize` snapshot is the whole trick. Zigzag, right side view, averages of levels,
minimum depth, "largest value per row": all are this loop with one line changed.

### Morris traversal (brief)

Inorder in O(1) extra space, no stack and no recursion. Before going left, link the
rightmost node of the left subtree ("inorder predecessor") back to the current node, so
you can find your way back without a stack; remove the link on the way back. See
`morrisInorder` in `binary_tree.js`. Mention it as a follow-up; rarely required to write.

### Height, depth, diameter

```
height(node) = -1 if null, else 1 + max(height(left), height(right))        (in edges)
depth(node)  = number of edges from root to node   (pass it DOWN as a parameter)
diameter     = max over all nodes of  height(left) + height(right) + 2   (in edges)
```

### Top-down vs bottom-up recursion

| | Top-down | Bottom-up |
|---|---|---|
| Information flows | parent -> child, as **parameters** | child -> parent, as **return values** |
| Looks like | `dfs(node, depth, sumSoFar)` | `const left = dfs(node.left); ... return ...` |
| Order | preorder-ish (do work, then recurse) | postorder-ish (recurse, then do work) |
| Examples | Max Depth (BFS variant), Path Sum, Count Good Nodes, Validate BST | Height, Balanced, Diameter, Max Path Sum, LCA |

Many hard problems combine both: pass the running state down, return a summary up, and
record a global best in an outer variable (Diameter and Max Path Sum do exactly this).

### Drawing the recursion

Before coding, write the recursion as a tree of calls for a 5-node example. For
`diameter`:

```
height(1)                               best = 0
  height(2)
    height(4) -> 0    (leaf)
    height(5) -> 0
    best = max(best, 0 + 0 + 2) = 2 ; return 1
  height(3) -> 0
  best = max(2, 1 + 0 + 2) = 3 ; return 2
answer: best = 3 (edges)
```

Doing this once on paper catches the classic "I returned the diameter instead of the
height" bug.

---

## Pseudocode

```
DFS(node):                          # recursive skeleton
    if node is null: return BASE
    leftResult  = DFS(node.left)
    rightResult = DFS(node.right)
    return COMBINE(node.val, leftResult, rightResult)

    e.g. height:  BASE = -1, COMBINE = 1 + max(left, right)

BFS(root):                          # level by level
    if root is null: return []
    queue = [root]; levels = []
    while queue not empty:
        size = queue.length; level = []
        repeat size times:
            node = dequeue(); level.append(node.val)
            if node.left:  enqueue(node.left)
            if node.right: enqueue(node.right)
        levels.append(level)
    return levels

INORDER_ITERATIVE(root):
    stack = []; node = root
    while node or stack not empty:
        while node: stack.push(node); node = node.left
        node = stack.pop(); visit(node)
        node = node.right
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| any DFS traversal (recursive) | O(n) | O(h) | h = height; O(log n) balanced, O(n) skewed |
| any DFS traversal (explicit stack) | O(n) | O(h) | same memory, but no call-stack overflow risk |
| BFS / level order | O(n) | O(w) | w = widest level, up to n/2 |
| Morris inorder | O(n) | O(1) | temporarily mutates the tree |
| height / size / count leaves / mirror / isSame | O(n) | O(h) | one bottom-up pass |
| serialize / deserialize | O(n) | O(n) | preorder with '#' for null |
| build from preorder + inorder | O(n) | O(n) | hash map of inorder indices |

---

## JavaScript implementation

Full code with tests: `binary_tree.js` (traversals recursive and iterative, level order,
Morris, height, size, countLeaves, mirror, isSame, serialize, deserialize). Node class and
array <-> tree helpers: `20_Trees/02_Implementations/tree_node.js`.

```js
const { TreeNode, buildTree, toLevelOrderArray } = require('../../../02_Implementations/tree_node'); // from a file in 03_Problems/solutions
const root = buildTree([1, 2, 3, null, 4]);   // LeetCode-style input
toLevelOrderArray(root);                      // -> [1, 2, 3, null, 4]
```

---

## Dry run

**Height (in edges) of the tree `[1, 2, 3, 4, 5, null, 6]`** — postorder, children first:

| Call | left result | right result | returns |
|---|---|---|---|
| height(4) | -1 (null) | -1 (null) | 0 |
| height(5) | -1 | -1 | 0 |
| height(2) | 0 | 0 | 1 |
| height(6) | -1 | -1 | 0 |
| height(3) | -1 (null) | 0 | 1 |
| height(1) | 1 | 1 | **2** |

**Iterative inorder on the same tree:**

| Step | action | stack (bottom → top) | output |
|---|---|---|---|
| 1 | push 1, 2, 4 (go left) | 1 2 4 | |
| 2 | pop 4, visit, go right (null) | 1 2 | 4 |
| 3 | pop 2, visit, go right → push 5 | 1 5 | 4 2 |
| 4 | pop 5, visit | 1 | 4 2 5 |
| 5 | pop 1, visit, go right → push 3 | 3 | 4 2 5 1 |
| 6 | pop 3, visit, go right → push 6 | 6 | 4 2 5 1 3 |
| 7 | pop 6, visit | (empty) | 4 2 5 1 3 6 |

---

## Patterns / variations

### 1. Bottom-up "return a summary" (height, balanced, diameter, max path sum)

```js
function diameter(root) {
  let best = 0;
  function height(node) {               // returns height in nodes
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    best = Math.max(best, left + right); // path bending at this node (edges)
    return 1 + Math.max(left, right);    // what the parent needs
  }
  height(root);
  return best;
}
```
Use when: the answer at a node depends on answers of its children. Return the thing the
parent needs; record the global answer separately.

### 2. Top-down "pass state as parameters" (path sum, good nodes, bounds)

```js
function hasPathSum(node, remaining) {
  if (!node) return false;
  remaining -= node.val;
  if (!node.left && !node.right) return remaining === 0;   // leaf check
  return hasPathSum(node.left, remaining) || hasPathSum(node.right, remaining);
}
```
Use when: the question is about root-to-node paths or ancestors.

### 3. Two-tree recursion (same tree, symmetric, subtree)

```js
function isSame(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
}
```
Symmetric Tree is `isMirror(a.left, b.right) && isMirror(a.right, b.left)`.

### 4. BFS level template (level order, zigzag, right view, min depth)

See `levelOrder` above. Right side view = last node of each level. Zigzag = reverse odd
levels (or write into the level array from the right end).

### 5. Backtracking with a shared path (Path Sum II, all root-to-leaf paths)

```js
path.push(node.val);
// ... recurse ...
path.pop();            // undo before returning to the parent
```
Copy the path (`[...path]`) when recording an answer.

### 6. Build / serialize with preorder

- Build from preorder + inorder: `preorder[0]` is the root; find it in inorder to split
  left/right; use a Map and index ranges for O(n).
- Serialize: preorder with `#` for null. Deserialize: consume tokens with one moving index.

### 7. LCA: "return what you found"

```js
function lca(node, p, q) {
  if (!node || node === p || node === q) return node;
  const left = lca(node.left, p, q), right = lca(node.right, p, q);
  return left && right ? node : (left || right);
}
```

---

## Alternatives (brute force vs optimized)

| Task | Simple approach | Better approach | Trade-off |
|---|---|---|---|
| Balanced / diameter | Call `height()` at every node: O(n²) worst | One postorder pass returning height: O(n) | |
| Min depth | DFS over the whole tree | BFS that stops at the first leaf | BFS uses O(width) memory |
| Traversal | Recursion (O(h) stack) | Iterative with explicit stack, or Morris (O(1) space) | Recursion is clearest; iterative avoids stack overflow |
| Subtree check | `isSame` at every node: O(n·m) | Serialize both with null markers and substring-search (KMP): O(n + m) | Serialization uses O(n) memory |
| Build from traversals | Linear search for the root in inorder: O(n²) | Map value → index: O(n) | Needs distinct values |

---

## Common mistakes & edge cases

- No `null` base case -> `Cannot read properties of null`.
- Minimum Depth: a node with ONE child is not a leaf; do not take `min` with a missing side.
- Diameter / Max Path Sum: returning the two-arm value to the parent (a parent can only
  extend ONE arm). Return one arm, record two arms.
- Max Path Sum: initialize `best = -Infinity`, not 0 (all-negative trees), and clamp arms
  with `Math.max(0, gain)`.
- Forgetting `levelSize` snapshot in BFS -> levels blend together.
- Path Sum with negative numbers: you cannot stop early when the sum exceeds the target.
- Serialization without separators or null markers is ambiguous (`[1,2]` vs `[12]`).
- `queue.shift()` is O(n) in JS. Say it, then move on (or keep a head index).
- Recursion depth on skewed trees of 10^4+ nodes: offer the iterative version.

---

## When this does NOT apply

- **The data is a general graph with cycles or shared children**: tree recursion would loop forever; use graph traversal with a visited set ([Graph Traversal](../../../24_Graph_Traversal/README.md)).
- **Values are ordered and you need fast search/insert**: a plain binary tree has no order; use a BST ([Binary Search Trees](../../../21_Binary_Search_Trees/README.md)).
- **Nodes can have more than two children**: use the N-ary patterns ([N-ary Trees](../../02_N_Ary_Trees_And_Misc/README.md)).
- **Very deep (skewed) trees in JS**: avoid recursion; iterate.
- **The input is a flat array of priorities**: you probably want a heap, which is a binary tree stored implicitly in an array.

---

## Interview tips

- Draw a 5-7 node tree first. Then say: "base case null, recurse on children, combine."
- Say whether depth/height is in nodes or edges before writing code.
- For "level" wording, reach for the BFS template immediately.
- State O(n) time, O(h) space; explain h vs n for skewed trees.
- Know how to convert recursion to an explicit stack (preorder is 6 lines).
- When you use an outer variable (`best`), say why: "the parent needs one thing, the
  answer is another."

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Maximum Depth of Binary Tree | Easy | bottom-up / BFS | 03_Problems/solutions/01_maximum_depth.js |
| 02 | Minimum Depth of Binary Tree | Easy | BFS early exit | 03_Problems/solutions/02_minimum_depth.js |
| 03 | Same Tree | Easy | two-tree recursion | 03_Problems/solutions/03_same_tree.js |
| 04 | Invert Binary Tree | Easy | recursion / BFS | 03_Problems/solutions/04_invert_binary_tree.js |
| 05 | Symmetric Tree | Easy | two-tree recursion (mirrored) | 03_Problems/solutions/05_symmetric_tree.js |
| 06 | Balanced Binary Tree | Easy | bottom-up with sentinel | 03_Problems/solutions/06_balanced_binary_tree.js |
| 07 | Diameter of Binary Tree | Easy | return height, record best | 03_Problems/solutions/07_diameter_of_binary_tree.js |
| 08 | Path Sum | Easy | top-down remaining sum | 03_Problems/solutions/08_path_sum.js |
| 09 | Subtree of Another Tree | Easy | isSame at every node / serialize | 03_Problems/solutions/09_subtree_of_another_tree.js |
| 10 | Binary Tree Level Order Traversal | Medium | BFS template | 03_Problems/solutions/10_level_order_traversal.js |
| 11 | Binary Tree Zigzag Level Order Traversal | Medium | BFS, alternate direction | 03_Problems/solutions/11_zigzag_level_order.js |
| 12 | Binary Tree Right Side View | Medium | DFS right-first / BFS last | 03_Problems/solutions/12_right_side_view.js |
| 13 | Count Good Nodes in Binary Tree | Medium | top-down max so far | 03_Problems/solutions/13_count_good_nodes.js |
| 14 | Path Sum II | Medium | backtracking shared path | 03_Problems/solutions/14_path_sum_ii.js |
| 15 | Flatten Binary Tree to Linked List | Medium | in-place rewiring (Morris-style) | 03_Problems/solutions/15_flatten_binary_tree.js |
| 16 | Populating Next Right Pointers in Each Node | Medium | level links in O(1) space | 03_Problems/solutions/16_populating_next_right_pointers.js |
| 17 | Lowest Common Ancestor of a Binary Tree | Medium | bottom-up "return what you found" | 03_Problems/solutions/17_lowest_common_ancestor.js |
| 18 | Construct Binary Tree from Preorder and Inorder | Medium | divide by root, index map | 03_Problems/solutions/18_construct_from_preorder_inorder.js |
| 19 | Binary Tree Maximum Path Sum | Hard | return one arm, record two arms | 03_Problems/solutions/19_maximum_path_sum.js |
| 20 | Serialize and Deserialize Binary Tree | Hard | preorder with '#' | 03_Problems/solutions/20_serialize_deserialize.js |

---

## Practice more

Easy: Merge Two Binary Trees (617), Sum of Left Leaves (404), Average of Levels in Binary
Tree (637), Binary Tree Paths (257), Cousins in Binary Tree (993), Leaf-Similar Trees (872),
Univalued Binary Tree (965)

Medium: Path Sum III (437), Sum Root to Leaf Numbers (129), Maximum Width of Binary Tree (662),
Count Complete Tree Nodes (222), House Robber III (337), Construct Binary Tree from Inorder
and Postorder (106), Binary Tree Preorder/Inorder/Postorder Traversal iterative (144/94/145),
Delete Nodes And Return Forest (1110), Smallest String Starting From Leaf (988),
Longest Univalue Path (687), Populating Next Right Pointers II (117)

Hard: Binary Tree Cameras (968), Vertical Order Traversal of a Binary Tree (987),
Recover a Tree From Preorder Traversal (1028)
