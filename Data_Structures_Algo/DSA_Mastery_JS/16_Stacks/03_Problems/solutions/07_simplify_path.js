/**
 * 07. Simplify Path   (LeetCode 71 — Medium)
 *
 * PROBLEM
 * Given an absolute Unix file path, return its canonical form:
 *   - starts with a single '/'
 *   - directories separated by exactly one '/'
 *   - no trailing '/' (except the root itself)
 *   - '.' (current dir) is removed, '..' (parent dir) goes up one level
 *   - going above the root stays at the root
 *
 * EXAMPLES
 * Input: "/home/"                 Output: "/home"
 * Input: "/../"                   Output: "/"        Explanation: can't go above root
 * Input: "/home//foo/"            Output: "/home/foo"
 * Input: "/a/./b/../../c/"        Output: "/c"
 * Input: "/a/...//b"              Output: "/a/.../b"  Explanation: "..." is a valid directory name
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Always absolute (starts with '/')? (yes)
 * - Are names like "..." or ".hidden" real directories? (yes - only exactly "." and ".." are special)
 *
 * APPROACH 1 — Brute force (string rewriting)   O(n^2) time
 * Repeatedly apply regex replacements: collapse "//", remove "/./", resolve
 * "/name/../". Loop until nothing changes. Fiddly and slow.
 *
 * APPROACH 2 — Optimal (split + stack of directory names)   O(n) time, O(n) space
 * Split on '/'. For each part:
 *   ""  or "."  -> ignore
 *   ".."        -> pop (if the stack isn't empty)
 *   anything    -> push (a directory name)
 * Join the stack with '/' and prepend '/'.
 *
 * Dry run on "/a/./b/../../c/":
 *   parts: ["", "a", ".", "b", "..", "..", "c", ""]
 *   "a"  push       [a]
 *   "."  skip
 *   "b"  push       [a,b]
 *   ".." pop        [a]
 *   ".." pop        []
 *   "c"  push       [c]
 *   result "/" + "c" = "/c"
 *
 * EDGE CASES
 * - "/" alone, "/../" -> "/"
 * - many consecutive slashes
 * - ".." when already at the root (pop on empty: just ignore)
 */

function bruteForce(path) {
  let prev = null;
  let current = path;
  while (prev !== current) {
    prev = current;
    current = current
      .replace(/\/{2,}/g, '/')              // collapse multiple slashes
      .replace(/\/\.(\/|$)/g, '/')          // remove /./
      .replace(/\/[^/]+\/\.\.(\/|$)/g, '/') // resolve /name/../
      .replace(/^\/\.\.(\/|$)/g, '/');      // /.. at root
  }
  if (current.length > 1 && current.endsWith('/')) current = current.slice(0, -1);
  return current;
}

function optimal(path) {
  const stack = [];
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      stack.pop(); // pop on empty array is a harmless no-op = stay at root
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('/home/'), '/home');
  assert.strictEqual(solve('/../'), '/');
  assert.strictEqual(solve('/home//foo/'), '/home/foo');
  assert.strictEqual(solve('/a/./b/../../c/'), '/c');
  assert.strictEqual(solve('/a/...//b'), '/a/.../b');
  assert.strictEqual(solve('/'), '/');
  assert.strictEqual(solve('/a/../../..'), '/');
  assert.strictEqual(solve('/.hidden/./x'), '/.hidden/x');
}
console.log('✓ 07-simplify-path passed');

module.exports = { optimal, bruteForce };
