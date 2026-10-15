/**
 * 15. Task Scheduler   (LeetCode 621 — Medium)
 *
 * PROBLEM
 * tasks is an array of uppercase letters; each letter is a task that takes one time unit.
 * The same task must be separated by at least n units (other tasks or idle time).
 * Return the minimum total time to finish all tasks.
 *
 * EXAMPLES
 * Input: tasks = ["A","A","A","B","B","B"], n = 2   Output: 8
 *   Explanation: A B idle A B idle A B
 * Input: tasks = ["A","A","A","B","B","B"], n = 0   Output: 6
 * Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2   Output: 16
 *   Explanation: A B C A D E A F G A idle idle A idle idle A
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can we reorder tasks freely? (yes)
 * - n = 0? (just tasks.length)
 *
 * APPROACH 1 — Simulation with a max-heap (greedy)   O(T * 26 log 26) time, O(26) space
 * Each round of n+1 slots: pick up to n+1 tasks with the highest remaining counts, run them,
 * put the leftovers back. Implemented below with a sorted array as a tiny "heap".
 *
 * APPROACH 2 — Optimal (greedy math formula)   O(T) time, O(26) space
 * Let maxFreq = the highest count, and k = how many letters have that count.
 * The most frequent task forces a skeleton of (maxFreq - 1) gaps, each at least n + 1 wide:
 *   A _ _ A _ _ A           -> (maxFreq - 1) * (n + 1) slots, plus the final A's
 * The last row holds the k tasks tied for max frequency. So the skeleton length is
 *   (maxFreq - 1) * (n + 1) + k
 * Every other task fits into the gaps without stretching them (shown below). If there are
 * MORE tasks than the skeleton has room for, no idle time is needed at all, and the answer
 * is simply tasks.length. So: answer = max(skeleton, tasks.length).
 *
 * WHY GREEDY WORKS
 * Lower bound: any schedule must be at least `skeleton` long (the most frequent task alone
 * forces it) and at least tasks.length long (every task takes a slot). Achievability: fill
 * the gaps round-robin, most frequent first; a less frequent task never needs two slots in
 * the same gap unless the gaps are already full, in which case we just append columns and
 * the total becomes tasks.length. So the lower bound is always reachable.
 *
 * Dry run on AAABBB, n=2:
 *   maxFreq=3, k=2 -> skeleton = (3-1)*(2+1)+2 = 8;  tasks.length=6 -> max(8,6)=8
 *
 * EDGE CASES
 * - n = 0 -> tasks.length
 * - a single task type -> (count-1)*(n+1)+1
 * - many distinct tasks -> tasks.length wins over skeleton
 */

function bruteForce(tasks, n) {
  // simulation: each "round" is n+1 slots; always run the tasks with the most remaining
  const counts = {};
  for (const task of tasks) counts[task] = (counts[task] || 0) + 1;
  let remaining = Object.values(counts).filter((c) => c > 0);
  let time = 0;

  while (remaining.length > 0) {
    remaining.sort((a, b) => b - a);                 // "max-heap" by resorting
    const runThisRound = remaining.slice(0, n + 1).map((c) => c - 1);
    const untouched = remaining.slice(n + 1);
    const next = [...runThisRound, ...untouched].filter((c) => c > 0);
    // a full round costs n+1 slots, unless it is the last round (no idle tail needed)
    time += next.length === 0 ? runThisRound.length : n + 1;
    remaining = next;
  }
  return time;
}

function optimal(tasks, n) {
  const counts = new Array(26).fill(0);
  for (const task of tasks) counts[task.charCodeAt(0) - 65]++;

  const maxFreq = Math.max(...counts);
  const tiedForMax = counts.filter((c) => c === maxFreq).length;

  const skeleton = (maxFreq - 1) * (n + 1) + tiedForMax;
  return Math.max(skeleton, tasks.length);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
  assert.strictEqual(solve(['A', 'A', 'A', 'B', 'B', 'B'], 0), 6);
  assert.strictEqual(solve(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2), 16);
  assert.strictEqual(solve(['A'], 5), 1);
  assert.strictEqual(solve(['A', 'A'], 3), 5);
  assert.strictEqual(solve(['A', 'B', 'C', 'D'], 2), 4);
  assert.strictEqual(solve(['A', 'A', 'B', 'B', 'C', 'C'], 1), 6);
}
console.log('✓ 15-task-scheduler passed');

module.exports = { optimal, bruteForce };
