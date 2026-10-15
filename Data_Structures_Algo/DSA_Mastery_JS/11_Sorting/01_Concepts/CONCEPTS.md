# Sorting

**Sorting** means rearranging a list so its elements are in order (smallest to largest, A to Z,
or any order you define). Think of a hand of playing cards: you shuffle through them and move
each card to its right spot. Different ways of doing that are different sorting algorithms,
and each has trade-offs in speed, memory and how it behaves on special inputs.

Sorting is the most-used building block in all of DSA. A huge number of "hard" problems become
easy once the input is sorted (two pointers, binary search, intervals, greedy all depend on it).

---

## Prerequisites

- [Arrays](../../03_Arrays/README.md): swaps, in-place updates.
- [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md): O(n log n) vs O(n^2), best/average/worst case.
- [Recursion](../../12_Recursion/README.md) for merge sort and quicksort.

---

## Why it matters / when to use

Signals that sorting is part of the answer:

- "Find pairs / triplets that ..." (sort, then two pointers; see `06_Two_Pointers`)
- "Kth largest / smallest", "median", "top k" (sort, quickselect, or a heap; see `19_Heaps_And_Priority_Queues`)
- "Merge overlapping ...", "schedule ...", "minimum number of rooms" (sort by start; see `31_Intervals`)
- "Are these two things anagrams / permutations of each other" (sort both and compare)
- "Closest", "smallest difference", "duplicates next to each other" (sorted neighbours are candidates)
- You need to binary search (requires sorted input; see `10_Searching`)
- Greedy choices like "take the cheapest first" (sort by cost; see `28_Greedy_Algorithms`)
- Counting things in a range of small integers (counting sort beats comparison sorts)

---

## How it works

### Key vocabulary

| Term | Meaning | Why you care |
|---|---|---|
| **Stable** | equal elements keep their original relative order | sort by last name, then by first name: stability keeps the first sort meaningful |
| **In-place** | uses O(1) extra memory (swaps inside the array) | memory-constrained; also means the input is mutated |
| **Comparison sort** | only learns about elements by comparing pairs (`a < b`) | cannot beat O(n log n) |
| **Non-comparison sort** | uses the VALUES themselves (digits, counts) | can reach O(n) when values are small integers |
| **Adaptive** | faster on nearly-sorted input | insertion sort is O(n) on sorted input |

### Why comparison sorts cannot beat n log n

With n distinct elements there are n! possible orderings. Each comparison answers one yes/no
question, which at best cuts the remaining possibilities in half. To narrow n! orderings down
to 1 you need at least log2(n!) comparisons, and log2(n!) is about n log2 n (Stirling's
approximation). So every comparison-based sort is Omega(n log n) in the worst case. Counting
and radix sort escape this because they do not compare; they read digits/values directly.

```
n = 3 -> 3! = 6 orderings -> need at least log2(6) ~ 2.6 -> 3 comparisons
n = 8 -> 40320 orderings  -> log2 ~ 15.3 comparisons;  8 * log2(8) = 24  (same order)
```

### JavaScript's built-in `Array.prototype.sort`

- **Algorithm:** V8 uses **TimSort** (merge sort + insertion sort hybrid). O(n log n) worst
  case, O(n) on already-sorted or nearly-sorted data.
- **Stable:** guaranteed by the spec since ES2019. Safe to chain sorts.
- **In-place:** it mutates the array AND returns it. Use `[...arr].sort()` or `arr.toSorted()`
  (Node 20+) to keep the original.
- **The default comparator is the trap:** with no comparator, elements are converted to
  **strings** and compared by UTF-16 code units.

```js
[10, 9, 1, 2].sort()             // [1, 10, 2, 9]   <- "10" < "2" as strings!
[10, 9, 1, 2].sort((a, b) => a - b)  // [1, 2, 9, 10]
```

- **Comparator contract:** `compare(a, b)` must return a negative number if `a` goes before `b`,
  positive if after, 0 if equal. It must be **consistent** (if a<b and b<c then a<c), or the
  result is undefined behaviour. Never return a boolean (`a > b` returns true/false, which is
  coerced to 1/0 - never -1 - and gives wrong results).

```js
nums.sort((a, b) => a - b);                       // ascending numbers
nums.sort((a, b) => b - a);                       // descending numbers
words.sort((a, b) => a.localeCompare(b));         // strings, locale aware
people.sort((a, b) => a.age - b.age || a.name.localeCompare(b.name)); // age, then name
```

- Comparator subtraction `a - b` is fine for safe integers; for huge or non-numeric values
  write explicit `if (a < b) return -1; if (a > b) return 1; return 0;`.

### The algorithms at a glance

| Algorithm | Best | Average | Worst | Space | Stable | In-place | When to use |
|---|---|---|---|---|---|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | yes | yes | teaching only; "is it sorted" check |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | no | yes | minimizes swaps (n-1); never in practice |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | yes | yes | tiny arrays (< 20), nearly-sorted data, online input |
| Shell | O(n log n) | ~O(n^1.3) | O(n^2) | O(1) | no | yes | insertion sort with gaps; embedded systems |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes | no | linked lists, external sorting, when stability matters, counting inversions |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | no | yes | general purpose in-memory; fastest in practice with random pivot |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no | yes | guaranteed n log n with O(1) space; top-k |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(n + k) | yes | no | integers in a small range k (ages, grades, chars) |
| Radix | O(d(n + b)) | O(d(n + b)) | O(d(n + b)) | O(n + b) | yes | no | integers / fixed-length strings with d digits, base b |
| Bucket | O(n + k) | O(n + k) | O(n^2) | O(n + k) | yes* | no | uniformly distributed floats in [0,1) (*stable if buckets are sorted stably) |

k = range of values, d = number of digits, b = base (10 or 256).

### Walk-throughs

**Bubble sort** - repeatedly swap adjacent out-of-order pairs; the largest "bubbles" to the end.
```
[5, 1, 4, 2]
pass 1: (5,1)->swap [1,5,4,2]  (5,4)->swap [1,4,5,2]  (5,2)->swap [1,4,2,5]   5 is placed
pass 2: (1,4) ok   (4,2)->swap [1,2,4,5]                                     4 is placed
pass 3: (1,2) ok  -> no swaps in a pass -> sorted, stop early
```

**Selection sort** - find the minimum of the unsorted part, swap it to the front.
```
[5, 1, 4, 2]
i=0: min of [5,1,4,2] is 1 at idx1 -> swap -> [1 | 5,4,2]
i=1: min of [5,4,2]   is 2 at idx3 -> swap -> [1,2 | 4,5]
i=2: min of [4,5]     is 4         -> stay -> [1,2,4 | 5]
```

**Insertion sort** - take the next element, slide it left into the sorted prefix (like sorting cards in hand).
```
[5, 1, 4, 2]
i=1: key=1, shift 5 right  -> [1,5 | 4,2]
i=2: key=4, shift 5 right  -> [1,4,5 | 2]
i=3: key=2, shift 5,4 right-> [1,2,4,5]
```

**Merge sort** - split in half, sort each half (recursively), merge the two sorted halves.
```
          [5, 1, 4, 2]
         /            \
     [5, 1]          [4, 2]           split until size 1 (trivially sorted)
     /    \          /    \
   [5]    [1]      [4]    [2]
     \    /          \    /
     [1, 5]          [2, 4]           merge: compare heads, take the smaller
         \            /
         [1, 2, 4, 5]                 log n levels, O(n) work per level -> O(n log n)
```
Merging `[1,5]` and `[2,4]`: compare 1,2 -> take 1; compare 5,2 -> take 2; compare 5,4 -> take 4; append 5.

**Quick sort** - pick a pivot, partition so smaller elements are left and larger are right, recurse on both sides.
```
[5, 1, 4, 2, 3]  pivot = 3 (last)
partition (Lomuto): walk i over the array, swap every element < pivot to the front
  5>3 skip | 1<3 swap-> [1,5,4,2,3] | 4 skip | 2<3 swap-> [1,2,4,5,3] | place pivot -> [1,2,3,5,4]
  left [1,2] and right [5,4] are sorted recursively
```
Hoare partition uses two pointers moving inward and does ~3x fewer swaps. A **random pivot**
makes the O(n^2) worst case (already-sorted input with first/last pivot) astronomically unlikely.

**Heap sort** - build a max-heap (parent >= children), then repeatedly swap the root (max) to
the end and shrink the heap. See `19_Heaps_And_Priority_Queues` for the heap itself.
```
[5, 1, 4, 2] -> heapify -> [5, 2, 4, 1]
swap 5 to the end, heapify [1,2,4] -> [4,2,1] | 5
swap 4 to the end, heapify [1,2]   -> [2,1]   | 4,5
swap 2                              -> [1]     | 2,4,5   -> [1,2,4,5]
```

**Counting sort** - count how many times each value appears, then write them out in order.
```
[4, 2, 2, 8, 3, 3, 1]   values 0..8
counts: idx 0 1 2 3 4 5 6 7 8
             0 1 2 2 1 0 0 0 1
output: 1, 2, 2, 3, 3, 4, 8
```
The stable version turns counts into prefix sums (= starting positions) and places elements
from right to left. That stability is what radix sort relies on.

**Radix sort** - counting-sort by the last digit, then the tens digit, then hundreds... (LSD).
```
[170, 45, 75, 90, 802, 24, 2, 66]
by ones:     170 90 802 2 24 45 75 66
by tens:     802 2 24 45 66 170 75 90
by hundreds: 2 24 45 66 75 90 170 802      <- sorted after d = 3 passes
```
Works because each pass is stable: ties on the current digit keep the order from previous passes.

**Bucket sort** - split the range into n buckets, drop each value in its bucket, sort buckets
(insertion sort), concatenate. O(n) when values are spread evenly.
```
[0.42, 0.32, 0.23, 0.52, 0.25, 0.47]  n=6 buckets of width 1/6
bucket 1: [0.23, 0.25]  bucket 2: [0.42, 0.32, 0.47]->[0.32,0.42,0.47]  bucket 3: [0.52]
concat -> [0.23, 0.25, 0.32, 0.42, 0.47, 0.52]
```

**Shell sort** - insertion sort on elements `gap` apart, shrinking the gap (n/2, n/4, ... 1).
Big gaps move elements far quickly; the final gap=1 pass is a plain insertion sort on
nearly-sorted data, which is O(n).

---

## Pseudocode

```
MERGE SORT                                  QUICKSORT (Lomuto partition)
mergeSort(a):                               quickSort(a, lo, hi):
    if len(a) <= 1: return a                    if lo >= hi: return
    mid <- len(a) / 2                           p <- partition(a, lo, hi)
    L <- mergeSort(a[0..mid))                   quickSort(a, lo, p - 1)
    R <- mergeSort(a[mid..n))                   quickSort(a, p + 1, hi)
    return merge(L, R)
                                            partition(a, lo, hi):
merge(L, R):                                    swap a random index into hi   // avoid O(n^2) on sorted input
    i, j <- 0; out <- []                        pivot <- a[hi]; i <- lo
    while i < len(L) and j < len(R):            for j in lo..hi-1:
        take the smaller of L[i], R[j]              if a[j] < pivot: swap a[i], a[j]; i += 1
        (take L[i] on ties -> stable)           swap a[i], a[hi]; return i
    append the leftovers
```

---

## Dry run on a concrete example

Lomuto partition of `[3, 8, 2, 5, 1, 4]` with pivot `4` (last element):

| j | a[j] | a[j] < 4? | action | i after | array after |
|---|---|---|---|---|---|
| 0 | 3 | yes | swap a[0], a[0] | 1 | 3 8 2 5 1 4 |
| 1 | 8 | no | - | 1 | 3 8 2 5 1 4 |
| 2 | 2 | yes | swap a[1], a[2] | 2 | 3 2 8 5 1 4 |
| 3 | 5 | no | - | 2 | 3 2 8 5 1 4 |
| 4 | 1 | yes | swap a[2], a[4] | 3 | 3 2 1 5 8 4 |
| end | - | - | swap a[3], a[5] | 3 | 3 2 1 **4** 8 5 |

The pivot 4 is now at its final index 3: everything left is smaller, everything right is larger or equal.

---

## Operations & complexity

| Task | Best tool | Time | Space | Note |
|---|---|---|---|---|
| Sort anything in JS | `arr.sort(cmp)` (TimSort) | O(n log n) | O(n) | stable |
| Kth smallest / largest | quickselect | O(n) avg, O(n^2) worst | O(1) | `quickselect.js`; heap is O(n log k) |
| Sort 0/1/2 values | Dutch national flag | O(n) | O(1) | one pass, three pointers |
| Sort small-range integers | counting sort | O(n + k) | O(k) | |
| Sort by string/number keys with many digits | radix | O(d * n) | O(n) | |
| Count inversions / "smaller after self" | merge sort with counting | O(n log n) | O(n) | |
| Sort a linked list | merge sort | O(n log n) | O(log n) | no random access -> no quick sort |
| Check if sorted | one pass | O(n) | O(1) | |

---

## JavaScript implementation

Full code with a randomized self-test for every algorithm: `02_Implementations/sorting_algorithms.js`.
Kth smallest: `quickselect.js`. The two you must be able to write from memory:

```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);   // <= keeps it stable
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}

function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const p = partition(arr, lo, hi);                 // pivot ends at index p
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
  return arr;
}
function partition(arr, lo, hi) {                   // Lomuto, random pivot
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [arr[r], arr[hi]] = [arr[hi], arr[r]];
  const pivot = arr[hi];
  let store = lo;                                   // everything before `store` is < pivot
  for (let i = lo; i < hi; i++) {
    if (arr[i] < pivot) { [arr[i], arr[store]] = [arr[store], arr[i]]; store++; }
  }
  [arr[store], arr[hi]] = [arr[hi], arr[store]];
  return store;
}
```

---

## Patterns / variations

### 1. Custom comparator (sort by a derived key)

```js
// Largest Number: order so that concatenation is biggest
nums.map(String).sort((a, b) => (b + a).localeCompare(a + b));
// Sort by frequency desc, then value asc
items.sort((a, b) => freq.get(b) - freq.get(a) || a - b);
```
Use when: the "order" is not plain numeric. State the comparator contract out loud.

### 2. Sort then two pointers / binary search

```js
nums.sort((a, b) => a - b);
let left = 0, right = nums.length - 1;
while (left < right) { /* move based on nums[left] + nums[right] vs target */ }
```
Use when: pairs, triplets, closest sum, "two sum II". O(n log n) dominated by the sort.

### 3. Sort intervals by start

```js
intervals.sort((a, b) => a[0] - b[0]);
const merged = [intervals[0]];
for (const [start, end] of intervals.slice(1)) {
  const last = merged[merged.length - 1];
  if (start <= last[1]) last[1] = Math.max(last[1], end); else merged.push([start, end]);
}
```
Use when: merge/insert intervals, meeting rooms, overlapping ranges. Full topic in `31_Intervals`.

### 4. Counting sort for small ranges / characters

```js
const counts = new Array(26).fill(0);
for (const ch of s) counts[ch.charCodeAt(0) - 97]++;
let out = '';
for (let i = 0; i < 26; i++) out += String.fromCharCode(97 + i).repeat(counts[i]);
```
Use when: values are bounded (letters, 0..100 scores, citations <= n). O(n + k).

### 5. Merge sort with extra work during merge

```js
// while merging, every time we take from the RIGHT half, all remaining LEFT
// elements are greater -> count inversions / "smaller numbers after self"
if (left[i] <= right[j]) { counts[idx(left[i])] += j; out.push(left[i++]); }
else out.push(right[j++]);
```
Use when: "count pairs i < j with nums[i] > nums[j]" style questions (Count of Smaller
Numbers After Self, Reverse Pairs). The hard-problem pattern of this folder.

### 6. Quickselect for "kth"

Partition like quick sort but recurse into ONLY the side containing index k. Average O(n).
Use when: kth largest, median, top-k when you do not need them sorted. See `quickselect.js`.

### 7. Dutch national flag (three-way partition)

```js
let low = 0, mid = 0, high = nums.length - 1;
while (mid <= high) {
  if (nums[mid] === 0)      swap(low++, mid++);
  else if (nums[mid] === 2) swap(mid, high--);     // do NOT advance mid: new nums[mid] is unseen
  else mid++;
}
```
Use when: sort 3 distinct values in one pass (Sort Colors), partition around a pivot with duplicates.

### 8. Bucket by value (Maximum Gap, Top K Frequent)

Put elements into O(n) buckets by value range or by frequency, then scan buckets. Turns an
O(n log n) problem into O(n) when the key range is known.

---

## Alternatives and trade-offs

| Situation | Best choice | Why |
|---|---|---|
| General use in JS | `arr.sort((a, b) => a - b)` | TimSort, stable, O(n log n) |
| Need a stable sort you wrote yourself | merge sort | stable, guaranteed O(n log n), O(n) space |
| In place, average speed matters | quicksort with random pivot | O(log n) stack, cache friendly; worst case O(n^2) |
| Guaranteed O(n log n) and O(1) extra space | heap sort | not stable, slower in practice |
| Small integer range (ages, a-z) | counting sort O(n + k) | beats comparison sorts |
| Nearly sorted / tiny arrays | insertion sort | O(n) when almost sorted |
| Only need the k-th element | quickselect O(n) average | no need to sort everything |

---

## Common mistakes & edge cases

- `arr.sort()` without a comparator on numbers -> string order `[1, 10, 2]`.
- Comparator returning a boolean (`(a, b) => a > b`) -> inconsistent, broken sort.
- Forgetting `sort` mutates the input; callers may not expect that.
- Merge with `<` instead of `<=` -> not stable (matters for Sort Characters by Frequency,
  stable "sort by key" tasks).
- Quick sort with a fixed first/last pivot on sorted input -> O(n^2) and possibly stack overflow.
  Use a random pivot or median-of-three.
- Quick sort / quickselect with many duplicates -> O(n^2) unless you use three-way partitioning.
- Counting sort with negative numbers -> offset by the minimum value.
- Radix sort with negatives -> sort absolute values separately, or offset.
- Off-by-one in `partition`: pivot must end exactly at the returned index.
- Deep recursion in merge sort of a linked list is fine (O(log n) depth); recursing on each
  node is not.
- Empty array, single element, all equal elements, already sorted, reverse sorted: test them all.

---

## When this does NOT apply

- **You only need the min, max or k-th element**: a single pass, a heap or quickselect is cheaper than sorting.
- **The original order matters** (indices in Two Sum, stable relative order): sorting destroys it unless you sort index pairs.
- **Streaming data**: you cannot sort what has not arrived; use a heap or a balanced structure.
- **Counting sort / radix sort** need small integer keys; they do not work for arbitrary comparators.

---

## Interview tips

- Say: "I'll sort first, that's O(n log n), then the rest is O(n)." Interviewers want to see
  you know the sort dominates.
- Know by heart: merge sort (write it), quick sort + partition (write it), and the complexity
  table. Be ready to explain stability with a concrete example (sort by name then by age).
- If asked "which sort would you use", answer with the trade-off: "Quick sort for in-memory
  arrays, merge sort when I need stability or I'm sorting a linked list / external data,
  counting/radix if the keys are small integers, heap sort if I need O(1) space with a
  guaranteed bound."
- Mention JavaScript specifics: TimSort, stable since ES2019, the string-comparison trap.
- For "kth largest": say "sorting is O(n log n), a heap is O(n log k), quickselect is O(n)
  average" - then pick based on the follow-up.
- Always ask: duplicates? negatives? range of values? already partially sorted? These decide
  between algorithms.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Sort an Array | Medium | merge sort / quick sort | 03_Problems/solutions/01_sort_an_array.js |
| 02 | Sort Colors | Medium | Dutch national flag | 03_Problems/solutions/02_sort_colors.js |
| 03 | Merge Intervals | Medium | sort by start + sweep | 03_Problems/solutions/03_merge_intervals.js |
| 04 | Kth Largest Element in an Array | Medium | quickselect | 03_Problems/solutions/04_kth_largest_element.js |
| 05 | Largest Number | Medium | custom comparator | 03_Problems/solutions/05_largest_number.js |
| 06 | Meeting Rooms II | Medium | sort starts & ends (teaser for intervals) | 03_Problems/solutions/06_meeting_rooms_ii.js |
| 07 | Sort Characters by Frequency | Medium | counting + bucket | 03_Problems/solutions/07_sort_characters_by_frequency.js |
| 08 | Relative Sort Array | Easy | counting sort | 03_Problems/solutions/08_relative_sort_array.js |
| 09 | Maximum Gap | Medium | bucket / radix idea | 03_Problems/solutions/09_maximum_gap.js |
| 10 | H-Index | Medium | counting sort | 03_Problems/solutions/10_h_index.js |
| 11 | Wiggle Sort II | Medium | sort + interleave (virtual indexing) | 03_Problems/solutions/11_wiggle_sort_ii.js |
| 12 | Sort List | Medium | merge sort on a linked list | 03_Problems/solutions/12_sort_list.js |
| 13 | Count of Smaller Numbers After Self | Hard | merge sort with counting | 03_Problems/solutions/13_count_smaller_after_self.js |
| 14 | Reverse Pairs | Hard | merge sort with counting | 03_Problems/solutions/14_reverse_pairs.js |

---

## Practice more

Easy: Merge Sorted Array (88), Squares of a Sorted Array (977), Contains Duplicate (217),
Majority Element (169), Height Checker (1051), Intersection of Two Arrays II (350),
Array Partition (561)

Medium: 3Sum (15), Top K Frequent Elements (347), Insert Interval (57), Non-overlapping
Intervals (435), Car Fleet (853), Sort Transformed Array (360), Pancake Sorting (969),
Custom Sort String (791), Queue Reconstruction by Height (406), Kth Smallest Element in a
Sorted Matrix (378), Minimum Number of Arrows to Burst Balloons (452)

Hard: Median of Two Sorted Arrays (4), Count of Range Sum (327), Create Sorted Array through
Instructions (1649), First Missing Positive (41, cyclic sort)
