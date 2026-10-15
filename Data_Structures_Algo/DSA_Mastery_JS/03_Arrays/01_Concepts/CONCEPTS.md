# Arrays

An **array** is a numbered list of values stored side by side in memory. You reach any slot
instantly by its **index** (position), starting from 0. Think of a street with numbered houses:
if you know the house number, you walk straight to it. You do not knock on every door.

Arrays are the most common input in coding interviews. Almost every other topic (two pointers,
sliding window, prefix sums, sorting, binary search, heaps, DP) is built on top of them.

---

## Prerequisites

- [JavaScript For DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md): arrays, `Map`/`Set`, comparators, reference vs copy.
- [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md) and [Space Complexity](../../01_Complexity_Analysis/02_Space_Complexity/README.md): you must be able to say "O(n) time, O(1) extra space" for every answer.
- [How To Solve A Problem](../../02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem/README.md): the UMPIRE routine used on every problem page.

---

## Why it matters / when to use

Reach for array techniques when the problem says any of these:

- "Given an array of integers / a list of numbers / a sequence"
- "In-place", "O(1) extra space", "without using extra memory" -> swap / index-as-hash / cyclic sort
- "Subarray" (contiguous) -> Kadane, sliding window (`07_Sliding_Window`), prefix sum (`08_Prefix_Sums_And_Difference_Arrays`)
- "Rotate", "reverse", "shift" -> reversal trick
- "Values are in range 1..n" or "0..n-1" -> index as hash, cyclic sort
- "Sorted array" -> two pointers (`06_Two_Pointers`), binary search (`10_Searching`)
- "Majority", "appears more than n/2 times" -> Boyer-Moore voting
- "Product / sum of everything except self" -> prefix and suffix pass
- "Three values: 0, 1, 2" / "partition into three groups" -> Dutch national flag

---

## How it works

### Static vs dynamic arrays

A **static array** (C, Java `int[5]`) has a fixed size chosen when it is created. The slots are
**contiguous** in memory, so index `i` lives at `start + i * slotSize`. That is why reading
`arr[i]` is O(1): one multiplication, one addition, one memory read.

```
index:   0     1     2     3     4
       +-----+-----+-----+-----+-----+
       |  7  |  3  |  9  |  1  |  4  |
       +-----+-----+-----+-----+-----+
address: s    s+8   s+16  s+24  s+32      (8 bytes per slot)
```

A **dynamic array** (JS `Array`, Python `list`, Java `ArrayList`) wraps a static array and
**grows it when full**: allocate a bigger block (usually 1.5x-2x), copy everything over, free the
old one. One push occasionally costs O(n) for the copy, but spread over many pushes the average
is O(1). This is called **amortized O(1)**. See `02_Implementations/dynamic_array.js` for a hand-built version.

```
capacity 4, size 4:  [1][2][3][4]        push(5) -> full!
allocate capacity 8: [1][2][3][4][5][ ][ ][ ]   copy 4 items, then add 5
```

Why it is amortized O(1): to reach size n you copied 1 + 2 + 4 + ... + n/2 < n items in total,
so n pushes cost less than 2n work -> O(1) per push on average.

### How JavaScript arrays work under the hood

JS arrays look like objects with string keys, but V8 (Node, Chrome) stores them as real
contiguous arrays when it can. Things to know:

- **Packed vs holey.** `[1, 2, 3]` is "packed": every slot has a value. `new Array(5)` or
  `arr[10] = 1` on a short array creates **holes**, and V8 switches to a slower "holey"
  representation. Prefer `new Array(n).fill(0)` or `Array.from({ length: n }, ...)`.
- **Element kinds.** An array of only small integers is stored most compactly. Mixing in a
  float (`1.5`) or an object downgrades it permanently (still fine, just slower).
- **Length is not capacity.** V8 keeps a hidden backing store with spare room, so `push` is
  amortized O(1). `length` is just the number of used slots.
- **`shift`/`unshift` move every element** -> O(n). Do not use them as a queue in hot loops
  (see `17_Queues_And_Deques` for the fix).
- Arrays are **objects** passed by reference. `const b = a` does not copy; `a.slice()` or
  `[...a]` does (shallow).

### 2D arrays (matrix / grid)

A 2D array is an array of rows. `grid[row][col]`. Create it safely:

```js
const rows = 3, cols = 4;
const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
```

**Trap:** `new Array(rows).fill([])` or `new Array(rows).fill(new Array(cols).fill(0))` puts the
**same** inner array into every row. Writing `grid[0][1] = 5` changes every row. `fill` copies
the reference, it does not create fresh arrays. Always use `Array.from` with a callback.

More on grids in `09_Matrix_And_Multidimensional_Arrays`.

---

## Pseudocode

Most array problems are one of two shapes. Learn both by heart.

```
ONE PASS WITH A RUNNING ANSWER            WRITE-POINTER COMPACTION (in place)
best <- initial value                     write <- 0
for each x in arr:                        for read from 0 to n-1:
    update state using x                      if keep(arr[read]):
    best <- better(best, state)                    arr[write] <- arr[read]
return best                                        write <- write + 1
                                          return write        // new length
```

Kadane (maximum subarray) is the first shape with `state = max(x, state + x)`.
Move Zeroes / Remove Element / Remove Duplicates are the second shape with different `keep` rules.

---

## Dry run on a concrete example

Kadane on `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` (`cur = max(x, cur + x)`, `best = max(best, cur)`):

| i | x | cur + x | cur (after) | best (after) |
|---|---|---|---|---|
| 0 | -2 | - | -2 | -2 |
| 1 | 1 | -1 | 1 | 1 |
| 2 | -3 | -2 | -2 | 1 |
| 3 | 4 | 2 | 4 | 4 |
| 4 | -1 | 3 | 3 | 4 |
| 5 | 2 | 5 | 5 | 5 |
| 6 | 1 | 6 | 6 | 6 |
| 7 | -5 | 1 | 1 | 6 |
| 8 | 4 | 5 | 5 | 6 |

Answer 6 (subarray `[4, -1, 2, 1]`). Notice step 3: `cur + x = 2` is worse than starting fresh at 4, so the old prefix is dropped.

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| `arr[i]` read / write | O(1) | O(1) | direct address math |
| `push(x)` | O(1) amortized | O(1) | occasional O(n) resize |
| `pop()` | O(1) | O(1) | |
| `shift()` | O(n) | O(1) | every element moves left |
| `unshift(x)` | O(n) | O(1) | every element moves right |
| `splice(i, k, ...)` | O(n) | O(k) | shifts everything after `i` |
| `indexOf / includes / find` | O(n) | O(1) | linear scan, no index |
| `slice(i, j)` | O(j - i) | O(j - i) | shallow copy |
| `concat / spread [...a, ...b]` | O(n + m) | O(n + m) | creates a new array |
| `sort(cmp)` | O(n log n) | O(log n) to O(n) | TimSort in V8; **stable**; in place |
| `reverse()` | O(n) | O(1) | in place |
| `map / filter / reduce / forEach` | O(n) | O(n) / O(1) | one pass; map/filter allocate |
| `Array.from({length:n})` / `fill` | O(n) | O(n) | |
| search in **sorted** array | O(log n) | O(1) | binary search, see `10_Searching` |

---

## JavaScript implementation

JS already gives you a dynamic array. To understand what `push` really costs, `02_Implementations/dynamic_array.js`
builds one by hand on top of a fixed-capacity backing store:

```js
class DynamicArray {
  #items; #size = 0; #capacity;
  constructor(capacity = 4) { this.#capacity = capacity; this.#items = new Array(capacity); }

  push(value) {
    if (this.#size === this.#capacity) this.#resize(this.#capacity * 2); // the rare O(n) step
    this.#items[this.#size++] = value;
  }

  #resize(newCapacity) {
    const bigger = new Array(newCapacity);
    for (let i = 0; i < this.#size; i++) bigger[i] = this.#items[i];
    this.#items = bigger;
    this.#capacity = newCapacity;
  }
}
```

The file also has `pop`, `get`, `set`, `insertAt`, `removeAt` (both O(n) because they shift
elements) and a self-test.

---

## Patterns / variations

### 1. Simple traversal (one pass, keep a running answer)

```js
function maxValue(nums) {
  let best = -Infinity;            // sentinel: anything is bigger
  for (const num of nums) {
    if (num > best) best = num;
  }
  return best;
}
```
Use when: min/max/sum/count, "best so far" questions. Also the base of Best Time to Buy and Sell Stock
(track `minPrice` so far, compare each price against it).

### 2. In-place swap with a write pointer

```js
function moveZeroes(nums) {
  let writeIndex = 0;                          // next slot for a non-zero
  for (let readIndex = 0; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== 0) {
      [nums[writeIndex], nums[readIndex]] = [nums[readIndex], nums[writeIndex]];
      writeIndex++;
    }
  }
  return nums;
}
```
Use when: "remove X in place", "move X to the end", "return new length". Everything before
`writeIndex` is finished; everything after is unprocessed. (Full two-pointer family: `06_Two_Pointers`.)

### 3. Two-pass (collect a fact, then use it)

```js
function singleOutliers(nums) {
  const total = nums.reduce((sum, n) => sum + n, 0);  // pass 1: a global fact
  const result = [];
  for (const num of nums) {                           // pass 2: use it per element
    if (num > total / nums.length) result.push(num);  // above average
  }
  return result;
}
```
Use when: you need a global value (sum, max, count) before you can decide per element.
Two O(n) passes are still O(n).

### 4. Index as hash (values in range 1..n)

When values are in `1..n`, the value itself can point to an index. Mark "seen" by **negating**
the number at that index. No extra memory.

```js
function findDisappeared(nums) {
  for (const num of nums) {
    const index = Math.abs(num) - 1;        // abs: it may already be negated
    if (nums[index] > 0) nums[index] = -nums[index];   // mark index as seen
  }
  const missing = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) missing.push(i + 1);   // never flipped -> value i+1 never appeared
  }
  return missing;
}
```
Use when: "values in 1..n", "O(1) extra space", find missing/duplicates. Variation: add `n` to the
slot and read `nums[i] % n` if values can be 0.

### 5. Rotation via reversal

Rotate right by `k`: reverse all, reverse first `k`, reverse the rest.

```js
function rotate(nums, k) {
  k %= nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}
function reverse(arr, left, right) {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++; right--;
  }
}
```
`[1,2,3,4,5]`, k=2 -> reverse all `[5,4,3,2,1]` -> first 2 `[4,5,3,2,1]` -> rest `[4,5,1,2,3]`.
O(n) time, O(1) space.

### 6. Kadane's algorithm (maximum subarray sum)

At every index ask: "is it better to extend the previous subarray, or start fresh here?"

```js
function maxSubArray(nums) {
  let currentSum = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]); // extend or restart
    best = Math.max(best, currentSum);
  }
  return best;
}
```
Use when: "maximum sum subarray", "best contiguous ...". A negative running sum never helps, so drop it.
Maximum **product** subarray is the same idea but tracks a max and a min (negatives flip).

### 7. Dutch national flag (three-way partition)

Three pointers: `low` (end of 0s), `mid` (current), `high` (start of 2s).

```js
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0)      { [nums[low], nums[mid]] = [nums[mid], nums[low]]; low++; mid++; }
    else if (nums[mid] === 2) { [nums[mid], nums[high]] = [nums[high], nums[mid]]; high--; } // do NOT move mid
    else                      { mid++; }
  }
}
```
Use when: exactly three categories, one pass, O(1) space. Also quicksort's 3-way partition.

### 8. Prefix / suffix products (or sums)

```js
function productExceptSelf(nums) {
  const result = new Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) { result[i] = prefix; prefix *= nums[i]; } // product of left side
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) { result[i] *= suffix; suffix *= nums[i]; } // times right side
  return result;
}
```
Use when: "for each index, something about everything to the left and right". Full treatment of
prefix sums in `08_Prefix_Sums_And_Difference_Arrays`.

### 9. Cyclic sort (put value v at index v - 1)

```js
function cyclicSort(nums) {           // values 1..n, possibly with duplicates / out of range
  let i = 0;
  while (i < nums.length) {
    const correctIndex = nums[i] - 1;
    const inRange = nums[i] >= 1 && nums[i] <= nums.length;
    if (inRange && nums[correctIndex] !== nums[i]) {
      [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]]; // send it home, stay on i
    } else {
      i++;                              // already home, duplicate, or out of range
    }
  }
}
```
After this, the first index `i` where `nums[i] !== i + 1` tells you the missing number.
Each swap puts one number in its final place, so at most n swaps -> O(n). Used in First Missing Positive.

---

## Alternatives and trade-offs

| Task | Brute force | Better | Trade-off |
|---|---|---|---|
| Pair with a target sum | two loops, O(n^2) time, O(1) space | hash map O(n) time, O(n) space; or sort + two pointers O(n log n), O(1) | map is fastest; sorting loses indices |
| Max subarray sum | all subarrays O(n^2) | Kadane O(n), O(1) | Kadane needs "contiguous" |
| Rotate by k | k single shifts O(n·k) | extra array O(n) space; reversal O(n) time O(1) space | reversal is in place but less obvious |
| Find missing / duplicate in 1..n | sort O(n log n) or Set O(n) space | index-as-hash or cyclic sort O(n), O(1) | mutates the input |
| Remove items | `splice` in a loop O(n^2) | write pointer O(n), O(1) | order of the tail is unspecified |

---

## Common mistakes & edge cases

- **Off-by-one**: last index is `length - 1`; `slice(i, j)` excludes `j`; loops `< length` not `<=`.
- **Empty array** and **one element**: test them every time. Kadane on `[]` crashes if you read `nums[0]`.
- **Default `sort()` is lexicographic**: `[10, 9, 1].sort()` -> `[1, 10, 9]`. Always pass `(a, b) => a - b`.
- **`sort` mutates** the array. Copy first if the caller needs the original.
- **Shared rows** in 2D arrays made with `fill([])` (see above).
- **`const b = a` is not a copy**. Use `a.slice()` / `[...a]` for shallow copy, `structuredClone(a)` for deep.
- **`shift()` in a loop** turns O(n) into O(n^2). Use an index pointer instead.
- **Integer overflow** is a non-issue up to `Number.MAX_SAFE_INTEGER` (9e15), but products of
  many numbers can exceed it; mention `BigInt` if asked.
- **Modifying while iterating** with `splice` skips elements. Iterate backwards or build a new array.
- **Negative modulo**: `-1 % 5` is `-1` in JS. Use `((i % n) + n) % n` for circular indices.
- **k larger than length** in rotation: always `k %= n` first.

---

## When this does NOT apply

- **The data is not contiguous or you need fast insert/delete in the middle.** Arrays shift elements on every insert or delete (O(n)). A linked list, a deque, or a balanced tree fits better.
- **You need lookups by value.** Scanning an array is O(n). Use a `Set`/`Map` ([Hashing](../../05_Hashing/README.md)) or keep it sorted and [binary search](../../10_Searching/README.md).
- **Index-as-hash and cyclic sort** only work when values are in a known small range like 1..n and you may modify the input.
- **Kadane** only works for contiguous subarrays; for subsequences or "at most k elements" you need DP.
- **In-place tricks** are wrong if the caller still needs the original array; copy first or ask.

---

## Interview tips

- Clarify first: sorted or not? duplicates? negatives? empty input? size limits (is O(n^2) ok)?
  must it be in place? can you modify the input?
- Say the brute force out loud in one sentence ("check every pair, O(n^2)"), then ask yourself:
  "what information am I recomputing?" That usually points to a hash map, a sort, or two pointers.
- When the constraint says **O(1) extra space** and values are in `1..n`, say "I can use the array
  itself as a hash map by negating or by cyclic sort."
- When you see **subarray**, immediately think Kadane / sliding window / prefix sum.
- Walk through a 4-5 element example by hand before coding. Interviewers love a dry run.
- State complexity and **why**: "one pass, constant work per element, so O(n); only pointers, so O(1)."

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Two Sum | Easy | hash map (one pass) | 03_Problems/solutions/01_two_sum.js |
| 02 | Best Time to Buy and Sell Stock | Easy | running min | 03_Problems/solutions/02_best_time_to_buy_and_sell_stock.js |
| 03 | Contains Duplicate | Easy | set | 03_Problems/solutions/03_contains_duplicate.js |
| 04 | Maximum Subarray | Medium | Kadane | 03_Problems/solutions/04_maximum_subarray.js |
| 05 | Move Zeroes | Easy | write pointer / in-place swap | 03_Problems/solutions/05_move_zeroes.js |
| 06 | Remove Duplicates from Sorted Array | Easy | write pointer | 03_Problems/solutions/06_remove_duplicates_from_sorted_array.js |
| 07 | Rotate Array | Medium | reversal | 03_Problems/solutions/07_rotate_array.js |
| 08 | Product of Array Except Self | Medium | prefix / suffix | 03_Problems/solutions/08_product_of_array_except_self.js |
| 09 | Merge Sorted Array | Easy | fill from the back | 03_Problems/solutions/09_merge_sorted_array.js |
| 10 | Majority Element | Easy | Boyer-Moore voting | 03_Problems/solutions/10_majority_element.js |
| 11 | Missing Number | Easy | sum formula / XOR | 03_Problems/solutions/11_missing_number.js |
| 12 | Find All Numbers Disappeared in an Array | Easy | index as hash | 03_Problems/solutions/12_find_all_numbers_disappeared.js |
| 13 | Sort Colors | Medium | Dutch national flag | 03_Problems/solutions/13_sort_colors.js |
| 14 | Maximum Product Subarray | Medium | Kadane with max & min | 03_Problems/solutions/14_maximum_product_subarray.js |
| 15 | Next Permutation | Medium | scan from right + reverse | 03_Problems/solutions/15_next_permutation.js |
| 16 | First Missing Positive | Hard | cyclic sort | 03_Problems/solutions/16_first_missing_positive.js |
| 17 | 3Sum | Medium | sort + two pointers | 03_Problems/solutions/17_3sum.js |
| 18 | Find the Duplicate Number | Medium | Floyd cycle detection | 03_Problems/solutions/18_find_the_duplicate_number.js |

---

## Practice more

Easy: Plus One (66), Running Sum of 1d Array (1480), Squares of a Sorted Array (977),
Pascal's Triangle (118), Intersection of Two Arrays II (350), Find Pivot Index (724),
Check If N and Its Double Exist (1346)

Medium: Insert Delete GetRandom O(1) (380), Spiral Matrix (54), Set Matrix Zeroes (73),
Jump Game (55), Container With Most Water (11), Longest Consecutive Sequence (128),
Subarray Sum Equals K (560), Find Peak Element (162), Increasing Triplet Subsequence (334),
Rotate Image (48), Game of Life (289)

Hard: Trapping Rain Water (42), Median of Two Sorted Arrays (4), Sliding Window Maximum (239),
Candy (135)
