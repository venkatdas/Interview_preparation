# Asteroid Collision

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | simulation |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #735 — https://leetcode.com/problems/asteroid-collision/ |
| **Solution file** | [10_asteroid_collision.js](../solutions/10_asteroid_collision.js) — open only after a real attempt |

## Problem

Each integer is an asteroid: the absolute value is its size, the sign is its
direction (+ right, - left). All move at the same speed. When two collide,
the smaller explodes; equal sizes both explode. Two asteroids moving the same
direction never meet. Return the asteroids left after all collisions.

## Examples

```
Input: [5,10,-5]     Output: [5,10]     Explanation: 10 and -5 collide, -5 dies
Input: [8,-8]        Output: []         Explanation: equal, both explode
Input: [10,2,-5]     Output: [10]       Explanation: 2 dies to -5, then -5 dies to 10
Input: [-2,-1,1,2]   Output: [-2,-1,1,2]   Explanation: nobody ever meets
```

## Constraints & clarifying questions

```
- Can a value be 0? (no)
- Only a right-mover followed by a left-mover can collide? (yes: ">" then "<")
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *simulation* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate passes)   O(n^2) time, O(n) space. Scan for any adjacent pair (positive, negative), resolve it, and restart from the beginning.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (stack)   O(n) time, O(n) space. Push right-movers.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all moving left, or all moving right -> unchanged
- a left-mover that destroys everything then lands at the bottom ([1,2,-3] -> [-3])
- equal sizes
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate passes)   O(n^2) time, O(n) space

```
Scan for any adjacent pair (positive, negative), resolve it, and restart
from the beginning. Each pass removes at least one asteroid.
```

### APPROACH 2 — Optimal (stack)   O(n) time, O(n) space

```
Push right-movers. When a left-mover arrives, it fights the top of the
stack while the top is a right-mover:
  top smaller  -> pop, keep fighting
  top equal    -> pop, the left-mover dies too, stop
  top bigger   -> the left-mover dies, stop
If it survives all fights (stack empty or top is a left-mover), push it.
Each asteroid is pushed/popped at most once -> O(n).

Dry run on [10,2,-5]:
  10  push        [10]
  2   push        [10,2]
  -5  top 2 < 5 -> pop        [10]
      top 10 > 5 -> -5 dies   [10]
  result [10]
```

### Edge cases

```
- all moving left, or all moving right -> unchanged
- a left-mover that destroys everything then lands at the bottom ([1,2,-3] -> [-3])
- equal sizes
```

Full JavaScript solution with tests: [10_asteroid_collision.js](../solutions/10_asteroid_collision.js). Run it with `node 10_asteroid_collision.js` from the solutions folder.

</details>

## Common mistakes

- Colliding asteroids moving apart (left-moving on the left, right-moving on the right never meet).
- Forgetting the equal-size case where both explode.
- Not continuing the collision loop after the top explodes.

## Related follow-ups

- [Valid Parentheses](../01_Easy/01_valid_parentheses.md)
- [Daily Temperatures](05_daily_temperatures.md)
- [Dota2 Senate](../../../17_Queues_And_Deques/03_Problems/02_Medium/13_dota2_senate.md) (17_Queues_And_Deques)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
