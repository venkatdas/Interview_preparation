# Sliding Window Median

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Hard |
| **Pattern** | two heaps + lazy deletion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #480 — https://leetcode.com/problems/sliding-window-median/ |
| **Solution file** | [16_sliding_window_median.js](../solutions/16_sliding_window_median.js) — open only after a real attempt |

## Problem

Given nums and a window size k, return the median of every window of size k
as it slides from left to right one position at a time.

## Examples

```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3   Output: [1,-1,-1,3,5,6]
  Explanation: windows [1,3,-1] -> 1, [3,-1,-3] -> -1, [-1,-3,5] -> -1, ...
Input: nums = [1,2,3,4], k = 4             Output: [2.5]
```

## Constraints & clarifying questions

```
- k <= nums.length, k >= 1
- Even k -> average of the two middles (can be a decimal)
- Duplicates? (yes, and this is what makes naive deletion tricky)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two heaps + lazy deletion* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * k log k) time, O(k) space. For every window copy it, sort it, read the middle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two heaps + lazy deletion)   O(n log n) time, O(n) space. Same two-heap idea as "Find Median from Data Stream" (problem 08): a max-heap `low` for the smaller half, a min-heap `high` for the larger half, with low.size == high.size or low.size == high.size + 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> the array itself
- k = nums.length -> single median
- all duplicates (lazy deletion must count, not just mark)
- large values: use (a + b) / 2 only when needed to avoid overflow in other languages
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k log k) time, O(k) space

```
For every window copy it, sort it, read the middle. Simple and correct.
```

### APPROACH 2 — Optimal (two heaps + lazy deletion)   O(n log n) time, O(n) space

```
Same two-heap idea as "Find Median from Data Stream" (problem 08): a
max-heap `low` for the smaller half, a min-heap `high` for the larger half,
with low.size == high.size or low.size == high.size + 1.
The new difficulty: when the window slides, a number LEAVES. A heap cannot
delete an arbitrary element in O(log n)... so we don't. We note it in a
`toRemove` map (value -> count) and only actually discard it when it
surfaces at the top of a heap ("lazy deletion").

To keep the size invariant honest we track `balance` = (valid elements in
low) - (valid elements in high) as we add/remove, and fix it by moving
tops between heaps. Steps per slide (add `incoming`, remove `outgoing`):
  1. removal: if outgoing <= low.top it was in low -> balance--, else balance++
     record toRemove[outgoing]++
  2. insertion: if incoming <= low.top push to low (balance++) else to high (balance--)
  3. if balance > 0 move low.top to high; if balance < 0 move high.top to low
     (after this balance is 0 again; low keeps the extra element for odd k
      because we start with low holding ceil(k/2) valid elements)
  4. prune: while low.top is in toRemove, pop it (decrement count); same for high
  5. median = odd k ? low.top : (low.top + high.top) / 2

Dry run on [1,3,-1,-3,5,3,6,7], k = 3:
  first window {1,3,-1}: low={1,-1} (max 1), high={3} -> median 1
  slide: out 1 (in low, balance -1), in -3 (<= low.top 1 -> low, balance 0)
         low={-1,-3, [1 lazy]} ... prune: low.top is 1 and marked -> pop ->
         low={-1,-3} high={3} -> median -1
  slide: out 3 (in high, balance +1), in 5 (> low.top -> high, balance 0)
         high={3(lazy),5}; prune high top 3 -> high={5}; low={-1,-3} -> median -1
  ... continues -> [1,-1,-1,3,5,6]
```

### Edge cases

```
- k = 1 -> the array itself
- k = nums.length -> single median
- all duplicates (lazy deletion must count, not just mark)
- large values: use (a + b) / 2 only when needed to avoid overflow in other languages
```

Full JavaScript solution with tests: [16_sliding_window_median.js](../solutions/16_sliding_window_median.js). Run it with `node 16_sliding_window_median.js` from the solutions folder.

</details>

## Common mistakes

- Rebuilding and sorting each window (O(n·k log k)).
- Lazy deletion bookkeeping that forgets to rebalance using the "valid" sizes.
- Averaging two large ints could overflow in other languages; JS is fine for 32-bit inputs.

## Related follow-ups

- [Find Median from Data Stream](08_find_median_data_stream.md)
- [Sliding Window Maximum](../../../17_Queues_And_Deques/03_Problems/03_Hard/07_sliding_window_maximum.md) (17_Queues_And_Deques)
- Sliding Window Maximum with a monotonic deque: [Monotonic Stacks & Queues](../../../18_Monotonic_Stacks_And_Queues/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
