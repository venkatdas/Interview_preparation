# Minimum Number of K Consecutive Bit Flips

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Hard |
| **Pattern** | window of flips + lazy toggle |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #995 — https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/ |
| **Solution file** | [15_min_k_consecutive_bit_flips.js](../solutions/15_min_k_consecutive_bit_flips.js) — open only after a real attempt |

## Problem

Given a binary array nums and an integer k, a "k-bit flip" picks a subarray of length
exactly k and flips every bit in it (0 -> 1, 1 -> 0). Return the minimum number of
k-bit flips so that the array contains no 0s, or -1 if impossible.

## Examples

```
Input: nums = [0, 1, 0], k = 1             Output: 2
Input: nums = [1, 1, 0], k = 2             Output: -1   Explanation: flipping [1,0] gives [0,1]; no way to fix both
Input: nums = [0, 0, 0, 1, 0, 1, 1, 0], k = 3   Output: 3
  Explanation: flip [0..2] -> 1,1,1,1,0,1,1,0 ; flip [4..6] -> 1,1,1,1,1,0,0,0 ; flip [5..7] -> all ones
```

## Constraints & clarifying questions

```
- Flips must be exactly length k and within bounds? (yes)
- n up to 10^5 -> O(n * k) simulation is too slow
- Modifying the input allowed? (ask; the version below does not)

The greedy insight: scan left to right. The leftmost 0 MUST be fixed by a flip that
starts exactly there (any flip starting earlier was already decided; starting later
leaves this 0 alone). So: whenever the CURRENT bit (after all flips so far) is 0,
flip [i, i + k - 1]. Greedy is optimal because every flip is forced.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *window of flips + lazy toggle* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (greedy with real flipping)   O(n * k) time, O(n) space. Same greedy, but physically flip the k bits each time.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sliding window of active flips)   O(n) time, O(n) space. We don't need to flip bits; we need to know how many flips currently COVER index i.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Already all ones -> 0
- k = 1 -> number of zeros
- A zero too close to the end to fit a flip -> -1
- k === n -> at most one flip; possible only if all equal
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (greedy with real flipping)   O(n * k) time, O(n) space

```
Same greedy, but physically flip the k bits each time. Correct, too slow for big k.
```

### APPROACH 2 — Optimal (sliding window of active flips)   O(n) time, O(n) space

```
We don't need to flip bits; we need to know how many flips currently COVER index i.
A flip that started at index j covers i while i - j < k, i.e. j > i - k.
Keep `activeFlips` = number of flips whose window still includes i. Track where flips
started in an array `flippedAt[j]` (1 if a flip started at j). As i moves right,
the flip that started at i - k (if any) expires: activeFlips -= flippedAt[i - k].
The effective bit at i is nums[i] XOR (activeFlips % 2). If it is 0:
  - if i + k > n -> impossible, return -1
  - start a flip here: flippedAt[i] = 1, activeFlips++, count++

Dry run on [0, 0, 0, 1, 0, 1, 1, 0], k = 3:
  i=0 active 0, bit 0 -> flip at 0 (active 1, count 1)
  i=1 active 1, bit 0^1=1 ok | i=2 active 1, bit 1 ok
  i=3 flip from 0 expires (active 0), bit 1 ok
  i=4 active 0, bit 0 -> flip at 4 (active 1, count 2)
  i=5 bit 1^1=0 -> flip at 5 (active 2, count 3)
  i=6 bit 1^0=1 ok (active 2 -> parity 0)
  i=7 flip from 4 expires (active 1), bit 0^1=1 ok
  count 3
```

### Edge cases

```
- Already all ones -> 0
- k = 1 -> number of zeros
- A zero too close to the end to fit a flip -> -1
- k === n -> at most one flip; possible only if all equal
```

Full JavaScript solution with tests: [15_min_k_consecutive_bit_flips.js](../solutions/15_min_k_consecutive_bit_flips.js). Run it with `node 15_min_k_consecutive_bit_flips.js` from the solutions folder.

</details>

## Common mistakes

- Flipping all k bits each time (O(n·k)); track active flips with a difference array or a queue.
- Forgetting to expire a flip once it is k positions behind.
- Not returning -1 when a flip would run past the end of the array.

## Related follow-ups

- [Corporate Flight Bookings](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/12_corporate_flight_bookings.md) — the difference-array idea behind lazy flips
- [Car Pooling](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/13_car_pooling.md) — another range-update sweep
- Minimum Number of Flips to Make the Binary String Alternating (LeetCode #1888) — a different flip window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
