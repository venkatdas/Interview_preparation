/**
 * 09. Encode and Decode Strings   (LeetCode 271 — Medium)
 *
 * PROBLEM
 * Design encode(list) -> string and decode(string) -> list so that
 * decode(encode(list)) returns the original list of strings, for ANY strings
 * (they may contain any character, including whatever separator you pick).
 *
 * EXAMPLES
 * Input: ["hello","world"]   encode -> "5#hello5#world"   decode -> ["hello","world"]
 * Input: [""]                encode -> "0#"               decode -> [""]
 * Input: []                  encode -> ""                 decode -> []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can strings contain any character, including my delimiter? (yes, that is the point)
 * - Can the list contain empty strings? (yes; must round-trip)
 * - Is the empty list distinguishable from [""]? (yes: "" vs "0#")
 *
 * APPROACH 1 — Brute force   O(total length) time, O(total) space
 * Join with a separator that is "unlikely" to appear, e.g. a rare Unicode char.
 * Breaks as soon as an input contains that character. We implement an escaping variant
 * instead: escape '\' as '\\' and ',' as '\,', then join with ','. Correct, but decoding
 * needs a character-by-character scan with escape handling.
 *
 * APPROACH 2 — Optimal (length prefix)   O(total length) time, O(total) space
 * Write each string as "<length>#<string>". The decoder reads digits up to the '#',
 * knows exactly how many characters to take, and jumps over them - so it never looks
 * INSIDE a string for a delimiter. That is why '#' inside the data is harmless.
 *
 * Dry run decoding "5#hello2#hi":
 *   i=0: read "5" up to '#' -> length 5 -> take "hello", i = 2 + 5 = 7
 *   i=7: read "2" up to '#' -> length 2 -> take "hi",    i = 9 + 2 = 11 = end
 *   ["hello","hi"]
 *
 * EDGE CASES
 * - [""]          -> "0#" -> [""]
 * - ["#", "1#"]   -> "1##2#1#" decodes correctly because lengths drive the parsing
 * - multi-digit lengths ("12#...") handled by scanning for '#'
 * - this is the format used by many real protocols (netstrings, HTTP Content-Length)
 */

// ---------- Approach 1: escaping ----------
function bruteForce() {
  function encode(strs) {
    return strs
      .map((s) => s.replace(/\\/g, '\\\\').replace(/,/g, '\\,') + ',')
      .join('');
  }
  function decode(encoded) {
    const result = [];
    let current = [];
    for (let i = 0; i < encoded.length; i++) {
      const ch = encoded[i];
      if (ch === '\\') {
        current.push(encoded[i + 1]); // escaped char: take the next one literally
        i++;
      } else if (ch === ',') {
        result.push(current.join(''));
        current = [];
      } else {
        current.push(ch);
      }
    }
    return result; // every string was flushed by its terminating ','
  }
  return { encode, decode };
}

// ---------- Approach 2: length prefix ----------
function encode(strs) {
  const parts = [];
  for (const s of strs) parts.push(`${s.length}#${s}`);
  return parts.join('');
}

function decode(encoded) {
  const result = [];
  let i = 0;
  while (i < encoded.length) {
    const hashIndex = encoded.indexOf('#', i);        // end of the length field
    const length = Number(encoded.slice(i, hashIndex));
    const start = hashIndex + 1;
    result.push(encoded.slice(start, start + length)); // take exactly `length` chars
    i = start + length;                                // jump past the string
  }
  return result;
}

function optimal() {
  return { encode, decode };
}

// ---------- tests ----------
const assert = require('assert');
const cases = [
  ['hello', 'world'],
  [''],
  [],
  ['#', '1#', '12#abc'],
  ['a,b', '\\', ',', ''],
  ['multi\nline', '  spaces  '],
  ['\u{1F600} emoji (surrogate pair, length 2)', 'x'.repeat(100)],
];
for (const codec of [bruteForce(), optimal()]) {
  for (const list of cases) {
    assert.deepStrictEqual(codec.decode(codec.encode(list)), list);
  }
}
assert.strictEqual(encode(['hello', 'world']), '5#hello5#world');
assert.strictEqual(encode(['']), '0#');
assert.strictEqual(encode([]), '');
console.log('✓ 09-encode-and-decode-strings passed');

module.exports = { optimal, bruteForce, encode, decode };
