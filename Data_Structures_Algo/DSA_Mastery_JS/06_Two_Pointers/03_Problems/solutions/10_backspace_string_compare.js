/**
 * 10. Backspace String Compare   (LeetCode 844 — Easy)
 *
 * PROBLEM
 * Given two strings s and t where '#' means backspace, return true if they are equal
 * after being typed into empty text editors. Backspacing an empty editor does nothing.
 *
 * EXAMPLES
 * Input: s = "ab#c", t = "ad#c"     Output: true    Explanation: both become "ac"
 * Input: s = "ab##", t = "c#d#"     Output: true    Explanation: both become ""
 * Input: s = "a#c", t = "b"         Output: false   Explanation: "c" vs "b"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can '#' appear when the editor is empty? (yes, it's a no-op)
 * - Follow-up: can you do O(n) time with O(1) space? (that is the two-pointer solution)
 *
 * APPROACH 1 — Brute force (build with a stack)   O(n + m) time, O(n + m) space
 * Simulate typing: push characters, pop on '#'. Compare the two final strings.
 * Perfectly good answer, but uses extra space. (See 16_Stacks.)
 *
 * APPROACH 2 — Optimal (two pointers from the BACK)   O(n + m) time, O(1) space
 * A backspace deletes the character BEFORE it, so reading forwards we don't know if a
 * character survives. Reading BACKWARDS we do: count '#'s as "pending skips", and every
 * normal character either gets skipped (skips > 0) or is a real, surviving character.
 * Walk both strings from the end simultaneously; each time both pointers land on a
 * surviving character, compare. If one string runs out before the other, false.
 *
 * Dry run on s = "ab#c", t = "ad#c":
 *   i=3 'c' survives | j=3 'c' survives -> equal, i=2, j=2
 *   i=2 '#' skip=1, i=1 'b' skipped, skip=0, i=0 'a' survives
 *   j=2 '#' skip=1, j=1 'd' skipped, j=0 'a' survives -> equal
 *   i=-1, j=-1 -> both exhausted -> true
 *
 * EDGE CASES
 * - Both reduce to "" -> true
 * - More '#' than characters -> fine
 * - "a##c" vs "#a#c": both "c"
 * - Different lengths but same result
 */

function bruteForce(s, t) {
  const type = (str) => {
    const editor = [];
    for (const ch of str) {
      if (ch === '#') editor.pop();
      else editor.push(ch);
    }
    return editor.join('');
  };
  return type(s) === type(t);
}

// Move index backwards to the next character that survives backspacing.
// Returns the index, or -1 if none.
function nextSurvivingIndex(str, index) {
  let pendingSkips = 0;
  while (index >= 0) {
    if (str[index] === '#') {
      pendingSkips++;
    } else if (pendingSkips > 0) {
      pendingSkips--; // this character was deleted by a later '#'
    } else {
      break; // a real character
    }
    index--;
  }
  return index;
}

function optimal(s, t) {
  let i = s.length - 1;
  let j = t.length - 1;

  while (i >= 0 || j >= 0) {
    i = nextSurvivingIndex(s, i);
    j = nextSurvivingIndex(t, j);

    if (i < 0 && j < 0) return true;          // both finished at the same time
    if (i < 0 || j < 0) return false;         // one finished early
    if (s[i] !== t[j]) return false;          // surviving chars differ

    i--;
    j--;
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('ab#c', 'ad#c'), true);
  assert.strictEqual(solve('ab##', 'c#d#'), true);
  assert.strictEqual(solve('a#c', 'b'), false);
  assert.strictEqual(solve('a##c', '#a#c'), true);
  assert.strictEqual(solve('', ''), true);
  assert.strictEqual(solve('###', ''), true);
  assert.strictEqual(solve('bxj##tw', 'bxo#j##tw'), true);
  assert.strictEqual(solve('ab', 'a'), false);
  assert.strictEqual(solve('xywrrmp', 'xywrrmu#p'), true);
}
console.log('✓ 10-backspace-string-compare passed');

module.exports = { optimal, bruteForce };
