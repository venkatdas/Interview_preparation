# Union-Find Step Budget

| | |
|---|---|
| **Topic** | Amortized Analysis |
| **Difficulty** | Hard |
| **Pattern** | union by rank + path compression |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [05_union_find_step_budget.js](../solutions/05_union_find_step_budget.js) — open only after a real attempt |

## Problem

There are n servers (0..n-1). Process a list of operations:
  ['link', a, b]   connect the networks of a and b
  ['same', a, b]   output true if a and b are in the same network
Return { answers, steps } where steps counts parent pointers followed during finds.
Your implementation must stay within a budget of 8·(n + number of operations) steps
for EVERY input, including an adversary who links servers into one long chain and
then queries the far end repeatedly.

## Examples

```
n = 4, ops: link 0 1, link 2 3, same 0 3, link 1 2, same 0 3
  answers [false, true]
n = 1, ops: same 0 0   answers [true]
```

## Constraints & clarifying questions

```
- n up to 1e5, operations up to 2e5.
- link of already-connected servers is a no-op.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Union-find* with an adversary. Section 5.5 in [the concepts guide](../../01_Concepts/CONCEPTS.md) and [Union-Find Basics](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (quick-union, no rank, no compression)   O(n) per op worst case. parent[root(a)] = root(b). Linking 0-1, 1-2, 2-3, ... in the right order builds a chain of height n; each `same` on the bottom element walks n pointers -> Θ(n·m) total.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Naive linking can build a chain of height n. Union by rank keeps height ≤ log n, and path compression makes every node on a find path point straight to the root, so the long walk is paid once. Together the total is O((n + m)·α(n)).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- self-link and repeated links
- same(a, a) -> true
- chain-building adversary (brute force explodes, optimal stays linear)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (quick-union, no rank, no compression)   O(n) per op worst case

```
parent[root(a)] = root(b). Linking 0-1, 1-2, 2-3, ... in the right order builds a chain
of height n; each `same` on the bottom element walks n pointers -> Θ(n·m) total.
```

### APPROACH 2 — Optimal (union by rank + path compression)   O(α(n)) amortized per op

```
Union by rank keeps trees shallow (height <= log n). Path compression re-points every
node on a find path straight to the root, so the long walk is paid once and later
finds on those nodes cost 1. Tarjan's potential argument gives O((n + m)·α(n)) total,
α <= 4 in practice, which is why a budget of 8·(n + m) is never exceeded.

Dry run (example 1, optimal):
  link 0 1 -> parent[1] = 0 (rank 0 = 1)        link 2 3 -> parent[3] = 2
  same 0 3 -> roots 0 and 2 -> false             link 1 2 -> roots 0, 2 equal rank -> parent[2] = 0
  same 0 3 -> find(3): 3 -> 2 -> 0 (compress 3 -> 0) -> true
```

### Edge cases

```
- self-link and repeated links
- same(a, a) -> true
- chain-building adversary (brute force explodes, optimal stays linear)
```

### Common mistakes

```
- Path compression without union by rank is already good amortized (O(log n)), but rank alone
  is not "compression": you need both for α(n).
- Comparing a and b instead of find(a) and find(b).
- Forgetting to increment rank only when the two ranks are equal.
```

Full JavaScript solution with tests: [05_union_find_step_budget.js](../solutions/05_union_find_step_budget.js). Run it with `node 05_union_find_step_budget.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #547 Number of Provinces.
- LeetCode #684 Redundant Connection.
- LeetCode #1202 Smallest String With Swaps.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
