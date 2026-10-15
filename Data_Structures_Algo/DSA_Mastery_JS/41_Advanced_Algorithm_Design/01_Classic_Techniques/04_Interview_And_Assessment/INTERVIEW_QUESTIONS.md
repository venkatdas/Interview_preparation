# Classic Techniques — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. Explain Kadane's algorithm and its invariant.

<details><summary>Model answer</summary>

Keep `bestEndingHere` = the best sum of a subarray that ends at the current index. It is either the current element alone or the current element added to the previous best ending (`max(x, bestEndingHere + x)`). The global answer is the max over all positions. O(n) time, O(1) space; initialise with `nums[0]` so all-negative arrays work.
</details>

### 2. Why does Boyer-Moore voting find a majority element?

<details><summary>Model answer</summary>

Think of pairing each majority vote with a different value and cancelling both. Since the majority has more than n/2 copies, it cannot be fully cancelled, so it is the survivor. If a majority is not guaranteed, do a second pass to verify the candidate's count.
</details>

### 3. How do you generalise voting to elements appearing more than n/k times?

<details><summary>Model answer</summary>

Keep up to k-1 candidates with counts. A matching value increments its count; a new value takes a free slot; otherwise decrement every count (removing zeros). At most k-1 values can exceed n/k, and each survives. Verify all candidates at the end. O(n·k) time, O(k) space; k = 3 is Majority Element II.
</details>

### 4. Why does Floyd's cycle detection find the duplicate number?

<details><summary>Model answer</summary>

With values in 1..n and n+1 slots, treat `i -> nums[i]` as a linked list starting at index 0. Two indices point to the duplicate value, so the duplicate is the entrance of a cycle. Phase 1 finds a meeting point inside the cycle; phase 2 moves one pointer from the start and one from the meeting point at the same speed — they meet at the entrance (distance from start to entrance equals distance from meeting point to entrance modulo the cycle length).
</details>

### 5. Explain the Dutch national flag partition.

<details><summary>Model answer</summary>

Three pointers: `[0, low)` holds 0s, `[low, mid)` holds 1s, `(high, end]` holds 2s, `[mid, high]` is unknown. A 0 swaps with `low` (both advance); a 1 just advances mid; a 2 swaps with `high` and only `high` moves, because the swapped-in value is still unknown. One pass, O(1) space.
</details>

### 6. Prove reservoir sampling (k = 1) is uniform.

<details><summary>Model answer</summary>

Item i is chosen with probability 1/i and then must survive every later step j (kept with probability (j-1)/j). The product is `1/i · i/(i+1) · ... · (n-1)/n = 1/n` — it telescopes. Same argument for k items gives k/n.
</details>

### 7. Why is Fisher-Yates uniform and the "swap with any index" version not?

<details><summary>Model answer</summary>

Fisher-Yates picks j from `[0, i]` for i from n-1 down to 1: `n · (n-1) · ... · 2 = n!` equally likely outcomes, one per permutation. Picking j from `[0, n-1]` every time gives n^n outcomes, and n^n is not divisible by n! for n > 2, so some permutations must be more likely.
</details>

### 8. What is quickselect's complexity and how do you avoid the worst case?

<details><summary>Model answer</summary>

Partition around a pivot and recurse only into the side containing the k-th element: expected O(n) (n + n/2 + n/4 ...). A bad pivot every time gives O(n^2); a random pivot makes that very unlikely. Three-way partitioning handles many duplicates. Median-of-medians guarantees O(n) worst case but is rarely coded.
</details>

### 9. When is meet in the middle the right tool?

<details><summary>Model answer</summary>

When brute force is 2^n with n around 30–40 and there is no polynomial DP (values are huge or negative). Split into two halves, enumerate 2^(n/2) subset sums for each, sort one side, and combine with binary search or two pointers: O(2^(n/2) · n). Examples: Closest Subsequence Sum, Partition Array to Minimize Sum Difference (group sums by subset size).
</details>

### 10. How does cyclic sort work and when does it apply?

<details><summary>Model answer</summary>

When values are in 1..n (or 0..n-1), each value has a "home" index. Swap `nums[i]` to its home until the current slot holds its own value or a duplicate, then move on. Each swap fixes one value, so O(n). After it, scanning for `nums[i] != i + 1` finds missing or duplicate numbers (First Missing Positive, Find All Duplicates).
</details>

### 11. What is binary lifting?

<details><summary>Model answer</summary>

Precompute `up[k][v]` = the 2^k-th ancestor of v using `up[k][v] = up[k-1][up[k-1][v]]`. Then any k-th ancestor is reached by jumping along the set bits of k: O(log n) per query after O(n log n) preprocessing. LCA: lift the deeper node to the same depth, then jump both up from the largest power while their ancestors differ; the answer is the parent.
</details>

### 12. What is sqrt decomposition and how does it compare to a segment tree?

<details><summary>Model answer</summary>

Split the array into about √n blocks and keep each block's aggregate. A query sums at most two partial blocks element by element plus whole blocks: O(√n). A point update fixes one element and one block sum: O(1). Simpler to write than a segment tree but O(√n) instead of O(log n) per query. It shines for awkward operations and in Mo's algorithm.
</details>

### 13. What do these techniques have in common, and how do you recognise them?

<details><summary>Model answer</summary>

Each turns a constraint into a trick: "O(1) extra space" → voting, Floyd, cyclic sort, Dutch flag; "stream of unknown length" → reservoir sampling; "uniform random permutation" → Fisher-Yates; "k-th smallest" → quickselect; "n ≤ 40" → meet in the middle; "many ancestor queries" → binary lifting. Reading constraints carefully is the main recognition skill.
</details>
