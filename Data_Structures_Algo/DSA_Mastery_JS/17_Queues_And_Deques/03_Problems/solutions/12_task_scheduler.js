/**
 * 12. Task Scheduler   (LeetCode 621 — Medium)
 *
 * PROBLEM
 * A CPU runs tasks (letters). Each task takes 1 unit of time. Two SAME tasks
 * must be at least n units apart (a cooldown). The CPU can idle. Return the
 * minimum total time to finish all tasks.
 *
 * EXAMPLES
 * Input: tasks = [A,A,A,B,B,B], n = 2   Output: 8   Explanation: A B idle A B idle A B
 * Input: tasks = [A,A,A,B,B,B], n = 0   Output: 6
 * Input: tasks = [A,A,A,A,A,A,B,C,D,E,F,G], n = 2   Output: 16
 *        A B C A D E A F G A idle idle A idle idle A
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Order of tasks is free? (yes)
 * - Do I return the schedule or just its length? (just the length)
 * - n can be 0? (yes -> answer is tasks.length)
 *
 * APPROACH 1 — Brute force / simulation (greedy with counts)   O(T * 26) time
 * At each time unit, run the available task (not cooling down) with the most
 * remaining copies; if none is available, idle. Track each task's next
 * allowed time. Greedy "most frequent first" is correct here.
 *
 * APPROACH 2 — Optimal (max-heap + cooldown queue simulation)   O(T log 26) = O(T) time
 * The standard interview answer. Each cycle:
 *   - pop the task with the highest remaining count from the max-heap, run it,
 *     and if it still has copies left push [count-1, time + n] onto a QUEUE of
 *     cooling tasks (they re-enter the heap at that time)
 *   - if the heap is empty but the queue isn't, jump time to the queue's front
 *     (that's the idle time)
 * The queue holds tasks in the order they will become available - FIFO.
 *
 * APPROACH 3 — Formula (counting, O(T))
 *   maxCount = highest frequency, numMax = how many tasks have that frequency
 *   answer = max(T, (maxCount - 1) * (n + 1) + numMax)
 * Intuition: the most frequent task forces (maxCount-1) gaps of size n+1
 * ("A _ _ A _ _ A"), the other max-frequency tasks ride along at the end, and
 * everything else fills the gaps. If there are more tasks than gaps, no idle
 * time is needed and the answer is just T.
 *
 * Dry run (formula) on AAABBB, n=2:  maxCount=3, numMax=2
 *   (3-1)*(2+1) + 2 = 8 ; max(6, 8) = 8
 *
 * EDGE CASES
 * - n = 0 -> T
 * - single task type -> (count-1)*(n+1) + 1
 * - enough variety that no idle is needed
 */

function bruteForce(tasks, n) {
  const remaining = new Map();
  for (const task of tasks) remaining.set(task, (remaining.get(task) || 0) + 1);
  const nextAllowed = new Map(); // task -> earliest time it may run again

  let time = 0;
  let done = 0;
  while (done < tasks.length) {
    let pick = null;
    for (const [task, count] of remaining) {
      if (count === 0 || (nextAllowed.get(task) || 0) > time) continue;
      if (pick === null || count > remaining.get(pick)) pick = task;
    }
    if (pick !== null) {
      remaining.set(pick, remaining.get(pick) - 1);
      nextAllowed.set(pick, time + n + 1);
      done++;
    }
    time++; // idle if pick === null
  }
  return time;
}

function optimal(tasks, n) {
  const counts = new Map();
  for (const task of tasks) counts.set(task, (counts.get(task) || 0) + 1);

  // "max-heap" of counts. There are at most 26 task types, so a sorted array
  // with re-sorting is fine and keeps the code focused on the queue idea.
  const heap = [...counts.values()];
  const popMax = () => { heap.sort((a, b) => a - b); return heap.pop(); };

  const cooldown = []; // FIFO of [countLeft, timeAvailable]
  let head = 0;
  let time = 0;

  while (heap.length || head < cooldown.length) {
    time++;
    if (heap.length) {
      const count = popMax() - 1;
      if (count > 0) cooldown.push([count, time + n]); // comes back after the cooldown
    }
    // a task finished cooling exactly now: re-enter the heap
    if (head < cooldown.length && cooldown[head][1] === time) {
      heap.push(cooldown[head++][0]);
    }
    // idle jump: nothing to run, wait until the front of the queue is ready
    if (heap.length === 0 && head < cooldown.length) {
      time = cooldown[head][1];
      heap.push(cooldown[head++][0]);
    }
  }
  return time;
}

function formula(tasks, n) {
  const counts = new Map();
  for (const task of tasks) counts.set(task, (counts.get(task) || 0) + 1);
  const maxCount = Math.max(...counts.values());
  const numMax = [...counts.values()].filter((c) => c === maxCount).length;
  return Math.max(tasks.length, (maxCount - 1) * (n + 1) + numMax);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, formula]) {
  assert.strictEqual(solve(['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
  assert.strictEqual(solve(['A', 'A', 'A', 'B', 'B', 'B'], 0), 6);
  assert.strictEqual(solve(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2), 16);
  assert.strictEqual(solve(['A'], 5), 1);
  assert.strictEqual(solve(['A', 'A'], 3), 5);
  assert.strictEqual(solve(['A', 'B', 'C', 'D'], 10), 4);
  assert.strictEqual(solve(['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'E'], 2), 12);
}
console.log('✓ 12-task-scheduler passed');

module.exports = { optimal, bruteForce, formula };
