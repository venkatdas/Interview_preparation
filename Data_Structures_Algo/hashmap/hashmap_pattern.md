# HashMap / HashSet — Complete Guide 🎯

---

## What is a HashMap?

A HashMap stores **key → value** pairs.
Think of it like a dictionary — you look up a word (key) and get its meaning (value).

In JavaScript we have 3 ways to use it.

---

## 1. Plain Object `{}`

```js
const map = {}

// add
map['a'] = 1

// get
map['a']        // returns 1

// check if exists
'a' in map      // true or false

// delete
delete map['a']
```

---

## 2. Map (Recommended for DSA ✅)

```js
const map = new Map()

// add
map.set('a', 1)

// get
map.get('a')    // returns 1

// check if exists
map.has('a')    // true or false

// delete
map.delete('a')

// size
map.size
```

---

## 3. Set (Only unique values, no key-value)

```js
const set = new Set()

// add
set.add(1)

// check if exists
set.has(1)      // true or false

// delete
set.delete(1)

// size
set.size
```

---

## Which one to use when?

| Situation | Use |
|---|---|
| Need key → value pairs | `Map` |
| Just need to check if something exists | `Set` |
| Simple counting / frequency | `{}` object |

---

## Common Operations

### Count Frequency of Elements
```js
const nums = [1, 2, 2, 3, 3, 3]
const map = new Map()

for(let n of nums){
    if(map.has(n)){
        map.set(n, map.get(n) + 1)
    } else {
        map.set(n, 1)
    }
}

console.log(map)
// Map { 1 => 1, 2 => 2, 3 => 3 }
```

### Check if Element Exists
```js
const map = new Map()
map.set(2, 0)   // store value → index

map.has(2)      // true
map.has(5)      // false
```

### Store Value → Index
```js
const nums = [2, 7, 11, 15]
const map = new Map()

for(let i = 0; i < nums.length; i++){
    map.set(nums[i], i)  // value → index
}

// map = { 2→0, 7→1, 11→2, 15→3 }
```

---

## How to Recognise HashMap Problems 🔍

Ask yourself these questions:

| Question | If YES → likely HashMap |
|---|---|
| Does it involve **duplicates**? | ✅ |
| Does it say **"find two elements"**? | ✅ |
| Does it involve **counting frequency**? | ✅ |
| Does it say **"seen before"**? | ✅ |
| Does it involve **target sum**? | ✅ |
| Does it say **"missing number"**? | ✅ |

---

## Keywords That Hint HashMap 🔑

- "contains duplicate"
- "two sum"
- "target"
- "frequency"
- "count"
- "seen before"
- "missing"
- "anagram"
- "unique"

---

## Template — Basic HashMap
```js
function hashMapPattern(nums) {
    const map = new Map()

    for(let i = 0; i < nums.length; i++){
        if(map.has(nums[i])){
            // seen before! do something
        } else {
            // not seen, store it
            map.set(nums[i], i)
        }
    }
}
```

## Template — Frequency Count
```js
function frequencyCount(nums) {
    const map = new Map()

    for(let n of nums){
        map.set(n, (map.get(n) || 0) + 1)
    }

    return map
}
```

---

## Problems List

### Easy
| # | Problem | LeetCode # | Status |
|---|---|---|---|
| 1 | Two Sum | #1 | ⬜ |
| 2 | Contains Duplicate | #217 | ⬜ |
| 3 | Valid Anagram | #242 | ⬜ |
| 4 | Missing Number | #268 | ⬜ |
| 5 | Single Number | #136 | ⬜ |

---

## Key Reminder 💡

> HashMap trades **space for speed.**
> Instead of looping twice (O(n²)), store values in a map and look them up in O(1).
> That's why it's so powerful! 💪
