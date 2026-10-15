# Modular Power

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | halving recursion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [04_modular_power.js](../solutions/04_modular_power.js) — open only after a real attempt |

## Problem

Compute (base ^ exp) mod m for non-negative integers, where exp can be as large
as 10^18. Inputs and output are BigInt. Write it recursively and report how many
recursive calls were made, so you can SEE the difference between linear and
halving recursion.

## Examples

```
Input: base = 2n,  exp = 10n,  m = 1000n          Output: 24n    (1024 mod 1000)
Input: base = 3n,  exp = 0n,   m = 7n             Output: 1n
Input: base = 10n, exp = 18n,  m = 1000000007n    Output: 49n    (10^18 mod 1e9+7)
Input: base = 5n,  exp = 3n,   m = 1n             Output: 0n     (anything mod 1 is 0)
```

## Constraints & clarifying questions

```
- Why BigInt? (products of two numbers near 1e9 exceed 2^53; Number would lose precision)
- m >= 1? (yes)  exp >= 0? (yes)
- Max exp 1e18 -> O(exp) calls is impossible (and would overflow the stack at ~1e4)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Halving recursion* (O(log n) depth). Section 5.2 (kinds of recursion) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (linear recursion)   O(exp) time, O(exp) stack. pow(b, e) = e === 0 ? 1 % m : (b * pow(b, e - 1)) % m. Fine for exp up to a few thousand; stack overflow beyond ~1e4.

</details>

<details><summary>Hint 3</summary>

**The key idea.** `b^e = (b^(e/2))^2` for even e and `(b^(e/2))^2 · b` for odd e. Call yourself ONCE on `e / 2`, store it, square it. Use BigInt and reduce mod m after every multiplication.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- exp = 0 -> 1 % m (which is 0 when m = 1!)
- base = 0 -> 0 for exp > 0
- base >= m -> reduce base first
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (linear recursion)   O(exp) time, O(exp) stack

```
pow(b, e) = e === 0 ? 1 % m : (b * pow(b, e - 1)) % m.
Fine for exp up to a few thousand; stack overflow beyond ~1e4.
```

### APPROACH 2 — Optimal (halving recursion, fast exponentiation)   O(log exp) time, O(log exp) stack

```
pow(b, e):
  e === 0 -> 1 % m
  half = pow(b, e / 2)            (ONE recursive call, reused twice)
  even e -> half * half % m
  odd e  -> half * half % m * b % m
Depth = number of bits of exp, about 60 for 1e18.

Dry run pow(2, 10) mod 1000:
  pow(2,10) -> half = pow(2,5)
  pow(2,5)  -> half = pow(2,2) -> half = pow(2,1) -> half = pow(2,0) = 1
  pow(2,1) = 1*1*2 = 2;  pow(2,2) = 2*2 = 4;  pow(2,5) = 4*4*2 = 32;  pow(2,10) = 32*32 = 1024 mod 1000 = 24
  calls: 5 (vs 11 for the linear version)
```

### Edge cases

```
- exp = 0 -> 1 % m (which is 0 when m = 1!)
- base = 0 -> 0 for exp > 0
- base >= m -> reduce base first
```

### Common mistakes

```
- Calling pow(b, e/2) TWICE (half * half written as pow()*pow()) -> back to O(exp) calls.
- Mixing Number and BigInt (TypeError) or using Number and losing precision.
- Returning 1 for exp = 0 when m = 1.
```

Full JavaScript solution with tests: [04_modular_power.js](../solutions/04_modular_power.js). Run it with `node 04_modular_power.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #50 Pow(x, n) (negative exponents, floats).
- LeetCode #372 Super Pow.
- LeetCode #1922 Count Good Numbers.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
