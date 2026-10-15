# Online Algorithms — Self-Assessment Quiz

Answer without looking at the notes, then check. Aim for 12/14 or better.

---

### Q1. Multiple choice
Which structure gives O(log n) insert and O(1) median of a stream?

A) one sorted array  B) two heaps  C) a hash map  D) a monotonic stack

<details><summary>Answer</summary>

**B.** A max-heap for the lower half and a min-heap for the upper half. A sorted array needs
O(n) inserts because of shifting.

</details>

### Q2. Complexity
What is the memory of a fixed-window moving average with window k over a stream of n numbers?

<details><summary>Answer</summary>

**O(k)** — only the circular buffer and a running sum, independent of n.

</details>

### Q3. Predict the output

```js
const { MovingAverage } = require('../02_Implementations/streaming');
const m = new MovingAverage(2);
console.log([m.next(4), m.next(8), m.next(0)]);
```

<details><summary>Answer</summary>

`[4, 6, 4]` — (4)/1, (4+8)/2, (8+0)/2.

</details>

### Q4. Spot the bug

```js
add(x) {             // two-heap median
  if (this.low.size() <= this.high.size()) this.low.push(x);
  else this.high.push(x);
}
```

<details><summary>Answer</summary>

It balances sizes but ignores ORDER. Adding 10 then 1 puts 10 in low and 1 in high — the halves overlap and the
median is wrong. Push into low, then move low's max to high, then rebalance.

</details>

### Q5. Probability
In reservoir sampling with k = 1, with what probability does the 4th item replace the current sample?

<details><summary>Answer</summary>

**1/4.** In general item i is taken with probability k/i.

</details>

### Q6. Multiple choice
Count-Min sketch estimates are:

A) always exact  B) never above the truth  C) never below the truth  D) unbiased

<details><summary>Answer</summary>

**C.** Collisions only add to counters, and taking the minimum across rows reduces but never
removes that positive error.

</details>

### Q7. Misra-Gries
With k = 4 (3 counters) on a stream of 100 items, what is the maximum possible under-count of any item?

<details><summary>Answer</summary>

**n/k = 25.** Each decrement-all removes 4 occurrences, so it can happen at most 25 times.

</details>

### Q8. Ski rental
B = 5. What does the break-even strategy pay if you ski exactly 5 days, and what is the ratio?

<details><summary>Answer</summary>

Rent days 1–4 (4) and buy on day 5 (5): **9**. Optimum is min(5, 5) = 5. Ratio **9/5 = 1.8 = 2 − 1/5**.

</details>

### Q9. Predict the output

```js
const { TokenBucket } = require('../02_Implementations/streaming');
const tb = new TokenBucket(1, 0.01, 0);   // 1 token per 100 ms
console.log([tb.allow(0), tb.allow(50), tb.allow(100)]);
```

<details><summary>Answer</summary>

`[true, false, true]` — the token is spent at 0, half a token at 50, a full token again at 100.

</details>

### Q10. Spot the bug

```js
shouldPrintMessage(t, msg) {
  const ok = !this.map.has(msg) || t >= this.map.get(msg);
  this.map.set(msg, t + 10);
  return ok;
}
```

<details><summary>Answer</summary>

The map is updated even when the message is rejected, so a message repeated every second is
blocked forever. Only set the next-allowed time when you print.

</details>

### Q11. HyperLogLog
Doubling the number of registers m changes the standard error by what factor?

<details><summary>Answer</summary>

Error ≈ 1.04/√m, so it shrinks by a factor of **1/√2 ≈ 0.71**.

</details>

### Q12. Complexity
Online Stock Span: a single `next` call can pop many items. What is the total time for n calls?

<details><summary>Answer</summary>

**O(n)** — each price is pushed once and popped at most once (amortised O(1) per call).

</details>

### Q13. Recognition
Which of these is NOT naturally an online/streaming problem?

A) LRU cache  B) median after every insertion  C) median of a given array  D) logger rate limiter

<details><summary>Answer</summary>

**C.** The whole array is given once — use quickselect or sorting.

</details>

### Q14. Welford
After adding 2, 4, 6 with Welford, what are mean and m2?

<details><summary>Answer</summary>

x=2: mean 2, m2 0. x=4: delta 2, mean 3, m2 += 2·1 = 2. x=6: delta 3, mean 4, m2 += 3·2 = 8.
**mean = 4, m2 = 8**, population variance 8/3.

</details>

---

## Mastery checklist

- [ ] I can explain online vs offline and give two real-world examples of each.
- [ ] I can write the two-heap median and Welford's update from memory in under 10 minutes.
- [ ] I can implement reservoir sampling and prove the k/n probability.
- [ ] I can explain Misra-Gries, Count-Min and HyperLogLog, their errors and when to use each.
- [ ] I can derive the ski-rental ratio 2 − 1/B and connect competitive analysis to LRU caching.
