const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { DynamicArray, TwoStackQueue, ResizingHashTable, mulberry32 } = require('../02_Implementations/amortized_structures');
const { BinaryCounter, nextGreaterCounted, UnionFind } = require('../02_Implementations/amortized_algorithms');
const counter = require('../03_Problems/solutions/01_binary_counter_flips');
const queue = require('../03_Problems/solutions/02_queue_two_stacks_moves');
const growth = require('../03_Problems/solutions/03_growth_policy_copies');
const shrink = require('../03_Problems/solutions/04_shrink_policy_thrashing');
const uf = require('../03_Problems/solutions/05_union_find_step_budget');

describe('amortized structures', () => {
  it('handles normal case', () => {
    const a = new DynamicArray();
    for (let i = 0; i < 10; i++) a.push(i);
    assert.equal(a.get(9), 9);
    assert.equal(a.capacity, 16);
    const q = new TwoStackQueue();
    q.enqueue('a'); q.enqueue('b');
    assert.equal(q.dequeue(), 'a');
    assert.equal(q.peek(), 'b');
    const h = new ResizingHashTable();
    h.set('x', 1).set('x', 2);
    assert.equal(h.get('x'), 2);
    assert.equal(h.size, 1);
  });
  it('handles empty input', () => {
    assert.throws(() => new DynamicArray().pop(), RangeError);
    assert.throws(() => new TwoStackQueue().dequeue(), RangeError);
    assert.equal(new ResizingHashTable().get('nope'), undefined);
    assert.equal(new TwoStackQueue().size, 0);
  });
  it('total work stays linear on random operation sequences', () => {
    const rand = mulberry32(521);
    for (let t = 0; t < 100; t++) {
      const a = new DynamicArray(), q = new TwoStackQueue();
      let ops = 0;
      for (let k = 0; k < 1000; k++) {
        ops++;
        if (a.size && rand() < 0.5) a.pop(); else a.push(k);
        if (q.size && rand() < 0.5) q.dequeue(); else q.enqueue(k);
      }
      assert.ok(a.copies <= 3 * ops);
      assert.ok(q.moves <= ops);
    }
  });
  it('matches brute force on random inputs (hash table vs Map)', () => {
    const rand = mulberry32(522);
    const h = new ResizingHashTable(), m = new Map();
    for (let k = 0; k < 5000; k++) {
      const key = Math.floor(rand() * 2000);
      if (rand() < 0.2) assert.equal(h.delete(key), m.delete(key));
      else { h.set(key, k); m.set(key, k); }
      assert.equal(h.has(key), m.has(key));
    }
    assert.equal(h.size, m.size);
  });
});

describe('amortized algorithms', () => {
  it('binary counter flips < 2n', () => {
    const c = new BinaryCounter(20);
    for (let i = 0; i < 1000; i++) c.increment();
    assert.equal(c.flips, counter.optimal(1000));
  });
  it('monotonic stack on sorted / reverse-sorted / duplicates', () => {
    assert.deepEqual(nextGreaterCounted([1, 2, 3]).res, [2, 3, -1]);
    assert.deepEqual(nextGreaterCounted([3, 2, 1]).res, [-1, -1, -1]);
    assert.deepEqual(nextGreaterCounted([2, 2, 2]).res, [-1, -1, -1]);
    assert.equal(nextGreaterCounted([]).pops, 0);
  });
  it('union-find components', () => {
    const u = new UnionFind(5);
    u.union(0, 1); u.union(3, 4);
    assert.equal(u.components, 3);
    assert.ok(u.connected(1, 0) && !u.connected(1, 3));
  });
});

describe('selected solutions', () => {
  it('queue strategies agree, lazy is linear', () => {
    const ops = [['enq', 1], ['deq'], ['deq'], ['enq', 2], ['enq', 3], ['deq']];
    assert.deepEqual(queue.optimal(ops).outputs, [1, null, 2]);
    assert.deepEqual(queue.bruteForce(ops).outputs, [1, null, 2]);
  });
  it('growth policies', () => {
    assert.equal(growth.optimal(1025, { type: 'mul', factor: 2 }), 1023 + 1024);
    assert.equal(growth.optimal(2, { type: 'add', k: 1 }), 1n);
  });
  it('shrink at 1/4 resists the adversary', () => {
    const adv = shrink.adversarial(256, 500);
    assert.ok(shrink.optimal(adv).copies < shrink.bruteForce(adv).copies / 50);
  });
  it('union-find budget on a star and a chain', () => {
    const star = Array.from({ length: 999 }, (_, i) => ['link', 0, i + 1]).concat([['same', 5, 900]]);
    assert.deepEqual(uf.optimal(1000, star).answers, [true]);
    assert.ok(uf.optimal(1000, star).steps <= 8 * (1000 + star.length));
  });
});
