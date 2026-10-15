# N-ary Trees & Misc Tree Techniques — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. How do binary-tree algorithms change for N-ary trees?

<details><summary>Model answer</summary>

Replace "left then right" with "for each child in `children`". Preorder, postorder, BFS and depth all carry over directly. Inorder has no natural meaning for N-ary trees (there's no single "middle" position).

</details>

### 2. What are common ways a tree is given without node objects?

<details><summary>Model answer</summary>

A parent array (`parent[i]` is i's parent, −1 for root), an edge list (n − 1 undirected edges), children lists (`children[i]` = list of i's children), or a level-order array with null separators (LeetCode N-ary format). Converting parent array → children lists is one O(n) pass.

</details>

### 3. How do you do an iterative preorder on an N-ary tree?

<details><summary>Model answer</summary>

Use a stack: pop a node, record it, push its children in **reverse** order so the first child is popped next. O(n) time, O(h · branching) worst-case stack space.

</details>

### 4. How do you clone an N-ary tree, and how does it differ from cloning a graph?

<details><summary>Model answer</summary>

Recursively create a new node and clone each child: O(n). Trees have no cycles or shared nodes, so no visited map is needed. Graphs (Clone Graph) need a Map from original to copy to avoid infinite loops and duplicate copies.

</details>

### 5. How would you find duplicate subtrees efficiently?

<details><summary>Model answer</summary>

Serialize each subtree in postorder (`left,right,val` with null markers) and count serializations in a Map; report a node when its count hits 2. Plain string serialization costs O(n²) total in the worst case; assigning each distinct serialization a small integer ID (`(leftId, val, rightId)` → id) brings it to O(n).

</details>

### 6. All Nodes Distance K in a binary tree: why convert to a graph?

<details><summary>Model answer</summary>

Distance k can go up through parents, but tree nodes only point down. Record each node's parent (one DFS), then BFS from the target over left, right and parent edges with a visited set, stopping at depth k. O(n).

</details>

### 7. How does vertical order traversal work, and what are the tie rules?

<details><summary>Model answer</summary>

Give each node a (column, row): root (0, 0), left child (col − 1, row + 1), right child (col + 1, row + 1). Group by column left to right; within a column order by row, and for the same row and column by value (LeetCode #987). Collect triples and sort, O(n log n).

</details>

### 8. What does "depth" vs "height" mean, and what's the convention in this folder?

<details><summary>Model answer</summary>

Depth of a node = edges from the root to it. Height of a tree = edges on the longest root-to-leaf path. LeetCode's "maximum depth" counts **nodes** (empty tree 0, single node 1). Always state which you use.

</details>

### 9. When is a "tree" really a graph?

<details><summary>Model answer</summary>

When given as an undirected edge list: there is no fixed root or direction, so you must track the parent (or a visited set) to avoid walking back. A connected graph with n nodes and n − 1 edges is a tree.

</details>

### 10. How do you compute subtree sizes for every node in one pass?

<details><summary>Model answer</summary>

Postorder: size(node) = 1 + sum of the children's sizes. Store it in an array indexed by node id. O(n). This is the base for rerooting techniques (sum of distances in a tree).

</details>

### 11. What is the "rerooting" idea at a high level?

<details><summary>Model answer</summary>

First compute an answer for one root with a postorder DFS. Then move the root to each child with a formula that updates the answer in O(1) using subtree sizes (e.g. sum of distances: `ans[child] = ans[parent] - size[child] + (n - size[child])`). Total O(n) instead of O(n²).

</details>

### 12. What edge cases matter for N-ary tree problems?

<details><summary>Model answer</summary>

Null root, a single node with an empty children array, very wide nodes (thousands of children: BFS queue memory), very deep chains (recursion depth in JS), and the serialization format's trailing nulls.

</details>
