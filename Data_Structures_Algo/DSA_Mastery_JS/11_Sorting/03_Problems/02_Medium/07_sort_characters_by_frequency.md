# Sort Characters By Frequency

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | counting + bucket |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #451 — https://leetcode.com/problems/sort-characters-by-frequency/ |
| **Solution file** | [07_sort_characters_by_frequency.js](../solutions/07_sort_characters_by_frequency.js) — open only after a real attempt |

## Problem

Given a string, sort its characters by decreasing frequency. Characters with the
same frequency may appear in any order, but all copies of a character stay together.

## Examples

```
Input: "tree"     Output: "eert"  ("eetr" also valid)
Input: "cccaaa"   Output: "aaaccc" or "cccaaa"
Input: "Aabb"     Output: "bbAa"  ('A' and 'a' are different characters)
```

## Constraints & clarifying questions

```
- Case sensitive? (yes)
- Ties: any order ok? (yes, but a deterministic tie-break is nicer; we use char order)
- n <= 5 * 10^5
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting + bucket* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (count + comparator sort)   O(n log n) time, O(n) space. Count with a Map, sort the distinct characters by count desc, build the string.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bucket sort by frequency)   O(n) time, O(n) space. The frequency of any character is between 1 and n, so create n + 1 buckets: bucket[f] = list of characters that appear exactly f times.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" -> ""
- single character "a" -> "a"
- all same "aaaa" -> "aaaa"
- all distinct -> any order
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (count + comparator sort)   O(n log n) time, O(n) space

```
Count with a Map, sort the distinct characters by count desc, build the string.
Really O(k log k) for k distinct chars plus O(n) to count and build - already fast.
```

### APPROACH 2 — Optimal (bucket sort by frequency)   O(n) time, O(n) space

```
The frequency of any character is between 1 and n, so create n + 1 buckets:
bucket[f] = list of characters that appear exactly f times. Walk buckets from n
down to 1 and append each character repeated f times. No comparison sort at all.

Dry run "tree":
  counts: t:1, r:1, e:2
  buckets: [1] -> [t, r]   [2] -> [e]
  walk from high to low: "ee" + "t" + "r" = "eetr"
```

### Edge cases

```
- "" -> ""
- single character "a" -> "a"
- all same "aaaa" -> "aaaa"
- all distinct -> any order
```

Full JavaScript solution with tests: [07_sort_characters_by_frequency.js](../solutions/07_sort_characters_by_frequency.js). Run it with `node 07_sort_characters_by_frequency.js` from the solutions folder.

</details>

## Common mistakes

- Assuming lowercase letters only; uppercase and digits are distinct characters.
- Sorting the string with a comparator that recounts frequencies each time.
- Interleaving characters with equal frequency; each character's copies must stay together.

## Related follow-ups

- [Top K Frequent Elements](../../../05_Hashing/03_Problems/02_Medium/09_top_k_frequent_elements.md) — bucket sort by count
- [Relative Sort Array](../01_Easy/08_relative_sort_array.md) — sort by a custom key
- [Reorganize String](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/10_reorganize_string.md) — frequency with a no-adjacent rule

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
