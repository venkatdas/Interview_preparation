/**
 * The backtracking template, written once in a generic form, then specialised
 * into the three classic shapes: subsets, combinations, permutations.
 *
 * Generic idea (choose / explore / un-choose):
 *
 *   function backtrack(path) {
 *     if (isComplete(path))  { record(copy of path); return; }
 *     for (const choice of choices(path)) {
 *       if (!isAllowed(choice, path)) continue;   // prune
 *       path.push(choice);                         // choose
 *       backtrack(path);                           // explore
 *       path.pop();                                // un-choose
 *     }
 *   }
 *
 * `backtrack(options)` below is a reusable engine driven by callbacks. You
 * would NOT write it this way in an interview (too abstract), but it makes the
 * moving parts visible: every backtracking problem is just a different set of
 * {isComplete, getChoices, isAllowed, onChoose, onUnchoose}.
 */

// ---------- generic engine ----------
function backtrack({
  isComplete,          // (path) -> boolean         : should we record and stop?
  getChoices,          // (path, state) -> iterable : what can we try next?
  isAllowed = () => true,  // (choice, path, state) -> boolean : pruning rule
  onChoose = () => {},     // (choice, path, state) : extra state updates (e.g. used[i] = true)
  onUnchoose = () => {},   // (choice, path, state) : undo those updates
  shouldContinue = () => true, // (path, state) -> false to stop exploring below this node
  state = {},
}) {
  const results = [];

  function go(path) {
    if (isComplete(path, state)) {
      results.push([...path]);         // copy! path is reused by every frame
      return;
    }
    if (!shouldContinue(path, state)) return;   // early cutoff of a dead branch
    for (const choice of getChoices(path, state)) {
      if (!isAllowed(choice, path, state)) continue;
      path.push(choice);               // 1. choose
      onChoose(choice, path, state);
      go(path);                        // 2. explore
      onUnchoose(choice, path, state); // 3. un-choose
      path.pop();
    }
  }

  go([]);
  return results;
}

// ---------- 1. subsets: every node is an answer, only look forward ----------
function subsets(nums) {
  const results = [];
  function go(start, path) {
    results.push([...path]);                     // record EVERY node, not just leaves
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      go(i + 1, path);                           // only elements AFTER i -> no reorderings
      path.pop();
    }
  }
  go(0, []);
  return results;
}

// ---------- 2. combinations: like subsets but record only size-k paths ----------
function combinations(n, k) {
  const results = [];
  function go(start, path) {
    if (path.length === k) { results.push([...path]); return; }
    // prune: need (k - path.length) more items, only (n - i + 1) are left from i
    for (let i = start; i <= n - (k - path.length) + 1; i++) {
      path.push(i);
      go(i + 1, path);
      path.pop();
    }
  }
  go(1, []);
  return results;
}

// ---------- 3. permutations: order matters, use a `used` array ----------
function permutations(nums) {
  const results = [];
  const used = new Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) { results.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {      // always start at 0
      if (used[i]) continue;
      used[i] = true;  path.push(nums[i]);       // choose
      go(path);                                  // explore
      used[i] = false; path.pop();               // un-choose
    }
  }
  go([]);
  return results;
}

// ---------- 4. the same shapes, built from the generic engine ----------
// Combinations: the "look forward" rule becomes an isAllowed check:
// a choice is allowed only if it is bigger than the last element of path.
function combinationsViaEngine(n, k) {
  const numbers = Array.from({ length: n }, (_, i) => i + 1);
  return backtrack({
    isComplete: (path) => path.length === k,
    getChoices: () => numbers,
    isAllowed: (choice, path) => path.length === 0 || choice > path[path.length - 1],
  });
}

// Permutations: order matters, so every number is a choice at every level,
// and a `used` array (kept in state) blocks repeats within one path.
function permutationsViaEngine(nums) {
  return backtrack({
    isComplete: (path) => path.length === nums.length,
    getChoices: () => nums.map((_, i) => i),                 // choose INDICES so duplicates in nums work
    isAllowed: (index, path, state) => !state.used[index],
    onChoose: (index, path, state) => { state.used[index] = true; },
    onUnchoose: (index, path, state) => { state.used[index] = false; },
    state: { used: new Array(nums.length).fill(false) },
  }).map((indexPath) => indexPath.map((i) => nums[i]));    // translate indices back to values
}

// ---------- self-test ----------
const assert = require('assert');

// helper: compare arrays of arrays ignoring order
function sortedCopy(listOfLists) {
  return listOfLists.map((x) => [...x]).sort((a, b) => a.join(',').localeCompare(b.join(',')));
}

assert.deepStrictEqual(subsets([]), [[]]);
assert.deepStrictEqual(sortedCopy(subsets([1, 2, 3])),
  sortedCopy([[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]));
assert.strictEqual(subsets([1, 2, 3, 4, 5]).length, 32);

assert.deepStrictEqual(combinations(4, 2), [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]);
assert.deepStrictEqual(combinations(1, 1), [[1]]);
assert.deepStrictEqual(combinations(3, 3), [[1, 2, 3]]);
assert.strictEqual(combinations(10, 3).length, 120); // C(10,3)

assert.deepStrictEqual(permutations([]), [[]]);
assert.deepStrictEqual(permutations([1]), [[1]]);
assert.deepStrictEqual(permutations([1, 2, 3]),
  [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]);
assert.strictEqual(permutations([1, 2, 3, 4, 5]).length, 120);

assert.deepStrictEqual(permutationsViaEngine([1, 2, 3]), permutations([1, 2, 3]));
assert.deepStrictEqual(permutationsViaEngine(['a', 'b']), [['a', 'b'], ['b', 'a']]);
assert.deepStrictEqual(combinationsViaEngine(4, 2), combinations(4, 2));
assert.deepStrictEqual(combinationsViaEngine(5, 3).length, 10);

// the generic engine with a pruning rule: all 2-digit paths from [1,2,3] with sum < 5
const small = backtrack({
  isComplete: (path) => path.length === 2,
  getChoices: () => [1, 2, 3],
  isAllowed: (choice, path) => path.reduce((a, b) => a + b, 0) + choice < 5,
});
assert.deepStrictEqual(small, [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [3, 1]]);

console.log('✓ backtracking-template.js self-test passed');

module.exports = { backtrack, subsets, combinations, permutations, permutationsViaEngine, combinationsViaEngine };
