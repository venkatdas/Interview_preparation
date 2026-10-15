# Total Hamming Distance

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | count per bit column |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #477 — https://leetcode.com/problems/total-hamming-distance/ |
| **Solution file** | [12_total_hamming_distance.js](../solutions/12_total_hamming_distance.js) — open only after a real attempt |

## Problem

Return the sum of Hamming distances over ALL pairs of numbers in the array.

## Examples

```
Input: [4,14,2]   Output: 6
  Explanation: HD(4,14)=2, HD(4,2)=2, HD(14,2)=2 -> 6
Input: [4,14,4]   Output: 4
```

## Constraints & clarifying questions

```
- Non-negative numbers < 2^30? (yes)
- n up to 10^4 -> O(n^2) pairs is borderline, want O(32 n)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count per bit column* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 * 32) time, O(1) space. For every pair, popcount(a ^ b).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count ones per bit column)   O(32 n) time, O(1) space. Look at one bit position at a time.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element -> 0
- all equal -> 0
- empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * 32) time, O(1) space

```
For every pair, popcount(a ^ b). 10^8 for n = 10^4; too slow in a strict judge.
```

### APPROACH 2 — Optimal (count ones per bit column)   O(32 n) time, O(1) space

```
Look at one bit position at a time. If `ones` numbers have a 1 there and `zeros` have a 0,
then every (one, zero) pair differs at this bit -> contributes ones * zeros.
Sum over the 32 columns. Pairs are never enumerated.

Dry run on [4,14,2] (100, 1110, 010):
  bit0: ones=0, zeros=3 -> 0
  bit1: ones=2 (14,2), zeros=1 -> 2
  bit2: ones=2 (4,14), zeros=1 -> 2
  bit3: ones=1 (14),   zeros=2 -> 2   -> 6
```

### Edge cases

```
- single element -> 0
- all equal -> 0
- empty -> 0
```

Full JavaScript solution with tests: [12_total_hamming_distance.js](../solutions/12_total_hamming_distance.js). Run it with `node 12_total_hamming_distance.js` from the solutions folder.

</details>

## Common mistakes

- Computing Hamming distance for every pair: O(n²) times out.
- Forgetting that a bit position contributes `ones * zeros`, not `ones`.
- Looping fewer than 30–32 bits and missing high bits.

## Related follow-ups

- [Hamming Distance](../01_Easy/05_hamming_distance.md)
- [Number of 1 Bits](../01_Easy/02_number_of_1_bits.md)
- Sum of Absolute Differences in a Sorted Array (LeetCode #1685)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
