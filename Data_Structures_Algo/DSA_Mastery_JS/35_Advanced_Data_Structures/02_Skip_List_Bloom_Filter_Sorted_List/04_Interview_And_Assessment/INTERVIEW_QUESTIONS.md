# Skip List, Bloom Filter & Sorted List — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. JavaScript has no TreeMap/TreeSet. What do you use in an interview?

<details><summary>Model answer</summary>

A SortedList: a sorted array with `bisectLeft` / `bisectRight`. Lookups (has, floor, ceiling, count in range) are O(log n); inserts and deletes use `splice`, O(n) worst case but very fast in practice. Say the complexity honestly and mention that a balanced BST or skip list gives O(log n) updates.
</details>

### 2. What is the difference between `bisectLeft` and `bisectRight`?

<details><summary>Model answer</summary>

`bisectLeft(x)` is the first index whose value is `>= x`; `bisectRight(x)` is the first index whose value is `> x`. For duplicates of x, they bracket the run of x values. Count of values in `[lo, hi]` = `bisectRight(hi) - bisectLeft(lo)`.
</details>

### 3. Explain a skip list in two sentences.

<details><summary>Model answer</summary>

A sorted linked list plus extra "express lane" lists on top, where each node is promoted to the next level with probability 1/2. Searching starts at the top level, moves right while the next value is smaller, and drops down, so the expected cost is O(log n).
</details>

### 4. Why are skip-list operations O(log n) expected, not worst case?

<details><summary>Model answer</summary>

Levels come from coin flips. With high probability there are about log n levels and about 2 steps per level, but an unlucky sequence of flips could create a degenerate list. The expectation is over the random choices, not over the input, so no adversarial input is bad.
</details>

### 5. How do you insert into a skip list?

<details><summary>Model answer</summary>

Search for the value, recording on each level the last node whose value is smaller (`update[level]`). Pick a random level L for the new node. For each level 0..L, splice the node in after `update[level]`. If L exceeds the current top level, the head is the predecessor on the new levels.
</details>

### 6. What does a Bloom filter guarantee?

<details><summary>Model answer</summary>

No false negatives: if `mightContain(x)` is false, x was never added. It can give false positives: "maybe present" may be wrong. Memory is a fixed bit array of m bits regardless of item size.
</details>

### 7. How do you choose m (bits) and k (hash functions)?

<details><summary>Model answer</summary>

For n expected items and target false-positive rate p: `m = -n ln p / (ln 2)^2` and `k = (m / n) ln 2`. Example: 1% FP needs about 9.6 bits per item and k ≈ 7.
</details>

### 8. Why can't you delete from a standard Bloom filter?

<details><summary>Model answer</summary>

Bits are shared between items. Clearing x's bits could clear bits another item needs, creating false negatives. A counting Bloom filter stores small counters instead of bits to allow deletion.
</details>

### 9. Where are Bloom filters used in practice?

<details><summary>Model answer</summary>

In front of expensive lookups: databases (LSM trees skip disk reads for keys not in an SSTable), caches and CDNs ("have we seen this URL?"), browsers (malicious URL lists), and distributed joins. A false positive only costs an extra real lookup.
</details>

### 10. How do you solve Contains Duplicate III with a sorted structure?

<details><summary>Model answer</summary>

Keep the last k values in a SortedList. For each new value x, ask `ceiling(x - t)`; if it exists and is `<= x + t`, return true. Then add x and remove the value that leaves the window. O(n log k) with a balanced structure. A bucket approach with width t + 1 gives O(n).
</details>

### 11. When would you pick a heap instead of a sorted list?

<details><summary>Model answer</summary>

When you only need the min (or max) and never floor/ceiling or ranks. A heap gives O(log n) insert and extract with no O(n) splices.
</details>

### 12. How do you implement "My Calendar I" with a sorted structure?

<details><summary>Model answer</summary>

Keep bookings sorted by start. For a new `[s, e)`, find the first booking with start `>= s` (next) and the one before it (prev). The booking fits if `prev.end <= s` and `e <= next.start`. Insert it if so. O(log n) search per booking.
</details>
