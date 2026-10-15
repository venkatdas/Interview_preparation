# Capped Reading Split

| | |
|---|---|
| **Set** | [Mixed Set 02](README.md) — problem 02 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [02_capped_reading_split.js](solutions/02_capped_reading_split.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A book has chapters with page counts `pages` (in order). You must split the chapters
into AT MOST k reading days. Each day reads a contiguous block of chapters, and no day
may contain more than `cap` chapters. Minimize the largest number of pages read on
any single day. Return that minimum, or -1 if no valid split exists.

## Examples

```
Input: pages = [7, 2, 5, 10, 8], k = 2, cap = 5   Output: 18   Explanation: [7,2,5] | [10,8]
Input: pages = [7, 2, 5, 10, 8], k = 3, cap = 2   Output: 15   Explanation: [7,2] | [5,10] | [8]
Input: pages = [7, 2, 5, 10, 8], k = 2, cap = 2   Output: -1   Explanation: 5 chapters need at least 3 days
```

## Constraints & clarifying questions

```
- 1 <= pages.length <= 10^4, pages[i] >= 1, 1 <= k, 1 <= cap.
- If pages.length > k * cap the split is impossible -> -1.
- Can a day be empty? (not needed: using fewer days is allowed)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Binary search on the answer + a greedy feasibility check. See [Searching / Binary Search](../../../10_Searching/README.md) and [Greedy](../../../28_Greedy_Algorithms/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** A DP over (days used, chapters read) works but is O(n²·k).

</details>

<details><summary>Hint 3</summary>

**The key idea.** If a daily limit X works, any bigger X works. Check X greedily: pack chapters into the current day while both limits hold.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n > k * cap                      -> -1
- k >= n and cap >= 1              -> max(pages) (one chapter per day)
- single chapter                   -> that chapter
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * k) time, O(n * k) space

```
DP: best[d][i] = minimum possible max-day for the first i chapters using d days,
trying every legal size (1..cap) for the last day.
```

### APPROACH 2 — Optimal (binary search on the answer + greedy check)   O(n log(sum)) time, O(1) space

```
If a max-day limit X works, any larger X also works (monotonic) -> binary search X in
[max(pages), sum(pages)]. To check X, greedily pack chapters into the current day while
both "pages <= X" and "chapters <= cap" hold; otherwise start a new day. Greedy packing
uses the fewest days possible, so X is feasible iff days <= k.

Dry run on pages = [7, 2, 5, 10, 8], k = 2, cap = 5:
  lo=10, hi=32
  X=21: [7,2,5] (14, +10 would be 24) | [10,8] -> 2 days ok  -> hi=21
  X=15: [7,2,5] | [10] | [8] -> 3 days      -> lo=16
  X=18: [7,2,5] | [10,8] -> 2 days ok       -> hi=18
  X=16: [7,2,5] | [10] | [8] -> 3           -> lo=17
  X=17: 3 days                              -> lo=18
  answer 18
```

### Edge cases

```
- n > k * cap                      -> -1
- k >= n and cap >= 1              -> max(pages) (one chapter per day)
- single chapter                   -> that chapter
```

### Common mistakes

```
- Forgetting the cap inside the greedy check (the classic version has no cap).
- Starting lo at 0 or 1 instead of max(pages): the check then has to handle a chapter
  that never fits.
```

Full JavaScript solution with tests: [02_capped_reading_split.js](solutions/02_capped_reading_split.js). Run it with `node solutions/02_capped_reading_split.js` from this folder.

</details>

## Related follow-ups

- No cap (classic "split array largest sum")
- Each day also has a minimum number of chapters
- Minimize the number of days for a fixed limit

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
