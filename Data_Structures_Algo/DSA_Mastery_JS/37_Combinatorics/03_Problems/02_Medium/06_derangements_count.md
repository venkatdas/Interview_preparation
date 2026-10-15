# Derangements Count

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Medium |
| **Pattern** | derangement recurrence / inclusion–exclusion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_derangements_count.js](../solutions/06_derangements_count.js) — open only after a real attempt |

## Problem

n guests leave their coats at a party. At the end the coats are handed back at random.
Count the ways to hand back the coats so that NOBODY gets their own coat. Return the count
modulo 1e9+7. (These permutations with no fixed point are called derangements, written !n.)

## Examples

```
Input: n = 3   Output: 2    ([2,3,1] and [3,1,2])
Input: n = 4   Output: 9
Input: n = 1   Output: 0
Input: n = 0   Output: 1    (the empty arrangement)
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^6
- Answer modulo 1e9+7
- Many queries? (then precompute D[0..maxN])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Count permutations that avoid "bad" positions. Read *Derangements* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Backtracking: place coats guest by guest, skipping the guest's own coat. Works up to n ~ 9.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Guest 1's coat goes to some guest j (n-1 choices). If j takes coat 1 back -> D(n-2); otherwise -> D(n-1). So D(n) = (n-1)(D(n-1) + D(n-2)).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** D(0) = 1, D(1) = 0. Keep values reduced mod p and multiply exactly (the 2^53 trap).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * n!) time, O(n) space

```
Backtrack over coat assignments with used[] and the rule coat != guest.
```

### APPROACH 2 — Optimal (recurrence)   O(n) time, O(1) space

```
a = D(0) = 1, b = D(1) = 0
for i in 2..n: (a, b) = (b, (i-1) * (a + b) mod p)
```

### Dry run

```
n = 4
  i=2: 1 * (0+1) = 1
  i=3: 2 * (1+0) = 2
  i=4: 3 * (2+1) = 9   -> 9
```

### Complexity

- Brute force: O(n * n!) time, O(n) space
- Optimal: O(n) time, O(1) space

### Edge cases

```
- n = 0 -> 1, n = 1 -> 0, n = 2 -> 1
- probability a random permutation is a derangement -> 1/e ≈ 0.3679
```

### Common mistakes

- Returning 0 for n = 0.
- (a * b) % p with residues near 1e9: the product exceeds 2^53 and loses digits.

Full JavaScript solution with tests: [06_derangements_count.js](../solutions/06_derangements_count.js). Run it with `node 06_derangements_count.js` from the solutions folder.

</details>

## Related follow-ups

- Find the Derangement of An Array (LeetCode #634, premium)
- Count permutations where exactly k items are fixed — C(n,k) * D(n-k)
- Secret Santa probability — D(n)/n!

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
