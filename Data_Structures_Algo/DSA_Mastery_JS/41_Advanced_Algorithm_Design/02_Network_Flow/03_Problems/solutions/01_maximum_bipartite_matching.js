/**
 * 01. Maximum Bipartite Matching — Hiring Applicants   (Original — Medium)
 *
 * PROBLEM
 * There are n applicants and m jobs. applicants[i] lists the jobs applicant i is
 * qualified for. Each job can be given to at most one applicant and each applicant
 * takes at most one job. Return the maximum number of applicants that can be hired.
 *
 * EXAMPLES
 * applicants = [[0,1],[0],[1,2]], m = 3   -> 3   (0->1, 1->0, 2->2)
 * applicants = [[0],[0],[0]],     m = 1   -> 1   (only one job exists)
 * applicants = [[],[1]],          m = 2   -> 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can an applicant's list be empty? (yes, they are never hired)
 * - Can a list contain duplicates? (assume no; harmless anyway)
 * - Do we need the actual assignment or only the count? (count; matchLeft is easy to return)
 * - n, m up to ~1000, total qualifications up to ~10^5.
 *
 * APPROACH 1 — Brute force   O(m^n) time (exponential), O(n + m) space
 * For each applicant in order: skip them, or give them each free qualified job, recurse.
 * Take the best. Correct but explodes beyond ~10 applicants.
 *
 * APPROACH 2 — Optimal (Kuhn's augmenting paths)   O(n * E) time, O(n + m) space
 * Process applicants one by one. To place applicant u, look at each qualified job v:
 *   - v is free -> take it.
 *   - v is taken by w -> ask (recursively) whether w can move to ANOTHER job.
 * A successful chain is an augmenting path; flipping it grows the matching by one.
 * A visited mark per search stops us from asking the same job twice (no infinite loops).
 *
 * Dry run on [[0,1],[0],[1,2]]:
 *   u=0: job 0 free -> 0 gets job 0.                     matchJob = [0,-,-]
 *   u=1: job 0 taken by 0 -> can 0 move? job 0 visited, job 1 free -> 0 moves to 1,
 *        1 takes job 0.                                   matchJob = [1,0,-]
 *   u=2: job 1 taken by 0 -> can 0 move? job 0 taken by 1 -> can 1 move? no other job.
 *        back at u=2: job 2 free -> 2 takes job 2.        matchJob = [1,0,2]  -> 3
 *
 * EDGE CASES
 * - n = 0 or m = 0 -> 0
 * - applicant with no qualifications
 * - many applicants competing for one job
 */

function bruteForce(applicants, m) {
  const used = new Array(m).fill(false);
  function go(i) {
    if (i === applicants.length) return 0;
    let best = go(i + 1);
    for (const job of applicants[i]) {
      if (used[job]) continue;
      used[job] = true;
      best = Math.max(best, 1 + go(i + 1));
      used[job] = false;
    }
    return best;
  }
  return go(0);
}

function optimal(applicants, m) {
  const matchJob = new Array(m).fill(-1); // matchJob[job] = applicant holding it
  const seen = new Array(m).fill(-1);     // seen[job] = id of the search that visited it

  function tryPlace(u, stamp) {
    for (const job of applicants[u]) {
      if (seen[job] === stamp) continue;
      seen[job] = stamp;
      if (matchJob[job] === -1 || tryPlace(matchJob[job], stamp)) {
        matchJob[job] = u;
        return true;
      }
    }
    return false;
  }

  let hired = 0;
  for (let u = 0; u < applicants.length; u++) if (tryPlace(u, u)) hired++;
  return hired;
}

// ---------- tests ----------
const assert = require('assert');
const { mulberry32 } = require('../../02_Implementations/max_flow');
const { hopcroftKarp } = require('../../02_Implementations/bipartite_matching');

for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 1], [0], [1, 2]], 3), 3);
  assert.strictEqual(solve([[0], [0], [0]], 1), 1);
  assert.strictEqual(solve([[], [1]], 2), 1);
  assert.strictEqual(solve([], 5), 0);
  assert.strictEqual(solve([[], []], 0), 0);
  assert.strictEqual(solve([[0, 1], [0, 1], [0, 1]], 2), 2);
}
const rnd = mulberry32(101);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rnd() * 7);
  const m = 1 + Math.floor(rnd() * 6);
  const apps = Array.from({ length: n }, () => [...Array(m).keys()].filter(() => rnd() < 0.35));
  const expected = bruteForce(apps, m);
  assert.strictEqual(optimal(apps, m), expected);
  assert.strictEqual(hopcroftKarp(n, m, apps).size, expected);
}
console.log('✓ 01_maximum_bipartite_matching passed');

module.exports = { optimal, bruteForce };
