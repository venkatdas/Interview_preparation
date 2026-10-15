# Lemonade Change

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Easy |
| **Pattern** | counting greedy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #860 — https://leetcode.com/problems/lemonade-change/ |
| **Solution file** | [02_lemonade_change.js](../solutions/02_lemonade_change.js) — open only after a real attempt |

## Problem

Lemonade costs $5. Customers queue up and pay with a $5, $10 or $20 bill, one at a time.
You start with no money. Return true if you can give every customer correct change.

## Examples

```
Input: [5,5,5,10,20]   Output: true
  Explanation: collect 5,5,5; give 5 back for the 10; give 10+5 back for the 20
Input: [5,5,10,10,20]  Output: false
  Explanation: after the two 10s we hold 10,10; a 20 needs 15 but we only have 10s
```

## Constraints & clarifying questions

```
- Only 5, 10, 20 bills? (yes)
- Do we start with any change? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting greedy* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time. For a $20 bill, change can be given as 10+5 or 5+5+5.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (counting greedy)   O(n) time, O(1) space. Keep counts of fives and tens.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- first customer pays 10 or 20 -> false immediately
- empty queue -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time

```
For a $20 bill, change can be given as 10+5 or 5+5+5. Try both options recursively and
see if any path survives. Exponential, but shows what the greedy choice is replacing.
```

### APPROACH 2 — Optimal (counting greedy)   O(n) time, O(1) space

```
Keep counts of fives and tens. For a 20, prefer giving 10+5 over 5+5+5.
```

### WHY GREEDY WORKS

```
A $5 bill is more "flexible" than a $10 (it can make change for both a 10 and a 20; a 10
only helps with a 20). So when both options exist, spend the less flexible 10 first and
keep as many 5s as possible. Exchange argument: any valid plan that gave 5+5+5 when a 10 was
available can be rewritten to give 10+5 instead, which leaves a strictly better (more
flexible) set of bills for the future.

Dry run on [5,5,10,10,20]:
  5  -> fives=1
  5  -> fives=2
  10 -> need a 5: fives=1, tens=1
  10 -> need a 5: fives=0, tens=2
  20 -> need 15: 10+5? no fives. 5+5+5? no. -> false
```

### Edge cases

```
- first customer pays 10 or 20 -> false immediately
- empty queue -> true
```

Full JavaScript solution with tests: [02_lemonade_change.js](../solutions/02_lemonade_change.js). Run it with `node 02_lemonade_change.js` from the solutions folder.

</details>

## Common mistakes

- Giving change for $20 as three $5 bills before trying a $10 + $5 - the $5 bills are the scarce, flexible ones.
- Tracking a total amount of money instead of bill counts; you can have $20 but no way to break it.
- Counting $20 bills - they are never used as change, so they do not matter.

## Related follow-ups

- [Assign Cookies](../01_Easy/01_assign_cookies.md)
- Coin Change (LeetCode #322) - when biggest-first fails
- [Gas Station](../02_Medium/07_gas_station.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
