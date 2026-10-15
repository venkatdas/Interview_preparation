# N-ary Trees & Misc Tree Techniques — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

Tree used below (LeetCode format `[1, null, 3, 2, 4, null, 5, 6]`):

```
        1
     /  |  \
    3   2   4
   / \
  5   6
```

---

**1. (Predict the output)** Preorder and postorder?

<details><summary>Answer</summary>Pre: `1 3 5 6 2 4`. Post: `5 6 3 2 4 1`.</details>

**2. (Predict the output)** Level order and max depth (in nodes)?

<details><summary>Answer</summary>`[[1], [3, 2, 4], [5, 6]]`, depth 3.</details>

**3. (Spot the bug)** Iterative preorder:

```js
const stack = [root], out = [];
while (stack.length) { const n = stack.pop(); out.push(n.val); stack.push(...n.children); }
```

<details><summary>Answer</summary>Children are pushed in order, so the LAST child is popped first: output `1 4 2 3 6 5`. Push in reverse: `for (let i = n.children.length - 1; i >= 0; i--) stack.push(n.children[i])`. (Also guard `root === null`.)</details>

**4. (Multiple choice)** Which traversal is undefined for N-ary trees?
A) preorder  B) postorder  C) inorder  D) level order

<details><summary>Answer</summary>C.</details>

**5. (Complexity)** Converting a parent array of n nodes into children lists?

<details><summary>Answer</summary>O(n) time and space.</details>

**6. (Predict the output)** Parent array `[-1, 0, 0, 1, 1]`: children lists?

<details><summary>Answer</summary>`[[1, 2], [3, 4], [], [], []]`, root 0.</details>

**7. (Spot the bug)** Max depth:

```js
function maxDepth(root) {
  if (!root) return 0;
  let best = 0;
  for (const c of root.children) best = maxDepth(c);
  return best + 1;
}
```

<details><summary>Answer</summary>`best` is overwritten by the last child, not maximized. Use `best = Math.max(best, maxDepth(c))`.</details>

**8. (Multiple choice)** Why does All Nodes Distance K need a visited set after adding parent links?
A) to sort output  B) to avoid going child → parent → child forever  C) for speed only  D) it doesn't

<details><summary>Answer</summary>B.</details>

**9. (Complexity)** Find Duplicate Subtrees with full string serialization at every node, worst case?

<details><summary>Answer</summary>O(n²) — strings can be O(n) long at each of n nodes. ID compression makes it O(n).</details>

**10. (Predict the output)** Vertical order for binary tree `[3, 9, 20, null, null, 15, 7]`?

<details><summary>Answer</summary>`[[9], [3, 15], [20], [7]]`.</details>

**11. (Multiple choice)** A connected undirected graph with n nodes is a tree iff it has:
A) n edges  B) n − 1 edges  C) no leaves  D) one node of degree 1

<details><summary>Answer</summary>B.</details>

**12. (Spot the bug)** Clone N-ary tree:

```js
function clone(root) {
  if (!root) return null;
  const copy = new Node(root.val, root.children);
  return copy;
}
```

<details><summary>Answer</summary>It shares the original children array (a shallow copy). Use `root.children.map(clone)`.</details>

---

## Mastery checklist

- [ ] I can write preorder, postorder and level order for N-ary trees, recursive and iterative.
- [ ] I can convert between parent arrays, children lists and node objects.
- [ ] I can solve Distance K by adding parent pointers and running BFS.
- [ ] I can explain and implement vertical order traversal with its tie rules.
- [ ] I can detect duplicate subtrees with serialization and explain the O(n) ID trick.
