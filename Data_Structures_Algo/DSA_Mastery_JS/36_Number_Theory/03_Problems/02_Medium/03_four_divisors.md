# Four Divisors

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | divisor counting from factorization |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1390 — https://leetcode.com/problems/four-divisors/ (statement paraphrased in our own words) |
| **Solution file** | [03_four_divisors.js](../solutions/03_four_divisors.js) — open only after a real attempt |

## Problem

You get an array of positive integers. For every number that has exactly four positive divisors, add up those four divisors. Return the grand total (0 if no number qualifies).

## Examples

```
Input: [21, 4, 7]    Output: 32   (21 has 1, 3, 7, 21; 4 has three divisors; 7 has two)
Input: [21, 21]      Output: 64
Input: [1, 2, 3, 4, 5] Output: 0
```

## Constraints & clarifying questions

```
- 1 <= nums.length <= 10^4, 1 <= nums[i] <= 10^5
- Duplicates count every time they appear.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Divisor counting. If x = p1^e1 * p2^e2 * ..., then x has (e1+1)(e2+1)... divisors.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Enumerate divisors in pairs (d, x/d) for d up to sqrt(x). Stop as soon as you have more than four.

</details>

<details><summary>Hint 3</summary>

**The key idea.** (e1+1)(e2+1)... = 4 only when x = p^3 or x = p*q with distinct primes. With a smallest-prime-factor table, p = spf[x] and you can test the rest in O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** p^2 (three divisors) and p^4 (five) must give 0. The sum for p*q is (1+p)(1+q); for p^3 it is 1+p+p^2+p^3.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n sqrt V) time, O(1) space

```
for each x: walk d = 1..sqrt(x); for each divisor d add d and x/d (once if equal).
If exactly 4 divisors were found, add their sum.
```

### APPROACH 2 — Optimal (smallest-prime-factor sieve)   O(V + n) time, O(V) space (V = max value)

```
build spf[0..V]
for x in nums:
  p = spf[x], rest = x / p
  if rest == p*p           -> x = p^3: add 1 + p + p^2 + p^3
  elif rest != p and spf[rest] == rest -> x = p*q: add (1+p)(1+q)
  else add 0
```

### Dry run

```
x=21: p=3, rest=7 (prime, != 3)  -> (1+3)(1+7) = 32
x=8 : p=2, rest=4 = p*p          -> 1+2+4+8   = 15
x=12: p=2, rest=6 (not prime)      -> 0
total 47
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Pairwise divisor enumeration | O(n sqrt V) | O(1) |
| spf sieve + structure | O(V + n) | O(V) |

### Edge cases

```
- 1 and primes -> 0
- 6 = 2*3 is the smallest qualifying number (sum 12)
- 16 = 2^4 and 81 = 3^4 -> 0
```

### Common mistakes

- Double-counting the square-root divisor (d === x/d).
- Forgetting the p^3 case and only checking p*q.
- Treating p*p as p*q (rest !== p check).

Full JavaScript solution with tests: [03_four_divisors.js](../solutions/03_four_divisors.js). Run it with `node 03_four_divisors.js` from the solutions folder.

</details>

## Related follow-ups

- Count divisors of all numbers 1..n with a harmonic-series sieve
- Number of Ways to Split a Number into Products (counting divisors)
- Perfect Number (LeetCode 507) — sum of divisors

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
