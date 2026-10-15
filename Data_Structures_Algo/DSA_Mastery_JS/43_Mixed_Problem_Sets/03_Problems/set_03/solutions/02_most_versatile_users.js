/**
 * 02. Most Versatile Users   (Original — Medium)
 *
 * PROBLEM
 * An app logs events as [user, action] pairs (strings). A user's "versatility" is the
 * number of DIFFERENT actions they performed. Return the k most versatile users, most
 * versatile first; break ties by user name in ascending (lexicographic) order.
 * If there are fewer than k users, return all of them.
 *
 * EXAMPLES
 * Input: logs = [["ann","view"],["bob","view"],["ann","buy"],["bob","view"],["cy","buy"]], k = 2
 * Output: ["ann", "bob"]   Explanation: ann 2, bob 1, cy 1 -> tie bob/cy broken by name
 * Input: logs = [], k = 3  Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 logs, up to 10^4 users, k usually small.
 * - Repeated identical events count once (distinct actions).
 *
 * APPROACH 1 — Brute force   O(U * L + U log U) time, O(U) space
 * Collect the user names; for each user scan all logs to build their action set; sort all
 * users by (count desc, name asc); take k.
 *
 * APPROACH 2 — Optimal (hash map of sets + size-k min-heap)   O(L + U log k) time, O(L + k) space
 * One pass builds Map user -> Set(actions). Then keep a heap of size k whose ROOT is the
 * "worst" kept user (smallest count; for equal counts the larger name). For each user,
 * push; if the heap grows beyond k, pop the worst. Finally sort the k survivors best-first.
 *
 * Dry run on the first example (k = 2):
 *   map: ann{view,buy}=2, bob{view}=1, cy{buy}=1
 *   push ann(2)             heap [ann]
 *   push bob(1)             heap [bob, ann]       (bob is worst)
 *   push cy(1), size 3 > 2: worst is cy (count 1, name "cy" > "bob") -> pop cy
 *   survivors sorted: ann(2), bob(1)
 *
 * EDGE CASES
 * - k = 0 -> []
 * - k > number of users -> everyone, sorted
 * - same action repeated -> counted once
 *
 * COMMON MISTAKES
 * - Counting events instead of distinct actions.
 * - Getting the tie-break backwards inside the min-heap: the worst element among equal
 *   counts is the one with the LARGER name.
 */

function bruteForce(logs, k) {
  const users = [...new Set(logs.map((l) => l[0]))];
  const scored = users.map((u) => {
    const acts = new Set();
    for (const [user, action] of logs) if (user === u) acts.add(action);
    return [u, acts.size];
  });
  scored.sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  return scored.slice(0, k).map((x) => x[0]);
}

// returns true when a is "worse" than b (should sit closer to the min-heap root)
const worse = (a, b) => a[1] < b[1] || (a[1] === b[1] && a[0] > b[0]);

class MinHeap {
  constructor(less) { this.a = []; this.less = less; }
  get size() { return this.a.length; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (!this.less(a[i], a[p])) break; [a[i], a[p]] = [a[p], a[i]]; i = p; }
  }
  pop() {
    const a = this.a; const top = a[0]; const last = a.pop();
    if (a.length) {
      a[0] = last; let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]]; i = m;
      }
    }
    return top;
  }
}

function optimal(logs, k) {
  if (k <= 0) return [];
  const acts = new Map();
  for (const [user, action] of logs) {
    if (!acts.has(user)) acts.set(user, new Set());
    acts.get(user).add(action);
  }
  const heap = new MinHeap(worse);
  for (const [user, set] of acts) {
    heap.push([user, set.size]);
    if (heap.size > k) heap.pop(); // drop the current worst
  }
  const out = [];
  while (heap.size) out.push(heap.pop());
  return out.reverse().map((x) => x[0]); // popped worst-first
}

// ---------- tests ----------
const assert = require('assert');
const ex = [['ann', 'view'], ['bob', 'view'], ['ann', 'buy'], ['bob', 'view'], ['cy', 'buy']];
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(ex, 2), ['ann', 'bob']);
  assert.deepStrictEqual(solve(ex, 5), ['ann', 'bob', 'cy']);
  assert.deepStrictEqual(solve([], 3), []);
  assert.deepStrictEqual(solve(ex, 0), []);
  assert.deepStrictEqual(solve([['z', 'a'], ['y', 'a'], ['x', 'a']], 1), ['x']);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(302);
for (let t = 0; t < 300; t++) {
  const logs = Array.from({ length: Math.floor(rand() * 15) }, () => ['u' + Math.floor(rand() * 6), 'a' + Math.floor(rand() * 4)]);
  const k = Math.floor(rand() * 8);
  assert.deepStrictEqual(optimal(logs, k), bruteForce(logs, k));
}
console.log('✓ set_03/02_most_versatile_users passed');
module.exports = { optimal, bruteForce };
