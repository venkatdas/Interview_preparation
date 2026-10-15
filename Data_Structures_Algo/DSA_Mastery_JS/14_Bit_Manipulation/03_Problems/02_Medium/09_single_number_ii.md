# Single Number II

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | count bits mod 3 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #137 — https://leetcode.com/problems/single-number-ii/ |
| **Solution file** | [09_single_number_ii.js](../solutions/09_single_number_ii.js) — open only after a real attempt |

## Problem

Every element appears exactly THREE times except one, which appears once. Find it in
O(n) time and O(1) extra space.

## Examples

```
Input: [2,2,3,2]              Output: 3
Input: [0,1,0,1,0,1,99]       Output: 99
Input: [-2,-2,-2,5]           Output: 5
```

## Constraints & clarifying questions

```
- Negatives allowed? (yes - answer must handle the sign bit correctly)
- Plain XOR works? (no: three copies do not cancel, 2^2^2 = 2)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count bits mod 3* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Count with a hash map, return the key with count 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count each bit column modulo 3)   O(32 n) time, O(1) space. For each bit position i, count how many numbers have bit i set.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element -> itself
- negative single number -> sign bit count % 3 === 1 -> result | 0 gives the negative value
- the single number is 0 -> all counts are multiples of 3 -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Count with a hash map, return the key with count 1.
```

### APPROACH 2 — Optimal (count each bit column modulo 3)   O(32 n) time, O(1) space

```
For each bit position i, count how many numbers have bit i set. Numbers that appear 3
times contribute a multiple of 3 to that count. So (count % 3) is the single number's
bit i. Rebuild the answer bit by bit. If bit 31 ends up set, the number is negative:
`result | 0` re-interprets the 32-bit pattern as signed.

Dry run on [2,2,3,2] (bits: 010,010,011,010):
  bit0 count=1 -> 1%3=1 -> set
  bit1 count=4 -> 4%3=1 -> set
  bit2 count=0 -> 0
  result = 011 = 3
```

### Edge cases

```
- single element -> itself
- negative single number -> sign bit count % 3 === 1 -> result | 0 gives the negative value
- the single number is 0 -> all counts are multiples of 3 -> 0
```

Full JavaScript solution with tests: [09_single_number_ii.js](../solutions/09_single_number_ii.js). Run it with `node 09_single_number_ii.js` from the solutions folder.

</details>

## Common mistakes

- Rebuilding the answer from bit counts without `| 0`, so a negative unique number comes back as a large positive.
- Applying plain XOR, which does not cancel triples.
- Getting the `ones` / `twos` update order wrong in the state-machine version.

## Related follow-ups

- [Single Number](../01_Easy/01_single_number.md)
- [Single Number III](10_single_number_iii.md)
- Majority Element II (LeetCode #229)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
