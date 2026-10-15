# Hashing (Hash Tables, Map & Set)

A **hash table** stores key → value pairs so that you can find a value by its key in
**O(1) average time**, no matter how many items there are. Think of a coat check at a
theatre: you hand over your coat, get ticket number 42, and later the attendant walks
straight to hook 42. No searching through every coat. The **hash function** is the thing
that turns "your coat" (the key) into "hook 42" (an array index).

In JavaScript the built-in `Map`, `Set` and plain objects `{}` are all hash tables.
Hashing is the single most used trick in interviews: it turns "search the whole array"
(O(n)) into "look it up" (O(1)), which turns many O(n²) solutions into O(n).

---

## Prerequisites

- [Arrays](../../03_Arrays/README.md) and [Strings](../../04_Strings/README.md): the inputs we hash.
- [JavaScript For DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md): `Map` vs object vs `Set`, key equality.
- [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md): amortized and average-case analysis.

---

## Why it matters / when to use

Reach for a hash table when the problem says any of these:

- "Have I **seen** this before?" → `Set`
- "**How many** times does each thing appear?" → frequency `Map`
- "Find a pair that adds up to / matches ..." → complement lookup (Two Sum)
- "**Group** things that are the same in some way" (anagrams, same shape) → group by canonical key
- "Where was the **last index** of this value?" → index map
- "Count subarrays whose sum is k" → prefix sum + hash map
- "Does string A have the letters to build string B?" → counting
- You wrote two nested loops and the inner loop only *searches* → replace it with a map

Hashing does **not** help when you need order (sorted min/max, "next greater") or ranges
("all keys between 10 and 20"). For those use sorting, heaps, or trees.

---

## How it works

### Hash function

A hash function takes a key and returns a number. We take that number modulo the array
size to get a bucket index.

```
key "cat"  ->  hash("cat") = 98262  ->  98262 % 8 = 6  ->  buckets[6]
key "dog"  ->  hash("dog") = 99644  ->  99644 % 8 = 4  ->  buckets[4]
```

A good hash function is **fast**, **deterministic** (same key → same number every time),
and **spreads keys evenly** across the buckets.

A classic string hash (what `02_Implementations/hash_table.js` uses):

```js
function hashString(key, size) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0; // | 0 keeps it a 32-bit int
  }
  return Math.abs(hash) % size;
}
```

### Collisions

Two different keys can land on the same index. This is a **collision** and it is
unavoidable (infinitely many keys, finitely many buckets). Two standard fixes:

**1. Separate chaining** - each bucket is a small list. Colliding keys sit together.

```
buckets
[0] -> []
[1] -> [ ["apple", 3] ]
[2] -> []
[3] -> [ ["cat", 1], ["act", 5] ]     <- collision: both hashed to 3
[4] -> [ ["dog", 2] ]
```

Lookup = hash to the bucket, then scan the short chain. If chains stay short, it's O(1).

**2. Open addressing** - no lists. If bucket 3 is taken, try 4, then 5, ... (linear
probing) until you find an empty slot. Lookups follow the same path. Deletion is tricky
(you must leave a "tombstone" so later lookups don't stop early). V8 (Node/Chrome) uses
a variant of open addressing for `Map` and `Set`.

### Load factor & resizing

```
load factor = items stored / number of buckets
```

As the load factor grows, chains get longer and lookups slow down. When it crosses a
threshold (commonly **0.75**), the table **doubles** its bucket array and re-inserts every
item (their indexes change because the modulus changed). That resize is O(n), but it
happens so rarely that the **amortized** cost per insert is still O(1).

```
capacity 4, insert 4th item -> load 1.0 > 0.75 -> grow to 8, re-hash everything
```

### Why average O(1) but worst case O(n)

If every key hashes to the same bucket, the table is one long chain and every lookup
walks it: O(n). A good hash function makes this astronomically unlikely, so we say
**O(1) average**. In interviews, state "O(1) average, O(n) worst case" once and move on.

---

## Pseudocode

```
HASH TABLE WITH SEPARATE CHAINING
put(key, value):
    b <- hash(key) mod capacity
    if bucket[b] has an entry with this key: replace its value; return
    append (key, value) to bucket[b]; size += 1
    if size / capacity > LOAD_FACTOR: resize to 2 * capacity and re-insert everything
get(key):
    b <- hash(key) mod capacity
    return the value of the entry with this key in bucket[b], or undefined

COMPLEMENT LOOKUP (the most used interview pattern)
seen <- empty map
for i, x in arr:
    if seen has (target - x): return [seen[target - x], i]
    seen[x] <- i
```

---

## Dry run on a concrete example

Two Sum on `nums = [2, 7, 11, 15]`, `target = 9`:

| i | x | need = target - x | seen before step | found? | seen after |
|---|---|---|---|---|---|
| 0 | 2 | 7 | {} | no | {2:0} |
| 1 | 7 | 2 | {2:0} | yes, index 0 | - |

Answer `[0, 1]`. The check happens *before* inserting `x`, so an element never pairs with itself.

---

## Operations & complexity

| Operation | Time (avg) | Time (worst) | Space | Note |
|-----------|-----------|--------------|-------|------|
| set(key, value) | O(1) | O(n) | O(1) | amortized; a resize is O(n) but rare |
| get(key) | O(1) | O(n) | O(1) | |
| has(key) | O(1) | O(n) | O(1) | |
| delete(key) | O(1) | O(n) | O(1) | |
| iterate all | O(n) | O(n) | O(1) | Map/Set keep insertion order |
| find min / max key | O(n) | O(n) | O(1) | not what hash tables are for |

Total space for n items: O(n).

---

## JavaScript implementation

Full code with tests: `02_Implementations/hash_table.js`. It implements `HashTable` (separate chaining,
resize at 0.75) and a `HashSet` built on top of it. Core idea:

```js
class HashTable {
  #buckets = Array.from({ length: 8 }, () => []);
  #count = 0;

  #index(key) { return hashString(String(key), this.#buckets.length); }

  set(key, value) {
    const bucket = this.#buckets[this.#index(key)];
    for (const pair of bucket) if (pair[0] === key) { pair[1] = value; return this; }
    bucket.push([key, value]);
    if (++this.#count / this.#buckets.length > 0.75) this.#resize();
    return this;
  }

  get(key) {
    for (const [k, v] of this.#buckets[this.#index(key)]) if (k === key) return v;
    return undefined;
  }
}
```

### Map vs Set vs plain object vs WeakMap

| | `Map` | `Set` | plain object `{}` | `WeakMap` |
|---|---|---|---|---|
| Key types | anything (objects, numbers, NaN...) | anything (values) | strings & symbols only (numbers become strings!) | objects only |
| Order | insertion order | insertion order | integer keys first (ascending), then strings in insertion order | not iterable |
| Size | `map.size` O(1) | `set.size` O(1) | `Object.keys(o).length` O(n) | none |
| Check key | `map.has(k)` | `set.has(v)` | `k in o` / `Object.hasOwn(o, k)` | `wm.has(k)` |
| Prototype junk | none | none | `o['toString']` exists! use `Object.create(null)` | none |
| Garbage collection | holds keys strongly | strongly | strongly | keys can be collected (good for caches on DOM nodes) |
| Performance | fastest for frequent add/delete | same | fast for small fixed string keys; JS engines optimise object shapes | similar to Map |

Rules of thumb for interviews:
- Counting characters / numbers → `Map` (or an array of 26 / 128 counts when keys are letters/ASCII: even faster).
- "Seen before?" → `Set`.
- Keys are objects (nodes, DOM elements) → `Map`, or `WeakMap` if you don't want to leak memory.
- Plain object is fine for string keys, but remember `obj[1]` and `obj['1']` are the same key.

```js
const map = new Map();
map.set('a', 1).set('b', 2);           // chainable
map.get('a');                          // 1
map.get('zzz');                        // undefined
map.set('a', (map.get('a') ?? 0) + 1); // increment pattern
for (const [key, value] of map) {}     // insertion order
[...map.keys()], [...map.values()], [...map.entries()];

const set = new Set([1, 2, 2, 3]);     // {1, 2, 3} -> instant de-duplication
set.has(2); set.add(4); set.delete(1); set.size;
```

---

## Patterns / variations

### 1. Frequency count

```js
function countFrequency(items) {
  const freq = new Map();
  for (const item of items) freq.set(item, (freq.get(item) ?? 0) + 1);
  return freq;
}
// For lowercase letters an array is even faster:
// const counts = new Array(26).fill(0); counts[ch.charCodeAt(0) - 97]++;
```
Use when: anagrams, "most frequent", "first unique character", "can build ransom note".

### 2. Seen-set (have I met this before?)

```js
function hasDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
```
Use when: "contains duplicate", cycle detection in Linked lists / Happy Number, visited nodes in graphs.

### 3. Complement lookup (Two Sum)

Instead of asking "for every x, is there a y later?", ask "for the current x, did I already
see `target - x`?" One pass, one map.

```js
function twoSum(nums, target) {
  const indexOf = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (indexOf.has(complement)) return [indexOf.get(complement), i];
    indexOf.set(nums[i], i);
  }
  return [];
}
```
Use when: "find two things that combine to X" - sums, differences, products, pairs of words.

### 4. Grouping by canonical key

Pick a **key that is identical for everything that belongs together** and push into a map of arrays.

```js
function groupAnagrams(words) {
  const groups = new Map();
  for (const word of words) {
    const key = [...word].sort().join(''); // "eat","tea","ate" -> "aet"
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}
```
Use when: group anagrams, group by shape/pattern, isomorphic strings (bijection check).

### 5. Index map (value → last index seen)

```js
function hasNearbyDuplicate(nums, k) {
  const lastIndex = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (lastIndex.has(nums[i]) && i - lastIndex.get(nums[i]) <= k) return true;
    lastIndex.set(nums[i], i); // always store the most recent index
  }
  return false;
}
```
Use when: "distance between repeats", sliding windows that jump (`Longest Substring Without Repeating`).

### 6. Prefix sum + hash (teaser, full treatment in `08_Prefix_Sums_And_Difference_Arrays`)

Running sum so far is `s`. A subarray ending here with sum k exists if some earlier prefix
equals `s - k`. Store how many times each prefix sum has appeared.

```js
function subarraySum(nums, k) {
  const seenPrefix = new Map([[0, 1]]); // empty prefix
  let runningSum = 0, count = 0;
  for (const num of nums) {
    runningSum += num;
    count += seenPrefix.get(runningSum - k) ?? 0;
    seenPrefix.set(runningSum, (seenPrefix.get(runningSum) ?? 0) + 1);
  }
  return count;
}
```
Use when: "number of subarrays with sum / remainder / balance equal to k".

### 7. Counting pairs (map of sums)

When you need to combine 4 lists, hash the sums of the first two, then look up the negated
sums of the last two: O(n²) instead of O(n⁴). (4Sum II.)

### 8. Bucket sort by frequency

After counting, the counts are at most n. Make an array of buckets indexed by count and walk
it from the end to get the top k in O(n). (Top K Frequent Elements.)

---

## Alternatives and trade-offs

| Need | Hash-based | Alternative | When the alternative wins |
|---|---|---|---|
| Membership / counts | `Set` / `Map`, O(1) average | sort + scan, O(n log n), O(1) extra | memory is tight, or output must be sorted anyway |
| Pair sum | complement map O(n) | sort + two pointers | O(1) space and indices are not needed |
| Small known key range (a-z, 0..1000) | `Map` | plain array indexed by key | always faster and simpler |
| Ordered keys (floor, ceiling, range) | not supported | balanced BST / sorted array + binary search | you need order, not just equality |
| Approximate membership at huge scale | `Set` uses lots of memory | Bloom filter ([advanced structures](../../35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/README.md)) | false positives are acceptable |

---

## Common mistakes & edge cases

- Using a plain object with **numeric keys** and being surprised that `Object.keys` gives
  strings in a different order. Use `Map`.
- `map.get(key)` returns `undefined` for a missing key, and `0` is falsy: write
  `(map.get(k) ?? 0) + 1`, not `(map.get(k) || 0) + 1`... both work for numbers, but `??`
  is safer when `0` or `''` are real values.
- Checking `if (map.get(key))` when the stored value could be `0`. Use `map.has(key)`.
- Two Sum: inserting into the map **before** checking the complement lets `[3]` with target 6
  wrongly use the same element twice. Check first, then insert.
- Forgetting the **empty prefix** `map.set(0, 1)` in prefix-sum counting problems.
- Canonical key bugs: `[...word].sort().join('')` is O(L log L) per word; a 26-count
  array joined with a separator is O(L) and also works as a key (`"1#0#2#..."`).
- Objects as keys in a plain object become `"[object Object]"`. Use `Map`.
- `NaN` is a valid `Map`/`Set` key and `set.has(NaN)` works (unlike `===`).
- Hash tables don't keep sorted order. If the problem needs "smallest key greater than x",
  hashing is the wrong tool.

---

## When this does NOT apply

- **You need order** (smallest key, next larger key, range queries): a hash table keeps no order. Use sorting, a heap or a BST.
- **Worst-case guarantees matter**: adversarial keys can make every key collide (O(n) per operation).
- **Keys are mutable objects or arrays**: a `Map` compares objects by reference, so two equal arrays are different keys. Build a string key instead.
- **Memory is the constraint** and the input can be sorted: two pointers give O(1) extra space.

---

## Interview tips

- Say the magic sentence: "I'll trade O(n) extra space for O(1) lookups, bringing this
  from O(n²) to O(n)."
- State complexities as "O(1) average per operation; worst case O(n) if everything
  collides, which a good hash function makes very unlikely."
- Clarify: are inputs only lowercase letters? (Then a 26-slot array beats a `Map`.)
  Can values repeat? Can the array be empty? Are there negative numbers? (Prefix-sum +
  hash still works with negatives; sliding window does not.)
- If asked "how does a hash map work?", cover: hash function → index, collisions (chaining
  vs probing), load factor, resizing, amortized O(1). The code in `02_Implementations/hash_table.js` is exactly
  that answer.
- Mention `Map` keeps insertion order in JS; sometimes that is a free feature (LRU cache).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Two Sum | Easy | complement lookup | 03_Problems/solutions/01_two_sum.js |
| 02 | Contains Duplicate II | Easy | index map | 03_Problems/solutions/02_contains_duplicate_ii.js |
| 03 | Valid Anagram | Easy | frequency count | 03_Problems/solutions/03_valid_anagram.js |
| 04 | Ransom Note | Easy | frequency count | 03_Problems/solutions/04_ransom_note.js |
| 05 | Isomorphic Strings | Easy | two-way mapping | 03_Problems/solutions/05_isomorphic_strings.js |
| 06 | Word Pattern | Easy | two-way mapping | 03_Problems/solutions/06_word_pattern.js |
| 07 | Intersection of Two Arrays | Easy | seen-set | 03_Problems/solutions/07_intersection_of_two_arrays.js |
| 08 | Group Anagrams | Medium | group by canonical key | 03_Problems/solutions/08_group_anagrams.js |
| 09 | Top K Frequent Elements | Medium | frequency + bucket sort | 03_Problems/solutions/09_top_k_frequent_elements.js |
| 10 | Longest Consecutive Sequence | Medium | seen-set, start-of-run | 03_Problems/solutions/10_longest_consecutive_sequence.js |
| 11 | Subarray Sum Equals K | Medium | prefix sum + hash | 03_Problems/solutions/11_subarray_sum_equals_k.js |
| 12 | Longest Substring Without Repeating Characters | Medium | index map + window | 03_Problems/solutions/12_longest_substring_without_repeating.js |
| 13 | Find All Anagrams in a String | Medium | frequency + window | 03_Problems/solutions/13_find_all_anagrams.js |
| 14 | 4Sum II | Medium | counting pairs | 03_Problems/solutions/14_four_sum_ii.js |
| 15 | Design HashMap | Easy | implementation | 03_Problems/solutions/15_design_hashmap.js |

---

## Practice more

Easy: First Unique Character in a String (387), Happy Number (202), Majority Element (169),
Contains Duplicate (217), Jewels and Stones (771), Unique Number of Occurrences (1207),
Find the Difference (389)

Medium: LRU Cache (146), Encode and Decode TinyURL (535), Insert Delete GetRandom O(1) (380),
Subarray Sums Divisible by K (974), Contiguous Array (525), Sort Characters By Frequency (451),
Copy List with Random Pointer (138), Continuous Subarray Sum (523), Brick Wall (554)

Hard: First Missing Positive (41), Minimum Window Substring (76), Substring with Concatenation
of All Words (30), LFU Cache (460)
