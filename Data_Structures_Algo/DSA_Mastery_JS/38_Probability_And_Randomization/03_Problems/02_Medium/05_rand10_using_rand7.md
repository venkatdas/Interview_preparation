# Implement Rand10() Using Rand7()

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | rejection sampling |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #470 — https://leetcode.com/problems/implement-rand10-using-rand7/ (statement paraphrased, not copied) |
| **Solution file** | [05_rand10_using_rand7.js](../solutions/05_rand10_using_rand7.js) — open only after a real attempt |

## Problem

You are given `rand7()`, which returns a uniform random integer in 1..7. Using only `rand7()` (no other random source), implement `rand10()` that returns a uniform random integer in 1..10.

Follow-ups: what is the expected number of `rand7()` calls per `rand10()`? Can you reduce it?

## Examples

```
rand10() -> 7
rand10() -> 2
Over 100,000 calls, each of 1..10 appears about 10,000 times.
```

## Constraints & clarifying questions

```
- Is rand7 uniform and independent between calls? (assume yes)
- Expected cost is fine, or do we need a worst-case bound? (expected; any exact method can need unbounded retries)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Building one uniform distribution from another: *rejection sampling*. See section 5.7 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Can you make a fair rand5 from rand7 (reject 6 and 7)? A fair coin (reject 7, use parity)? Combine them into 10 values.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Two rolls as a two-digit base-7 number: (r1 - 1) * 7 + r2 is uniform over 1..49. Keep 1..40 (four copies of 1..10), reject 41..49 and retry. Expected calls: 2 * 49/40 = 2.45.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** r1 * r2 and r1 + r2 are NOT uniform. Map with 1 + (c - 1) % 10, not c % 10 (that gives 0..9).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (rand5 and a coin)   expected about 2.57 rand7 calls

```
a = rand7 until a <= 5              (uniform 1..5, 7/5 calls)
b = rand7 until b <= 6, coin = b % 2 (fair coin, 7/6 calls)
return a + 5 * coin
```

### APPROACH 2 — Optimal (7x7 grid rejection)   expected 2.45 rand7 calls, O(1) space

```
loop:
    c = (rand7() - 1) * 7 + rand7()     // uniform 1..49
    if c <= 40: return 1 + (c - 1) % 10
Rounds are geometric with p = 40/49, so 49/40 rounds of 2 calls each.
Advanced: reuse the rejected value 41..49 as a uniform 1..9 -> about 2.19 calls.
```

### Dry run

```
rolls 6, 7 -> c = 5*7 + 7 = 42 > 40 -> reject
rolls 3, 2 -> c = 2*7 + 2 = 16 -> return 1 + 15 % 10 = 6
```

### Complexity

- Brute force: expected about 2.57 rand7 calls
- Optimal: expected 2.45 rand7 calls, O(1) space

### Edge cases

```
- many rejections in a row: possible but the chance of 10 in a row is (9/49)^10, about 4e-8
- output range must be 1..10, not 0..9
```

### Common mistakes

- rand7() * rand7(): 12 appears 4 ways, 49 once, 11 never.
- rand7() + rand7(): sums cluster in the middle.
- Keeping all 49 values with % 10: values 1..9 get 5 cells, 10 gets 4.

Full JavaScript solution with tests: [05_rand10_using_rand7.js](../solutions/05_rand10_using_rand7.js). Run it with `node 05_rand10_using_rand7.js` from the solutions folder.

</details>

## Related follow-ups

- Generate Random Point in a Circle (LeetCode 478)
- rand7 from rand5
- Fair coin from a biased coin (von Neumann trick)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
