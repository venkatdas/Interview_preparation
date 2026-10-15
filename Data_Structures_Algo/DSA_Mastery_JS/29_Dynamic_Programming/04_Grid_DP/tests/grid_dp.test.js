// node:test suite for grid DP.
// Every exported version (bruteForce, memo, tabulation, optimized) of each solution file must
// agree on hand-picked edge cases and on seeded random small grids.
// Run from the curriculum root: node --test 29_Dynamic_Programming/04_Grid_DP/tests/grid_dp.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const sol = (name) => require(`../03_Problems/solutions/${name}`);

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2904);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const rgrid = (r, c, lo, hi) => Array.from({ length: r }, () => Array.from({ length: c }, () => rint(lo, hi)));

const VERSIONS = ['bruteForce', 'memo', 'tabulation', 'optimized'];
// Every version gets its own deep copy (some solutions modify the grid in place).
function allAgree(mod, args, expected) {
  const copy = () => JSON.parse(JSON.stringify(args));
  const want = expected !== undefined ? expected : mod.bruteForce(...copy());
  for (const name of VERSIONS) {
    if (typeof mod[name] !== 'function') continue;
    assert.deepEqual(mod[name](...copy()), want, `${name}(${JSON.stringify(args)})`);
  }
  return want;
}
// combinatorial reference for Unique Paths: C(m + n - 2, m - 1)
function binom(n, k) { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); }

describe('01 Unique Paths', () => {
  const m = sol('01_unique_paths');
  it('edge cases', () => {
    allAgree(m, [1, 1], 1);
    allAgree(m, [3, 7], 28);
    allAgree(m, [3, 2], 3);
    allAgree(m, [1, 10], 1);
  });
  it('matches C(m+n-2, m-1) on random sizes', () => {
    for (let t = 0; t < 60; t++) { const r = rint(1, 7), c = rint(1, 7); allAgree(m, [r, c], binom(r + c - 2, r - 1)); }
  });
});

describe('02 Unique Paths II', () => {
  const m = sol('02_unique_paths_ii');
  it('edge cases', () => {
    allAgree(m, [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], 2);
    allAgree(m, [[[1]]], 0);              // blocked start
    allAgree(m, [[[0, 0], [0, 1]]], 0);   // blocked end
    allAgree(m, [[[0]]], 1);
  });
  it('random grids with obstacles', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [rgrid(rint(1, 5), rint(1, 5), 0, 1).map((row) => row.map((x) => (x && rand() < 0.6 ? 1 : 0)))]);
  });
});

describe('03 Minimum Path Sum', () => {
  const m = sol('03_minimum_path_sum');
  it('edge cases', () => {
    allAgree(m, [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], 7);
    allAgree(m, [[[5]]], 5);
    allAgree(m, [[[1, 2, 3]]], 6);
    allAgree(m, [[[1], [2], [3]]], 6);
  });
  it('random grids; reconstructPath is a valid right/down path with that sum', () => {
    for (let t = 0; t < 150; t++) {
      const g = rgrid(rint(1, 5), rint(1, 5), 0, 9);
      const best = allAgree(m, [g]);
      const path = m.reconstructPath(JSON.parse(JSON.stringify(g)));
      assert.deepEqual(path[0], [0, 0]);
      assert.deepEqual(path.at(-1), [g.length - 1, g[0].length - 1]);
      for (let k = 1; k < path.length; k++) {
        const [a, b] = path[k - 1], [c, d] = path[k];
        assert.ok((c === a && d === b + 1) || (c === a + 1 && d === b), 'each step goes right or down');
      }
      assert.equal(path.reduce((s, [i, j]) => s + g[i][j], 0), best);
    }
  });
});

describe('04 Triangle', () => {
  const m = sol('04_triangle');
  it('edge cases', () => {
    allAgree(m, [[[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]], 11);
    allAgree(m, [[[-10]]], -10);
  });
  it('random triangles with negatives', () => {
    for (let t = 0; t < 150; t++) {
      const rows = rint(1, 7);
      allAgree(m, [Array.from({ length: rows }, (_, i) => Array.from({ length: i + 1 }, () => rint(-9, 9)))]);
    }
  });
});

describe('05 Minimum Falling Path Sum', () => {
  const m = sol('05_minimum_falling_path_sum');
  it('edge cases', () => {
    allAgree(m, [[[2, 1, 3], [6, 5, 4], [7, 8, 9]]], 13);
    allAgree(m, [[[-19, 57], [-40, -5]]], -59);
    allAgree(m, [[[7]]], 7);
  });
  it('random square matrices', () => {
    for (let t = 0; t < 150; t++) { const n = rint(1, 5); allAgree(m, [rgrid(n, n, -20, 20)]); }
  });
});

describe('06 / 07 squares of ones', () => {
  const cnt = sol('06_count_square_submatrices');
  const sq = sol('07_maximal_square');
  it('edge cases', () => {
    allAgree(cnt, [[[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]]], 15);
    allAgree(cnt, [[[0]]], 0);
    allAgree(cnt, [[[1]]], 1);
    allAgree(sq, [[['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]], 4);
    allAgree(sq, [[['0']]], 0);
    allAgree(sq, [[['1']]], 1);
  });
  it('random 0/1 grids; maximal square area is consistent with the count', () => {
    for (let t = 0; t < 150; t++) {
      const g = rgrid(rint(1, 6), rint(1, 6), 0, 1).map((row) => row.map((x) => (rand() < 0.75 ? 1 : x)));
      const total = allAgree(cnt, [g]);
      const area = allAgree(sq, [g.map((row) => row.map(String))]);
      const ones = g.flat().reduce((a, b) => a + b, 0);
      assert.equal(area === 0, ones === 0);
      assert.ok(total >= ones);
    }
  });
});

describe('08 Longest Increasing Path in a Matrix', () => {
  const m = sol('08_longest_increasing_path_in_matrix');
  it('edge cases', () => {
    allAgree(m, [[[9, 9, 4], [6, 6, 8], [2, 1, 1]]], 4);
    allAgree(m, [[[3, 4, 5], [3, 2, 6], [2, 2, 1]]], 4);
    allAgree(m, [[[1]]], 1);
    allAgree(m, [[[7, 7], [7, 7]]], 1);     // strictly increasing: equal values do not chain
  });
  it('random matrices', () => {
    for (let t = 0; t < 120; t++) allAgree(m, [rgrid(rint(1, 4), rint(1, 4), 0, 6)]);
  });
});

describe('09 Dungeon Game', () => {
  const m = sol('09_dungeon_game');
  it('edge cases', () => {
    allAgree(m, [[[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]], 7);
    allAgree(m, [[[0]]], 1);        // need at least 1 HP even with no damage
    allAgree(m, [[[100]]], 1);
    allAgree(m, [[[-5]]], 6);
  });
  it('random dungeons', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [rgrid(rint(1, 4), rint(1, 4), -10, 10)]);
  });
});

describe('10 Cherry Pickup', () => {
  const m = sol('10_cherry_pickup');
  it('edge cases', () => {
    allAgree(m, [[[0, 1, -1], [1, 0, -1], [1, 1, 1]]], 5);
    allAgree(m, [[[1, 1, -1], [1, -1, 1], [-1, 1, 1]]], 0);   // end unreachable
    allAgree(m, [[[1]]], 1);
  });
  it('random square grids (start cell never a thorn)', () => {
    for (let t = 0; t < 100; t++) {
      const n = rint(1, 4);
      const g = rgrid(n, n, -1, 1);
      g[0][0] = Math.max(0, g[0][0]);
      g[n - 1][n - 1] = Math.max(0, g[n - 1][n - 1]);
      allAgree(m, [g]);
    }
  });
});
