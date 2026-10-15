# Strings

A **string** is a sequence of characters. In JavaScript it behaves like a read-only array of
characters: you can index it (`s[i]`), ask its `length`, and loop over it, but you can **never
change a character in place**. Think of a printed page: you can read any letter, but to "edit"
it you must print a new page. Every string operation that looks like a change (`+`, `slice`,
`replace`, `toUpperCase`) actually builds a brand-new string.

---

## Prerequisites

- [Arrays](../../03_Arrays/README.md): a string is an immutable array of characters.
- [JavaScript For DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md): `charCodeAt`, `split`/`join`, `Map`.
- [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md): why `+=` in a loop can be O(n^2).

---

## Why it matters / when to use

Strings show up in a huge share of interview questions. Signals that a problem is really a
string-technique problem:

- "palindrome", "reverse", "anagram", "permutation of a string"
- "count characters", "first unique", "most frequent letter" → frequency counting
- "longest substring that ...", "contains all characters of" → sliding window (see `07_Sliding_Window`)
- "parse", "convert", "evaluate", "atoi", "roman numeral", "compress", "encode/decode"
- "group by", "same letters" → canonical key + hash map (see `05_Hashing`)
- "prefix", "suffix", "common prefix" → character-by-character comparison, or tries (`22_Tries`)
- Big-number arithmetic given as strings ("multiply strings", "add binary") → digit arrays

---

## How it works

### Immutability

```
s = "cat"
s[0] = "b"        // silently ignored (throws in strict mode)
s = "b" + s.slice(1)   // "bat" - a NEW string, the old "cat" is untouched
```

Because strings are immutable, `result += ch` inside a loop *conceptually* copies the whole
string each time: 1 + 2 + 3 + ... + n = O(n^2) characters copied. V8 cheats with an internal
"rope" structure, so in practice it is usually fine, but in an interview the **safe answer is:
push characters into an array and `join('')` at the end** - that is guaranteed O(n).

```js
const parts = [];
for (const ch of s) parts.push(transform(ch));
return parts.join('');
```

### Characters are numbers

Every character has a numeric code. `charCodeAt` gives it, `String.fromCharCode` goes back.

```
'a'.charCodeAt(0)  -> 97      'z' -> 122
'A'.charCodeAt(0)  -> 65      'Z' -> 90
'0'.charCodeAt(0)  -> 48      '9' -> 57
String.fromCharCode(97) -> 'a'
```

The trick you will use constantly: map a lowercase letter to an index 0..25.

```js
const index = ch.charCodeAt(0) - 97;      // 'a' -> 0, 'b' -> 1, ... 'z' -> 25
const letter = String.fromCharCode(97 + index);
```

### Frequency counting: 26-length array vs Map

```
"banana"  ->  counts[1] = 3 (b... wait: a=3, b=1, n=2)
index:  a  b  c  ... n  ...
value:  3  1  0  ... 2  ...
```

| Use a `new Array(26).fill(0)` | Use a `Map` |
|---|---|
| input is guaranteed lowercase a-z (or any small fixed alphabet) | input can be anything: Unicode, digits, mixed case, spaces |
| fastest, no hashing, easy to compare with `join` | easy to read, `.size` tells you how many distinct keys |
| key `counts.join(',')` works as a Map key for "same letters" | keys are real characters, no code arithmetic |

### Comparing strings

- `a === b` compares contents, character by character, O(min(n, m)).
- `a < b` is lexicographic by char code: `'apple' < 'banana'`, but `'Z' < 'a'` (65 < 97) and `'10' < '9'`.
- `a.localeCompare(b)` for human-friendly, locale-aware ordering (returns -1 / 0 / 1); use it in `sort`.

### Palindromes

Two ways to think about "reads the same both ways":

```
two pointers (is the whole string a palindrome?)      expand around center (find palindromes)
 r a c e c a r                                          a b c b a
 ^           ^   move inward while equal                    ^      start at a center
   ^       ^                                              ^   ^    grow outward while equal
     ^   ^                                              ^       ^
       ^                                                 "abcba" found
```

Every palindrome has a center: a single character (odd length) or the gap between two
characters (even length). There are `2n - 1` centers. See `06_Two_Pointers` for more.

### Parsing numbers (atoi style)

1. skip leading whitespace
2. read an optional `+` / `-`
3. read digits while they are digits, `result = result * 10 + digit`
4. stop at the first non-digit
5. clamp to the 32-bit range `[-2^31, 2^31 - 1]`

### Unicode caveats

JavaScript strings are sequences of **UTF-16 code units**, not characters.

```js
'😀'.length          // 2  (one emoji, two code units: a "surrogate pair")
'😀'.split('')       // ['\uD83D', '\uDE00']  broken halves!
[...'😀']            // ['😀']  the spread / for..of iterate by code point - correct
'é'.length     // 2  ('e' + combining accent) still 2 code points, looks like 1 char
```

In interviews, state: "I'll assume ASCII / lowercase letters" and move on. If the interviewer
cares about Unicode, use `[...s]` or `Array.from(s)` instead of `split('')`.

---

## Pseudocode

```
TWO POINTERS FROM BOTH ENDS (palindrome)     FREQUENCY TABLE (anagram)
l <- 0, r <- n-1                              if len(s) != len(t): return false
while l < r:                                  count[26] <- all 0
    skip characters you must ignore           for i in 0..n-1:
    if s[l] != s[r]: return false                 count[s[i]] += 1
    l += 1, r -= 1                                count[t[i]] -= 1
return true                                   return every count is 0

EXPAND AROUND CENTER (palindromic substrings)
for center in 0..n-1:
    expand(center, center)       // odd length
    expand(center, center + 1)   // even length
expand(l, r): while l >= 0 and r < n and s[l] == s[r]: record; l -= 1; r += 1
```

---

## Dry run on a concrete example

Valid Anagram on `s = "rat"`, `t = "tar"` with one count table (only touched letters shown):

| i | s[i] | t[i] | counts after step |
|---|---|---|---|
| 0 | r | t | r:1, t:-1 |
| 1 | a | a | r:1, t:-1, a:0 |
| 2 | t | r | r:0, t:0, a:0 |

All counts are 0, so the strings are anagrams. With `t = "car"` the table would end with `t:1, c:-1`, so the answer is false.

---

## Operations & complexity

n = length of the string.

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| `s[i]`, `s.charCodeAt(i)` | O(1) | O(1) | read only |
| `s.length` | O(1) | O(1) | stored, not counted |
| `s.slice(i, j)` | O(j - i) | O(j - i) | new string |
| `a + b`, `a.concat(b)` | O(n + m) | O(n + m) | new string (V8 ropes may defer the copy) |
| `s += ch` in a loop (n times) | O(n^2) worst case | O(n) | use array + join |
| `s.split(sep)` | O(n) | O(n) | returns array |
| `arr.join('')` | O(total length) | O(total) | the way to build strings |
| `s.indexOf(t)`, `s.includes(t)` | O(n * m) | O(1) | linear scan, m = t.length |
| `s.replace(a, b)` | O(n) | O(n) | first match only unless regex `/g` or `replaceAll` |
| `s.toUpperCase()`, `toLowerCase()`, `trim()` | O(n) | O(n) | new string |
| `a === b` | O(min(n, m)) | O(1) | |
| `a < b`, `localeCompare` | O(min(n, m)) | O(1) | lexicographic |
| `[...s].reverse().join('')` | O(n) | O(n) | there is no built-in reverse |
| `s.split('').sort().join('')` | O(n log n) | O(n) | canonical form for anagrams |

---

## JavaScript implementation

There is no data structure to implement here - the string *is* the structure. Instead,
`02_Implementations/string_utils.js` contains the helper functions you will rewrite in nearly every string problem:

```js
function reverse(s)             // [...s].reverse().join('')  or two-pointer swap on an array
function isPalindrome(s)        // two pointers from both ends
function charFrequency(s)       // Map<char, count>
function charFrequency26(s)     // Array(26) counts for lowercase a-z
function isAnagram(a, b)        // same frequency table
function compress(s)            // "aabccc" -> "a2bc3"
function toCharCodeIndex(ch)    // 'a' -> 0 ... 'z' -> 25
```

Each one has its own self-test; run `node 02_Implementations/string_utils.js`.

---

## Patterns / variations

### 1. Two pointers from both ends (palindrome, reverse)

```js
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```
Use when: "is it a palindrome", "reverse in place" (on a char array), "valid after removing one char".

### 2. Frequency table (anagram, unique character, counting)

```js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < a.length; i++) {
    counts[a.charCodeAt(i) - 97]++;   // add from a
    counts[b.charCodeAt(i) - 97]--;   // remove from b
  }
  return counts.every((count) => count === 0);
}
```
Use when: "anagram", "same letters", "first unique", "can be formed from", "ransom note".

### 3. Canonical key + hash map (group anagrams)

Turn each string into a key that is identical for "equivalent" strings (sorted letters, or the
26-count joined), then group with a `Map`. More in `05_Hashing`.

```js
const groups = new Map();
for (const word of words) {
  const key = word.split('').sort().join('');
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(word);
}
return [...groups.values()];
```

### 4. Expand around center (palindromic substrings)

```js
function expand(s, left, right) {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  return right - left - 1;   // length of the palindrome found
}
// try every center: expand(s, i, i) (odd) and expand(s, i, i + 1) (even)
```
Use when: "longest palindromic substring", "count palindromic substrings". O(n^2) time, O(1) space.
The O(n) Manacher algorithm exists but is rarely expected.

### 5. Build with an array, join at the end

```js
function toUpperSnake(s) {
  const out = [];
  for (const ch of s) out.push(ch === ' ' ? '_' : ch.toUpperCase());
  return out.join('');
}
```
Use when: any transformation that produces a new string of similar size.

### 6. Write pointer (in-place on a char array)

Keep `write` (where the next kept char goes) behind `read` (what we are looking at).
Used in String Compression, Remove Duplicates, Move Zeroes (`03_Arrays`).

```js
let write = 0;
for (let read = 0; read < chars.length; read++) {
  if (keep(chars[read])) chars[write++] = chars[read];
}
return write; // new length
```

### 7. Sliding window over characters

"Longest substring with at most k distinct", "longest repeating character replacement",
"minimum window substring". The window holds a frequency table; grow right, shrink left.
Full treatment in `07_Sliding_Window`; a teaser is problem 12 here.

### 8. Digit-array arithmetic (big numbers as strings)

Store digits in an array, do schoolbook addition/multiplication, strip leading zeros, join.
The product of digit `i` and digit `j` lands at positions `i + j` and `i + j + 1`.

### 9. Parsing with a state machine (atoi, calculators, roman numerals)

Walk once with an index; each step reads one token (whitespace, sign, digit, symbol) and
decides what to do. Keep running totals as numbers, not strings.

### 10. DP on strings

Edit distance, longest common subsequence, palindromic partitioning, word break:
all live in `29_Dynamic_Programming`. Recognize them by "minimum operations to transform" or
"number of ways to split".

---

## Alternatives and trade-offs

| Task | Simple approach | Better approach | Trade-off |
|---|---|---|---|
| Anagram check | sort both strings, O(n log n) | 26-count array, O(n), O(1) space | counts need a known alphabet; use a `Map` for Unicode |
| Build a long string | `s += c` in a loop (may copy) | push to an array, `join` once | V8 often optimises `+=`, but `join` is predictable |
| Longest palindromic substring | check all substrings, O(n^3) | expand around center O(n^2); Manacher O(n) | Manacher is rarely expected in interviews |
| Find a pattern | `indexOf` / naive O(n·m) | KMP or Z-function O(n + m) ([advanced strings](../../33_String_Algorithms_Advanced/README.md)) | only worth it for big inputs |
| Group by letters | sorted word as key, O(L log L) | 26-count key, O(L) | count key is longer but linear |

---

## Common mistakes & edge cases

- Trying to mutate: `s[i] = 'x'` does nothing. Convert to an array first: `const chars = s.split('')`.
- `split('')` on emoji / non-BMP text splits surrogate pairs. Use `[...s]` if Unicode matters.
- Default `sort()` on an array of *strings* is fine (lexicographic), but on an array of
  *numbers* it is wrong (`[10, 9, 1].sort()` → `[1, 10, 9]`). Always pass a comparator for numbers.
- `'Z' < 'a'` is true because of char codes. Normalize case before comparing if case should not matter.
- `str.replace('a', 'b')` replaces only the first match. Use `replaceAll` or a `/g` regex.
- Forgetting that `indexOf`/`includes` are O(n): calling them inside a loop makes it O(n^2).
- Off-by-one in `slice(start, end)`: `end` is exclusive. `s.slice(0, s.length)` is the whole string.
- Empty string: most problems should return `""`, `0`, `true` or `-1` for it. Decide up front.
- Single character: every single character is a palindrome; an anagram of itself.
- Case and non-alphanumeric characters: ask whether to ignore them (Valid Palindrome does).
- Overflow in parsing: JavaScript numbers are safe up to 2^53, but the problem usually wants
  32-bit clamping. Write the clamp explicitly.
- Returning the array instead of joining it, or joining with the default separator (`,`).

---

## When this does NOT apply

- **Strings are immutable in JavaScript.** "In-place" string problems are really about a character array; claiming O(1) extra space for a string in JS is wrong unless the input is an array.
- **Unicode text** (emoji, accents): a 26-slot array and `s[i]` indexing break; use `Array.from(s)` and a `Map`.
- **Many pattern searches over a large text**: helpers like `indexOf` inside loops become O(n·m); move to tries, hashing or KMP.
- **Subsequence problems** ("delete some characters") usually need DP, not the substring techniques here.

---

## Interview tips

- Start by asking: "Only lowercase English letters? ASCII? Can it be empty? Does case matter?
  Do spaces/punctuation count?" The answers decide `Array(26)` vs `Map` and whether you need `toLowerCase`.
- Say out loud that strings are immutable, so you will build the answer in an array and join once.
- When you reach for a frequency table, mention it is O(n) time and O(1) space *because the
  alphabet is fixed at 26* - interviewers like hearing why it is O(1).
- For palindrome problems, name the two options (two pointers vs expand around center) and pick
  one based on "check the whole string" vs "find substrings".
- For parsing problems, list the states first (whitespace, sign, digits, stop) before coding.
  Handle overflow last, as a separate step.
- If you suspect the real pattern is a sliding window or DP, say so and point to the technique.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Reverse String | Easy | two pointers, in place | 03_Problems/solutions/01_reverse_string.js |
| 02 | Valid Palindrome | Easy | two pointers, filtering | 03_Problems/solutions/02_valid_palindrome.js |
| 03 | Valid Anagram | Easy | frequency table | 03_Problems/solutions/03_valid_anagram.js |
| 04 | First Unique Character in a String | Easy | frequency table, two passes | 03_Problems/solutions/04_first_unique_character.js |
| 05 | Longest Common Prefix | Easy | vertical scan | 03_Problems/solutions/05_longest_common_prefix.js |
| 06 | String to Integer (atoi) | Medium | parsing state machine | 03_Problems/solutions/06_string_to_integer_atoi.js |
| 07 | Longest Palindromic Substring | Medium | expand around center | 03_Problems/solutions/07_longest_palindromic_substring.js |
| 08 | Group Anagrams | Medium | canonical key + Map | 03_Problems/solutions/08_group_anagrams.js |
| 09 | Encode and Decode Strings | Medium | length-prefix encoding | 03_Problems/solutions/09_encode_and_decode_strings.js |
| 10 | Reverse Words in a String | Medium | split / reverse / join, two pointers | 03_Problems/solutions/10_reverse_words_in_a_string.js |
| 11 | String Compression | Medium | write pointer, run-length | 03_Problems/solutions/11_string_compression.js |
| 12 | Longest Repeating Character Replacement | Medium | sliding window (teaser) | 03_Problems/solutions/12_longest_repeating_character_replacement.js |
| 13 | Palindromic Substrings | Medium | expand around center | 03_Problems/solutions/13_palindromic_substrings.js |
| 14 | Multiply Strings | Medium | digit-array arithmetic | 03_Problems/solutions/14_multiply_strings.js |
| 15 | Roman to Integer & Integer to Roman | Easy/Medium | parsing, greedy | 03_Problems/solutions/15_roman_to_integer_and_integer_to_roman.js |
| 16 | Zigzag Conversion | Medium | simulation, row buckets | 03_Problems/solutions/16_zigzag_conversion.js |
| 17 | Count and Say | Medium | run-length, iteration | 03_Problems/solutions/17_count_and_say.js |

---

## Practice more

Easy: Ransom Note (383), Is Subsequence (392), Detect Capital (520), Reverse Vowels of a String (345),
Length of Last Word (58), Add Binary (67), Find the Index of the First Occurrence in a String (28),
Valid Word Abbreviation (408), Isomorphic Strings (205), Word Pattern (290)

Medium: Longest Substring Without Repeating Characters (3), Minimum Window Substring (76, Hard),
Decode Ways (91), Compare Version Numbers (165), Basic Calculator II (227), Find All Anagrams in a String (438),
Permutation in String (567), Longest Palindrome (409), Repeated DNA Sequences (187), Integer to English Words (273, Hard),
Valid Palindrome II (680), Custom Sort String (791), Remove All Adjacent Duplicates in String II (1209)

Hard: Minimum Window Substring (76), Shortest Palindrome (214), Edit Distance (72), Regular Expression Matching (10),
Text Justification (68)
