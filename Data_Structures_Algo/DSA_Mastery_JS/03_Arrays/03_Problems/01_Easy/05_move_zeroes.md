# Move Zeroes

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | write pointer / in-place swap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #283 — https://leetcode.com/problems/move-zeroes/ |
| **Solution file** | [05_move_zeroes.js](../solutions/05_move_zeroes.js) — open only after a real attempt |

## Problem

Given an integer array, move all 0s to the end while keeping the relative order of
the non-zero elements. Do it in place (no copy of the array).

## Examples

```
Input: [0, 1, 0, 3, 12]   Output: [1, 3, 12, 0, 0]
Input: [0]                Output: [0]
```

## Constraints & clarifying questions

```
- In place, O(1) extra space? (yes)
- Must the order of non-zero elements stay the same? (yes - that rules out a simple swap-with-end)
- Should I return the array or nothing? (LeetCode: nothing; we return it for easy testing)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *write pointer / in-place swap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Copy all non-zero elements into a new array, then append zeros until the length matches, then copy back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (write pointer / in-place swap)   O(n) time, O(1) space. Keep `writeIndex` = the next slot that should hold a non-zero value.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- No zeros -> every element swaps with itself, array unchanged
- All zeros
- Zeros already at the end
- Empty array
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Copy all non-zero elements into a new array, then append zeros until the length
matches, then copy back. Correct but uses extra memory.
```

### APPROACH 2 — Optimal (write pointer / in-place swap)   O(n) time, O(1) space

```
Keep `writeIndex` = the next slot that should hold a non-zero value. Scan with
`readIndex`. Whenever you see a non-zero, swap it into `writeIndex` and advance
`writeIndex`. Everything before writeIndex is finished; zeros naturally drift right.

Dry run on [0, 1, 0, 3, 12]:
  read 0: value 0   skip                       write=0
  read 1: value 1   swap(0,1) -> [1,0,0,3,12]  write=1
  read 2: value 0   skip
  read 3: value 3   swap(1,3) -> [1,3,0,0,12]  write=2
  read 4: value 12  swap(2,4) -> [1,3,12,0,0]  write=3   done
```

### Edge cases

```
- No zeros -> every element swaps with itself, array unchanged
- All zeros
- Zeros already at the end
- Empty array
```

Full JavaScript solution with tests: [05_move_zeroes.js](../solutions/05_move_zeroes.js). Run it with `node 05_move_zeroes.js` from the solutions folder.

</details>

## Common mistakes

- Removing zeros with `splice` inside a loop, which is O(n^2) and skips elements because indices shift.
- Building a new array and returning it when the problem requires in-place modification.
- Swapping when the read and write pointers are equal is harmless, but forgetting to advance the write pointer only on non-zeros breaks the order.

## Related follow-ups

- [Move Zeroes (Two Pointers)](../../../06_Two_Pointers/03_Problems/01_Easy/05_move_zeroes.md) — the same problem framed as a pointer pattern
- [Remove Element](../../../06_Two_Pointers/03_Problems/01_Easy/04_remove_element.md) — identical write-pointer template
- [Sort Colors](../02_Medium/13_sort_colors.md) — three-way partition instead of two-way

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
