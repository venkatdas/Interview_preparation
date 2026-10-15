# Maximum XOR of Two Numbers in an Array

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | binary trie |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #421 — https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/ |
| **Solution file** | [08_maximum_xor_two_numbers.js](../solutions/08_maximum_xor_two_numbers.js) — open only after a real attempt |

## Problem

Given an integer array nums, return the maximum value of nums[i] XOR nums[j]
for any 0 <= i <= j < n.

## Examples

```
Input: [3,10,5,25,2,8]   Output: 28   Explanation: 5 XOR 25 = 28
Input: [14,70,53,83,49,91,36,80,92,51,66,70]   Output: 127
```

## Constraints & clarifying questions

```
- Values non-negative and < 2^31? (yes -> 31 bits is enough)
- Can i == j? (yes, gives 0; the answer is >= 0 always)
- Single element -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *binary trie* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Try every pair, keep the max XOR.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Binary trie, greedy from top bit)   O(n * 31) time, O(n * 31) space. Insert every number into a bitwise trie (bits from most significant down).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all equal numbers -> 0
- [0] -> 0
- very large values near 2^31 - 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Try every pair, keep the max XOR.
```

### APPROACH 2 — Optimal (Binary trie, greedy from top bit)   O(n * 31) time, O(n * 31) space

```
Insert every number into a bitwise trie (bits from most significant down).
For each number x, walk the trie greedily: at each bit prefer the child with
the OPPOSITE bit of x (that makes this bit of the XOR a 1). A 1 in a higher
bit always beats everything below, so greedy is correct.

Dry run (4 bits) nums = [3 (0011), 10 (1010), 5 (0101)], query x = 5 (0101):
  bit3: x=0, want 1 -> 10 has 1 -> result 1000, follow 1
  bit2: x=1, want 0 -> 10 has 0 -> result 1100
  bit1: x=0, want 1 -> 10 has 1 -> result 1110
  bit0: x=1, want 0 -> 10 has 0 -> result 1111 = 15 = 5 ^ 10. Correct.
```

### Edge cases

```
- all equal numbers -> 0
- [0] -> 0
- very large values near 2^31 - 1
```

Full JavaScript solution with tests: [08_maximum_xor_two_numbers.js](../solutions/08_maximum_xor_two_numbers.js). Run it with `node 08_maximum_xor_two_numbers.js` from the solutions folder.

</details>

## Common mistakes

- Walking bits from least significant to most (greedy must start at the top).
- Querying before inserting anything into the trie.
- Using 32 bits with signed shifts and getting negative results; 31 bits suffice for non-negative ints.

## Related follow-ups

- [Maximum XOR of Two Numbers in an Array](../../../14_Bit_Manipulation/03_Problems/02_Medium/15_maximum_xor_of_two_numbers.md) (14_Bit_Manipulation)
- Maximum XOR With an Element From Array (LeetCode #1707)
- [Single Number III](../../../14_Bit_Manipulation/03_Problems/02_Medium/10_single_number_iii.md) (14_Bit_Manipulation)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
