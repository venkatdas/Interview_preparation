// node --test 17_Queues_And_Deques/tests/queues_and_deques.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Queue, CircularQueue, Deque, MonotonicDeque } = require('../02_Implementations/queue');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('Queue', () => {
  it('is FIFO; empty dequeue/peek return undefined', () => {
    const q = new Queue();
    assert.equal(q.isEmpty(), true);
    assert.equal(q.dequeue(), undefined);
    assert.equal(q.peek(), undefined);
    q.enqueue(1); q.enqueue(2); q.enqueue(3);
    assert.equal(q.dequeue(), 1);
    assert.equal(q.peek(), 2);
    assert.deepEqual(q.toArray(), [2, 3]);
  });
  it('becomes reusable after being emptied', () => {
    const q = new Queue();
    q.enqueue(1); q.dequeue();
    q.enqueue(0); q.enqueue(0);
    assert.equal(q.size(), 2);
    assert.equal(q.dequeue(), 0);
  });
  it('matches an array model on random operations', () => {
    const rnd = mulberry32(17), q = new Queue(), model = [];
    for (let i = 0; i < 3000; i++) {
      if (rnd() < 0.55) { const v = Math.floor(rnd() * 21) - 10; q.enqueue(v); model.push(v); }
      else assert.equal(q.dequeue(), model.shift());
      assert.equal(q.size(), model.length);
      assert.equal(q.peek(), model[0]);
    }
  });
});

describe('CircularQueue', () => {
  it('rejects when full, wraps around, empty returns undefined', () => {
    const c = new CircularQueue(3);
    assert.equal(c.dequeue(), undefined);
    assert.equal(c.peekBack(), undefined);
    assert.equal(c.enqueue(1), true);
    assert.equal(c.enqueue(2), true);
    assert.equal(c.enqueue(3), true);
    assert.equal(c.isFull(), true);
    assert.equal(c.enqueue(4), false);
    assert.equal(c.dequeue(), 1);
    assert.equal(c.enqueue(4), true); // wraps into slot 0
    assert.deepEqual(c.toArray(), [2, 3, 4]);
    assert.equal(c.peek(), 2);
    assert.equal(c.peekBack(), 4);
  });
  it('capacity 1 boundary', () => {
    const c = new CircularQueue(1);
    assert.equal(c.enqueue(9), true);
    assert.equal(c.enqueue(8), false);
    assert.equal(c.peek(), 9);
    assert.equal(c.peekBack(), 9);
    assert.equal(c.dequeue(), 9);
    assert.equal(c.isEmpty(), true);
  });
  it('matches a bounded array model on random operations', () => {
    const rnd = mulberry32(622);
    for (let cap = 1; cap <= 6; cap++) {
      const c = new CircularQueue(cap), model = [];
      for (let i = 0; i < 1000; i++) {
        if (rnd() < 0.5) {
          const v = Math.floor(rnd() * 100);
          const ok = c.enqueue(v);
          assert.equal(ok, model.length < cap);
          if (ok) model.push(v);
        } else assert.equal(c.dequeue(), model.shift());
        assert.deepEqual(c.toArray(), model);
        assert.equal(c.isFull(), model.length === cap);
      }
    }
  });
});

describe('Deque', () => {
  it('works at both ends; empty pops return undefined', () => {
    const d = new Deque();
    assert.equal(d.popFront(), undefined);
    assert.equal(d.popBack(), undefined);
    d.pushBack(2); d.pushFront(1); d.pushBack(3);
    assert.deepEqual(d.toArray(), [1, 2, 3]);
    assert.equal(d.peekFront(), 1);
    assert.equal(d.peekBack(), 3);
    assert.equal(d.popBack(), 3);
    assert.equal(d.popFront(), 1);
    assert.equal(d.popFront(), 2);
    assert.equal(d.isEmpty(), true);
    d.pushFront(5);
    assert.equal(d.peekBack(), 5); // head and tail reset correctly
  });
  it('matches an array model on random operations', () => {
    const rnd = mulberry32(641), d = new Deque(), model = [];
    for (let i = 0; i < 4000; i++) {
      const op = Math.floor(rnd() * 4), v = Math.floor(rnd() * 21) - 10;
      if (op === 0) { d.pushBack(v); model.push(v); }
      else if (op === 1) { d.pushFront(v); model.unshift(v); }
      else if (op === 2) assert.equal(d.popBack(), model.pop());
      else assert.equal(d.popFront(), model.shift());
      assert.equal(d.size(), model.length);
      assert.equal(d.peekFront(), model[0]);
      assert.equal(d.peekBack(), model[model.length - 1]);
    }
    assert.deepEqual(d.toArray(), model);
  });
});

describe('MonotonicDeque', () => {
  // Reference: O(n*k) window maximum / minimum.
  const brute = (nums, k, pick) => {
    const out = [];
    for (let i = 0; i + k <= nums.length; i++) out.push(pick(...nums.slice(i, i + k)));
    return out;
  };
  const run = (nums, k, shouldPop) => {
    const dq = shouldPop ? new MonotonicDeque(nums, shouldPop) : new MonotonicDeque(nums);
    const out = [];
    for (let i = 0; i < nums.length; i++) {
      dq.push(i);
      dq.expire(i - k + 1);
      if (i >= k - 1) out.push(dq.best());
    }
    return out;
  };
  it('window max on sorted, reverse-sorted and all-equal input', () => {
    assert.deepEqual(run([1, 2, 3, 4, 5], 2), [2, 3, 4, 5]);
    assert.deepEqual(run([5, 4, 3, 2, 1], 2), [5, 4, 3, 2]);
    assert.deepEqual(run([7, 7, 7], 2), [7, 7]);
    assert.deepEqual(run([4], 1), [4]);
  });
  it('max and min windows match brute force on random input', () => {
    const rnd = mulberry32(239);
    for (let t = 0; t < 300; t++) {
      const n = 1 + Math.floor(rnd() * 30), k = 1 + Math.floor(rnd() * n);
      const nums = Array.from({ length: n }, () => Math.floor(rnd() * 21) - 10);
      assert.deepEqual(run(nums, k), brute(nums, k, Math.max));
      assert.deepEqual(run(nums, k, (back, incoming) => back >= incoming), brute(nums, k, Math.min));
    }
  });
  it('bestIndex and isEmpty', () => {
    const dq = new MonotonicDeque([3, 1, 2]);
    assert.equal(dq.isEmpty(), true);
    dq.push(0); dq.push(1); dq.push(2);
    assert.equal(dq.bestIndex(), 0);
    dq.expire(1);
    assert.equal(dq.bestIndex(), 2);
  });
});

describe('selected solutions on extra edge cases', () => {
  const swm = require('../03_Problems/solutions/07_sliding_window_maximum');
  const ssk = require('../03_Problems/solutions/08_shortest_subarray_sum_at_least_k');
  const rot = require('../03_Problems/solutions/09_rotting_oranges');
  const { MyCircularDeque, MyCircularDequeNaive } = require('../03_Problems/solutions/04_design_circular_deque');
  const ts = require('../03_Problems/solutions/12_task_scheduler');
  it('sliding window maximum: k = 1 and k = n', () => {
    assert.deepEqual(swm.optimal([3, -1, 2], 1), [3, -1, 2]);
    assert.deepEqual(swm.optimal([3, -1, 2], 3), [3]);
  });
  it('shortest subarray >= K with negatives matches brute force', () => {
    assert.equal(ssk.optimal([1], 2), -1);
    assert.equal(ssk.optimal([2, -1, 2], 3), 3);
    const rnd = mulberry32(862);
    for (let t = 0; t < 200; t++) {
      const nums = Array.from({ length: 1 + Math.floor(rnd() * 15) }, () => Math.floor(rnd() * 21) - 8);
      const k = 1 + Math.floor(rnd() * 15);
      assert.equal(ssk.optimal(nums, k), ssk.bruteForce(nums, k));
    }
  });
  it('rotting oranges: no oranges, unreachable fresh orange, already rotten', () => {
    assert.equal(rot.optimal([[0]]), 0);
    assert.equal(rot.optimal([[2, 0, 1]]), -1);
    assert.equal(rot.optimal([[2, 2]]), 0);
  });
  it('circular deque matches the naive version on random ops', () => {
    const rnd = mulberry32(4);
    const a = new MyCircularDeque(3), b = new MyCircularDequeNaive(3);
    const ops = ['insertFront', 'insertLast', 'deleteFront', 'deleteLast', 'getFront', 'getRear', 'isEmpty', 'isFull'];
    for (let i = 0; i < 1000; i++) {
      const op = ops[Math.floor(rnd() * ops.length)], v = Math.floor(rnd() * 10);
      assert.equal(a[op](v), b[op](v), op);
    }
  });
  it('task scheduler: n = 0 and a single task type', () => {
    assert.equal(ts.optimal(['A', 'A', 'B'], 0), 3);
    assert.equal(ts.optimal(['A', 'A', 'A'], 2), 7);
  });
});
