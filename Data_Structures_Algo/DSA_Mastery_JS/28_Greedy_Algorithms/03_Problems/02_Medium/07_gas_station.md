# Gas Station

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | circuit argument |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #134 — https://leetcode.com/problems/gas-station/ |
| **Solution file** | [07_gas_station.js](../solutions/07_gas_station.js) — open only after a real attempt |

## Problem

There are n gas stations on a circle. gas[i] is the fuel you get at station i, cost[i] is
the fuel needed to drive from station i to station i + 1. You start with an empty tank.
Return the starting station index from which you can complete one full loop clockwise,
or -1 if impossible. The answer is guaranteed unique if it exists.

## Examples

```
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]   Output: 3
  Explanation: start at 3: tank 4-1=3, +5-2=6, +1-3=4, +2-4=2, +3-5=0 -> made it
Input: gas = [2,3,4], cost = [3,4,3]           Output: -1
```

## Constraints & clarifying questions

```
- Can we drive counter-clockwise? (no)
- Is the tank unlimited? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *circuit argument* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Try every start.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (one pass, circuit argument)   O(n) time, O(1) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single station with gas >= cost -> 0
- gas equals cost everywhere -> 0
- total gas < total cost -> -1 before scanning
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Try every start. Simulate a full loop; if the tank ever goes negative, that start fails.
```

### APPROACH 2 — Optimal (one pass, circuit argument)   O(n) time, O(1) space

```
1. If sum(gas) < sum(cost), no start works -> -1.
2. Otherwise scan once with `tank`. Whenever tank drops below 0 at station i, every station
   from the current `start` through i is a bad start, so set start = i + 1 and tank = 0.
```

### WHY GREEDY WORKS

```
Claim A: if you leave `start` with 0 fuel and first run dry on the way to station i + 1,
then no station between start and i can be a valid start either. From any such station k
you would arrive at i with LESS fuel than you had coming from start (you skipped the
positive surplus accumulated before k), so you would run dry too.
Claim B: if total gas >= total cost, the last `start` we pick works. Everything before it
had a net negative surplus (that is why we skipped it), so the segment from start to the
end has surplus >= total surplus >= 0, which carries us around the loop and through the
early negative part.

Dry run on gas = [1,2,3,4,5], cost = [3,4,5,1,2]:
  total surplus = 15 - 15 = 0 -> a start exists
  i=0 tank=-2 <0 -> start=1, tank=0
  i=1 tank=-2 <0 -> start=2, tank=0
  i=2 tank=-2 <0 -> start=3, tank=0
  i=3 tank=3
  i=4 tank=6   -> answer 3
```

### Edge cases

```
- single station with gas >= cost -> 0
- gas equals cost everywhere -> 0
- total gas < total cost -> -1 before scanning
```

Full JavaScript solution with tests: [07_gas_station.js](../solutions/07_gas_station.js). Run it with `node 07_gas_station.js` from the solutions folder.

</details>

## Common mistakes

- Skipping the global check `sum(gas) >= sum(cost)`; without it the one-pass start may be wrong.
- Restarting at the station where the tank went negative instead of the NEXT station.
- Simulating every start in O(n²) - correct but too slow for 10^5 stations.

## Related follow-ups

- Minimum Number of Refueling Stops (LeetCode #871)
- [Jump Game](../02_Medium/05_jump_game.md)
- [Lemonade Change](../01_Easy/02_lemonade_change.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
