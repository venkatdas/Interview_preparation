# Growth Policy Copy Count

| | |
|---|---|
| **Topic** | Amortized Analysis |
| **Difficulty** | Medium |
| **Pattern** | geometric vs arithmetic growth |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [03_growth_policy_copies.js](../solutions/03_growth_policy_copies.js) — open only after a real attempt |

## Problem

A dynamic array starts with capacity 1 and size 0. When a push finds it full, it
allocates a new capacity and copies every existing element. Given n pushes and a
growth policy, return the total number of element COPIES. Policies:
  { type: 'mul', factor: f }  -> newCap = max(cap + 1, floor(cap * f))
  { type: 'add', k }          -> newCap = cap + k
Compute it without simulating each push (n up to 1e12), and state the amortized
cost per push for each policy.

## Examples

```
n = 9,  mul 2     -> copies 1 + 2 + 4 + 8 = 15     (resizes at sizes 1, 2, 4, 8)
n = 8,  mul 2     -> 7
n = 10, add 3     -> capacities 1, 4, 7, 10: copies 1 + 4 + 7 = 12
n = 1             -> 0
n = 0             -> 0
```

## Constraints & clarifying questions

```
- n up to 1e12; copies can exceed 2^53 for additive growth -> use BigInt for 'add'.
- factor > 1.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Aggregate method on resizes*. Section 5.4 (table) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate every push)   O(n + copies). Track size and capacity; on a full push add `size` to copies and grow.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A resize happens when size reaches the current capacity and another push arrives, copying `capacity` elements. Walk the capacity sequence instead of the pushes. Multiplicative growth gives a geometric series (< n·f/(f−1)); additive growth +k gives about n²/(2k) copies.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 or 1 -> 0 copies (the first element fits in capacity 1)
- factor close to 1 (1.1): floor(cap·f) may equal cap for small cap -> max(cap + 1, ...)
- huge n with additive growth -> BigInt
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate every push)   O(n + copies)

```
Track size and capacity; on a full push add `size` to copies and grow.
```

### APPROACH 2 — Optimal (jump from resize to resize)   O(number of resizes)

```
A resize happens exactly when size reaches the current capacity and another push arrives.
So walk the capacity sequence c0 = 1, c1, c2, ... and add c_i for every c_i < n.
  mul f:  O(log_f n) resizes; copies = 1 + f + f² + ... < n · f/(f-1)  -> amortized O(1)
          (f = 2: < 2n; f = 1.5: < 3n — less memory waste, more copying)
  add k:  resizes at 1, 1+k, 1+2k, ...: about n/k of them; copies ≈ n²/(2k) -> amortized O(n/k)
          Closed form with m = number of capacities below n: copies = m + k·m(m-1)/2.

Dry run n = 10, add 3: capacities 1, 4, 7, 10. Below 10: 1, 4, 7 -> m = 3 ->
  3 + 3·3·2/2 = 12 ✓
```

### Edge cases

```
- n = 0 or 1 -> 0 copies (the first element fits in capacity 1)
- factor close to 1 (1.1): floor(cap·f) may equal cap for small cap -> max(cap + 1, ...)
- huge n with additive growth -> BigInt
```

### Common mistakes

```
- Counting a resize when size equals capacity but no further push arrives (resize happens on the NEXT push).
- Believing any growth is fine: additive growth turns n pushes into Θ(n²) work.
```

Full JavaScript solution with tests: [03_growth_policy_copies.js](../solutions/03_growth_policy_copies.js). Run it with `node 03_growth_policy_copies.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #1172 Dinner Plate Stacks.
- Pick the growth factor that minimises memory waste for a given copy budget.
- Why V8 and Java ArrayList use factors 1.5–2.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
