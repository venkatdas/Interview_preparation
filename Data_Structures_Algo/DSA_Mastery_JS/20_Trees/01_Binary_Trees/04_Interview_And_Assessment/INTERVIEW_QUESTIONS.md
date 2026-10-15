# Binary Trees — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. Name the four standard traversals and one use for each.

<details><summary>Model answer</summary>

Preorder (node, left, right): copy or serialize a tree, since the root comes first. Inorder (left, node, right): sorted order of a BST. Postorder (left, right, node): compute things from children first (height, delete a tree, diameter). Level order (BFS): anything per depth (right side view, min depth, zigzag).

</details>

### 2. What is the time and space complexity of a recursive traversal?

<details><summary>Model answer</summary>

O(n) time (each node visited once) and O(h) space for the call stack, where h is the height: O(log n) for a balanced tree, O(n) for a skewed one. BFS uses O(w) space, the maximum width (up to about n/2 at the last level).

</details>

### 3. Explain "top-down" vs "bottom-up" recursion on trees.

<details><summary>Model answer</summary>

Top-down passes information **down** as parameters (current depth, running sum, max so far): Path Sum, Count Good Nodes. Bottom-up returns information **up** from children (height, "is balanced", best path through a child): Max Depth, Diameter, Balanced, Max Path Sum. Many hard problems return one thing up while updating a global answer.

</details>

### 4. How do you check whether a tree is height-balanced in O(n)?

<details><summary>Model answer</summary>

Postorder: return the height of each subtree, or a sentinel like −1 if it is already unbalanced. At each node, if either child returned −1 or the heights differ by more than 1, return −1. Calling a separate `height()` at every node is O(n²) on skewed trees.

</details>

### 5. Diameter of a binary tree: what is returned and what is tracked?

<details><summary>Model answer</summary>

Each call returns the height (longest downward path) of its subtree. At each node, `leftHeight + rightHeight` is the longest path that bends at this node; keep the global maximum of that. Return `1 + max(left, right)` upward. O(n).

</details>

### 6. How does the Lowest Common Ancestor recursion work?

<details><summary>Model answer</summary>

Return the node if it is null, p or q. Recurse left and right. If both sides return non-null, the current node is the split point: the LCA. Otherwise return whichever side is non-null. O(n) time, O(h) space. It assumes both p and q exist in the tree.

</details>

### 7. How do you rebuild a tree from preorder and inorder traversals?

<details><summary>Model answer</summary>

The first preorder value is the root. Find it in inorder (use a Map from value to index for O(1)); everything left of it is the left subtree, right of it the right subtree. Recurse with index ranges, consuming preorder left to right. O(n). Needs distinct values. Preorder + postorder alone is not enough to be unique unless the tree is full.

</details>

### 8. How would you serialize and deserialize a binary tree?

<details><summary>Model answer</summary>

Preorder with a null marker, e.g. `1,2,#,#,3,#,#`. To deserialize, read tokens in order: `#` means null, otherwise make a node, then build its left and right recursively. Level order with nulls (LeetCode style) works too. Null markers are what make the structure unambiguous.

</details>

### 9. Why might you prefer iterative traversal in JavaScript?

<details><summary>Model answer</summary>

Recursion depth equals tree height. A skewed tree with 100k nodes overflows the JS call stack. An explicit stack (DFS) or queue (BFS) lives on the heap and avoids that. In interviews, recursive is fine for balanced inputs; mention the risk.

</details>

### 10. Maximum path sum: why do you clamp negative child contributions to 0?

<details><summary>Model answer</summary>

A path may stop at any node. If the best downward path from a child is negative, including it only lowers the sum, so take `max(0, childGain)`. The node's "through" value is `val + leftGain + rightGain`; the value returned up is `val + max(leftGain, rightGain)` because a path going up can use only one branch.

</details>

### 11. When do you use BFS instead of DFS on a tree?

<details><summary>Model answer</summary>

When the answer is about levels or the shallowest something: minimum depth (BFS can stop at the first leaf), right side view, level averages, zigzag, connect next pointers. DFS is better for path-based or subtree-based answers.

</details>

### 12. What edge cases do you test for tree problems?

<details><summary>Model answer</summary>

Empty tree (null), single node, left-skewed and right-skewed chains, complete/perfect tree, duplicate values, negative values (especially for path sums), and p/q being the same node or one being an ancestor of the other.

</details>

### 13. What is Morris traversal and when would you mention it?

<details><summary>Model answer</summary>

An inorder traversal with O(1) extra space: it temporarily links each node's inorder predecessor's right pointer back to the node, uses it to return, then removes the link. Mention it as a follow-up when asked for O(1) space; it modifies the tree temporarily, so it's not safe with concurrent readers.

</details>
