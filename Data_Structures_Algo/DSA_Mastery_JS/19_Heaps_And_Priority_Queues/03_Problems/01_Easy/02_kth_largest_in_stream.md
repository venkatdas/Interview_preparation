# Kth Largest Element in a Stream

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Easy |
| **Pattern** | top K, persistent heap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #703 — https://leetcode.com/problems/kth-largest-element-in-a-stream/ |
| **Solution file** | [02_kth_largest_in_stream.js](../solutions/02_kth_largest_in_stream.js) — open only after a real attempt |

## Problem

Design a class KthLargest(k, nums). Each call add(val) appends val to the
stream and returns the k-th largest element seen so far.

## Examples

```
KthLargest(3, [4,5,8,2])
  add(3)  -> 4     stream 4,5,8,2,3  -> top 3 are 8,5,4
  add(5)  -> 5     stream +5         -> 8,5,5
  add(10) -> 5     -> 10,8,5
  add(9)  -> 8     -> 10,9,8
  add(4)  -> 8
```

## Constraints & clarifying questions

```
- Can nums have fewer than k elements at the start? (yes, but add is only
  called when there are at least k elements in total when we answer)
- How many adds? (up to 10^4 -> each add must be fast)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *top K, persistent heap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) per add, O(n) space. Keep all numbers in an array.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (min-heap of size k)   O(log k) per add, O(k) space. Same trick as problem 01, but kept alive across calls: a min-heap with at most k items holds the k largest so far; its top is the answer.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- initial nums empty
- k = 1 (running maximum)
- duplicates must be kept (they count separately)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) per add, O(n) space

```
Keep all numbers in an array. On every add, sort and return index k-1.
```

### APPROACH 2 — Optimal (min-heap of size k)   O(log k) per add, O(k) space

```
Same trick as problem 01, but kept alive across calls: a min-heap with at
most k items holds the k largest so far; its top is the answer.
add(val): push, pop if size > k, return peek.

Dry run with k = 3, nums = [4,5,8,2]:
  build: push 4,5,8 -> [4,5,8]; push 2 -> size 4 -> pop 2 -> [4,5,8]
  add(3):  push 3 -> pop 3 -> [4,5,8]  -> 4
  add(5):  push 5 -> pop 4 -> [5,5,8]  -> 5
  add(10): push 10 -> pop 5 -> [5,8,10] -> 5
  add(9):  push 9 -> pop 5 -> [8,9,10] -> 8
```

### Edge cases

```
- initial nums empty
- k = 1 (running maximum)
- duplicates must be kept (they count separately)
```

Full JavaScript solution with tests: [02_kth_largest_in_stream.js](../solutions/02_kth_largest_in_stream.js). Run it with `node 02_kth_largest_in_stream.js` from the solutions folder.

</details>

## Common mistakes

- Keeping the whole stream in the heap instead of only k items.
- Not handling an initial array shorter than k.
- Using a max-heap, which makes the k-th largest hard to read.

## Related follow-ups

- [Kth Largest Element in an Array](../02_Medium/01_kth_largest_element.md)
- [Find Median from Data Stream](../03_Hard/08_find_median_data_stream.md)
- [Top K Frequent Elements](../02_Medium/05_top_k_frequent_elements.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
