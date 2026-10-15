/**
 * String helpers you will rewrite in almost every string problem.
 *
 * Strings in JavaScript are immutable, so every helper here either:
 *   - converts to an array, works on it, and joins back, or
 *   - reads characters by index / char code without ever "changing" the string.
 *
 * n = length of the input string.
 */

// ---------- char code helpers ----------

/**
 * Map a lowercase letter to 0..25 ('a' -> 0, 'z' -> 25).
 * O(1) time, O(1) space.
 */
function toCharCodeIndex(ch) {
  return ch.charCodeAt(0) - 97; // 97 is 'a'
}

/**
 * Inverse of toCharCodeIndex (0 -> 'a').
 * O(1) time, O(1) space.
 */
function fromCharCodeIndex(index) {
  return String.fromCharCode(97 + index);
}

// ---------- reverse ----------

/**
 * Reverse a string. There is no String.prototype.reverse, so go through an array.
 * [...s] (not split('')) keeps emoji / surrogate pairs intact.
 * O(n) time, O(n) space (the array and the new string).
 */
function reverse(s) {
  return [...s].reverse().join('');
}

/**
 * Reverse a char array in place with two pointers.
 * O(n) time, O(1) extra space.
 */
function reverseInPlace(chars) {
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars;
}

// ---------- palindrome ----------

/**
 * Is s a palindrome? Two pointers walk inward while characters match.
 * options.alphanumericOnly = true ignores case and skips non letters/digits
 * ("A man, a plan, a canal: Panama" -> true).
 * O(n) time, O(1) space.
 */
function isPalindrome(s, options = {}) {
  const { alphanumericOnly = false } = options;
  const isAlnum = (ch) => /[a-z0-9]/i.test(ch);

  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (alphanumericOnly) {
      // skip characters we do not care about
      if (!isAlnum(s[left])) { left++; continue; }
      if (!isAlnum(s[right])) { right--; continue; }
    }
    const a = alphanumericOnly ? s[left].toLowerCase() : s[left];
    const b = alphanumericOnly ? s[right].toLowerCase() : s[right];
    if (a !== b) return false;
    left++;
    right--;
  }
  return true;
}

// ---------- frequency counting ----------

/**
 * Count every character into a Map (works for any characters).
 * O(n) time, O(k) space where k = number of distinct characters.
 */
function charFrequency(s) {
  const counts = new Map();
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  return counts;
}

/**
 * Count lowercase letters a-z into a fixed array of 26 slots.
 * Faster than a Map and the array itself can be joined into a hash key.
 * O(n) time, O(1) space (26 is a constant).
 */
function charFrequency26(s) {
  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - 97]++;
  }
  return counts;
}

/**
 * Are a and b anagrams (same letters, same counts)? Any characters allowed.
 * O(n) time, O(k) space.
 */
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const counts = charFrequency(a);
  for (const ch of b) {
    const remaining = counts.get(ch);
    if (!remaining) return false; // undefined or 0: b has a char a does not
    counts.set(ch, remaining - 1);
  }
  return true; // lengths equal and nothing went negative => all counts hit 0
}

// ---------- run-length compression ----------

/**
 * "aabccc" -> "a2bc3". Single characters keep no count (that is the LeetCode 443 style;
 * the other common variant writes "a2b1c3" - ask which one the interviewer wants).
 * O(n) time, O(n) space for the output parts.
 */
function compress(s) {
  const parts = [];
  let runStart = 0;
  for (let i = 1; i <= s.length; i++) {
    // when the run ends (next char differs, or we fell off the end) flush it
    if (i === s.length || s[i] !== s[runStart]) {
      const runLength = i - runStart;
      parts.push(s[runStart]);
      if (runLength > 1) parts.push(String(runLength));
      runStart = i;
    }
  }
  return parts.join('');
}

// ---------- building strings ----------

/**
 * Demo of the "collect into an array, join once" pattern.
 * Builds s repeated `times` times. O(n * times) time and space.
 * Compare with `let out = ''; out += s` in a loop, which is O(n^2) in theory.
 */
function buildString(s, times) {
  const parts = [];
  for (let i = 0; i < times; i++) parts.push(s);
  return parts.join('');
}

// ---------- self-test ----------
const assert = require('assert');

assert.strictEqual(toCharCodeIndex('a'), 0);
assert.strictEqual(toCharCodeIndex('z'), 25);
assert.strictEqual(fromCharCodeIndex(2), 'c');

assert.strictEqual(reverse('hello'), 'olleh');
assert.strictEqual(reverse(''), '');
assert.strictEqual(reverse('ab\u{1F600}'), '\u{1F600}ba'); // emoji survives
assert.deepStrictEqual(reverseInPlace(['a', 'b', 'c', 'd']), ['d', 'c', 'b', 'a']);

assert.strictEqual(isPalindrome('racecar'), true);
assert.strictEqual(isPalindrome('ab'), false);
assert.strictEqual(isPalindrome(''), true);
assert.strictEqual(isPalindrome('A man, a plan, a canal: Panama', { alphanumericOnly: true }), true);
assert.strictEqual(isPalindrome('race a car', { alphanumericOnly: true }), false);

assert.deepStrictEqual([...charFrequency('banana')], [['b', 1], ['a', 3], ['n', 2]]);
const counts = charFrequency26('abcabz');
assert.strictEqual(counts[0], 2);
assert.strictEqual(counts[25], 1);
assert.strictEqual(counts.reduce((sum, c) => sum + c, 0), 6);

assert.strictEqual(isAnagram('listen', 'silent'), true);
assert.strictEqual(isAnagram('rat', 'car'), false);
assert.strictEqual(isAnagram('a', 'ab'), false);
assert.strictEqual(isAnagram('', ''), true);

assert.strictEqual(compress('aabccc'), 'a2bc3');
assert.strictEqual(compress('abc'), 'abc');
assert.strictEqual(compress(''), '');
assert.strictEqual(compress('aaaaaaaaaaaa'), 'a12');

assert.strictEqual(buildString('ab', 3), 'ababab');
assert.strictEqual(buildString('x', 0), '');

console.log('✓ string-utils.js self-test passed');

module.exports = {
  toCharCodeIndex,
  fromCharCodeIndex,
  reverse,
  reverseInPlace,
  isPalindrome,
  charFrequency,
  charFrequency26,
  isAnagram,
  compress,
  buildString,
};
