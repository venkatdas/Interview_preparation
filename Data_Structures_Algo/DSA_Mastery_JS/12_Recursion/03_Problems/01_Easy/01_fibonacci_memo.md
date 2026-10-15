# Fibonacci Number with Memoization

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Easy |
| **Pattern** | multiple recursion + memo |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #509 — https://leetcode.com/problems/fibonacci-number/ (statement paraphrased in our own words) |
| **Solution file** | [01_fibonacci_memo.js](../solutions/01_fibonacci_memo.js) — open only after a real attempt |

## Problem

F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1. Given n, return F(n).
Use it to see why plain multiple recursion explodes and how a cache fixes it.

## Examples

```
n = 2  -> 1      (1 + 0)
n = 4  -> 3      (0 1 1 2 3)
n = 10 -> 55
```

## Constraints & clarifying questions

```
- Range of n? (LeetCode: 0..30; we also support up to ~1000 with Number precision loss
  after n = 78, so ask if BigInt is needed for big n)
- Negative n? (assume no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Two recursive calls per step = *multiple recursion*. Draw the call tree for fib(5) and circle the repeated calls.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Write the one-line recursion straight from the definition. It is correct, just slow (about 1.6^n calls).

</details>

<details><summary>Hint 3</summary>

**The key idea.** The same small `n` is asked for many times. Store each answer in a `Map` the first time you compute it, and check the Map before recursing.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n = 0 and n = 1 are the two base cases. Create a fresh Map per top-level call (a default parameter does exactly that).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain multiple recursion)   O(2^n) time, O(n) space

```
fib(n) = fib(n-1) + fib(n-2). Every call spawns two more, so the call tree has
about 1.6^n nodes. fib(3) is recomputed again and again inside fib(5), fib(6) ...
```

### APPROACH 2 — Optimal (top-down memoization)   O(n) time, O(n) space

```
Same recursion, but store each answer in a Map the first time we compute it.
Each distinct n is solved once; every later request is an O(1) lookup.
This is exactly "top-down DP". (Bottom-up with two variables gets O(1) space.)

Dry run fib(5) with memo:
  fib(5) -> fib(4) -> fib(3) -> fib(2) -> fib(1)=1, fib(0)=0 -> memo[2]=1
                             fib(3) = memo[2] + fib(1) = 2  -> memo[3]=2
                   fib(4) = memo[3] + memo[2] = 3          -> memo[4]=3
  fib(5) = memo[4] + memo[3] = 5
  Only 9 calls instead of 15.
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| plain recursion | O(2^n) (really ~1.6^n) | O(n) stack |
| memoized | O(n) | O(n) memo + stack |
| bottom-up | O(n) | O(1) |

### Edge cases

```
- n = 0 -> 0, n = 1 -> 1 (the two base cases)
- share the memo across calls via a default parameter carefully: a NEW Map per
  top-level call is safest (default params are re-evaluated per call in JS).
```

### Common mistakes

- Sharing one global memo between unrelated problems or tests (stale values).
- Checking the memo AFTER making the recursive calls, which saves nothing.
- Forgetting that Number loses precision after F(78); use BigInt if larger n is required.

Full JavaScript solution with tests: [01_fibonacci_memo.js](../solutions/01_fibonacci_memo.js). Run it with `node 01_fibonacci_memo.js` from the solutions folder.

</details>

## Related follow-ups

- Climbing Stairs (LeetCode #70)
- N-th Tribonacci Number (LeetCode #1137)
- Min Cost Climbing Stairs (LeetCode #746)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
