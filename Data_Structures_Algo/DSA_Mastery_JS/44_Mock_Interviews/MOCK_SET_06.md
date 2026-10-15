# Mock Interview Set 06 — Design & Graph BFS (final set)

**Time:** 60 minutes total. Problem 1: 25 min. Problem 2: 30 min. 5 min to review.
**Covers:** [`35_Advanced_Data_Structures`](../35_Advanced_Data_Structures/README.md), [`24_Graph_Traversal`](../24_Graph_Traversal/README.md) (and [`05_Hashing`](../05_Hashing/README.md), [`15_Linked_Lists`](../15_Linked_Lists/README.md) underneath)
**When:** end of week 12 (12-week plan) or end of week 4 (4-week plan)

**Rules**

- Timer on. This set is close to a real onsite round: one design-style problem, one hard problem.
- Talk through the API and data structures before writing any class.
- Open the Hints only when the problem's time is half gone and you have nothing.

---

## Problem 1 — LRU Cache (LeetCode 146, Medium) — 25 min

**Links:** [LeetCode #146](https://leetcode.com/problems/lru-cache/) · [curriculum statement + hints](../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/02_Medium/01_lru_cache.md) (open after the mock)

Design a cache with a fixed `capacity` that supports:

- `get(key)`: return the value, or `-1` if absent. Marks the key as most recently used.
- `put(key, value)`: insert or update. If the cache is over capacity, evict the **least recently used** key.

Both operations must run in **O(1)** average time.

```
LRUCache cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);      // 1
cache.put(3, 3);   // evicts key 2
cache.get(2);      // -1
cache.put(4, 4);   // evicts key 1
cache.get(1);      // -1
cache.get(3);      // 3
cache.get(4);      // 4
```

**Clarifying questions you should ask**

- Does `get` count as "use"? (yes) Does `put` on an existing key count as "use"? (yes)
- Capacity at least 1? (yes)
- Thread safety? (not needed for the interview; mention it)

<details>
<summary>Hints</summary>

1. You need O(1) lookup (hash map) **and** O(1) "move to front / remove oldest" (a doubly linked list). Together: hash map from key to list node.
2. In JavaScript, `Map` remembers insertion order. `map.delete(key); map.set(key, value)` moves a key to the "newest" end, and `map.keys().next().value` is the oldest. That is a valid O(1) solution and interviewers accept it if you can explain why.
3. Be ready to also describe (or code) the explicit doubly-linked-list version with dummy `head` and `tail` nodes: `addToFront`, `removeNode`, `evictFromBack`.
4. In `put`: if key exists, update + move to front. Else insert at front; if size > capacity, evict from back and delete its key from the map.

</details>

**Expected complexity:** O(1) time per operation, O(capacity) space.

**Follow-up questions an interviewer may ask**

- Why a **doubly** linked list and not singly? (removing a node in O(1) needs access to its previous node)
- Implement LFU (least **frequently** used, 460). What changes? (map of frequency -> ordered set of keys, plus a `minFreq`)
- Add a TTL (expire after t seconds). Where do you check expiry? (on `get`, lazily; plus optional periodic sweep)
- In a browser, where would you use this? (image / API response cache, memoized selectors with a bounded size)

---

## Problem 2 — Word Ladder (LeetCode 127, Hard) — 30 min

**Links:** [LeetCode #127](https://leetcode.com/problems/word-ladder/) · [curriculum statement + hints](../24_Graph_Traversal/03_Problems/03_Hard/18_word_ladder.md) (open after the mock)

Given `beginWord`, `endWord`, and a `wordList`, return the length of the **shortest transformation sequence**
from `beginWord` to `endWord` such that each step changes exactly **one letter** and every intermediate word is in `wordList`.
Return `0` if no sequence exists.

```
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5   Explanation: hit -> hot -> dot -> dog -> cog

Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: 0   Explanation: "cog" is not in the list
```

**Clarifying questions you should ask**

- Are all words the same length? (yes) Lowercase only? (yes)
- Does `beginWord` need to be in `wordList`? (no) Does `endWord`? (yes, or answer is 0)
- Size? (up to 5000 words, length up to 10; an O(n^2 * L) "compare every pair" graph build is borderline, so build neighbors smarter)

<details>
<summary>Hints</summary>

1. "Shortest" + "each step is one change" = shortest path in an **unweighted graph** = BFS. Say it.
2. Nodes are words. Edges connect words that differ by one letter. Do not build all edges up front; generate neighbors on the fly.
3. Neighbor generation: for each position, try all 26 letters, check if the new word is in a `Set` of the word list. O(L * 26) per word.
4. BFS level by level; the answer is the level number when you pop `endWord`. Remove words from the set when you enqueue them (that is your `visited`).
5. Faster neighbor generation: pre-group words by wildcard pattern (`"h*t"`, `"*ot"`...). Two words sharing a pattern are neighbors.

</details>

**Expected complexity:** O(n * L * 26) time (n words, length L) with the 26-letter trick, O(n * L) space.

**Follow-up questions an interviewer may ask**

- Return all shortest sequences (Word Ladder II, 126). What extra do you store? (parents per word, then backtrack from end)
- Can you speed it up with bidirectional BFS? (search from both ends, expand the smaller frontier; cuts the search space roughly from b^d to 2 * b^(d/2))
- What if the word list is huge and stored on disk? (precompute the pattern buckets once; talk about memory)
- Why BFS and not DFS here? (DFS finds *a* path, not the shortest; BFS visits by distance)

---

## Self-review (5 min)

- [ ] I described the data structures (hash map + doubly linked list / ordered Map) before coding the cache.
- [ ] I handled `put` on an existing key correctly (update + move to front, no double insert).
- [ ] I said "shortest path, unweighted, BFS" out loud and used the word set as `visited`.
- [ ] I handled the "endWord not in list" edge case.
- [ ] I finished both problems within time.

Write 3 lines: what went well, what went wrong, what to review next.

---

## Next

Continue with [MOCK_SET_07](MOCK_SET_07.md): sets 07–10 are harder (graphs, DP and design-style problems).
Log your score with the [rubric](RUBRIC.md) and the [self-review template](SELF_REVIEW_TEMPLATE.md),
and update [PROBLEM_TRACKER.md](../PROBLEM_TRACKER.md).
