# Two Pointers — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Multiple choice — opposite-end pointers for a pair sum need

A) a hash map  B) sorted input  C) distinct values  D) positive values

<details><summary>Answer</summary>

**B.**

</details>

### Q2. Predict the result

`nums = [1, 2, 4, 7, 11]`, target 9, opposite-ends template. Which indices are returned, and after how many comparisons?

<details><summary>Answer</summary>

`[1, 3]` after 3 comparisons: (0,4) 12 too big → r=3; (0,3) 8 too small → l=1; (1,3) 9 found.

</details>

### Q3. Spot the bug (Container With Most Water)

```js
while (l < r) {
  best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
  if (h[l] > h[r]) l++; else r--;
}
```

<details><summary>Answer</summary>

It moves the taller line. It must move the shorter one: `if (h[l] < h[r]) l++; else r--;`.

</details>

### Q4. Complexity — 3Sum with sorting + two pointers

<details><summary>Answer</summary>

O(n²) time (O(n log n) sort + n iterations of an O(n) scan), O(1) extra space besides the output (sorting may use O(log n)).

</details>

### Q5. Predict the output

```js
const nums = [0, 1, 0, 3, 12];
let w = 0;
for (let r = 0; r < nums.length; r++) if (nums[r] !== 0) nums[w++] = nums[r];
console.log(w, nums.join(','));
```

<details><summary>Answer</summary>

`3 1,3,12,3,12`. Only the first `w` slots matter; Move Zeroes would then fill the rest with 0.

</details>

### Q6. Spot the bug (linked list cycle)

```js
let slow = head, fast = head;
while (fast.next && fast) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; }
return false;
```

<details><summary>Answer</summary>

The condition reads `fast.next` before checking `fast`, so it crashes when `fast` becomes null (or when `head` is null). Use `while (fast && fast.next)`.

</details>

### Q7. Multiple choice — Merge Sorted Array (nums1 has room at the end) writes

A) from the front  B) from the back  C) into a new array  D) alternating ends

<details><summary>Answer</summary>

**B.**

</details>

### Q8. Spot the bug (3Sum duplicates)

```js
for (let i = 0; i < n - 2; i++) {
  if (nums[i] === nums[i + 1]) continue;
  ...
}
```

<details><summary>Answer</summary>

Comparing with `nums[i + 1]` skips the first of equal values, so `[-1, -1, 2]` is never found (the triplet needs both -1s). Compare with the previous one: `if (i > 0 && nums[i] === nums[i - 1]) continue;`.

</details>

### Q9. Complexity — Is Subsequence for one query with |s| = m and |t| = n

<details><summary>Answer</summary>

O(n) time (one pass over t, m ≤ n), O(1) space.

</details>

### Q10. Multiple choice — which problem is NOT a two-pointer problem?

A) Valid Palindrome  B) Squares of a Sorted Array  C) Subarray Sum Equals K with negative numbers  D) Remove Duplicates from Sorted Array

<details><summary>Answer</summary>

**C.** Negatives break monotonicity; use prefix sums + a hash map.

</details>

### Q11. Predict the output (Dutch flag)

Partition `[2, 0, 1]` around pivot 1 using low/mid/high. What is the array after the algorithm finishes?

<details><summary>Answer</summary>

`[0, 1, 2]`. mid=0: 2 > 1, swap with high=2 → `[1, 0, 2]`, high=1. mid=0: 1 equal, mid=1. mid=1: 0 < 1, swap with low=0 → `[0, 1, 2]`, low=1, mid=2 > high, stop.

</details>

### Q12. Spot the bug (valid palindrome II)

```js
if (s[l] !== s[r]) return isPal(s, l + 1, r);
```

<details><summary>Answer</summary>

It only tries deleting the left character. It must try both: `return isPal(s, l + 1, r) || isPal(s, l, r - 1);`.

</details>

## Mastery checklist

- [ ] I can name the five pointer shapes and give a problem for each.
- [ ] I can prove why each pointer move is safe for Two Sum II and Container With Most Water.
- [ ] I can write 3Sum with correct duplicate skipping in under 15 minutes.
- [ ] I can explain Floyd's cycle detection and find the cycle start.
- [ ] I scored at least 10/12 on this quiz.
