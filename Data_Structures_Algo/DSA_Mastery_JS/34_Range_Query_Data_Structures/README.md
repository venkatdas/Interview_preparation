# Range Query Data Structures

Many interview problems boil down to one question asked over and over: **"what is the sum / min / max / count of `nums[l..r]`?"** — sometimes while the array keeps changing. A plain loop answers each question in O(n), which is too slow when there are 10^5 queries. This topic teaches the three classic structures that answer such questions in O(log n) or even O(1): the **segment tree**, the **Fenwick tree (BIT)** and the **sparse table**. Think of them as prefix sums that grew up: they precompute partial answers for well-chosen blocks so that any range can be assembled from a few blocks.

**Prerequisites:** [Prefix Sums And Difference Arrays](../08_Prefix_Sums_And_Difference_Arrays/README.md), [Bit Manipulation](../14_Bit_Manipulation/README.md), [Trees](../20_Trees), [Divide And Conquer](../30_Divide_And_Conquer/README.md)

## Sub-topics

| # | Sub-topic | What you learn | Problems | Tests |
|---|---|---|---|---|
| 01 | [Segment Tree](01_Segment_Tree/README.md) | any associative merge (sum / min / max / gcd), point updates, lazy range updates, trees over values, dynamic trees | 6 | `01_Segment_Tree/tests/segment_tree.test.js` |
| 02 | [Fenwick Tree](02_Fenwick_Tree/README.md) | prefix sums with updates in ~10 lines, counting with compressed values, k-th element, 2D BIT | 5 | `02_Fenwick_Tree/tests/fenwick_tree.test.js` |
| 03 | [Sparse Table](03_Sparse_Table/README.md) | O(1) range min / max / gcd on static arrays, LCP and LCA as range-min queries | 3 | `03_Sparse_Table/tests/sparse_table.test.js` |

## Which structure should I pick?

| Situation | Pick | Query | Update | Memory |
|---|---|---|---|---|
| Static array, range **sum** | prefix sums | O(1) | O(n) | O(n) |
| Static array, range **min / max / gcd** | sparse table | O(1) | rebuild | O(n log n) |
| Changing array, range **sum / count / xor** | Fenwick tree | O(log n) | O(log n) | O(n) |
| Changing array, range **min / max / custom merge** | segment tree | O(log n) | O(log n) | O(n) |
| **Range** updates (add / assign) + range queries | lazy segment tree | O(log n) | O(log n) | O(n) |
| Coordinates up to 10^9, online | dynamic segment tree (or compress offline) | O(log C) | O(log C) | O(q log C) |

Rule of thumb for interviews: say the simplest structure that works, mention the alternative, then code it.

## Study order

1. **Fenwick Tree** first if you want the quickest win: it is short and teaches the "blocks of powers of two" idea. Many people prefer starting with the **Segment Tree** because it is more general — either order works; finish both.
2. **Segment Tree**: code the recursive version with a generic merge, then the iterative version, then lazy propagation.
3. **Sparse Table**: short, and it connects to [Advanced String Algorithms](../33_String_Algorithms_Advanced/README.md) (LCP queries) and LCA in [Advanced Algorithm Design](../41_Advanced_Algorithm_Design/01_Classic_Techniques/README.md).
4. For each sub-topic: read `01_Concepts/CONCEPTS.md`, run the implementation, solve the problems, then do the interview questions and quiz in `04_Interview_And_Assessment`.

## Run the tests

From the curriculum root:

```
node --test 34_Range_Query_Data_Structures/01_Segment_Tree/tests/segment_tree.test.js
node --test 34_Range_Query_Data_Structures/02_Fenwick_Tree/tests/fenwick_tree.test.js
node --test 34_Range_Query_Data_Structures/03_Sparse_Table/tests/sparse_table.test.js
```
