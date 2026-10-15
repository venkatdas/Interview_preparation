# Kth Largest Element in a Stream

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Easy |
| **Pattern** | min-heap of size k |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #703 — https://leetcode.com/problems/kth-largest-element-in-a-stream/ |
| **Solution file** | [03_kth_largest_in_a_stream.js](../solutions/03_kth_largest_in_a_stream.js) — open only after a real attempt |

## Problem

Build a class from an integer k and an initial list of numbers. Each `add(val)` inserts
one number and returns the k-th largest number among everything seen so far (duplicates count
as separate numbers).

## Examples

```
k = 3, nums = [4, 5, 8, 2]
add(3)  -> 4
add(5)  -> 5
add(10) -> 5
add(9)  -> 8
add(4)  -> 8
```

## Constraints & clarifying questions

```
- the initial list may hold fewer than k numbers; after the first add there are at least k
- values can be negative and repeated
- up to 10^4 adds
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Top-k over a stream* -> a heap. See the MinHeap section of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Keep all numbers and sort after each add. O(n log n) per add.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Only the k largest numbers matter. Keep them in a MIN-heap: its top is the smallest of the top k, which is exactly the k-th largest. If the heap grows to k+1, pop.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** k = 1 (running max), an initial list shorter than k, duplicates equal to the answer.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Keep every number in an array; on each add sort descending and return index k-1. O(n log n) per add.

### Optimized approach

Min-heap capped at k items. O(log k) per add, O(k) memory.
```
push(val); if size > k: pop()
return peek()
```

### Dry run

```
k = 3, init [4,5,8,2] -> heap {4,5,8} (2 popped)
add 3  -> {3,4,5,8} pop 3 -> top 4
add 5  -> {4,5,5,8} pop 4 -> top 5
add 10 -> pop 5 -> {5,8,10} -> 5
add 9  -> pop 5 -> {8,9,10} -> 8
add 4  -> pop 4 -> {8,9,10} -> 8
```

### Complexity

O(log k) per add (plus O(n log k) to build), O(k) space.

### Edge cases

- k = 1
- initial list shorter than k
- duplicates

### Common mistakes

- Using a MAX-heap of everything (O(n) memory and still O(k log n) to read the k-th).
- Forgetting to cap the heap during construction.

Full JavaScript solution with tests: [03_kth_largest_in_a_stream.js](../solutions/03_kth_largest_in_a_stream.js). Run it with `node 03_kth_largest_in_a_stream.js` from the solutions folder.

</details>

## Related follow-ups

- Top K Frequent Elements (LeetCode #347)
- Find Median from Data Stream (problem 08)
- K Closest Points to Origin (LeetCode #973)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
