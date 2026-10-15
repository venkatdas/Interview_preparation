# Merge Triplets to Form Target Triplet

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | filter then check |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1899 — https://leetcode.com/problems/merge-triplets-to-form-target-triplet/ |
| **Solution file** | [13_merge_triplets.js](../solutions/13_merge_triplets.js) — open only after a real attempt |

## Problem

You have triplets [a,b,c] and a target [x,y,z]. In one operation pick two triplets i, j
and replace triplet j with [max(ai,aj), max(bi,bj), max(ci,cj)]. Any number of operations.
Return true if target can be produced.

## Examples

```
Input: triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]   Output: true
  Explanation: merge [2,5,3] and [1,7,5] -> [2,7,5]
Input: triplets = [[3,4,5],[4,5,6]], target = [3,2,5]             Output: false
```

## Constraints & clarifying questions

```
- Can we use a triplet more than once? (irrelevant - max is idempotent)
- Can we use zero operations (target already present)? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *filter then check* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n * 3) time. Try every subset of triplets, take the position-wise max, compare with target.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (filter, then check coverage)   O(n) time, O(1) space. A triplet with ANY value bigger than the target's is poison: max can never shrink it.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- target itself is in the list -> true
- no triplet is safe -> false
- safe triplets but one position never reaches the target -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n * 3) time

```
Try every subset of triplets, take the position-wise max, compare with target.
```

### APPROACH 2 — Optimal (filter, then check coverage)   O(n) time, O(1) space

```
A triplet with ANY value bigger than the target's is poison: max can never shrink it.
Throw those away. Of the survivors, merge them ALL (taking max can only help). Target is
reachable iff each of the three positions is hit exactly by some survivor.
```

### WHY GREEDY WORKS

```
Merging is a max, so adding a "safe" triplet (all values <= target) never pushes any
position above the target. So including every safe triplet is never worse than including
a subset. The question collapses to: for each position, does some safe triplet equal the
target there?

Dry run on [[2,5,3],[1,8,4],[1,7,5]], target [2,7,5]:
  [2,5,3] safe -> hits position 0 (2)
  [1,8,4] 8 > 7 -> skip
  [1,7,5] safe -> hits positions 1 (7) and 2 (5)
  all three positions hit -> true
```

### Edge cases

```
- target itself is in the list -> true
- no triplet is safe -> false
- safe triplets but one position never reaches the target -> false
```

Full JavaScript solution with tests: [13_merge_triplets.js](../solutions/13_merge_triplets.js). Run it with `node 13_merge_triplets.js` from the solutions folder.

</details>

## Common mistakes

- Merging a triplet that has ANY value larger than the target - one bad merge can never be undone because merge takes the max.
- Requiring a single triplet to match the target exactly; the three positions can come from different triplets.
- Returning true when only two of the three target values were reached.

## Related follow-ups

- [Assign Cookies](../01_Easy/01_assign_cookies.md)
- [Partition Labels](../02_Medium/09_partition_labels.md)
- Largest Number (LeetCode #179)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
