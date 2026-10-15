/**
 * Pattern templates, part 2 — one small, copy-pasteable function per pattern lesson.
 *
 * templates.js (same folder) already has: MinHeap, UnionFind, Trie, binarySearch,
 * lowerBound, upperBound, binarySearchOnAnswer, bfsGrid, countIslands, bfsGraph, dfsGraph,
 * buildAdjList, topoSortKahn, twoPointersOppositeEnds, hasCycle, middleNode, reverseList,
 * dijkstra, subsets, longestUniqueSubstring, nextGreater, buildPrefixSum,
 * countSubarraysWithSum, LRUCache, memoize, gcd, lcm, fastPower.
 *
 * This file adds the templates the pattern lessons in ../01_Concepts/patterns/ need and
 * templates.js does not have. Every function is pure (no input mutation unless the name
 * says "InPlace") and returns a fresh value, so you can test it against a brute force.
 *
 * Run: node pattern_templates.js   (prints a ✓ line when every self-test passes)
 */

// The base templates print their own ✓ line when required; that is fine.
const { MinHeap, buildAdjList } = require('./templates');

// =====================================================================
// 01. Hash map & frequency counting
// =====================================================================

/** Count how many times each value appears. Map keeps original key types (1 !== '1'). */
function frequencyMap(items) {
  const freq = new Map();
  for (const x of items) freq.set(x, (freq.get(x) || 0) + 1);
  return freq;
}

/** Two Sum with a "seen" map: value -> index. Returns [i, j] (i < j) or null. O(n). */
function twoSumHash(nums, target) {
  const seen = new Map();
  for (let j = 0; j < nums.length; j++) {
    const need = target - nums[j];
    if (seen.has(need)) return [seen.get(need), j]; // look up BEFORE inserting: no self-pairing
    seen.set(nums[j], j);
  }
  return null;
}

/** Group items by a canonical key (sorted letters for anagrams). Groups keep input order. */
function groupByKey(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()];
}

// =====================================================================
// 02. Two pointers (same direction: slow writer, fast reader)
// =====================================================================

/** Remove duplicates from a SORTED array, keeping order. Returns a new array. O(n). */
function dedupeSorted(sorted) {
  const out = sorted.slice();
  let write = 0;                                   // out[0..write-1] is the answer so far
  for (let read = 0; read < out.length; read++) {
    if (read === 0 || out[read] !== out[write - 1]) out[write++] = out[read];
  }
  out.length = write;
  return out;
}

/** All unique triplets summing to 0 (3Sum): sort + opposite-ends pointers. O(n^2). */
function threeSum(nums) {
  const a = nums.slice().sort((x, y) => x - y);    // numeric comparator: default sort is by string!
  const res = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;      // skip duplicate anchors
    let lo = i + 1;
    let hi = a.length - 1;
    while (lo < hi) {
      const sum = a[i] + a[lo] + a[hi];
      if (sum < 0) lo++;
      else if (sum > 0) hi--;
      else {
        res.push([a[i], a[lo], a[hi]]);
        lo++; hi--;
        while (lo < hi && a[lo] === a[lo - 1]) lo++; // skip duplicate seconds
      }
    }
  }
  return res;
}

// =====================================================================
// 03. Sliding window
// =====================================================================

/** Fixed window: max sum of any k consecutive numbers. Returns -Infinity if k > n or k <= 0. */
function maxSumFixedWindow(nums, k) {
  if (k <= 0 || k > nums.length) return -Infinity;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];          // add the new element, drop the old one
    best = Math.max(best, sum);
  }
  return best;
}

/** Variable window (longest): longest subarray with at most k distinct values. O(n). */
function longestWithAtMostKDistinct(arr, k) {
  const count = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < arr.length; right++) {
    count.set(arr[right], (count.get(arr[right]) || 0) + 1);
    while (count.size > k) {                       // window invalid -> shrink from the left
      const x = arr[left++];
      count.set(x, count.get(x) - 1);
      if (count.get(x) === 0) count.delete(x);
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

/** Variable window (shortest): length of shortest subarray with sum >= target (positives only). 0 if none. */
function minSubarrayLenAtLeast(nums, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {                        // valid -> record, then try to shrink
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}

// =====================================================================
// 04. Prefix sums & difference arrays
// =====================================================================

/** Apply many range increments [l, r, delta] (inclusive) to an array of zeros of length n. O(n + q). */
function applyRangeAdds(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, delta] of updates) {
    diff[l] += delta;                              // start adding at l
    diff[r + 1] -= delta;                          // stop after r
  }
  const out = new Array(n).fill(0);
  let running = 0;
  for (let i = 0; i < n; i++) { running += diff[i]; out[i] = running; }
  return out;
}

/** 2D prefix sums. Returns query(r1, c1, r2, c2) -> sum of the inclusive rectangle in O(1). */
function buildPrefix2D(matrix) {
  const rows = matrix.length;
  const cols = rows ? matrix[0].length : 0;
  const P = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) P[r + 1][c + 1] = matrix[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
  }
  return (r1, c1, r2, c2) => P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
}

// =====================================================================
// 05. Fast & slow pointers
// =====================================================================

/** Floyd: node where the cycle starts, or null. Same idea as hasCycle, plus phase 2. */
function cycleStart(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {                           // phase 2: one pointer restarts from head
      let p = head;
      while (p !== slow) { p = p.next; slow = slow.next; }
      return p;
    }
  }
  return null;
}

/** Find the duplicate in an array of n+1 values in 1..n, O(1) space: index -> value is a linked list. */
function findDuplicateFloyd(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}

/** Happy-number style: follow f(x) until it reaches `target` (true) or loops (false). */
function reachesTarget(start, f, target) {
  let slow = start;
  let fast = start;
  while (true) {
    slow = f(slow);
    fast = f(f(fast));
    if (slow === target || fast === target) return true;
    if (slow === fast) return false;               // entered a cycle that skips target
  }
}

// =====================================================================
// 06. Binary search (rotated array variant; the rest is in templates.js)
// =====================================================================

/** Search a target in a rotated sorted array of DISTINCT values. Index or -1. O(log n). */
function searchRotated(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {                   // left half is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {                                       // right half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
  }
  return -1;
}

// =====================================================================
// 07. Sorting + greedy selection
// =====================================================================

/** Activity selection: max number of non-overlapping intervals [s, e) (touching is fine). Sort by end. */
function maxNonOverlapping(intervals) {
  const sorted = intervals.slice().sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;
  for (const [s, e] of sorted) {
    if (s >= lastEnd) { count++; lastEnd = e; }    // earliest finish leaves the most room
  }
  return count;
}

/** Pair the largest with the smallest (Boats to Save People). Min boats with capacity `limit`, 2 per boat. */
function minBoats(people, limit) {
  const a = people.slice().sort((x, y) => x - y);
  let lo = 0;
  let hi = a.length - 1;
  let boats = 0;
  while (lo <= hi) {
    if (a[lo] + a[hi] <= limit) lo++;              // lightest rides with the heaviest if it fits
    hi--;
    boats++;
  }
  return boats;
}

// =====================================================================
// 08. Intervals & sweep line
// =====================================================================

/** Merge overlapping closed intervals [s, e]. Returns sorted, merged copy. */
function mergeIntervals(intervals) {
  const sorted = intervals.map((x) => x.slice()).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const cur of sorted) {
    const last = out[out.length - 1];
    if (last && cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
    else out.push(cur);
  }
  return out;
}

/** Insert newInterval into sorted, non-overlapping intervals and merge. O(n). */
function insertInterval(intervals, newInterval) {
  const out = [];
  let [s, e] = newInterval;
  let i = 0;
  while (i < intervals.length && intervals[i][1] < s) out.push(intervals[i++].slice());   // fully left
  while (i < intervals.length && intervals[i][0] <= e) {                                  // overlapping
    s = Math.min(s, intervals[i][0]);
    e = Math.max(e, intervals[i][1]);
    i++;
  }
  out.push([s, e]);
  while (i < intervals.length) out.push(intervals[i++].slice());                         // fully right
  return out;
}

/** Sweep line: max number of intervals [s, e) active at once (Meeting Rooms II). */
function maxOverlap(intervals) {
  const events = [];
  for (const [s, e] of intervals) { events.push([s, 1]); events.push([e, -1]); }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // at equal time, process ends (-1) first
  let active = 0;
  let best = 0;
  for (const [, delta] of events) { active += delta; best = Math.max(best, active); }
  return best;
}

// =====================================================================
// 09. Monotonic stack & queue (nextGreater is in templates.js)
// =====================================================================

/** Index of the previous strictly smaller element for each i (-1 if none). */
function previousSmallerIndex(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = [];                                // indices, values increasing bottom -> top
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] >= nums[i]) stack.pop();
    if (stack.length) res[i] = stack[stack.length - 1];
    stack.push(i);
  }
  return res;
}

/** Max of every window of size k with a monotonic deque. O(n). */
function slidingWindowMax(nums, k) {
  if (k <= 0 || k > nums.length) return [];
  const dq = [];                                   // indices, values decreasing front -> back
  let head = 0;                                    // dq[head..] is the live deque (no O(n) shift)
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[head] <= i - k) head++;                 // front fell out of the window
    if (i >= k - 1) out.push(nums[dq[head]]);
  }
  return out;
}

// =====================================================================
// 10. Top-K & heaps
// =====================================================================

/** Kth largest with a min-heap of size k. O(n log k). Returns undefined if k is out of range. */
function kthLargest(nums, k) {
  if (k < 1 || k > nums.length) return undefined;
  const heap = new MinHeap();
  for (const x of nums) {
    heap.push(x);
    if (heap.size() > k) heap.pop();               // drop the smallest; the k largest survive
  }
  return heap.peek();
}

/** k most frequent values. Ties broken by smaller value first so the output is deterministic. */
function topKFrequent(nums, k) {
  const freq = frequencyMap(nums);
  // min-heap ordered by (count asc, value desc): the root is the "worst" of the kept k
  const heap = new MinHeap((a, b) => a[1] - b[1] || b[0] - a[0]);
  for (const entry of freq) {
    heap.push(entry);
    if (heap.size() > k) heap.pop();
  }
  const out = [];
  while (heap.size()) out.push(heap.pop()[0]);
  return out.reverse();                            // most frequent first
}

// =====================================================================
// 11. K-way merge
// =====================================================================

/** Merge k sorted arrays with a heap of (value, listIndex, elementIndex). O(N log k). */
function mergeKSorted(lists) {
  const heap = new MinHeap((a, b) => a[0] - b[0] || a[1] - b[1]);
  lists.forEach((list, i) => { if (list.length) heap.push([list[0], i, 0]); });
  const out = [];
  while (heap.size()) {
    const [value, li, ei] = heap.pop();
    out.push(value);
    if (ei + 1 < lists[li].length) heap.push([lists[li][ei + 1], li, ei + 1]); // refill from same list
  }
  return out;
}

// =====================================================================
// 12. Recursion & backtracking (subsets is in templates.js)
// =====================================================================

/** All permutations of distinct values. */
function permutations(nums) {
  const res = [];
  const path = [];
  const used = new Array(nums.length).fill(false);
  (function backtrack() {
    if (path.length === nums.length) { res.push(path.slice()); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);          // choose
      backtrack();                                 // explore
      path.pop(); used[i] = false;                 // un-choose
    }
  })();
  return res;
}

/** Combination Sum: candidates (positive, distinct) may be reused; combos summing to target. */
function combinationSum(candidates, target) {
  const c = candidates.slice().sort((a, b) => a - b);
  const res = [];
  const path = [];
  (function backtrack(start, remaining) {
    if (remaining === 0) { res.push(path.slice()); return; }
    for (let i = start; i < c.length; i++) {
      if (c[i] > remaining) break;                 // prune: sorted, so every later one is too big
      path.push(c[i]);
      backtrack(i, remaining - c[i]);              // i, not i + 1: reuse allowed
      path.pop();
    }
  })(0, target);
  return res;
}

// =====================================================================
// 13. Tree traversal & tree properties
// =====================================================================

/** Height (max depth) — post-order: answer from children, then combine. */
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/** Level order (BFS) — array of levels. */
function levelOrder(root) {
  if (!root) return [];
  const res = [];
  let level = [root];
  while (level.length) {
    res.push(level.map((n) => n.val));
    const next = [];
    for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); }
    level = next;
  }
  return res;
}

/** In-order, iterative (explicit stack) — sorted order for a BST, no recursion-depth risk. */
function inorderIterative(root) {
  const out = [];
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    out.push(node.val);
    node = node.right;
  }
  return out;
}

/** Validate BST — pre-order with (low, high) bounds passed down. */
function isValidBST(root, low = -Infinity, high = Infinity) {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}

// =====================================================================
// 14. Graph traversal & shortest paths (bfsGraph, dfsGraph, dijkstra are in templates.js)
// =====================================================================

/** Number of connected components in an undirected graph with n nodes. DFS with an explicit stack. */
function countComponents(n, edges) {
  const graph = buildAdjList(n, edges);
  const seen = new Array(n).fill(false);
  let components = 0;
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    components++;
    const stack = [s];
    seen[s] = true;
    while (stack.length) {
      const u = stack.pop();
      for (const v of graph.get(u)) if (!seen[v]) { seen[v] = true; stack.push(v); }
    }
  }
  return components;
}

/** Bellman-Ford: shortest distances from src with possibly negative weights. null if a negative cycle is reachable. */
function bellmanFord(n, edges, src) {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round < n - 1; round++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges) if (dist[u] + w < dist[v]) return null;
  return dist;
}

// =====================================================================
// 15. Topological sort — DFS version with cycle detection (Kahn is in templates.js)
// =====================================================================

/** Returns a topological order, or [] if the directed graph has a cycle. Colors: 0 new, 1 on stack, 2 done. */
function topoSortDFS(n, edges) {
  const graph = buildAdjList(n, edges, true);
  const color = new Array(n).fill(0);
  const order = [];
  let hasCycle = false;
  function dfs(u) {
    color[u] = 1;
    for (const v of graph.get(u)) {
      if (color[v] === 1) { hasCycle = true; return; } // back edge -> cycle
      if (color[v] === 0) dfs(v);
      if (hasCycle) return;
    }
    color[u] = 2;
    order.push(u);                                     // post-order
  }
  for (let u = 0; u < n && !hasCycle; u++) if (color[u] === 0) dfs(u);
  return hasCycle ? [] : order.reverse();
}

/** Check that `order` is a valid topological order for the edges (used by tests). */
function isTopologicalOrder(n, edges, order) {
  if (order.length !== n) return false;
  const pos = new Array(n);
  order.forEach((u, i) => { pos[u] = i; });
  return edges.every(([a, b]) => pos[a] < pos[b]);
}

// =====================================================================
// 17. Dynamic programming families
// =====================================================================

/** Linear DP (House Robber): best sum with no two adjacent picks. Rolling variables, O(1) space. */
function houseRobber(nums) {
  let skip = 0;                                    // best so far if the current house is NOT robbed
  let take = 0;                                    // best so far if the current house IS robbed
  for (const x of nums) [skip, take] = [Math.max(skip, take), skip + x];
  return Math.max(skip, take);
}

/** 0/1 knapsack: max value with capacity W, each item once. 1D array iterated BACKWARD. */
function knapsack01(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = W; w >= weights[i]; w--) dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  }
  return dp[W];
}

/** Unbounded knapsack (Coin Change): fewest coins for amount, -1 if impossible. Iterate FORWARD. */
function coinChangeMin(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

/** Two-sequence DP: longest common subsequence length. O(n*m). */
function lcsLength(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/** LIS length in O(n log n): tails[k] = smallest tail of an increasing subsequence of length k+1. */
function lisLength(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < x) lo = mid + 1; else hi = mid; }
    tails[lo] = x;                                 // replace (or append when lo === length)
  }
  return tails.length;
}

// =====================================================================
// 18. Bit manipulation
// =====================================================================

/** Number of set bits (works for 32-bit ints; >>> 0 treats negatives as unsigned). */
function popcount(x) {
  let n = x >>> 0;
  let count = 0;
  while (n) { n &= n - 1; count++; }               // clears the lowest set bit each time
  return count;
}

/** The one value that appears once when every other value appears twice. */
function singleNumber(nums) {
  return nums.reduce((acc, x) => acc ^ x, 0);
}

/** Subsets via bitmask: bit i of mask says "take nums[i]". Only for n <= ~20. */
function subsetsBitmask(nums) {
  const res = [];
  for (let mask = 0; mask < (1 << nums.length); mask++) {
    const subset = [];
    for (let i = 0; i < nums.length; i++) if (mask & (1 << i)) subset.push(nums[i]);
    res.push(subset);
  }
  return res;
}

function isPowerOfTwo(n) {
  return Number.isInteger(n) && n > 0 && n <= 2 ** 30 && (n & (n - 1)) === 0;
}

// =====================================================================
// 19. Matrix traversal (bfsGrid / countIslands are in templates.js)
// =====================================================================

/** Spiral order with four shrinking boundaries. */
function spiralOrder(matrix) {
  const out = [];
  if (!matrix.length || !matrix[0].length) return out;
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(matrix[r][right]);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) out.push(matrix[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) out.push(matrix[r][left]); left++; }
  }
  return out;
}

/** Rotate an n x n matrix 90 degrees clockwise: transpose, then reverse each row. Returns a copy. */
function rotateClockwise(matrix) {
  const m = matrix.map((row) => row.slice());
  const n = m.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
  for (const row of m) row.reverse();
  return m;
}

// =====================================================================
// 20. Subarray vs subsequence
// =====================================================================

/** Kadane: max sum of a non-empty CONTIGUOUS subarray. -Infinity for empty input. */
function maxSubarraySum(nums) {
  let best = -Infinity;
  let endingHere = 0;
  for (const x of nums) {
    endingHere = Math.max(x, endingHere + x);      // extend the run, or start fresh at x
    best = Math.max(best, endingHere);
  }
  return best;
}

/** Is `s` a subsequence of `t` (order kept, gaps allowed)? Two pointers, O(|t|). */
function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) if (s[i] === t[j]) i++;
  return i === s.length;
}

// =====================================================================
// 21. String matching & tries (Trie is in templates.js)
// =====================================================================

/** KMP prefix function: pi[i] = length of the longest proper prefix of s[0..i] that is also a suffix. */
function prefixFunction(s) {
  const pi = new Array(s.length).fill(0);
  for (let i = 1; i < s.length; i++) {
    let k = pi[i - 1];
    while (k > 0 && s[i] !== s[k]) k = pi[k - 1];  // fall back to the next shorter border
    if (s[i] === s[k]) k++;
    pi[i] = k;
  }
  return pi;
}

/** All start indices of pattern in text, O(n + m). Empty pattern -> every index 0..n. */
function kmpSearchAll(text, pattern) {
  if (pattern.length === 0) return Array.from({ length: text.length + 1 }, (_, i) => i);
  const pi = prefixFunction(pattern);
  const res = [];
  let k = 0;
  for (let i = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pattern[k]) k = pi[k - 1];
    if (text[i] === pattern[k]) k++;
    if (k === pattern.length) { res.push(i - k + 1); k = pi[k - 1]; }
  }
  return res;
}

// =====================================================================
// 22. State-space search & pruning
// =====================================================================

/**
 * Generic BFS over states (Open the Lock, Word Ladder, sliding puzzles).
 * key(state) -> string used in the visited set; neighbors(state) -> array of states.
 * Returns the minimum number of moves to reach a goal, or -1.
 */
function bfsStates(start, isGoal, neighbors, key = String) {
  const seen = new Set([key(start)]);
  let frontier = [start];
  let steps = 0;
  while (frontier.length) {
    const next = [];
    for (const s of frontier) {
      if (isGoal(s)) return steps;
      for (const t of neighbors(s)) {
        const k = key(t);
        if (!seen.has(k)) { seen.add(k); next.push(t); }
      }
    }
    frontier = next;
    steps++;
  }
  return -1;
}

/** N-Queens count with O(1) conflict checks via column / diagonal sets (pruning). */
function nQueensCount(n) {
  const cols = new Set();
  const diag = new Set();                          // r - c is constant on a "\" diagonal
  const anti = new Set();                          // r + c is constant on a "/" diagonal
  let count = 0;
  (function place(r) {
    if (r === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue; // prune dead branches early
      cols.add(c); diag.add(r - c); anti.add(r + c);
      place(r + 1);
      cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    }
  })(0);
  return count;
}

module.exports = {
  frequencyMap, twoSumHash, groupByKey,
  dedupeSorted, threeSum,
  maxSumFixedWindow, longestWithAtMostKDistinct, minSubarrayLenAtLeast,
  applyRangeAdds, buildPrefix2D,
  cycleStart, findDuplicateFloyd, reachesTarget,
  searchRotated,
  maxNonOverlapping, minBoats,
  mergeIntervals, insertInterval, maxOverlap,
  previousSmallerIndex, slidingWindowMax,
  kthLargest, topKFrequent,
  mergeKSorted,
  permutations, combinationSum,
  maxDepth, levelOrder, inorderIterative, isValidBST,
  countComponents, bellmanFord,
  topoSortDFS, isTopologicalOrder,
  houseRobber, knapsack01, coinChangeMin, lcsLength, lisLength,
  popcount, singleNumber, subsetsBitmask, isPowerOfTwo,
  spiralOrder, rotateClockwise,
  maxSubarraySum, isSubsequence,
  prefixFunction, kmpSearchAll,
  bfsStates, nQueensCount,
};

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  const { ListNode, TreeNode, arrayToList, arrayToTree } = require('./templates');

  // seeded PRNG so failures are reproducible
  function mulberry32(seed) {
    return function rand() {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(42);
  const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  const randArr = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

  // 01
  assert.deepStrictEqual([...frequencyMap('abca')], [['a', 2], ['b', 1], ['c', 1]]);
  assert.deepStrictEqual(twoSumHash([2, 7, 11, 15], 9), [0, 1]);
  assert.deepStrictEqual(twoSumHash([3, 3], 6), [0, 1]);
  assert.strictEqual(twoSumHash([1, 2], 7), null);
  const sortedKey = (w) => [...w].sort().join('');
  assert.deepStrictEqual(groupByKey(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], sortedKey),
    [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]);
  // 02
  assert.deepStrictEqual(dedupeSorted([1, 1, 2, 3, 3, 3]), [1, 2, 3]);
  assert.deepStrictEqual(threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
  // 03
  assert.strictEqual(maxSumFixedWindow([2, 1, 5, 1, 3, 2], 3), 9);
  assert.strictEqual(longestWithAtMostKDistinct([1, 2, 1, 2, 3], 2), 4);
  assert.strictEqual(minSubarrayLenAtLeast([2, 3, 1, 2, 4, 3], 7), 2);
  for (let t = 0; t < 200; t++) {
    const a = randArr(randInt(0, 12), 1, 6);
    const k = randInt(0, 4);
    let brute = 0;
    for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++) {
      if (new Set(a.slice(i, j + 1)).size <= k) brute = Math.max(brute, j - i + 1);
    }
    assert.strictEqual(longestWithAtMostKDistinct(a, k), brute);
  }
  // 04
  assert.deepStrictEqual(applyRangeAdds(5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]), [-2, 0, 3, 5, 3]);
  const q2 = buildPrefix2D([[3, 0, 1], [5, 6, 3], [1, 2, 0]]);
  assert.strictEqual(q2(1, 1, 2, 2), 11);
  assert.strictEqual(q2(0, 0, 2, 2), 21);
  // 05
  const cyc = arrayToList([1, 2, 3, 4]);
  cyc.next.next.next.next = cyc.next;              // 4 -> 2
  assert.strictEqual(cycleStart(cyc).val, 2);
  assert.strictEqual(cycleStart(arrayToList([1, 2])), null);
  assert.strictEqual(findDuplicateFloyd([1, 3, 4, 2, 2]), 2);
  const digitSquares = (x) => String(x).split('').reduce((s, d) => s + d * d, 0);
  assert.strictEqual(reachesTarget(19, digitSquares, 1), true);
  assert.strictEqual(reachesTarget(2, digitSquares, 1), false);
  // 06
  assert.strictEqual(searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4);
  assert.strictEqual(searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1);
  // 07
  assert.strictEqual(maxNonOverlapping([[1, 2], [2, 3], [3, 4], [1, 3]]), 3);
  assert.strictEqual(minBoats([3, 2, 2, 1], 3), 3);
  // 08
  assert.deepStrictEqual(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
  assert.deepStrictEqual(insertInterval([[1, 2], [3, 5], [6, 7], [8, 10]], [4, 8]), [[1, 2], [3, 10]]);
  assert.strictEqual(maxOverlap([[0, 30], [5, 10], [15, 20]]), 2);
  assert.strictEqual(maxOverlap([[1, 5], [5, 10]]), 1);
  // 09
  assert.deepStrictEqual(previousSmallerIndex([3, 1, 4, 1, 5]), [-1, -1, 1, -1, 3]);
  assert.deepStrictEqual(slidingWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
  // 10
  assert.strictEqual(kthLargest([3, 2, 1, 5, 6, 4], 2), 5);
  assert.deepStrictEqual(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);
  // 11
  assert.deepStrictEqual(mergeKSorted([[1, 4, 5], [1, 3, 4], [2, 6]]), [1, 1, 2, 3, 4, 4, 5, 6]);
  // 12
  assert.strictEqual(permutations([1, 2, 3]).length, 6);
  assert.deepStrictEqual(combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]]);
  // 13
  const tree = arrayToTree([2, 1, 3, null, null, null, 4]);
  assert.strictEqual(maxDepth(tree), 3);
  assert.deepStrictEqual(levelOrder(tree), [[2], [1, 3], [4]]);
  assert.deepStrictEqual(inorderIterative(tree), [1, 2, 3, 4]);
  assert.strictEqual(isValidBST(tree), true);
  assert.strictEqual(isValidBST(new TreeNode(5, new TreeNode(1), new TreeNode(4, new TreeNode(3), new TreeNode(6)))), false);
  // 14
  assert.strictEqual(countComponents(5, [[0, 1], [1, 2], [3, 4]]), 2);
  assert.deepStrictEqual(bellmanFord(3, [[0, 1, 4], [0, 2, 5], [1, 2, -3]], 0), [0, 4, 1]);
  assert.strictEqual(bellmanFord(2, [[0, 1, 1], [1, 0, -2]], 0), null);
  // 15
  const deps = [[0, 1], [0, 2], [1, 3], [2, 3]];
  assert.ok(isTopologicalOrder(4, deps, topoSortDFS(4, deps)));
  assert.deepStrictEqual(topoSortDFS(2, [[0, 1], [1, 0]]), []);
  // 17
  assert.strictEqual(houseRobber([2, 7, 9, 3, 1]), 12);
  assert.strictEqual(knapsack01([1, 3, 4, 5], [1, 4, 5, 7], 7), 9);
  assert.strictEqual(coinChangeMin([1, 2, 5], 11), 3);
  assert.strictEqual(coinChangeMin([2], 3), -1);
  assert.strictEqual(lcsLength('abcde', 'ace'), 3);
  assert.strictEqual(lisLength([10, 9, 2, 5, 3, 7, 101, 18]), 4);
  // 18
  assert.strictEqual(popcount(11), 3);
  assert.strictEqual(popcount(-1), 32);
  assert.strictEqual(singleNumber([4, 1, 2, 1, 2]), 4);
  assert.strictEqual(subsetsBitmask([1, 2, 3]).length, 8);
  assert.strictEqual(isPowerOfTwo(16), true);
  assert.strictEqual(isPowerOfTwo(6), false);
  // 19
  assert.deepStrictEqual(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5]);
  assert.deepStrictEqual(rotateClockwise([[1, 2], [3, 4]]), [[3, 1], [4, 2]]);
  // 20
  assert.strictEqual(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
  assert.strictEqual(isSubsequence('ace', 'abcde'), true);
  assert.strictEqual(isSubsequence('aec', 'abcde'), false);
  // 21
  assert.deepStrictEqual(prefixFunction('aabaaab'), [0, 1, 0, 1, 2, 2, 3]);
  assert.deepStrictEqual(kmpSearchAll('abababa', 'aba'), [0, 2, 4]);
  for (let t = 0; t < 200; t++) {
    const text = randArr(randInt(0, 15), 0, 1).map((x) => 'ab'[x]).join('');
    const pat = randArr(randInt(1, 3), 0, 1).map((x) => 'ab'[x]).join('');
    const brute = [];
    for (let i = 0; i + pat.length <= text.length; i++) if (text.startsWith(pat, i)) brute.push(i);
    assert.deepStrictEqual(kmpSearchAll(text, pat), brute);
  }
  // 22
  const lockNeighbors = (s) => {
    const out = [];
    for (let i = 0; i < 4; i++) for (const d of [1, 9]) {
      out.push(s.slice(0, i) + ((+s[i] + d) % 10) + s.slice(i + 1));
    }
    return out;
  };
  assert.strictEqual(bfsStates('0000', (s) => s === '0202', lockNeighbors), 4);
  assert.strictEqual(nQueensCount(4), 2);
  assert.strictEqual(nQueensCount(8), 92);
  assert.ok(ListNode); // builders imported for the tests above

  console.log('✓ pattern_templates.js self-test passed');
}
