# 01. Hash Map & Frequency Counting

A hash map (`Map`) or hash set (`Set`) answers "have I seen this before?" and "how many times?"
in O(1) on average. Most brute-force solutions that compare every pair (O(n^2)) become one pass
(O(n)) once you remember the past in a map. This is the most common pattern in interviews, and
it is often a building block inside other patterns (sliding window counts, prefix-sum counts,
graph visited sets).

**Teaches in depth:** [Hashing](../../../05_Hashing/README.md), [Arrays](../../../03_Arrays/README.md), [Strings](../../../04_Strings/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at a hash map |
|---|---|
| "find a pair that sums to", "complement" | for each `x`, look up `target - x` among values already seen |
| "duplicate", "appears twice", "unique", "first non-repeating" | count occurrences or keep a seen-set |
| "anagram", "same letters", "permutation of" | compare frequency counts, or group by a canonical key |
| "group by", "categorize", "bucket" | `Map<key, list>` |
| "isomorphic", "pattern", "one-to-one mapping" | two maps (a -> b and b -> a) |
| "longest consecutive sequence" in O(n) | a `Set` for O(1) "is x+1 present?" |
| "design a cache / lookup / index" | the map is the data structure |

**Constraint hints**

- n up to 10^5 or 10^6 and the input is **not sorted** -> you need O(n) or O(n log n). A map gives O(n).
- "Return indices" -> sorting would destroy the indices, so prefer a map over sort + two pointers.
- Small fixed alphabet ("lowercase English letters") -> an array of 26 counts is faster than a `Map`.

## 2. When it applies (preconditions)

- You need **exact-match** lookups: "is this value / key present?", "how many times?".
- Keys are **hashable**: numbers, strings, or something you can turn into a string (sorted letters, `r + ',' + c`).
- Extra O(n) memory is allowed.

## 3. When it does NOT apply

- **Range or ordering questions.** "How many values are between 10 and 20?" or "the next bigger
  value" need order. A hash map has no order by value. Use sorting + binary search, a balanced
  BST, or a Fenwick tree.
  *Counterexample:* `nums = [5, 1, 9, 3]`, query "smallest value greater than 4". A map of seen
  values cannot answer without scanning everything (O(n) per query). A sorted array + `upperBound` answers in O(log n).
- **O(1) extra space required.** "Find the duplicate without extra memory" (Find the Duplicate
  Number) forbids a set. Use Floyd's cycle trick ([05_fast_and_slow_pointers.md](05_fast_and_slow_pointers.md)) or bit tricks.
- **Keys are objects compared by content.** `new Map().set([1,2], 'x').get([1,2])` is `undefined`
  because arrays are compared by reference. Build a string key first.

## 4. The template

```js
function frequencyMap(items) {
  const freq = new Map();
  for (const x of items) freq.set(x, (freq.get(x) || 0) + 1);
  return freq;
}

function twoSumHash(nums, target) {
  const seen = new Map();
  for (let j = 0; j < nums.length; j++) {
    const need = target - nums[j];
    if (seen.has(need)) return [seen.get(need), j]; // look up BEFORE inserting: no self-pairing
    seen.set(nums[j], j);
  }
  return null;
}

function groupByKey(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()];
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`frequencyMap`, `twoSumHash`, `groupByKey`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `twoSumHash([2, 7, 11, 15], 9)`:

| j | nums[j] | need | seen before | action |
|---|---|---|---|---|
| 0 | 2 | 7 | {} | 7 not seen, store 2 -> 0 |
| 1 | 7 | 2 | {2:0} | 2 seen at 0 -> return [0, 1] |

## 5. Variations

- **Seen-set (existence only):** Contains Duplicate. Use a `Set`; return as soon as `has` is true.
- **Counts compared:** Valid Anagram. Count up for `s`, count down for `t`, all counts must end at 0.
- **Canonical key:** Group Anagrams. Key = sorted letters, or a 26-count string like `"1#0#2#..."` (O(k) instead of O(k log k)).
- **Two maps for bijection:** Isomorphic Strings / Word Pattern. Check both directions.
- **Index map with a window:** Contains Duplicate II. Store last index; compare `j - last <= k`.
- **Prefix-sum counts:** Subarray Sum Equals K. The key is a running sum (see [04_prefix_sums_and_difference_arrays.md](04_prefix_sums_and_difference_arrays.md)).

## 6. Common pitfalls

1. **Plain objects coerce keys to strings.** `obj[1]` and `obj['1']` are the same key, and keys like `"__proto__"` or `"constructor"` misbehave. Use `Map`.
2. **`map.get(x) || 0` is fine for counts, but wrong for stored indices** where `0` is a valid value. Use `map.has(x)` before `get`.
3. **Inserting before looking up** in Two Sum pairs an element with itself (`[3]`, target 6). Look up first.
4. **Array keys** are compared by reference. Use `key = a + ',' + b` or `JSON.stringify`.
5. **Sorting a word for the key** is O(k log k). For long words with a small alphabet, use a count signature.
6. **Assuming O(1) is guaranteed.** Average O(1); interviews accept it, but say "on average".

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Two Sum | Easy | complement lookup | [statement](../../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) · [solution](../../../05_Hashing/03_Problems/solutions/01_two_sum.js) |
| 2 | Contains Duplicate II | Easy | last-seen index map | [statement](../../../05_Hashing/03_Problems/01_Easy/02_contains_duplicate_ii.md) · [solution](../../../05_Hashing/03_Problems/solutions/02_contains_duplicate_ii.js) |
| 3 | Valid Anagram | Easy | compare counts | [statement](../../../05_Hashing/03_Problems/01_Easy/03_valid_anagram.md) · [solution](../../../05_Hashing/03_Problems/solutions/03_valid_anagram.js) |
| 4 | Isomorphic Strings | Easy | two maps, both directions | [statement](../../../05_Hashing/03_Problems/01_Easy/05_isomorphic_strings.md) · [solution](../../../05_Hashing/03_Problems/solutions/05_isomorphic_strings.js) |
| 5 | Group Anagrams | Medium | canonical key | [statement](../../../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md) · [solution](../../../05_Hashing/03_Problems/solutions/08_group_anagrams.js) |
| 6 | Longest Consecutive Sequence | Medium | set + start-of-run check | [statement](../../../05_Hashing/03_Problems/02_Medium/10_longest_consecutive_sequence.md) · [solution](../../../05_Hashing/03_Problems/solutions/10_longest_consecutive_sequence.js) |
| 7 | 4Sum II | Medium | count pair sums of two arrays | [statement](../../../05_Hashing/03_Problems/02_Medium/14_four_sum_ii.md) · [solution](../../../05_Hashing/03_Problems/solutions/14_four_sum_ii.js) |
| 8 | First Unique Character | Easy | frequency count, then scan | [statement](../../../04_Strings/03_Problems/01_Easy/04_first_unique_character.md) · [solution](../../../04_Strings/03_Problems/solutions/04_first_unique_character.js) |
| 9 | Design HashMap | Easy | build the structure itself | [statement](../../../05_Hashing/03_Problems/01_Easy/15_design_hashmap.md) · [solution](../../../05_Hashing/03_Problems/solutions/15_design_hashmap.js) |

## 8. Self-check

**Q1.** Why does Two Sum check the map *before* inserting the current number?

<details><summary>Answer</summary>

So an element never pairs with itself. With `nums = [3, 2, 4]`, target 6: if you insert 3 first,
then look up `6 - 3 = 3`, you would wrongly return `[0, 0]`. Checking first means the map only holds earlier indices.

</details>

**Q2.** You need "is there any value in the range [lo, hi]?" for many queries. Hash set or sorted array?

<details><summary>Answer</summary>

Sorted array + binary search (`lowerBound(lo)` then check it is `<= hi`), O(log n) per query. A hash set has no order by value, so it would need a scan.

</details>

**Q3.** Why is `const counts = {}; counts[key]++` risky in JavaScript?

<details><summary>Answer</summary>

`counts[key]` starts as `undefined`, and `undefined + 1` is `NaN`. Also keys are coerced to strings
(`1` and `'1'` collide) and special names like `__proto__` break. Use `Map` with `(m.get(k) || 0) + 1`.

</details>

---

Next: [02. Two Pointers](02_two_pointers.md) · [Pattern index](../../README.md)
