# Deep Clone with Cycles

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Hard |
| **Pattern** | recursive copy + WeakMap of visited |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [09_deep_clone.js](../solutions/09_deep_clone.js) — open only after a real attempt |

## Problem

Write deepClone(value) that returns a fully independent copy of value. It must:
  - copy arrays, plain objects, Map, Set and Date (Map keys/values and Set members are cloned too)
  - return primitives and functions as-is
  - preserve CYCLES (if obj.self === obj, then copy.self === copy)
  - preserve SHARED references (if obj.a === obj.b, then copy.a === copy.b, and both differ from obj.a)
  - keep values the JSON trick loses: undefined, NaN, Infinity, -0, Dates, Maps, Sets
After cloning, mutating the copy at any depth must never affect the original.

## Examples

```
Input:  { a: [1, { b: 2 }] }               Output: equal structure, copy.a !== input.a
Input:  o = { name: 'x' }; o.self = o       Output: c where c.self === c and c !== o
Input:  s = [1]; { p: s, q: s }             Output: c where c.p === c.q and c.p !== s
Input:  { d: new Date(0), m: new Map([[1, { z: 1 }]]) }   Output: real Date and Map, inner object copied
```

## Constraints & clarifying questions

```
- Which types must be supported? (primitives, arrays, plain objects, Map, Set, Date)
- Class instances / prototypes? (keep the prototype)
- Symbol keys, getters, non-enumerable props? (out of scope: own enumerable string keys)
- Can I use structuredClone? (not in the interview; we will use it only as a test oracle)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *References and identity*. Read sections 5.4–5.5 (aliasing, shallow vs deep copy) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (JSON round trip)   O(N) time, O(N) space. JSON.parse(JSON.stringify(value)). One line, and fine for pure JSON data, but it throws on cycles, turns shared references into separate copies, drops undefined, turns NaN/Infinity into null, Dates into strings, Maps/Sets into {}. It is the

</details>

<details><summary>Hint 3</summary>

**The key idea.** Keep a `WeakMap` from each original object to its copy. Create the empty copy and register it BEFORE cloning children. Then a child that points back (a cycle) or a second path to the same object (sharing) just returns the registered copy.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- cycles through arrays, Maps or Sets (register before recursing in EVERY branch)
- -0 and NaN inside arrays (primitives returned as-is: preserved)
- Date: copy the time value, do not share the Date object
- Object with a custom prototype: Object.create(Object.getPrototypeOf(value))
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (JSON round trip)   O(N) time, O(N) space

```
JSON.parse(JSON.stringify(value)). One line, and fine for pure JSON data, but it
throws on cycles, turns shared references into separate copies, drops undefined,
turns NaN/Infinity into null, Dates into strings, Maps/Sets into {}. It is the
baseline we test against on JSON-safe random inputs.
```

### APPROACH 2 — Optimal (recursive clone with a WeakMap of visited objects)   O(N) time, O(N) space

```
seen: WeakMap original -> copy.
  1. primitive or function -> return it
  2. seen.has(value) -> return seen.get(value)   (handles cycles AND sharing)
  3. create the empty copy of the right kind, and register seen.set(value, copy)
     BEFORE cloning children, so a child that points back finds the copy
  4. fill the copy by cloning each child with the same seen map
WeakMap (not Map) so the bookkeeping does not keep objects alive after we are done.

Dry run o = { name: 'x' }; o.self = o:
  clone(o): not seen -> copy = {}, seen {o -> copy}
    key name: 'x' primitive -> copy.name = 'x'
    key self: clone(o) -> seen has o -> return copy -> copy.self = copy
  result copy, copy.self === copy
```

### Edge cases

```
- cycles through arrays, Maps or Sets (register before recursing in EVERY branch)
- -0 and NaN inside arrays (primitives returned as-is: preserved)
- Date: copy the time value, do not share the Date object
- Object with a custom prototype: Object.create(Object.getPrototypeOf(value))
```

### Common mistakes

```
- Registering in `seen` AFTER cloning children -> infinite recursion on cycles.
- Treating Date / Map / Set as plain objects (Object.keys(new Map()) is []).
- typeof null === 'object' -> crash on Object.keys(null).
- Using JSON for anything with Dates or undefined.
```

Full JavaScript solution with tests: [09_deep_clone.js](../solutions/09_deep_clone.js). Run it with `node 09_deep_clone.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #133 Clone Graph (the same visited-map idea on a graph).
- LeetCode #138 Copy List with Random Pointer.
- Make deepClone iterative with an explicit stack so very deep inputs do not overflow.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
