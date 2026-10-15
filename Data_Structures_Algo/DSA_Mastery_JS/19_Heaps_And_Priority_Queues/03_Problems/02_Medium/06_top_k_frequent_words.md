# Top K Frequent Words

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | top K with tie-break comparator |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #692 — https://leetcode.com/problems/top-k-frequent-words/ |
| **Solution file** | [06_top_k_frequent_words.js](../solutions/06_top_k_frequent_words.js) — open only after a real attempt |

## Problem

Given an array of words and an integer k, return the k most frequent words,
sorted by frequency from highest to lowest. Words with the same frequency
are sorted alphabetically.

## Examples

```
Input: words = ["i","love","leetcode","i","love","coding"], k = 2
Output: ["i","love"]   Explanation: both appear twice; "i" < "love" alphabetically
Input: words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4
Output: ["the","is","sunny","day"]   Explanation: counts 4, 3, 2, 1
```

## Constraints & clarifying questions

```
- Lowercase only? (yes) k <= number of unique words? (yes)
- Output order matters here (unlike problem 05): freq desc, then alphabetical.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *top K with tie-break comparator* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (count + full sort)   O(n log n) time, O(n) space. Count, then sort all unique words with a two-key comparator, take k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count + min-heap of size k)   O(n log k) time, O(n) space. The twist: the heap's "worst" element must be the one we want to EVICT: - lower count is worse - on a tie, the alphabetically LATER word is worse (we keep the earlier one) So the min-heap comparator is: count ascending, then word DESCENDING.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all words equal frequency -> purely alphabetical
- k = 1
- single word
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (count + full sort)   O(n log n) time, O(n) space

```
Count, then sort all unique words with a two-key comparator, take k.
```

### APPROACH 2 — Optimal (count + min-heap of size k)   O(n log k) time, O(n) space

```
The twist: the heap's "worst" element must be the one we want to EVICT:
  - lower count is worse
  - on a tie, the alphabetically LATER word is worse (we keep the earlier one)
So the min-heap comparator is: count ascending, then word DESCENDING.
After the loop, pop everything (worst first) and reverse to get best first.

Dry run on ["i","love","leetcode","i","love","coding"], k = 2:
  counts: i:2, love:2, leetcode:1, coding:1
  push i(2)                     heap top = i
  push love(2)                  tie on count; "love" > "i" so love is "worse" -> top = love
  push leetcode(1) -> size 3 -> pop leetcode  (lowest count)
  push coding(1)   -> size 3 -> pop coding
  drain: pop love, pop i -> [love, i] -> reverse -> ["i","love"]
```

### Edge cases

```
- all words equal frequency -> purely alphabetical
- k = 1
- single word
```

Full JavaScript solution with tests: [06_top_k_frequent_words.js](../solutions/06_top_k_frequent_words.js). Run it with `node 06_top_k_frequent_words.js` from the solutions folder.

</details>

## Common mistakes

- Tie-breaking the wrong way: equal counts must be ordered alphabetically.
- Inverting the comparator for the size-k min-heap incorrectly (the "worst" word is lower count or alphabetically larger).
- Forgetting to reverse the popped order at the end.

## Related follow-ups

- [Top K Frequent Elements](05_top_k_frequent_elements.md)
- [Implement Trie](../../../22_Tries/03_Problems/02_Medium/01_implement_trie.md) (22_Tries)
- [Search Suggestions System](../../../22_Tries/03_Problems/02_Medium/07_search_suggestions_system.md) (22_Tries)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
