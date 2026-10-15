/**
 * 09. Word Ladder II   (LeetCode 126 — Hard)
 *
 * PROBLEM
 * Like Word Ladder, but return ALL shortest transformation sequences from beginWord to
 * endWord (each step changes one letter, every intermediate word is in wordList).
 * Return [] if there is none.
 *
 * EXAMPLES
 * Input: begin = "hit", end = "cog", list = ["hot","dot","dog","lot","log","cog"]
 * Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
 * Input: same list without "cog"   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Order of the sequences? (any)
 * - Word length <= 5, list <= 500 (LeetCode) - still, the naive approach explodes
 *
 * APPROACH 1 — Brute force (BFS carrying whole paths)   exponential memory
 * BFS where each queue item is a full path. Mark words visited per LEVEL (not per push)
 * so several paths can reach the same word at the same depth. Simple, but the number
 * of partial paths can be huge. Good for small inputs and as a reference.
 *
 * APPROACH 2 — Optimal (BFS for distances, then DFS backwards)   O(N * L * 26 + paths)
 *   1. BFS from beginWord computing dist[word] (shortest number of steps). Stop once the
 *      level containing endWord is complete.
 *   2. DFS from endWord BACK to beginWord, only moving to neighbours whose dist is
 *      exactly one less. Every route found is a shortest path. Reverse each.
 * The BFS builds a "shortest-path DAG"; the DFS enumerates its paths and nothing else.
 *
 * Dry run hit -> cog:
 *   dist: hit 0, hot 1, dot 2, lot 2, dog 3, log 3, cog 4
 *   DFS from cog (4): neighbours with dist 3: dog, log
 *     dog -> dot (2) -> hot (1) -> hit (0)  => [hit,hot,dot,dog,cog]
 *     log -> lot (2) -> hot (1) -> hit (0)  => [hit,hot,lot,log,cog]
 *
 * EDGE CASES
 * - endWord not in list -> []
 * - beginWord in the list (ignore it as a target)
 * - many equal-length paths through the same middle word (the DAG approach shares work)
 */

function neighborsOf(word, dictionary) {
  const result = [];
  const letters = word.split('');
  for (let i = 0; i < letters.length; i++) {
    const original = letters[i];
    for (let code = 97; code <= 122; code++) {
      const letter = String.fromCharCode(code);
      if (letter === original) continue;
      letters[i] = letter;
      const candidate = letters.join('');
      if (dictionary.has(candidate)) result.push(candidate);
    }
    letters[i] = original;
  }
  return result;
}

function bruteForce(beginWord, endWord, wordList) {
  const dictionary = new Set(wordList);
  if (!dictionary.has(endWord)) return [];
  const results = [];
  let paths = [[beginWord]];
  const visited = new Set([beginWord]);
  while (paths.length && results.length === 0) {
    const nextPaths = [];
    const usedThisLevel = new Set();
    for (const path of paths) {
      const last = path[path.length - 1];
      for (const next of neighborsOf(last, dictionary)) {
        if (visited.has(next)) continue;          // reached at an earlier level
        usedThisLevel.add(next);
        const extended = [...path, next];
        if (next === endWord) results.push(extended);
        else nextPaths.push(extended);
      }
    }
    for (const w of usedThisLevel) visited.add(w); // mark after the level completes
    paths = nextPaths;
  }
  return results;
}

function optimal(beginWord, endWord, wordList) {
  const dictionary = new Set(wordList);
  if (!dictionary.has(endWord)) return [];
  dictionary.add(beginWord);

  // 1. BFS distances from beginWord
  const dist = new Map([[beginWord, 0]]);
  let frontier = [beginWord];
  let found = false;
  while (frontier.length && !found) {
    const next = [];
    for (const word of frontier) {
      for (const nb of neighborsOf(word, dictionary)) {
        if (dist.has(nb)) continue;
        dist.set(nb, dist.get(word) + 1);
        if (nb === endWord) found = true;
        next.push(nb);
      }
    }
    frontier = next;
  }
  if (!found) return [];

  // 2. DFS backwards from endWord along dist - 1 edges
  const results = [];
  const path = [endWord];
  function backtrack(word) {
    if (word === beginWord) {
      results.push([...path].reverse());
      return;
    }
    for (const nb of neighborsOf(word, dictionary)) {
      if (dist.get(nb) === dist.get(word) - 1) {   // only shortest-path predecessors
        path.push(nb);
        backtrack(nb);
        path.pop();
      }
    }
  }
  backtrack(endWord);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const norm = (paths) => paths.map((p) => p.join('>')).sort();
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    norm(solve('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog'])),
    norm([['hit', 'hot', 'dot', 'dog', 'cog'], ['hit', 'hot', 'lot', 'log', 'cog']]),
  );
  assert.deepStrictEqual(solve('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']), []);
  assert.deepStrictEqual(norm(solve('a', 'c', ['a', 'b', 'c'])), ['a>c']);
  assert.deepStrictEqual(norm(solve('red', 'tax', ['ted', 'tex', 'red', 'tax', 'tad', 'den', 'rex', 'pee'])),
    norm([['red', 'ted', 'tad', 'tax'], ['red', 'ted', 'tex', 'tax'], ['red', 'rex', 'tex', 'tax']]));
  assert.deepStrictEqual(solve('hot', 'dog', ['hot', 'dog']), []);
  assert.deepStrictEqual(norm(solve('hot', 'dog', ['hot', 'dot', 'dog', 'hog'])), ['hot>dot>dog', 'hot>hog>dog']);
}
console.log('✓ 09-word-ladder-ii passed');

module.exports = { optimal, bruteForce };
