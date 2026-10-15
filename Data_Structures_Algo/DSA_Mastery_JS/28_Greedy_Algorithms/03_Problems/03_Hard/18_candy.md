# Candy

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Hard |
| **Pattern** | two-pass greedy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #135 — https://leetcode.com/problems/candy/ |
| **Solution file** | [18_candy.js](../solutions/18_candy.js) — open only after a real attempt |

## Problem

Children stand in a line with ratings. Each child gets at least 1 candy, and a child with
a higher rating than an immediate neighbour must get more candy than that neighbour.
Return the minimum total candies.

## Examples

```
Input: [1,0,2]     Output: 5   Explanation: candies 2,1,2
Input: [1,2,2]     Output: 4   Explanation: candies 1,2,1 (equal ratings need no relation)
Input: [1,3,4,5,2] Output: 11  Explanation: 1,2,3,4,1
```

## Constraints & clarifying questions

```
- Equal neighbours: any constraint? (no)
- Ratings can be any integers? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-pass greedy* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. Start everyone at 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two greedy passes)   O(n) time, O(n) space. Pass left-to-right: if rating[i] > rating[i-1], candy[i] = candy[i-1] + 1 (else 1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single child -> 1
- all equal -> n
- strictly decreasing [5,4,3] -> 3+2+1 (right pass does all the work)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
Start everyone at 1. Repeatedly scan: if a child's rating is higher than a neighbour's but
candy is not higher, bump their candy to neighbour + 1. Repeat until no change.
Each pass fixes at least one child; at most n passes.
```

### APPROACH 2 — Optimal (two greedy passes)   O(n) time, O(n) space

```
Pass left-to-right: if rating[i] > rating[i-1], candy[i] = candy[i-1] + 1 (else 1).
This satisfies every "left neighbour" rule with the fewest candies.
Pass right-to-left: if rating[i] > rating[i+1], candy[i] = max(candy[i], candy[i+1] + 1).
The max keeps the left rule true while fixing the right rule.
```

### WHY GREEDY WORKS

```
Each pass independently computes the minimum candies forced by one direction: a rising run
of length L forces 1,2,...,L and nothing less works. Taking the max of the two minimums is
the smallest value satisfying both constraints at once, and raising a value to the max never
breaks the other direction (the other direction only required it to be at least something
smaller). So the result is feasible and pointwise minimal, hence minimal in total.

Dry run on [1,0,2]:
  left pass : [1,1,2]   (0 is not > 1 -> 1;  2 > 0 -> 1+1)
  right pass: i=1: 0 > 2? no.  i=0: 1 > 0 -> max(1, 1+1)=2  -> [2,1,2] -> 5
```

### Edge cases

```
- single child -> 1
- all equal -> n
- strictly decreasing [5,4,3] -> 3+2+1 (right pass does all the work)
```

Full JavaScript solution with tests: [18_candy.js](../solutions/18_candy.js). Run it with `node 18_candy.js` from the solutions folder.

</details>

## Common mistakes

- Doing only a left-to-right pass; a decreasing run (like 3, 2, 1) needs the right-to-left pass too.
- In the second pass overwriting with `right + 1` instead of `max(current, right + 1)`, which breaks the left rule.
- Giving extra candy to equal neighbours - equal ratings have no constraint between them.

## Related follow-ups

- Trapping Rain Water (LeetCode #42) - same two-pass idea
- Product of Array Except Self (LeetCode #238)
- [Queue Reconstruction by Height](../02_Medium/16_queue_reconstruction_by_height.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
