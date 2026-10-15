/**
 * The call stack limit and how to escape it.
 *
 * 1. measureMaxDepth()            - recurse until RangeError and report the depth reached
 * 2. sumToTail(n, acc)            - tail-recursive; still overflows because V8 has no TCO
 * 3. sumToLoop(n)                 - the loop every tail recursion becomes
 * 4. deepCountExplicit(nested)    - recursion over nested arrays rewritten with an explicit stack
 * 5. postorderFrames(tree)        - GENERAL conversion: frames with a "stage" (work after the call)
 * 6. trampoline(fn)               - run tail calls returned as thunks in a loop
 */

// ---------- 1. measure ----------
function measureMaxDepth() {
  let depth = 0;
  function dive() { depth++; dive(); }
  try { dive(); } catch (e) { if (!(e instanceof RangeError)) throw e; }
  return depth;
}

// ---------- 2. tail recursion (not optimized in V8) ----------
function sumToTail(n, acc = 0) {
  if (n === 0) return acc;
  return sumToTail(n - 1, acc + n); // a tail call: nothing left to do after it... V8 keeps the frame anyway
}

// ---------- 3. loop version ----------
function sumToLoop(n) {
  let acc = 0;
  while (n > 0) { acc += n; n--; } // tail recursion = "update the arguments and jump to the top"
  return acc;
}

// ---------- 4. explicit stack (easy case: order does not matter) ----------
function deepCountExplicit(nested) {
  let count = 0;
  const stack = [nested];
  while (stack.length) {
    const x = stack.pop();
    if (Array.isArray(x)) for (const y of x) stack.push(y);
    else count++;
  }
  return count;
}

// ---------- 5. general conversion with frames ----------
// Recursive original:
//   function post(node, out) { if (!node) return; post(node.left); post(node.right); out.push(node.val); }
// The push happens AFTER both calls, so each frame must remember how far it got.
function postorderFrames(root) {
  const out = [];
  const stack = root ? [{ node: root, stage: 0 }] : [];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const { node } = frame;
    if (frame.stage === 0) {            // just entered: "call" left
      frame.stage = 1;
      if (node.left) stack.push({ node: node.left, stage: 0 });
    } else if (frame.stage === 1) {     // left returned: "call" right
      frame.stage = 2;
      if (node.right) stack.push({ node: node.right, stage: 0 });
    } else {                            // both returned: do the work, then "return"
      out.push(node.val);
      stack.pop();
    }
  }
  return out;
}

function postorderRecursive(node, out = []) {
  if (!node) return out;
  postorderRecursive(node.left, out);
  postorderRecursive(node.right, out);
  out.push(node.val);
  return out;
}

// ---------- 6. trampoline ----------
function trampoline(fn) {
  return function trampolined(...args) {
    let result = fn(...args);
    while (typeof result === 'function') result = result(); // keep bouncing
    return result;
  };
}

// Example: tail-recursive sum that returns thunks instead of calling itself.
const sumToTrampolined = trampoline(function step(n, acc = 0) {
  return n === 0 ? acc : () => step(n - 1, acc + n);
});

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  const depth = measureMaxDepth();
  assert.ok(depth > 1000, 'Node allows at least a few thousand frames');
  assert.ok(depth < 1e6, 'but nowhere near a million');
  console.log(`  max recursion depth on this machine: ~${depth} frames`);

  // No tail call optimization in V8: the tail-recursive version overflows on 1e6.
  assert.strictEqual(sumToTail(1000), 500500);
  assert.throws(() => sumToTail(1e6), RangeError);
  assert.strictEqual(sumToLoop(1e6), 500000500000);
  assert.strictEqual(sumToTrampolined(1e6), 500000500000);

  // deep nesting: explicit stack is fine
  let deep = [1];
  for (let i = 0; i < 200000; i++) deep = [deep, 1];
  assert.strictEqual(deepCountExplicit(deep), 200001);

  // general frame conversion matches recursion on random trees
  let seed = 5;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let id = 0;
  const gen = d => (d === 0 || rnd() < 0.25 ? null : { val: id++, left: gen(d - 1), right: gen(d - 1) });
  for (let t = 0; t < 200; t++) {
    const tree = gen(6);
    assert.deepStrictEqual(postorderFrames(tree), postorderRecursive(tree));
  }
  // a path-shaped tree 100k deep: recursion would overflow, frames do not
  let path = null;
  for (let i = 0; i < 100000; i++) path = { val: i, left: path, right: null };
  assert.strictEqual(postorderFrames(path).length, 100000);
  assert.throws(() => postorderRecursive(path), RangeError);

  console.log('✓ stack_depth.js self-test passed');
}

module.exports = { measureMaxDepth, sumToTail, sumToLoop, deepCountExplicit, postorderFrames, postorderRecursive, trampoline, sumToTrampolined };
