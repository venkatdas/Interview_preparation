# IPO

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Hard |
| **Pattern** | two heaps (unlock then pick) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #502 — https://leetcode.com/problems/ipo/ |
| **Solution file** | [14_ipo.js](../solutions/14_ipo.js) — open only after a real attempt |

## Problem

You have capital w and can do at most k projects. Project i needs at least
capital[i] to start and adds profits[i] to your capital when done (profit is
pure gain; the capital is not spent). Return the maximum capital after at
most k projects.

## Examples

```
Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]   Output: 4
  Explanation: with 0 only project 0 is allowed (+1 -> 1); now projects 1 and 2 are
  allowed, pick profit 3 -> 4
Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]   Output: 6
```

## Constraints & clarifying questions

```
- Each project at most once? (yes)
- Does capital get consumed? (no, it is only a requirement)
- n up to 10^5, k up to 10^5 -> need about n log n
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two heaps (unlock then pick)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(k * n) time, O(n) space. Repeat k times: scan all unused projects, pick the affordable one with the highest profit, add it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two heaps)   O((n + k) log n) time, O(n) space. Two heaps make the greedy fast: byCapital = MIN-heap of all projects keyed by required capital byProfit  = MAX-heap of currently AFFORDABLE projects keyed by profit Repeat k times: 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 -> w unchanged
- nothing affordable at the start -> w unchanged
- k > number of projects -> stop early
- profits of 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(k * n) time, O(n) space

```
Repeat k times: scan all unused projects, pick the affordable one with the
highest profit, add it. Greedy is correct (more capital never hurts), but
each scan is O(n).
```

### APPROACH 2 — Optimal (two heaps)   O((n + k) log n) time, O(n) space

```
Two heaps make the greedy fast:
  byCapital = MIN-heap of all projects keyed by required capital
  byProfit  = MAX-heap of currently AFFORDABLE projects keyed by profit
Repeat k times:
  1. move every project with capital <= w from byCapital to byProfit
     (each project moves at most once overall)
  2. if byProfit is empty -> nothing affordable, stop
  3. w += byProfit.pop()

Dry run on k = 2, w = 0, profits [1,2,3], capital [0,1,1]:
  byCapital {(0,p1),(1,p2),(1,p3)}
  round 1: move (0,p1) -> byProfit {1}; pop 1 -> w = 1
  round 2: move (1,p2),(1,p3) -> byProfit {3,2}; pop 3 -> w = 4
  answer 4
```

### Edge cases

```
- k = 0 -> w unchanged
- nothing affordable at the start -> w unchanged
- k > number of projects -> stop early
- profits of 0
```

Full JavaScript solution with tests: [14_ipo.js](../solutions/14_ipo.js). Run it with `node 14_ipo.js` from the solutions folder.

</details>

## Common mistakes

- Picking the most profitable project without checking affordability.
- Re-scanning all projects each round (O(nk)); sort by capital and use a pointer plus a max-heap.
- Not stopping early when no project is affordable.

## Related follow-ups

- [Meeting Rooms II](../02_Medium/11_meeting_rooms_ii.md)
- [Minimum Cost to Connect Sticks](../02_Medium/12_min_cost_connect_sticks.md)
- Course Schedule III (LeetCode #630)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
