# Cursor Editor

| | |
|---|---|
| **Set** | [Mixed Set 03](README.md) — problem 04 of 5 |
| **Difficulty** | Easy |
| **Time box** | 20 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [04_cursor_editor.js](solutions/04_cursor_editor.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A tiny text editor starts empty with the cursor at position 0. It receives a string of
key presses `keys`:
  - a lowercase letter: insert it at the cursor (cursor moves right after it)
  - '<': move the cursor one left (ignored at the start)
  - '>': move the cursor one right (ignored at the end)
  - '#': delete the character just left of the cursor (ignored at the start)
Return the final text.

## Examples

```
Input: "ab<c"      Output: "acb"
Input: "abc<<#d"   Output: "dbc"   Explanation: cursor after 'a', delete 'a', type 'd'
Input: "<#>"       Output: ""
```

## Constraints & clarifying questions

```
- Up to 10^5 key presses. Inserting into the middle of an array is O(n) each.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Two stacks around the cursor (a gap buffer, the array version of a doubly linked list split at the cursor). See [Stacks](../../../16_Stacks/README.md) and [Linked Lists](../../../15_Linked_Lists/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: an array and splice at the cursor index.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Everything left of the cursor is a stack, everything right is another stack. Every key press touches only the two tops.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- moves/deletes at the boundaries are ignored
- empty input -> ""
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
Keep the text in an array and use splice at the cursor index for every insert/delete.
```

### APPROACH 2 — Optimal (two stacks = a "gap buffer", like a doubly linked list split at the cursor)   O(n) time, O(n) space

```
Left stack holds the characters before the cursor (top = closest), right stack holds the
characters after it (top = closest). Insert = push left. '#' = pop left. '<' = move one
from left to right. '>' = move one from right to left. Answer = left + reversed right.

Dry run on "abc<<#d":
  a,b,c      left [a,b,c]  right []
  <          left [a,b]    right [c]
  <          left [a]      right [c,b]
  #          left []       right [c,b]
  d          left [d]      right [c,b]
  text = "d" + reverse([c,b]) = "dbc"
```

### Edge cases

```
- moves/deletes at the boundaries are ignored
- empty input -> ""
```

### Common mistakes

```
- Forgetting to reverse the right stack at the end.
- Building strings with += inside the loop at the middle (O(n^2)).
```

Full JavaScript solution with tests: [04_cursor_editor.js](solutions/04_cursor_editor.js). Run it with `node solutions/04_cursor_editor.js` from this folder.

</details>

## Related follow-ups

- Add undo / redo (two more stacks)
- Move the cursor k steps at once and return the 10 characters left of it (LeetCode #2296)
- Support "jump to start of line"

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
