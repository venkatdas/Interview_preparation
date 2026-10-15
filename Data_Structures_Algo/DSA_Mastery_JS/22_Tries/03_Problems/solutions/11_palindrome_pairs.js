/**
 * 11. Palindrome Pairs   (LeetCode 336 — Hard)
 *
 * PROBLEM
 * Given a list of UNIQUE words, return all pairs of indices [i, j] (i != j)
 * such that words[i] + words[j] is a palindrome.
 *
 * EXAMPLES
 * Input: ["abcd","dcba","lls","s","sssll"]
 * Output: [[0,1],[1,0],[3,2],[2,4]]
 *   Explanation: "abcddcba", "dcbaabcd", "slls", "llssssll"
 * Input: ["bat","tab","cat"]   Output: [[0,1],[1,0]]
 * Input: ["a",""]              Output: [[0,1],[1,0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Words unique? (yes)
 * - Empty string allowed? (yes - it pairs with every palindrome word, both orders)
 * - Order of output pairs? (any; tests sort)
 *
 * APPROACH 1 — Brute force   O(n^2 * L) time
 * Try every ordered pair (i, j), concatenate, check palindrome.
 *
 * APPROACH 2 — Optimal (Trie of reversed words)   O(n * L^2) time, O(n * L) space
 * Key insight: for words[i] + words[j] to be a palindrome, split words[i] into
 * prefix + suffix. If `suffix` is itself a palindrome, we need words[j] to be
 * the REVERSE of `prefix` (and symmetric cases where words[j] is longer).
 *
 * Build a trie of every word REVERSED. Each node stores:
 *   - wordIndex: index of the word ending here (or -1)
 *   - palindromeBelow: list of indices of words whose REMAINING part (below
 *     this node, in reversed-insert terms) is a palindrome
 * Then for each word w (index i), walk w forward through the trie:
 *   Case A: while walking, if we land on a node with wordIndex j (j != i) and
 *           the rest of w (not yet walked) is a palindrome -> pair [i, j].
 *           (w is the longer word: w = reverse(words[j]) + palindrome)
 *   Case B: after walking all of w, if we are at a node, every j in
 *           node.palindromeBelow -> pair [i, j].
 *           (words[j] is the longer word: words[j] = reverse(w) + palindrome,
 *            reversed that is palindrome + w... matches the trie walk)
 *
 * Dry run: words ["lls","s"]  trie of reversed: "sll", "s"
 *   walk "lls" (i=0): l? root has 's' only -> stop. At root before walking,
 *     palindromeBelow of root would contain nothing special. No pair from here
 *     in case A. Case B: path broke, nothing.
 *   walk "s" (i=1): root -s-> node. node.wordIndex=1 (itself, skip).
 *     node.palindromeBelow: when inserting "sll" reversed we recorded at node 's'
 *     that remaining "ll" is a palindrome -> index 0. Case B -> pair [1,0]
 *     -> "s" + "lls" = "slls". Correct.
 *
 * EDGE CASES
 * - "" in the list: pairs with every palindrome in both orders
 * - a word that is itself a palindrome does NOT pair with itself (i != j)
 * - two words that are reverses of each other -> both [i,j] and [j,i]
 */

function isPalindrome(str, left, right) {
  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++; right--;
  }
  return true;
}

function bruteForce(words) {
  const pairs = [];
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i === j) continue;
      const joined = words[i] + words[j];
      if (isPalindrome(joined, 0, joined.length - 1)) pairs.push([i, j]);
    }
  }
  return pairs;
}

function optimal(words) {
  const makeNode = () => ({ children: new Map(), wordIndex: -1, palindromeBelow: [] });
  const root = makeNode();

  // insert each word reversed; at every node record words whose unconsumed part is a palindrome
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    let node = root;
    for (let i = word.length - 1; i >= 0; i--) {
      // the part of `word` still to insert is word[0..i]; if it is a palindrome, remember it here
      if (isPalindrome(word, 0, i)) node.palindromeBelow.push(index);
      const ch = word[i];
      if (!node.children.has(ch)) node.children.set(ch, makeNode());
      node = node.children.get(ch);
    }
    node.palindromeBelow.push(index); // empty remainder is a palindrome too
    node.wordIndex = index;
  }

  const pairs = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let node = root;
    let k = 0;
    for (; k < word.length; k++) {
      // Case A: a shorter reversed word ends here and the rest of `word` is a palindrome
      if (node.wordIndex !== -1 && node.wordIndex !== i && isPalindrome(word, k, word.length - 1)) {
        pairs.push([i, node.wordIndex]);
      }
      node = node.children.get(word[k]);
      if (!node) break;
    }
    if (!node || k < word.length) continue; // path broke
    // Case B: fully walked `word`; longer words whose remainder is a palindrome
    for (const j of node.palindromeBelow) {
      if (j !== i) pairs.push([i, j]);
    }
  }
  return pairs;
}

// ---------- tests ----------
const assert = require('assert');
const sortPairs = (pairs) => [...pairs].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sortPairs(solve(['abcd', 'dcba', 'lls', 's', 'sssll'])),
    [[0, 1], [1, 0], [2, 4], [3, 2]]);
  assert.deepStrictEqual(sortPairs(solve(['bat', 'tab', 'cat'])), [[0, 1], [1, 0]]);
  assert.deepStrictEqual(sortPairs(solve(['a', ''])), [[0, 1], [1, 0]]);
  assert.deepStrictEqual(sortPairs(solve(['abc', 'xyz'])), []);
  assert.deepStrictEqual(sortPairs(solve(['a', 'b', 'c', 'ab', 'ba'])),
    [[0, 4], [1, 3], [3, 0], [3, 4], [4, 1], [4, 3]]); // aba, bab, aba, abba, bab, baab
  assert.deepStrictEqual(sortPairs(solve(['aba'])), []);
  assert.deepStrictEqual(sortPairs(solve(['', 'aba', 'x'])), [[0, 1], [0, 2], [1, 0], [2, 0]]);
}
// random cross-check against brute force
for (let round = 0; round < 100; round++) {
  const set = new Set();
  while (set.size < 6) {
    const len = Math.floor(Math.random() * 4);
    set.add(Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join(''));
  }
  const ws = [...set];
  assert.deepStrictEqual(sortPairs(optimal(ws)), sortPairs(bruteForce(ws)));
}
console.log('✓ 11-palindrome-pairs passed');

module.exports = { optimal, bruteForce };
