/**
 * Recursion basics in JavaScript.
 *
 * Ten small recursive functions, each showing one idea:
 *
 *  1. factorial          - the simplest base case + recursive case
 *  2. fibonacci          - naive (exponential) vs memoized (linear)
 *  3. sumArray           - "my element + sum of the rest"
 *  4. reverseString      - "last char + reverse of the rest"
 *  5. power              - fast exponentiation by halving (O(log n))
 *  6. printOneToN        - head vs tail recursion, order of side effects
 *  7. isPalindrome       - two indices moving inward
 *  8. flattenNested      - recursion on nested data
 *  9. towerOfHanoi       - the classic "move n-1, move 1, move n-1"
 * 10. binaryStrings      - all binary numbers of length n (first taste of backtracking)
 *
 * Every function states its PROMISE in a comment. Trust the promise for the
 * smaller input, do one step of work, and the whole thing is correct.
 */

// ---------- 1. factorial ----------
// promise: returns n! = n * (n-1) * ... * 1
function factorial(n) {
  if (n <= 1) return 1;            // base case: 0! = 1! = 1
  return n * factorial(n - 1);     // recursive case
}
// time O(n), space O(n) stack frames

// ---------- 2. fibonacci ----------
// promise: returns the n-th Fibonacci number (0, 1, 1, 2, 3, 5, 8 ...)
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);   // two calls -> O(2^n) time
}

// same promise, but each n is computed once thanks to the cache
function fibMemo(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);        // already solved -> O(1)
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}
// time O(n), space O(n) (cache + stack)

// ---------- 3. sum of array ----------
// promise: returns arr[index] + arr[index+1] + ... + arr[last]
function sumArray(arr, index = 0) {
  if (index === arr.length) return 0;          // no elements left
  return arr[index] + sumArray(arr, index + 1);
}
// time O(n), space O(n). NOTE: on arrays > ~10k use a loop (stack limit).

// ---------- 4. reverse string ----------
// promise: returns str reversed
function reverseString(str) {
  if (str.length <= 1) return str;             // '' and 'a' are their own reverse
  // last char first, then the reverse of everything before it
  return str[str.length - 1] + reverseString(str.slice(0, -1));
}
// time O(n^2) because slice copies; fine for learning, use a loop in production

// ---------- 5. power (fast exponentiation) ----------
// promise: returns base^exponent for integer exponent >= 0
function power(base, exponent) {
  if (exponent === 0) return 1;
  const half = power(base, Math.floor(exponent / 2)); // solve HALF the problem once
  if (exponent % 2 === 0) return half * half;         // even: b^n = (b^(n/2))^2
  return half * half * base;                          // odd: one extra base
}
// time O(log n), space O(log n) - halving the input each call

// ---------- 6. print 1..n (head vs tail) ----------
// promise: returns an array [1, 2, ..., n]
function oneToNHead(n) {
  if (n === 0) return [];
  const rest = oneToNHead(n - 1);  // recurse FIRST (head recursion)
  rest.push(n);                    // work AFTER the call returns
  return rest;
}

// promise: returns [n, n-1, ..., 1]
function nToOneTail(n, acc = []) {
  if (n === 0) return acc;
  acc.push(n);                     // work FIRST
  return nToOneTail(n - 1, acc);   // recursive call is the LAST thing (tail recursion)
}

// ---------- 7. palindrome check ----------
// promise: returns true if str[left..right] reads the same both ways
function isPalindrome(str, left = 0, right = str.length - 1) {
  if (left >= right) return true;              // 0 or 1 chars left -> palindrome
  if (str[left] !== str[right]) return false;  // mismatch -> definitely not
  return isPalindrome(str, left + 1, right - 1);
}
// time O(n), space O(n)

// ---------- 8. flatten nested array ----------
// promise: returns a flat array with the same values in the same order
function flattenNested(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenNested(item));     // trust: the inner array comes back flat
    } else {
      result.push(item);
    }
  }
  return result;
}
// time O(total elements), space O(depth of nesting) stack

// ---------- 9. Tower of Hanoi ----------
// promise: returns the list of moves that transfers n disks from `from` to `to`
// Idea: to move n disks from A to C using B:
//   1. move n-1 disks A -> B (out of the way)   [trust the function]
//   2. move the biggest disk A -> C             [one real move]
//   3. move n-1 disks B -> C                    [trust the function]
function towerOfHanoi(n, from = 'A', to = 'C', spare = 'B', moves = []) {
  if (n === 0) return moves;
  towerOfHanoi(n - 1, from, spare, to, moves);
  moves.push(`disk ${n}: ${from} -> ${to}`);
  towerOfHanoi(n - 1, spare, to, from, moves);
  return moves;
}
// 2^n - 1 moves, so time O(2^n), space O(n)

// ---------- 10. all binary strings of length n ----------
// promise: returns every string of '0'/'1' of length n, in sorted order
// This is backtracking in its simplest form: at each position choose 0 or 1.
function binaryStrings(n) {
  const results = [];
  function build(current) {
    if (current.length === n) {        // base case: string is complete
      results.push(current);
      return;
    }
    build(current + '0');              // choose 0, explore
    build(current + '1');              // choose 1, explore (strings are immutable: no undo needed)
  }
  build('');
  return results;
}
// 2^n strings of length n -> O(n * 2^n) time, O(n) stack

// ---------- self-test ----------
const assert = require('assert');

assert.strictEqual(factorial(0), 1);
assert.strictEqual(factorial(1), 1);
assert.strictEqual(factorial(5), 120);
assert.strictEqual(factorial(10), 3628800);

assert.strictEqual(fibNaive(0), 0);
assert.strictEqual(fibNaive(1), 1);
assert.strictEqual(fibNaive(10), 55);
assert.strictEqual(fibMemo(10), 55);
assert.strictEqual(fibMemo(50), 12586269025);  // naive would take minutes here
for (let i = 0; i <= 15; i++) assert.strictEqual(fibMemo(i), fibNaive(i));

assert.strictEqual(sumArray([]), 0);
assert.strictEqual(sumArray([5]), 5);
assert.strictEqual(sumArray([1, -2, 3, -4]), -2);

assert.strictEqual(reverseString(''), '');
assert.strictEqual(reverseString('a'), 'a');
assert.strictEqual(reverseString('hello'), 'olleh');

assert.strictEqual(power(2, 0), 1);
assert.strictEqual(power(2, 10), 1024);
assert.strictEqual(power(3, 5), 243);
assert.strictEqual(power(-2, 3), -8);

assert.deepStrictEqual(oneToNHead(0), []);
assert.deepStrictEqual(oneToNHead(5), [1, 2, 3, 4, 5]);
assert.deepStrictEqual(nToOneTail(5), [5, 4, 3, 2, 1]);

assert.strictEqual(isPalindrome(''), true);
assert.strictEqual(isPalindrome('a'), true);
assert.strictEqual(isPalindrome('racecar'), true);
assert.strictEqual(isPalindrome('abba'), true);
assert.strictEqual(isPalindrome('abc'), false);

assert.deepStrictEqual(flattenNested([]), []);
assert.deepStrictEqual(flattenNested([1, [2, [3, [4]], 5], [], 6]), [1, 2, 3, 4, 5, 6]);

assert.deepStrictEqual(towerOfHanoi(1), ['disk 1: A -> C']);
assert.deepStrictEqual(towerOfHanoi(2), ['disk 1: A -> B', 'disk 2: A -> C', 'disk 1: B -> C']);
assert.strictEqual(towerOfHanoi(5).length, 31); // 2^5 - 1

assert.deepStrictEqual(binaryStrings(0), ['']);
assert.deepStrictEqual(binaryStrings(1), ['0', '1']);
assert.deepStrictEqual(binaryStrings(2), ['00', '01', '10', '11']);
assert.strictEqual(binaryStrings(5).length, 32);

console.log('✓ recursion-basics.js self-test passed');

module.exports = {
  factorial, fibNaive, fibMemo, sumArray, reverseString, power,
  oneToNHead, nToOneTail, isPalindrome, flattenNested, towerOfHanoi, binaryStrings,
};
