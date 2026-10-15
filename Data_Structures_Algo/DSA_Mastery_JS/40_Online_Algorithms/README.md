# Online Algorithms

An **online algorithm** gets its input one piece at a time and must react to each piece
immediately, without knowing what comes next. Think of a live chat feed, a stock ticker or the
requests hitting your API: you cannot wait for "the whole array" because it never ends. This
topic teaches how to keep useful answers (averages, medians, top items, distinct counts, rate
limits) up to date in small memory, and how to judge a strategy that cannot see the future
(competitive analysis, the ski-rental problem). Many "Design X" interview questions are online
algorithms in disguise.

**Prerequisites:** [Hashing](../05_Hashing/README.md), [Sliding Window](../07_Sliding_Window/README.md), [Queues and Deques](../17_Queues_And_Deques/README.md), [Monotonic Stacks and Queues](../18_Monotonic_Stacks_And_Queues/README.md), [Heaps and Priority Queues](../19_Heaps_And_Priority_Queues/README.md), [LRU and LFU Cache](../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom. Mark the Essential sections first; come back for the Advanced ones (sketches, HyperLogLog).
2. Run the implementation: `node 02_Implementations/streaming.js`. Read each class, close the file, and re-implement `StreamingMedian`, `Reservoir` and `MisraGries` from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each page has the statement and staged hints; the solution lives in a separate file.
4. Answer [INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take [QUIZ.md](04_Interview_And_Assessment/QUIZ.md) and tick the mastery checklist only when it is true.
5. Run this topic's tests: `node --test tests/online_algorithms.test.js` (or `npm run test:topic 40_Online_Algorithms` from the curriculum root).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | online vs offline, competitive analysis (ski rental), Welford, two-heap median, reservoir sampling, Misra-Gries, Count-Min, HyperLogLog, moving averages, rate limiters, LRU as online caching |
| [02_Implementations](02_Implementations/streaming.js) | `streaming.js` — MinHeap, RunningStats, StreamingMedian, Reservoir, MisraGries, CountMinSketch, HyperLogLog, MovingAverage, Ema, SlidingLogRateLimiter, TokenBucket |
| [03_Problems](03_Problems) | 9 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests/online_algorithms.test.js) | node:test suite for the implementation and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Moving Average from Data Stream | Easy | circular buffer + running sum | [statement](03_Problems/01_Easy/01_moving_average_from_data_stream.md) | [solution](03_Problems/solutions/01_moving_average_from_data_stream.js) |
| 02 | Logger Rate Limiter | Easy | map of next-allowed time | [statement](03_Problems/01_Easy/02_logger_rate_limiter.md) | [solution](03_Problems/solutions/02_logger_rate_limiter.js) |
| 03 | Kth Largest Element in a Stream | Easy | min-heap of size k | [statement](03_Problems/01_Easy/03_kth_largest_in_a_stream.md) | [solution](03_Problems/solutions/03_kth_largest_in_a_stream.js) |
| 04 | Design Hit Counter | Medium | circular time buckets | [statement](03_Problems/02_Medium/04_design_hit_counter.md) | [solution](03_Problems/solutions/04_design_hit_counter.js) |
| 05 | Online Stock Span | Medium | monotonic stack | [statement](03_Problems/02_Medium/05_online_stock_span.md) | [solution](03_Problems/solutions/05_online_stock_span.js) |
| 06 | Ski Rental Simulation (original) | Medium | competitive analysis | [statement](03_Problems/02_Medium/06_ski_rental_simulation.md) | [solution](03_Problems/solutions/06_ski_rental_simulation.js) |
| 07 | Top-K Heavy Hitters with Misra-Gries (original) | Medium | Misra-Gries + verify | [statement](03_Problems/02_Medium/07_heavy_hitters_misra_gries.md) | [solution](03_Problems/solutions/07_heavy_hitters_misra_gries.js) |
| 08 | Find Median from Data Stream | Hard | two heaps | [statement](03_Problems/03_Hard/08_find_median_from_data_stream.md) | [solution](03_Problems/solutions/08_find_median_from_data_stream.js) |
| 09 | Data Stream as Disjoint Intervals | Hard | sorted intervals + binary search | [statement](03_Problems/03_Hard/09_data_stream_as_disjoint_intervals.md) | [solution](03_Problems/solutions/09_data_stream_as_disjoint_intervals.js) |
