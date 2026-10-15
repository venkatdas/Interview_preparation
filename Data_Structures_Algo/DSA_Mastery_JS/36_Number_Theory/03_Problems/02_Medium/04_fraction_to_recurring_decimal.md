# Fraction to Recurring Decimal

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | long division + remainder cycle |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #166 — https://leetcode.com/problems/fraction-to-recurring-decimal/ (statement paraphrased in our own words) |
| **Solution file** | [04_fraction_to_recurring_decimal.js](../solutions/04_fraction_to_recurring_decimal.js) — open only after a real attempt |

## Problem

Given two integers, a numerator and a non-zero denominator, write the fraction as a decimal string. If the digits after the point repeat forever, put the repeating block inside parentheses.

## Examples

```
Input: 1, 2      Output: "0.5"
Input: 2, 1      Output: "2"
Input: 4, 333    Output: "0.(012)"
Input: 1, 6      Output: "0.1(6)"
Input: -50, 8    Output: "-6.25"
```

## Constraints & clarifying questions

```
- Both values fit in a 32-bit signed integer, denominator != 0.
- The result is negative only when exactly one input is negative. "0" never gets a minus sign.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Simulate long division and detect a cycle in the remainders.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Do long division by hand on 1/6: remainders 1, 4, 4 ... When a remainder comes back, the digits repeat from where it first appeared.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Only d different remainders are possible (0..d-1), so within d steps the remainder becomes 0 (it terminates) or repeats. Store remainder -> index of the digit it produced in a Map.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Work with absolute values and handle the sign once. -2147483648 / -1 overflows in 32-bit languages but is fine in JS.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(d^2) time, O(d) space

```
Same long division, but remember remainders in an array and search it with indexOf
each step. Correct, but each search is O(d).
```

### APPROACH 2 — Optimal (long division + Map)   O(d) time, O(d) space

```
sign, integer part = |num| / |den|, rem = |num| % |den|
while rem != 0 and rem not in map:
  map[rem] = digits.length
  rem *= 10; digits.push(floor(rem / den)); rem %= den
if rem == 0: terminating
else: insert "(" at map[rem], ")" at the end
```

### Dry run

```
1 / 6: integer 0, rem 1
rem 1 (pos 0) -> 10/6 = 1, rem 4   digits "1"
rem 4 (pos 1) -> 40/6 = 6, rem 4   digits "16"
rem 4 seen at pos 1 -> "0.1(6)"
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Array + indexOf | O(d^2) | O(d) |
| Map of remainders | O(d) | O(d) |

### Edge cases

```
- 0 / -5 -> "0"
- exact integers -> no decimal point
- -2147483648 / -1 -> "2147483648"
```

### Common mistakes

- Applying the sign to each part separately, producing "-0.5" errors or "0.-5".
- Keying the map by digit instead of remainder (digits repeat without the sequence repeating).
- Using floating point division to get digits.

Full JavaScript solution with tests: [04_fraction_to_recurring_decimal.js](../solutions/04_fraction_to_recurring_decimal.js). Run it with `node 04_fraction_to_recurring_decimal.js` from the solutions folder.

</details>

## Related follow-ups

- Repeating Decimal period length = multiplicative order of 10 mod d (after removing 2s and 5s)
- Linked List Cycle II — same "first repeated state" idea
- Happy Number — cycle in a number sequence

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
