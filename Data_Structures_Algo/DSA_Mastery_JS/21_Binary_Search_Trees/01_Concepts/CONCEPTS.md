# Binary Search Trees

> **Prerequisites:** [Binary Trees](../../20_Trees/01_Binary_Trees/README.md) (traversals, recursion on trees), [Searching](../../10_Searching/README.md) (binary search — a BST is binary search turned into a data structure), [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md).

A **binary search tree (BST)** is a binary tree with one extra rule: for every node,
everything in its **left** subtree is **smaller** and everything in its **right** subtree
is **larger**. Think of the "guess the number" game: each node is a question
("bigger than 50?"), and the answer sends you left or right. A BST is binary search
turned into a data structure you can also insert into and delete from.

---

## Why it matters / when to use

- You need **sorted order AND fast inserts/deletes**: a sorted array has O(n) inserts,
  a hash map has no order; a balanced BST gives O(log n) for everything
- "find the next larger / previous smaller element", "floor / ceiling of a value"
- "kth smallest", "range sum", "count of values between a and b"
- The problem SAYS "BST": then the inorder traversal is sorted and you must use the
  ordering to prune (otherwise you are ignoring the hint)
- Real world: database indexes (B-trees are the disk version), `TreeMap`/`std::map`,
  interval scheduling, autocomplete ranges

---

## How it works

### The BST property

```
          8
        /   \
       3     10          left of 8: {3, 1, 6, 4, 7} all < 8
      / \      \         right of 8: {10, 14, 13} all > 8
     1   6      14       ... and the same rule holds at EVERY node
        / \    /
       4   7  13
```

Inorder traversal (left, node, right) visits: 1 3 4 6 7 8 10 13 14. **Sorted.**
That single fact solves half of the BST problems (validate, kth smallest, two-sum,
recover, successor).

### Search

Compare with the node, go left if smaller, right if bigger. Each step discards a whole
subtree, like binary search discards half the array.

```
search(7):  8 -> (7 < 8) left -> 3 -> (7 > 3) right -> 6 -> (7 > 6) right -> 7  found
```

### Insert

Search for the value; when you fall off the tree (null), attach a new leaf there.
Inserting never restructures anything, which is why inserting sorted data gives a
degenerate "linked list" tree of height n.

### Delete (the three cases)

```
Case 1: leaf                  Case 2: one child             Case 3: two children
   delete 4                      delete 10                     delete 3
      6                          8                            8
     / \                        / \                          / \
    4   7     ->   6           3   10      ->   8           3   10     ->   4   10
                    \                 \        / \         / \             / \
                     7                 14     3   14      1   6           1   6
                                                             / \               \
                                                            4   7               7
   just unlink it             child takes its place        copy inorder SUCCESSOR (4 = min of
                                                           right subtree) into the node, then
                                                           delete 4 from the right subtree
                                                           (4 has at most one child: case 1 or 2)
```

The successor is the leftmost node of the right subtree. Using the predecessor
(rightmost of the left subtree) works equally well.

### Validate: the classic bug

Wrong: check `left.val < node.val < right.val` at each node (compare with the parent only).

```
      5
     / \
    4   6        6 > 5 ok, 3 < 6 ok at node 6 ... but 3 is in the RIGHT subtree of 5
       / \       and 3 < 5. NOT a BST. The parent-only check says "valid".
      3   7
```

Right: every node must respect **all** its ancestors. Pass down an allowed range
`(low, high)`: going left sets `high = node.val`, going right sets `low = node.val`.

```js
function isValid(node, low = -Infinity, high = Infinity) {
  if (!node) return true;
  if (node.val <= low || node.val >= high) return false;
  return isValid(node.left, low, node.val) && isValid(node.right, node.val, high);
}
```

Or: inorder must be strictly increasing (keep a `prev` variable).

### Balanced BSTs (AVL rotations)

A BST is only fast if it is **balanced** (height ~ log n). Self-balancing trees fix the
shape after each insert/delete with **rotations**, which rearrange three nodes without
breaking the inorder order:

```
rotateRight(y):        y              x
                      / \            / \
                     x   C   ==>    A   y
                    / \                / \
                   A   B              B   C         inorder stays: A x B y C
```

**AVL tree**: stores a height in each node; after an insert/delete, walk back up; if a
node's left and right heights differ by more than 1, apply one of four fixes:

| Case | Shape | Fix |
|------|-------|-----|
| Left-Left | heavy on left, and the left child is left-heavy | rotateRight(node) |
| Right-Right | mirror | rotateLeft(node) |
| Left-Right | heavy on left, but the left child is right-heavy | rotateLeft(node.left), then rotateRight(node) |
| Right-Left | mirror | rotateRight(node.right), then rotateLeft(node) |

Full code with a self-check: `avl_tree.js`.

**Red-black tree** (Java `TreeMap`, C++ `std::map`, Linux scheduler): a looser balance rule
(height <= 2 log n) that needs fewer rotations per update. You will not be asked to code
one; know that it exists, what it guarantees, and why libraries prefer it.

---

## Pseudocode

```
SEARCH(root, x):
    node = root
    while node and node.val != x:
        node = (x < node.val) ? node.left : node.right
    return node

INSERT(node, x):                       # returns the (possibly new) subtree root
    if node is null: return new Node(x)
    if x < node.val: node.left  = INSERT(node.left, x)
    elif x > node.val: node.right = INSERT(node.right, x)
    return node                        # equal: ignore duplicate

DELETE(node, x):
    if node is null: return null
    if x < node.val: node.left = DELETE(node.left, x); return node
    if x > node.val: node.right = DELETE(node.right, x); return node
    if node.left is null: return node.right        # 0 or 1 child
    if node.right is null: return node.left
    s = leftmost(node.right)                       # inorder successor
    node.val = s.val
    node.right = DELETE(node.right, s.val)
    return node

VALIDATE(node, low = -inf, high = +inf):
    if node is null: return true
    if not (low < node.val < high): return false
    return VALIDATE(node.left, low, node.val) and VALIDATE(node.right, node.val, high)
```

---

## Operations & complexity

| Operation | Average (balanced) | Worst (degenerate) | Space | Note |
|-----------|--------------------|--------------------|-------|------|
| search | O(log n) | O(n) | O(1) iterative | one root-to-leaf walk |
| insert | O(log n) | O(n) | O(1) iterative | new leaf |
| delete | O(log n) | O(n) | O(h) recursive | three cases |
| min / max | O(log n) | O(n) | O(1) | leftmost / rightmost |
| successor / predecessor | O(log n) | O(n) | O(1) | walk from root, remember last turn |
| inorder (sorted output) | O(n) | O(n) | O(h) | |
| kth smallest | O(h + k) | O(n) | O(h) | iterative inorder, stop at k |
| validate | O(n) | O(n) | O(h) | must visit all nodes |
| build from sorted array (balanced) | O(n) | O(n) | O(log n) | middle = root |
| AVL insert / delete | O(log n) | O(log n) | O(log n) | guaranteed |

"Worst" happens when you insert already-sorted data into a plain BST.

---

## JavaScript implementation

Full code with tests: `bst.js` (class `BST`: insert, search, delete, min, max, inorder,
successor, height) and `avl_tree.js` (class `AVLTree` with rotations and `isBalanced()`).

```js
class BST {
  constructor() { this.root = null; }
  insert(val) {
    const node = new TreeNode(val);
    if (!this.root) { this.root = node; return this; }
    let current = this.root;
    while (true) {
      if (val === current.val) return this;                       // ignore duplicates
      const side = val < current.val ? 'left' : 'right';
      if (!current[side]) { current[side] = node; return this; }  // fell off: attach here
      current = current[side];
    }
  }
  search(val) {
    let current = this.root;
    while (current && current.val !== val) current = val < current.val ? current.left : current.right;
    return current;
  }
}
```

---

## Dry run

**Insert 50, 30, 70, 20, 40, 60, 80, then delete 30** (30 has two children):

| Step | Operation | Path taken | Tree (level order) after |
|---|---|---|---|
| 1 | insert 50 | empty → root | [50] |
| 2 | insert 30 | 50 → left | [50, 30] |
| 3 | insert 70 | 50 → right | [50, 30, 70] |
| 4 | insert 20 | 50 → 30 → left | [50, 30, 70, 20] |
| 5 | insert 40 | 50 → 30 → right | [50, 30, 70, 20, 40] |
| 6 | insert 60 | 50 → 70 → left | [50, 30, 70, 20, 40, 60] |
| 7 | insert 80 | 50 → 70 → right | [50, 30, 70, 20, 40, 60, 80] |
| 8 | delete 30 | found; successor = leftmost of right subtree = 40 | copy 40 into the node |
| 9 | delete 40 from 30's old right subtree | 40 is a leaf → removed | [50, 40, 70, 20, null, 60, 80] |

Inorder after: `20 40 50 60 70 80` — still sorted.

---

## Patterns / variations

### 1. Prune with the ordering (search, range sum, LCA, trim)

```js
function rangeSum(node, low, high) {
  if (!node) return 0;
  if (node.val < low) return rangeSum(node.right, low, high);  // skip whole left subtree
  if (node.val > high) return rangeSum(node.left, low, high);  // skip whole right subtree
  return node.val + rangeSum(node.left, low, high) + rangeSum(node.right, low, high);
}
```
Use when: a value or range is given; each comparison lets you drop a subtree.

### 2. Inorder is sorted (kth smallest, validate, two-sum, recover)

```js
function kthSmallest(root, k) {
  const stack = [];
  let current = root;
  while (current || stack.length) {
    while (current) { stack.push(current); current = current.left; }
    current = stack.pop();
    if (--k === 0) return current.val;
    current = current.right;
  }
}
```
Use when: the question is about order statistics or checking sortedness.

### 3. Bounds passed down (validate)

See "the classic bug" above.

### 4. Remember the last turn (successor / floor / ceiling)

```js
function successor(root, val) {
  let answer = null;
  for (let node = root; node; ) {
    if (val < node.val) { answer = node; node = node.left; }   // candidate, try smaller
    else node = node.right;
  }
  return answer;
}
```
Floor/ceiling are the same walk with the comparison flipped.

### 5. Middle of a sorted range = root (sorted array to BST)

```js
function build(nums, left = 0, right = nums.length - 1) {
  if (left > right) return null;
  const mid = (left + right) >> 1;
  const node = new TreeNode(nums[mid]);
  node.left = build(nums, left, mid - 1);
  node.right = build(nums, mid + 1, right);
  return node;
}
```

### 6. Recursive "return the new subtree" (insert, delete, trim)

Functions that change the tree return the (possibly new) root of the subtree and the
caller re-attaches it: `node.left = deleteNode(node.left, key)`. This handles "the root
itself was removed" with no special cases.

---

## Alternatives (brute force vs optimized)

| Need | Option | Cost | Trade-off |
|---|---|---|---|
| Exact lookup only | Hash map / Set | O(1) average | No order, no range queries |
| Ordered data, few updates | Sorted array + binary search | O(log n) search, O(n) insert | Simple and cache-friendly |
| Ordered data with updates | Plain BST | O(h): O(log n) average, O(n) worst | Degrades on sorted input |
| Guaranteed O(log n) | AVL / red-black tree | O(log n) | More code (rotations) |
| Probabilistic balance | Skip list, treap | O(log n) expected | Simpler than AVL, randomized |
| Kth smallest / rank | Inorder walk O(k + h) | Augmented BST with subtree sizes: O(h) | Extra field to maintain |

---

## Common mistakes & edge cases

- Validating with the parent-only check (see above). Always use bounds or inorder.
- Using `0` or `Number.MIN_VALUE` as the initial bounds. `Number.MIN_VALUE` is the smallest
  POSITIVE number. Use `-Infinity` / `Infinity` (or `null` and check).
- Duplicates: decide `<` vs `<=` and say it. LeetCode's Validate BST forbids duplicates.
- Delete case 3: after copying the successor's value you must delete the successor from
  the RIGHT subtree, not from the root.
- Forgetting to re-attach the result of a recursive insert/delete (`node.left = ...`).
- Assuming O(log n) without saying "if balanced". A plain BST built from sorted input is
  a linked list.
- Empty tree and single node for every operation (delete the only node -> root = null).

---

## When this does NOT apply

- **No ordering needed**: a hash map is simpler and faster.
- **Data arrives sorted and you can't balance**: a plain BST becomes a linked list; use a sorted array, AVL, or build balanced from the sorted array.
- **Prefix queries on strings**: use a [trie](../../22_Tries/README.md).
- **Only min or max needed repeatedly**: a [heap](../../19_Heaps_And_Priority_Queues/README.md) is simpler.
- **The tree in the problem is a general binary tree**: BST shortcuts (going left/right by value) are wrong there.

---

## Interview tips

- First sentence: "Inorder of a BST is sorted, so ..." or "I can discard a subtree at
  every step because ...". Show you use the property.
- Say "O(h), which is O(log n) if balanced and O(n) worst case" every single time.
- If asked how to guarantee O(log n): "a self-balancing tree such as AVL or red-black,
  which rotates after updates". Be able to draw one rotation.
- For delete, name the three cases before coding.
- For Validate BST, mention the parent-only bug yourself; interviewers love that.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Search in a Binary Search Tree | Easy | prune by ordering | 03_Problems/solutions/01_search_in_bst.js |
| 02 | Insert into a Binary Search Tree | Medium | walk down, attach leaf | 03_Problems/solutions/02_insert_into_bst.js |
| 03 | Range Sum of BST | Easy | prune by ordering | 03_Problems/solutions/03_range_sum_of_bst.js |
| 04 | Convert Sorted Array to Binary Search Tree | Easy | middle = root | 03_Problems/solutions/04_sorted_array_to_bst.js |
| 05 | Two Sum IV - Input is a BST | Easy | inorder + two pointers | 03_Problems/solutions/05_two_sum_iv_bst.js |
| 06 | Lowest Common Ancestor of a BST | Medium | split point by ordering | 03_Problems/solutions/06_lowest_common_ancestor_bst.js |
| 07 | Validate Binary Search Tree | Medium | bounds passed down | 03_Problems/solutions/07_validate_bst.js |
| 08 | Kth Smallest Element in a BST | Medium | iterative inorder, early stop | 03_Problems/solutions/08_kth_smallest_in_bst.js |
| 09 | Inorder Successor in BST | Medium | remember the last left turn | 03_Problems/solutions/09_inorder_successor_in_bst.js |
| 10 | Trim a Binary Search Tree | Medium | return the new subtree | 03_Problems/solutions/10_trim_a_bst.js |
| 11 | Delete Node in a BST | Medium | three delete cases | 03_Problems/solutions/11_delete_node_in_bst.js |
| 12 | Recover Binary Search Tree | Hard | inorder dips (Morris optional) | 03_Problems/solutions/12_recover_bst.js |

---

## Practice more

Easy: Minimum Absolute Difference in BST (530), Increasing Order Search Tree (897),
Minimum Distance Between BST Nodes (783), Find Mode in Binary Search Tree (501),
Convert BST to Greater Tree (538)

Medium: Binary Search Tree Iterator (173), Unique Binary Search Trees (96),
Unique Binary Search Trees II (95), Convert Sorted List to BST (109),
Closest Binary Search Tree Value (270), Balance a Binary Search Tree (1382),
Construct BST from Preorder Traversal (1008), Serialize and Deserialize BST (449),
Maximum Sum BST in Binary Tree (1373), Count of Smaller Numbers After Self (315)

Hard: Closest Binary Search Tree Value II (272), Binary Search Tree Iterator II (1586)
