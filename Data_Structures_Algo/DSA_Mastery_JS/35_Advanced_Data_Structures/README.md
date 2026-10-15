# Advanced Data Structures

This topic is the "second shelf" of data structures: the ones that show up in hard interview questions, in design rounds, and in follow-ups like *"now make every operation O(1)"* or *"JavaScript has no TreeMap — what do you use?"*. It has two sub-topics: **caches** (LRU and LFU, among the most-asked design questions) and **ordered / probabilistic structures** (sorted list, skip list, Bloom filter). Range-query structures (segment tree, Fenwick tree, sparse table) live in their own topic, [34_Range_Query_Data_Structures](../34_Range_Query_Data_Structures/README.md).

Start with the big picture: **[01_Concepts/OVERVIEW.md](01_Concepts/OVERVIEW.md)** — a comparison table of every advanced structure, what question it answers and how to choose between them.

**Prerequisites:** [Hashing](../05_Hashing/README.md), [Linked Lists](../15_Linked_Lists/README.md), [Searching](../10_Searching/README.md), [Heaps](../19_Heaps_And_Priority_Queues/README.md)

## Sub-topics

| # | Sub-topic | What you learn | Level | Problems |
|---|---|---|---|---|
| 01 | [LRU & LFU Cache](01_LRU_And_LFU_Cache/README.md) | hash map + doubly linked list, `Map` insertion order, frequency buckets + `minFreq`, design problems (browser history, time-based KV store, in-memory file system) | Essential (LRU) / Advanced (LFU) | 5 |
| 02 | [Skip List, Bloom Filter & Sorted List](02_Skip_List_Bloom_Filter_Sorted_List/README.md) | sorted array + bisect as a TreeMap substitute, randomised skip lists, Bloom filters for approximate membership | Essential (SortedList) / Advanced (skip list, Bloom filter) | 5 |

## Study order

1. Read [01_Concepts/OVERVIEW.md](01_Concepts/OVERVIEW.md) once to see where each structure fits.
2. **LRU & LFU Cache** — read the concepts, code LRU twice (with `Map`, then with a doubly linked list), then LFU. Solve problems 01 → 05.
3. **Skip List, Bloom Filter & Sorted List** — build the SortedList first (it is the tool you will actually use in JS interviews), then the skip list and Bloom filter. Solve problems 01 → 05.
4. For each sub-topic, answer its interview questions out loud and take its quiz (`04_Interview_And_Assessment/`).
5. Revisit after [Range Query Data Structures](../34_Range_Query_Data_Structures/README.md): many "sorted list" problems also have a Fenwick / segment tree solution — compare them.

## Running the tests

From the curriculum root:

```
node --test 35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/tests/lru_and_lfu_cache.test.js
node --test 35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/tests/skip_list_bloom_filter_sorted_list.test.js
```

Each implementation file also runs its own self-test: `node 35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/02_Implementations/lru_cache.js`.
