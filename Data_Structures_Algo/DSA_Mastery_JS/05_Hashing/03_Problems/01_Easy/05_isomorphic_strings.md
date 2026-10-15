# Isomorphic Strings

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | two-way mapping |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #205 — https://leetcode.com/problems/isomorphic-strings/ |
| **Solution file** | [05_isomorphic_strings.js](../solutions/05_isomorphic_strings.js) — open only after a real attempt |

## Problem

Two strings s and t are isomorphic if every character of s can be replaced to get t,
where the replacement is consistent (same char always maps to the same char) and
no two different characters map to the same character. Order must be preserved.

## Examples

```
Input: s = "egg", t = "add"       Output: true    Explanation: e->a, g->d
Input: s = "foo", t = "bar"       Output: false   Explanation: o->a and o->r conflict
Input: s = "paper", t = "title"   Output: true    Explanation: p->t, a->i, e->l, r->e
Input: s = "badc", t = "baba"     Output: false   Explanation: b->b and d->b: two chars map to 'b'
```

## Constraints & clarifying questions

```
- Are lengths equal? (LeetCode guarantees it; check anyway)
- Any character set? (yes, so a Map not a 26-array)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-way mapping* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (pattern fingerprint)   O(n) time, O(n) space. Convert each string into a "shape": replace each char with the index of its first occurrence.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two maps, bijection check)   O(n) time, O(k) space. Walk both strings together with two maps: sToT and tToS.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Different lengths -> false
- Empty strings -> true
- Same string -> true (identity mapping)
- Many-to-one mapping must fail ("ab" -> "aa")
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (pattern fingerprint)   O(n) time, O(n) space

```
Convert each string into a "shape": replace each char with the index of its first
occurrence. "egg" -> [0,1,1], "add" -> [0,1,1]. Equal shapes -> isomorphic.
Building the shape uses indexOf which makes it O(n^2) in the simple version.
```

### APPROACH 2 — Optimal (two maps, bijection check)   O(n) time, O(k) space

```
Walk both strings together with two maps: sToT and tToS.
At position i:
  - if sToT has s[i] but maps to something else than t[i] -> false
  - if tToS has t[i] but maps to something else than s[i] -> false
  - otherwise record both directions
One map is not enough: "badc"/"baba" passes s->t alone (b->b, a->a, d->b ... wait d->b
while b->b is fine for s->t) but fails t->s (b maps to both b and d).

Dry run on s = "foo", t = "bar":
  i=0 f/b: new, sToT{f:b} tToS{b:f}
  i=1 o/a: new, sToT{f:b,o:a} tToS{b:f,a:o}
  i=2 o/r: sToT has o -> a, but t[i] is r -> false
```

### Edge cases

```
- Different lengths -> false
- Empty strings -> true
- Same string -> true (identity mapping)
- Many-to-one mapping must fail ("ab" -> "aa")
```

Full JavaScript solution with tests: [05_isomorphic_strings.js](../solutions/05_isomorphic_strings.js). Run it with `node 05_isomorphic_strings.js` from the solutions folder.

</details>

## Common mistakes

- Checking only the s→t mapping; "ab" → "aa" passes one direction but two letters map to the same one. You need both directions.
- Comparing lengths is not enough by itself; patterns must match position by position.
- Using one map for both directions, mixing keys from s and t.

## Related follow-ups

- [Word Pattern](06_word_pattern.md) — the same bijection, letters to words
- Find and Replace Pattern (LeetCode #890) — isomorphism against many words
- [Group Anagrams](../02_Medium/08_group_anagrams.md) — canonical keys for grouping

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
