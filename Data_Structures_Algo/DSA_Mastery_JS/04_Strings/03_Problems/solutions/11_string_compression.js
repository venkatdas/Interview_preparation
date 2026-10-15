/**
 * 11. String Compression   (LeetCode 443 — Medium)
 *
 * PROBLEM
 * Given an array of characters, compress it IN PLACE: each run of a repeated character
 * becomes the character followed by the run length (omit the length when it is 1).
 * Return the new length. Runs of 10 or more produce multiple digit characters.
 * Use only O(1) extra space.
 *
 * EXAMPLES
 * Input: ['a','a','b','b','c','c','c']   Output: 6, array starts with ['a','2','b','2','c','3']
 * Input: ['a']                           Output: 1, ['a']
 * Input: ['a','b','b','b','b','b','b','b','b','b','b','b','b']   Output: 4, ['a','b','1','2']
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is it guaranteed that compression never makes the array longer? (a run of 1 writes
 *   1 char, a run of k >= 2 writes at most 1 + digits(k) <= k chars, so yes)
 * - Does the content past the returned length matter? (no)
 * - Write "1" for single chars? (no - that is the other variant)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Build the compressed string in a separate array, then copy it back over the input
 * and return its length. Simple, but violates the O(1) space requirement.
 *
 * APPROACH 2 — Optimal (read pointer + write pointer)   O(n) time, O(1) space
 * `read` scans runs; `write` marks where the next output char goes. For each run:
 * write the character, then (if length > 1) write each digit of the length.
 * `write` never overtakes `read` because the output of a run is never longer than the run.
 *
 * Dry run on ['a','a','b','b','c','c','c']:
 *   read=0: run of 'a' length 2 -> chars[0]='a', chars[1]='2'  write=2, read=2
 *   read=2: run of 'b' length 2 -> chars[2]='b', chars[3]='2'  write=4, read=4
 *   read=4: run of 'c' length 3 -> chars[4]='c', chars[5]='3'  write=6, read=7 = end
 *   return 6
 *
 * EDGE CASES
 * - []                -> 0
 * - ['a']             -> 1, no digit written
 * - run of 12         -> digits '1','2' written as separate chars
 * - no repeats 'abc'  -> unchanged, length 3
 */

function bruteForce(chars) {
  const out = [];
  let i = 0;
  while (i < chars.length) {
    let runEnd = i;
    while (runEnd < chars.length && chars[runEnd] === chars[i]) runEnd++;
    const runLength = runEnd - i;
    out.push(chars[i]);
    if (runLength > 1) out.push(...String(runLength));
    i = runEnd;
  }
  for (let k = 0; k < out.length; k++) chars[k] = out[k];
  return out.length;
}

function optimal(chars) {
  let write = 0;
  let read = 0;

  while (read < chars.length) {
    const currentChar = chars[read];
    let runLength = 0;
    // consume the whole run of currentChar
    while (read < chars.length && chars[read] === currentChar) {
      read++;
      runLength++;
    }

    chars[write++] = currentChar;
    if (runLength > 1) {
      // write the length one digit at a time ("12" -> '1','2')
      for (const digit of String(runLength)) {
        chars[write++] = digit;
      }
    }
  }
  return write;
}

// ---------- tests ----------
const assert = require('assert');
function check(solve, input, expectedLength, expectedPrefix) {
  const chars = [...input]; // copy: solve mutates its argument
  const length = solve(chars);
  assert.strictEqual(length, expectedLength);
  assert.deepStrictEqual(chars.slice(0, length), expectedPrefix);
}
for (const solve of [bruteForce, optimal]) {
  check(solve, ['a', 'a', 'b', 'b', 'c', 'c', 'c'], 6, ['a', '2', 'b', '2', 'c', '3']);
  check(solve, ['a'], 1, ['a']);
  check(solve, ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'], 4, ['a', 'b', '1', '2']);
  check(solve, [], 0, []);
  check(solve, ['a', 'b', 'c'], 3, ['a', 'b', 'c']);
  check(solve, ['a', 'a', 'a', 'b', 'a'], 4, ['a', '3', 'b', 'a']);
}
console.log('✓ 11-string-compression passed');

module.exports = { optimal, bruteForce };
