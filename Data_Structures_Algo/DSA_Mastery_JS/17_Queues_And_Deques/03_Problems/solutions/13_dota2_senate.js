/**
 * 13. Dota2 Senate   (LeetCode 649 — Medium)
 *
 * PROBLEM
 * A string of 'R' (Radiant) and 'D' (Dire) senators, in voting order. Each
 * round, every senator still in the game, in order, may BAN one senator from
 * the other party (removing their vote forever). Everyone plays optimally.
 * Rounds repeat until only one party remains. Return the winning party.
 *
 * EXAMPLES
 * Input: "RD"    Output: "Radiant"   Explanation: R bans D first
 * Input: "RDD"   Output: "Dire"      Explanation: R bans the 1st D; the 2nd D bans R
 * Input: "DDRRR" Output: "Dire"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Banned senators are skipped forever, and the round order wraps around? (yes)
 * - Optimal play = ban the NEXT opposing senator who would otherwise act? (yes - that's
 *   the greedy that makes the problem tractable)
 *
 * APPROACH 1 — Brute force (simulate with an array and a "banned" flag)   O(n^2) time
 * Loop over the senators repeatedly. For each active senator, scan forward
 * (wrapping) to find the next active opponent and ban them. Stop when a full
 * pass finds no opponents.
 *
 * APPROACH 2 — Optimal (two queues of indices)   O(n) time, O(n) space
 * Put Radiant indices in one queue and Dire indices in another. Each step,
 * compare the two FRONTS: the smaller index acts first and bans the other.
 * The winner goes back to the end of its queue with index + n (it acts again
 * in the next round, after everyone else this round). The loser is just
 * dropped. When one queue is empty, the other party wins.
 *
 * Dry run on "RDD" (n=3):
 *   R [0]   D [1,2]
 *   0 < 1 -> R bans D(1). R [3]  D [2]
 *   2 < 3 -> D bans R(3). R []   D [5]
 *   R empty -> "Dire"
 *
 * EDGE CASES
 * - all one party
 * - single senator
 * - equal counts (the party that acts first wins: "RD" -> Radiant, "DR" -> Dire)
 */

const { Queue } = require('../../02_Implementations/queue');

function bruteForce(senate) {
  const seats = senate.split('');
  const banned = new Array(seats.length).fill(false);
  let alive = seats.length;

  while (true) {
    let actedThisRound = false;
    for (let i = 0; i < seats.length; i++) {
      if (banned[i]) continue;
      // find the next active opponent, wrapping around
      for (let step = 1; step < seats.length; step++) {
        const j = (i + step) % seats.length;
        if (!banned[j] && seats[j] !== seats[i]) {
          banned[j] = true;
          alive--;
          actedThisRound = true;
          break;
        }
      }
    }
    if (!actedThisRound) break;
  }
  return seats.find((party, i) => !banned[i]) === 'R' ? 'Radiant' : 'Dire';
}

function optimal(senate) {
  const n = senate.length;
  const radiant = new Queue();
  const dire = new Queue();
  for (let i = 0; i < n; i++) {
    (senate[i] === 'R' ? radiant : dire).enqueue(i);
  }

  while (!radiant.isEmpty() && !dire.isEmpty()) {
    const r = radiant.dequeue();
    const d = dire.dequeue();
    // whoever is earlier acts first, bans the other, and re-enters for the next round
    if (r < d) radiant.enqueue(r + n);
    else dire.enqueue(d + n);
  }
  return radiant.isEmpty() ? 'Dire' : 'Radiant';
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('RD'), 'Radiant');
  assert.strictEqual(solve('RDD'), 'Dire');
  assert.strictEqual(solve('DDRRR'), 'Dire');
  assert.strictEqual(solve('DR'), 'Dire');
  assert.strictEqual(solve('RRR'), 'Radiant');
  assert.strictEqual(solve('D'), 'Dire');
  assert.strictEqual(solve('RRDDD'), 'Radiant');
  assert.strictEqual(solve('DRRDRDRDRDDRDRDR'), 'Radiant');
}
console.log('✓ 13-dota2-senate passed');

module.exports = { optimal, bruteForce };
