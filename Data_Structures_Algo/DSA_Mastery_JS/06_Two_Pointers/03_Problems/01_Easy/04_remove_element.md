# Remove Element

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | read / write |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #27 — https://leetcode.com/problems/remove-element/ |
| **Solution file** | [04_remove_element.js](../solutions/04_remove_element.js) — open only after a real attempt |

## Problem

Given an array nums and a value val, remove all occurrences of val IN PLACE and return
the number k of remaining elements. The first k slots of nums must hold the kept
elements (order may change on LeetCode, but we preserve it anyway).

## Examples

```
Input: nums = [3, 2, 2, 3], val = 3            Output: 2, nums = [2, 2, _, _]
Input: nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2 Output: 5, nums = [0, 1, 3, 0, 4, _, _, _]
```

## Constraints & clarifying questions

```
- Can I use extra space? (no, that's the point)
- Does the order of kept elements matter? (not on LeetCode; read/write keeps it anyway)
- What goes in the slots after k? (anything)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *read / write* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (splice)   O(n^2) time, O(1) space. Walk the array; whenever nums[i] === val, splice it out.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (read / write pointers)   O(n) time, O(1) space. `read` scans every element.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- val not present -> return n, array unchanged
- every element is val -> return 0
- empty array -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (splice)   O(n^2) time, O(1) space

```
Walk the array; whenever nums[i] === val, splice it out. Each splice shifts the tail: O(n).
```

### APPROACH 2 — Optimal (read / write pointers)   O(n) time, O(1) space

```
`read` scans every element. `write` points at the next free slot of the output.
If nums[read] !== val, copy it to nums[write] and advance write.
Invariant: nums[0..write-1] holds every kept element seen so far, in order.
write <= read always, so we never overwrite an element we haven't read yet.

Dry run on [3, 2, 2, 3], val = 3:
  read=0 3 skip                 write=0
  read=1 2 nums[0]=2            write=1   [2, 2, 2, 3]
  read=2 2 nums[1]=2            write=2   [2, 2, 2, 3]
  read=3 3 skip                 write=2
  return 2
```

### Edge cases

```
- val not present -> return n, array unchanged
- every element is val -> return 0
- empty array -> 0
```

Full JavaScript solution with tests: [04_remove_element.js](../solutions/04_remove_element.js). Run it with `node 04_remove_element.js` from the solutions folder.

</details>

## Common mistakes

- Using `splice` in a forward loop, which skips the element after each removal.
- Returning the array instead of the new length k.
- Assuming the elements beyond k must be cleared; they can be anything.

## Related follow-ups

- [Move Zeroes](05_move_zeroes.md) — same write pointer, keep removed items at the end
- [Remove Duplicates from Sorted Array](../../../03_Arrays/03_Problems/01_Easy/06_remove_duplicates_from_sorted_array.md) — compaction by a different rule
- [Remove Duplicates from Sorted Array II](../02_Medium/06_remove_duplicates_sorted_array_ii.md) — allow up to two copies

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
