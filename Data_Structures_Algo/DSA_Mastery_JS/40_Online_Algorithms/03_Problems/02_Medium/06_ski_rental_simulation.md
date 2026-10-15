# Ski Rental Simulation

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Medium |
| **Pattern** | competitive analysis, break-even strategy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_ski_rental_simulation.js](../solutions/06_ski_rental_simulation.js) — open only after a real attempt |

## Problem

Renting skis costs 1 per day; buying costs B once. You find out each morning whether you ski
today, but never how many days d the season will last. A deterministic strategy is a number
k: rent on days 1..k-1 and buy on day k if you are still skiing. Implement:

- `onlineCost(B, d, k)` — what strategy k pays if the season lasts d days
- `offlineCost(B, d)` — what someone who knew d pays: `min(d, B)`
- `worstRatio(B, k)` — the maximum of onlineCost / offlineCost over all d >= 1
- `optimal(B)` — `{ buyDay, ratio }` for the strategy with the smallest worst ratio

## Examples

```
B = 10
onlineCost(10, 3, 10)  -> 3       season ended before buying
onlineCost(10, 25, 10) -> 19      9 days of rent + 10
offlineCost(10, 25)    -> 10
optimal(10)            -> { buyDay: 10, ratio: 1.9 }
optimal(1)             -> { buyDay: 1, ratio: 1 }
```

## Constraints & clarifying questions

```
- B positive integer, d >= 1
- deterministic strategies only
- Ask: what does "competitive ratio" measure? (worst case of online / hindsight optimum)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Competitive analysis*: compare an online strategy with the offline optimum on its worst input. See "Competitive analysis" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Simulate: for every k in 1..3B and every d in 1..3B compute the ratio; keep the k with the smallest maximum.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The adversary ends the season the day you buy (d = k). Then ratio(k) = (k - 1 + B) / min(k, B). Check k < B, k = B, k > B.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** B = 1 means buy immediately (ratio 1). If d < k you only rented, ratio 1.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Double loop over strategies k and season lengths d, O(B^2). Good for checking the formula.

### Optimized approach

Closed form, O(1).
```
ratio(k) = (k - 1 + B) / min(k, B)
k < B : 1 + (B-1)/k   (bought too early, too big)
k > B : (k-1+B)/B     (rented too long, too big)
k = B : 2 - 1/B       <- break-even: rent until rent paid would reach B, then buy
```

### Dry run

```
B = 4
k  worst d  online  offline  ratio
1  1        4       1        4.00
2  2        5       2        2.50
3  3        6       3        2.00
4  4        7       4        1.75   best
5  5        8       4        2.00
```

### Complexity

Brute force O(B^2) time; closed form O(1).

### Edge cases

- B = 1
- season shorter than the buy day

### Common mistakes

- Comparing against average-case instead of worst case.
- Off-by-one in "buy on day k" (you rent k-1 days, not k).

Full JavaScript solution with tests: [06_ski_rental_simulation.js](../solutions/06_ski_rental_simulation.js). Run it with `node 06_ski_rental_simulation.js` from the solutions folder.

</details>

## Related follow-ups

- Randomised ski rental (expected ratio e/(e-1))
- Paging / LRU competitive ratio (35_Advanced_Data_Structures)
- TCP acknowledgement and spin-vs-block locks (same structure)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
