# Next Greater Element I & II

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Easy |
| **Pattern** | monotonic stack (circular) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #496 — https://leetcode.com/problems/next-greater-element-i/; LeetCode #503 — https://leetcode.com/problems/next-greater-element-ii/ |
| **Solution file** | [06_next_greater_element.js](../solutions/06_next_greater_element.js) — open only after a real attempt |

## Problem

Part I (496): nums1 is a subset of nums2 (no duplicates). For each x in nums1,
find the first element to the RIGHT of x in nums2 that is greater than x, or -1.

Part II (503): a single CIRCULAR array. For each element, find the next greater
element going right and wrapping around to the start, or -1.

## Examples

```
I:  nums1 = [4,1,2], nums2 = [1,3,4,2]   Output: [-1,3,-1]
    4 has nothing greater after it; 1 -> 3; 2 is last -> -1
II: nums = [1,2,1]                      Output: [2,-1,2]
    the last 1 wraps around to find 2
```

## Constraints & clarifying questions

```
- Part I: are values unique? (yes -> we can key a Map by value)
- Part II: "next" means the first greater element going right, with wrap-around?
- Strictly greater? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *monotonic stack (circular)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n*m) / O(n^2) time. For each element scan rightwards (with wrap for part II) until something greater appears.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (monotonic decreasing stack)   O(n) time, O(n) space. Part I: walk nums2 once with a decreasing stack.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- decreasing array -> all -1 (part I) / the max is -1 and the rest find the max (part II)
- all equal -> all -1
- single element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n*m) / O(n^2) time

```
For each element scan rightwards (with wrap for part II) until something
greater appears.
```

### APPROACH 2 — Optimal (monotonic decreasing stack)   O(n) time, O(n) space

```
Part I: walk nums2 once with a decreasing stack. When nums2[i] is greater
than the top, the top's next greater is nums2[i]: record it in a Map
(value -> answer). Then answer nums1 by lookup.

Part II: same stack of INDICES, but loop i from 0 to 2n-1 and use i % n.
The second lap lets elements near the end "see" elements at the start.
Only push indices during the first lap (second lap only resolves).

Dry run (II) on [1,2,1], n=3, i = 0..5:
  i=0 (1)  push 0          stack [0]
  i=1 (2)  2>1 pop 0 ans[0]=2 ; push 1   stack [1]
  i=2 (1)  push 2          stack [1,2]
  i=3 (1)  not greater than 1 (top is index 2, value 1) -> nothing
  i=4 (2)  2>1 pop 2 ans[2]=2 ; 2>2? no  stack [1]
  i=5 (1)  nothing
  ans = [2,-1,2]
```

### Edge cases

```
- decreasing array -> all -1 (part I) / the max is -1 and the rest find the max (part II)
- all equal -> all -1
- single element
```

Full JavaScript solution with tests: [06_next_greater_element.js](../solutions/06_next_greater_element.js). Run it with `node 06_next_greater_element.js` from the solutions folder.

</details>

## Common mistakes

- For the circular version, pushing indices on the second pass (only resolve, do not push again).
- Building the answer map from the wrong array in version I (nums2 vs nums1).
- Using value equality when there may be duplicates in the circular version (store indices).

## Related follow-ups

- [Daily Temperatures](../02_Medium/05_daily_temperatures.md)
- [Online Stock Span](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/01_online_stock_span.md) (18_Monotonic_Stacks_And_Queues)
- Next Greater Element III (LeetCode #556)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
