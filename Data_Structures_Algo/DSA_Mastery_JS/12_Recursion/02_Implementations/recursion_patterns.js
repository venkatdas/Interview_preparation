/**
 * Recursion patterns in JavaScript.
 *
 * The absolute basics (factorial, naive fib, Hanoi, binary strings) live in
 * ../../13_Backtracking/02_Implementations/recursion_basics.js. This file is about
 * HOW to decompose problems recursively. One small helper per pattern:
 *
 *  1. Decomposition "first + rest"      sumList, maxOfArray
 *  2. Multiple recursion                countBinaryTreeShapes (Catalan), gridPathsNaive
 *  3. Recursion on arrays / strings     reverseRange, binarySearchRec, isPalindromeStr
 *  4. Recursion on linked lists         ListNode, listFromArray, listToArray, listLength, reverseListRec
 *  5. Recursion on trees                TreeNode, treeFromLevelOrder, treeHeight, treeSum, mirrorTree
 *  6. Divide and conquer flavour        rangeMax, fastPow
 *  7. Memoization (bridge to DP)        memoize, gridPathsMemo
 *  8. Recursion vs iteration            sumIterative, inorderRecursive, inorderIterative, trampoline
 *  9. Mutual recursion                  isEven / isOdd, evaluateArithmetic (expr/term/factor)
 * 10. Accumulators and helpers          sumWithAccumulator, collectLeaves
 * 11. Generating structures             allTreeShapes, allParenthesizations
 *
 * Every function states its PROMISE. Trust the promise on the smaller input,
 * do one step of work, and the whole function is correct (the "leap of faith").
 */

// ---------- 1. decomposition: "first + rest" ----------

// promise: sum of arr[i..end]
function sumList(arr, i = 0) {
  if (!Array.isArray(arr)) throw new TypeError('sumList expects an array');
  if (i >= arr.length) return 0;          // empty suffix sums to 0
  return arr[i] + sumList(arr, i + 1);     // first + (sum of rest)
}

// promise: largest value in arr[i..end]; -Infinity for an empty suffix
function maxOfArray(arr, i = 0) {
  if (i >= arr.length) return -Infinity;
  return Math.max(arr[i], maxOfArray(arr, i + 1));
}

// ---------- 2. multiple recursion ----------

// promise: number of structurally different binary trees with n nodes.
// Pick how many nodes go left (k); the right gets n-1-k. Two recursive calls per choice.
// Without memo this is exponential; we memo it because the subproblems overlap.
function countBinaryTreeShapes(n, memo = new Map()) {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  let total = 0;
  for (let k = 0; k < n; k++) {
    total += countBinaryTreeShapes(k, memo) * countBinaryTreeShapes(n - 1 - k, memo);
  }
  memo.set(n, total);
  return total;
}

// promise: number of right/down paths from (0,0) to (r,c). Naive: O(2^(r+c)).
function gridPathsNaive(r, c) {
  if (r === 0 || c === 0) return 1;       // a single straight line
  return gridPathsNaive(r - 1, c) + gridPathsNaive(r, c - 1);
}

// ---------- 3. recursion on arrays / strings (use indices, not slices) ----------

// promise: reverses arr[lo..hi] in place
function reverseRange(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
  return reverseRange(arr, lo + 1, hi - 1);
}

// promise: index of target in sorted arr[lo..hi], or -1
function binarySearchRec(arr, target, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -1;
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] === target) return mid;
  return arr[mid] < target
    ? binarySearchRec(arr, target, mid + 1, hi)
    : binarySearchRec(arr, target, lo, mid - 1);
}

// promise: true if s[lo..hi] reads the same both ways
function isPalindromeStr(s, lo = 0, hi = s.length - 1) {
  if (lo >= hi) return true;
  return s[lo] === s[hi] && isPalindromeStr(s, lo + 1, hi - 1);
}

// ---------- 4. recursion on linked lists ----------

class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
function listFromArray(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head);
  return head;
}
function listToArray(head) {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
}
// promise: number of nodes from head onwards
function listLength(head) {
  return head === null ? 0 : 1 + listLength(head.next);
}
// promise: reverses the list starting at head and returns the new head
function reverseListRec(head) {
  if (head === null || head.next === null) return head;
  const newHead = reverseListRec(head.next); // rest is reversed; head.next is now its tail
  head.next.next = head;                     // hook head after that tail
  head.next = null;
  return newHead;
}

// ---------- 5. recursion on trees ----------

class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}
// builds a tree from LeetCode-style level order, e.g. [1, 2, 3, null, 4]
function treeFromLevelOrder(values) {
  if (!values.length || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1, head = 0;
  while (i < values.length && head < queue.length) { // stop if no parent is left
    const node = queue[head++];
    if (i < values.length && values[i] !== null) queue.push(node.left = new TreeNode(values[i]));
    i++;
    if (i < values.length && values[i] !== null) queue.push(node.right = new TreeNode(values[i]));
    i++;
  }
  return root;
}
// serialize to level order with trailing nulls trimmed (handy for comparing trees)
function treeToLevelOrder(root) {
  const out = [];
  const queue = [root];
  for (let h = 0; h < queue.length; h++) {
    const node = queue[h];
    if (node === null) { out.push(null); continue; }
    out.push(node.val);
    queue.push(node.left, node.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
// promise: number of nodes on the longest root-to-leaf path (0 for empty)
function treeHeight(root) {
  if (!root) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}
function treeSum(root) {
  if (!root) return 0;
  return root.val + treeSum(root.left) + treeSum(root.right);
}
// promise: returns a NEW mirrored copy (input untouched)
function mirrorTree(root) {
  if (!root) return null;
  return new TreeNode(root.val, mirrorTree(root.right), mirrorTree(root.left));
}

// ---------- 6. divide and conquer flavour ----------

// promise: max of arr[lo..hi] by splitting in half. Depth O(log n) instead of O(n).
function rangeMax(arr, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -Infinity;
  if (lo === hi) return arr[lo];
  const mid = (lo + hi) >> 1;
  return Math.max(rangeMax(arr, lo, mid), rangeMax(arr, mid + 1, hi));
}

// promise: base^exp (optionally mod m) in O(log exp) using BigInt-safe math when mod given
function fastPow(base, exp, mod) {
  if (exp < 0) {
    if (mod !== undefined) throw new RangeError('negative exponent with modulus');
    return 1 / fastPow(base, -exp);
  }
  if (mod !== undefined) {
    const b = BigInt(base) % BigInt(mod), m = BigInt(mod);
    const rec = (e) => {
      if (e === 0n) return 1n % m;
      const half = rec(e / 2n);           // ONE recursive call, reused twice
      const sq = (half * half) % m;
      return e % 2n === 0n ? sq : (sq * b) % m;
    };
    return Number(rec(BigInt(exp)));
  }
  if (exp === 0) return 1;
  const half = fastPow(base, Math.floor(exp / 2));
  return exp % 2 === 0 ? half * half : half * half * base;
}

// ---------- 7. memoization: the bridge to DP ----------

// wraps a recursive function so each distinct argument list is computed once.
// IMPORTANT: the recursive calls must go through the memoized wrapper, which is
// why the function receives `self` as its first argument.
function memoize(fn, keyFn = (...args) => args.join(',')) {
  const cache = new Map();
  const wrapped = (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const value = fn(wrapped, ...args);
    cache.set(key, value);
    return value;
  };
  wrapped.cache = cache;
  return wrapped;
}

const gridPathsMemo = memoize((self, r, c) => (r === 0 || c === 0 ? 1 : self(r - 1, c) + self(r, c - 1)));

// ---------- 8. recursion vs iteration ----------

function sumIterative(arr) {
  let s = 0;
  for (const x of arr) s += x;
  return s;
}
function inorderRecursive(root, out = []) {
  if (!root) return out;
  inorderRecursive(root.left, out);
  out.push(root.val);
  inorderRecursive(root.right, out);
  return out;
}
// same order, explicit stack instead of the call stack (no stack-overflow risk)
function inorderIterative(root) {
  const out = [], stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) { stack.push(cur); cur = cur.left; }
    cur = stack.pop();
    out.push(cur.val);
    cur = cur.right;
  }
  return out;
}
// trampoline: a tail-recursive function returns a THUNK instead of calling itself.
// The loop keeps calling thunks, so the stack never grows. JS engines do not do
// tail-call optimisation (except Safari), so this is how you go "deep" safely.
function trampoline(fn) {
  return (...args) => {
    let result = fn(...args);
    while (typeof result === 'function') result = result();
    return result;
  };
}
const sumToN = trampoline(function step(n, acc = 0) {
  return n === 0 ? acc : () => step(n - 1, acc + n);
});

// ---------- 9. mutual recursion ----------

function isEven(n) { return n === 0 ? true : isOdd(n - 1); }
function isOdd(n) { return n === 0 ? false : isEven(n - 1); }

// grammar (each rule = one function, they call each other):
//   expr   := term   (('+' | '-') term)*
//   term   := factor (('*' | '/') factor)*
//   factor := number | '-' factor | '(' expr ')'
// Division truncates toward zero.
function evaluateArithmetic(input) {
  const s = input.replace(/\s+/g, '');
  let pos = 0;
  function expr() {
    let value = term();
    while (s[pos] === '+' || s[pos] === '-') {
      const op = s[pos++];
      const rhs = term();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }
  function term() {
    let value = factor();
    while (s[pos] === '*' || s[pos] === '/') {
      const op = s[pos++];
      const rhs = factor();
      value = op === '*' ? value * rhs : Math.trunc(value / rhs);
    }
    return value;
  }
  function factor() {
    if (s[pos] === '-') { pos++; return -factor(); }
    if (s[pos] === '(') {
      pos++;                       // skip '('
      const value = expr();        // mutual recursion back to the top rule
      if (s[pos] !== ')') throw new SyntaxError(`expected ) at ${pos}`);
      pos++;
      return value;
    }
    const start = pos;
    while (pos < s.length && s[pos] >= '0' && s[pos] <= '9') pos++;
    if (start === pos) throw new SyntaxError(`expected number at ${pos}`);
    return Number(s.slice(start, pos));
  }
  const result = expr();
  if (pos !== s.length) throw new SyntaxError(`unexpected '${s[pos]}' at ${pos}`);
  return result;
}

// ---------- 10. accumulators and helpers ----------

// the public function hides the extra parameters; the helper carries the running state
function sumWithAccumulator(arr) {
  function helper(i, acc) {
    if (i === arr.length) return acc;   // answer is already complete
    return helper(i + 1, acc + arr[i]); // tail call: nothing left to do after it
  }
  return helper(0, 0);
}
// collects leaf values left to right into ONE shared output array (no concatenation cost)
function collectLeaves(root) {
  const out = [];
  (function walk(node) {
    if (!node) return;
    if (!node.left && !node.right) { out.push(node.val); return; }
    walk(node.left);
    walk(node.right);
  })(root);
  return out;
}

// ---------- 11. generating structures ----------

// promise: every distinct binary tree shape with n nodes (values are all 0).
// Root + every (left shape, right shape) pair. Count = Catalan(n).
function allTreeShapes(n) {
  if (n === 0) return [null];
  const result = [];
  for (let leftSize = 0; leftSize < n; leftSize++) {
    for (const L of allTreeShapes(leftSize)) {
      for (const R of allTreeShapes(n - 1 - leftSize)) result.push(new TreeNode(0, L, R));
    }
  }
  return result;
}
// promise: every full parenthesization of the operand list, e.g. ['a','b','c'] ->
// ['(a(bc))', '((ab)c)']. Split at every gap: left part x right part.
function allParenthesizations(items) {
  if (items.length === 1) return [items[0]];
  const out = [];
  for (let k = 1; k < items.length; k++) {
    for (const L of allParenthesizations(items.slice(0, k))) {
      for (const R of allParenthesizations(items.slice(k))) out.push(`(${L}${R})`);
    }
  }
  return out;
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // seeded PRNG so random checks are reproducible
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(12);

  assert.strictEqual(sumList([1, 2, 3, 4]), 10);
  assert.strictEqual(sumList([]), 0);
  assert.strictEqual(maxOfArray([3, -1, 9, 2]), 9);
  assert.strictEqual(maxOfArray([]), -Infinity);

  assert.deepStrictEqual([0, 1, 2, 3, 4, 5].map((n) => countBinaryTreeShapes(n)), [1, 1, 2, 5, 14, 42]);
  assert.strictEqual(gridPathsNaive(2, 2), 6);
  assert.strictEqual(gridPathsMemo(16, 16), 601080390);

  assert.deepStrictEqual(reverseRange([1, 2, 3, 4]), [4, 3, 2, 1]);
  assert.strictEqual(binarySearchRec([1, 3, 5, 7, 9], 7), 3);
  assert.strictEqual(binarySearchRec([1, 3, 5], 4), -1);
  assert.strictEqual(isPalindromeStr('racecar'), true);
  assert.strictEqual(isPalindromeStr('ab'), false);

  assert.deepStrictEqual(listToArray(reverseListRec(listFromArray([1, 2, 3]))), [3, 2, 1]);
  assert.strictEqual(listLength(listFromArray([5, 6, 7, 8])), 4);
  assert.strictEqual(reverseListRec(null), null);

  const t = treeFromLevelOrder([1, 2, 3, null, 4]);
  assert.strictEqual(treeHeight(t), 3);
  assert.strictEqual(treeSum(t), 10);
  assert.deepStrictEqual(treeToLevelOrder(mirrorTree(t)), [1, 3, 2, null, null, 4]);
  assert.deepStrictEqual(inorderRecursive(t), [2, 4, 1, 3]);
  assert.deepStrictEqual(collectLeaves(t), [4, 3]);

  assert.strictEqual(fastPow(2, 10), 1024);
  assert.strictEqual(fastPow(2, -2), 0.25);
  assert.strictEqual(fastPow(3, 200, 1e9 + 7), (() => { let r = 1; for (let i = 0; i < 200; i++) r = (r * 3) % (1e9 + 7); return r; })());

  assert.strictEqual(sumToN(100000), 5000050000); // deep, but the trampoline keeps the stack flat
  assert.strictEqual(isEven(10), true);
  assert.strictEqual(isOdd(7), true);
  assert.strictEqual(evaluateArithmetic('2 + 3 * (4 - 1)'), 11);
  assert.strictEqual(evaluateArithmetic('-(7)/2'), -3);
  assert.throws(() => evaluateArithmetic('2 +'), SyntaxError);

  assert.strictEqual(allTreeShapes(4).length, 14);
  assert.deepStrictEqual(allParenthesizations(['a', 'b', 'c']).sort(), ['((ab)c)', '(a(bc))']);
  assert.strictEqual(allParenthesizations(['a', 'b', 'c', 'd', 'e']).length, 14);

  // randomized: recursive helpers vs iterative references
  for (let trial = 0; trial < 200; trial++) {
    const n = Math.floor(rand() * 30);
    const arr = Array.from({ length: n }, () => Math.floor(rand() * 200) - 100);
    assert.strictEqual(sumList(arr), sumIterative(arr));
    assert.strictEqual(sumWithAccumulator(arr), sumIterative(arr));
    assert.strictEqual(rangeMax(arr), n ? Math.max(...arr) : -Infinity);
    assert.deepStrictEqual(listToArray(reverseListRec(listFromArray(arr))), [...arr].reverse());
    const sorted = [...new Set(arr)].sort((a, b) => a - b);
    const target = Math.floor(rand() * 200) - 100;
    assert.strictEqual(binarySearchRec(sorted, target), sorted.indexOf(target));
    const level = arr.map((x) => (rand() < 0.2 ? null : x));
    const tree = treeFromLevelOrder(level);
    assert.deepStrictEqual(inorderRecursive(tree), inorderIterative(tree));
    const a = Math.floor(rand() * 20), b = Math.floor(rand() * 20);
    assert.strictEqual(evaluateArithmetic(`${a}*(${b}-3)+${a}`), a * (b - 3) + a);
  }

  console.log('✓ recursion_patterns.js self-test passed');
}

module.exports = {
  sumList, maxOfArray, countBinaryTreeShapes, gridPathsNaive, gridPathsMemo,
  reverseRange, binarySearchRec, isPalindromeStr,
  ListNode, listFromArray, listToArray, listLength, reverseListRec,
  TreeNode, treeFromLevelOrder, treeToLevelOrder, treeHeight, treeSum, mirrorTree,
  rangeMax, fastPow, memoize, sumIterative, inorderRecursive, inorderIterative,
  trampoline, sumToN, isEven, isOdd, evaluateArithmetic,
  sumWithAccumulator, collectLeaves, allTreeShapes, allParenthesizations,
};
