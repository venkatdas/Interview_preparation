/**
 * 09. Task Scheduler   (LeetCode 621 — Medium)
 *
 * PROBLEM
 * You get a list of tasks (uppercase letters) and a cooldown n. The CPU runs one
 * task per unit of time or idles. Two runs of the SAME task must be at least n
 * units apart. Return the minimum total time to finish all tasks.
 *
 * EXAMPLES
 * Input: tasks = ["A","A","A","B","B","B"], n = 2   Output: 8
 *   Explanation: A B idle A B idle A B
 * Input: tasks = ["A","A","A","B","B","B"], n = 0   Output: 6
 * Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2   Output: 16
 *   Explanation: A B C A D E A F G A idle idle A idle idle A
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Order of tasks is free? (yes, any order)
 * - n can be 0? (yes -> answer is tasks.length)
 * - Do you need the schedule or just the length? (just the length)
 *
 * APPROACH 1 — Brute force (math formula)   O(n) time, O(26) space
 * This is a "simpler alternative", not slower. Let maxCount be the highest
 * frequency and numMax the number of tasks with that frequency. The most
 * frequent task forces (maxCount - 1) gaps of size n, plus the last row:
 *   answer = max(tasks.length, (maxCount - 1) * (n + 1) + numMax)
 * The max with tasks.length handles the case where there are enough other
 * tasks to fill every idle slot. It works but is hard to justify under pressure.
 *
 * APPROACH 2 — Optimal (greedy simulation with max-heap + cooldown queue)
 *   O(T * log 26) time, O(26) space
 * Greedy: at each time step run the task with the HIGHEST remaining count
 * that is not on cooldown (it is the one most likely to cause idle time later).
 *   maxHeap  = counts of tasks ready to run
 *   cooldown = queue of [remainingCount, timeWhenReadyAgain]
 * Loop while either is non-empty:
 *   time++
 *   if heap non-empty: pop the biggest count, decrement; if > 0 push to
 *     cooldown with readyAt = time + n
 *   if cooldown front's readyAt === time: move it back to the heap
 * (If heap is empty we idle; time still advances.)
 *
 * Dry run on AAABBB, n = 2:
 *   t=1 run A(3->2) cooldown=[(2,3)]     heap={3B}
 *   t=2 run B(3->2) cooldown=[(2,3),(2,4)] heap={}
 *   t=3 idle; A ready -> heap={2A}
 *   t=4 run A(2->1) cooldown=[(2,4)->ready B,(1,6)] heap={2B}
 *   t=5 run B(2->1) ...
 *   t=6 idle, A ready; t=7 run A; t=8 run B -> total 8
 *
 * EDGE CASES
 * - n = 0 -> tasks.length
 * - single task type -> (count-1)*(n+1)+1
 * - more distinct tasks than n+1 -> no idle at all
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function countTasks(tasks) {
  const counts = new Map();
  for (const task of tasks) counts.set(task, (counts.get(task) || 0) + 1);
  return [...counts.values()];
}

function bruteForce(tasks, n) {
  const counts = countTasks(tasks);
  const maxCount = Math.max(...counts);
  const numMax = counts.filter((c) => c === maxCount).length;
  return Math.max(tasks.length, (maxCount - 1) * (n + 1) + numMax);
}

function optimal(tasks, n) {
  const maxHeap = MinHeap.from(countTasks(tasks), (a, b) => b - a);
  const cooldown = []; // [remainingCount, readyAtTime], in time order
  let cooldownHead = 0; // index-based queue so shift() is not O(n)
  let time = 0;

  while (!maxHeap.isEmpty() || cooldownHead < cooldown.length) {
    time++;
    if (!maxHeap.isEmpty()) {
      const remaining = maxHeap.pop() - 1; // run the most frequent ready task
      if (remaining > 0) cooldown.push([remaining, time + n]);
    }
    // the earliest cooling task becomes ready exactly at its readyAt time
    if (cooldownHead < cooldown.length && cooldown[cooldownHead][1] === time) {
      maxHeap.push(cooldown[cooldownHead][0]);
      cooldownHead++;
    }
  }
  return time;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
  assert.strictEqual(solve(['A', 'A', 'A', 'B', 'B', 'B'], 0), 6);
  assert.strictEqual(solve(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2), 16);
  assert.strictEqual(solve(['A'], 5), 1);
  assert.strictEqual(solve(['A', 'A'], 3), 5);
  assert.strictEqual(solve(['A', 'B', 'C', 'D'], 10), 4);
  assert.strictEqual(solve(['A', 'A', 'B', 'B', 'C', 'C'], 1), 6);
}
console.log('✓ 09-task-scheduler passed');

module.exports = { optimal, bruteForce };
