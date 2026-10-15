# Find Median from Data Stream

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Hard |
| **Pattern** | two heaps |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #295 — https://leetcode.com/problems/find-median-from-data-stream/ |
| **Solution file** | [08_find_median_from_data_stream.js](../solutions/08_find_median_from_data_stream.js) — open only after a real attempt |

## Problem

Build a MedianFinder with `addNum(num)` and `findMedian()`. The median is the middle value of
all numbers added so far; when the count is even it is the mean of the two middle values.

## Examples

```
addNum(1); addNum(2); findMedian() -> 1.5
addNum(3);           findMedian() -> 2
```

## Constraints & clarifying questions

```
- at least one number before findMedian
- up to 5 * 10^4 calls, negative values allowed
- Follow-ups: all values in 0..100? 99% of them in 0..100?
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Two heaps* split the stream into a lower half and an upper half. See "Streaming median" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Keep a sorted array and binary-search the insert position. Insert is O(n) because of shifting.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A max-heap for the smaller half and a min-heap for the larger half. Keep sizes equal or the lower half one bigger. The median sits on the heap tops.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Push through the low heap and then move its max to high so the ordering invariant always holds, then rebalance sizes. Even count -> average (may be fractional).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Sorted array with binary search + splice: O(n) add, O(1) median.

### Optimized approach

Two heaps: O(log n) add, O(1) median.
```
add(x): low.push(x); high.push(low.pop())
        if high.size > low.size: low.push(high.pop())
median: low bigger ? low.peek : (low.peek + high.peek) / 2
```

### Dry run

```
add  low(max)  high(min)  median
5    [5]       []         5
15   [5]       [15]       10
1    [5,1]     [15]       5
3    [3,1]     [5,15]     4
```

### Complexity

O(log n) add, O(1) findMedian, O(n) space. Value range 0..100: counting array, O(100) per query.

### Edge cases

- single element
- duplicates
- negatives / even count

### Common mistakes

- Pushing directly into whichever heap without moving the max across: halves overlap.
- Using a default JS sort comparator anywhere (lexicographic!).

Full JavaScript solution with tests: [08_find_median_from_data_stream.js](../solutions/08_find_median_from_data_stream.js). Run it with `node 08_find_median_from_data_stream.js` from the solutions folder.

</details>

## Related follow-ups

- Sliding Window Median (LeetCode #480)
- IPO (LeetCode #502)
- Kth Largest Element in a Stream (problem 03)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
