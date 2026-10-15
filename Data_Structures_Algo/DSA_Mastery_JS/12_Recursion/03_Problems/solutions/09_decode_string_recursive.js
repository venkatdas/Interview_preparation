/**
 * 09. Decode String (recursive descent)   (LeetCode 394 — Medium)
 *
 * PROBLEM
 * An encoded string uses the rule k[inner]: inner is repeated exactly k times.
 * Brackets can nest. Return the decoded string. (Solved with a stack in
 * 16_Stacks; here the call stack does that job for us.)
 *
 * EXAMPLES
 * "3[a]2[bc]"     -> "aaabcbc"
 * "3[a2[c]]"      -> "accaccacc"
 * "2[abc]3[cd]ef" -> "abcabccdcdcdef"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Input always valid? (yes). k can have several digits (e.g. 10[a]).
 * - Letters are lowercase; digits only appear as repeat counts.
 *
 * APPROACH 1 — Brute force (expand innermost bracket repeatedly)   O(output * depth) time
 * Find an innermost "k[letters]" with a regex, replace it with letters.repeat(k), and
 * repeat until no brackets remain. Simple, but rescans the whole string each round.
 *
 * APPROACH 2 — Optimal (recursive descent, shared index)   O(output) time, O(depth) stack
 * PROMISE: decode() reads from position i until the end or an unmatched ']' and returns
 * the decoded text for that stretch, leaving i just past what it consumed.
 *   letter  -> append it
 *   digit   -> read the whole number k, skip '[', inner = decode() (recursion for the
 *              nested part), skip ']', append inner.repeat(k)
 *   ']'     -> stop: our caller owns this bracket
 *
 * Dry run "3[a2[c]]":
 *   decode@0: read 3, skip '[', inner = decode@2
 *     decode@2: 'a' -> "a"; read 2, skip '[', inner = decode@5
 *       decode@5: 'c' -> "c"; sees ']' at 6 -> return "c"
 *     skip ']' -> "a" + "cc" = "acc"; sees ']' at 7 -> return "acc"
 *   skip ']' -> "acc" x 3 = "accaccacc"
 *
 * EDGE CASES
 * - multi-digit counts: "10[a]"
 * - letters after a group: "2[a]bc"
 * - empty string -> ""
 */

function bruteForce(s) {
  const innermost = /(\d+)\[([a-z]*)\]/;
  while (innermost.test(s)) s = s.replace(innermost, (_, k, inner) => inner.repeat(Number(k)));
  return s;
}

function optimal(s) {
  let i = 0;
  function decode() {
    let out = '';
    while (i < s.length && s[i] !== ']') {
      if (s[i] >= '0' && s[i] <= '9') {
        let k = 0;
        while (s[i] >= '0' && s[i] <= '9') k = k * 10 + Number(s[i++]);
        i++;                        // skip '['
        const inner = decode();     // nested part
        i++;                        // skip ']'
        out += inner.repeat(k);
      } else {
        out += s[i++];
      }
    }
    return out;
  }
  return decode();
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(optimal('3[a]2[bc]'), 'aaabcbc');
assert.strictEqual(optimal('3[a2[c]]'), 'accaccacc');
assert.strictEqual(optimal('2[abc]3[cd]ef'), 'abcabccdcdcdef');
assert.strictEqual(optimal('10[a]'), 'aaaaaaaaaa');
assert.strictEqual(optimal(''), '');
assert.strictEqual(optimal('abc'), 'abc');
let seed = 5;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
function randomEncoded(depth) {
  let out = '';
  const parts = 1 + Math.floor(rnd() * 3);
  for (let p = 0; p < parts; p++) {
    if (depth > 0 && rnd() < 0.5) out += `${1 + Math.floor(rnd() * 3)}[${randomEncoded(depth - 1)}]`;
    else out += 'abc'[Math.floor(rnd() * 3)];
  }
  return out;
}
for (let t = 0; t < 200; t++) {
  const enc = randomEncoded(3);
  assert.strictEqual(optimal(enc), bruteForce(enc), enc);
}
console.log('✓ 09_decode_string_recursive passed');

module.exports = { optimal, bruteForce };
