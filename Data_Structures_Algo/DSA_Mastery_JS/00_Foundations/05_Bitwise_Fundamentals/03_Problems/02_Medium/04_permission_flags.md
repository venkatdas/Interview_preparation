# Permission Flags with Masks

| | |
|---|---|
| **Topic** | Bitwise Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | bitmask as a set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [04_permission_flags.js](../solutions/04_permission_flags.js) — open only after a real attempt |

## Problem

A system has these permissions, in this bit order:
  READ=bit 0, WRITE=bit 1, DELETE=bit 2, SHARE=bit 3, ADMIN=bit 4
Implement a Permissions object over a single integer with operations:
  grant(name), revoke(name), toggle(name), has(name), hasAll(names), hasAny(names),
  list() -> names in bit order, and value() -> the integer.
Then process a list of operations and return the outputs of every query
(has/hasAll/hasAny/list/value), in order.

## Examples

```
ops: grant READ, grant WRITE, value, has DELETE, toggle READ, list, hasAny [READ, WRITE]
outputs: 3, false, ["WRITE"], true
ops: grant ADMIN, hasAll [ADMIN], revoke ADMIN, revoke ADMIN, value
outputs: true, 0                    (revoking twice is harmless)
```

## Constraints & clarifying questions

```
- Up to 1e5 operations.
- Unknown permission name? (throw)
- hasAll([]) -> true, hasAny([]) -> false (vacuous truth)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Masks*. Section 5.6 (mask table) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (a Set of names)   O(k) per hasAll/hasAny, O(F log F) per list. Store granted names in a Set; list() sorts by bit order; value() sums 2^bit. Readable and fine; the mask version is what low-level code (and React's lanes) do.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Give each flag a bit `1 << i`. Grant with `|=`, revoke with `&= ~bit` (never `^=`), toggle with `^=`. For a group query build `q` by OR-ing bits: all set is `(mask & q) === q`, any set is `(mask & q) !== 0`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- revoke a permission not granted -> no change (& ~bit is idempotent)
- grant twice -> no change (| is idempotent)
- empty query lists
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (a Set of names)   O(k) per hasAll/hasAny, O(F log F) per list

```
Store granted names in a Set; list() sorts by bit order; value() sums 2^bit.
Readable and fine; the mask version is what low-level code (and React's lanes) do.
```

### APPROACH 2 — Optimal (one integer bitmask)   O(1) per grant/revoke/toggle/has, O(k) to build a query mask

```
bit(name) = 1 << index
  grant:  mask |= bit       revoke: mask &= ~bit      toggle: mask ^= bit
  has:    (mask & bit) !== 0
  hasAll: (mask & q) === q  where q = OR of the query bits
  hasAny: (mask & q) !== 0
  list:   walk bits 0..4 and keep the set ones

Dry run: grant READ (00001), grant WRITE (00011) value 3; has DELETE -> 00011 & 00100 = 0 -> false;
  toggle READ -> 00010; list -> ["WRITE"]; hasAny [READ,WRITE]: q = 00011, 00010 & 00011 = 00010 != 0 -> true
```

### Edge cases

```
- revoke a permission not granted -> no change (& ~bit is idempotent)
- grant twice -> no change (| is idempotent)
- empty query lists
```

### Common mistakes

```
- mask & bit === bit without parentheses (=== binds tighter than &).
- Revoking with mask ^= bit (toggles it back ON if it was off).
- hasAll written as (mask & q) !== 0 (that is hasAny).
```

Full JavaScript solution with tests: [04_permission_flags.js](../solutions/04_permission_flags.js). Run it with `node 04_permission_flags.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #1684 Count the Number of Consistent Strings (letters as a mask).
- LeetCode #318 Maximum Product of Word Lengths.
- Store visited nodes of a graph with n ≤ 20 in a mask (bitmask DP preview).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
