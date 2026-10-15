# Sort Colors

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | Dutch national flag |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #75 — https://leetcode.com/problems/sort-colors/ |
| **Solution file** | [02_sort_colors.js](../solutions/02_sort_colors.js) — open only after a real attempt |

## Problem

An array contains only 0s, 1s and 2s (red, white, blue). Sort it in place so all
0s come first, then 1s, then 2s. Do it in ONE pass with O(1) extra space, without
using the library sort.

## Examples

```
Input: [2,0,2,1,1,0]   Output: [0,0,1,1,2,2]
Input: [2,0,1]         Output: [0,1,2]
```

## Constraints & clarifying questions

```
- Exactly three distinct values? (yes: 0, 1, 2)
- Must be in place? (yes) One pass? (the follow-up asks for it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dutch national flag* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (counting sort, two passes)   O(n) time, O(1) space. Count the 0s, 1s, 2s, then overwrite the array: count0 zeros, count1 ones, count2 twos.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dutch National Flag, three pointers)   O(n) time, O(1) space. Keep three regions:  [0..low-1] = 0s   [low..mid-1] = 1s   [high+1..end] = 2s `mid` scans the unknown region [mid..high]: nums[mid] === 0 -> swap with nums[low], low++, mid++   (the swapped-in value was a 1 or already seen) nums[mid] === 1 -> mid++ nums[mid] =

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> []
- all one colour [1,1,1]
- already sorted; reverse sorted [2,2,1,1,0,0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (counting sort, two passes)   O(n) time, O(1) space

```
Count the 0s, 1s, 2s, then overwrite the array: count0 zeros, count1 ones, count2 twos.
Two passes, but simple and also O(n). Interviewers accept it, then ask for one pass.
```

### APPROACH 2 — Optimal (Dutch National Flag, three pointers)   O(n) time, O(1) space

```
Keep three regions:  [0..low-1] = 0s   [low..mid-1] = 1s   [high+1..end] = 2s
`mid` scans the unknown region [mid..high]:
  nums[mid] === 0 -> swap with nums[low], low++, mid++   (the swapped-in value was a 1 or already seen)
  nums[mid] === 1 -> mid++
  nums[mid] === 2 -> swap with nums[high], high--         (do NOT move mid: the new nums[mid] is unseen)
Loop while mid <= high.

Dry run [2,0,2,1,1,0]:  low=0 mid=0 high=5
  mid=0 val 2 -> swap(0,5) -> [0,0,2,1,1,2] high=4
  mid=0 val 0 -> swap(0,0) low=1 mid=1
  mid=1 val 0 -> swap(1,1) low=2 mid=2
  mid=2 val 2 -> swap(2,4) -> [0,0,1,1,2,2] high=3
  mid=2 val 1 -> mid=3
  mid=3 val 1 -> mid=4 > high=3 -> stop. Sorted.
```

### Edge cases

```
- [] -> []
- all one colour [1,1,1]
- already sorted; reverse sorted [2,2,1,1,0,0]
```

Full JavaScript solution with tests: [02_sort_colors.js](../solutions/02_sort_colors.js). Run it with `node 02_sort_colors.js` from the solutions folder.

</details>

## Common mistakes

- Advancing `mid` after swapping with `high`.
- Counting sort is two passes; the follow-up asks for one pass.
- Using `<` instead of `<=` between mid and high.

## Related follow-ups

- [Sort Colors (Arrays)](../../../03_Arrays/03_Problems/02_Medium/13_sort_colors.md) — same problem, arrays topic
- [Sort Colors (Two Pointers)](../../../06_Two_Pointers/03_Problems/02_Medium/16_sort_colors.md) — the pointer framing
- [Wiggle Sort II](11_wiggle_sort_ii.md) — three-way partition around the median

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
