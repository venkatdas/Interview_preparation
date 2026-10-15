# Wiggle Sort II

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | sort + interleave (virtual indexing) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #324 — https://leetcode.com/problems/wiggle-sort-ii/ |
| **Solution file** | [11_wiggle_sort_ii.js](../solutions/11_wiggle_sort_ii.js) — open only after a real attempt |

## Problem

Reorder the array in place so that nums[0] < nums[1] > nums[2] < nums[3] > ...
(strict inequalities). You may assume a valid answer always exists.

## Examples

```
Input: [1,5,1,1,6,4]   Output: [1,6,1,5,1,4]  (or [1,4,1,5,1,6], any valid wiggle)
Input: [1,3,2,2,3,1]   Output: [2,3,1,3,1,2]
```

## Constraints & clarifying questions

```
- Strict < and > (so duplicates are the tricky part: [4,5,5,6] works, [5,5,5] cannot)
- Multiple valid outputs; the checker only validates the wiggle property
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + interleave (virtual indexing)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (try permutations)   O(n! * n). Generate permutations until one wiggles.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort, split in half, interleave from the BACK)   O(n log n) time, O(n) space. Sort ascending.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] and [x] -> unchanged (trivially valid)
- n odd: the smaller half gets the extra element (ceil(n/2) evens)
- many duplicates [4,5,5,6] -> [5,6,4,5]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (try permutations)   O(n! * n)

```
Generate permutations until one wiggles. Only sane for n <= 7; used here to
confirm an answer exists on tiny inputs.
```

### APPROACH 2 — Optimal (sort, split in half, interleave from the BACK)   O(n log n) time, O(n) space

```
Sort ascending. The smaller half goes to even indices, the larger half to odd indices.
To keep duplicates from meeting (e.g. [1,2,2,3] -> halves [1,2] [2,3] -> naive
interleave gives 1,2,2,3: a tie at positions 1,2), fill BOTH halves in REVERSE:
even positions get the smaller half from its largest element down, odd positions
get the larger half from its largest down. The equal "middle" elements end up as far
apart as possible.
(The O(n) time / O(1) space solution uses quickselect for the median + virtual
indexing + three-way partition; it is a famous trick but rarely expected.)

Dry run [1,5,1,1,6,4]: sorted [1,1,1,4,5,6], small = [1,1,1], large = [4,5,6]
  even indices 0,2,4 <- small reversed: 1,1,1
  odd  indices 1,3,5 <- large reversed: 6,5,4
  result [1,6,1,5,1,4]  checks: 1<6>1<5>1<4  ok

Dry run [1,2,2,3]: sorted, small=[1,2] large=[2,3]
  even <- 2,1 ; odd <- 3,2  -> [2,3,1,2]: 2<3>1<2 ok (naive order would give 1,2,2,3 fail)
```

### Edge cases

```
- [] and [x] -> unchanged (trivially valid)
- n odd: the smaller half gets the extra element (ceil(n/2) evens)
- many duplicates [4,5,5,6] -> [5,6,4,5]
```

Full JavaScript solution with tests: [11_wiggle_sort_ii.js](../solutions/11_wiggle_sort_ii.js). Run it with `node 11_wiggle_sort_ii.js` from the solutions folder.

</details>

## Common mistakes

- Filling small values first from the front, which can put equal median values next to each other; fill from the back of each half.
- Using the O(n log n) sort version and claiming O(n).
- Confusing it with Wiggle Sort I, which allows equality (<=).

## Related follow-ups

- Wiggle Sort (LeetCode #280) — the easier non-strict version
- [Kth Largest Element in an Array](04_kth_largest_element.md) — find the median with quickselect
- [Sort Colors](02_sort_colors.md) — the three-way partition used here

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
