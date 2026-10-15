/**
 * Interview templates: snippets to MEMORIZE and type from scratch in an interview.
 *
 * Each snippet has:
 *   - a 1-2 line comment: when to use it
 *   - a tiny assert so you can trust it (run: node templates.js)
 *
 * Contents
 *   1.  MinHeap (compact)              11. Dijkstra
 *   2.  UnionFind                      12. Backtracking skeleton (subsets)
 *   3.  Trie                           13. Sliding window skeleton
 *   4.  Binary search: lowerBound /    14. Monotonic stack skeleton
 *       upperBound / binarySearchOnAnswer   15. Prefix sum
 *   5.  BFS on a grid                  16. LRU cache with Map
 *   6.  DFS on a grid                  17. ListNode / TreeNode builders
 *   7.  BFS on an adjacency list       18. memoize helper
 *   8.  DFS on an adjacency list       19. gcd / lcm
 *   9.  Topological sort (Kahn)        20. fast power (modular)
 *   10. Two pointers / fast-slow / reverse list
 *
 * No packages. CommonJS. Node 18+.
 */

const assert = require('assert');

// =====================================================================
// 1. MinHeap
// When: top-K, k-way merge, Dijkstra, "smallest so far" from a stream.
// JS has no built-in heap. For a max-heap, pass (a, b) => b - a.
// =====================================================================
class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.heap = [];
    this.compare = compare;
  }
  size() { return this.heap.length; }
  peek() { return this.heap[0]; }

  push(value) {
    this.heap.push(value);
    // bubble up: swap with parent while smaller than parent
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.heap[i], this.heap[parent]) >= 0) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  pop() {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      // sink down: swap with the smaller child while larger than it
      let i = 0;
      const n = this.heap.length;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
        if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
    return top;
  }
}

{
  const heap = new MinHeap();
  [5, 3, 8, 1, 9, 2].forEach((x) => heap.push(x));
  const out = [];
  while (heap.size()) out.push(heap.pop());
  assert.deepStrictEqual(out, [1, 2, 3, 5, 8, 9]);

  const maxHeap = new MinHeap((a, b) => b[0] - a[0]); // compare by first field
  maxHeap.push([2, 'b']); maxHeap.push([7, 'g']); maxHeap.push([4, 'd']);
  assert.deepStrictEqual(maxHeap.pop(), [7, 'g']);
}

// =====================================================================
// 2. UnionFind (Disjoint Set Union)
// When: connected components, "are x and y connected", redundant edge, Kruskal MST.
// =====================================================================
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n; // number of components
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]); // path compression
    return this.parent[x];
  }
  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false; // already connected (a cycle if this was a new edge)
    if (this.rank[rootA] < this.rank[rootB]) [rootA, rootB] = [rootB, rootA];
    this.parent[rootB] = rootA;
    if (this.rank[rootA] === this.rank[rootB]) this.rank[rootA]++;
    this.count--;
    return true;
  }
  connected(a, b) { return this.find(a) === this.find(b); }
}

{
  const uf = new UnionFind(5);
  assert.strictEqual(uf.union(0, 1), true);
  assert.strictEqual(uf.union(1, 2), true);
  assert.strictEqual(uf.union(0, 2), false); // redundant edge
  assert.strictEqual(uf.connected(0, 2), true);
  assert.strictEqual(uf.connected(0, 3), false);
  assert.strictEqual(uf.count, 3); // {0,1,2} {3} {4}
}

// =====================================================================
// 3. Trie (prefix tree)
// When: prefix queries, autocomplete, "search words with wildcard", Word Search II.
// =====================================================================
class Trie {
  constructor() { this.root = { children: {}, isEnd: false }; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  _walk(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children[ch];
      if (!node) return null;
    }
    return node;
  }
  search(word) { const node = this._walk(word); return node !== null && node.isEnd; }
  startsWith(prefix) { return this._walk(prefix) !== null; }
}

{
  const trie = new Trie();
  trie.insert('apple');
  assert.strictEqual(trie.search('apple'), true);
  assert.strictEqual(trie.search('app'), false);
  assert.strictEqual(trie.startsWith('app'), true);
  assert.strictEqual(trie.startsWith('b'), false);
}

// =====================================================================
// 4. Binary search
// When: sorted array; "first index where condition becomes true"; "minimum X such that".
// lowerBound = first index with arr[i] >= target; upperBound = first index with arr[i] > target.
// =====================================================================
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length; // answer can be arr.length (insert at end)
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (arr[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function upperBound(arr, target) {
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (arr[mid] <= target) left = mid + 1;
    else right = mid;
  }
  return left;
}

// "Binary search on the answer": canDo(x) is false...false true...true; find the first true in [low, high].
function binarySearchOnAnswer(low, high, canDo) {
  while (low < high) {
    const mid = low + ((high - low) >> 1);
    if (canDo(mid)) high = mid;
    else low = mid + 1;
  }
  return low;
}

{
  const arr = [1, 2, 2, 2, 5, 7];
  assert.strictEqual(binarySearch(arr, 5), 4);
  assert.strictEqual(binarySearch(arr, 6), -1);
  assert.strictEqual(lowerBound(arr, 2), 1);
  assert.strictEqual(upperBound(arr, 2), 4);
  assert.strictEqual(lowerBound(arr, 100), 6);
  // Koko-style: smallest speed k such that total hours <= 8 for piles [3,6,7,11]
  const piles = [3, 6, 7, 11];
  const hours = (k) => piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);
  assert.strictEqual(binarySearchOnAnswer(1, 11, (k) => hours(k) <= 8), 4);
}

// =====================================================================
// 5. BFS on a grid
// When: shortest path in a grid with unit steps, "minimum moves", multi-source spread (rotting oranges).
// =====================================================================
const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function bfsGrid(grid, startRow, startCol) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  const queue = [[startRow, startCol]];
  let head = 0; // index pointer instead of shift() to keep O(1) dequeue
  dist[startRow][startCol] = 0;
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue; // out of bounds
      if (grid[nr][nc] === 1 || dist[nr][nc] !== -1) continue;    // wall or visited
      dist[nr][nc] = dist[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
  return dist;
}

{
  const grid = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  const dist = bfsGrid(grid, 0, 0);
  assert.strictEqual(dist[2][0], 6); // around the wall
  assert.strictEqual(dist[1][0], -1); // wall
}

// =====================================================================
// 6. DFS on a grid (flood fill / count islands)
// When: connected regions, "number of islands", "max area".
// =====================================================================
function countIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== 1 || seen[r][c]) return;
    seen[r][c] = true;
    for (const [dr, dc] of DIRECTIONS) dfs(r + dr, c + dc);
  }

  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !seen[r][c]) {
        islands++;
        dfs(r, c);
      }
    }
  }
  return islands;
}

{
  assert.strictEqual(countIslands([
    [1, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 0],
  ]), 3);
}

// =====================================================================
// 7. BFS on an adjacency list
// When: shortest path (unweighted), levels, "minimum steps" between nodes.
// graph: Map or array of neighbor lists.
// =====================================================================
function bfsGraph(graph, start) {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    for (const next of graph.get(node) || []) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

function buildAdjList(n, edges, directed = false) {
  const graph = new Map();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [a, b] of edges) {
    graph.get(a).push(b);
    if (!directed) graph.get(b).push(a);
  }
  return graph;
}

{
  const graph = buildAdjList(5, [[0, 1], [1, 2], [2, 3], [0, 4]]);
  const dist = bfsGraph(graph, 0);
  assert.strictEqual(dist.get(3), 3);
  assert.strictEqual(dist.get(4), 1);
}

// =====================================================================
// 8. DFS on an adjacency list (iterative, with visited set)
// When: reachability, connected components, cycle detection (with 3 colors), path finding.
// =====================================================================
function dfsGraph(graph, start) {
  const visited = new Set();
  const order = [];
  const stack = [start];
  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    for (const next of graph.get(node) || []) {
      if (!visited.has(next)) stack.push(next);
    }
  }
  return order;
}

{
  const graph = buildAdjList(4, [[0, 1], [0, 2], [2, 3]]);
  const order = dfsGraph(graph, 0);
  assert.strictEqual(order.length, 4);
  assert.strictEqual(order[0], 0);
}

// =====================================================================
// 9. Topological sort (Kahn's algorithm)
// When: prerequisites / dependency order / "can you finish all courses". Returns [] if there is a cycle.
// =====================================================================
function topoSortKahn(n, edges) { // edges: [from, to] meaning from must come before to
  const graph = buildAdjList(n, edges, true);
  const inDegree = new Array(n).fill(0);
  for (const [, to] of edges) inDegree[to]++;

  const queue = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const next of graph.get(node)) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }
  return order.length === n ? order : []; // fewer than n => cycle
}

{
  assert.deepStrictEqual(topoSortKahn(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), [0, 1, 2, 3]);
  assert.deepStrictEqual(topoSortKahn(2, [[0, 1], [1, 0]]), []); // cycle
}

// =====================================================================
// 10. Two pointers / fast-slow / in-place reversal of a linked list
// When: sorted pair sum (opposite ends), cycle or middle of list (fast-slow), reverse list.
// =====================================================================
function twoPointersOppositeEnds(sorted, target) { // indices of pair summing to target, or null
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}

function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next; // save before overwriting
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// =====================================================================
// 11. Dijkstra (non-negative weights)
// When: shortest path with weights. graph: Map node -> [[neighbor, weight], ...].
// =====================================================================
function dijkstra(graph, source) {
  const dist = new Map();
  const heap = new MinHeap((a, b) => a[0] - b[0]); // [distance, node]
  heap.push([0, source]);
  while (heap.size()) {
    const [d, node] = heap.pop();
    if (dist.has(node)) continue; // already finalized with a shorter distance
    dist.set(node, d);
    for (const [next, weight] of graph.get(node) || []) {
      if (!dist.has(next)) heap.push([d + weight, next]);
    }
  }
  return dist;
}

{
  const graph = new Map([
    [0, [[1, 4], [2, 1]]],
    [1, [[3, 1]]],
    [2, [[1, 2], [3, 5]]],
    [3, []],
  ]);
  const dist = dijkstra(graph, 0);
  assert.strictEqual(dist.get(1), 3); // 0 -> 2 -> 1
  assert.strictEqual(dist.get(3), 4); // 0 -> 2 -> 1 -> 3
}

// =====================================================================
// 12. Backtracking skeleton (subsets). Adapt: permutations use a `used` set; combination sum passes `remaining`.
// When: "return all ...": subsets, permutations, combinations, N-Queens.
// =====================================================================
function subsets(nums) {
  const result = [];
  const path = [];
  function backtrack(start) {
    result.push([...path]);            // record a COPY of the current choice
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);              // choose
      backtrack(i + 1);                // explore
      path.pop();                      // un-choose
    }
  }
  backtrack(0);
  return result;
}

{
  assert.strictEqual(subsets([1, 2, 3]).length, 8);
  assert.deepStrictEqual(subsets([]), [[]]);
}

// =====================================================================
// 13. Sliding window skeleton (variable size)
// When: longest/shortest contiguous subarray or substring satisfying a condition.
// Example: longest substring without repeating characters.
// =====================================================================
function longestUniqueSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;     // shrink: jump past the previous occurrence
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

{
  assert.strictEqual(longestUniqueSubstring('abcabcbb'), 3);
  assert.strictEqual(longestUniqueSubstring(''), 0);
  assert.strictEqual(longestUniqueSubstring('bbbb'), 1);
}

// =====================================================================
// 14. Monotonic stack skeleton (next greater element)
// When: "next greater / smaller", "days until warmer", histogram, stock span.
// =====================================================================
function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // indices with DECREASING values from bottom to top
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      result[stack.pop()] = nums[i];   // nums[i] resolves everything smaller on top
    }
    stack.push(i);
  }
  return result;
}

{
  assert.deepStrictEqual(nextGreater([2, 1, 2, 4, 3]), [4, 2, 4, -1, -1]);
}

// =====================================================================
// 15. Prefix sum
// When: many range-sum queries; "subarray sum equals k" (with a hash map of prefix counts).
// =====================================================================
function buildPrefixSum(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix; // sum of nums[i..j] = prefix[j + 1] - prefix[i]
}

function countSubarraysWithSum(nums, k) {
  const seen = new Map([[0, 1]]); // prefix sum -> how many times seen
  let running = 0;
  let count = 0;
  for (const x of nums) {
    running += x;
    count += seen.get(running - k) || 0;
    seen.set(running, (seen.get(running) || 0) + 1);
  }
  return count;
}

{
  const prefix = buildPrefixSum([1, 2, 3, 4]);
  assert.strictEqual(prefix[4] - prefix[1], 9); // 2 + 3 + 4
  assert.strictEqual(countSubarraysWithSum([1, 1, 1], 2), 2);
}

// =====================================================================
// 16. LRU cache with Map (insertion order = recency)
// When: "design a cache", bounded memoization. O(1) get/put.
// =====================================================================
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);   // re-insert to move to the "most recent" end
    this.map.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value; // first inserted = least recently used
      this.map.delete(oldestKey);
    }
  }
}

{
  const cache = new LRUCache(2);
  cache.put(1, 1); cache.put(2, 2);
  assert.strictEqual(cache.get(1), 1);
  cache.put(3, 3); // evicts 2
  assert.strictEqual(cache.get(2), -1);
  assert.strictEqual(cache.get(3), 3);
}

// =====================================================================
// 17. ListNode / TreeNode builders
// When: writing tests for linked list / tree problems quickly.
// =====================================================================
class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function arrayToList(arr) {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of arr) { tail.next = new ListNode(v); tail = tail.next; }
  return dummy.next;
}
function listToArray(head) {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
}

// LeetCode-style level order with nulls: [1, 2, 3, null, 4]
function arrayToTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}
function treeToArray(root) { // level order, trailing nulls trimmed
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) { out.push(node.val); queue.push(node.left, node.right); }
    else out.push(null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

{
  const list = arrayToList([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(listToArray(reverseList(list)), [5, 4, 3, 2, 1]);
  assert.strictEqual(middleNode(arrayToList([1, 2, 3, 4, 5])).val, 3);
  const cyclic = arrayToList([1, 2, 3]);
  cyclic.next.next.next = cyclic; // 3 -> 1
  assert.strictEqual(hasCycle(cyclic), true);
  assert.strictEqual(hasCycle(arrayToList([1, 2])), false);
  assert.deepStrictEqual(twoPointersOppositeEnds([1, 3, 4, 6, 9], 10), [0, 4]); // 1 + 9

  const tree = arrayToTree([1, 2, 3, null, 4]);
  assert.strictEqual(tree.left.right.val, 4);
  assert.deepStrictEqual(treeToArray(tree), [1, 2, 3, null, 4]);
}

// =====================================================================
// 18. memoize helper
// When: top-down DP; cache results of a pure function by its arguments.
// =====================================================================
function memoize(fn) {
  const cache = new Map();
  return function memoized(...args) {
    const key = args.join(','); // fine for numbers / short strings
    if (cache.has(key)) return cache.get(key);
    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}

{
  let calls = 0;
  const fib = memoize((n) => { calls++; return n < 2 ? n : fib(n - 1) + fib(n - 2); });
  assert.strictEqual(fib(50), 12586269025);
  assert.strictEqual(calls, 51); // each n computed once
}

// =====================================================================
// 19. gcd / lcm (Euclid)
// When: reduce fractions, "minimum steps" with cycles, LCM of periods.
// =====================================================================
function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}
function lcm(a, b) { return (a / gcd(a, b)) * b; }

{
  assert.strictEqual(gcd(48, 18), 6);
  assert.strictEqual(gcd(7, 0), 7);
  assert.strictEqual(lcm(4, 6), 12);
}

// =====================================================================
// 20. Fast power (binary exponentiation), with optional modulus
// When: x^n for large n in O(log n); counting problems "mod 1e9+7".
// =====================================================================
// With a modulus, products can reach ~1e18, past Number's safe integer range (2^53),
// so the modular path uses BigInt and converts back at the end.
function fastPower(base, exponent, mod = null) {
  if (mod !== null) return Number(fastPowerBig(BigInt(base), BigInt(exponent), BigInt(mod)));
  let result = 1;
  while (exponent > 0) {
    if (exponent & 1) result *= base; // odd exponent: take one factor of base
    base *= base;
    exponent >>= 1;                    // halve the exponent
  }
  return result;
}

function fastPowerBig(base, exponent, mod) {
  let result = 1n;
  base %= mod;
  while (exponent > 0n) {
    if (exponent & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exponent >>= 1n;
  }
  return result;
}

{
  assert.strictEqual(fastPower(2, 10), 1024);
  assert.strictEqual(fastPower(3, 0), 1);
  assert.strictEqual(fastPower(2, 100, 1_000_000_007), 976371285);
  assert.strictEqual(fastPower(5, 3, 7), 6); // 125 mod 7
}

console.log('✓ templates.js: all 20 template self-tests passed');

module.exports = {
  MinHeap, UnionFind, Trie,
  binarySearch, lowerBound, upperBound, binarySearchOnAnswer,
  DIRECTIONS, bfsGrid, countIslands, bfsGraph, dfsGraph, buildAdjList, topoSortKahn,
  twoPointersOppositeEnds, hasCycle, middleNode, reverseList,
  dijkstra, subsets, longestUniqueSubstring, nextGreater,
  buildPrefixSum, countSubarraysWithSum, LRUCache,
  ListNode, TreeNode, arrayToList, listToArray, arrayToTree, treeToArray,
  memoize, gcd, lcm, fastPower,
};
