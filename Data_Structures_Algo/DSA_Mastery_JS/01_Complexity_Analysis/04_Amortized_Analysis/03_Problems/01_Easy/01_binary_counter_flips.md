# Binary Counter Bit Flips

| | |
|---|---|
| **Topic** | Amortized Analysis |
| **Difficulty** | Easy |
| **Pattern** | aggregate + potential |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [01_binary_counter_flips.js](../solutions/01_binary_counter_flips.js) — open only after a real attempt |

## Problem

A binary counter starts at 0. Each increment flips the trailing 1s to 0 and the next
0 to 1. Return the TOTAL number of bit flips performed by n increments (0 -> n).
A single increment can flip many bits (0111 -> 1000 flips 4), yet the total is small.
Find a closed form and explain the amortized cost per increment.

## Examples

```
n = 1 -> 1      (0 -> 1)
n = 2 -> 3      (+1, then 01 -> 10 flips 2)
n = 4 -> 7      (1 + 2 + 1 + 3)
n = 8 -> 15
n = 0 -> 0
```

## Constraints & clarifying questions

```
- n up to 1e15 -> simulation is impossible; need a formula.
- The counter has enough bits (no overflow).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Aggregate method*: count how often each bit flips. Sections 5.1 and 5.3 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate)   O(n) amortized total work. Keep the value; for each increment from k to k+1, the cost is (number of trailing ones of k) + 1. Sum it up.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Bit i flips every 2^i increments, so n increments flip Σ ⌊n/2^i⌋ = 2n − popcount(n) bits. Potential view: Φ = number of ones, and every increment has amortized cost exactly 2.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0
- n = 2^k - 1 (all ones) -> 2n - k: the smallest Φ drop
- n up to 1e15: use Math.floor division, not 32-bit shifts
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate)   O(n) amortized total work

```
Keep the value; for each increment from k to k+1, the cost is (number of trailing
ones of k) + 1. Sum it up.
```

### APPROACH 2 — Optimal (aggregate counting / potential)   O(log n)

```
Aggregate view: bit i flips every 2^i increments, so it flips floor(n / 2^i) times.
  total = Σ_i floor(n / 2^i) = 2n - popcount(n)
(Proof of the identity: Σ floor(n/2^i) = n - popcount(n) for i >= 1, plus n for i = 0.)
Potential view: Φ = number of 1 bits. An increment costing t + 1 changes Φ by 1 - t,
so amortized cost = (t + 1) + (1 - t) = 2. Total real = 2n - Φ(final) = 2n - popcount(n). Same formula!

Dry run n = 4:
  0->1 cost 1, 1->10 cost 2, 10->11 cost 1, 11->100 cost 3 -> total 7
  formula: 2·4 - popcount(100₂) = 8 - 1 = 7
```

### Edge cases

```
- n = 0 -> 0
- n = 2^k - 1 (all ones) -> 2n - k: the smallest Φ drop
- n up to 1e15: use Math.floor division, not 32-bit shifts
```

### Common mistakes

```
- Bounding each increment by log n and concluding O(n log n) total (true, but loose).
- Using n >> i for n beyond 2^31 (32-bit funnel).
```

Full JavaScript solution with tests: [01_binary_counter_flips.js](../solutions/01_binary_counter_flips.js). Run it with `node 01_binary_counter_flips.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #338 Counting Bits.
- A counter that also supports decrement: show amortized O(1) fails (alternate around 2^k).
- Ternary counter: total digit changes for n increments.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
