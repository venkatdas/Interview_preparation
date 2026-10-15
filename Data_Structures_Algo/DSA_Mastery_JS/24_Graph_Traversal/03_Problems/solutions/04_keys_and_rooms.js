/**
 * 04. Keys and Rooms   (LeetCode 841 — Medium)
 *
 * PROBLEM
 * There are n rooms 0..n-1. Room 0 is unlocked, all others are locked. rooms[i] is the
 * list of keys you find in room i (a key is just a room number). Starting in room 0,
 * can you enter every room?
 *
 * EXAMPLES
 * Input: [[1],[2],[3],[]]      Output: true    Explanation: 0 -> 1 -> 2 -> 3
 * Input: [[1,3],[3,0,1],[2],[0]] Output: false   Explanation: nobody has a key to room 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can a room contain a key to itself or duplicates? (yes, harmless)
 * - Is room 0 always open? (yes)
 *
 * This is "is every node reachable from node 0" on a DIRECTED graph (room i -> key j).
 *
 * APPROACH 1 — Brute force (repeat until no new room opens)   O(n^2 + total keys) time
 * Keep a set of open rooms. Loop: for every open room, add all its keys. Stop when a full
 * pass opens nothing new. Up to n passes, each scanning all open rooms.
 *
 * APPROACH 2 — Optimal (DFS from room 0)   O(n + k) time, O(n) space  (k = total keys)
 *   1. visited = {0}, stack = [0]
 *   2. pop a room, for each key: if the room is unvisited, mark and push
 *   3. answer = visited.size === n
 *
 * Dry run on [[1,3],[3,0,1],[2],[0]]:
 *   stack [0] visited {0}
 *   pop 0: keys 1,3 -> push both      visited {0,1,3}
 *   pop 3: key 0 already seen
 *   pop 1: keys 3,0,1 all seen
 *   stack empty, visited.size = 3 !== 4 -> false
 *
 * EDGE CASES
 * - n = 1 -> true (room 0 is open)
 * - rooms[0] empty with n > 1 -> false
 * - keys forming cycles (0 -> 1 -> 0) -> visited set prevents looping
 */

function bruteForce(rooms) {
  const open = new Set([0]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const room of [...open]) {
      for (const key of rooms[room]) {
        if (!open.has(key)) {
          open.add(key);
          changed = true;
        }
      }
    }
  }
  return open.size === rooms.length;
}

function optimal(rooms) {
  const visited = new Array(rooms.length).fill(false);
  visited[0] = true;
  const stack = [0];
  while (stack.length) {
    const room = stack.pop();
    for (const key of rooms[room]) {
      if (!visited[key]) {
        visited[key] = true;   // mark when pushing so a key is pushed at most once
        stack.push(key);
      }
    }
  }
  return visited.every(Boolean);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1], [2], [3], []]), true);
  assert.strictEqual(solve([[1, 3], [3, 0, 1], [2], [0]]), false);
  assert.strictEqual(solve([[]]), true);
  assert.strictEqual(solve([[], [0]]), false);
  assert.strictEqual(solve([[1, 1, 1], [0, 0]]), true);
  assert.strictEqual(solve([[2], [], [1]]), true);
}
console.log('✓ 04-keys-and-rooms passed');

module.exports = { optimal, bruteForce };
