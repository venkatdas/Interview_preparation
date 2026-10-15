# Random Pick Index

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | reservoir sampling (k = 1) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #398 — https://leetcode.com/problems/random-pick-index/ (statement paraphrased, not copied) |
| **Solution file** | [02_random_pick_index.js](../solutions/02_random_pick_index.js) — open only after a real attempt |

## Problem

You get an integer array that may contain duplicates. Implement `pick(target)`: return an index `i` where `nums[i] === target`, chosen uniformly among all such indices. If the target appears c times, each of those c indices must come back with probability 1/c. The target always exists.

## Examples

```
nums = [1, 2, 3, 3, 3]
pick(3) -> 2, 3 or 4, each with probability 1/3
pick(1) -> 0
```

## Constraints & clarifying questions

```
- Array size and number of calls? (big arrays: think about memory)
- Extra memory allowed? (the intended follow-up: O(1) extra space)
- Is the target always present? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Choosing uniformly among items you discover one by one is *reservoir sampling*. See section 5.5 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Precompute a Map from value to its list of indices; pick a random entry from the list. What does that cost in memory?

</details>

<details><summary>Hint 3</summary>

**The key idea.** Scan the array. Count matches as you go. On the c-th match, replace your current answer with probability 1/c. The survival probabilities telescope to 1/(total matches).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** A target that appears once must always return that index. All-equal arrays must be uniform over every index.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Index map)   O(n) build, O(1) per pick, O(n) space

```
Build Map value -> [indices] once. pick(target) returns list[floor(rng() * list.length)].
Fast, but stores every index of every value.
```

### APPROACH 2 — Optimal (Reservoir sampling)   O(n) per pick, O(1) extra space

```
count = 0, answer = -1
for i in 0..n-1:
    if nums[i] === target:
        count++
        with probability 1/count: answer = i
Index j (the j-th match) survives with probability
1/j * j/(j+1) * ... * (c-1)/c = 1/c.
```

### Dry run

```
nums = [1, 2, 3, 3, 3], target 3, rolls 0.7 then 0.1
  i=2: count=1 -> always keep -> answer 2
  i=3: count=2 -> 0.7 < 1/2? no  -> answer 2
  i=4: count=3 -> 0.1 < 1/3? yes -> answer 4
```

### Complexity

- Brute force: O(n) build, O(1) per pick, O(n) space
- Optimal: O(n) per pick, O(1) extra space

### Edge cases

```
- single occurrence -> always that index
- all equal values -> uniform over all indices
- negative numbers -> no special handling
```

### Common mistakes

- Replacing with probability 1/i (array position) instead of 1/count (matches seen).
- Picking a random index of the whole array and retrying until it matches: correct but slow when the target is rare.

Full JavaScript solution with tests: [02_random_pick_index.js](../solutions/02_random_pick_index.js). Run it with `node 02_random_pick_index.js` from the solutions folder.

</details>

## Related follow-ups

- Linked List Random Node (LeetCode 382)
- Reservoir sampling of k items
- Random Pick with Blacklist (LeetCode 710)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
