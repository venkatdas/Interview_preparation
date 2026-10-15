# Hamming Distance

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Easy |
| **Pattern** | popcount(a ^ b) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #461 — https://leetcode.com/problems/hamming-distance/ |
| **Solution file** | [05_hamming_distance.js](../solutions/05_hamming_distance.js) — open only after a real attempt |

## Problem

The Hamming distance between two integers is the number of bit positions where they differ.
Return it for x and y.

## Examples

```
Input: x = 1, y = 4   Output: 2   Explanation: 001 vs 100 differ at two positions
Input: x = 3, y = 1   Output: 1   Explanation: 011 vs 001
```

## Constraints & clarifying questions

```
- Non-negative 32-bit integers? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *popcount(a ^ b)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(32) time, O(1) space. Compare bit i of x and bit i of y for every i in 0..31.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (popcount of XOR)   O(k) time, O(1) space, k = differing bits. x ^ y has a 1 exactly where x and y differ.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- x === y -> 0
- one of them is 0 -> popcount of the other
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(32) time, O(1) space

```
Compare bit i of x and bit i of y for every i in 0..31.
```

### APPROACH 2 — Optimal (popcount of XOR)   O(k) time, O(1) space, k = differing bits

```
x ^ y has a 1 exactly where x and y differ. Count its 1 bits with Kernighan's trick.

Dry run on x = 1, y = 4:
  001 ^ 100 = 101  -> two set bits -> 2
```

### Edge cases

```
- x === y -> 0
- one of them is 0 -> popcount of the other
```

Full JavaScript solution with tests: [05_hamming_distance.js](../solutions/05_hamming_distance.js). Run it with `node 05_hamming_distance.js` from the solutions folder.

</details>

## Common mistakes

- Comparing decimal digits instead of bits.
- Forgetting that XOR already marks every differing position, then counting manually bit by bit with a buggy loop bound.
- Not handling negative inputs with `>>> 0` before counting.

## Related follow-ups

- [Total Hamming Distance](../02_Medium/12_total_hamming_distance.md)
- [Number of 1 Bits](02_number_of_1_bits.md)
- [Minimum Flips to Make a OR b Equal to c](../02_Medium/08_minimum_flips_a_or_b_equal_c.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
