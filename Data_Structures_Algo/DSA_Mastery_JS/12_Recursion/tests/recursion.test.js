const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const R = require('../02_Implementations/recursion_patterns');

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('recursion_patterns: decomposition and arrays', () => {
  it('handles normal cases', () => {
    assert.equal(R.sumList([1, 2, 3]), 6);
    assert.equal(R.maxOfArray([4, 9, -2]), 9);
    assert.equal(R.binarySearchRec([1, 4, 8, 10], 8), 2);
    assert.equal(R.isPalindromeStr('abba'), true);
  });
  it('handles empty input', () => {
    assert.equal(R.sumList([]), 0);
    assert.equal(R.maxOfArray([]), -Infinity);
    assert.equal(R.rangeMax([]), -Infinity);
    assert.equal(R.binarySearchRec([], 1), -1);
    assert.equal(R.isPalindromeStr(''), true);
    assert.equal(R.reverseListRec(null), null);
    assert.equal(R.treeHeight(null), 0);
  });
  it('handles negatives and duplicates', () => {
    assert.equal(R.maxOfArray([-5, -5, -9]), -5);
    assert.deepEqual(R.reverseRange([2, 2, 1]), [1, 2, 2]);
    assert.throws(() => R.sumList('nope'), TypeError);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(99);
    for (let t = 0; t < 200; t++) {
      const arr = Array.from({ length: Math.floor(rand() * 40) }, () => Math.floor(rand() * 100) - 50);
      assert.equal(R.sumWithAccumulator(arr), R.sumIterative(arr));
      assert.equal(R.rangeMax(arr), arr.length ? Math.max(...arr) : -Infinity);
      assert.deepEqual(R.listToArray(R.reverseListRec(R.listFromArray(arr))), [...arr].reverse());
      const tree = R.treeFromLevelOrder(arr.map((x) => (rand() < 0.25 ? null : x)));
      assert.deepEqual(R.inorderRecursive(tree), R.inorderIterative(tree));
    }
  });
});

describe('recursion_patterns: memo, mutual recursion, generation', () => {
  it('memoized grid paths equal naive on small grids', () => {
    for (let r = 0; r <= 8; r++) for (let c = 0; c <= 8; c++) assert.equal(R.gridPathsMemo(r, c), R.gridPathsNaive(r, c));
  });
  it('trampoline survives very deep recursion', () => {
    assert.equal(R.sumToN(200000), 200000 * 200001 / 2);
  });
  it('mutual recursion: parity and arithmetic parser', () => {
    assert.equal(R.isEven(0), true);
    assert.equal(R.isOdd(9), true);
    assert.equal(R.evaluateArithmetic('((1+2))*-3'), -9);
    assert.equal(R.evaluateArithmetic('7/2*2'), 6);
    assert.throws(() => R.evaluateArithmetic('(1+2'), SyntaxError);
  });
  it('generated structures match Catalan numbers', () => {
    for (let n = 0; n <= 7; n++) {
      assert.equal(R.allTreeShapes(n).length, R.countBinaryTreeShapes(n));
    }
    const items = ['a', 'b', 'c', 'd'];
    const all = R.allParenthesizations(items);
    assert.equal(all.length, 5);
    assert.equal(new Set(all).size, 5);
  });
  it('fastPow matches repeated multiplication', () => {
    for (let e = 0; e <= 30; e++) assert.equal(R.fastPow(3, e), 3 ** e);
    assert.equal(R.fastPow(2, 62, 1000000007), Number((2n ** 62n) % 1000000007n));
  });
});

describe('12_Recursion solutions on extra edge cases', () => {
  it('Fibonacci with memo', () => {
    const { optimal, bruteForce } = require('../03_Problems/solutions/01_fibonacci_memo');
    assert.equal(optimal(0), 0);
    assert.equal(optimal(20), bruteForce(20));
  });
  it('K-th symbol in grammar', () => {
    const { optimal } = require('../03_Problems/solutions/07_kth_symbol_in_grammar');
    for (let k = 1; k <= 64; k++) {
      let ones = 0;
      for (let x = k - 1; x; x &= x - 1) ones++;
      assert.equal(optimal(7, k), ones % 2);
    }
  });
  it('Different ways to add parentheses', () => {
    const { optimal, bruteForce } = require('../03_Problems/solutions/10_different_ways_to_add_parentheses');
    assert.deepEqual(optimal('0'), [0]);
    assert.deepEqual([...optimal('1*2*3*4')].sort(), [...bruteForce('1*2*3*4')].sort());
  });
  it('Predict the winner', () => {
    const { optimal } = require('../03_Problems/solutions/13_predict_the_winner');
    assert.equal(optimal([0]), true);
    assert.equal(optimal([1, 1, 1]), true);
    assert.equal(optimal([3, 9, 1, 2]), true);
  });
  it('Mini Lisp evaluator', () => {
    const { optimal, bruteForce } = require('../03_Problems/solutions/14_mini_lisp_evaluator');
    const src = '(let x 3 x 4 (add x (let y x (mul y 2))))';
    assert.equal(optimal(src), 12);
    assert.equal(bruteForce(src), 12);
    assert.throws(() => optimal('y'), ReferenceError);
  });
});
