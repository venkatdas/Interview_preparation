/**
 * 06. Maximum Students Taking Exam   (LeetCode 1349 — Hard)
 *
 * PROBLEM (paraphrased)
 * A classroom is an m x n grid: '.' is a usable seat, '#' is broken. A student can see
 * the answers of anyone directly left, directly right, upper-left, or upper-right of them.
 * Seat as many students as possible so that nobody can see anybody else's answers.
 *
 * EXAMPLES
 * ["#.##.#",
 *  ".####.",
 *  "#.##.#"]                 -> 4   (the four '.' in columns 1 and 4 of rows 0 and 2)
 * [".#", "##", "#.", "##", ".#"]   -> 3
 * ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"]  -> 10
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - m, n <= 8 on LeetCode (so bitmask DP also works); the matching solution scales to
 *   much bigger grids.
 * - "See" is symmetric for our purpose: if A sees B's paper, they can't both sit.
 *
 * APPROACH 1 — Brute force   O(2^seats * seats) time
 * Try every subset of good seats; keep it if no conflicting pair is in it. Tiny only.
 * (APPROACH 1b — row bitmask DP   O(m * 4^n): dp over rows, mask = students in a row,
 *  a mask must have no two adjacent bits and no diagonal clash with the row above.
 *  Exported as bitmaskDP; it's the "expected" LeetCode answer.)
 *
 * APPROACH 2 — Optimal (maximum independent set in a bipartite graph = seats - matching)
 *   O(E * sqrt(V)) with Hopcroft-Karp, O(V * E) with Kuhn; V = seats, E <= 6V.
 * Build the "conflict graph": an edge between two good seats that can't both be used:
 *   (r, c) - (r, c+1)        same row neighbours
 *   (r, c) - (r-1, c-1), (r, c) - (r-1, c+1)   diagonals to the row above
 * Every conflict edge joins an EVEN column to an ODD column -> the graph is BIPARTITE.
 * We want the biggest set of seats with no edge inside it = maximum independent set.
 * König's theorem: in a bipartite graph, max independent set = V - max matching.
 *
 * Dry run (example 1): good seats (0,1) (0,4) (1,0) (1,5) (2,1) (2,4) -> 6 seats
 *   even-column seats: (1,0), (0,4), (2,4)   odd-column: (0,1), (2,1), (1,5)
 *   conflicts: (1,0)-(0,1) diagonal, (1,0)-(2,1) diagonal (seen from row 2),
 *              (0,4)-(1,5) diagonal, (2,4)-(1,5) diagonal
 *   max matching = 2  ((1,0)-(0,1), (0,4)-(1,5))
 *   answer = 6 - 2 = 4
 *
 * EDGE CASES
 * - all seats broken -> 0
 * - a single row -> no diagonals, just "no two adjacent"
 * - a single column -> no conflicts at all, every good seat is used
 */

function goodSeats(seats) {
  const cells = [];
  for (let r = 0; r < seats.length; r++) for (let c = 0; c < seats[r].length; c++) if (seats[r][c] === '.') cells.push([r, c]);
  return cells;
}

function conflict([r1, c1], [r2, c2]) {
  return (Math.abs(r1 - r2) === 1 && Math.abs(c1 - c2) === 1) || (r1 === r2 && Math.abs(c1 - c2) === 1);
}

function bruteForce(seats) {
  const cells = goodSeats(seats);
  let best = 0;
  for (let mask = 0; mask < 1 << cells.length; mask++) {
    let ok = true;
    let count = 0;
    for (let i = 0; i < cells.length && ok; i++) {
      if (!(mask >> i & 1)) continue;
      count++;
      for (let j = i + 1; j < cells.length; j++) if ((mask >> j & 1) && conflict(cells[i], cells[j])) { ok = false; break; }
    }
    if (ok) best = Math.max(best, count);
  }
  return best;
}

function bitmaskDP(seats) {
  const m = seats.length;
  if (m === 0) return 0;
  const n = seats[0].length;
  const full = 1 << n;
  const popcount = x => { let c = 0; for (; x; x &= x - 1) c++; return c; };
  let prev = new Array(full).fill(-Infinity);
  prev[0] = 0; // imaginary empty row above row 0
  for (let r = 0; r < m; r++) {
    let goodMask = 0;
    for (let c = 0; c < n; c++) if (seats[r][c] === '.') goodMask |= 1 << c;
    const cur = new Array(full).fill(-Infinity);
    for (let mask = 0; mask < full; mask++) {
      if ((mask & ~goodMask) || (mask & (mask << 1))) continue; // broken seat or side-by-side
      for (let up = 0; up < full; up++) {
        if (prev[up] === -Infinity) continue;
        if ((mask & (up << 1)) || (mask & (up >> 1))) continue; // diagonal clash
        cur[mask] = Math.max(cur[mask], prev[up] + popcount(mask));
      }
    }
    prev = cur;
  }
  return Math.max(...prev);
}

function optimal(seats) {
  const m = seats.length;
  if (m === 0) return 0;
  const n = seats[0].length;
  const id = Array.from({ length: m }, () => new Array(n).fill(-1));
  let total = 0;
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (seats[r][c] === '.') { id[r][c] = total++; }

  // adjacency from EVEN-column seats to their odd-column conflicts
  const adj = new Array(total);
  const dirs = [[0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c += 2) {
    if (id[r][c] === -1) continue;
    adj[id[r][c]] = [];
    for (const [dr, dc] of dirs) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < m && cc >= 0 && cc < n && id[rr][cc] !== -1) adj[id[r][c]].push(id[rr][cc]);
    }
  }

  // Kuhn's augmenting paths from each even-column seat
  const matchOf = new Array(total).fill(-1);
  const seen = new Array(total).fill(-1);
  function tryMatch(u, stamp) {
    for (const v of adj[u]) {
      if (seen[v] === stamp) continue;
      seen[v] = stamp;
      if (matchOf[v] === -1 || tryMatch(matchOf[v], stamp)) { matchOf[v] = u; return true; }
    }
    return false;
  }
  let matching = 0;
  for (let u = 0; u < total; u++) if (adj[u] && tryMatch(u, u)) matching++;
  return total - matching; // König: max independent set = V - max matching
}

// ---------- tests ----------
const assert = require('assert');
const { mulberry32 } = require('../../02_Implementations/max_flow');

const ex1 = ['#.##.#', '.####.', '#.##.#'];
const ex2 = ['.#', '##', '#.', '##', '.#'];
const ex3 = ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'];
for (const solve of [bruteForce, bitmaskDP, optimal]) {
  assert.strictEqual(solve(ex1), 4);
  assert.strictEqual(solve(ex2), 3);
  assert.strictEqual(solve(ex3), 10);
  assert.strictEqual(solve(['###', '###']), 0);
  assert.strictEqual(solve(['....']), 2);
  assert.strictEqual(solve(['.', '.', '.']), 3);
  assert.strictEqual(solve(['..', '..']), 2);
}
const rnd = mulberry32(606);
for (let tr = 0; tr < 300; tr++) {
  const m = 1 + Math.floor(rnd() * 4);
  const n = 1 + Math.floor(rnd() * 4);
  const grid = Array.from({ length: m }, () => Array.from({ length: n }, () => (rnd() < 0.7 ? '.' : '#')).join(''));
  const want = bruteForce(grid);
  assert.strictEqual(bitmaskDP(grid), want);
  assert.strictEqual(optimal(grid), want);
}
for (let tr = 0; tr < 30; tr++) { // bigger grids: matching vs bitmask DP
  const grid = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => (rnd() < 0.8 ? '.' : '#')).join(''));
  assert.strictEqual(optimal(grid), bitmaskDP(grid));
}
console.log('✓ 06_maximum_students_taking_exam passed');

module.exports = { optimal, bruteForce, bitmaskDP };
