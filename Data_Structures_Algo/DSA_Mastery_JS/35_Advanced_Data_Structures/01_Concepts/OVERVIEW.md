# 35 — Advanced Data Structures

You have finished arrays, hashing, stacks, queues, trees, heaps, tries and graphs. This folder
is the "second shelf": structures that show up in **hard** interview questions, in design
rounds, and in the follow-up *"what if the array changes / the input is huge / you need this
in O(1)?"*. Every sub-folder explains its structure from zero, gives a runnable JavaScript
implementation with randomized tests against a brute-force reference, and a set of problems
in the usual format.

---

## Overview

| Structure | Answers the question | Build | Query | Update | Appears in interviews as |
|-----------|---------------------|-------|-------|--------|--------------------------|
| [Segment tree](../../34_Range_Query_Data_Structures/01_Segment_Tree) | "f(nums[l..r]) right now?" for sum/min/max while the array changes; range updates with lazy tags | O(n) | O(log n) | O(log n) point, O(log n) range (lazy) | Range Sum Query Mutable, Falling Squares, My Calendar III, counting over values |
| [Fenwick tree (BIT)](../../34_Range_Query_Data_Structures/02_Fenwick_Tree) | "prefix sum / count of seen values <= x?" with point updates, in 10 lines | O(n) | O(log n) | O(log n) | Count of Smaller Numbers After Self, Reverse Pairs, inversions, order statistics |
| [LRU / LFU cache](../01_LRU_And_LFU_Cache) | "bounded cache with O(1) get/put and an eviction policy" | - | O(1) | O(1) | LRU Cache (top-5 most asked), LFU Cache, Browser History, Time-Based KV store |
| [Sparse table](../../34_Range_Query_Data_Structures/03_Sparse_Table) | "min/max/gcd of a static range in O(1)?" | O(n log n) | O(1) | none (static) | offline RMQ, Sliding Window Maximum, LCP of suffixes, LCA via Euler tour |
| [Union-find (advanced)](../../27_Union_Find_Disjoint_Set/02_Advanced_Union_Find) | "same group?" when groups only merge; plus weighted relations and undo | O(n) | O(alpha(n)) | O(alpha(n)) | Evaluate Division, Equality Equations, Number of Islands II, Accounts Merge |
| [Monotonic stack / deque](../../18_Monotonic_Stacks_And_Queues) | "nearest smaller/greater element", "max of every window", "sum of subarray minimums" | - | O(1) amortized | O(1) amortized | Largest Rectangle in Histogram, Stock Span, Sliding Window Max, Jump Game VI |
| [Skip list](../02_Skip_List_Bloom_Filter_Sorted_List) | "sorted set with O(log n) insert/delete/search, no balancing code" | - | O(log n) expected | O(log n) expected | Design Skiplist; Redis sorted sets in system design |
| [Bloom filter](../02_Skip_List_Bloom_Filter_Sorted_List) | "probably seen / definitely not seen, with tiny memory" | O(m) | O(k) | O(k) add, no delete | System design (caches, URL blocklists, DB lookups) |
| [SortedList (TreeMap substitute)](../02_Skip_List_Bloom_Filter_Sorted_List) | "floor / ceiling / rank in a sorted collection" in JavaScript | O(n log n) | O(log n) | O(n) splice | My Calendar I, Contains Duplicate III, Exam Room, sliding window median |

`alpha(n)` is the inverse Ackermann function (< 5 for all practical n).

---

## How to choose for "range query" problems

```
Does the array change between queries?
  no  -> sum / xor        -> prefix sums (../08_Prefix_Sums_And_Difference_Arrays/)
      -> min / max / gcd  -> sparse table (O(1) query)
  yes -> only sums/counts with point updates -> Fenwick tree (shortest code)
      -> min / max / custom merge            -> segment tree
      -> range UPDATES (add v to [l, r])     -> segment tree with lazy propagation
Windows of fixed size k, max/min only        -> monotonic deque (O(n) total)
Values up to 1e9 but few of them             -> coordinate compression first, then any tree
```

## How to choose for "ordered collection" problems

```
Need O(1) membership only                   -> Set / Map (../05_Hashing/)
Need floor / ceiling / k-th / count <= x    -> SortedList (sorted array + bisect)
Need O(log n) inserts at 1e6 scale          -> skip list or a BST you can write under pressure
Need "did we probably see this" in bits     -> Bloom filter
Bounded cache with eviction                 -> LRU / LFU
```

---

## Study order

1. **18_Monotonic_Stacks_And_Queues** — builds directly on stacks and queues you already know; every
   problem here is a common interview question.
2. **35_Advanced_Data_Structures/01_LRU_And_LFU_Cache** — the single most frequently asked design question. Learn the doubly
   linked list + Map version by heart.
3. **34_Range_Query_Data_Structures/02_Fenwick_Tree** — ten lines, unlocks a whole family of counting problems.
4. **34_Range_Query_Data_Structures/01_Segment_Tree** — the general tool. Do the iterative version first, then lazy propagation.
5. **27_Union_Find_Disjoint_Set/02_Advanced_Union_Find** — recap union-find, then weighted and rollback variants.
6. **34_Range_Query_Data_Structures/03_Sparse_Table** — short; mostly about knowing when O(1) static queries exist.
7. **35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List** — the SortedList is useful immediately; skip list and
   Bloom filter are "know what they are and how they work" for design rounds.

Each sub-folder has its own README with diagrams, an implementation file ending in a
`self-test`, and a `problems/` directory. Run any file with `node <file>` - every one prints a
check mark when its tests pass.

---

## Sub-folders

| Folder | Implementation files | Problems |
|--------|---------------------|----------|
| 34_Range_Query_Data_Structures/01_Segment_Tree/ | segment-tree.js | 6 |
| 34_Range_Query_Data_Structures/02_Fenwick_Tree/ | fenwick-tree.js | 5 |
| 35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/ | lru-cache.js, lfu-cache.js | 5 |
| 34_Range_Query_Data_Structures/03_Sparse_Table/ | sparse-table.js | 3 |
| 27_Union_Find_Disjoint_Set/02_Advanced_Union_Find/ | union-find.js | 4 |
| 18_Monotonic_Stacks_And_Queues/ | monotonic.js | 6 |
| 35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/ | skip-list.js, bloom-filter.js, sorted-list.js | 5 |

Next: `../41_Advanced_Algorithm_Design/` (string algorithms, divide & conquer, classic techniques,
geometry), then `../42_Interview_Problem_Patterns/` and `../45_Revision_And_Spaced_Repetition/`.
