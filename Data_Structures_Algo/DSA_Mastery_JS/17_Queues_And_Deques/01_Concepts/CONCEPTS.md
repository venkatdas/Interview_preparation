# Queues

> **Prerequisites:** [Arrays](../../03_Arrays/README.md), [Linked Lists](../../15_Linked_Lists/README.md) (linked queue and deque), [Stacks](../../16_Stacks/README.md) (queue from two stacks), [Sliding Window](../../07_Sliding_Window/README.md) (monotonic deque problems).

A **queue** is a list where you add at one end (the **back**) and remove from the other end
(the **front**). Think of a line at a coffee shop: new people join at the back, and the person
who has waited longest is served first. This rule is called **FIFO** (First In, First Out).

---

## Why it matters / when to use

Reach for a queue when the problem has any of these signals:

- "Process in the order they arrived": requests, tasks, print jobs, messages
- **Breadth-first search (BFS)**: shortest path in an unweighted grid/graph, "minimum number
  of steps", level-order traversal of a tree, "spread" simulations (rotting oranges, fire)
- A **sliding window** over a stream: "last k items", "past 5 minutes", moving average
- "Sliding window maximum / minimum" → **monotonic deque**
- Round-robin / turn-based simulations (Dota2 Senate, Josephus, card games)
- Rate limiting, hit counters, recent calls
- Producer/consumer buffers with fixed memory → **circular queue (ring buffer)**

---

## How it works

```
enqueue(1)  enqueue(2)  enqueue(3)          dequeue() -> 1

front                back                front           back
  |                    |                   |               |
 [1] -> [2] -> [3]                        [2] -> [3]
```

Only the front is removed; only the back is added to. The element that has been in the queue
the longest is always the next one out.

### Queue vs stack

| | Stack (LIFO) | Queue (FIFO) |
|---|---|---|
| Add | top | back |
| Remove | top (newest) | front (oldest) |
| Real life | plates, undo, browser back | waiting line, printer jobs |
| Classic algorithm | DFS, matching brackets | BFS, level order, scheduling |
| JS array | `push` + `pop` (both O(1)) | `push` + `shift` (`shift` is **O(n)**!) |

### The O(n) `shift()` trap

`array.shift()` removes index 0 and **moves every other element one slot left**. In a loop that
dequeues n times, that is O(n^2). For small inputs you won't notice; in a BFS over a 1000x1000
grid you will. Three fixes:

1. **Linked-list queue** - O(1) at both ends (what `queue.js` does)
2. **Head pointer** - keep the array, never shift; just advance an index:
   ```js
   const queue = [start]; let head = 0;
   while (head < queue.length) { const item = queue[head++]; /* ... */ queue.push(next); }
   ```
   Memory is never reclaimed, but for one BFS that's fine. This is the idiom used in the
   BFS problems in this folder.
3. **Circular queue** - fixed array with wrap-around indices (below)

### Circular queue / ring buffer

A fixed-size array plus a `front` index and a `count`. The back slot is `(front + count) % capacity`.
When you reach the end of the array you wrap around to index 0 instead of shifting anything.

```
capacity 4           enqueue 1,2,3        dequeue          enqueue 4, 5
[_, _, _, _]         [1, 2, 3, _]         [_, 2, 3, _]     [5, 2, 3, 4]
front=0 count=0      front=0 count=3      front=1 count=2  front=1 count=4  (5 wrapped to index 0)
```

Use when memory must be bounded and predictable (audio buffers, network packets, logs).
In JavaScript remember `(front - 1 + capacity) % capacity` when stepping backwards: `%` of a
negative number is negative.

### Queue via two stacks

Push into an `inbox` stack. To dequeue, if `outbox` is empty, pour everything from `inbox` into
`outbox` (this reverses the order, so the oldest is on top). Each element moves at most once, so
it's **amortized O(1)**. See `03_Problems/solutions/02_queue_using_stacks.js`.

### Deque (double-ended queue)

Push and pop at **both** ends in O(1). Implemented with a doubly linked list (or a ring buffer).
A deque can act as a stack, a queue, or both at once. It's the engine behind the monotonic deque.

### Monotonic deque (sliding window max / min)

Keep a deque of **indices** whose values are **decreasing** from front to back. For each new
element:
1. pop from the **back** while the back value <= new value (it can never be the max again)
2. push the new index at the back
3. pop from the **front** if it has slid out of the window
4. the **front** is the window's maximum

Every index enters and leaves once → O(n) for the whole array. For the minimum, flip the
comparison. See `03_Problems/solutions/07_sliding_window_maximum.js` and `MonotonicDeque` in `queue.js`.

### Priority queue (teaser)

A priority queue dequeues the **highest-priority** item instead of the oldest. It's built with a
**heap**, not a plain queue, and gets its own topic: `19_Heaps_And_Priority_Queues`. Task Scheduler
(problem 12) uses both a max-heap and a FIFO cooldown queue.

### BFS uses a queue

Breadth-first search explores level by level: everything at distance 1, then distance 2, and so
on. A queue is exactly what makes that order happen. Put the start in the queue; repeatedly
dequeue a node and enqueue its unvisited neighbours. With **multi-source BFS** you enqueue
*all* starting points first (Rotting Oranges, Walls and Gates). Full BFS theory lives in
`20_Trees` (level order) and `23_Graphs`; the grid versions are practiced here.

---

## Pseudocode

```
QUEUE with an array + head index:
    enqueue(x): arr.append(x)
    dequeue():  if head == arr.length: return empty
                x = arr[head]; head += 1; return x
    size():     arr.length - head

RING BUFFER (capacity C):
    enqueue(x): if count == C: return false
                arr[(front + count) % C] = x; count += 1
    dequeue():  if count == 0: return empty
                x = arr[front]; front = (front + 1) % C; count -= 1; return x

BFS(start):
    queue = [start]; seen = {start}; dist[start] = 0
    while queue not empty:
        u = dequeue()
        for v in neighbors(u):
            if v not in seen: seen.add(v); dist[v] = dist[u] + 1; enqueue(v)

WINDOW MAX with a deque of indices (values decreasing):
    for i in 0..n-1:
        while deque not empty and nums[deque.back] <= nums[i]: deque.popBack()
        deque.pushBack(i)
        if deque.front <= i - k: deque.popFront()
        if i >= k - 1: output nums[deque.front]
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| enqueue(x) | O(1) | O(1) | add to back |
| dequeue() | O(1) | O(1) | remove front (linked list / ring buffer / head pointer) |
| dequeue() with `array.shift()` | **O(n)** | O(1) | the trap - avoid in loops |
| peek() | O(1) | O(1) | look at the front |
| isEmpty() / size() | O(1) | O(1) | |
| Deque pushFront/popBack | O(1) | O(1) | doubly linked list |
| Queue via two stacks: dequeue | amortized O(1) | O(n) | one particular call may be O(n) |
| Monotonic deque: whole array | O(n) | O(k) | each index pushed/popped once |
| BFS on grid m x n | O(m*n) | O(m*n) | each cell enqueued once |

---

## JavaScript implementation

Full code with tests: `queue.js`. It contains `Queue` (linked list), `CircularQueue` (ring
buffer), `Deque` (doubly linked list) and `MonotonicDeque`. Core idea:

```js
class Queue {
  #head = null; #tail = null; #size = 0;
  enqueue(value) {
    const node = { value, next: null };
    if (this.#tail) this.#tail.next = node; else this.#head = node;
    this.#tail = node; this.#size++;
  }
  dequeue() {
    if (!this.#head) return undefined;
    const { value } = this.#head;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null;
    this.#size--;
    return value;
  }
  peek()    { return this.#head?.value; }
  isEmpty() { return this.#size === 0; }
}
```

---

## Dry run

**Ring buffer, capacity 3:**

| Operation | front | count | slots [0,1,2] | returns |
|---|---|---|---|---|
| enqueue 1 | 0 | 1 | [1, _, _] | true |
| enqueue 2 | 0 | 2 | [1, 2, _] | true |
| enqueue 3 | 0 | 3 | [1, 2, 3] | true |
| enqueue 4 | 0 | 3 | [1, 2, 3] | false (full) |
| dequeue | 1 | 2 | [_, 2, 3] | 1 |
| enqueue 4 | 1 | 3 | [4, 2, 3] | true (wrapped to slot 0) |
| dequeue | 2 | 2 | [4, _, 3] | 2 |

**Window max, `nums = [1, 3, -1, -3, 5]`, k = 3** (deque shows values):

| i | nums[i] | pops from back | deque after | front expired? | output |
|---|---|---|---|---|---|
| 0 | 1 | - | [1] | no | - |
| 1 | 3 | 1 | [3] | no | - |
| 2 | -1 | - | [3, -1] | no | 3 |
| 3 | -3 | - | [3, -1, -3] | no (3 is at index 1) | 3 |
| 4 | 5 | -3, -1, 3 | [5] | - | 5 |

---

## Patterns / variations

### 1. Level-by-level BFS (count steps / minutes / layers)

```js
let queue = [...sources];   // multi-source: all starts at distance 0
let steps = 0;
while (queue.length) {
  const next = [];
  for (const cell of queue) {
    for (const neighbour of neighboursOf(cell)) {
      if (visited(neighbour)) continue;
      markVisited(neighbour);
      next.push(neighbour);
    }
  }
  queue = next;              // one whole level processed = one step
  if (queue.length) steps++;
}
```
Use when: "minimum minutes/moves", "distance to nearest X", "spread".

### 2. Head-pointer BFS (single loop, O(1) dequeue)

```js
const queue = [start]; let head = 0;
dist[start] = 0;
while (head < queue.length) {
  const node = queue[head++];
  for (const nb of neighbours(node)) {
    if (dist[nb] !== undefined) continue;
    dist[nb] = dist[node] + 1;
    queue.push(nb);
  }
}
```

### 3. Time-window queue (expire from the front)

```js
class RecentCounter {
  queue = []; head = 0;
  ping(t) {
    this.queue.push(t);
    while (this.queue[this.head] < t - 3000) this.head++;  // drop expired
    return this.queue.length - this.head;
  }
}
```
Use when: "past N seconds", hit counter, moving average, rate limiter.

### 4. Monotonic deque

```js
function maxSlidingWindow(nums, k) {
  const result = [], deque = []; let front = 0;
  for (let i = 0; i < nums.length; i++) {
    while (deque.length > front && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (deque[front] <= i - k) front++;
    if (i >= k - 1) result.push(nums[deque[front]]);
  }
  return result;
}
```
Use when: window max/min, "shortest subarray with sum >= k" (on prefix sums).

### 5. Round-robin simulation (re-enqueue with an offset)

Dequeue the two fronts, the winner goes back with `index + n` so it acts again next round.
See Dota2 Senate.

### 6. Reverse a process with a deque

If a problem describes a deterministic shuffle (reveal top, move next to bottom), run it
**backwards** on a deque to build the required input. See Reveal Cards.

---

## Alternatives (brute force vs optimized)

| Need | Simple option | Better option | Trade-off |
|---|---|---|---|
| FIFO queue in JS | `push` + `shift` | `push` + head index, or linked list | `shift` is O(n); head index wastes memory until you compact |
| Bounded buffer | Array with `shift` | Ring buffer | Ring buffer has fixed memory and O(1) ops |
| Queue from stacks | Move everything back and forth per op: O(n) | Lazy transfer: amortized O(1) | |
| Window max/min | Recompute per window: O(n·k) | Monotonic deque: O(n) | A heap with lazy deletion is O(n log n) and also works |
| Both-ends access | Array with `unshift`/`shift` | Doubly linked list or circular deque | Arrays are fine for small sizes |
| Ordered by priority | Sorted array (O(n) insert) | Heap (O(log n)) | Different problem: see [Heaps](../../19_Heaps_And_Priority_Queues/README.md) |

---

## Common mistakes & edge cases

- Using `shift()` inside a BFS or a big loop → O(n^2). Use a head pointer or a linked list.
- Forgetting to mark a cell **visited when you enqueue it** (not when you dequeue it). Otherwise
  the same cell is enqueued many times and the queue explodes.
- Multi-source BFS: all sources must go in **before** the loop starts, all at distance 0.
- Off-by-one on time windows: is the boundary inclusive? `(t-300, t]` vs `[t-3000, t]`.
- Monotonic deque: use `<=` when popping for max so duplicates don't linger; store **indices**,
  not values, or you cannot tell when the front expires.
- Ring buffer: negative modulo in JS. Always `(i - 1 + capacity) % capacity`.
- Queue via two stacks: only pour when `outbox` is empty, never while it has items.
- Empty queue: `dequeue()` / `peek()` must return `undefined` (or `-1` when the problem says so).

---

## When this does NOT apply

- **Most recent first** (undo, matching brackets, DFS): use a stack.
- **Always the smallest/largest item next** (Dijkstra, scheduling by priority): use a heap / priority queue.
- **Weighted shortest paths**: plain BFS is wrong when edges have different weights (except 0-1 BFS with a deque).
- **Random access or search inside the collection**: queues only expose the ends.
- **Window aggregates that aren't max/min** (sum, average): a running total is enough; no deque needed.

---

## Interview tips

- Say "FIFO" and the waiting-line analogy in one sentence, then move on.
- When you see "minimum steps", "shortest", "nearest", "level", "spread" on a grid or graph:
  say "BFS with a queue" immediately, and ask if there are multiple sources.
- Mention the `shift()` cost out loud and say how you avoid it. It's an easy signal of maturity.
- For monotonic deque: state the invariant ("values in my deque are decreasing, so the front is
  the max") and the amortized O(n) argument ("each index enters and leaves once").
- For design problems (circular queue, hit counter): first state the operations and their target
  complexity, then pick the structure.
- Draw the queue state for 3-4 operations before writing code. Queue bugs are almost always
  order bugs, and a drawing exposes them.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Implement Stack using Queues | Easy | rotate on push | 03_Problems/solutions/01_stack_using_queues.js |
| 02 | Implement Queue using Stacks | Easy | two stacks, amortized | 03_Problems/solutions/02_queue_using_stacks.js |
| 03 | Design Circular Queue | Medium | ring buffer | 03_Problems/solutions/03_design_circular_queue.js |
| 04 | Design Circular Deque | Medium | ring buffer, both ends | 03_Problems/solutions/04_design_circular_deque.js |
| 05 | Number of Recent Calls | Easy | time-window queue | 03_Problems/solutions/05_number_of_recent_calls.js |
| 06 | Moving Average from Data Stream | Easy | fixed window + running sum | 03_Problems/solutions/06_moving_average.js |
| 07 | Sliding Window Maximum | Hard | monotonic deque | 03_Problems/solutions/07_sliding_window_maximum.js |
| 08 | Shortest Subarray with Sum at Least K | Hard | monotonic deque on prefix sums | 03_Problems/solutions/08_shortest_subarray_sum_at_least_k.js |
| 09 | Rotting Oranges | Medium | multi-source BFS, levels | 03_Problems/solutions/09_rotting_oranges.js |
| 10 | Walls and Gates / 01 Matrix | Medium | multi-source BFS, distances | 03_Problems/solutions/10_walls_and_gates_01_matrix.js |
| 11 | Design Hit Counter | Medium | time-window queue + counts | 03_Problems/solutions/11_design_hit_counter.js |
| 12 | Task Scheduler | Medium | max-heap + cooldown queue / counting | 03_Problems/solutions/12_task_scheduler.js |
| 13 | Dota2 Senate | Medium | two queues, round robin | 03_Problems/solutions/13_dota2_senate.js |
| 14 | Reveal Cards In Increasing Order | Medium | reverse simulation with deque | 03_Problems/solutions/14_reveal_cards_increasing_order.js |

---

## Practice more

Easy: Time Needed to Buy Tickets (2073), Number of Students Unable to Eat Lunch (1700),
First Unique Character in a String (387), Binary Tree Level Order Traversal (102)

Medium: Open the Lock (752), Perfect Squares (279), Snakes and Ladders (909),
Shortest Path in Binary Matrix (1091), Jump Game VI (1696), Design Front Middle Back Queue (1670),
Design Snake Game (353), Zigzag Iterator (281), Minimum Number of K Consecutive Bit Flips (995),
Nearest Exit from Entrance in Maze (1926), Continuous Subarrays (2762), Design Bounded Blocking Queue (1188)

Hard: Minimum Window Subsequence (727), Constrained Subsequence Sum (1425),
Bus Routes (815), Cut Off Trees for Golf Event (675)
