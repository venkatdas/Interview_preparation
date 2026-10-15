# Maximum XOR of Two Numbers in an Array

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | bit-by-bit greedy + set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #421 — https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/ |
| **Solution file** | [15_maximum_xor_of_two_numbers.js](../solutions/15_maximum_xor_of_two_numbers.js) — open only after a real attempt |

## Problem

Return the maximum value of nums[i] XOR nums[j] over all 0 <= i <= j < n.

## Examples

```
Input: [3,10,5,25,2,8]   Output: 28   Explanation: 5 ^ 25 = 28
Input: [14,70,53,83,49,91,36,80,92,51,66,70]   Output: 127
```

## Constraints & clarifying questions

```
- Non-negative numbers < 2^31? (yes)
- n up to 2 * 10^5 -> O(n^2) is too slow
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bit-by-bit greedy + set* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Try every pair.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bit-by-bit greedy with a prefix set)   O(32 n) time, O(n) space. Build the answer from the most significant bit down.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element -> 0 (x ^ x)
- all equal -> 0
- contains 0 -> max is the largest element's XOR with something, often itself vs 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Try every pair.
```

### APPROACH 2 — Optimal (bit-by-bit greedy with a prefix set)   O(32 n) time, O(n) space

```
Build the answer from the most significant bit down. Suppose we already know the best
answer restricted to the top k bits (call it `best`). Can we also set bit k+1? Be greedy:
`candidate = best | (1 << bit)`. Collect every number's top-(k+1)-bit prefix into a set.
Because a ^ b = candidate  <=>  a ^ candidate = b, we can check in O(1) per prefix whether
SOME pair produces `candidate`: for each prefix p, ask if (p ^ candidate) is in the set.
If yes, keep the bit; else leave it 0. Higher bits dominate, so grabbing each one as early
as possible is optimal (a 1 at bit k beats any combination of lower bits).

Dry run on [3,5] (3 = 011, 5 = 101), pretending numbers are 3 bits wide, bits 2..0:
  bit2: mask 100, prefixes {000, 100}, candidate 100: 000^100 = 100 in set -> best = 100
  bit1: mask 110, prefixes {010, 100}, candidate 110: 010^110 = 100 in set -> best = 110
  bit0: mask 111, prefixes {011, 101}, candidate 111: 011^111 = 100 no, 101^111 = 010 no -> best stays 110
  best = 110 = 6 = 3 ^ 5 -> correct
```

### Edge cases

```
- single element -> 0 (x ^ x)
- all equal -> 0
- contains 0 -> max is the largest element's XOR with something, often itself vs 0
```

Full JavaScript solution with tests: [15_maximum_xor_of_two_numbers.js](../solutions/15_maximum_xor_of_two_numbers.js). Run it with `node 15_maximum_xor_of_two_numbers.js` from the solutions folder.

</details>

## Common mistakes

- Checking every pair (O(n²)).
- Greedy from the lowest bit instead of the highest.
- Forgetting to rebuild the prefix Set for each bit length.

## Related follow-ups

- [Maximum XOR of Two Numbers in an Array](../../../22_Tries/03_Problems/02_Medium/08_maximum_xor_two_numbers.md) (22_Tries)
- [Single Number III](10_single_number_iii.md)
- Maximum XOR With an Element From Array (LeetCode #1707)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
