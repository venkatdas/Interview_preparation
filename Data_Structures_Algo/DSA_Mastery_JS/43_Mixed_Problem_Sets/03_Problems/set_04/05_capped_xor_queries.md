# Capped XOR Queries

| | |
|---|---|
| **Set** | [Mixed Set 04](README.md) — problem 05 of 5 |
| **Difficulty** | Hard |
| **Time box** | 35 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [05_capped_xor_queries.js](solutions/05_capped_xor_queries.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

You have an array of non-negative integers `nums`. Each query [x, m] asks: among the
numbers in nums that are <= m, which one gives the largest value of (x XOR number)?
Return that largest XOR, or -1 if no number in nums is <= m. Answer every query (in
the given order).

## Examples

```
Input: nums = [0, 1, 2, 3, 4], queries = [[3, 1], [1, 3], [5, 6]]   Output: [3, 3, 7]
       Explanation: x=3,m=1 -> best 3^0=3; x=1,m=3 -> 1^2=3; x=5,m=6 -> 5^2=7
Input: nums = [5, 9], queries = [[1, 4]]                            Output: [-1]
```

## Constraints & clarifying questions

```
- Up to 10^5 numbers and 10^5 queries; values < 2^30.
- Queries are known in advance? (yes, all queries are given up front)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Sorting + offline queries + a binary trie with greedy bit choice. See [Tries](../../../22_Tries/README.md), [Bit Manipulation](../../../14_Bit_Manipulation/README.md) and [Sorting](../../../11_Sorting/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** For each query scan all numbers ≤ m and take the best XOR: O(n·q).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Answer queries in increasing m, inserting numbers ≤ m into a binary trie as you go. Max XOR is greedy from the highest bit: always try the opposite bit of x.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no number <= m -> -1 (trie still empty)
- x = 0 -> answer is the largest allowed number
- duplicates in nums -> harmless
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * q) time, O(1) space

```
For each query scan all nums <= m and keep the best XOR.
```

### APPROACH 2 — Optimal (sort + offline queries + binary trie, greedy bit by bit)   O((n + q) * 30 + n log n + q log q) time, O(n * 30) space

```
Sort nums ascending and sort query indices by m. Sweep queries in increasing m; before
answering, insert every num <= m into a binary trie (bits 29 down to 0). Then the trie
holds exactly the allowed numbers. Max XOR with x is greedy: at each bit try to go to the
child with the OPPOSITE bit of x (that sets this bit of the result to 1, which beats any
choice for the lower bits); fall back to the same bit if missing.

Dry run on nums = [0,1,2,3,4], queries sorted by m: [3,1], [1,3], [5,6]
  m=1: insert 0, 1        x=3 (011): want 1 at bit1? missing -> 0; bit0 want 0 -> 0 -> pick 000 -> 3
  m=3: insert 2, 3        x=1 (001): bit1 want 1 -> yes (2 or 3); bit0 want 0 -> 2 -> 1^2 = 3
  m=6: insert 4           x=5 (101): bit2 want 0 -> yes; bit1 want 1 -> yes; bit0 want 0 -> 010=2 -> 7
  answers in original order [3, 3, 7]
```

### Edge cases

```
- no number <= m -> -1 (trie still empty)
- x = 0 -> answer is the largest allowed number
- duplicates in nums -> harmless
```

### Common mistakes

```
- Answering queries in sorted order but returning them unsorted.
- Using 1 << 31 (negative in JS) — keep values below 2^30 or use >>> 0.
```

Full JavaScript solution with tests: [05_capped_xor_queries.js](solutions/05_capped_xor_queries.js). Run it with `node solutions/05_capped_xor_queries.js` from this folder.

</details>

## Related follow-ups

- Online queries (store the minimum value in each trie node)
- Maximum XOR of any pair (LeetCode #421)
- Max XOR of a subarray (prefix XOR + trie)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
