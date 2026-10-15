# LRU and LFU Caches

**Prerequisites:** [Linked Lists](../../15_Linked_Lists/README.md), [Hashing](../../05_Hashing/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/tests/lru_and_lfu_cache.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `lfu_cache.js`, `lru_cache.js` |
| [03_Problems](03_Problems) | 5 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `lru_and_lfu_cache.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | LRU Cache | Medium | DLL + Map (and Map-order trick) | [statement](03_Problems/02_Medium/01_lru_cache.md) | [solution](03_Problems/solutions/01_lru_cache.js) |
| 02 | LFU Cache | Hard | frequency buckets + minFreq | [statement](03_Problems/03_Hard/02_lfu_cache.md) | [solution](03_Problems/solutions/02_lfu_cache.js) |
| 03 | Design Browser History | Medium | array + pointer (lazy truncation) | [statement](03_Problems/02_Medium/03_design_browser_history.md) | [solution](03_Problems/solutions/03_design_browser_history.js) |
| 04 | Time Based Key-Value Store | Medium | Map + binary search on sorted timestamps | [statement](03_Problems/02_Medium/04_time_based_key_value_store.md) | [solution](03_Problems/solutions/04_time_based_key_value_store.js) |
| 05 | Design In-Memory File System | Hard | trie of path segments | [statement](03_Problems/03_Hard/05_design_in_memory_file_system.md) | [solution](03_Problems/solutions/05_design_in_memory_file_system.js) |

