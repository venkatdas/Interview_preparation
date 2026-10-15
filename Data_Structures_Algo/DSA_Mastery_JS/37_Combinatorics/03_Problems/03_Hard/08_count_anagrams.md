# Count Anagrams

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Hard |
| **Pattern** | multinomial mod p with factorial + inverse factorial tables |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2514 — https://leetcode.com/problems/count-anagrams/ |
| **Solution file** | [08_count_anagrams.js](../solutions/08_count_anagrams.js) — open only after a real attempt |

## Problem

`s` is a sentence of lowercase words separated by single spaces. Rearranging letters is
allowed only inside each word, and word order stays the same. Count the distinct sentences
you can make this way, modulo 1e9+7.

## Examples

```
Input: "too hot"   Output: 18   ("too": 3 arrangements, "hot": 6)
Input: "aa"        Output: 1
Input: "abc"       Output: 6
```

## Constraints & clarifying questions

```
- 1 <= s.length <= 10^5
- Repeated letters -> count DISTINCT strings
- Answer modulo 1e9+7
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Permutations of a multiset (multinomial coefficient). Read *nCr mod p* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** For short words, generate a Set of all permutations and multiply the sizes.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A word of length m with letter counts c1..c26 has m! / (c1!...c26!) arrangements. Division mod p = multiply by inverse. Precompute fact[] and invFact[] up to s.length.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Residue times residue is ~1e18 > 2^53: use an exact mulMod or BigInt. All-same letters -> 1.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(sum of m!) time — tiny inputs only

```
For each word: Set of all permutations; answer = product of set sizes.
```

### APPROACH 2 — Optimal (multinomial mod p)   O(L + 26 * words) time, O(L) space

```
fact[i] = fact[i-1]*i; invFact[L] = fact[L]^(p-2); invFact[i-1] = invFact[i]*i
per word: fact[m] * product of invFact[count]
answer = product over words
```

### Dry run

```
"too hot"
  "too": 3! * invFact[2] = 6/2 = 3
  "hot": 3! = 6
  3 * 6 = 18
```

### Complexity

- Brute force: O(sum of m!) time — tiny inputs only
- Optimal: O(L + 26 * words) time, O(L) space

### Edge cases

```
- one word, one repeated letter -> 1
- spaces only separate words, no empty words
```

### Common mistakes

- Naive (a*b) % MOD in JS: silently wrong for large residues.
- Computing the inverse of every factorial with its own powMod (O(L log p), slower but correct).
- Treating the whole sentence as one multiset (letters cannot cross words).

Full JavaScript solution with tests: [08_count_anagrams.js](../solutions/08_count_anagrams.js). Run it with `node 08_count_anagrams.js` from the solutions folder.

</details>

## Related follow-ups

- Number of ways to rearrange a string (multinomial)
- Count Ways to Build Rooms in an Ant Colony (LeetCode #1916) — multinomial on a tree
- Count the Number of Ideal Arrays (LeetCode #2338)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
