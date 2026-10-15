# Partition Labels

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | last-index + expanding end |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #763 — https://leetcode.com/problems/partition-labels/ |
| **Solution file** | [18_partition_labels.js](../solutions/18_partition_labels.js) — open only after a real attempt |

## Problem

Given a string s, split it into as many parts as possible so that each letter appears
in at most one part. Return the sizes of the parts, in order.

## Examples

```
Input: "ababcbacadefegdehijhklij"   Output: [9, 7, 8]
  Explanation: "ababcbaca" | "defegde" | "hijhklij"
Input: "eccbbbbdec"                 Output: [10]
```

## Constraints & clarifying questions

```
- Lowercase letters only? (yes -> array of 26 last indices)
- Maximise the NUMBER of parts? (yes: cut as early as legally possible)
- Parts must be contiguous and cover the whole string? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *last-index + expanding end* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Start a part at index `start`.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (last-index map + expanding end pointer)   O(n) time, O(1) space (26 slots). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single character -> [1]
- All unique letters -> each its own part: "abc" -> [1, 1, 1]
- Same letter at both ends -> one part
- Empty -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Start a part at index `start`. Extend `end` while any letter in s[start..end] still
occurs after `end` (check with lastIndexOf each time). Each check can scan the string.
```

### APPROACH 2 — Optimal (last-index map + expanding end pointer)   O(n) time, O(1) space (26 slots)

```
1. Precompute lastIndex[ch] = last position of each letter.
  2. Walk with i. Keep `partEnd` = the farthest last-index of any letter seen in the
     current part. Every letter in the part forces the part to extend to at least its
     last occurrence, so partEnd = max(partEnd, lastIndex[s[i]]).
  3. When i === partEnd, nothing in the part appears later -> cut here, record the size.
Two pointers: `partStart` (fixed until a cut) and `i` (scanning), with `partEnd` as a
moving boundary. Same spirit as merging intervals.

Dry run on "ababcbacadefegdehijhklij":
  lastIndex: a->8, b->5, c->7, d->14, e->15, f->11, g->13, h->19, i->22, j->23, k->20, l->21
  i=0 'a' partEnd=8 ... i=4 'c' partEnd=max(8,7)=8 ... i=8 == partEnd -> part [0,8] size 9
  i=9 'd' partEnd=14, 'e' 15, 'f' 15, 'e', 'g' 15, 'd', 'e' i=15 == partEnd -> size 7
  i=16 'h' 19, 'i' 22, 'j' 23, ..., i=23 -> size 8
  [9, 7, 8]
```

### Edge cases

```
- Single character -> [1]
- All unique letters -> each its own part: "abc" -> [1, 1, 1]
- Same letter at both ends -> one part
- Empty -> []
```

Full JavaScript solution with tests: [18_partition_labels.js](../solutions/18_partition_labels.js). Run it with `node 18_partition_labels.js` from the solutions folder.

</details>

## Common mistakes

- Closing a part when you reach the last occurrence of the *current* character only; the part ends at the max last occurrence of all characters seen so far.
- Returning the parts themselves instead of their sizes.
- Computing last occurrences inside the main loop (O(n^2)).

## Related follow-ups

- [Merge Intervals](../../../11_Sorting/03_Problems/02_Medium/03_merge_intervals.md) — each letter is an interval; parts are merged intervals
- [Jump Game II](../../../28_Greedy_Algorithms/03_Problems/02_Medium/06_jump_game_ii.md) — the same "extend the current reach" greedy
- [Boats to Save People](17_boats_to_save_people.md) — greedy with two pointers

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
