# Queues & Deques — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Predict the output)**

```js
const q = [];
q.push(1); q.push(2); q.shift(); q.push(3);
console.log(q[0], q.length);
```

<details><summary>Answer</summary>`2 2`.</details>

**2. (Complexity)** BFS on a graph with V vertices and E edges, using `queue.shift()`: worst-case time?

<details><summary>Answer</summary>O(V² + E), because each `shift` is O(V). With a head pointer it is O(V + E).</details>

**3. (Spot the bug)** Ring buffer:

```js
enqueue(x) { if (this.count === this.cap) return false; this.a[this.rear++] = x; this.count++; return true; }
```

<details><summary>Answer</summary>`rear` never wraps around; it must be `this.rear = (this.rear + 1) % this.cap` (or compute `(front + count) % cap`).</details>

**4. (Multiple choice)** Sliding window maximum with a deque: what do you pop from the BACK?
A) indices outside the window  B) indices with values ≤ the incoming value  C) the maximum  D) nothing

<details><summary>Answer</summary>B. Indices outside the window are dropped from the FRONT.</details>

**5. (Predict the output)** Window max for `[1, 3, -1, -3, 5, 3, 6, 7]`, k = 3?

<details><summary>Answer</summary>`[3, 3, 5, 5, 6, 7]`.</details>

**6. (Multiple choice)** Which problem is multi-source BFS?
A) Number of Islands  B) Rotting Oranges  C) Clone Graph  D) Course Schedule

<details><summary>Answer</summary>B. All rotten oranges start in the queue at minute 0.</details>

**7. (Complexity)** Queue made from two stacks: worst-case single `dequeue`, and amortized?

<details><summary>Answer</summary>Worst case O(n) (one big transfer); amortized O(1) because each item is moved at most once.</details>

**8. (Spot the bug)** Level-order loop:

```js
while (queue.length) {
  for (let i = 0; i < queue.length; i++) { const n = queue.shift(); /* push children */ }
  level++;
}
```

<details><summary>Answer</summary>`queue.length` changes inside the loop (children are pushed and shift shrinks it), so levels mix. Save `const size = queue.length` before the inner loop.</details>

**9. (Predict the output)**

```js
const d = [];
d.unshift(1); d.push(2); d.unshift(0); d.pop();
console.log(d);
```

<details><summary>Answer</summary>`[ 0, 1 ]`. (An array works as a deque, but `unshift`/`shift` are O(n).)</details>

**10. (Multiple choice)** Shortest Subarray with Sum at Least K allows negatives. Why does a simple sliding window fail?
A) Sums can overflow  B) Shrinking the window may increase the sum, so the window is not monotonic  C) k may be 0  D) It doesn't fail

<details><summary>Answer</summary>B. Use prefix sums with a monotonic increasing deque.</details>

**11. (Complexity)** Hit counter with a queue of timestamps: cost of `getHits` amortized?

<details><summary>Answer</summary>O(1) amortized: each timestamp is pushed once and popped once.</details>

**12. (Predict the output)** Circular queue capacity 2: `enqueue(1) enqueue(2) enqueue(3) dequeue() enqueue(4)` — what do the five calls return?

<details><summary>Answer</summary>`true true false 1 true`.</details>

---

## Mastery checklist

- [ ] I never use `shift()` in a hot loop and can write a head-pointer or linked queue.
- [ ] I can implement a ring buffer with correct wraparound and full/empty checks.
- [ ] I can write the monotonic deque for sliding window max/min from memory.
- [ ] I can write BFS with level-size processing and multi-source starts.
- [ ] I can explain queue vs deque vs priority queue and pick the right one.
