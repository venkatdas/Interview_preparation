# Skip List, Bloom Filter & Sorted List — Quiz

Back to the [topic README](../README.md).

**1. (Predict) SortedList [1, 3, 3, 5, 9]: `bisectLeft(3)`, `bisectRight(3)`, `floor(4)`, `ceiling(6)`?**

<details><summary>Answer</summary>

1, 3, 3, 9.
</details>

**2. (Compute) Count of values in [2, 5] for [1, 3, 3, 5, 9]?**

<details><summary>Answer</summary>

`bisectRight(5) - bisectLeft(2) = 4 - 1 = 3` (3, 3, 5).
</details>

**3. (Multiple choice) A Bloom filter answers "maybe present" for an item never added. This is a:**
a) false negative  b) false positive  c) collision bug  d) impossible

<details><summary>Answer</summary>

b) False positive — allowed by design.
</details>

**4. (Multiple choice) A Bloom filter says "definitely not present". Can it be wrong?**
a) yes, sometimes  b) no, never (unless you deleted bits)  c) only when full  d) only with k = 1

<details><summary>Answer</summary>

b)
</details>

**5. (Complexity) Expected search cost in a skip list with p = 1/2? Expected space?**

<details><summary>Answer</summary>

O(log n) expected time; O(n) expected space (about 2n pointers).
</details>

**6. (Spot the bug) floor implemented as:**

```js
floor(x) { return this.items[this.bisectLeft(x) - 1]; }
```

<details><summary>Answer</summary>

If x is present, floor(x) should be x itself, but `bisectLeft(x) - 1` points before it. Use `bisectRight(x) - 1`.
</details>

**7. (Spot the bug) Skip list delete:**

```js
for (let i = 0; i <= this.level; i++) update[i].next[i] = node.next[i];
```

<details><summary>Answer</summary>

On levels where the node does not exist, `update[i].next[i]` is some other node; overwriting it corrupts the list. Stop (or skip) when `update[i].next[i] !== node`.
</details>

**8. (Complexity) SortedList `add` and `has`?**

<details><summary>Answer</summary>

`add`: O(log n) to find the index + O(n) worst case for `splice`. `has`: O(log n).
</details>

**9. (Compute) Bits per item for a 1% false-positive Bloom filter?**

<details><summary>Answer</summary>

`-ln(0.01) / (ln 2)^2 ≈ 4.605 / 0.4805 ≈ 9.6` bits per item.
</details>

**10. (Define the state) In a skip list search, what does `update[i]` store?**

<details><summary>Answer</summary>

The last node on level i whose value is strictly smaller than the target — the predecessor where a new node would be linked on that level.
</details>

**11. (Multiple choice) Need only "give me the current minimum" with inserts and deletes of the minimum. Best choice?**
a) SortedList  b) skip list  c) heap  d) Bloom filter

<details><summary>Answer</summary>

c) heap.
</details>

## Mastery checklist

- [ ] I can code a SortedList with bisectLeft/bisectRight, floor, ceiling and countBetween without off-by-one errors.
- [ ] I can explain a skip list's search and insert and why they are O(log n) expected.
- [ ] I can state a Bloom filter's guarantees and size it for a target false-positive rate.
- [ ] I can solve Contains Duplicate III and My Calendar I with a sorted structure.
- [ ] I can say when a heap, a Set, or a Fenwick tree beats these structures.
