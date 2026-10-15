# Graph Traversal (BFS and DFS)

**Prerequisites:** [Graphs](../23_Graphs/README.md), [Queues And Deques](../17_Queues_And_Deques/README.md), [Recursion](../12_Recursion/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 24_Graph_Traversal` (from the curriculum root).

**Check yourself:** [Self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) · [Interview questions with model answers](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `traversals.js` |
| [03_Problems](03_Problems) | 18 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Flood Fill | Easy | DFS flood fill | [statement](03_Problems/01_Easy/01_flood_fill.md) | [solution](03_Problems/solutions/01_flood_fill.js) |
| 02 | Island Perimeter | Easy | grid scan / DFS | [statement](03_Problems/01_Easy/02_island_perimeter.md) | [solution](03_Problems/solutions/02_island_perimeter.js) |
| 03 | Find if Path Exists in Graph | Easy | BFS reachability | [statement](03_Problems/01_Easy/03_find_if_path_exists.md) | [solution](03_Problems/solutions/03_find_if_path_exists.js) |
| 04 | Keys and Rooms | Medium | DFS reachability | [statement](03_Problems/02_Medium/04_keys_and_rooms.md) | [solution](03_Problems/solutions/04_keys_and_rooms.js) |
| 05 | Number of Islands | Medium | DFS components on grid | [statement](03_Problems/02_Medium/05_number_of_islands.md) | [solution](03_Problems/solutions/05_number_of_islands.js) |
| 06 | Max Area of Island | Medium | DFS returning size | [statement](03_Problems/02_Medium/06_max_area_of_island.md) | [solution](03_Problems/solutions/06_max_area_of_island.js) |
| 07 | Number of Connected Components in an Undirected Graph | Medium | components on adjacency list | [statement](03_Problems/02_Medium/07_number_of_connected_components.md) | [solution](03_Problems/solutions/07_number_of_connected_components.js) |
| 08 | Graph Valid Tree | Medium | DFS cycle check + connectivity | [statement](03_Problems/02_Medium/08_graph_valid_tree.md) | [solution](03_Problems/solutions/08_graph_valid_tree.js) |
| 09 | Clone Graph | Medium | DFS with Map | [statement](03_Problems/02_Medium/09_clone_graph.md) | [solution](03_Problems/solutions/09_clone_graph.js) |
| 10 | Rotting Oranges | Medium | multi-source BFS levels | [statement](03_Problems/02_Medium/10_rotting_oranges.md) | [solution](03_Problems/solutions/10_rotting_oranges.js) |
| 11 | Walls and Gates | Medium | multi-source BFS | [statement](03_Problems/02_Medium/11_walls_and_gates.md) | [solution](03_Problems/solutions/11_walls_and_gates.js) |
| 12 | 01 Matrix | Medium | multi-source BFS | [statement](03_Problems/02_Medium/12_01_matrix.md) | [solution](03_Problems/solutions/12_01_matrix.js) |
| 13 | Surrounded Regions | Medium | DFS from border | [statement](03_Problems/02_Medium/13_surrounded_regions.md) | [solution](03_Problems/solutions/13_surrounded_regions.js) |
| 14 | Pacific Atlantic Water Flow | Medium | DFS from border, two sets | [statement](03_Problems/02_Medium/14_pacific_atlantic_water_flow.md) | [solution](03_Problems/solutions/14_pacific_atlantic_water_flow.js) |
| 15 | Number of Enclaves | Medium | DFS from border | [statement](03_Problems/02_Medium/15_number_of_enclaves.md) | [solution](03_Problems/solutions/15_number_of_enclaves.js) |
| 16 | Shortest Path in Binary Matrix | Medium | BFS, 8 directions | [statement](03_Problems/02_Medium/16_shortest_path_in_binary_matrix.md) | [solution](03_Problems/solutions/16_shortest_path_in_binary_matrix.js) |
| 17 | Open the Lock | Medium | BFS implicit graph | [statement](03_Problems/02_Medium/17_open_the_lock.md) | [solution](03_Problems/solutions/17_open_the_lock.js) |
| 18 | Word Ladder | Hard | BFS implicit graph | [statement](03_Problems/03_Hard/18_word_ladder.md) | [solution](03_Problems/solutions/18_word_ladder.js) |

