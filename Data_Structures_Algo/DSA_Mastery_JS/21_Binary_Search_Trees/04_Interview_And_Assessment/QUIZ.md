# Binary Search Trees — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Predict the output)** Insert 50, 30, 70, 20, 40, 60, 80 into an empty BST. What is the preorder traversal?

<details><summary>Answer</summary>`50 30 20 40 70 60 80`.</details>

**2. (Complexity)** Insert 1, 2, 3, ..., n in order into a plain BST. Height and total insert time?

<details><summary>Answer</summary>Height n − 1 (a chain). Total O(n²).</details>

**3. (Spot the bug)**

```js
function isBST(node) {
  if (!node) return true;
  if (node.left && node.left.val >= node.val) return false;
  if (node.right && node.right.val <= node.val) return false;
  return isBST(node.left) && isBST(node.right);
}
```

<details><summary>Answer</summary>It only compares parents and children. Tree `5 → left 1, right 6 → left 3` passes but 3 is in 5's right subtree. Pass `(low, high)` bounds down.</details>

**4. (Multiple choice)** The inorder successor of a node with a right child is:
A) its parent  B) leftmost node of its right subtree  C) its right child  D) rightmost node of its left subtree

<details><summary>Answer</summary>B.</details>

**5. (Predict the output)** Delete 50 (the root) from the tree in question 1 using the successor. New root value and inorder?

<details><summary>Answer</summary>Root becomes `60`; inorder `20 30 40 60 70 80`.</details>

**6. (Complexity)** LCA in a balanced BST using the split-point walk?

<details><summary>Answer</summary>O(log n) time, O(1) space.</details>

**7. (Multiple choice)** An AVL node has left height 3 and right height 1, and its left child is left-heavy. Which fix?
A) left rotation  B) right rotation  C) left-right double rotation  D) none

<details><summary>Answer</summary>B — the LL case.</details>

**8. (Predict the output)** Sorted array `[-10, -3, 0, 5, 9]` → balanced BST by picking the middle (lower middle on ties). Root and level order?

<details><summary>Answer</summary>Root 0; one valid level order is `[0, -10, 5, null, -3, null, 9]` (choosing `mid = Math.floor((lo + hi) / 2)`).</details>

**9. (Spot the bug)** Kth smallest:

```js
let count = 0, ans;
function walk(n, k) { if (!n) return; walk(n.left, k); count++; if (count === k) ans = n.val; walk(n.right, k); }
```

<details><summary>Answer</summary>It works but never stops early and `count`/`ans` are globals that aren't reset between calls. Reset them per call and return as soon as `count === k` (or use an iterative inorder that stops).</details>

**10. (Complexity)** Validate BST via inorder traversal: time and space?

<details><summary>Answer</summary>O(n) time, O(h) space.</details>

**11. (Multiple choice)** Which operation can a hash map NOT do efficiently but a balanced BST can?
A) insert  B) exact lookup  C) find the smallest key greater than x  D) delete

<details><summary>Answer</summary>C (ceiling / successor queries).</details>

**12. (Spot the bug)** Insert:

```js
function insert(root, v) {
  if (!root) return new TreeNode(v);
  if (v < root.val) insert(root.left, v); else insert(root.right, v);
  return root;
}
```

<details><summary>Answer</summary>The returned child is thrown away, so new nodes are never attached. Write `root.left = insert(root.left, v)` and `root.right = insert(root.right, v)`.</details>

---

## Mastery checklist

- [ ] I can implement search, insert and delete (all three delete cases) from memory.
- [ ] I validate BSTs with bounds or inorder, never with parent/child checks only.
- [ ] I can use inorder to solve kth smallest, recover BST and BST iterator problems.
- [ ] I can explain why sorted input degrades a BST and how AVL rotations fix it.
- [ ] I can find LCA and inorder successor in O(h) using the BST order.
