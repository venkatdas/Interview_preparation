# Super Pow

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | modular exponentiation with a digit-array exponent |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #372 — https://leetcode.com/problems/super-pow/ (statement paraphrased in our own words) |
| **Solution file** | [08_super_pow.js](../solutions/08_super_pow.js) — open only after a real attempt |

## Problem

Compute a raised to the power b, modulo 1337. Here a is a positive integer and b is enormous, so it is given as an array of its decimal digits (most significant digit first).

## Examples

```
Input: a=2, b=[3]             Output: 8
Input: a=2, b=[1,0]           Output: 1024
Input: a=1, b=[4,3,3,8,5,2]   Output: 1
Input: a=2147483647, b=[2,0,0] Output: 1198
```

## Constraints & clarifying questions

```
- 1 <= a <= 2^31 - 1, 1 <= b.length <= 2000, no leading zeros
- 1337 = 7 * 191 is NOT prime. Can I use Euler and reduce b mod phi(1337)? Only if gcd(a, 1337) = 1.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Modular exponentiation (binary exponentiation). The new twist is how to consume the exponent.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Convert the digit array to a BigInt and run BigInt fast power.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Horner on the exponent: if b = 10*x + d then a^b = (a^x)^10 * a^d. Process digits left to right: result = result^10 * a^d (mod 1337).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Reduce a mod 1337 first (a can be 2^31 - 1). Products of two residues are < 1337^2, so no 2^53 problem here.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(L) BigInt multiplications on L-digit numbers

```
e = BigInt from digits; BigInt binary exponentiation of a mod 1337.
```

### APPROACH 2 — Optimal (Horner on the exponent)   O(L) time, O(1) space

```
result = 1
for d in b: result = pow(result, 10) * pow(a, d) % 1337
pow uses exponents <= 10 -> constant work per digit.
```

### Dry run

```
a=2, b=[1,0]
d=1: result = 1^10 * 2^1   = 2
d=0: result = 2^10 * 2^0   = 1024
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| BigInt exponent | ~O(L^2) to build the BigInt | O(L) |
| Digit-by-digit | O(L) | O(1) |

### Edge cases

```
- a multiple of 1337 -> 0
- a % 1337 === 1 -> 1
- single digit b
```

### Common mistakes

- Reducing the exponent mod phi(1337) = 1140 when gcd(a, 1337) != 1 (wrong for a = 7).
- Forgetting a %= 1337 so the first product a*a exceeds 2^53.

Full JavaScript solution with tests: [08_super_pow.js](../solutions/08_super_pow.js). Run it with `node 08_super_pow.js` from the solutions folder.

</details>

## Related follow-ups

- Pow(x, n) (LeetCode 50) in Foundations
- Count Good Numbers (LeetCode 1922) — powMod with a 1e15 exponent: needs exact mulMod
- Euler / Fermat exponent reduction (CONCEPTS, Advanced)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
