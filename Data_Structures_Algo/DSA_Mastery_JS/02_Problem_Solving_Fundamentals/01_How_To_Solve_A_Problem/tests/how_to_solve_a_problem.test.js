const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const walkthrough = require('../02_Implementations/example_walkthrough');
const template = require('../02_Implementations/problem_template');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(17);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

// A returned pair is valid if it uses two different indices whose values sum to target.
function isValidPair(nums, target, pair) {
  if (pair.length !== 2) return false;
  const [i, j] = pair;
  return i !== j && i >= 0 && j >= 0 && i < nums.length && j < nums.length && nums[i] + nums[j] === target;
}

describe('example_walkthrough (Two Sum via UMPIRE)', () => {
  const { optimal, bruteForce } = walkthrough;
  it('handles the normal case', () => {
    assert.deepEqual(optimal([2, 7, 11, 15], 9), [0, 1]);
    assert.deepEqual(bruteForce([2, 7, 11, 15], 9), [0, 1]);
  });
  it('never pairs an index with itself', () => {
    assert.deepEqual(optimal([3, 2, 4], 6), [1, 2]);
    assert.deepEqual(optimal([3], 6), []);
  });
  it('handles duplicates, negatives, zero and empty input', () => {
    assert.deepEqual(optimal([3, 3], 6), [0, 1]);
    assert.deepEqual(optimal([-3, 4, 3, 90], 0), [0, 2]);
    assert.deepEqual(optimal([0, 4, 0], 0), [0, 2]);
    assert.deepEqual(optimal([], 1), []);
    assert.deepEqual(bruteForce([], 1), []);
  });
  it('agrees with brute force on random inputs', () => {
    for (let t = 0; t < 300; t++) {
      const nums = Array.from({ length: randInt(0, 15) }, () => randInt(-20, 20));
      const target = randInt(-30, 30);
      const fast = optimal(nums, target);
      const slow = bruteForce(nums, target);
      assert.equal(fast.length === 0, slow.length === 0, 'both find or both miss');
      if (fast.length) assert.ok(isValidPair(nums, target, fast));
    }
  });
});

describe('problem_template', () => {
  it('exports optimal and bruteForce that agree on the starter cases', () => {
    for (const input of [[], [1], [1, 2, 3]]) {
      assert.deepEqual(template.optimal(input), template.bruteForce(input));
    }
  });
});
