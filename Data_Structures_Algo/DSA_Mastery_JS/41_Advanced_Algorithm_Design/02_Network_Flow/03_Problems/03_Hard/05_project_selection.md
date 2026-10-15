# Project Selection with Prerequisites

| | |
|---|---|
| **Topic** | Network Flow (Advanced) |
| **Difficulty** | Hard |
| **Pattern** | min cut modeling (maximum closure / project selection) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [03 Minimum Cut](../02_Medium/03_minimum_cut_network.md) |
| **Source** | Original exercise |
| **Solution file** | [05_project_selection.js](../solutions/05_project_selection.js) — open only after a real attempt |

## Problem

You may start any subset of `n` projects. `profit[i]` is what project `i` earns; it may be
negative (a pure cost, like buying equipment). `requires = [[a, b], ...]` means "doing `a`
forces you to also do `b`". Return the maximum total profit. Doing nothing earns 0.

## Examples

```
Input: profit=[10,-4,-3], requires=[[0,1],[0,2]]    Output: 3   (10 - 4 - 3)
Input: profit=[5,-8],     requires=[[0,1]]          Output: 0   (not worth it)
Input: profit=[6,6,-10],  requires=[[0,2],[1,2]]    Output: 2   (shared cost)
Input: profit=[4,-1,2],   requires=[[1,2]]          Output: 6   (do 0 and 2)
```

## Constraints & clarifying questions

```
- n <= 500, requirements <= 5000, |profit| <= 10^6.
- Can requirements form a cycle? (yes -> those projects are all-or-nothing)
- Transitive? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Choosing a set that is "closed" under dependencies, maximising a sum with
positive and negative weights, is the textbook *project selection* min cut. See
"Applications" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Try all 2^n subsets, keep only those where every chosen `a` has its `b`
chosen, take the best sum. Fine for n <= 20.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Think of a cut as a decision: S side = "do it". Charge yourself for
every *bad* thing: losing a positive profit (cut source->i with capacity profit) or paying a
cost (cut i->sink with capacity -profit). Make every rule an *uncuttable* edge a->b with
capacity Infinity. Then answer = sum of positive profits - min cut.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all profits <= 0 -> 0
- no requirements -> sum of positive profits
- requirement cycles -> handled automatically
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n · (n + R)) time

```
for each subset: if closed under requires -> candidate = sum of chosen profits
```

### APPROACH 2 — Optimal (min cut)   O(V^2 · E) with Dinic

```
S -> i  capacity profit[i]    if profit[i] > 0
i -> T  capacity -profit[i]   if profit[i] < 0
a -> b  capacity Infinity     for each "a requires b"
answer = (sum of positive profits) - maxFlow(S, T)

Dry run (example 1): positives = 10
  S->0 (10), 1->T (4), 2->T (3), 0->1 (inf), 0->2 (inf)
  push 4 along S-0-1-T, 3 along S-0-2-T -> flow 7
  answer = 10 - 7 = 3
```

### Why the infinite edge forces the rule

If `a` is on the S side and `b` on the T side, the edge a->b crosses the cut and costs
Infinity, so no minimum cut ever does that. Chosen sets are therefore always closed.

### Common mistakes

```
- Pointing the infinite edge the wrong way (b -> a): that encodes "b requires a".
- Returning the min cut instead of positives - min cut.
- Using a big finite number that is smaller than the sum of profits.
```

Full JavaScript solution with tests: [05_project_selection.js](../solutions/05_project_selection.js). Run it with `node 05_project_selection.js` from the solutions folder.

</details>

## Related follow-ups

- Open-pit mining (dig a block -> must dig blocks above it): same model.
- Image segmentation (foreground/background with neighbour penalties): min cut with finite pair edges.
- "Choose a set of courses with prerequisites maximizing value" — identical structure.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
