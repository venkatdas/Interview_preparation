/**
 * 08. Letter Combinations of a Phone Number   (LeetCode 17 — Medium)
 *
 * PROBLEM
 * Given a string of digits 2-9, return all letter combinations the number could
 * represent on an old phone keypad (2 = abc, 3 = def, ..., 9 = wxyz).
 *
 * EXAMPLES
 * Input: "23"   Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
 * Input: ""     Output: []
 * Input: "2"    Output: ["a","b","c"]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Digits 0 and 1 have no letters; can they appear? (no, 2-9 only)
 * - Length <= 4, so at most 4^4 = 256 results
 * - Empty input returns [] not [""] (LeetCode's choice; ask!)
 *
 * APPROACH 1 — Brute force (iterative cartesian product)   O(4^n * n) time
 * Start with [""]; for each digit, replace the list with every existing string
 * extended by every letter of that digit. BFS-style, no recursion. Honestly this is
 * also a fine answer; it's listed as "brute" only because it is the non-recursive form.
 *
 * APPROACH 2 — Optimal (Backtracking, build string position by position)   O(4^n * n), O(n) stack
 * go(index, current): if index === digits.length, record current. Otherwise for every
 * letter of digits[index], recurse with current + letter. Strings are immutable in JS,
 * so `current + letter` is a new string: nothing to undo.
 *
 * Dry run "23":
 *   go(0,"")
 *     'a' -> go(1,"a") -> 'd' "ad" record, 'e' "ae" record, 'f' "af" record
 *     'b' -> go(1,"b") -> "bd","be","bf"
 *     'c' -> go(1,"c") -> "cd","ce","cf"
 *
 * EDGE CASES
 * - "" -> []
 * - single digit -> its letters
 * - digits 7 and 9 have FOUR letters
 */

const KEYPAD = {
  2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl',
  6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz',
};

function bruteForce(digits) {
  if (digits.length === 0) return [];
  let combos = [''];
  for (const digit of digits) {
    const next = [];
    for (const prefix of combos) {
      for (const letter of KEYPAD[digit]) next.push(prefix + letter);
    }
    combos = next;
  }
  return combos;
}

function optimal(digits) {
  if (digits.length === 0) return [];
  const results = [];

  function go(index, current) {
    if (index === digits.length) { results.push(current); return; }
    for (const letter of KEYPAD[digits[index]]) {
      go(index + 1, current + letter);  // new string each time -> no un-choose needed
    }
  }

  go(0, '');
  return results;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve('23'), ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']);
  assert.deepStrictEqual(solve(''), []);
  assert.deepStrictEqual(solve('2'), ['a', 'b', 'c']);
  assert.deepStrictEqual(solve('7'), ['p', 'q', 'r', 's']);
  assert.strictEqual(solve('79').length, 16);
  assert.strictEqual(solve('2345').length, 81);
  assert.strictEqual(solve('9999').length, 256);
}
assert.deepStrictEqual(optimal('456'), bruteForce('456'));
console.log('✓ 08-letter-combinations-phone passed');

module.exports = { optimal, bruteForce };
