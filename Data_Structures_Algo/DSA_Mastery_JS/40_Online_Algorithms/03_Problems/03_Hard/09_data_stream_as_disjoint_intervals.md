# Data Stream as Disjoint Intervals

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Hard |
| **Pattern** | sorted intervals + binary search merge |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #352 — https://leetcode.com/problems/data-stream-as-disjoint-intervals/ |
| **Solution file** | [09_data_stream_as_disjoint_intervals.js](../solutions/09_data_stream_as_disjoint_intervals.js) — open only after a real attempt |

## Problem

Non-negative integers arrive one at a time. `addNum(val)` records a value; `getIntervals()`
returns everything seen so far as a sorted list of disjoint closed intervals `[start, end]`
that cover exactly the seen values (consecutive integers are merged).

## Examples

```
add 1 -> [[1,1]]
add 3 -> [[1,1],[3,3]]
add 7 -> [[1,1],[3,3],[7,7]]
add 2 -> [[1,3],[7,7]]
add 6 -> [[1,3],[6,7]]
```

## Constraints & clarifying questions

```
- values 0..10^4, duplicates possible
- up to 3 * 10^4 adds, at most 10^2 getIntervals calls
- Follow-up: many merges and the number of intervals is small compared to the values
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Maintain a *sorted interval set online*. See [31_Intervals](../../../31_Intervals/README.md) and "Online interval maintenance" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Keep a Set of values; on getIntervals sort and group consecutive runs.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Keep intervals sorted. Binary-search the first interval starting after val: only its left neighbour L and itself R can touch val. Cases: covered, glue L+R, extend L, extend R, or insert a new [val,val].

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Duplicates and values already inside an interval do nothing. val = 0 has no left neighbour. Return copies from getIntervals.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Set of values + sort on every getIntervals: O(1) add, O(m log m) query.

### Optimized approach

Sorted list of intervals, binary search for the neighbours, then one of five cases.
O(log k) search + O(k) splice per add, O(k) per getIntervals (k = number of intervals).
A balanced BST / TreeMap (Java) turns the splice into O(log k).

### Dry run

```
add 1 -> insert [1,1]
add 3 -> L=[1,1] (2 != 3) -> insert [3,3]
add 7 -> insert [7,7]
add 2 -> L=[1,1] end+1=2, R=[3,3] start-1=2 -> glue -> [1,3]
add 6 -> R=[7,7] start-1=6 -> [6,7]
```

### Complexity

Add O(k) worst case (O(log k) with a balanced tree), getIntervals O(k), space O(k).

### Edge cases

- duplicates
- value already covered
- val = 0
- gluing two intervals

### Common mistakes

- Handling only "extend" and forgetting the case that glues two intervals together.
- Returning the internal array (caller mutations corrupt state).

Full JavaScript solution with tests: [09_data_stream_as_disjoint_intervals.js](../solutions/09_data_stream_as_disjoint_intervals.js). Run it with `node 09_data_stream_as_disjoint_intervals.js` from the solutions folder.

</details>

## Related follow-ups

- Insert Interval (LeetCode #57)
- Range Module (LeetCode #715)
- My Calendar I (LeetCode #729)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
