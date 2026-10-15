# Data Stream as Disjoint Intervals

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Hard |
| **Pattern** | sorted insert + merge neighbours |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #352 — https://leetcode.com/problems/data-stream-as-disjoint-intervals/ |
| **Solution file** | [13_data_stream_as_disjoint_intervals.js](../solutions/13_data_stream_as_disjoint_intervals.js) — open only after a real attempt |

## Problem

Integers arrive one at a time (addNum). At any moment getIntervals() must return the set
of numbers seen so far as a sorted list of disjoint closed intervals [a, b], where
consecutive integers are merged (seeing 1, 3, 7, 2, 6 gives [[1,3],[6,7]]).

## Examples

```
addNum(1) -> [[1,1]]
addNum(3) -> [[1,1],[3,3]]
addNum(7) -> [[1,1],[3,3],[7,7]]
addNum(2) -> [[1,3],[7,7]]          Explanation: 2 bridges 1 and 3
addNum(6) -> [[1,3],[6,7]]
```

## Constraints & clarifying questions

```
- Duplicates? (yes, ignore them)
- Which is called more, addNum or getIntervals? (unknown - keep both reasonable)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sorted insert + merge neighbours* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(1) add, O(n log n) getIntervals. Store numbers in a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sorted interval list + merge with neighbours)   O(log n + n) add (binary search + splice), O(1) get. Keep intervals sorted.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- duplicate number -> no change
- number inside an existing interval -> no change
- number that bridges two intervals -> they merge into one
- negative numbers work the same
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(1) add, O(n log n) getIntervals

```
Store numbers in a Set. On getIntervals, sort them and group consecutive runs.
```

### APPROACH 2 — Optimal (sorted interval list + merge with neighbours)   O(log n + n) add (binary search + splice), O(1) get

```
Keep intervals sorted. On addNum(x):
  1. binary search for the first interval with start > x; let prev be the one before it.
  2. if prev contains x -> duplicate, done.
  3. if prev.end + 1 === x, extend prev; if next.start - 1 === x, extend next (lower its start);
     if BOTH happened, prev and next now touch -> merge them into one.
  4. otherwise insert [x, x] at that position.
With a balanced tree (TreeMap) the splice would also be O(log n); in JS a sorted array is
the practical choice and is what interviewers expect.

Dry run: add 1, 3, 7, 2:
  add 1: list [] -> insert [1,1]
  add 3: next of [1,1]? none; prev [1,1]: end+1 = 2 != 3 -> insert [3,3]
  add 7: -> [[1,1],[3,3],[7,7]]
  add 2: idx=1 (first start > 2 is [3,3]); prev [1,1] end+1 == 2 -> [1,2]; next [3,3] start-1 == 2 -> [2,3];
         both touched -> merge into [1,3]; list [[1,3],[7,7]]
```

### Edge cases

```
- duplicate number -> no change
- number inside an existing interval -> no change
- number that bridges two intervals -> they merge into one
- negative numbers work the same
```

Full JavaScript solution with tests: [13_data_stream_as_disjoint_intervals.js](../solutions/13_data_stream_as_disjoint_intervals.js). Run it with `node 13_data_stream_as_disjoint_intervals.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the case where one new number bridges two existing intervals.
- Treating adjacent integers (`[1,1]` and `[2,2]`) as separate; here they must join.
- Re-sorting the whole set on every `getIntervals` call when many calls are expected.

## Related follow-ups

- [Insert Interval](../02_Medium/04_insert_interval.md)
- [Merge Intervals](../02_Medium/03_merge_intervals.md)
- Summary Ranges (LeetCode #228)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
