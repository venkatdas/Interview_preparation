# K-th Symbol in Grammar

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | recurse on the parent |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #779 — https://leetcode.com/problems/k-th-symbol-in-grammar/ (statement paraphrased in our own words) |
| **Solution file** | [07_kth_symbol_in_grammar.js](../solutions/07_kth_symbol_in_grammar.js) — open only after a real attempt |

## Problem

Row 1 is "0". To build the next row, replace every 0 with "01" and every 1 with "10".
Given n and k (1-indexed), return the k-th symbol of row n.

## Examples

```
n=1, k=1 -> 0          row 1: 0
n=2, k=1 -> 0          row 2: 01
n=2, k=2 -> 1
n=4, k=5 -> 1          row 4: 01101001
```

## Constraints & clarifying questions

```
- 1 <= n <= 30, 1 <= k <= 2^(n-1). Row 30 has 536,870,912 symbols: never build it.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** The rows form a binary tree: each symbol has two children in the next row. Think "who is my parent?".

</details>

<details><summary>Hint 2</summary>

**Start simple.** Build every row as a string. Works until about n = 20, then memory explodes.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Symbol k of row n comes from symbol ceil(k/2) of row n-1. Odd k (left child) copies the parent, even k (right child) flips it.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n = 1 is the base case (0). k is 1-indexed. Bonus: the answer equals the parity of the number of 1 bits in k - 1.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (build the rows)   O(2^n) time, O(2^n) space

```
Build each row string from the previous one and index into the last. Fine for n <= 20.
```

### APPROACH 2 — Optimal (recurse on the parent)   O(n) time, O(n) stack

```
Every symbol at position k in row n was produced by its PARENT at position
ceil(k / 2) in row n-1. A parent p produces "p, flip(p)":
  k odd  -> left child  -> same as parent
  k even -> right child -> flipped parent
PROMISE: kth(n, k) returns the k-th symbol of row n.
  base: n === 1 -> 0
  step: parent = kth(n - 1, ceil(k / 2)); return k odd ? parent : 1 - parent
(Closed form: answer = popcount(k - 1) % 2.)

Dry run n=4, k=5:
  kth(4,5): parent = kth(3,3)
    kth(3,3): parent = kth(2,2)
      kth(2,2): parent = kth(1,1) = 0, k even -> 1
    k=3 odd -> 1
  k=5 odd -> 1        answer 1
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| build rows | O(2^n) | O(2^n) |
| parent recursion | O(n) | O(n) stack |
| popcount formula | O(log k) | O(1) |

### Edge cases

```
- n = 1 (only k = 1)
- k = 1 is always 0 (leftmost path never flips)
- k = 2^(n-1), the last symbol
```

### Common mistakes

- Building row 30 (half a billion characters).
- Using floor(k/2) with 1-indexed k (wrong parent).
- Mixing up which child flips.

Full JavaScript solution with tests: [07_kth_symbol_in_grammar.js](../solutions/07_kth_symbol_in_grammar.js). Run it with `node 07_kth_symbol_in_grammar.js` from the solutions folder.

</details>

## Related follow-ups

- Find Kth Bit in Nth Binary String (LeetCode #1545)
- Elimination Game (LeetCode #390)
- Gray Code (LeetCode #89)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
