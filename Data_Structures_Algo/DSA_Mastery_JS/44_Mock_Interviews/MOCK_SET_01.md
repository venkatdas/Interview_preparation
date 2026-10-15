# Mock Interview Set 01 — Hashing & Strings

**Time:** 60 minutes total. Problem 1: 20 min. Problem 2: 35 min. 5 min to review.
**Covers:** [`05_Hashing`](../05_Hashing/README.md), [`04_Strings`](../04_Strings/README.md)
**When:** end of week 2 (12-week plan) or end of week 1 (4-week plan)

**Rules**

- Timer on. No notes, no running code until you have explained your approach out loud.
- Follow the 5 steps: restate, example, brute force, optimize + name the pattern, code + dry-run.
- Open the Hints only when the problem's time is half gone and you have nothing.

---

## Problem 1 — Two Sum (LeetCode 1, Easy) — 20 min

**Links:** [LeetCode #1](https://leetcode.com/problems/two-sum/) · [curriculum statement + hints](../05_Hashing/03_Problems/01_Easy/01_two_sum.md) (open after the mock)

Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers
that add up to `target`. Exactly one solution exists. You may not use the same element twice.

```
Input: nums = [2, 7, 11, 15], target = 9   Output: [0, 1]
Input: nums = [3, 2, 4],      target = 6   Output: [1, 2]
Input: nums = [3, 3],         target = 6   Output: [0, 1]
```

**Clarifying questions you should ask**

- Can the array contain negatives? Duplicates? (yes, yes)
- Is the array sorted? (no; if it were, two pointers would work)
- Return indices or values? Any order? (indices, any order)

<details>
<summary>Hints</summary>

1. Brute force: every pair, O(n^2). Say it, then ask "what am I re-checking?"
2. For each number `x` you are looking for `target - x`. Looking something up fast means a hash map.
3. One pass: before inserting `x`, check whether `target - x` is already in the map. This also avoids using the same index twice.

</details>

**Expected complexity:** O(n) time, O(n) space.

**Follow-up questions an interviewer may ask**

- What if the array is sorted? (two pointers, O(1) space)
- What if there can be many answers and we want all pairs? (hash map of value -> list of indices, careful with duplicates)
- What about 3Sum? (sort + two pointers, O(n^2)) — leads to [`06_Two_Pointers`](../06_Two_Pointers/README.md)

---

## Problem 2 — Group Anagrams (LeetCode 49, Medium) — 35 min

**Links:** [LeetCode #49](https://leetcode.com/problems/group-anagrams/) · [curriculum statement + hints](../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md) (open after the mock)

Given an array of strings, group the anagrams together. Return the groups in any order.

```
Input:  ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
Input:  [""]    Output: [[""]]
Input:  ["a"]   Output: [["a"]]
```

**Clarifying questions you should ask**

- Lowercase English letters only? (yes)
- Max string length and number of strings? (up to 10^4 strings, length up to 100)
- Does order inside a group matter? (no)

<details>
<summary>Hints</summary>

1. Two strings are anagrams if they become identical after some normalization. What normalization?
2. Sorted string as the key: `"eat" -> "aet"`. Hash map from key to list. O(n * k log k).
3. Can you build a key without sorting? A 26-slot count array joined with a separator: `"1,0,0,...,1,0,..."`. O(n * k).
4. Do not use the count array itself as a Map key (two different arrays are never equal as keys). Use a string.

</details>

**Expected complexity:** O(n * k) time with count-key (or O(n * k log k) with sort-key), O(n * k) space.
`n` = number of strings, `k` = max string length.

**Follow-up questions an interviewer may ask**

- What if strings can contain any Unicode character? (count array no longer works; sort-key or a Map of counts serialized in a stable order)
- Can you stream the strings and answer "which group does this belong to?" in O(k)? (keep the hash map alive)
- Why is `[1, 0, 2].join('')` a bad key? (`"102"` could also be `[10, 2]`; use a separator)

---

## Self-review (5 min)

- [ ] I stated the brute force and its complexity before optimizing.
- [ ] I named the pattern ("hash map for O(1) lookup", "canonical key").
- [ ] I dry-ran my code on one example and one edge case.
- [ ] I finished both problems within time.

Write 3 lines: what went well, what went wrong, what to review next.
