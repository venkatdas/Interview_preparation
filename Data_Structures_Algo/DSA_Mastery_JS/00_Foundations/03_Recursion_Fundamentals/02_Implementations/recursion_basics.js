/**
 * Recursion basics: base case, call stack, recursion tree, memoization.
 *
 * 1. factorial(n)              - the classic linear recursion
 * 2. sumArray(arr, i)          - recursion over an array with an INDEX (no slicing)
 * 3. traceCalls(fn)            - wraps a recursive function and records an indented call trace
 * 4. recursionTreeStats(n)     - counts calls and max depth of naive fib (the tree's size and height)
 * 5. fibMemo(n)                - the same tree with repeated subtrees removed
 */

// ---------- 1. factorial ----------
function factorial(n) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
  if (n <= 1) return 1;            // base case FIRST
  return n * factorial(n - 1);     // smaller problem + combine (multiply happens AFTER the call returns)
}

// ---------- 2. sum with an index ----------
// WHY an index: sumArray(arr.slice(1)) would copy the rest of the array on every call -> O(n^2).
function sumArray(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + sumArray(arr, i + 1);
}

// ---------- 3. call tracer ----------
// Returns { result, lines } where lines show entering/leaving each call, indented by depth.
// This is a printable picture of the call stack.
function traceCalls(name, body) {
  const lines = [];
  let depth = 0;
  function traced(...args) {
    lines.push(`${'  '.repeat(depth)}-> ${name}(${args.join(', ')})`);
    depth++;
    const result = body(traced, ...args); // body receives the traced version to recurse through
    depth--;
    lines.push(`${'  '.repeat(depth)}<- ${name}(${args.join(', ')}) = ${result}`);
    return result;
  }
  return { run: (...args) => ({ result: traced(...args), lines }) };
}

// ---------- 4. recursion tree stats ----------
function recursionTreeStats(n) {
  let calls = 0, maxDepth = 0;
  function fib(k, depth) {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (k < 2) return k;
    return fib(k - 1, depth + 1) + fib(k - 2, depth + 1);
  }
  const value = fib(n, 1);
  return { value, calls, maxDepth };
}

// ---------- 5. memoized fib ----------
function fibMemo(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, v);
  return v;
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  assert.strictEqual(factorial(0), 1);
  assert.strictEqual(factorial(5), 120);
  assert.throws(() => factorial(-1), RangeError);

  assert.strictEqual(sumArray([]), 0);
  assert.strictEqual(sumArray([1, 2, 3, 4]), 10);

  const { result, lines } = traceCalls('fact', (self, n) => (n <= 1 ? 1 : n * self(n - 1))).run(3);
  assert.strictEqual(result, 6);
  assert.deepStrictEqual(lines, [
    '-> fact(3)',
    '  -> fact(2)',
    '    -> fact(1)',
    '    <- fact(1) = 1',
    '  <- fact(2) = 2',
    '<- fact(3) = 6',
  ]);

  // fib(n) calls = 2*fib(n+1) - 1, depth = n
  const stats = recursionTreeStats(10);
  assert.strictEqual(stats.value, 55);
  assert.strictEqual(stats.calls, 2 * 89 - 1);
  assert.strictEqual(stats.maxDepth, 10);

  for (let n = 0; n <= 20; n++) assert.strictEqual(fibMemo(n), recursionTreeStats(n).value);
  assert.strictEqual(fibMemo(90), 2880067194370816000);

  // randomized: recursive sum equals reduce
  let seed = 3;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let t = 0; t < 200; t++) {
    const arr = Array.from({ length: Math.floor(rnd() * 50) }, () => Math.floor(rnd() * 100) - 50);
    assert.strictEqual(sumArray(arr), arr.reduce((a, b) => a + b, 0));
  }

  if (process.argv.includes('--show')) console.log(lines.join('\n'));
  console.log('✓ recursion_basics.js self-test passed');
}

module.exports = { factorial, sumArray, traceCalls, recursionTreeStats, fibMemo };
