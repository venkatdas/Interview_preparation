# 13. Tree Traversal & Tree Properties (DFS / BFS)

Nearly every binary tree problem is one traversal plus a small amount of work at each node.
Pick the traversal by asking **where the information flows**:

- **Top-down (pre-order):** the parent passes something *down* (depth so far, path sum so far, valid range for a BST).
- **Bottom-up (post-order):** each child *returns* something up (height, subtree sum, "is balanced"), and the parent combines.
- **In-order:** BST problems — it visits values in sorted order.
- **Level order (BFS):** anything "per level" — level averages, right side view, minimum depth.

**Teaches in depth:** [Binary Trees](../../../20_Trees/01_Binary_Trees/README.md), [N-ary Trees & Misc](../../../20_Trees/02_N_Ary_Trees_And_Misc/README.md), [Binary Search Trees](../../../21_Binary_Search_Trees/README.md)

---

## 1. Recognition clues

| Words in the problem | Traversal |
|---|---|
| "depth", "height", "diameter", "balanced", "max path sum" | post-order (children report up) |
| "path sum from root", "good nodes", "validate BST" | pre-order with parameters passed down |
| "level by level", "zigzag", "right side view", "minimum depth" | BFS by levels |
| "kth smallest in a BST", "sorted order", "recover BST" | in-order |
| "lowest common ancestor" | post-order: report "found p / q" upward |
| "serialize / construct from traversals" | pre-order + in-order positions |
| "distance k from a node" | convert to a graph (parent pointers), then BFS |

**Constraint hints**

- Up to 10^4 nodes in a skewed tree -> recursion depth 10^4 is near the JS stack limit. Prefer iterative versions for safety.
- "O(h) extra space" -> DFS (recursion depth h); BFS can need O(width).

## 2. When it applies (preconditions)

- The input is a tree (no cycles, each node has one parent), or a structure you can treat as a tree (nested objects, a DOM, a file system).
- The answer for a node depends only on its subtree (bottom-up) or on its ancestors (top-down).

## 3. When it does NOT apply

- **Graphs with cycles.** A tree traversal without a `visited` set loops forever on `1 -> 2 -> 1`. Use graph BFS/DFS ([14](14_graph_traversal_and_shortest_paths.md)).
- **"Distance from a node" in any direction.** Tree traversal only goes down. Example: nodes at distance 2 from a leaf need going **up** to the parent. Add parent pointers (graph), then BFS.
- **Checking BST validity with only local comparisons.** Tree `5 (left 1, right 6 (left 3, right 7))`:
  every parent-child pair looks fine (3 < 6, 7 > 6), but 3 sits in the right subtree of 5, so it is
  not a BST. A local check says "valid"; you need the bounds passed down (`isValidBST`).

## 4. The template

```js
// Post-order: height
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// BFS by levels
function levelOrder(root) {
  if (!root) return [];
  const res = [];
  let level = [root];
  while (level.length) {
    res.push(level.map((n) => n.val));
    const next = [];
    for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
    level = next;
  }
  return res;
}

// In-order, iterative
function inorderIterative(root) {
  const out = [];
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    out.push(node.val);
    node = node.right;
  }
  return out;
}

// Pre-order with bounds: validate BST
function isValidBST(root, low = -Infinity, high = Infinity) {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`maxDepth`, `levelOrder`, `inorderIterative`, `isValidBST`; builders `arrayToTree` / `TreeNode` in [templates.js](../../02_Implementations/templates.js)) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `maxDepth` on `[3, 9, 20, null, null, 15, 7]`:

| node | left returns | right returns | returns |
|---|---|---|---|
| 9 | 0 | 0 | 1 |
| 15 | 0 | 0 | 1 |
| 7 | 0 | 0 | 1 |
| 20 | 1 | 1 | 2 |
| 3 | 1 | 2 | 3 |

## 5. Variations

- **Diameter / max path sum:** return the best *one-sided* path up; update a global with the *two-sided* path at each node.
- **Balanced tree:** return height, or -1 as a "not balanced" signal to stop early.
- **LCA:** if both sides return non-null, this node is the LCA; else return the non-null side.
- **Right side view:** last node of each BFS level (or DFS right-first, record first visit per depth).
- **Kth smallest in BST:** in-order, stop at the kth visit.
- **Serialize:** pre-order with `null` markers; deserialize with an index pointer.

## 6. Common pitfalls

1. Comparing a node only with its children for BST validity (see section 3).
2. Using `queue.shift()` for BFS on big trees: O(n) per shift. Use level arrays (as above) or a head index.
3. Forgetting the `null` base case and crashing on `root.left` of `null`.
4. Mixing "return value" and "global answer" in diameter / path-sum problems. Write down what the function **returns** vs what it **records**.
5. Deep recursion on a skewed tree (a linked list in disguise) overflowing the stack around 10^4 frames.
6. Minimum depth: a node with one child is not a leaf. `1 + min(left, right)` is wrong when one side is empty.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Maximum Depth | Easy | post-order | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/01_maximum_depth.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/01_maximum_depth.js) |
| 2 | Invert Binary Tree | Easy | any traversal, swap children | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/04_invert_binary_tree.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/04_invert_binary_tree.js) |
| 3 | Diameter of Binary Tree | Easy | return height, record diameter | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/01_Easy/07_diameter_of_binary_tree.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/07_diameter_of_binary_tree.js) |
| 4 | Binary Tree Level Order Traversal | Medium | BFS by levels | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/10_level_order_traversal.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/10_level_order_traversal.js) |
| 5 | Binary Tree Right Side View | Medium | last of each level | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/12_right_side_view.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/12_right_side_view.js) |
| 6 | Count Good Nodes | Medium | pre-order with max so far | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/13_count_good_nodes.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/13_count_good_nodes.js) |
| 7 | Validate BST | Medium | bounds passed down | [statement](../../../21_Binary_Search_Trees/03_Problems/02_Medium/07_validate_bst.md) · [solution](../../../21_Binary_Search_Trees/03_Problems/solutions/07_validate_bst.js) |
| 8 | Kth Smallest in a BST | Medium | in-order | [statement](../../../21_Binary_Search_Trees/03_Problems/02_Medium/08_kth_smallest_in_bst.md) · [solution](../../../21_Binary_Search_Trees/03_Problems/solutions/08_kth_smallest_in_bst.js) |
| 9 | Lowest Common Ancestor | Medium | post-order "found" signals | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/02_Medium/17_lowest_common_ancestor.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/17_lowest_common_ancestor.js) |
| 10 | Binary Tree Maximum Path Sum | Hard | one-sided return, two-sided record | [statement](../../../20_Trees/01_Binary_Trees/03_Problems/03_Hard/19_maximum_path_sum.md) · [solution](../../../20_Trees/01_Binary_Trees/03_Problems/solutions/19_maximum_path_sum.js) |

## 8. Self-check

**Q1.** Why is in-order traversal special for BSTs?

<details><summary>Answer</summary>

Left subtree < node < right subtree, so visiting left, node, right outputs values in sorted order. Many BST problems (kth smallest, validate, recover) reduce to "walk in-order and compare with the previous value".

</details>

**Q2.** In Max Path Sum, why does the function return only `node.val + max(left, right, 0)` and not both sides?

<details><summary>Answer</summary>

A path going up to the parent can use only one branch below this node (a path cannot fork). The two-sided value `left + node + right` is recorded in the global best but never returned.

</details>

**Q3.** Space complexity of recursive DFS vs BFS on a perfect binary tree with n nodes?

<details><summary>Answer</summary>

DFS: O(h) = O(log n) for the call stack. BFS: O(width) = O(n / 2) for the last level, so O(n).

</details>

---

Previous: [12. Recursion & Backtracking](12_recursion_and_backtracking.md) · Next: [14. Graph Traversal & Shortest Paths](14_graph_traversal_and_shortest_paths.md) · [Pattern index](../../README.md)
