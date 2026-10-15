# Trees

A **tree** is a set of nodes connected by edges where every node (except one, the **root**)
has exactly one **parent**, and there are no cycles. Think of a family tree, a folder
structure on your laptop, or the HTML DOM: `<html>` is the root, `<body>` is one of its
children, and every element has exactly one parent. A tree is just a **linked list that can
branch**: each node points to several "next" nodes instead of one.

This folder is big, so it is split into sub-folders. Start here, then study them in order.

---

## Terminology (learn these words, interviewers use them)

```
                 (1)          <- root: the only node with no parent
                /   \
              (2)   (3)       <- 2 and 3 are children of 1, siblings of each other
             /  \     \
           (4)  (5)   (6)     <- 4, 5, 6 are leaves: nodes with no children
```

| Term | Meaning | In the picture |
|------|---------|----------------|
| root | the top node, no parent | 1 |
| leaf | a node with no children | 4, 5, 6 |
| edge | a link parent -> child | 1-2, 1-3, 2-4, ... |
| subtree | a node plus everything below it | subtree of 2 = {2, 4, 5} |
| depth of node | number of edges from the root down to it | depth(1)=0, depth(4)=2 |
| height of node | number of edges on the longest path from it down to a leaf | height(1)=2, height(4)=0 |
| height of tree | height of the root | 2 |
| level | all nodes at the same depth | level 1 = {2, 3} |
| binary tree | every node has at most 2 children (left, right) | the picture |
| full | every node has 0 or 2 children | not full (3 has one child) |
| complete | every level is full except maybe the last, which is filled left to right | not complete (6 is not left-filled) |
| perfect | all internal nodes have 2 children and all leaves are at the same depth | no |
| balanced | for every node, left height and right height differ by at most 1 | yes |
| degenerate | every node has one child: it is really a linked list | no |

Why balanced matters: a tree with n nodes has height about `log2(n)` if balanced, but height
`n - 1` if degenerate. Almost every tree algorithm costs "height" per step, so a balanced
tree gives O(log n) and a degenerate one gives O(n).

Depth vs height: depth is measured **from the root**, height is measured **to the leaves**.
Some problems (LeetCode "Maximum Depth") count nodes instead of edges, so a single node has
depth 1. Always ask which convention is used.

---

## Why it matters / when to use

Signals in a problem statement that mean "tree":

- The input literally is a `TreeNode` / `root` (most LeetCode tree questions)
- Hierarchical data: folders, org charts, HTML/React component trees, JSON
- "Sorted" plus "insert/delete/search fast" -> binary search tree (sub-folder 02)
- "Prefix", "autocomplete" -> trie (folder 22_Tries)
- "k-th smallest", "running median" -> heap, a tree stored in an array (folder 14)
- Recursion feels natural: the problem on a tree = the same problem on the left and right subtrees

---

## How to read a tree problem

1. **Draw it.** Always draw a 5-7 node example before writing code.
2. **Ask: what does the answer for a node depend on?** Usually: something about its left
   subtree, something about its right subtree, and the node itself. That is your recursion.
3. **Decide the direction of information flow:**
   - **Top-down**: pass information from parent to child as arguments
     (e.g. "current depth", "sum so far", "min/max allowed value").
   - **Bottom-up**: children return information to the parent
     (e.g. "height of this subtree", "is this subtree balanced").
   - Many problems use both: pass something down, return something up.
4. **Base case** is almost always `if (node === null) return <something simple>`.
5. **Decide what to return vs what to record in an outer variable.** The classic trick for
   Diameter and Max Path Sum: the function *returns* one thing (height / best single path)
   but *updates* a shared variable with another (best answer seen anywhere).

---

## The "recursive leap of faith"

This is the single most important idea for trees. When you write

```js
function height(node) {
  if (node === null) return -1;              // base case: empty tree has height -1
  return 1 + Math.max(height(node.left), height(node.right));
}
```

do **not** try to trace the whole recursion in your head. Instead, *trust* that
`height(node.left)` already gives the right answer for the left subtree (as if a colleague
wrote it), and only ask: "given correct answers for my children, what is my answer?"
Here: one more than the taller child. That is it.

You trust the function on **smaller inputs** (the subtrees), you handle **one node**, and
you write the **base case**. Every tree recursion is these three pieces.

Drawing the recursion (height of the tree in the picture above):

```
height(1)
  height(2)
    height(4) -> left null (-1), right null (-1) -> 0
    height(5) -> 0
    -> 1 + max(0, 0) = 1
  height(3)
    height(null) -> -1
    height(6) -> 0
    -> 1 + max(-1, 0) = 1
  -> 1 + max(1, 1) = 2
```

---

## Operations & complexity (binary tree with n nodes, height h)

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| traverse all nodes (any order) | O(n) | O(h) recursion stack, O(w) for BFS queue (w = max width) | every node visited once |
| height / size / count leaves | O(n) | O(h) | bottom-up recursion |
| search in a plain binary tree | O(n) | O(h) | no ordering -> must look everywhere |
| search / insert / delete in a BST | O(h) | O(h) or O(1) iterative | O(log n) balanced, O(n) degenerate |
| build from array (level order) | O(n) | O(n) | see `tree-node.js` |

The recursion stack is **real memory**. A degenerate tree of 10^5 nodes can overflow the
JS call stack (about 10^4 frames). If the interviewer mentions "very deep trees", offer an
iterative version with an explicit stack.

---

## JavaScript implementation

Every problem in this folder uses `tree-node.js` at the root of `20_Trees/`:

```js
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}
buildTree([1, 2, 3, null, 4])   // LeetCode-style array -> tree
toLevelOrderArray(root)         // tree -> array (for asserts)
```

Problems import it with `require('../../tree-node')` (two levels up from `problems/`
inside a sub-folder).

---

## Study order

| Order | Sub-folder | What you learn | Time to spend |
|-------|-----------|----------------|---------------|
| 1 | `20_Trees/01_Binary_Trees/` | traversals (DFS x3, BFS), height, recursion patterns, the big classics (LCA, build from traversals, max path sum, serialize) | 60% |
| 2 | `21_Binary_Search_Trees/` | the BST property, search/insert/delete, validation, balanced trees (AVL) | 25% |
| 3 | `20_Trees/02_N_Ary_Trees_And_Misc/` | N-ary trees, parent pointers, graph-view of a tree, vertical order | 15% |

Then move on to `19_Heaps_And_Priority_Queues/` (a tree in an array), `22_Tries/` (a tree of
characters) and `23_Graphs/` (a tree is a connected graph without cycles, so all of DFS/BFS
carries over).

---

## Patterns / variations (quick index; details in the sub-folder READMEs)

1. **DFS recursion, bottom-up** - height, balanced, diameter, max path sum, subtree checks
2. **DFS recursion, top-down** - path sum, count good nodes, validate BST with bounds
3. **BFS with a queue, level by level** - level order, zigzag, right side view, min depth
4. **Iterative DFS with an explicit stack** - inorder iterator, when recursion depth is risky
5. **Build from traversals** - preorder + inorder with a hash map of inorder indices
6. **Serialize / deserialize** - preorder with `#` for null
7. **Tree as a graph** - add parent pointers, then BFS (All Nodes Distance K)
8. **Inorder of a BST is sorted** - kth smallest, validate, two-sum in BST

---

## Common mistakes & edge cases

- Forgetting the `null` base case (crashes on `node.left` of null).
- Mixing up "depth in nodes" vs "depth in edges" (off-by-one). Say which one you use.
- Returning the wrong thing from the recursion: the Diameter function must return *height*,
  not diameter. Use an outer variable for the global answer.
- Using `queue.shift()` on huge inputs: it is O(n) in JS. For interviews it is accepted;
  mention that a head index or a real queue makes it O(1).
- Validating a BST by only comparing each node with its parent (see 02 README).
- Skewed tree: recursion depth = n. Mention it.
- Empty tree, single node, all nodes equal, negative values (matters for path sums).

---

## Interview tips

- Draw the tree, then say the recursion in one sentence: "the answer for a node is
  f(answer for left, answer for right, node)".
- State base case, recursive case, and what you return vs record.
- State complexity as O(n) time and O(h) space, and say h is log n balanced, n worst case.
- If asked to avoid recursion, convert to an explicit stack (preorder is easiest) or BFS.
- Know the LeetCode array format by heart: `[1, 2, 3, null, 4]`.

---

## Problems in this folder

The problems live inside the sub-folders. See each sub-folder README for its table:

| Sub-folder | Problems | Highlights |
|-----------|----------|-----------|
| `20_Trees/01_Binary_Trees/problems/` | 20 | Max Depth, Invert, Diameter, Level Order, LCA, Build from Pre+In, Max Path Sum, Serialize |
| `21_Binary_Search_Trees/problems/` | 12 | Validate BST, Delete Node, Kth Smallest, Sorted Array to BST, Recover BST |
| `20_Trees/02_N_Ary_Trees_And_Misc/problems/` | 7 | N-ary traversals, Clone, Duplicate Subtrees, Distance K, Vertical Order |

---

## Practice more

Easy: Merge Two Binary Trees (617), Sum of Left Leaves (404), Average of Levels (637),
Cousins in Binary Tree (993), Leaf-Similar Trees (872), Increasing Order Search Tree (897)

Medium: Count Complete Tree Nodes (222), Binary Tree Vertical Order Traversal (314),
Path Sum III (437), House Robber III (337), Delete Nodes And Return Forest (1110),
Maximum Width of Binary Tree (662), Binary Tree Cameras (968), Sum Root to Leaf Numbers (129),
Boundary of Binary Tree (545), Construct Binary Tree from Inorder and Postorder (106)

Hard: Binary Tree Postorder Traversal iteratively (145), Vertical Order Traversal (987),
Serialize and Deserialize N-ary Tree (428), Count of Smaller Numbers After Self (315, BIT/BST)
