# Number of Longest Increasing Subsequence

| | |
|---|---|
| **Topic** | Segment Tree |
| **Difficulty** | Medium |
| **Pattern** | tree over values with (length, count) pairs |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #673 — https://leetcode.com/problems/number-of-longest-increasing-subsequence/ |
| **Solution file** | [05_number_of_longest_increasing_subsequence.js](../solutions/05_number_of_longest_increasing_subsequence.js) — open only after a real attempt |

## Problem

Given an integer array, return how many strictly increasing subsequences have the
maximum possible length.

## Examples

```
Input: [1,3,5,4,7]   Output: 2   Explanation: [1,3,4,7] and [1,3,5,7]
Input: [2,2,2,2,2]   Output: 5   Explanation: LIS length is 1, five ways
```

## Constraints & clarifying questions

```
- n up to 2000 in the original problem -> O(n^2) DP is accepted. The segment tree
  version is O(n log n) and is the way to handle n = 10^5.
- Strictly increasing (equal values do not extend a subsequence).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *tree over values with (length, count) pairs* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force / O(n^2) DP   O(n^2) time, O(n) space. length[i] = longest LIS ending at i, count[i] = how many of them.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Segment tree over VALUES storing (length, count))   O(n log n). The inner loop "best over all j with nums[j] &lt; nums[i]" is a range query over values!

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array -> 0
- single element -> 1
- all equal -> n
- strictly decreasing -> n (LIS length 1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / O(n^2) DP   O(n^2) time, O(n) space

```
length[i] = longest LIS ending at i, count[i] = how many of them.
For each i, look at every j < i with nums[j] < nums[i]:
  if length[j] + 1 > length[i]: length[i] = length[j] + 1, count[i] = count[j]
  else if length[j] + 1 === length[i]: count[i] += count[j]
Answer = sum of count[i] over all i with length[i] === max length.
```

### APPROACH 2 — Optimal (Segment tree over VALUES storing (length, count))   O(n log n)

```
The inner loop "best over all j with nums[j] < nums[i]" is a range query over values!
1. Compress values to 0..m-1.
2. Segment tree indexed by compressed value; each node stores the pair
   (bestLength, waysWithThatLength) for the values in its range.
   merge(a, b): if a.len > b.len -> a; if b.len > a.len -> b; else (a.len, a.cnt + b.cnt).
3. For each number left to right: q = query(0, idx - 1) -> (len, cnt).
   New pair for this element = (q.len + 1, max(q.cnt, 1)) -- if nothing smaller exists,
   the element alone starts 1 subsequence. Update the tree at idx by MERGING the new
   pair into the leaf (not overwriting: equal values at the same leaf accumulate counts).
4. Answer = root pair's count.

Dry run on [1,3,5,4,7] (values compressed 1->0, 3->1, 4->2, 5->3, 7->4):
  1: query(0,-1) = (0,0) -> leaf0 = (1,1)
  3: query(0,0) = (1,1) -> leaf1 = (2,1)
  5: query(0,2) = (2,1) -> leaf3 = (3,1)
  4: query(0,1) = (2,1) -> leaf2 = (3,1)
  7: query(0,3) = merge((3,1) at leaf2, (3,1) at leaf3) = (3,2) -> leaf4 = (4,2)
  root = (4,2) -> answer 2
```

### Edge cases

```
- empty array -> 0
- single element -> 1
- all equal -> n
- strictly decreasing -> n (LIS length 1)
```

Full JavaScript solution with tests: [05_number_of_longest_increasing_subsequence.js](../solutions/05_number_of_longest_increasing_subsequence.js). Run it with `node 05_number_of_longest_increasing_subsequence.js` from the solutions folder.

</details>

## Common mistakes

- Merging (length, count) pairs by adding counts even when the lengths differ; only equal lengths add counts.
- Querying values `<= x` instead of strictly `< x`; the subsequence must be strictly increasing.
- Forgetting to compress values before indexing the tree.

## Related follow-ups

- [Number of LIS (DP view)](../../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/04_number_of_longest_increasing_subsequence.md)
- [Longest Increasing Subsequence](../../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/03_longest_increasing_subsequence.md)
- [Count of Range Sum](../03_Hard/06_count_of_range_sum.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
