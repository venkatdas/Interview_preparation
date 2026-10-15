/**
 * 08. Decode String   (LeetCode 394 — Medium)
 *
 * PROBLEM
 * Decode a string where k[encoded] means "repeat encoded k times". Brackets
 * can be nested. Digits are only used as repeat counts.
 *
 * EXAMPLES
 * Input: "3[a]2[bc]"      Output: "aaabcbc"
 * Input: "3[a2[c]]"       Output: "accaccacc"
 * Input: "2[abc]3[cd]ef"  Output: "abcabccdcdcdef"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can k have multiple digits, like 12[a]? (yes)
 * - Is the input always valid? (yes)
 * - How deep can nesting go? (arbitrary -> a stack, not a fixed set of variables)
 *
 * APPROACH 1 — Brute force (innermost-first rewriting)   O(n * maxDepth * output) time
 * Find the innermost k[...] (a bracket group with no '[' inside) using a regex,
 * expand it, repeat until there are no brackets. Each pass rescans the string.
 *
 * APPROACH 2 — Optimal (stack of [previousString, repeatCount])   O(output length) time, O(n) space
 * Keep `currentString` and `currentNumber` as we scan.
 *   digit  -> currentNumber = currentNumber * 10 + digit
 *   '['    -> push [currentString, currentNumber]; reset both (start a new scope)
 *   ']'    -> pop [prevString, count]; currentString = prevString + currentString.repeat(count)
 *   letter -> currentString += letter
 * The stack holds the "outside world" we must return to when a bracket closes.
 *
 * Dry run on "3[a2[c]]":
 *   '3'  number=3
 *   '['  push ["", 3]           string="" number=0
 *   'a'  string="a"
 *   '2'  number=2
 *   '['  push ["a", 2]          string="" number=0
 *   'c'  string="c"
 *   ']'  pop ["a",2] -> string = "a" + "c"*2 = "acc"
 *   ']'  pop ["",3]  -> string = "" + "acc"*3 = "accaccacc"
 *
 * EDGE CASES
 * - no brackets at all -> return as is
 * - multi-digit counts
 * - letters after the last bracket
 */

function bruteForce(s) {
  const innermost = /(\d+)\[([a-z]*)\]/;
  while (innermost.test(s)) {
    s = s.replace(innermost, (_, count, text) => text.repeat(Number(count)));
  }
  return s;
}

function optimal(s) {
  const stack = [];
  let currentString = '';
  let currentNumber = 0;

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      currentNumber = currentNumber * 10 + Number(ch); // multi-digit support
    } else if (ch === '[') {
      stack.push([currentString, currentNumber]); // save the outer context
      currentString = '';
      currentNumber = 0;
    } else if (ch === ']') {
      const [previousString, repeatCount] = stack.pop();
      currentString = previousString + currentString.repeat(repeatCount);
    } else {
      currentString += ch;
    }
  }
  return currentString;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('3[a]2[bc]'), 'aaabcbc');
  assert.strictEqual(solve('3[a2[c]]'), 'accaccacc');
  assert.strictEqual(solve('2[abc]3[cd]ef'), 'abcabccdcdcdef');
  assert.strictEqual(solve('abc'), 'abc');
  assert.strictEqual(solve('12[x]'), 'xxxxxxxxxxxx');
  assert.strictEqual(solve('2[2[2[a]]]'), 'aaaaaaaa');
  assert.strictEqual(solve(''), '');
  assert.strictEqual(solve('1[a]b'), 'ab');
}
console.log('✓ 08-decode-string passed');

module.exports = { optimal, bruteForce };
