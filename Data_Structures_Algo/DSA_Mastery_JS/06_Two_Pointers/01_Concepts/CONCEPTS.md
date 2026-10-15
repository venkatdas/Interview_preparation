# Two Pointers

**Two pointers** means walking through an array (or string, or linked list) with two
indices instead of one, and moving them according to a rule so that you never have to
look at every pair. Think of two people searching a sorted bookshelf for two books whose
prices add up to $50: one starts at the cheap end, one at the expensive end, and each step
one of them moves inward based on whether the current total is too high or too low.
They meet in the middle having checked only n pairs instead of n².

---

## Prerequisites

- [Arrays](../../03_Arrays/README.md): in-place updates and index arithmetic.
- [Hashing](../../05_Hashing/README.md): the O(n)-space alternative you should compare against.
- [Sorting](../../11_Sorting/README.md) (at least `sort((a, b) => a - b)`): many pointer patterns need sorted input.

---

## Why it matters / when to use

Signals in a problem statement that scream "two pointers":

- The input is **sorted** (or you are allowed to sort it)
- "Pair / triplet that sums to...", "closest to target", "container", "two ends"
- **In-place** modification with O(1) extra space: "remove", "move zeroes", "deduplicate"
- "Palindrome", "reverse", "compare from both ends"
- Merging / comparing **two sequences**: "is subsequence", "merge sorted", "intersection"
- **Linked list**: cycle detection, middle node, k-th from the end (fast & slow)
- "Partition into regions": sort colors, quicksort partition
- You wrote a brute force with nested loops and the inner loop only moves *one way*

Two pointers is a **space saver**: hashing solves many of the same problems with O(n)
extra memory; two pointers often does it in O(1), but usually needs sorted input.

---

## How it works

### 1. Opposite directions (converging)

```
target = 9           sorted: [1, 2, 4, 7, 11]
                              L           R     1 + 11 = 12 > 9  -> R--
                              L       R         1 + 7  = 8  < 9  -> L++
                                 L    R         2 + 7  = 9  found
```

Each step **eliminates** one index forever. n steps max → O(n).

### 2. Same direction (slow / fast, read / write)

```
remove zeroes in place:   [0, 1, 0, 3, 12]
  read scans everything, write marks where the next KEPT value goes

  read=0 val=0  skip               write=0   [0, 1, 0, 3, 12]
  read=1 val=1  nums[0]=1          write=1   [1, 1, 0, 3, 12]
  read=2 val=0  skip               write=1
  read=3 val=3  nums[1]=3          write=2   [1, 3, 0, 3, 12]
  read=4 val=12 nums[2]=12         write=3   [1, 3, 12, 3, 12]
  fill the rest with 0 ->                    [1, 3, 12, 0, 0]
```

`write <= read` always, so we never overwrite data we still need.

### 3. Pointers on two arrays

```
a = [1, 3, 5]      b = [2, 4]
     i                  j        1 < 2 -> take 1, i++
        i               j        3 > 2 -> take 2, j++
        i                  j     3 < 4 -> take 3, i++
           i               j     5 > 4 -> take 4, j++
           i                     b exhausted -> take the rest of a
```

### 4. Fast & slow on a linked list (Floyd)

```
1 -> 2 -> 3 -> 4 -> 5 -> 6
                ^         |
                +---------+
slow: 1 2 3 4 5 6 4 5 6 ...
fast: 1 3 5 4 6 5 4 ...        they meet inside the loop
```

If `fast` reaches `null` there is no cycle. Inside a cycle, the gap between them shrinks
by 1 each step, so they must meet.

### 5. Partition (three regions)

```
Dutch national flag, pivot = 1 on [2, 0, 2, 1, 1, 0]
  [0, low)   -> values < pivot
  [low, mid) -> values == pivot
  (high, n)  -> values > pivot
  [mid, high]-> unexplored; mid scans it
```

### How to PROVE a pointer move never skips the answer

This is what interviewers want to hear. For opposite-ends Two Sum on sorted input:

> Suppose `nums[left] + nums[right] < target`. Then `nums[left]` paired with ANY index
> `≤ right` is also `< target` (those values are even smaller). So `left` can never be part
> of the answer; discarding it loses nothing. The symmetric argument discards `right` when
> the sum is too big. Every step discards one index that provably cannot be in the answer,
> so when the pointers meet we have examined every possible pair implicitly.

For Container With Most Water: moving the **shorter** wall inward is safe because keeping it
and moving the taller one can only shrink the width while the height stays capped by the
shorter wall.

For read/write: the output region `[0, write)` only contains elements that were already
read, so nothing unread is ever destroyed.

---

## Pseudocode

```
OPPOSITE ENDS (sorted input)             READ / WRITE (same direction)
l <- 0, r <- n-1                          write <- 0
while l < r:                              for read in 0..n-1:
    s <- a[l] + a[r]                          if keep(a[read]):
    if s == target: return (l, r)                 a[write] <- a[read]; write += 1
    if s < target: l += 1   // need bigger    return write
    else:          r -= 1   // need smaller
return not found
```

---

## Dry run on a concrete example

Two Sum II on sorted `[1, 3, 4, 6, 9]`, `target = 10`:

| step | l | r | a[l] + a[r] | decision |
|---|---|---|---|---|
| 1 | 0 | 4 | 1 + 9 = 10 | found |

A longer one, `target = 7`:

| step | l | r | a[l] + a[r] | decision |
|---|---|---|---|---|
| 1 | 0 | 4 | 1 + 9 = 10 | too big, r -= 1 |
| 2 | 0 | 3 | 1 + 6 = 7 | found (indices 0 and 3) |

At step 1, `9` cannot pair with anything: its smallest partner `1` already overshoots, so dropping it is safe. That one sentence is the correctness proof.

---

## Operations & complexity

| Pattern | Time | Space | Note |
|---------|------|-------|------|
| Opposite ends | O(n) | O(1) | requires sorted input (or sorting first: O(n log n)) |
| Read / write | O(n) | O(1) | in-place, preserves relative order |
| Two arrays | O(n + m) | O(1) extra (or O(n+m) output) | merge, subsequence, intersection |
| Fast & slow (list) | O(n) | O(1) | cycle, middle, k-th from end |
| Partition | O(n) | O(1) | 3 regions, one pass, does NOT preserve order |
| 3Sum (sort + 2 pointers) | O(n²) | O(1) extra | beats O(n³) brute force |
| k-Sum | O(n^(k-1)) | O(1) extra | recursion down to 2Sum |

---

## JavaScript implementation

Full runnable templates with tests: `02_Implementations/two_pointer_templates.js`. The core shapes:

```js
// 1. opposite ends (sorted)
let left = 0, right = nums.length - 1;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  if (sum < target) left++; else right--;
}

// 2. read / write
let write = 0;
for (let read = 0; read < nums.length; read++) {
  if (keep(nums[read])) nums[write++] = nums[read];
}
return write;

// 3. fast & slow
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next; fast = fast.next.next;
  if (slow === fast) return true;
}
```

---

## Patterns / variations

### 1. Sorted pair sum (opposite ends)

```js
function twoSumSorted(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    sum < target ? left++ : right--;
  }
  return [];
}
```
Use when: sorted array + "find a pair". Extends to 3Sum/4Sum by fixing one element and
running this on the rest (skip duplicates to avoid repeated triplets).

### 2. Palindrome check (opposite ends, with one allowed skip)

```js
function isPalindromeRange(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
  }
  return true;
}
// Valid Palindrome II: on first mismatch, try skipping either side once.
```

### 3. In-place filter / compaction (read & write)

```js
function removeElement(nums, val) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) nums[write++] = nums[read];
  }
  return write;
}
```
Use when: "remove in place", "at most k duplicates", "move zeroes". Variation: for "at most
2 copies" compare `nums[read]` with `nums[write - 2]`.

### 4. Fill from the back

```js
// merge nums2 into nums1 (which has spare room at the end) without overwriting
let i = m - 1, j = n - 1, write = m + n - 1;
while (j >= 0) {
  nums1[write--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
}
```
Use when: the destination has empty space at the end (Merge Sorted Array, Squares of
Sorted Array: biggest square is at one of the ends).

### 5. Greedy pairing (sort, then both ends)

```js
// Boats: heaviest + lightest share a boat if they fit, else heaviest goes alone
people.sort((a, b) => a - b);
let light = 0, heavy = people.length - 1, boats = 0;
while (light <= heavy) {
  if (people[light] + people[heavy] <= limit) light++;
  heavy--; boats++;
}
```

### 6. Two pointers over two sequences

```js
function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) if (s[i] === t[j]) i++;
  return i === s.length;
}
```
Use when: comparing two strings/arrays in order (subsequence, merge, backspace compare
walking both from the end).

### 7. Trapping Rain Water with two pointers

Keep `leftMax` and `rightMax`. Water at the shorter side is decided by that side's max
only, because the other side is guaranteed to have an even taller wall. Move the shorter
side inward. See `03_Problems/solutions/12_trapping_rain_water.js` for the full argument.

---

## Alternatives and trade-offs

| Problem | Two pointers | Alternative | Trade-off |
|---|---|---|---|
| Pair sum | sort + converge: O(n log n), O(1) | hash map: O(n), O(n) | map keeps original indices and is faster |
| Remove / compact | read-write: O(n), O(1) | `filter` into a new array | `filter` is clearer but allocates |
| 3Sum | sort + loop + converge: O(n^2) | hash set per fixed element: O(n^2), O(n) | pointers make de-duplication easy |
| Trapping Rain Water | O(n), O(1) | prefix/suffix max arrays O(n), O(n); monotonic stack O(n) | arrays are easier to explain first |

---

## Common mistakes & edge cases

- Forgetting to **sort** before using opposite-end pointers (Two Sum on unsorted input needs a Map).
- Off-by-one: `while (left < right)` vs `while (left <= right)`. Pairs need `<`; a single
  element check (binary search style) needs `<=`.
- 3Sum: not skipping duplicates for the fixed element AND for both inner pointers → repeated triplets.
- Read/write: returning `nums` instead of the new length, or forgetting that elements past
  `write` are garbage.
- Merge from the back: forgetting the leftover `nums2` elements (the leftover `nums1` ones are already in place).
- Dutch flag: advancing `mid` after swapping with `high` (the swapped-in element is unexamined).
- Fast & slow: checking `fast.next` before `fast` → null pointer error. Always `while (fast && fast.next)`.
- Container With Most Water: moving the taller side. Always move the **shorter** one.
- Empty input, single element, all elements equal, all negative - test them.

---

## When this does NOT apply

- **Unsorted input where you must return original indices** and sorting is not allowed: use a hash map.
- **Contiguous range with a running condition** ("longest substring where..."): that is the [sliding window](../../07_Sliding_Window/README.md) specialisation of same-direction pointers.
- **Negative numbers with sum targets over subarrays**: moving a pointer no longer changes the sum monotonically; use [prefix sums + hash map](../../08_Prefix_Sums_And_Difference_Arrays/README.md).
- **You cannot argue why moving a pointer never skips the answer.** If there is no monotonic reason, the pattern does not apply.

---

## Interview tips

- Say the invariant out loud. "Everything left of `write` is the final answer so far."
  "The answer pair is always between `left` and `right`."
- Then say **why** moving a pointer is safe (see the proof section). This is the part
  that separates "memorised the trick" from "understands it".
- If the input is not sorted, ask: "May I sort it? That costs O(n log n) but then I can
  do the rest in O(n) with O(1) space." Compare with the hash-map approach (O(n) time,
  O(n) space) and let the interviewer pick.
- For k-Sum problems, state the complexity pattern: 2Sum O(n), 3Sum O(n²), 4Sum O(n³).
- Related topics: `05_Hashing` (the O(n)-space alternative), `07_Sliding_Window` (two
  same-direction pointers that bound a contiguous range), `10_Searching` (the other
  way to exploit sorted input), `15_Linked_Lists` (fast & slow applications).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Reverse String & Reverse Vowels | Easy | opposite ends, swap | 03_Problems/solutions/01_reverse_string_and_vowels.js |
| 02 | Valid Palindrome II | Easy | opposite ends, one skip | 03_Problems/solutions/02_valid_palindrome_ii.js |
| 03 | Two Sum II (sorted) | Medium | opposite ends | 03_Problems/solutions/03_two_sum_ii_sorted.js |
| 04 | Remove Element | Easy | read / write | 03_Problems/solutions/04_remove_element.js |
| 05 | Move Zeroes | Easy | read / write | 03_Problems/solutions/05_move_zeroes.js |
| 06 | Remove Duplicates from Sorted Array II | Medium | read / write (look back k) | 03_Problems/solutions/06_remove_duplicates_sorted_array_ii.js |
| 07 | Squares of a Sorted Array | Easy | opposite ends, fill from back | 03_Problems/solutions/07_squares_of_sorted_array.js |
| 08 | Merge Sorted Array | Easy | two arrays, fill from back | 03_Problems/solutions/08_merge_sorted_array.js |
| 09 | Is Subsequence | Easy | two sequences | 03_Problems/solutions/09_is_subsequence.js |
| 10 | Backspace String Compare | Easy | two sequences from the back | 03_Problems/solutions/10_backspace_string_compare.js |
| 11 | Container With Most Water | Medium | opposite ends, greedy move | 03_Problems/solutions/11_container_with_most_water.js |
| 12 | Trapping Rain Water | Hard | opposite ends + running max | 03_Problems/solutions/12_trapping_rain_water.js |
| 13 | 3Sum | Medium | sort + opposite ends | 03_Problems/solutions/13_three_sum.js |
| 14 | 3Sum Closest | Medium | sort + opposite ends | 03_Problems/solutions/14_three_sum_closest.js |
| 15 | 4Sum | Medium | sort + nested opposite ends | 03_Problems/solutions/15_four_sum.js |
| 16 | Sort Colors | Medium | Dutch flag partition | 03_Problems/solutions/16_sort_colors.js |
| 17 | Boats to Save People | Medium | sort + greedy pairing | 03_Problems/solutions/17_boats_to_save_people.js |
| 18 | Partition Labels | Medium | last-index + expanding end | 03_Problems/solutions/18_partition_labels.js |

---

## Practice more

Easy: Valid Palindrome (125), Intersection of Two Arrays II (350), Remove Duplicates from
Sorted Array (26), Middle of the Linked List (876), Linked List Cycle (141), Merge Two
Sorted Lists (21), Assign Cookies (455), Find the Index of the First Occurrence (28)

Medium: Sort Array By Parity (905), Longest Mountain in Array (845), Interval List
Intersections (986), Remove Nth Node From End of List (19), Linked List Cycle II (142),
Next Permutation (31), Rotate Array (189), Bag of Tokens (948), Shortest Unsorted
Continuous Subarray (581), Minimum Size Subarray Sum (209), Max Number of K-Sum Pairs (1679)

Hard: Minimum Window Substring (76), Shortest Subarray to be Removed to Make Array Sorted
(1574), Count Pairs With Sum Less Than K variations
