# Dota2 Senate

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | two queues, round robin |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #649 — https://leetcode.com/problems/dota2-senate/ |
| **Solution file** | [13_dota2_senate.js](../solutions/13_dota2_senate.js) — open only after a real attempt |

## Problem

A string of 'R' (Radiant) and 'D' (Dire) senators, in voting order. Each
round, every senator still in the game, in order, may BAN one senator from
the other party (removing their vote forever). Everyone plays optimally.
Rounds repeat until only one party remains. Return the winning party.

## Examples

```
Input: "RD"    Output: "Radiant"   Explanation: R bans D first
Input: "RDD"   Output: "Dire"      Explanation: R bans the 1st D; the 2nd D bans R
Input: "DDRRR" Output: "Dire"
```

## Constraints & clarifying questions

```
- Banned senators are skipped forever, and the round order wraps around? (yes)
- Optimal play = ban the NEXT opposing senator who would otherwise act? (yes - that's
  the greedy that makes the problem tractable)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two queues, round robin* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate with an array and a "banned" flag)   O(n^2) time. Loop over the senators repeatedly.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two queues of indices)   O(n) time, O(n) space. Put Radiant indices in one queue and Dire indices in another.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all one party
- single senator
- equal counts (the party that acts first wins: "RD" -> Radiant, "DR" -> Dire)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate with an array and a "banned" flag)   O(n^2) time

```
Loop over the senators repeatedly. For each active senator, scan forward
(wrapping) to find the next active opponent and ban them. Stop when a full
pass finds no opponents.
```

### APPROACH 2 — Optimal (two queues of indices)   O(n) time, O(n) space

```
Put Radiant indices in one queue and Dire indices in another. Each step,
compare the two FRONTS: the smaller index acts first and bans the other.
The winner goes back to the end of its queue with index + n (it acts again
in the next round, after everyone else this round). The loser is just
dropped. When one queue is empty, the other party wins.

Dry run on "RDD" (n=3):
  R [0]   D [1,2]
  0 < 1 -> R bans D(1). R [3]  D [2]
  2 < 3 -> D bans R(3). R []   D [5]
  R empty -> "Dire"
```

### Edge cases

```
- all one party
- single senator
- equal counts (the party that acts first wins: "RD" -> Radiant, "DR" -> Dire)
```

Full JavaScript solution with tests: [13_dota2_senate.js](../solutions/13_dota2_senate.js). Run it with `node 13_dota2_senate.js` from the solutions folder.

</details>

## Common mistakes

- Removing banned senators from an array with `splice` in a loop (O(n²)).
- Forgetting the winner re-enters with index + n, not the same index.
- Banning the next senator in the string rather than the next opponent.

## Related follow-ups

- [Asteroid Collision](../../../16_Stacks/03_Problems/02_Medium/10_asteroid_collision.md) (16_Stacks)
- [Reveal Cards In Increasing Order](14_reveal_cards_increasing_order.md)
- Find the Winner of the Circular Game (LeetCode #1823)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
