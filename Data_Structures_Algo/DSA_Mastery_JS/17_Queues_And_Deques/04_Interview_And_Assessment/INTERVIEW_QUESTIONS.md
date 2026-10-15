# Queues & Deques — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is a queue, and what are the costs of its operations?

<details><summary>Model answer</summary>

A FIFO collection: items leave in the order they arrived. `enqueue` (back), `dequeue` (front), `peek`, `isEmpty`, `size` should all be O(1). Implementations: linked list with head and tail, ring buffer, or two stacks (amortized O(1)).

</details>

### 2. Why is `array.shift()` a problem for a queue in JavaScript?

<details><summary>Model answer</summary>

`shift` removes index 0 and re-indexes every remaining element: O(n). A BFS with `shift` on a big graph becomes O(V²). Fixes: keep a `head` index into the array and advance it (simple and fast), use a linked-list queue, or a ring buffer.

</details>

### 3. How does a circular queue (ring buffer) work?

<details><summary>Model answer</summary>

A fixed array plus a `front` index and a `count`. The back slot is `(front + count) % capacity`. Dequeue advances `front = (front + 1) % capacity`. Full means `count === capacity`. Keeping a count avoids the classic ambiguity where `front === rear` could mean empty or full.

</details>

### 4. What is a deque and when do you need one?

<details><summary>Model answer</summary>

A double-ended queue: O(1) push/pop at both ends. Needed for monotonic deques (sliding window max/min, shortest subarray with sum ≥ K), 0-1 BFS (push weight-0 edges to the front), and palindrome-style checks from both ends.

</details>

### 5. Explain the sliding window maximum with a deque.

<details><summary>Model answer</summary>

Keep indices in the deque with values decreasing front to back. For each new index: pop from the back while the back's value ≤ the new value (they can never be the max again), push the new index, drop the front if it left the window, and the front is the window max. Each index enters and leaves once: O(n).

</details>

### 6. Why is BFS implemented with a queue?

<details><summary>Model answer</summary>

FIFO order processes nodes in order of distance from the source: all distance-d nodes come out before any distance-(d+1) node. That gives shortest paths in unweighted graphs and natural level-by-level processing.

</details>

### 7. What is multi-source BFS? Give an example.

<details><summary>Model answer</summary>

Start BFS with **all** sources in the queue at distance 0. It computes each cell's distance to the nearest source in one O(cells) pass. Examples: Rotting Oranges (all rotten oranges start), Walls and Gates (all gates start), 01 Matrix (all zeros start).

</details>

### 8. Implement a stack with queues — what are the options?

<details><summary>Model answer</summary>

One queue: after each push, rotate the previous `size - 1` items behind the new one so the newest is at the front; push O(n), pop O(1). Two queues: push into an empty queue and move everything else behind it, or make pop O(n). Either way one operation is O(n); it's a design exercise, not a practical structure.

</details>

### 9. How would you design a hit counter for the last 5 minutes?

<details><summary>Model answer</summary>

Queue of timestamps: on `hit` push, on `getHits(t)` pop from the front while the front is ≤ t − 300, then return the size. For huge volumes, a fixed 300-slot circular array of (timestamp, count) buckets gives O(1) memory and O(300) query.

</details>

### 10. When does the level-size loop matter in BFS?

<details><summary>Model answer</summary>

When you need per-level results (level order, minutes in Rotting Oranges, steps in Word Ladder). Read `const size = queue.length` (or tail − head) before processing, and process exactly that many nodes; anything added belongs to the next level.

</details>

### 11. Queue vs priority queue — what's the difference?

<details><summary>Model answer</summary>

A queue orders by arrival time. A priority queue (usually a heap) always returns the item with the smallest (or largest) key, O(log n) per push/pop. Use a priority queue for Dijkstra, scheduling by priority, top-k; a plain queue for BFS and fair processing.

</details>

### 12. In Dota2 Senate, why do two queues of indices work?

<details><summary>Model answer</summary>

Each senator acts in turn order. Compare the fronts of the Radiant and Dire queues: the smaller index acts first and bans the other; the winner re-enters at the back with index + n (next round). Each step removes one senator, so O(n) total.

</details>

### 13. What should you clarify in a queue design question?

<details><summary>Model answer</summary>

Bounded or unbounded capacity, what to return on empty/full (exception, `-1`, `false`), thread safety (usually not needed in JS), whether timestamps are monotonic (hit counter), and expected operation volume.

</details>
