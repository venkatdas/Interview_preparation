# Binary Trees — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

Tree used in several questions (level order `[1, 2, 3, 4, 5, null, 6]`):

```
        1
      /   \
     2     3
    / \     \
   4   5     6
```

---

**1. (Predict the output)** Preorder, inorder and postorder of the tree above?

<details><summary>Answer</summary>Pre: `1 2 4 5 3 6`. In: `4 2 5 1 3 6`. Post: `4 5 2 6 3 1`.</details>

**2. (Predict the output)** Level order (as arrays per level) and right side view?

<details><summary>Answer</summary>`[[1], [2, 3], [4, 5, 6]]`; right side view `[1, 3, 6]`.</details>

**3. (Complexity)** Space used by recursive DFS on a skewed tree of n nodes?

<details><summary>Answer</summary>O(n) — the recursion depth equals the height, which is n − 1 edges.</details>

**4. (Spot the bug)** Minimum depth:

```js
function minDepth(root) {
  if (!root) return 0;
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}
```

<details><summary>Answer</summary>For a node with only one child it takes the empty side (0) and reports a depth that doesn't end at a leaf. If one child is null, return `1 + minDepth(otherChild)`.</details>

**5. (Multiple choice)** Which traversal of a BST gives sorted order?
A) preorder  B) inorder  C) postorder  D) level order

<details><summary>Answer</summary>B.</details>

**6. (Predict the output)** Diameter (in edges) of the tree above?

<details><summary>Answer</summary>`4` (path 4 → 2 → 1 → 3 → 6).</details>

**7. (Spot the bug)** Balanced check:

```js
function isBalanced(root) {
  if (!root) return true;
  return Math.abs(height(root.left) - height(root.right)) <= 1;
}
```

<details><summary>Answer</summary>It only checks the root. Every node must be balanced: also require `isBalanced(root.left) && isBalanced(root.right)` (or use the O(n) postorder −1 trick).</details>

**8. (Complexity)** The naive balanced check (calling `height` at every node) on a skewed tree?

<details><summary>Answer</summary>O(n²).</details>

**9. (Multiple choice)** Which pair of traversals uniquely determines a binary tree with distinct values?
A) preorder + postorder  B) preorder + inorder  C) only level order without nulls  D) only inorder

<details><summary>Answer</summary>B (postorder + inorder also works).</details>

**10. (Predict the output)**

```js
function f(n) { if (!n) return 0; return n.val + f(n.left) + f(n.right); }
```

What does `f` return for the tree above?

<details><summary>Answer</summary>`21` (sum of all values).</details>

**11. (Spot the bug)** Path Sum (root-to-leaf):

```js
function hasPathSum(root, target) {
  if (!root) return target === 0;
  return hasPathSum(root.left, target - root.val) || hasPathSum(root.right, target - root.val);
}
```

<details><summary>Answer</summary>It counts paths ending at a null child of a non-leaf, e.g. tree `[1, 2]` with target 1 returns true through the missing right child. Check at a leaf: `if (!root.left && !root.right) return target === root.val;` and return false for null.</details>

**12. (Multiple choice)** Max path sum for the tree `[-10, 9, 20, null, null, 15, 7]`?
A) 42  B) 34  C) 35  D) 44

<details><summary>Answer</summary>A: 15 + 20 + 7.</details>

---

## Mastery checklist

- [ ] I can write all four traversals recursively and iteratively from memory.
- [ ] I can tell top-down from bottom-up problems and choose what to return vs what to track globally.
- [ ] I can solve diameter, balanced and max path sum in O(n) with one postorder pass.
- [ ] I can implement LCA, build-from-preorder-and-inorder, and serialize/deserialize.
- [ ] I test null, single node, skewed trees and negatives every time.
