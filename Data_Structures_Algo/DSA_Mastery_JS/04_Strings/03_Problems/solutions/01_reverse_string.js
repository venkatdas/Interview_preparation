/**
 * 01. Reverse String   (LeetCode 344 — Easy)
 *
 * PROBLEM
 * You are given an array of characters. Reverse it IN PLACE (modify the array you were
 * given, do not return a new one) using O(1) extra memory.
 *
 * EXAMPLES
 * Input: ['h','e','l','l','o']   Output: ['o','l','l','e','h']
 * Input: ['H','a','n','n','a','h']   Output: ['h','a','n','n','a','H']
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the input a string or an array of characters? (array; strings are immutable in JS,
 *   so a real string could not be reversed in place at all)
 * - Can it be empty? (yes -> nothing to do)
 * - Do I need to return it? (LeetCode says no, but returning it makes testing easier)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Copy the array, then write it back from the end: chars[i] = copy[n - 1 - i].
 * Correct, but uses an extra array, which the problem forbids.
 *
 * APPROACH 2 — Optimal (two pointers)   O(n) time, O(1) space
 * Put one pointer at the start and one at the end. Swap the two characters, move both
 * pointers toward the middle, stop when they meet or cross. Every character is visited once.
 *
 * Dry run on ['h','e','l','l','o']:
 *   left=0 right=4  swap h,o   -> ['o','e','l','l','h']
 *   left=1 right=3  swap e,l   -> ['o','l','l','e','h']
 *   left=2 right=2  left is not < right, stop
 *
 * EDGE CASES
 * - []          -> []  (loop never runs)
 * - ['a']       -> ['a']
 * - even length -> pointers cross; odd length -> pointers meet on the middle char
 */

function bruteForce(chars) {
  const copy = [...chars];
  for (let i = 0; i < chars.length; i++) {
    chars[i] = copy[chars.length - 1 - i];
  }
  return chars;
}

function optimal(chars) {
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    // swap without a temp variable using array destructuring
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(['h', 'e', 'l', 'l', 'o']), ['o', 'l', 'l', 'e', 'h']);
  assert.deepStrictEqual(solve(['H', 'a', 'n', 'n', 'a', 'h']), ['h', 'a', 'n', 'n', 'a', 'H']);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve(['a']), ['a']);
  assert.deepStrictEqual(solve(['a', 'b']), ['b', 'a']);

  // verify it really mutates the input array (in place)
  const input = ['x', 'y', 'z'];
  solve(input);
  assert.deepStrictEqual(input, ['z', 'y', 'x']);
}
console.log('✓ 01-reverse-string passed');

module.exports = { optimal, bruteForce };
