# Reorganize String

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | greedy max-heap, hold previous |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #767 — https://leetcode.com/problems/reorganize-string/ |
| **Solution file** | [10_reorganize_string.js](../solutions/10_reorganize_string.js) — open only after a real attempt |

## Problem

Rearrange the characters of s so that no two adjacent characters are the
same. Return any valid arrangement, or "" if impossible.

## Examples

```
Input: "aab"    Output: "aba"
Input: "aaab"   Output: ""      Explanation: three a's need at least two separators
Input: "vvvlo"  Output: "vlvov" (any valid answer accepted)
```

## Constraints & clarifying questions

```
- Lowercase only? (yes) Length? (<= 500)
- Any valid answer accepted? (yes -> we only test validity)
- When is it impossible? maxCount > ceil(n / 2)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *greedy max-heap, hold previous* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort by count, fill even then odd slots)   O(n log n) time, O(n) space. Count letters, sort letters by count descending, then write them into positions 0,2,4,...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (greedy with max-heap)   O(n log 26) time, O(26) space. Always place the letter with the MOST remaining count, except we cannot reuse the letter we just placed.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single character -> itself
- two same characters "aa" -> ""
- all distinct -> any permutation
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort by count, fill even then odd slots)   O(n log n) time, O(n) space

```
Count letters, sort letters by count descending, then write them into
positions 0,2,4,... then 1,3,5,... The most frequent letter spreads out
first. Works, but the "why" is less obvious than the greedy below.
```

### APPROACH 2 — Optimal (greedy with max-heap)   O(n log 26) time, O(26) space

```
Always place the letter with the MOST remaining count, except we cannot
reuse the letter we just placed. So:
  pop the most frequent letter -> append it
  keep the PREVIOUS letter out of the heap for one step, then push it back
  (if its count is still > 0)
If the heap is empty while a letter is still waiting with count > 0, we are
stuck -> return "".

Dry run on "aab":
  counts a:2 b:1   heap = {a2, b1}, prev = none
  pop a2 -> "a", a->1; push prev(none); prev = a1
  pop b1 -> "ab", b->0; push prev a1; prev = b0
  pop a1 -> "aba", a->0; prev b0 has 0 so not pushed; prev = a0
  heap empty, prev count 0 -> done: "aba"
Dry run on "aaab":
  pop a3 -> "a", prev=a2; pop b1 -> "ab", push a2, prev=b0;
  pop a2 -> "aba", prev=a1; heap empty but prev a1 > 0 -> ""
```

### Edge cases

```
- single character -> itself
- two same characters "aa" -> ""
- all distinct -> any permutation
```

Full JavaScript solution with tests: [10_reorganize_string.js](../solutions/10_reorganize_string.js). Run it with `node 10_reorganize_string.js` from the solutions folder.

</details>

## Common mistakes

- Not checking early that the most frequent char appears at most `ceil(n / 2)` times.
- Pushing the just-used char back immediately, so it can be picked twice in a row.
- Returning a partial string instead of `""` when impossible.

## Related follow-ups

- [Task Scheduler](09_task_scheduler.md)
- Distant Barcodes (LeetCode #1054)
- Longest Happy String (LeetCode #1405)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
