/**
 * JavaScript cheat sheet for DSA, verified with asserts.
 *
 * Every claim in the README is checked here. If you are unsure how something in JS behaves,
 * find the section below and read the assert. Run: node js-cheatsheet.js
 */
const assert = require('assert');

// ---------- 1. Arrays ----------

// creation
assert.deepStrictEqual(new Array(3).fill(0), [0, 0, 0]);
assert.deepStrictEqual(Array.from({ length: 4 }, (_, i) => i * i), [0, 1, 4, 9]);
assert.deepStrictEqual(Array.from('abc'), ['a', 'b', 'c']);
assert.deepStrictEqual([...Array(3).keys()], [0, 1, 2]);

// new Array(n) creates HOLES; map skips them, fill does not
assert.deepStrictEqual(new Array(2).map(() => 1), [, ,]); // still two holes
assert.deepStrictEqual(new Array(2).fill(0).map(() => 1), [1, 1]);

// 2D array trap: fill([]) shares ONE inner array
const sharedRows = new Array(3).fill([]);
sharedRows[0].push('x');
assert.deepStrictEqual(sharedRows, [['x'], ['x'], ['x']]); // all three changed!
const separateRows = Array.from({ length: 3 }, () => []);
separateRows[0].push('x');
assert.deepStrictEqual(separateRows, [['x'], [], []]);     // correct
const grid = Array.from({ length: 2 }, () => new Array(3).fill(0));
grid[0][1] = 5;
assert.deepStrictEqual(grid, [[0, 5, 0], [0, 0, 0]]);

// destructuring and swap
const [first, second, ...rest] = [1, 2, 3, 4];
assert.strictEqual(first, 1);
assert.strictEqual(second, 2);
assert.deepStrictEqual(rest, [3, 4]);
const swap = [1, 2];
[swap[0], swap[1]] = [swap[1], swap[0]];
assert.deepStrictEqual(swap, [2, 1]);

// sort trap: default is STRING order
assert.deepStrictEqual([10, 9, 1].sort(), [1, 10, 9]);
assert.deepStrictEqual([10, 9, 1].sort((x, y) => x - y), [1, 9, 10]);
assert.deepStrictEqual([10, 9, 1].sort((x, y) => y - x), [10, 9, 1]);
// sort mutates and returns the same array
const toSort = [3, 1, 2];
const sortedRef = toSort.sort((x, y) => x - y);
assert.strictEqual(sortedRef, toSort);
assert.deepStrictEqual(toSort, [1, 2, 3]);
// keep original with a copy
const keep = [3, 1, 2];
const sortedCopy = [...keep].sort((x, y) => x - y);
assert.deepStrictEqual(keep, [3, 1, 2]);
assert.deepStrictEqual(sortedCopy, [1, 2, 3]);
// tie-break comparator (sort is stable, but explicit tie-break is clearer)
const people = [{ name: 'bo', age: 30 }, { name: 'al', age: 30 }, { name: 'cy', age: 20 }];
people.sort((p, q) => p.age - q.age || p.name.localeCompare(q.name));
assert.deepStrictEqual(people.map((p) => p.name), ['cy', 'al', 'bo']);

// slice copies, splice mutates
const s = [1, 2, 3, 4, 5];
assert.deepStrictEqual(s.slice(1, 3), [2, 3]);
assert.deepStrictEqual(s.slice(-2), [4, 5]);
assert.deepStrictEqual(s, [1, 2, 3, 4, 5]); // unchanged
assert.deepStrictEqual(s.splice(1, 2), [2, 3]); // returns removed
assert.deepStrictEqual(s, [1, 4, 5]);           // mutated
s.splice(1, 0, 9);                               // insert without removing
assert.deepStrictEqual(s, [1, 9, 4, 5]);

// handy methods
assert.strictEqual([1, 2, 3].at(-1), 3);
assert.strictEqual([1, 2, 3].indexOf(5), -1);
assert.strictEqual([1, 2, 3].includes(2), true);
assert.strictEqual([5, 6, 7].findIndex((x) => x > 5), 1);
assert.deepStrictEqual([[1, [2]], [3]].flat(Infinity), [1, 2, 3]);
assert.strictEqual([1, 2, 3].reduce((acc, x) => acc + x, 0), 6);
assert.strictEqual([1, 2].every((x) => x > 0), true);
assert.strictEqual([1, 2].some((x) => x > 1), true);
assert.strictEqual(['a', 'b'].join('-'), 'a-b');
// const prevents reassignment, not mutation
const mutable = [];
mutable.push(1);
assert.deepStrictEqual(mutable, [1]);
// arr.length = 0 empties in place
const emptyMe = [1, 2, 3];
const sameRef = emptyMe;
emptyMe.length = 0;
assert.deepStrictEqual(sameRef, []);

// ---------- 2. Strings ----------
const str = 'hello';
assert.strictEqual(str[1], 'e');
assert.strictEqual(str.charCodeAt(0), 104);
assert.strictEqual('a'.charCodeAt(0), 97);
assert.strictEqual('z'.charCodeAt(0), 122);
assert.strictEqual('A'.charCodeAt(0), 65);
assert.strictEqual('0'.charCodeAt(0), 48);
assert.strictEqual(String.fromCharCode(97), 'a');
assert.strictEqual('c'.charCodeAt(0) - 'a'.charCodeAt(0), 2); // index into 26-slot array

// immutability: assignment silently does nothing (throws only in strict mode)
let immutable = 'abc';
try { immutable[0] = 'z'; } catch (error) { /* strict mode throws TypeError */ }
assert.strictEqual(immutable, 'abc');

assert.deepStrictEqual('abc'.split(''), ['a', 'b', 'c']);
assert.strictEqual(['a', 'b'].join(''), 'ab');
assert.strictEqual('hello'.slice(1, 3), 'el');
assert.strictEqual('hello'.indexOf('l'), 2);
assert.strictEqual('hello'.includes('ell'), true);
assert.strictEqual('hello'.startsWith('he'), true);
assert.strictEqual('ab'.repeat(3), 'ababab');
assert.strictEqual('hello'.replace('l', 'L'), 'heLlo');      // only first
assert.strictEqual('hello'.replaceAll('l', 'L'), 'heLLo');   // all
assert.strictEqual('42'.padStart(5, '0'), '00042');
assert.strictEqual('  hi '.trim(), 'hi');

// build with array + join
const pieces = [];
for (let i = 0; i < 5; i++) pieces.push(String(i));
assert.strictEqual(pieces.join(''), '01234');

// comparison is by char code
assert.strictEqual('apple' < 'banana', true);
assert.strictEqual('Zebra' < 'apple', true);  // uppercase codes are smaller
assert.strictEqual('10' < '9', true);         // string compare!
assert.strictEqual(Number('10') < 9, false);
assert.strictEqual('b'.localeCompare('a'), 1);

// Unicode: an emoji (written here as the escape \u{1F600}) is two UTF-16 code units
assert.strictEqual('\u{1F600}'.length, 2);
assert.strictEqual([...'\u{1F600}'].length, 1);
assert.strictEqual('\u{1F600}'.split('').length, 2);  // broken halves

// template literal as a grid key
const row = 2;
const col = 3;
assert.strictEqual(`${row},${col}`, '2,3');

// ---------- 3. Map vs Object vs Set ----------
const map = new Map();
map.set(1, 'one').set('1', 'string one').set(NaN, 'nan');
assert.strictEqual(map.get(1), 'one');
assert.strictEqual(map.get('1'), 'string one'); // number and string are different keys
assert.strictEqual(map.get(NaN), 'nan');
assert.strictEqual(map.size, 3);
assert.strictEqual(map.has(2), false);
assert.deepStrictEqual([...map.keys()], [1, '1', NaN]); // insertion order

const obj = {};
obj[1] = 'one';
obj['1'] = 'string one';
assert.strictEqual(obj[1], 'string one'); // same key: numbers become strings
assert.strictEqual(Object.keys(obj).length, 1);
assert.strictEqual('constructor' in {}, true);                // prototype pollution trap
assert.strictEqual(Object.hasOwn({}, 'constructor'), false);  // safe check
// integer-like keys are ordered first in objects
assert.deepStrictEqual(Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }), ['1', '2', 'b', 'a']);

// counting idiom
const counts = new Map();
for (const ch of 'banana') counts.set(ch, (counts.get(ch) ?? 0) + 1);
assert.deepStrictEqual([...counts], [['b', 1], ['a', 3], ['n', 2]]);

const set = new Set([1, 2, 2, 3]);
assert.strictEqual(set.size, 3);
set.add(4);
set.delete(1);
assert.strictEqual(set.has(2), true);
assert.deepStrictEqual([...set], [2, 3, 4]);
// arrays as keys compare by reference, so stringify
const visited = new Set();
visited.add([1, 2]);
assert.strictEqual(visited.has([1, 2]), false); // different reference!
visited.add('1,2');
assert.strictEqual(visited.has('1,2'), true);

// ---------- 4. Numbers ----------
assert.strictEqual(Number.MAX_SAFE_INTEGER, 9007199254740991);
assert.strictEqual(2 ** 53 === 2 ** 53 + 1, true);  // precision lost
assert.strictEqual(Number.isSafeInteger(2 ** 53), false);

// BigInt
assert.strictEqual(2n ** 64n, 18446744073709551616n);
assert.strictEqual(typeof 2n, 'bigint');
assert.throws(() => 1n + 1, TypeError);             // cannot mix
assert.strictEqual(BigInt(5) * 3n, 15n);
assert.strictEqual(Number(15n), 15);

// integer division
assert.strictEqual(Math.floor(7 / 2), 3);
assert.strictEqual(Math.trunc(-7 / 2), -3);
assert.strictEqual(Math.floor(-7 / 2), -4);          // floor goes toward -infinity
assert.strictEqual((-7 / 2) | 0, -3);                // bitwise truncates
assert.strictEqual((7 / 2) >> 0, 3);
assert.strictEqual((2 ** 31) | 0, -2147483648);      // bitwise breaks above 2^31

// modulo with negatives
assert.strictEqual(-7 % 3, -1);
assert.strictEqual(((-7 % 3) + 3) % 3, 2);
function positiveMod(x, m) { return ((x % m) + m) % m; }
assert.strictEqual(positiveMod(-1, 5), 4);

// sentinels
assert.strictEqual(Math.max(), -Infinity);
assert.strictEqual(Math.min(), Infinity);
assert.strictEqual(-Infinity < -1e308, true);

// conversion gotchas
assert.strictEqual(parseInt('42px'), 42);
assert.strictEqual(parseInt('0x1f'), 31);
assert.strictEqual(parseInt('08'), 8);
assert.strictEqual(Number.isNaN(parseInt('abc')), true);
assert.strictEqual(Number.isNaN(Number('42px')), true);
assert.strictEqual(Number(''), 0);
assert.strictEqual(+'3.5', 3.5);
assert.strictEqual(parseInt('3.9'), 3);
assert.strictEqual(Number.isInteger(3.0), true);
assert.strictEqual(NaN === NaN, false);
assert.strictEqual(Number.isNaN(NaN), true);
assert.strictEqual((255).toString(2), '11111111');
assert.strictEqual(parseInt('ff', 16), 255);
assert.strictEqual((3.14159).toFixed(2), '3.14');
assert.strictEqual(typeof (3.14159).toFixed(2), 'string');
assert.strictEqual(0.1 + 0.2 === 0.3, false);
assert.strictEqual(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON, true);

// ---------- 5. Bitwise ----------
assert.strictEqual(5 & 3, 1);
assert.strictEqual(5 | 3, 7);
assert.strictEqual(5 ^ 3, 6);
assert.strictEqual(~5, -6);
assert.strictEqual(1 << 3, 8);
assert.strictEqual(16 >> 2, 4);
assert.strictEqual(-16 >> 2, -4);
assert.strictEqual(7 & 1, 1);                   // odd
assert.strictEqual(8 & (8 - 1), 0);             // power of two
assert.strictEqual(12 & -12, 4);                // lowest set bit
assert.strictEqual((5 >> 2) & 1, 1);            // bit 2 of 101 is set
assert.strictEqual(5 | (1 << 1), 7);            // set bit 1
assert.strictEqual(7 & ~(1 << 1), 5);           // clear bit 1
assert.strictEqual(3 ^ 5 ^ 3, 5);               // x ^ x cancels

// ---------- 6. Classes & #private ----------
class Stack {
  #items = [];
  push(value) { this.#items.push(value); return this; }
  pop() { return this.#items.pop(); }
  get size() { return this.#items.length; }
  static from(iterable) {
    const stack = new Stack();
    for (const x of iterable) stack.push(x);
    return stack;
  }
}
const stack = Stack.from([1, 2]).push(3);
assert.strictEqual(stack.size, 3);
assert.strictEqual(stack.pop(), 3);
assert.strictEqual(stack.items, undefined); // private is really private

class ListNode {
  constructor(value, next = null) { this.value = value; this.next = next; }
}
const head = new ListNode(1, new ListNode(2));
assert.strictEqual(head.next.value, 2);
assert.strictEqual(head.next.next, null);

// ---------- 7. Closures ----------
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const next = makeCounter();
next();
assert.strictEqual(next(), 2);

function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}
let calls = 0;
const slowSquare = memoize((n) => { calls++; return n * n; });
slowSquare(4);
slowSquare(4);
assert.strictEqual(calls, 1);

// ---------- 8. Recursion & stack limit ----------
function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }
assert.strictEqual(factorial(5), 120);
assert.strictEqual(factorial(200), Infinity); // overflow, still runs
assert.throws(() => factorial(1e6), RangeError); // Maximum call stack size exceeded

// iterative version never crashes
function factorialIterative(n) { let result = 1; for (let i = 2; i <= n; i++) result *= i; return result; }
assert.strictEqual(factorialIterative(5), 120);

// ---------- 9. Iterators & generators ----------
const entries = [];
for (const [index, value] of ['a', 'b'].entries()) entries.push(`${index}${value}`);
assert.deepStrictEqual(entries, ['0a', '1b']);
const codePoints = [];
for (const ch of 'a\u{1F600}') codePoints.push(ch);
assert.strictEqual(codePoints.length, 2);

function* idGenerator() { let id = 1; while (true) yield id++; }
const ids = idGenerator();
assert.strictEqual(ids.next().value, 1);
assert.strictEqual(ids.next().value, 2);

// ---------- 10. Helpful built-ins ----------
assert.strictEqual(Math.max(...[3, 9, 2]), 9);
const huge = new Array(200000).fill(1);
assert.throws(() => Math.max(...huge), RangeError); // too many arguments
assert.strictEqual(huge.reduce((m, x) => Math.max(m, x), -Infinity), 1);
assert.strictEqual(Math.log2(8), 3);
assert.strictEqual(Number.isInteger(Math.sqrt(49)), true);
assert.strictEqual(Number.isInteger(Math.sqrt(50)), false);
const nested = { a: [1, { b: 2 }] };
const clone = structuredClone(nested);
clone.a[1].b = 99;
assert.strictEqual(nested.a[1].b, 2);
assert.strictEqual(Array.isArray([]), true);
assert.deepStrictEqual(
  Object.entries({ x: 1, y: 3, z: 2 }).sort(([, a], [, b]) => b - a).map(([k]) => k),
  ['y', 'z', 'x']
);

// ---------- 11. Testing with assert ----------
assert.strictEqual(1 + 2, 3);
assert.deepStrictEqual([1, [2]], [1, [2]]);
assert.notStrictEqual([1], [1]);                 // different references
assert.ok('non-empty');
assert.throws(() => { throw new Error('empty stack'); }, /empty/);
assert.throws(() => assert.strictEqual(1, 2), assert.AssertionError); // what a failure looks like

console.log('✓ js-cheatsheet.js self-test passed');

module.exports = { positiveMod, Stack, ListNode, makeCounter, memoize, factorialIterative };
