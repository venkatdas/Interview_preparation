# Skip List, Bloom Filter & Ordered-Map Substitutes

This folder collects the "you should know these exist" structures. A **skip list** is a sorted
linked list with express lanes so search is O(log n) - like a subway map where express trains
skip most stations. A **Bloom filter** is a fingerprint-based membership test that can say
"definitely not seen" or "probably seen" using a few bits per item - like a bouncer who only
remembers a blurry sketch of every face. And because JavaScript has **no TreeMap / TreeSet**,
we also build a **SortedList** (sorted array + binary search) that stands in for one in
interviews.

---

## Prerequisites

- [Linked Lists](../../../15_Linked_Lists/README.md) — a skip list is a stack of sorted linked lists.
- [Searching](../../../10_Searching/README.md) — `bisectLeft` / `bisectRight` power the SortedList.
- [Hashing](../../../05_Hashing/README.md) — a Bloom filter is k hash functions over a bit array.

**Essential vs Advanced:** the SortedList (sorted array + binary search for floor / ceiling / count-in-range) is **Essential** in JavaScript interviews because JS has no TreeMap. Skip lists (LeetCode 1206) and Bloom filters are **Advanced** — know how they work and their trade-offs; code a skip list only when asked.

---

## Why it matters / when to use

- "Design a sorted set / ordered map with insert, delete, floor, ceiling" → skip list
  (LeetCode 1206) or a SortedList in JS
- "Keep a sliding window and ask for the nearest value" → SortedList (Contains Duplicate III)
- "Book an interval if it does not overlap" → sorted intervals + bisect (My Calendar I)
- "Seat farthest from everyone" → sorted occupied positions (Exam Room)
- "Have we seen this URL / username / item, with tiny memory, false positives OK" → Bloom filter
- System-design rounds: Redis sorted sets (skip list), Cassandra/HBase/Chrome (Bloom filters)

Frontend relevance: a Bloom filter is how browsers check URLs against malware lists without
downloading the whole list, and how a client can skip API calls for items that are certainly
not cached.

---

## How it works

### Skip list

```
level 2:  HEAD ----------------------> 30 --------------------------> NULL
level 1:  HEAD --------> 10 ---------> 30 ---------> 50 ------------> NULL
level 0:  HEAD -> 5 ---> 10 -> 20 ---> 30 -> 40 ---> 50 -> 60 ------> NULL
```

- Level 0 holds every element in sorted order. Each node is promoted to the next level with
  probability 1/2 (flip a coin until tails), so level k has about n / 2^k nodes.
- **search(40)**: start at HEAD on the top level. Move right while `next.value < 40`;
  otherwise drop one level. Level 2: 30 → drop. Level 1: at 30, next is 50 → drop.
  Level 0: at 30, next is 40 → found. Expected O(log n) steps.
- **insert(x)**: do the same walk but remember the last node visited on **every** level
  (`update[i]`). Pick a random height `h`. Splice the new node in after `update[i]` on levels
  0..h.
- **delete(x)**: same walk; on every level where `update[i].next` is the node, unlink it.

Expected O(log n) for all three with O(n) expected space (about 2n pointers in total).
It is a simpler alternative to red-black trees and is easy to make lock-free, which is why
databases like it.

### Bloom filter

```
m = 16 bits, k = 3 hashes

add("cat"):  h1 -> 2, h2 -> 7, h3 -> 11        bits: 0010000100010000
add("dog"):  h1 -> 5, h2 -> 7, h3 -> 14        bits: 0010010100010010

mightContain("cat"): bits 2, 7, 11 all set -> "probably yes"  (correct)
mightContain("cow"): hashes to 2, 5, 9 -> bit 9 is 0 -> "definitely no"
mightContain("eel"): hashes to 5, 11, 14 -> all set -> "probably yes"  (FALSE POSITIVE)
```

- Never a false negative: adding sets bits, nothing ever clears them.
- False positive rate `p ≈ (1 − e^(−kn/m))^k`. For a target `p` and `n` items:
  `m = −n·ln(p) / (ln 2)^2` bits, `k = (m/n)·ln 2` hashes. Example: 1 million items at 1%
  → ~9.6 million bits (1.2 MB), k = 7.
- We get k hashes cheaply from two base hashes: `h_i = h1 + i·h2 (mod m)` (double hashing).
- Cannot delete (a counting Bloom filter uses small counters instead of bits).

### Ordered map substitute in JavaScript

| Need | Java / C++ | JavaScript option |
|------|------------|-------------------|
| sorted set with floor/ceiling | TreeSet | `SortedList` (sorted array + bisect) |
| sorted map | TreeMap | `SortedList` of `[key, value]` with a comparator |
| O(log n) insert *and* search at 10^6 scale | TreeMap | skip list / your own balanced BST |

The sorted-array version: search / floor / ceiling / rank are O(log n) by binary search;
insert / remove are O(log n) + `splice`, which is O(n) memmove but extremely fast in V8.
Up to ~10^5 elements it beats any tree you can write in an interview.

### Also know by name

- **Trie** ([Tries](../../../22_Tries/README.md)): sorted order for free over strings; prefix queries.
- **Interval tree**: BST on interval starts, each node stores the max end in its subtree;
  "find any interval overlapping [l, r]" in O(log n). Interview version: sorted list + bisect.
- **Treap**: BST keyed by value, heap-ordered by random priority → expected O(log n) without
  rotation case analysis. Supports split/merge, order statistics. Rare in interviews.

---

## Pseudocode (Essential)

```
SortedList (array a kept sorted)
bisectLeft(x):  first index i with a[i] >= x      (binary search)
bisectRight(x): first index i with a[i] >  x
add(x):    a.splice(bisectRight(x), 0, x)
floor(x):  a[bisectRight(x) - 1]      ceiling(x): a[bisectLeft(x)]
countBetween(lo, hi) = bisectRight(hi) - bisectLeft(lo)

Skip list (Advanced)
search(t):  node = head
            for level from top down to 0:
              while node.next[level] and node.next[level].value < t: node = node.next[level]
              update[level] = node                  # last node < t on this level
            return node.next[0] and node.next[0].value == t
insert(v):  compute update[] as above; L = random level (coin flips)
            for i in 0..L: newNode.next[i] = update[i].next[i]; update[i].next[i] = newNode

Bloom filter (Advanced)
add(x):          for i in 0..k-1: bits[h_i(x) mod m] = 1
mightContain(x): return all bits[h_i(x) mod m] == 1    # false = definitely absent
```

---

## Dry run — SortedList for Contains Duplicate III, nums = [1, 5, 9, 1, 5, 9], k = 2, t = 3 (Essential)

Protocol per step: query the window, then add nums[i], then drop nums[i - k] so the window keeps at most k elements.

| i | nums[i] | window (sorted) | ceiling(nums[i] - t) | close enough? | window after add + drop |
|---|---|---|---|---|---|
| 0 | 1 | [] | none | no | [1] |
| 1 | 5 | [1] | ceiling(2) = none | no | [1, 5] |
| 2 | 9 | [1, 5] | ceiling(6) = none | no | add 9, drop nums[0]=1 → [5, 9] |
| 3 | 1 | [5, 9] | ceiling(-2) = 5 | 5 - 1 = 4 > 3, no | add 1, drop nums[1]=5 → [1, 9] |
| 4 | 5 | [1, 9] | ceiling(2) = 9 | 9 - 5 = 4 > 3, no | add 5, drop nums[2]=9 → [1, 5] |
| 5 | 9 | [1, 5] | ceiling(6) = none | no | done |

Answer **false**. The window never holds more than k = 2 earlier elements, and one `ceiling` query per step decides whether a close-enough value exists.

---

## Operations & complexity

| Structure | Search | Insert | Delete | Space | Note |
|-----------|--------|--------|--------|-------|------|
| Sorted array (SortedList) | O(log n) | O(n) splice | O(n) splice | O(n) | fastest in practice up to ~10^5 |
| Skip list | O(log n) expected | O(log n) expected | O(log n) expected | O(n) expected | randomised |
| Balanced BST (AVL / red-black) | O(log n) | O(log n) | O(log n) | O(n) | long to write by hand |
| Treap | O(log n) expected | O(log n) expected | O(log n) expected | O(n) | split / merge |
| Bloom filter | O(k) | O(k) | not supported | O(m) bits | false positives, no false negatives |
| Hash set | O(1) avg | O(1) avg | O(1) avg | O(n) full keys | no order, no floor/ceiling |

---

## JavaScript implementation

Three files, each with randomized tests against a sorted-array / plain-set reference:

- `sorted-list.js` — `SortedList`: `add`, `remove`, `has`, `bisectLeft`, `bisectRight`,
  `floor`, `ceiling`, `lower`, `higher`, `at`, `countBetween`, custom comparator.
- `skip-list.js` — `SkipList`: `search`, `insert`, `delete`, `toArray`.
- `bloom-filter.js` — `BloomFilter`: `add`, `mightContain`, `BloomFilter.forCapacity(n, p)`.

The bisect core everything else is built on:

```js
bisectLeft(x) {                       // first index with items[i] >= x
  let lo = 0, hi = this.items.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (this.items[mid] < x) lo = mid + 1; else hi = mid;
  }
  return lo;
}
add(x)     { this.items.splice(this.bisectRight(x), 0, x); }
floor(x)   { const i = this.bisectRight(x) - 1; return i >= 0 ? this.items[i] : undefined; }
ceiling(x) { const i = this.bisectLeft(x); return i < this.items.length ? this.items[i] : undefined; }
```

---

## Patterns / variations

### 1. Sorted window (sliding window + nearest value)

```js
const window = new SortedList();
for (let i = 0; i < nums.length; i++) {
  const c = window.ceiling(nums[i] - t);
  if (c !== undefined && c <= nums[i] + t) return true;
  window.add(nums[i]);
  if (window.size > k) window.remove(nums[i - k]);
}
```
Use when: Contains Duplicate III, "median of sliding window", "max-min <= limit".

### 2. Sorted intervals + neighbours check

Only the interval just before and just after a new start can overlap it → two bisects.
Use when: My Calendar I, Range Module, Data Stream as Disjoint Intervals.

### 3. Count in a value range with two bisects

`countBetween(lo, hi) = bisectRight(hi) - bisectLeft(lo)`.
Use when: Count of Range Sum, "how many seen values in [a, b]".

### 4. Skip list as a sorted set

Write it when the problem literally says "implement a skiplist", or when you need true
O(log n) insert at large scale without a library.

### 5. Bloom filter in front of an expensive lookup

```js
if (!bloom.mightContain(key)) return MISS;   // certainly absent, skip the network/disk
return expensiveLookup(key);                 // maybe present
```

---

## Alternatives and trade-offs

| Need | Option | Insert / delete | Query | Notes |
|---|---|---|---|---|
| Ordered set in JS | SortedList (array + bisect) | O(n) worst (splice), fast in practice | O(log n) | simplest; fine for n ≤ ~10^5 |
| Ordered set, guaranteed | Skip list | O(log n) expected | O(log n) expected | randomised; simpler than a balanced BST |
| Ordered set, guaranteed | Balanced BST (AVL / red-black) | O(log n) | O(log n) | rarely coded in interviews |
| Count in value range | [Fenwick tree](../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/README.md) over compressed values | O(log n) | O(log n) | needs all values up front (offline) |
| Membership, exact | `Set` | O(1) | O(1) | memory grows with items |
| Membership, approximate | Bloom filter | O(k) | O(k) | tiny memory; false positives, no deletion |

---

## When this does NOT apply

- You only need min or max, not arbitrary floor/ceiling — a [heap](../../../19_Heaps_And_Priority_Queues/README.md) is simpler.
- You need exact membership with deletions — a Bloom filter cannot delete (use a `Set`, or a counting Bloom filter).
- All values are known in advance and only counts are needed — a Fenwick tree over compressed values is O(log n) guaranteed.
- n is tiny — sort the array when needed and skip the extra structure.

---

## Common mistakes & edge cases

- Bisect direction: `floor` uses `bisectRight - 1`, `ceiling` uses `bisectLeft`. Draw the
  array with duplicates to check.
- Inserting with `bisectLeft` puts the new element *before* equal ones; it still works but
  `remove` then removes the newest copy. Pick one convention.
- Comparators on objects: `SortedList` with intervals needs `(a, b) => a[0] - b[0]`, and
  probes must have the same shape (`[start, 0]`).
- Skip list `delete`: stop unlinking at the first level where the predecessor does not
  point at the node; also lower `level` when the top level becomes empty.
- Skip list `insert` when the random height exceeds the current top level: the new
  predecessors on those levels are `head`.
- Bloom filter: `h1 + i·h2` overflows 32 bits in JS when done with `|`; keep it in plain
  numbers and reduce modulo `m` at each step. Make `h2` odd so the k positions differ.
- Bloom filter cannot answer "definitely present" and cannot delete.

---

## Interview tips

- When a problem needs TreeMap behaviour, say: *"JS has no ordered map; I'll keep a sorted
  array with binary search - O(log n) search, O(n) insert, which is fine for this size - and
  note that a balanced BST or skip list would make inserts O(log n)."* Interviewers accept it.
- For a skip list, explain the coin-flip levels and the predecessor array before coding.
- For a Bloom filter in system design, give the two guarantees (no false negatives, tunable
  false positives), the memory formula, and one real use (cache miss avoidance).
- Mention Redis sorted sets use skip lists - it shows you connect theory to systems.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | My Calendar I | Medium | sorted intervals + neighbour check | 03_Problems/solutions/01_my_calendar_i.js |
| 02 | Contains Duplicate III | Hard | sorted sliding window + ceiling | 03_Problems/solutions/02_contains_duplicate_iii.js |
| 03 | Exam Room | Medium | sorted occupied seats, scan gaps | 03_Problems/solutions/03_exam_room.js |
| 04 | Design Skiplist | Hard | skip list from scratch | 03_Problems/solutions/04_design_skiplist.js |
| 05 | Count of Range Sum (sorted list) | Hard | prefix sums + countBetween | 03_Problems/solutions/05_count_of_range_sum_sorted_list.js |

---

## Practice more

Medium: My Calendar I (729), My Calendar II (731), Exam Room (855), Snapshot Array (1146),
Online Election (911), Find Right Interval (436), Summary Ranges / Data Stream as Disjoint
Intervals (352), Design a Stack With Increment Operation (1381), Finding MK Average (1825),
Stock Price Fluctuation (2034)

Hard: Contains Duplicate III (220), Count of Range Sum (327), Design Skiplist (1206),
Range Module (715), Sliding Window Median (480), Max Value of Equation (1499),
Longest Continuous Subarray With Absolute Diff <= Limit (1438), Count of Smaller Numbers
After Self (315, sorted-list insertion version)
