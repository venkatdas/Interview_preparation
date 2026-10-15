# Smallest Covering Range

| | |
|---|---|
| **Set** | [Mixed Set 03](README.md) — problem 05 of 5 |
| **Difficulty** | Hard |
| **Time box** | 35 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [05_smallest_covering_range.js](solutions/05_smallest_covering_range.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

k teams each publish a sorted (non-decreasing) list of times when they are free.
Find the smallest time range [lo, hi] that contains at least one time from EVERY list.
"Smallest" means smallest hi - lo; on a tie, the one with the smaller lo.
Every list is non-empty.

## Examples

```
Input: [[4, 10, 15], [0, 9, 12], [5, 18]]   Output: [0, 5]   Explanation: 4, 0 and 5 are inside
Input: [[1, 5], [3, 9], [4]]                Output: [3, 5]   Explanation: 5, 3 and 4 are inside
Input: [[7, 8]]                             Output: [7, 7]
```

## Constraints & clarifying questions

```
- k up to 3500, total elements N up to 10^5.
- Lists sorted? (yes) Duplicates allowed? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** K-way merge with a min-heap + tracking the current max (a sliding window across k sorted lists). See [Heaps](../../../19_Heaps_And_Priority_Queues/README.md) and [Sliding Window](../../../07_Sliding_Window/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Every best range starts and ends at some element. Try every pair and check every list: very slow but correct.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Hold one pointer per list. The range is [min, max] of the pointed values. Only advancing the list with the minimum can shrink the range.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- a single list -> [x, x] for its first element
- all lists share a value -> zero-width range
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(N^2 * N) time

```
Every candidate range has lo and hi equal to some elements. Try every pair (lo, hi)
with lo <= hi and check each list for an element inside.
```

### APPROACH 2 — Optimal (min-heap k-way merge + running max, a sliding window over k lists)   O(N log k) time, O(k) space

```
Put the first element of every list in a min-heap and track the current max. The range
[heap min, max] covers all lists. To try to shrink it, the only useful move is to advance
the list that holds the minimum (advancing anything else can only grow max). Pop the min,
push the next element of that list, update max, record the range. Stop when some list
runs out (the minimum can never be advanced again).

Dry run on [[1, 5], [3, 9], [4]]:
  heap {1(L0), 3(L1), 4(L2)}  max=4   range [1,4] width 3   best [1,4]
  pop 1, push 5 (L0)          max=5   heap min 3 -> range [3,5] width 2  best [3,5]
  pop 3, push 9 (L1)          max=9   heap min 4 -> range [4,9] width 5
  pop 4: list L2 is exhausted -> stop
  answer [3, 5]
  (In code the range is recorded right after each pop, using the popped value as lo.)
```

### Edge cases

```
- a single list -> [x, x] for its first element
- all lists share a value -> zero-width range
```

### Common mistakes

```
- Advancing the list with the maximum instead of the minimum.
- Forgetting to update max when pushing the new element.
```

Full JavaScript solution with tests: [05_smallest_covering_range.js](solutions/05_smallest_covering_range.js). Run it with `node solutions/05_smallest_covering_range.js` from this folder.

</details>

## Related follow-ups

- Return the range that covers at least m of the k lists
- Lists are huge streams
- Same problem with a single array of (value, list id) pairs and a classic sliding window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
