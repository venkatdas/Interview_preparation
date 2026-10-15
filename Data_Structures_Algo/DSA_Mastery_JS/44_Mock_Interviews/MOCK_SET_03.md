# Mock Interview Set 03 — Linked Lists & Monotonic Stack

**Time:** 60 minutes total. Problem 1: 20 min. Problem 2: 35 min. 5 min to review.
**Covers:** [`15_Linked_Lists`](../15_Linked_Lists/README.md), [`16_Stacks`](../16_Stacks/README.md)
**When:** end of week 6 (12-week plan) or end of week 2 (4-week plan)

**Rules**

- Timer on. Draw the linked list / stack on paper before coding.
- Brute force first, then name the pattern.
- Open the Hints only when the problem's time is half gone and you have nothing.

---

## Problem 1 — Reverse Linked List (LeetCode 206, Easy) — 20 min

**Links:** [LeetCode #206](https://leetcode.com/problems/reverse-linked-list/) · [curriculum statement + hints](../15_Linked_Lists/03_Problems/01_Easy/01_reverse_linked_list.md) (open after the mock)

Given the head of a singly linked list, reverse it and return the new head.

```
Input: 1 -> 2 -> 3 -> 4 -> 5   Output: 5 -> 4 -> 3 -> 2 -> 1
Input: 1 -> 2                  Output: 2 -> 1
Input: (empty)                 Output: (empty)
```

**Clarifying questions you should ask**

- Singly linked, no `prev` pointer? (yes)
- Can I modify the nodes in place? (yes, that is the point)
- Iterative or recursive? (do iterative first; be ready for recursive)

<details>
<summary>Hints</summary>

1. Brute force: copy values into an array, reverse, rebuild. O(n) extra space. Say it and move on.
2. In-place: three pointers `prev = null`, `curr = head`, `next`. Loop: save `next = curr.next`, point `curr.next = prev`, advance both.
3. Draw it for 2 nodes before writing code. The bug everyone makes is losing `next` before saving it.
4. Recursive version: `newHead = reverse(head.next); head.next.next = head; head.next = null; return newHead`.

</details>

**Expected complexity:** O(n) time, O(1) space iterative (O(n) stack space recursive).

**Follow-up questions an interviewer may ask**

- Reverse only positions `left` to `right` (Reverse Linked List II, 92). Where do you need a dummy node?
- Reverse in groups of k (Reverse Nodes in k-Group, 25). How do you check there are k nodes left?
- How do you check your answer without printing? (write a `toArray` helper and assert)

---

## Problem 2 — Daily Temperatures (LeetCode 739, Medium) — 35 min

**Links:** [LeetCode #739](https://leetcode.com/problems/daily-temperatures/) · [curriculum statement + hints](../16_Stacks/03_Problems/02_Medium/05_daily_temperatures.md) (open after the mock)

Given an array `temperatures`, return an array `answer` where `answer[i]` is the number of days you have to wait
after day `i` to get a warmer temperature. If there is no future warmer day, `answer[i] = 0`.

```
Input: [73, 74, 75, 71, 69, 72, 76, 73]   Output: [1, 1, 4, 2, 1, 1, 0, 0]
Input: [30, 40, 50, 60]                   Output: [1, 1, 1, 0]
Input: [30, 60, 90]                       Output: [1, 1, 0]
```

**Clarifying questions you should ask**

- Array length? (up to 10^5, so O(n^2) is too slow)
- Strictly warmer, or warmer-or-equal? (strictly)
- Temperatures range? (30 to 100; a bucket trick exists but is not needed)

<details>
<summary>Hints</summary>

1. Brute force: for each day scan forward until a warmer day. O(n^2). Say it.
2. "Next greater element" wording -> monotonic stack.
3. Keep a stack of **indices** whose temperatures are decreasing from bottom to top. For each new day `i`: while the top's temperature is lower than today's, pop it; its answer is `i - poppedIndex`. Then push `i`.
4. Each index is pushed once and popped at most once -> O(n). State that invariant out loud.
5. Why indices and not values? Because the answer is a distance in days.

</details>

**Expected complexity:** O(n) time, O(n) space for the stack.

**Follow-up questions an interviewer may ask**

- How would you solve "previous warmer day" instead? (same stack, resolved at push time instead of pop time)
- Can you do it with O(1) extra space? (iterate from the right, use `answer` array as a jump table; not required but a nice extra)
- What is a circular version? (Next Greater Element II, 503: loop `2n` times with `i % n`)
- How does this relate to Largest Rectangle in Histogram (84)? (same stack, compute both previous and next smaller)

---

## Self-review (5 min)

- [ ] I drew the pointers before coding the reversal and did not lose `next`.
- [ ] I said the monotonic stack invariant out loud ("stack stays decreasing").
- [ ] I stored indices in the stack, not values.
- [ ] I finished both problems within time.

Write 3 lines: what went well, what went wrong, what to review next.
