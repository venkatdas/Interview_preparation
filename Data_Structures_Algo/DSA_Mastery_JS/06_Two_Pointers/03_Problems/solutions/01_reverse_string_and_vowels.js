/**
 * 01. Reverse String & Reverse Vowels of a String   (LeetCode 344 — Easy, LeetCode 345 — Easy)
 *
 * PROBLEM
 * (a) Reverse String: given an array of characters, reverse it IN PLACE with O(1) extra memory.
 * (b) Reverse Vowels: given a string, reverse only the vowels (a, e, i, o, u, any case)
 *     and leave every other character where it is.
 *
 * EXAMPLES
 * (a) Input: ["h","e","l","l","o"]   Output: ["o","l","l","e","h"]
 * (b) Input: "hello"                  Output: "holle"
 * (b) Input: "leetcode"               Output: "leotcede"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Must it be in place? (yes for 344; strings are immutable in JS so 345 builds an array)
 * - Are uppercase vowels vowels? (yes: "aA" -> "Aa")
 * - Is 'y' a vowel? (no)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * (a) Build a new array by reading from the end. (b) Collect the vowels into a list,
 * then walk the string again and hand them out in reverse order. Both use extra space.
 *
 * APPROACH 2 — Optimal (opposite-end pointers, swap)   O(n) time, O(1) extra space
 * (a) left = 0, right = n - 1; swap, move both inward, stop when they cross.
 * (b) Same, but each pointer first SKIPS forward/backward until it is on a vowel.
 *     Then swap the two vowels and move both.
 *
 * Dry run (b) on "hello":
 *   left=0 'h' not vowel -> left=1 'e'
 *   right=4 'o' vowel
 *   swap -> "hollo"? no: swap positions 1 and 4: h,o,l,l,e -> "holle"
 *   left=2, right=3: 'l','l' both skipped, pointers cross -> done
 *
 * EDGE CASES
 * - Empty string / array
 * - No vowels at all -> unchanged
 * - One vowel -> unchanged
 * - Odd length: middle element stays
 */

const VOWELS = new Set('aeiouAEIOU');

function bruteForceReverse(chars) {
  const copy = [];
  for (let i = chars.length - 1; i >= 0; i--) copy.push(chars[i]);
  for (let i = 0; i < chars.length; i++) chars[i] = copy[i]; // write back so caller sees it
  return chars;
}

function optimalReverse(chars) {
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars;
}

function bruteForceVowels(s) {
  const vowels = [];
  for (const ch of s) if (VOWELS.has(ch)) vowels.push(ch);
  let result = '';
  for (const ch of s) result += VOWELS.has(ch) ? vowels.pop() : ch;
  return result;
}

function optimalVowels(s) {
  const chars = [...s]; // strings are immutable in JS; work on an array
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    // park each pointer on a vowel
    while (left < right && !VOWELS.has(chars[left])) left++;
    while (left < right && !VOWELS.has(chars[right])) right--;
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars.join('');
}

// expose a single pair of names in the folder's convention
const bruteForce = { reverse: bruteForceReverse, vowels: bruteForceVowels };
const optimal = { reverse: optimalReverse, vowels: optimalVowels };

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve.reverse(['h', 'e', 'l', 'l', 'o']), ['o', 'l', 'l', 'e', 'h']);
  assert.deepStrictEqual(solve.reverse(['a']), ['a']);
  assert.deepStrictEqual(solve.reverse([]), []);
  assert.deepStrictEqual(solve.reverse(['a', 'b']), ['b', 'a']);

  assert.strictEqual(solve.vowels('hello'), 'holle');
  assert.strictEqual(solve.vowels('leetcode'), 'leotcede');
  assert.strictEqual(solve.vowels('xyz'), 'xyz');
  assert.strictEqual(solve.vowels(''), '');
  assert.strictEqual(solve.vowels('aA'), 'Aa');
  assert.strictEqual(solve.vowels('a'), 'a');
}
console.log('✓ 01-reverse-string-and-vowels passed');

module.exports = { optimal, bruteForce };
