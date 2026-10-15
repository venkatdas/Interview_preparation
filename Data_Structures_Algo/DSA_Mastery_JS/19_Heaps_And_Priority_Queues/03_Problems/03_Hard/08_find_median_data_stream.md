# Find Median from Data Stream

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Hard |
| **Pattern** | two heaps |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #295 — https://leetcode.com/problems/find-median-from-data-stream/ |
| **Solution file** | [08_find_median_data_stream.js](../solutions/08_find_median_data_stream.js) — open only after a real attempt |

## Problem

Design a class MedianFinder with addNum(num) and findMedian(). The median is
the middle value of all numbers added so far (average of the two middles when
the count is even).

## Examples

```
addNum(1), addNum(2), findMedian() -> 1.5
addNum(3), findMedian()            -> 2
```

## Constraints & clarifying questions

```
- Up to 5 * 10^4 calls -> O(n) per findMedian is too slow if called often
- Values in a small range? (if 0..100, a counting array works - the follow-up)
- findMedian never called on an empty stream? (assume at least one number)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two heaps* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) per findMedian, O(n) space. Keep an array; sort it every time the median is requested.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two heaps)   O(log n) add, O(1) findMedian, O(n) space. Split the numbers into two halves: low  = MAX-heap of the smaller half  (top = largest of the small numbers) high = MIN-heap of the larger half   (top = smallest of the large numbers) Invariants: 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single number -> that number
- duplicates
- negative numbers
- descending input (the "always push to low first" trick keeps it correct)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) per findMedian, O(n) space

```
Keep an array; sort it every time the median is requested.
(Or keep it sorted with binary-search insert: O(n) per add because of shifting.)
```

### APPROACH 2 — Optimal (two heaps)   O(log n) add, O(1) findMedian, O(n) space

```
Split the numbers into two halves:
  low  = MAX-heap of the smaller half  (top = largest of the small numbers)
  high = MIN-heap of the larger half   (top = smallest of the large numbers)
Invariants:
  1. every number in low <= every number in high
  2. low.size === high.size  or  low.size === high.size + 1
Then the median is low.top (odd count) or (low.top + high.top) / 2 (even).

addNum(x): always push to low first, then move low's max to high (this
guarantees invariant 1 with no comparisons). If high is now bigger than
low, move high's min back to low (invariant 2). Two or three heap ops total.

Dry run: add 1, 2, 3
  add 1: low={1} -> move 1 to high: low={}, high={1} -> high bigger -> move back: low={1}, high={}
  add 2: low={1,2} -> move 2 to high: low={1}, high={2}; sizes equal  -> median (1+2)/2 = 1.5
  add 3: low={1,3} -> move 3 to high: low={1}, high={2,3} -> high bigger -> move 2 back:
         low={1,2}, high={3}  -> median = low.top = 2
```

### Edge cases

```
- single number -> that number
- duplicates
- negative numbers
- descending input (the "always push to low first" trick keeps it correct)
```

Full JavaScript solution with tests: [08_find_median_data_stream.js](../solutions/08_find_median_data_stream.js). Run it with `node 08_find_median_data_stream.js` from the solutions folder.

</details>

## Common mistakes

- Not rebalancing so the heap sizes differ by more than one.
- Putting a number in the wrong half (compare with the max-heap top first).
- Integer-dividing the even-count median.

## Related follow-ups

- [Sliding Window Median](16_sliding_window_median.md)
- [Kth Largest Element in a Stream](../01_Easy/02_kth_largest_in_stream.md)
- IPO-style two-heap greedy: [IPO](../03_Hard/14_ipo.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
