# Smallest Battery

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Medium |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [08_smallest_battery.js](../solutions/08_smallest_battery.js) — open only after a real attempt |

## Problem

A delivery drone flies a fixed route made of segments; `energy[i]` is the energy segment `i` needs.
The drone starts with a full battery of capacity `C`. Between two segments it may land at a
charging pad and refill to full, at most `stops` times in total. A segment can never be split.
Return the **smallest** integer capacity `C` that lets the drone finish the route.

## Examples

```
Input: energy = [4, 2, 3, 5, 1], stops = 2   Output: 6    ([4,2] | [3] | [5,1])
Input: energy = [4, 2, 3, 5, 1], stops = 0   Output: 15   (no refills)
Input: energy = [7, 1, 1], stops = 5         Output: 7    (the biggest segment is a lower bound)
Input: energy = [], stops = 3                Output: 0
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^5, 1 <= energy[i] <= 10^4, 0 <= stops <= 10^5
- Segment order is fixed; using fewer stops than allowed is fine.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Binary search on the answer + greedy feasibility check. Lesson: [Binary Search & Search on the Answer](../../01_Concepts/patterns/06_binary_search_and_search_on_answer.md).

**Target:** O(n log(sum)) time, O(1) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "smallest capacity such that the route is possible". If capacity C works, does C + 1 work too?

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: try every way to cut the route into at most stops + 1 contiguous groups. Exponential.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Feasibility is monotonic: false...false true...true. Binary search C in `[max(energy), sum(energy)]`. Check a C greedily: refill only when the next segment does not fit, count refills.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Edge cases: empty route (0), stops = 0 (sum), stops >= n - 1 (max). Make sure `lo` starts at the max, or a segment bigger than C slips through.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Recursively choose where each group ends; capacity for a cutting = largest group sum; take the minimum. Exponential.

### APPROACH 2 — Optimal (Binary search on the answer + greedy feasibility check)

```
canFly(C): charge = C; for e: if e > charge: refills++, charge = C; charge -= e
           return refills <= stops
binary search first C in [max, sum] with canFly(C) true
```

### Dry run

```
[4,2,3,5,1], stops 2, range [5,15]
  C=10 -> 1 refill  true   hi=10
  C=7  -> 2 refills true   hi=7
  C=6  -> 2 refills true   hi=6
  C=5  -> 3 refills false  lo=6  -> 6
```

### Complexity

O(n log(sum(energy))) time, O(1) extra space.

### Common mistakes

- `lo = 1`: then canFly must reject segments larger than C, or it returns a wrong answer.
- `low = mid` with a floor mid loops forever.
- Thinking the check must try all refill places: refilling as late as possible is never worse.

Full JavaScript solution with tests: [08_smallest_battery.js](../solutions/08_smallest_battery.js). Run it with `node 08_smallest_battery.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../10_Searching/03_Problems/03_Hard/14_split_array_largest_sum.md) · [solution](../../../10_Searching/03_Problems/solutions/14_split_array_largest_sum.js)
- [statement](../../../10_Searching/03_Problems/02_Medium/13_capacity_to_ship_packages.md) · [solution](../../../10_Searching/03_Problems/solutions/13_capacity_to_ship_packages.js)
- Pattern lesson: [Binary Search & Search on the Answer](../../01_Concepts/patterns/06_binary_search_and_search_on_answer.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
