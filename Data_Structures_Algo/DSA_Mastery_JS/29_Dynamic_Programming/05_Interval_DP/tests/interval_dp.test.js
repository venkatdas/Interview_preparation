// node --test 29_Dynamic_Programming/05_Interval_DP/tests/interval_dp.test.js
// Every exported version (bruteForce / memo / tabulation / optimized) of each interval-DP
// solution must agree, on edge cases and on seeded random small inputs.
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const sol = (name) => require(`../03_Problems/solutions/${name}`);

// Seeded PRNG so a failing random case can be reproduced exactly.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randInt = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (rand, len, lo, hi) => Array.from({ length: len }, () => randInt(rand, lo, hi));
const randString = (rand, len, alpha) => Array.from({ length: len }, () => alpha[randInt(rand, 0, alpha.length - 1)]).join("");

// Run every exported solver (skipping helpers like buildTree) on deep-copied args and
// check they all equal `expected` (or the bruteForce answer when expected is undefined).
function allAgree(mod, args, expected, skip = ["buildTree"]) {
  const fns = Object.entries(mod).filter(([n, f]) => typeof f === "function" && !skip.includes(n));
  const copy = () => JSON.parse(JSON.stringify(args));
  const want = expected !== undefined ? expected : mod.bruteForce(...copy());
  for (const [name, fn] of fns) assert.deepEqual(fn(...copy()), want, `${name}(${JSON.stringify(args)})`);
  return want;
}

const rand = mulberry32(2905);

describe('01 Predict the Winner / Stone Game', () => {
  const m = sol('01_predict_the_winner_stone_game');
  it('examples and edge cases', () => {
    allAgree(m, [[1, 5, 2]], false);
    allAgree(m, [[1, 5, 233, 7]], true);
    allAgree(m, [[7]], true);
    allAgree(m, [[3, 3]], true);           // tie counts as a win for player 1
  });
  it('random arrays', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [randArray(rand, randInt(rand, 1, 10), 0, 20)]);
  });
});

describe('02 Matrix Chain Multiplication', () => {
  const m = sol('02_matrix_chain_multiplication');
  it('examples and edge cases', () => {
    allAgree(m, [[2, 3, 4, 5]], 64);        // (AB)C = 24 + 40
    allAgree(m, [[10, 20]], 0);             // one matrix: no multiplication
    allAgree(m, [[1, 2, 3]], 6);
  });
  it('random dimensions', () => {
    for (let t = 0; t < 120; t++) allAgree(m, [randArray(rand, randInt(rand, 2, 8), 1, 15)]);
  });
});

describe('03 Minimum Score Triangulation', () => {
  const m = sol('03_minimum_score_triangulation');
  it('examples and edge cases', () => {
    allAgree(m, [[1, 2, 3]], 6);
    allAgree(m, [[3, 7, 4, 5]], 144);
    allAgree(m, [[1, 3, 1, 4, 1, 5]], 13);
  });
  it('random polygons', () => {
    for (let t = 0; t < 120; t++) allAgree(m, [randArray(rand, randInt(rand, 3, 8), 1, 10)]);
  });
});

describe('04 Palindrome Partitioning II', () => {
  const m = sol('04_palindrome_partitioning_ii');
  it('examples and edge cases', () => {
    allAgree(m, ['aab'], 1);
    allAgree(m, ['a'], 0);
    allAgree(m, ['ab'], 1);
    allAgree(m, ['racecar'], 0);
  });
  it('random strings', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [randString(rand, randInt(rand, 1, 12), 'ab')]);
  });
});

describe('05 Minimum Cost to Cut a Stick', () => {
  const m = sol('05_minimum_cost_to_cut_a_stick');
  it('examples and edge cases', () => {
    allAgree(m, [7, [1, 3, 4, 5]], 16);
    allAgree(m, [9, [5, 6, 1, 4, 2]], 22);
    allAgree(m, [5, [2]], 5);
  });
  it('random sticks', () => {
    for (let t = 0; t < 120; t++) {
      const n = randInt(rand, 2, 15);
      const cuts = [...new Set(randArray(rand, randInt(rand, 1, Math.min(6, n - 1)), 1, n - 1))];
      allAgree(m, [n, cuts]);
    }
  });
});

describe('06 Burst Balloons', () => {
  const m = sol('06_burst_balloons');
  it('examples and edge cases', () => {
    allAgree(m, [[3, 1, 5, 8]], 167);
    allAgree(m, [[1, 5]], 10);
    allAgree(m, [[7]], 7);
    allAgree(m, [[0, 0, 0]], 0);
  });
  it('random arrays', () => {
    for (let t = 0; t < 120; t++) allAgree(m, [randArray(rand, randInt(rand, 1, 7), 0, 9)]);
  });
});

describe('07 Strange Printer', () => {
  const m = sol('07_strange_printer');
  it('examples and edge cases', () => {
    allAgree(m, ['aaabbb'], 2);
    allAgree(m, ['aba'], 2);
    allAgree(m, ['a'], 1);
    allAgree(m, ['abcabc'], 5);
  });
  it('random strings', () => {
    for (let t = 0; t < 120; t++) allAgree(m, [randString(rand, randInt(rand, 1, 9), 'abc')]);
  });
});

describe('08 Remove Boxes', () => {
  const m = sol('08_remove_boxes');
  it('examples and edge cases', () => {
    allAgree(m, [[1, 3, 2, 2, 2, 3, 4, 3, 1]], 23);
    allAgree(m, [[1, 1, 1]], 9);
    allAgree(m, [[1]], 1);
  });
  it('random arrays', () => {
    for (let t = 0; t < 100; t++) allAgree(m, [randArray(rand, randInt(rand, 1, 7), 1, 3)]);
  });
});
