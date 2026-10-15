# Modular Inverse Table

| | |
|---|---|
| **Topic** | Number Theory (Advanced — competitive programming) |
| **Difficulty** | Medium |
| **Pattern** | linear inverse recurrence / batch inversion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [10_modular_inverse_table.js](../solutions/10_modular_inverse_table.js) — open only after a real attempt |

## Problem

Given a prime p and an integer n with 1 <= n < p, build an array inv of length n + 1 where inv[0] = 0 and, for every 1 <= i <= n, (i * inv[i]) mod p equals 1.

Follow-up: given any array a of values (none divisible by p), return the inverse of every element while calling modular exponentiation only once.

## Examples

```
Input: n = 4, p = 7      Output: [0, 1, 4, 5, 2]
  (2*4 = 8, 3*5 = 15, 4*2 = 8 are all 1 mod 7)
Input: n = 1, p = 2      Output: [0, 1]
Follow-up: a = [3, 5], p = 7 -> [5, 3]
```

## Constraints & clarifying questions

```
- p is prime and may be as large as 1e9 + 7 (products reach 1e18: beware 2^53)
- n up to 1e6. Typical use: inverse factorials for nCr mod p.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Modular inverse. Fermat gives one inverse in O(log p); can you reuse earlier inverses?

</details>

<details><summary>Hint 2</summary>

**Start simple.** inv[i] = i^(p-2) mod p for every i. O(n log p).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Write p = q*i + r with r = p mod i < i. Modulo p this says q*i + r = 0. Multiply by inv[i]*inv[r]: inv[i] = -q * inv[r] (mod p). inv[r] is already known because r < i.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Products like q * inv[r] reach ~1e18 when p = 1e9 + 7: use an exact mulMod (BigInt fallback or split multiplication). For the follow-up use prefix products.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log p) time, O(n) space

```
inv[i] = powMod(i, p - 2, p)   (Fermat: i^(p-1) = 1, so i^(p-2) = i^-1)
```

### APPROACH 2 — Optimal (linear recurrence)   O(n) time, O(n) space

```
inv[1] = 1
for i in 2..n: inv[i] = (p - mulMod(floor(p/i), inv[p % i], p)) % p

Follow-up (batch inversion):
  prefix[k] = a0*...*a(k-1)
  t = prefix[m]^(p-2)                  // one exponentiation
  for k = m-1 down to 0: out[k] = t * prefix[k]; t = t * a[k]
```

### Dry run

```
p = 7
i=2: q=3, r=1 -> -(3*1) mod 7 = 4
i=3: q=2, r=1 -> -(2*1) mod 7 = 5
i=4: q=1, r=3 -> -(1*inv[3]=5) mod 7 = 2
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Fermat each | O(n log p) | O(n) |
| Linear recurrence | O(n) | O(n) |
| Batch inversion (any values) | O(m + log p) | O(m) |

### Edge cases

```
- n = 1
- p = 2
- a value divisible by p has no inverse -> throw
```

### Common mistakes

- Writing (a * b) % p with p = 1e9 + 7 and silently losing precision past 2^53.
- Getting a negative result from "-q * inv[r] % p" in JS (% keeps the sign); add p.
- Using Fermat with a non-prime modulus.

Full JavaScript solution with tests: [10_modular_inverse_table.js](../solutions/10_modular_inverse_table.js). Run it with `node 10_modular_inverse_table.js` from the solutions folder.

</details>

## Related follow-ups

- nCr mod p with factorial and inverse-factorial tables (37_Combinatorics)
- Count Anagrams (37_Combinatorics)
- Inverse with extended Euclid for non-prime moduli (CONCEPTS)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
