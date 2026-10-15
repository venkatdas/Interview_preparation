# Boats to Save People

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | two-pointer greedy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #881 — https://leetcode.com/problems/boats-to-save-people/ |
| **Solution file** | [08_boats_to_save_people.js](../solutions/08_boats_to_save_people.js) — open only after a real attempt |

## Problem

people[i] is the weight of person i. Each boat carries at most 2 people and at most
`limit` total weight. Every person weighs <= limit. Return the minimum number of boats.

## Examples

```
Input: people = [1,2], limit = 3       Output: 1   Explanation: (1,2)
Input: people = [3,2,2,1], limit = 3   Output: 3   Explanation: (1,2), (2), (3)
Input: people = [3,5,3,4], limit = 5   Output: 4   Explanation: nobody can pair up
```

## Constraints & clarifying questions

```
- At most 2 per boat, never 3? (yes - this is what makes two pointers enough)
- Can a person weigh more than limit? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-pointer greedy* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n!) time. Try every way of pairing people (or leaving them alone) via backtracking; keep the min.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + two pointers)   O(n log n) time, O(1) extra. Sort.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one person -> 1
- everyone exactly limit -> n boats
- empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n!) time

```
Try every way of pairing people (or leaving them alone) via backtracking; keep the min.
```

### APPROACH 2 — Optimal (sort + two pointers)   O(n log n) time, O(1) extra

```
Sort. Pointers at the lightest and heaviest. The heaviest person ALWAYS boards a boat now.
If the lightest fits with them, the lightest boards too. Either way, one boat is used.
```

### WHY GREEDY WORKS

```
The heaviest person must go in some boat. The best possible partner for them is the
lightest person (the only one guaranteed to fit if anyone does). Exchange argument: if an
optimal plan pairs the heaviest with someone else (or alone) and the lightest with a third
person, swap partners - all weight limits still hold (lightest <= anyone), boat count
unchanged. So pairing heaviest+lightest is always safe.

Dry run on [3,2,2,1], limit 3:
  sorted [1,2,2,3], light=0, heavy=3
  1+3 > 3 -> 3 goes alone, heavy=2, boats=1
  1+2 <= 3 -> pair, light=1, heavy=1, boats=2
  light == heavy: 2 goes alone, boats=3
```

### Edge cases

```
- one person -> 1
- everyone exactly limit -> n boats
- empty -> 0
```

Full JavaScript solution with tests: [08_boats_to_save_people.js](../solutions/08_boats_to_save_people.js). Run it with `node 08_boats_to_save_people.js` from the solutions folder.

</details>

## Common mistakes

- Pairing the two lightest people - the heaviest person is the one who limits you, so decide their boat first.
- Forgetting a boat carries at most TWO people, so you cannot keep stuffing light people in.
- Loop condition `light < heavy` instead of `<=`, which drops the last single person.

## Related follow-ups

- [Assign Cookies](../01_Easy/01_assign_cookies.md)
- Two Sum II (LeetCode #167)
- Bag of Tokens (LeetCode #948)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
