# Strings — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Predict the output

```js
let s = 'cat';
s[0] = 'b';
console.log(s);
```

<details><summary>Answer</summary>

`cat`. Strings are immutable. In sloppy mode the assignment is silently ignored; in strict mode it throws a `TypeError`. Build a new string instead.

</details>

### Q2. Multiple choice — the fastest way to count lowercase letters a-z is

A) an object with letters as keys  B) a `Map`  C) an array of 26 numbers indexed by `charCodeAt(0) - 97`  D) `split` + `filter` per letter

<details><summary>Answer</summary>

**C.** Constant size, no hashing. D is O(26·n).

</details>

### Q3. Predict the output

```js
console.log('😀'.length, [...'😀'].length);
```

<details><summary>Answer</summary>

`2 1`. The emoji is two UTF-16 code units but one code point.

</details>

### Q4. Complexity — expand around center

What is the time and space complexity of finding the longest palindromic substring by expanding around every center?

<details><summary>Answer</summary>

O(n²) time (2n − 1 centers, each expanding up to O(n)) and O(1) extra space.

</details>

### Q5. Spot the bug (anagram)

```js
function isAnagram(s, t) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) { if (!count[c]) return false; count[c]--; }
  return true;
}
```

<details><summary>Answer</summary>

Missing the length check: `isAnagram('aab', 'ab')` returns true. Add `if (s.length !== t.length) return false;` first.

</details>

### Q6. Multiple choice — `"a1b2".split('').reverse().join('')` returns

A) `"2b1a"`  B) `"a1b2"`  C) an array  D) `"b2a1"`

<details><summary>Answer</summary>

**A.**

</details>

### Q7. Predict the output

```js
console.log('B' < 'a', 'apple' < 'apricot', '10' < '9');
```

<details><summary>Answer</summary>

`true true true`. Comparisons use code units: 'B' (66) < 'a' (97); 'p' < 'r' at index 2; '1' < '9'.

</details>

### Q8. Spot the bug (group anagrams key)

```js
const key = new Array(26).fill(0);
for (const ch of word) key[ch.charCodeAt(0) - 97]++;
map.set(key, [...(map.get(key) || []), word]);
```

<details><summary>Answer</summary>

`key` is an array, and `Map` compares arrays by reference, so every word gets its own group. Use `key.join('#')` as the map key.

</details>

### Q9. Complexity — what is the time complexity of this loop?

```js
let out = '';
for (const word of words) out = out + word + ' ';
```

<details><summary>Answer</summary>

Worst case O(L²) where L is the total length (each concatenation may copy the growing string). In practice V8 often does better, but the safe answer is to collect into an array and `join(' ')` for O(L).

</details>

### Q10. Multiple choice — which problem needs DP rather than a window or two pointers?

A) Valid Palindrome  B) Longest Substring Without Repeating Characters  C) Longest Common Subsequence  D) Reverse Words in a String

<details><summary>Answer</summary>

**C.** Subsequences skip characters; the others are about contiguous ranges or simple scans.

</details>

### Q11. Spot the bug (encode)

```js
const encode = (strs) => strs.join(',');
const decode = (s) => s.split(',');
```

<details><summary>Answer</summary>

Strings containing `,` break it, and `decode(encode([]))` returns `['']` instead of `[]`. Use length prefixes (`len#str`).

</details>

### Q12. Predict the output

```js
console.log('  hello   world '.split(' ').length, '  hello   world '.trim().split(/\s+/).length);
```

<details><summary>Answer</summary>

`7 2`. Splitting on a single space keeps empty strings between repeated spaces.

</details>

## Mastery checklist

- [ ] I can explain immutability and why I build strings with an array and `join`.
- [ ] I can write a frequency count with a 26-slot array and with a `Map`, and know when to use each.
- [ ] I can code Valid Palindrome, Valid Anagram, Group Anagrams and Longest Palindromic Substring from memory.
- [ ] I know the Unicode caveats (`length`, `s[i]` vs `[...s]`).
- [ ] I scored at least 10/12 on this quiz.
