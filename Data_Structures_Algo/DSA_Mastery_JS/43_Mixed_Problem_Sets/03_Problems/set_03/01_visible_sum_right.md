# Visible Sum to the Right

| | |
|---|---|
| **Set** | [Mixed Set 03](README.md) — problem 01 of 5 |
| **Difficulty** | Medium |
| **Time box** | 20 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [01_visible_sum_right.js](solutions/01_visible_sum_right.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

Buildings stand in a row with heights `heights`. A person on top of building i looks to
the right. Their view is blocked by the first building j > i with
heights[j] >= heights[i]; they see every building strictly between i and j (or all
buildings to the end if nothing blocks). Return an array ans where ans[i] is the SUM
of heights of the buildings person i can see.

## Examples

```
Input: [5, 2, 3, 6, 1]   Output: [5, 0, 0, 1, 0]
       Explanation: from 5 you see 2 and 3 (blocked by 6); from 2 the 3 blocks at once;
                    from 6 you see 1; the last building sees nothing
Input: [1, 1, 1]         Output: [0, 0, 0]   Explanation: equal height blocks
Input: [3, 1, 2]         Output: [3, 0, 0]
```

## Constraints & clarifying questions

```
- Up to 10^5 buildings -> O(n^2) is too slow.
- Does an equal-height building block? (yes, >=)
- Heights positive integers; sums fit in a JS number.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Monotonic stack (next greater-or-equal) + prefix sums. See [Monotonic Stacks & Queues](../../../18_Monotonic_Stacks_And_Queues/README.md) and [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: from each building walk right, adding heights until a building as tall or taller.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Find the blocker index for every building in one pass with a stack of decreasing heights. Then the visible sum is a range sum: pre[blocker] − pre[i+1].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array -> []
- strictly increasing -> all zeros
- strictly decreasing -> each sees everything to its right
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) extra space

```
For each i walk right adding heights until a building >= heights[i].
```

### APPROACH 2 — Optimal (monotonic stack for "next greater-or-equal" + prefix sums)   O(n) time, O(n) space

```
1. next[i] = index of the first j > i with heights[j] >= heights[i] (or n). A stack of
   indices with strictly decreasing heights finds all of these in one pass: when a new
   building is >= the top, it is the blocker for the top, so pop and record.
2. pre[x] = sum of heights[0..x-1]. Then ans[i] = pre[next[i]] - pre[i + 1].

Dry run on [5, 2, 3, 6, 1]:
  j=0 h=5 stack [] -> push            stack [0]
  j=1 h=2 < 5 -> push                 stack [0,1]
  j=2 h=3 >= 2 pop 1 (next[1]=2); 3 < 5 push   stack [0,2]
  j=3 h=6 pop 2 (next[2]=3), pop 0 (next[0]=3) stack [3]
  j=4 h=1 push                        stack [3,4]; leftovers next=5
  pre = [0,5,7,10,16,17]
  ans[0] = pre[3]-pre[1] = 5, ans[1] = pre[2]-pre[2] = 0, ans[2] = 0,
  ans[3] = pre[5]-pre[4] = 1, ans[4] = 0
```

### Edge cases

```
- empty array -> []
- strictly increasing -> all zeros
- strictly decreasing -> each sees everything to its right
```

### Common mistakes

```
- Using > instead of >= when popping: equal heights would not block.
- Off-by-one in the prefix difference: the blocker itself is NOT seen.
```

Full JavaScript solution with tests: [01_visible_sum_right.js](solutions/01_visible_sum_right.js). Run it with `node solutions/01_visible_sum_right.js` from this folder.

</details>

## Related follow-ups

- Count visible buildings instead of summing
- Look in both directions
- Strictly taller blocks (change >= to >)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
