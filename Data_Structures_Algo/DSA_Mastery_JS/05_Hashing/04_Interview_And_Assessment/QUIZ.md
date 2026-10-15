# Hashing — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Predict the output

```js
const m = new Map();
m.set(1, 'a');
m.set('1', 'b');
const o = {};
o[1] = 'a';
o['1'] = 'b';
console.log(m.size, Object.keys(o).length);
```

<details><summary>Answer</summary>

`2 1`. A `Map` keeps the number 1 and the string '1' apart; object keys are converted to strings.

</details>

### Q2. Multiple choice — the average-case time of `Set.prototype.has` is

A) O(log n)  B) O(1)  C) O(n)  D) O(n log n)

<details><summary>Answer</summary>

**B.** Worst case O(n) with heavy collisions.

</details>

### Q3. Spot the bug (Two Sum)

```js
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  seen.set(nums[i], i);
  if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
}
```

<details><summary>Answer</summary>

Inserting before checking lets an element pair with itself: `nums = [3, 4]`, target 6 returns `[0, 0]`. Check first, then insert.

</details>

### Q4. Predict the output

```js
const s = new Set([[1, 2], [1, 2]]);
console.log(s.size, s.has([1, 2]));
```

<details><summary>Answer</summary>

`2 false`. Arrays are compared by reference.

</details>

### Q5. Complexity — what is the time complexity of Group Anagrams with a sorted-word key, for n words of length up to L?

<details><summary>Answer</summary>

O(n · L log L). With a 26-count key it becomes O(n · L).

</details>

### Q6. Spot the bug (subarray sum equals k)

```js
const count = new Map();
let p = 0, ans = 0;
for (const x of nums) { p += x; ans += count.get(p - k) || 0; count.set(p, (count.get(p) || 0) + 1); }
```

<details><summary>Answer</summary>

The map is not seeded with `count.set(0, 1)`, so subarrays starting at index 0 are missed (`[3]` with k = 3 returns 0).

</details>

### Q7. Multiple choice — which situation is the WORST fit for a hash map?

A) counting word frequencies  B) checking if any duplicate exists  C) finding the smallest key greater than x  D) mapping user id → user

<details><summary>Answer</summary>

**C.** Hash tables keep no order; use a sorted structure.

</details>

### Q8. Predict the output

```js
const counts = {};
for (const w of ['constructor', 'a']) counts[w] = (counts[w] || 0) + 1;
console.log(typeof counts.constructor);
```

<details><summary>Answer</summary>

`string`. `counts.constructor` initially reads the inherited `Object` function, so `(function || 0) + 1` becomes a string like `"function Object() { [native code] }1"`. Use a `Map` or `Object.create(null)`.

</details>

### Q9. Complexity — load factor

A chaining table with 8 buckets resizes (doubles) when the load factor passes 0.75. After inserting 13 distinct keys, how many buckets does it have?

<details><summary>Answer</summary>

32. It resizes to 16 when the 7th key makes 7/8 > 0.75, and to 32 when the 13th key makes 13/16 > 0.75.

</details>

### Q10. Multiple choice — Longest Consecutive Sequence is O(n) because

A) the set is sorted  B) we only start counting at numbers whose predecessor is missing  C) we use binary search  D) we stop at the first run

<details><summary>Answer</summary>

**B.**

</details>

### Q11. Spot the bug (isomorphic strings)

```js
const map = new Map();
for (let i = 0; i < s.length; i++) {
  if (map.has(s[i]) && map.get(s[i]) !== t[i]) return false;
  map.set(s[i], t[i]);
}
return true;
```

<details><summary>Answer</summary>

Only one direction is checked: `s = "ab"`, `t = "cc"` returns true, but two letters map to the same letter. Keep a second map (or a set of used targets) for t → s.

</details>

### Q12. Predict the output

```js
const m = new Map([['b', 1], ['a', 2]]);
m.set('c', 3);
m.delete('b');
m.set('b', 4);
console.log([...m.keys()].join(''));
```

<details><summary>Answer</summary>

`acb`. `Map` iterates in insertion order; re-inserting a deleted key puts it at the end.

</details>

## Mastery checklist

- [ ] I can explain hashing, collisions, load factor and resizing, and why lookups are O(1) average / O(n) worst.
- [ ] I can implement a chaining hash table with `set`, `get`, `delete` and resizing.
- [ ] I can apply the complement, seen-set, grouping-key and prefix-sum + map patterns.
- [ ] I can solve Two Sum, Group Anagrams, Longest Consecutive Sequence and Subarray Sum Equals K from memory.
- [ ] I scored at least 10/12 on this quiz.
