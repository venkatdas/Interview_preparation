# Amortized Analysis — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md).

**1. What does "amortized O(1)" mean?**
<details><summary>Model answer</summary>

Any sequence of n operations costs O(n) in total, so the average cost per operation over the sequence is O(1). A single operation may still cost O(n). It is a worst-case guarantee over sequences, with no probability involved.
</details>

**2. How is amortized different from average case and from expected time?**
<details><summary>Model answer</summary>

Average case averages over a distribution of inputs. Expected time averages over the algorithm's own random choices (hashing, random pivots). Amortized averages over a sequence of operations and holds for every sequence, deterministically.
</details>

**3. Why is array push amortized O(1)?**
<details><summary>Model answer</summary>

Capacity doubles when full. Copies happen at sizes 1, 2, 4, ..., which sum to less than 2n for n pushes. Plus n ordinary writes: total < 3n, so O(1) per push.
</details>

**4. What if the array grows by a constant (say +100) instead of doubling?**
<details><summary>Model answer</summary>

Resizes happen every 100 pushes and copy 100, 200, 300, ... elements: total ≈ n²/200 = Θ(n²), so amortized Θ(n) per push. Only multiplicative growth gives O(1).
</details>

**5. Why do arrays shrink at 1/4 full rather than 1/2?**
<details><summary>Model answer</summary>

With 1/2, right after a resize the array is exactly at both thresholds: alternating push/pop resizes every time, Θ(n) per op (thrashing). With 1/4, after any resize the array is half full and needs Θ(capacity) operations before the next resize, which pays for it.
</details>

**6. Explain the three amortized analysis methods.**
<details><summary>Model answer</summary>

Aggregate: bound the total cost of n operations directly and divide. Accounting: charge each operation a fixed amount, store the surplus as credit on elements, and show credit never goes negative. Potential: define Φ(state) ≥ 0 starting at 0; amortized cost = real + ΔΦ; the sum telescopes so total real ≤ total amortized.
</details>

**7. Prove a queue made of two stacks has O(1) amortized operations.**
<details><summary>Model answer</summary>

Elements move from the in-stack to the out-stack only when out is empty, and never move back. So each element is pushed to in once, moved once, popped from out once: at most 4 stack operations per element in total. Accounting: charge 3 per enqueue, 1 per dequeue.
</details>

**8. A monotonic stack solution has a while loop inside a for loop. Why is it O(n) and not O(n²)?**
<details><summary>Model answer</summary>

Each index is pushed exactly once and popped at most once over the entire run, so the total number of while-loop iterations across all steps is at most n. Total O(n), even though a single step can pop many.
</details>

**9. What is the amortized cost of a binary counter increment? Show the potential function.**
<details><summary>Model answer</summary>

Φ = number of 1 bits. An increment that clears t trailing ones and sets one bit costs t + 1 and changes Φ by 1 − t: amortized 2. Total flips for n increments = 2n − popcount(n) < 2n.
</details>

**10. Why is a hash table insert O(1) "amortized expected"?**
<details><summary>Model answer</summary>

Expected: with a good hash function each bucket has O(1) expected entries. Amortized: when the load factor passes a threshold the table doubles and rehashes everything, but rehash sizes form a geometric series, O(n) total for n inserts.
</details>

**11. What is the complexity of union-find with union by rank and path compression?**
<details><summary>Model answer</summary>

O(α(n)) amortized per operation, where α is the inverse Ackermann function (≤ 4 for any practical n). With rank only, O(log n) worst case per find.
</details>

**12. When is amortized O(1) not good enough?**
<details><summary>Model answer</summary>

When individual operations have latency limits (real-time systems, a UI frame, a request deadline) since one operation can still take O(n). Also with persistent structures, where an expensive state can be reused many times. Then you use de-amortized structures (incremental resizing) or worst-case structures.
</details>
