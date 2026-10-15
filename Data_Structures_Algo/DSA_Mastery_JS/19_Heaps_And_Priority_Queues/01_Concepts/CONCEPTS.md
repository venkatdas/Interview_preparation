# Heaps / Priority Queue

> **Prerequisites:** [Arrays](../../03_Arrays/README.md), [Binary Trees](../../20_Trees/01_Binary_Trees/README.md) (complete trees, height), [Sorting](../../11_Sorting/README.md) (comparators, heap sort), [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md) (log n).

A **heap** is a tree-shaped structure that keeps the **smallest** (min-heap) or **largest**
(max-heap) element at the top at all times, while letting you add and remove elements in
O(log n). Think of a hospital emergency room: patients arrive in any order, but the most
urgent one is always treated next. The queue is ordered by *priority*, not by arrival time.
That abstract idea is called a **priority queue**; a heap is the usual way to build one.

The trick that makes heaps fast and simple: the tree lives inside a plain **array**,
with no pointers at all.

---

## Why it matters / when to use

Reach for a heap when the problem says any of these:

- "k largest", "k smallest", "k most frequent", "k closest" → **top-K pattern**
- "repeatedly take the smallest / largest and put something back" (stones, sticks, tasks)
- "merge k sorted lists / arrays / streams" → **k-way merge**
- "running median", "median of a stream / window" → **two heaps**
- "schedule by priority", "earliest end time", "process the most urgent first"
- Dijkstra / Prim's algorithms (see 23_Graphs)
- You need the min or max **many times while the data keeps changing**. Sorting once does
  not work because new items keep arriving.

Not a heap problem: you only need the min/max once (just scan, O(n)), or you need the
whole thing sorted (just sort).

---

## How it works

### A complete binary tree stored in an array

A heap is a **complete** binary tree: every level is full except maybe the last, which fills
from left to right. Because there are no gaps, we can store it level by level in an array
and compute parent/child positions with arithmetic:

```
         index:  0   1   2   3   4   5   6
         array: [1,  3,  2,  7,  4,  9,  5]

                       1 (0)
                    /        \
                3 (1)        2 (2)
               /    \       /    \
            7 (3)  4 (4)  9 (5)  5 (6)

  parent(i)      = (i - 1) >> 1      e.g. parent(4) = 1,  parent(6) = 2
  leftChild(i)   = 2 * i + 1         e.g. left(1) = 3
  rightChild(i)  = 2 * i + 2         e.g. right(1) = 4
```

`>> 1` is "shift right by one bit" = integer division by 2. It also rounds negatives
correctly for index 0: `(0 - 1) >> 1` is `-1`, so the root has no parent.

**Heap property (min-heap):** every parent <= its children. That is all. Siblings are NOT
ordered (3 and 2 above are siblings and 3 > 2 is fine). So a heap is **not sorted**; it only
promises the root is the minimum.

### push = append + sift up

Add the new value at the end (the only spot that keeps the tree complete), then swap it with
its parent while it is smaller than the parent.

```
push(0) into [1, 3, 2, 7, 4, 9, 5]

step 0: append       [1, 3, 2, 7, 4, 9, 5, 0]    i = 7, parent = 3 (value 7)
step 1: 0 < 7, swap  [1, 3, 2, 0, 4, 9, 5, 7]    i = 3, parent = 1 (value 3)
step 2: 0 < 3, swap  [1, 0, 2, 3, 4, 9, 5, 7]    i = 1, parent = 0 (value 1)
step 3: 0 < 1, swap  [0, 1, 2, 3, 4, 9, 5, 7]    i = 0, stop (root)
```

At most one swap per level → O(log n).

### pop = take root, move last to root, sift down

Remove the root (the answer). Move the LAST element to index 0 (keeps the tree complete),
then swap it with its **smaller child** while a child is smaller than it.

```
pop() from [0, 1, 2, 3, 4, 9, 5, 7]   -> returns 0

step 0: move last to root   [7, 1, 2, 3, 4, 9, 5]     i = 0, children 1 and 2 -> smaller is 1
step 1: 7 > 1, swap         [1, 7, 2, 3, 4, 9, 5]     i = 1, children 3 and 4 -> smaller is 3
step 2: 7 > 3, swap         [1, 3, 2, 7, 4, 9, 5]     i = 3, no children, stop
```

Always swap with the **smaller** child; swapping with the larger one would put a big value
above a small one and break the property.

### heapify an array in O(n)

To turn an arbitrary array into a heap you could push every element (n × log n). Faster:
leaves are already valid 1-node heaps, so start at the **last parent** `(n - 2) >> 1` and
sift each node down, moving toward index 0.

Why O(n) and not O(n log n)? Half the nodes are leaves (0 work). A quarter are one level up
(at most 1 swap). An eighth can swap twice, and so on. The sum
`n/2 · 0 + n/4 · 1 + n/8 · 2 + n/16 · 3 + ...` converges to about `n`. Most nodes are near
the bottom and barely move.

### Min-heap vs max-heap vs comparator

A max-heap is a min-heap with the comparison flipped. Instead of writing two classes, give the
heap a **comparator** like `Array.prototype.sort`: `(a, b) => a - b` for a min-heap,
`(a, b) => b - a` for a max-heap, `(a, b) => a.dist - b.dist` for objects. One class
covers every priority queue you'll need.

### Heap sort

Build a max-heap in place, then repeatedly swap the root (max) with the last unsorted slot
and sift down inside the shrinking heap. O(n log n) always, O(1) extra space, not stable.
Full code in `heap_sort.js`.

---

## Pseudocode

```
parent(i) = (i - 1) >> 1;  left(i) = 2i + 1;  right(i) = 2i + 2

PUSH(x):
    a.append(x); i = last index
    while i > 0 and a[i] < a[parent(i)]:
        swap(a[i], a[parent(i)]); i = parent(i)

POP():
    if a is empty: return nothing
    top = a[0]; last = a.removeLast()
    if a not empty:
        a[0] = last; i = 0
        loop:
            s = index of the smallest among i, left(i), right(i) (that exist)
            if s == i: break
            swap(a[i], a[s]); i = s
    return top

HEAPIFY(a):                      # O(n)
    for i from parent(n - 1) down to 0: sift_down(i)
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| peek()    | O(1) | O(1)  | root of the array |
| push(x)   | O(log n) | O(1) | append + sift up |
| pop()     | O(log n) | O(1) | swap root with last + sift down |
| heapify(array) | O(n) | O(1) extra | sift down from last parent to 0 |
| build by n pushes | O(n log n) | | worse than heapify |
| search / delete arbitrary | O(n) | | heaps are not for lookup; use lazy deletion instead |
| heap sort | O(n log n) | O(1) | not stable |

Total space for n items: O(n).

---

## JavaScript implementation

JavaScript has **no built-in priority queue**. In an interview you write one. Keep this
minimal version memorized (about 25 lines); the full version with comments, `from()` and a
random test against sorting lives in `min_heap.js`.

```js
class MinHeap {
  constructor(compare = (a, b) => a - b) { this.data = []; this.compare = compare; }
  size()  { return this.data.length; }
  peek()  { return this.data[0]; }
  push(value) {
    this.data.push(value);
    let i = this.data.length - 1;
    while (i > 0) {                                // sift up
      const parent = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[parent]) >= 0) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }
  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length) {
      this.data[0] = last;
      let i = 0;
      while (true) {                               // sift down
        const left = 2 * i + 1, right = 2 * i + 2;
        let smallest = i;
        if (left < this.data.length && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left;
        if (right < this.data.length && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right;
        if (smallest === i) break;
        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
        i = smallest;
      }
    }
    return top;
  }
}
```

Usage: `new MinHeap()` (numbers, smallest first), `new MinHeap((a, b) => b - a)` (largest
first), `new MinHeap((a, b) => a[1] - b[1])` (pairs, by second field).

Always tell the interviewer: "I'll assume a MinHeap class with push/pop/peek in O(log n); I can
write it if you want." Then write it only if asked.

---

## Dry run

**Pop from the min-heap `[1, 3, 2, 7, 4, 5]`:**

| Step | Array | i | children (values) | action |
|---|---|---|---|---|
| save top | [1, 3, 2, 7, 4, 5] | - | - | top = 1 |
| move last to root | [5, 3, 2, 7, 4] | 0 | 3, 2 | smaller child 2 < 5: swap |
| sift | [2, 3, 5, 7, 4] | 2 | none (index 5, 6 out of range) | stop |
| result | **[2, 3, 5, 7, 4]** | | | returns 1 |

**Push 0 into `[2, 3, 5, 7, 4]`:**

| Step | Array | i | parent value | action |
|---|---|---|---|---|
| append | [2, 3, 5, 7, 4, 0] | 5 | 5 | 0 < 5: swap |
| sift up | [2, 3, 0, 7, 4, 5] | 2 | 2 | 0 < 2: swap |
| sift up | [0, 3, 2, 7, 4, 5] | 0 | - | at root, stop |

---

## Patterns / variations

### 1. Top K (min-heap of size K for the K largest)

Keep a heap of size K. Push each element; if the size exceeds K, pop. What remains is the
best K. The counter-intuitive part: for the K **largest** use a **MIN**-heap. Its top is the
smallest of the current candidates, which is exactly the one to evict when something bigger
arrives. Symmetrically, for the K **smallest** (or "closest") use a **MAX**-heap.

```js
function kLargest(nums, k) {
  const heap = new MinHeap();
  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) heap.pop(); // evict the smallest candidate
  }
  return heap.toArray();             // the k largest (unordered)
}
```
O(n log k) time, O(k) space. Better than sorting (O(n log n)) when k << n.
Use when: Kth Largest, K Closest Points, Top K Frequent.

### 2. Two heaps (running median)

Split the data into a smaller half (max-heap `low`) and a larger half (min-heap `high`),
keeping their sizes equal or `low` one bigger. The median is at the top(s).

```js
addNum(num) {
  low.push(num);               // always go through low first ...
  high.push(low.pop());        // ... so every element in low <= every element in high
  if (high.size() > low.size()) low.push(high.pop()); // keep low the (same or +1) size
}
findMedian() {
  return low.size() > high.size() ? low.peek() : (low.peek() + high.peek()) / 2;
}
```
Use when: median of a stream, sliding window median, "balance two groups".

### 3. K-way merge

The next smallest element across K sorted lists is the smallest of their current heads.
Keep one head per list in a min-heap (size K). Pop, output, push that list's next element.

```js
const heap = new MinHeap((a, b) => a.val - b.val);
for (const head of lists) if (head) heap.push(head);
while (heap.size()) {
  const node = heap.pop();
  output(node);
  if (node.next) heap.push(node.next);
}
```
O(N log K) for N total elements. Use when: Merge k Sorted Lists, Smallest Range Covering
K Lists, Kth Smallest in a Sorted Matrix.

### 4. Greedy simulation ("always take the biggest/smallest, then put something back")

Last Stone Weight, Connect Sticks, Reorganize String, Task Scheduler. The heap is just the
fast way to re-find the extreme element after each step changes the data.

### 5. Lazy deletion

Heaps cannot delete an arbitrary element in O(log n). Instead, remember that the element is
"dead" (a Map of value → count or a timestamp on the entry) and discard it only when it
reaches the top. Used in Sliding Window Median and in Dijkstra with outdated entries.

### 6. Heap of end times (interval scheduling)

Sort by start time; keep a min-heap of end times for the rooms/machines in use. If the
earliest end <= the next start, reuse it (pop). Heap size = resources needed.

---

## Alternatives (brute force vs optimized)

| Need | Simple approach | Heap approach | Other options |
|---|---|---|---|
| Repeated "take the min" while inserting | Re-sort or scan each time: O(n) per op | O(log n) per op | Balanced BST / sorted set also O(log n) and supports delete-any |
| Top k of n | Sort: O(n log n) | Size-k heap: O(n log k) | Quickselect O(n) avg; bucket sort when keys are small ints |
| Running median | Insert into sorted array: O(n) per add | Two heaps: O(log n) | Order-statistics tree |
| Merge k sorted lists | Concatenate and sort: O(N log N) | O(N log k) | Pairwise divide and conquer merge: O(N log k) without a heap |
| Sorting | Merge sort (stable, O(n) space) | Heap sort (in place, unstable) | Quicksort (fast in practice) |

---

## Common mistakes & edge cases

- Using a **max**-heap for "K largest". You want a MIN-heap of size K (see pattern 1).
- Forgetting that the heap array is **not sorted**: `toArray()` is heap order. Pop K times
  if you need sorted output.
- Sift-down: comparing with only the left child, or swapping with the larger child in a
  min-heap. Always find the smaller of the two children first.
- Off-by-one in heapify: the last parent is `(n - 2) >> 1`, not `n / 2`.
- `pop()` on an empty heap: return `undefined` (or throw) consistently, and check `size()`
  in loops.
- Ties in the comparator: Top K Frequent **Words** needs a secondary key (alphabetical),
  and in the min-heap it must be reversed (`b.localeCompare(a)`) so the right word is evicted.
- Using `array.sort()` inside a loop "because it's easy": that turns O(n log k) into
  O(n^2 log n). Interviewers notice.
- Two-heaps: always push through `low` first, then rebalance. Deciding the side by comparing
  with `low.peek()` on an empty heap gives `undefined` comparisons.

---

## When this does NOT apply

- **You need the min AND max, or delete arbitrary items, or ordered iteration**: use a balanced BST / sorted structure (or two heaps with lazy deletion).
- **Search for an arbitrary value**: a heap is O(n) for that; use a hash map or BST.
- **Keys are small integers**: bucket/counting approaches beat O(log n).
- **FIFO or LIFO order** is what you need: queue or stack.
- **Static data, one query**: just sort once, or use quickselect.

---

## Interview tips

- Say the signal out loud: "We repeatedly need the smallest/largest while the data changes,
  so a heap / priority queue fits."
- State the API you assume (`push`, `pop`, `peek`, O(log n)) and offer to implement it.
  Interviewers in JS usually accept the assumption; a few want the 25 lines.
- For top-K, explain WHY the heap is the opposite kind ("min-heap for the k largest because
  its top is the weakest candidate, the one to evict").
- Give complexity as O(n log k), and point out that k << n makes it better than sorting.
- Mention quickselect (O(n) average) as an alternative for Kth Largest if asked for better.
- Mention heapify is O(n) when you build from a whole array; it is a common follow-up.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Kth Largest Element in an Array | Medium | top K (min-heap size k) | 03_Problems/solutions/01_kth_largest_element.js |
| 02 | Kth Largest Element in a Stream | Easy | top K, persistent heap | 03_Problems/solutions/02_kth_largest_in_stream.js |
| 03 | Last Stone Weight | Easy | max-heap simulation | 03_Problems/solutions/03_last_stone_weight.js |
| 04 | K Closest Points to Origin | Medium | top K (max-heap size k) | 03_Problems/solutions/04_k_closest_points.js |
| 05 | Top K Frequent Elements | Medium | count + top K | 03_Problems/solutions/05_top_k_frequent_elements.js |
| 06 | Top K Frequent Words | Medium | top K with tie-break comparator | 03_Problems/solutions/06_top_k_frequent_words.js |
| 07 | Merge k Sorted Lists | Hard | k-way merge | 03_Problems/solutions/07_merge_k_sorted_lists.js |
| 08 | Find Median from Data Stream | Hard | two heaps | 03_Problems/solutions/08_find_median_data_stream.js |
| 09 | Task Scheduler | Medium | greedy max-heap + cooldown queue | 03_Problems/solutions/09_task_scheduler.js |
| 10 | Reorganize String | Medium | greedy max-heap, hold previous | 03_Problems/solutions/10_reorganize_string.js |
| 11 | Meeting Rooms II | Medium | heap of end times | 03_Problems/solutions/11_meeting_rooms_ii.js |
| 12 | Minimum Cost to Connect Sticks | Medium | Huffman-style greedy | 03_Problems/solutions/12_min_cost_connect_sticks.js |
| 13 | Smallest Range Covering Elements from K Lists | Hard | k-way merge + track max | 03_Problems/solutions/13_smallest_range_k_lists.js |
| 14 | IPO | Hard | two heaps (unlock then pick) | 03_Problems/solutions/14_ipo.js |
| 15 | Ugly Number II | Medium | generate in order with heap + set | 03_Problems/solutions/15_ugly_number_ii.js |
| 16 | Sliding Window Median | Hard | two heaps + lazy deletion | 03_Problems/solutions/16_sliding_window_median.js |

---

## Practice more

Easy: Relative Ranks (506), Maximum Product of Two Elements (1464), Take Gifts From the
Richest Pile (2558)

Medium: Kth Smallest Element in a Sorted Matrix (378), Furthest Building You Can Reach (1642),
Single-Threaded CPU (1834), Minimum Number of Refueling Stops (871), Maximum Performance of a
Team (1383), Hand of Straights (846), Car Pooling (1094), Sort Characters By Frequency (451),
Network Delay Time (743, Dijkstra), Design Twitter (355), Seat Reservation Manager (1845),
Kth Smallest Prime Fraction (786)

Hard: Trapping Rain Water II (407), Minimum Cost to Hire K Workers (857), The Skyline Problem
(218), Swim in Rising Water (778), Constrained Subsequence Sum (1425)
