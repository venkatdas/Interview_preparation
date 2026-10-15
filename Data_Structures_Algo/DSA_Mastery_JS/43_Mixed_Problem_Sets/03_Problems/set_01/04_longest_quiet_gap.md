# Longest Quiet Gap

| | |
|---|---|
| **Set** | [Mixed Set 01](README.md) — problem 04 of 5 |
| **Difficulty** | Easy |
| **Time box** | 15 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [04_longest_quiet_gap.js](solutions/04_longest_quiet_gap.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

Two servers each log the times (integers) at which they sent an alert. Each log is
already sorted in non-decreasing order. Looking at both logs together as one
timeline, return the longest gap between two consecutive alerts.
If the combined timeline has fewer than 2 alerts, return 0.

## Examples

```
Input: a = [1, 10], b = [4, 5]          Output: 5   Explanation: timeline 1,4,5,10 -> gaps 3,1,5
Input: a = [], b = [7]                  Output: 0
Input: a = [2, 2, 3], b = []            Output: 1
```

## Constraints & clarifying questions

```
- Both inputs sorted? (yes) Can they contain equal times? (yes, gap 0)
- Up to 10^5 entries each. Can I mutate the inputs? (prefer not)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 15 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Two pointers (the merge step of merge sort) + a running maximum. See [Two Pointers](../../../06_Two_Pointers/README.md) and [Sorting](../../../11_Sorting/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: concatenate, sort with a numeric comparator, scan neighbours.

</details>

<details><summary>Hint 3</summary>

**The key idea.** You never need the merged array, only the previous value taken from either list.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- both empty / one alert total   -> 0
- one list empty                 -> just the gaps inside the other
- duplicates                     -> gap 0 does not break anything
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((n + m) log(n + m)) time, O(n + m) space

```
Concatenate, sort, scan neighbouring pairs.
```

### APPROACH 2 — Optimal (two-pointer merge + running max)   O(n + m) time, O(1) space

```
Walk both arrays with pointers i and j like the merge step of merge sort. Each step
takes the smaller head; compare it with the previous timestamp taken and update the
best gap. No merged array is ever built.

Dry run on a = [1, 10], b = [4, 5]:
  take a[0]=1   prev=null           prev=1
  take b[0]=4   gap 3   best=3      prev=4
  take b[1]=5   gap 1   best=3      prev=5
  take a[1]=10  gap 5   best=5      prev=10
  answer 5
```

### Edge cases

```
- both empty / one alert total   -> 0
- one list empty                 -> just the gaps inside the other
- duplicates                     -> gap 0 does not break anything
```

### Common mistakes

```
- Computing the best gap inside each array separately: misses gaps that span both.
- Using `a.concat(b).sort()` without a comparator: JS sorts numbers as strings.
```

Full JavaScript solution with tests: [04_longest_quiet_gap.js](solutions/04_longest_quiet_gap.js). Run it with `node solutions/04_longest_quiet_gap.js` from this folder.

</details>

## Related follow-ups

- Three or k sorted logs (use a heap)
- Return the longest gap that lies strictly inside both servers' active ranges
- Logs arrive as streams

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
