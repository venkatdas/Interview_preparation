# Maximum Units on a Truck

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Easy |
| **Pattern** | sort by value |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1710 — https://leetcode.com/problems/maximum-units-on-a-truck/ |
| **Solution file** | [03_maximum_units_on_truck.js](../solutions/03_maximum_units_on_truck.js) — open only after a real attempt |

## Problem

boxTypes[i] = [numberOfBoxes, unitsPerBox]. The truck holds at most truckSize boxes.
Return the maximum total number of units you can load.

## Examples

```
Input: boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4   Output: 8
  Explanation: take the 1 box of 3 units, the 2 boxes of 2 units, and 1 box of 1 unit
Input: boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10   Output: 91
```

## Constraints & clarifying questions

```
- All boxes are the same size (each takes one slot)? (yes)
- Can truckSize be bigger than the total number of boxes? (yes, take everything)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort by value* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^total boxes) time. Treat every individual box as an item and try every subset of size &lt;= truckSize.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by units per box, descending)   O(n log n) time, O(1) extra. Every box costs the same (one slot), so fill slots with the most valuable boxes first.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- truckSize = 0 -> 0
- fewer boxes than truckSize -> sum of all units
- a type with more boxes than slots left -> take only `slotsLeft` of them
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^total boxes) time

```
Treat every individual box as an item and try every subset of size <= truckSize.
Exponential; here implemented as a simple recursion for tiny inputs.
```

### APPROACH 2 — Optimal (sort by units per box, descending)   O(n log n) time, O(1) extra

```
Every box costs the same (one slot), so fill slots with the most valuable boxes first.
```

### WHY GREEDY WORKS

```
This is a fractional-knapsack where every item has weight 1, so "value per weight" is just
the units. Exchange argument: if an optimal load contains a box with fewer units while a box
with more units was left behind, swap them - same slot count, more units. Repeat until the
load is exactly the greedy one.

Dry run on [[1,3],[2,2],[3,1]], truckSize 4:
  sorted by units desc: [1,3],[2,2],[3,1]
  take 1 box x 3 = 3,   slots left 3
  take 2 boxes x 2 = 4, slots left 1
  take 1 box x 1 = 1,   slots left 0 -> total 8
```

### Edge cases

```
- truckSize = 0 -> 0
- fewer boxes than truckSize -> sum of all units
- a type with more boxes than slots left -> take only `slotsLeft` of them
```

Full JavaScript solution with tests: [03_maximum_units_on_truck.js](../solutions/03_maximum_units_on_truck.js). Run it with `node 03_maximum_units_on_truck.js` from the solutions folder.

</details>

## Common mistakes

- Sorting by number of boxes instead of units per box.
- Taking a whole box type when only part of it fits - take `min(count, remaining)` boxes.
- Not stopping once the truck is full (harmless but wasteful), or letting `remaining` go negative.

## Related follow-ups

- Fractional knapsack (see [greedy_classics.js](../../02_Implementations/greedy_classics.js))
- [Assign Cookies](../01_Easy/01_assign_cookies.md)
- Reduce Array Size to The Half (LeetCode #1338)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
