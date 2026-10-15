# Hashing — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. How does a hash table give O(1) average lookups?

<details><summary>Model answer</summary>

A hash function turns the key into an integer, and `hash mod capacity` picks a bucket. With a good hash and a bounded load factor, each bucket holds O(1) entries on average, so `get`/`set` compute one hash and scan a tiny bucket. The table resizes (usually doubles) when it gets too full, which keeps buckets short; resizing costs O(n) but is amortized O(1) per insert.

</details>

### 2. What is a collision and what are the two main ways to handle it?

<details><summary>Model answer</summary>

Two different keys landing in the same bucket. **Separate chaining**: each bucket holds a list of entries; you scan that list. **Open addressing**: on a collision you probe other slots (linear probing, quadratic probing, double hashing) until you find a free one; deletions need tombstones. Chaining is simpler; open addressing is more cache friendly.

</details>

### 3. Why is the worst case O(n), and can it happen in practice?

<details><summary>Model answer</summary>

If many keys hash to the same bucket, a lookup scans all of them. It happens with a bad hash function or with adversarial input crafted to collide (hash-flooding attacks). Real engines use randomised or strong hashes to make this unlikely, but interviewers expect you to say "O(1) average, O(n) worst case".

</details>

### 4. What is the load factor and why do tables resize?

<details><summary>Model answer</summary>

Load factor = number of entries / number of buckets. As it grows, buckets get longer and lookups slow down. When it passes a threshold (often 0.75), the table allocates more buckets and re-inserts every entry with the new capacity. Doubling keeps the amortized insert cost O(1).

</details>

### 5. Map vs plain object vs Set in JavaScript: when do you use each?

<details><summary>Model answer</summary>

`Map`: any key type (numbers stay numbers, objects by reference), keeps insertion order, has `size`, no prototype key collisions. Object: fine for fixed string keys and JSON-like data, but keys become strings and names like `constructor` or `__proto__` can collide with inherited properties. `Set`: membership only. In DSA code default to `Map` and `Set`.

</details>

### 6. Explain the complement-lookup pattern with Two Sum. Why check before inserting?

<details><summary>Model answer</summary>

For each `x`, the partner we need is `target − x`. If it is already in the map (value → index), we have a pair. Otherwise record `x`. Checking before inserting guarantees we never pair an element with itself, and duplicates like `[3, 3]` with target 6 still work because the first 3 is in the map when the second arrives.

</details>

### 7. How does "prefix sum + hash map" count subarrays with sum k?

<details><summary>Model answer</summary>

Let `p` be the running prefix sum. A subarray ending here has sum k exactly when an earlier prefix equals `p − k`. Keep a map of prefix sum → how many times seen, seeded with `{0: 1}` for the empty prefix. Add `count[p − k]` to the answer, then record `p`. O(n) time and space; works with negative numbers, unlike a sliding window.

</details>

### 8. Why can you not use an array directly as a Map key, and what do you do instead?

<details><summary>Model answer</summary>

`Map` compares object keys by reference: two arrays with the same contents are different keys. Convert to a canonical primitive key, e.g. `arr.join(',')`, `JSON.stringify(arr)`, or `r * cols + c` for grid coordinates.

</details>

### 9. Longest Consecutive Sequence in O(n): how?

<details><summary>Model answer</summary>

Put all numbers in a `Set`. For each `x`, only start counting if `x − 1` is not in the set (x is the start of a run), then walk `x + 1, x + 2, ...` while present. Each number is visited at most twice (once in the outer loop, once inside one run), so the total is O(n).

</details>

### 10. When would you NOT use a hash map?

<details><summary>Model answer</summary>

When you need order (min, max, next larger, range queries): use sorting, a heap or a BST. When keys are small integers in a known range: a plain array is simpler and faster. When memory is tight and sorting is allowed: two pointers. When worst-case guarantees matter.

</details>

### 11. How does bucket sort by frequency solve Top K Frequent Elements in O(n)?

<details><summary>Model answer</summary>

Count frequencies with a map. Frequencies are between 1 and n, so create n + 1 buckets where bucket f holds values that appear f times. Walk buckets from high to low collecting values until you have k. No comparison sort is needed, so it is O(n).

</details>

### 12. What makes a good hash function?

<details><summary>Model answer</summary>

Deterministic (same key → same hash), fast to compute, spreads keys uniformly across buckets, and uses all of the key (every character of a string). A common string hash is polynomial rolling: `h = h * 31 + charCode`, kept in range with `| 0` or a modulus.

</details>
