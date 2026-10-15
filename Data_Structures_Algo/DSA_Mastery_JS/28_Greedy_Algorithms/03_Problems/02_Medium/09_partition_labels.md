# Partition Labels

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | farthest last occurrence |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #763 — https://leetcode.com/problems/partition-labels/ |
| **Solution file** | [09_partition_labels.js](../solutions/09_partition_labels.js) — open only after a real attempt |

## Problem

Split string s into as many parts as possible so that each letter appears in at most one
part. Return the sizes of the parts, in order.

## Examples

```
Input: "ababcbacadefegdehijhklij"   Output: [9,7,8]
  Explanation: "ababcbaca" | "defegde" | "hijhklij"
Input: "eccbbbbdec"                 Output: [10]
```

## Constraints & clarifying questions

```
- Only lowercase letters? (yes)
- Must the parts, concatenated, give back s? (yes, contiguous parts)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *farthest last occurrence* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(26) space. For each possible cut position, check that no letter on the left also appears on the right (two sets).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (farthest last occurrence)   O(n) time, O(26) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single character -> [1]
- all same letter -> [n]
- all distinct letters -> [1,1,1,...]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(26) space

```
For each possible cut position, check that no letter on the left also appears on the
right (two sets). Cut whenever the check passes. Each check is O(n) -> O(n^2).
```

### APPROACH 2 — Optimal (farthest last occurrence)   O(n) time, O(26) space

```
1. Record the last index of every letter.
2. Scan with `partEnd` = the farthest last-index seen in the current part. A part must
   extend at least to partEnd. When i === partEnd, the part can close here, so cut.
```

### WHY GREEDY WORKS

```
Cutting at the FIRST position where it is legal can never hurt: every later legal cut
is still legal after we cut here (the right part only shrinks), and cutting earlier
gives more parts. This is the "farthest reach" idea from Jump Game applied to letters.

Dry run on "ababcbacadefegdehijhklij" (first part):
  last = { a:8, b:5, c:7, d:14, e:15, f:11, g:13, h:19, i:22, j:23, k:20, l:21 }
  i=0 'a' partEnd=8 ... i=4 'c' partEnd=max(8,7)=8 ... i=8 == partEnd -> cut, size 9
```

### Edge cases

```
- single character -> [1]
- all same letter -> [n]
- all distinct letters -> [1,1,1,...]
```

Full JavaScript solution with tests: [09_partition_labels.js](../solutions/09_partition_labels.js). Run it with `node 09_partition_labels.js` from the solutions folder.

</details>

## Common mistakes

- Cutting as soon as you see a letter for the last time - you must cut only when `i` equals the farthest last-occurrence of ALL letters seen so far.
- Returning the partition strings instead of their lengths.
- Recomputing `lastIndexOf` inside the loop (O(n²)); precompute last positions once.

## Related follow-ups

- [Jump Game](../02_Medium/05_jump_game.md)
- [Merge Intervals](../../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md)
- Optimal Partition of String (LeetCode #2405)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
