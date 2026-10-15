# Relative Sort Array

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Easy |
| **Pattern** | counting sort |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1122 — https://leetcode.com/problems/relative-sort-array/ |
| **Solution file** | [08_relative_sort_array.js](../solutions/08_relative_sort_array.js) — open only after a real attempt |

## Problem

Given arr1 and arr2 (arr2 has distinct values, all of which appear in arr1), sort
arr1 so that its elements follow the relative order of arr2. Elements not in arr2
go at the end in ascending order.

## Examples

```
Input: arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]
Output: [2,2,2,1,4,3,3,9,6,7,19]
Input: arr1 = [28,6,22,8,44,17], arr2 = [22,28,8,6]   Output: [22,28,8,6,17,44]
```

## Constraints & clarifying questions

```
- Values 0..1000 (small range -> counting sort is natural)
- arr2 distinct and a subset of arr1's values? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting sort* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (custom comparator)   O(n log n) time. Build a Map value -> position in arr2.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (counting sort)   O(n + m + k) time, O(k) space  (k = 1001). Count every value of arr1 in a counts array of size 1001.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- arr2 empty -> plain ascending sort of arr1
- all of arr1 in arr2 -> no leftovers
- duplicates in arr1 (handled by counts)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (custom comparator)   O(n log n) time

```
Build a Map value -> position in arr2. Sort arr1 with: both in arr2 -> compare
positions; one in arr2 -> it goes first; neither -> compare values. Clean and fine.
```

### APPROACH 2 — Optimal (counting sort)   O(n + m + k) time, O(k) space  (k = 1001)

```
Count every value of arr1 in a counts array of size 1001. Then:
  1. for each value in arr2 order, emit it counts[value] times and zero the count
  2. for value from 0..1000, emit whatever counts are left (these are the "others",
     and walking the index ascending sorts them for free)

Dry run arr1=[2,3,1,3,2,4,6,7,9,2,19], arr2=[2,1,4,3,9,6]:
  counts: 1:1 2:3 3:2 4:1 6:1 7:1 9:1 19:1
  emit arr2 order: 2,2,2 | 1 | 4 | 3,3 | 9 | 6
  leftovers ascending: 7, 19
  -> [2,2,2,1,4,3,3,9,6,7,19]
```

### Edge cases

```
- arr2 empty -> plain ascending sort of arr1
- all of arr1 in arr2 -> no leftovers
- duplicates in arr1 (handled by counts)
```

Full JavaScript solution with tests: [08_relative_sort_array.js](../solutions/08_relative_sort_array.js). Run it with `node 08_relative_sort_array.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that elements not in arr2 go at the end in *ascending* order.
- Using `arr2.indexOf` inside the comparator (O(m) per comparison); precompute a rank map.
- Mutating arr2 or assuming arr1 has no duplicates.

## Related follow-ups

- [Sort Characters By Frequency](../02_Medium/07_sort_characters_by_frequency.md) — sort by a derived key
- [Sort Colors](../02_Medium/02_sort_colors.md) — counting sort with a tiny alphabet
- Custom Sort String (LeetCode #791) — the string version of the same idea

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
