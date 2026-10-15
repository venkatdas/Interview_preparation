# Binary Search Trees — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is the BST property, precisely?

<details><summary>Model answer</summary>

For every node, **all** values in its left subtree are smaller and **all** values in its right subtree are larger (with a stated rule for duplicates). It is about whole subtrees, not just direct children; that is why validation needs bounds.

</details>

### 2. What are the costs of search, insert and delete?

<details><summary>Model answer</summary>

O(h), where h is the height. Balanced: O(log n). Degenerate (e.g. inserting sorted data): h = n − 1, so O(n). Self-balancing trees (AVL, red-black) guarantee O(log n).

</details>

### 3. How do you validate a BST?

<details><summary>Model answer</summary>

Pass down `(low, high)` bounds: the root is unbounded; going left sets `high = node.val`, going right sets `low = node.val`; fail if a value is outside its bounds. Or do an inorder traversal and check it is strictly increasing. Checking only parent/child pairs is wrong.

</details>

### 4. Walk through deleting a node with two children.

<details><summary>Model answer</summary>

Find the inorder successor (the leftmost node of the right subtree), copy its value into the node, then delete the successor from the right subtree. The successor has no left child, so that second delete is the easy 0- or 1-child case. The predecessor works symmetrically.

</details>

### 5. Why does inorder traversal of a BST give sorted output, and what problems use it?

<details><summary>Model answer</summary>

Inorder visits left subtree (all smaller), node, right subtree (all larger), recursively, so values come out ascending. Uses: kth smallest, validate, recover two swapped nodes, BST iterator, convert to a sorted list, two-sum on a BST with two iterators.

</details>

### 6. How do you find the LCA in a BST faster than in a general tree?

<details><summary>Model answer</summary>

Walk from the root: if both p and q are smaller, go left; if both are larger, go right; otherwise the current node is where they split, which is the LCA. O(h) time, O(1) space, no full traversal needed.

</details>

### 7. How does an AVL tree stay balanced?

<details><summary>Model answer</summary>

Each node stores its height; the balance factor (left height − right height) must be in {−1, 0, 1}. After an insert or delete, walk back up updating heights and fix any node with |balance| = 2 using one of four cases: LL (right rotation), RR (left rotation), LR (left then right), RL (right then left). Height stays ≤ ~1.44 log₂ n.

</details>

### 8. Build a height-balanced BST from a sorted array — how and why does it work?

<details><summary>Model answer</summary>

Pick the middle element as the root, recursively build the left half as the left subtree and the right half as the right subtree. Both halves differ in size by at most one, so the heights differ by at most one. O(n) with index ranges.

</details>

### 9. How do you find the inorder successor of a node?

<details><summary>Model answer</summary>

If the node has a right child: the leftmost node in the right subtree. Otherwise, walk from the root: whenever you go left from a node, that node is a candidate (it is larger); the last candidate is the successor. O(h).

</details>

### 10. Recover a BST where two nodes were swapped: what's the trick?

<details><summary>Model answer</summary>

In the inorder sequence, a swap creates one or two "drops" (prev > curr). The first wrong node is `prev` at the first drop; the second is `curr` at the last drop. Swap their values back. O(n) time, O(h) space (O(1) with Morris traversal).

</details>

### 11. When would you prefer a hash map over a BST, and vice versa?

<details><summary>Model answer</summary>

Hash map: O(1) average lookup by exact key, no order. BST (balanced): O(log n) but keeps order, so you get min/max, floor/ceiling, range queries, kth element and sorted iteration. JS has no built-in sorted map, so in interviews you either implement one, use a sorted array with binary search, or ask.

</details>

### 12. How do you handle duplicates in a BST?

<details><summary>Model answer</summary>

Pick a rule and state it: ignore duplicates (set semantics), keep a count per node (multiset), or always send equal keys to one side (e.g. right). The validation bounds must match the rule (strict vs non-strict).

</details>

### 13. Trim a BST to [low, high]: why is it O(n) and recursive-friendly?

<details><summary>Model answer</summary>

If `node.val < low`, the whole left subtree is also too small, so return `trim(node.right)`. If `node.val > high`, return `trim(node.left)`. Otherwise trim both children and keep the node. The BST order lets you discard whole subtrees at once.

</details>
