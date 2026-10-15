/**
 * 18. Word Ladder   (LeetCode 127 — Hard)
 *
 * PROBLEM
 * Given beginWord, endWord and a wordList, a transformation sequence changes one letter
 * at a time, and every intermediate word must be in wordList. Return the LENGTH (number
 * of words) of the shortest sequence from beginWord to endWord, or 0 if none exists.
 *
 * EXAMPLES
 * Input: begin = "hit", end = "cog", list = ["hot","dot","dog","lot","log","cog"]
 * Output: 5   ("hit" -> "hot" -> "dot" -> "dog" -> "cog")
 * Input: same but list without "cog"   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - All words same length? (yes)
 * - beginWord need not be in the list; endWord must be (else 0)
 * - Lowercase letters only? (yes)
 *
 * This is an IMPLICIT GRAPH: node = word, edge = differ by one letter. Unweighted
 * shortest path -> BFS.
 *
 * APPROACH 1 — Brute force (build the explicit graph by comparing all pairs)
 *   O(N^2 * L) to build + O(N^2) BFS, N words of length L
 * Compare every pair of words character by character; connect them if exactly one
 * differs. Then BFS. Fine for a few hundred words, too slow for 5000.
 *
 * APPROACH 2 — Optimal (BFS generating neighbours on the fly)   O(N * L * 26) time
 * For the current word, try every position and every letter a-z. If the result is in the
 * word set (and unvisited), it is a neighbour. Remove words from the set when visited
 * (the set IS the visited structure). Level-by-level BFS; the level number is the answer.
 *
 * Dry run on hit -> cog:
 *   level 1: {hit}
 *   level 2: hot             (the only 1-letter change in the list)
 *   level 3: dot, lot
 *   level 4: dog, log
 *   level 5: cog  -> return 5
 *
 * (Bidirectional BFS is a further speedup: expand from both ends, always the smaller
 *  side. Mention it in the interview.)
 *
 * EDGE CASES
 * - endWord not in list -> 0
 * - beginWord === endWord (not in LeetCode constraints; we return 1 if end is in the list)
 * - no path -> 0
 */

function bruteForce(beginWord, endWord, wordList) {
  const words = [beginWord, ...wordList.filter((w) => w !== beginWord)];
  const index = new Map(words.map((w, i) => [w, i]));
  if (!index.has(endWord)) return 0;

  const oneApart = (a, b) => {
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && ++diff > 1) return false;
    return diff === 1;
  };
  const adj = words.map(() => []);
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (oneApart(words[i], words[j])) { adj[i].push(j); adj[j].push(i); }
    }
  }

  const target = index.get(endWord);
  const dist = new Array(words.length).fill(0);
  dist[0] = 1;
  const queue = [0];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    if (current === target) return dist[current];
    for (const next of adj[current]) {
      if (dist[next] === 0) { dist[next] = dist[current] + 1; queue.push(next); }
    }
  }
  return 0;
}

function optimal(beginWord, endWord, wordList) {
  const unvisited = new Set(wordList);
  if (!unvisited.has(endWord)) return 0;
  unvisited.delete(beginWord);

  let queue = [beginWord];
  let length = 1;                                    // beginWord counts as word #1
  while (queue.length) {
    const nextQueue = [];
    for (const word of queue) {
      if (word === endWord) return length;
      const letters = word.split('');
      for (let i = 0; i < letters.length; i++) {
        const original = letters[i];
        for (let code = 97; code <= 122; code++) {   // 'a'..'z'
          const letter = String.fromCharCode(code);
          if (letter === original) continue;
          letters[i] = letter;
          const candidate = letters.join('');
          if (unvisited.has(candidate)) {
            unvisited.delete(candidate);             // delete = mark visited
            nextQueue.push(candidate);
          }
        }
        letters[i] = original;                       // restore for the next position
      }
    }
    queue = nextQueue;
    length++;
  }
  return 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
  assert.strictEqual(solve('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']), 0);
  assert.strictEqual(solve('a', 'c', ['a', 'b', 'c']), 2);
  assert.strictEqual(solve('hot', 'dog', ['hot', 'dog']), 0);          // two letters differ
  assert.strictEqual(solve('hot', 'dog', ['hot', 'dot', 'dog']), 3);
  assert.strictEqual(solve('ab', 'ab', ['ab']), 1);
  assert.strictEqual(solve('red', 'tax', ['ted', 'tex', 'red', 'tax', 'tad', 'den', 'rex', 'pee']), 4);
}
console.log('✓ 18-word-ladder passed');

module.exports = { optimal, bruteForce };
