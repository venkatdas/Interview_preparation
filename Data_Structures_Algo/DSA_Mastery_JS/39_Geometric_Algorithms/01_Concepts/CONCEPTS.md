# Computational Geometry (lite)

**Computational geometry** is doing geometry with integers and comparisons instead of
rulers and floating point. The one tool that unlocks almost everything is the **cross
product**: it tells you whether three points turn left, turn right, or lie on a line, without
ever dividing (so no vertical-line special cases and no rounding). Think of a hiker reading a
map: "is the lake to my left or my right as I walk from A to B?" is a cross product.

Interviews rarely go deep here, but a handful of questions recur: Max Points on a Line,
Erect the Fence (convex hull), Rectangle Area / Overlap, Valid Square, K Closest Points.

## Prerequisites

- [Arrays](../../03_Arrays/README.md) and [Hashing](../../05_Hashing/README.md) — points as `[x, y]`, Map / Set keys like `"x,y"`.
- [Sorting](../../11_Sorting/README.md) — the convex hull starts with a sort.
- [Stacks](../../16_Stacks/README.md) — the hull chains are a stack with a "pop while bad turn" rule.
- [Heaps](../../19_Heaps_And_Priority_Queues/README.md) — for K Closest Points.

**Essential vs Advanced:** cross product, orientation, squared distance, rectangle overlap and normalised direction keys are **Essential**. Segment intersection special cases, convex hull and point-in-polygon are **Advanced** (they appear, but rarely).

---

## Why it matters / when to use

- Points on a grid, "collinear", "same line" → cross product / normalised slopes
- "Fence", "enclose all points", "outer boundary" → convex hull (monotone chain)
- "Do these rectangles overlap", "total area" → interval overlap per axis, inclusion-exclusion
- "Is this a square / rectangle / right triangle" → squared pairwise distances
- "Closest points", "k nearest" → squared distance + quickselect / heap
- "Area of a polygon" → shoelace formula
- "Do two segments intersect" → orientation tests (map and game-collision questions)

Frontend relevance: hit testing, drag-and-drop collision, canvas drawing, map clustering.

---

## How it works

### Points, vectors and the cross product

A point is `[x, y]`. The vector from `o` to `a` is `(a.x - o.x, a.y - o.y)`.

```
cross(o, a, b) = (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

   b                     b
    \                   /
     o ---- a      a ---- o
   cross > 0           cross < 0            cross = 0: o, a, b collinear
   (b is LEFT of o->a, counter-clockwise)   (b is RIGHT, clockwise)
```
`|cross|` is also twice the area of triangle `oab`. **orientation(a, b, c)** = sign of
`cross(a, b, c)`: `+1` CCW, `-1` CW, `0` collinear.

### Segment intersection

Segments `p1p2` and `p3p4` cross when `p3` and `p4` are on opposite sides of line `p1p2`
**and** `p1`, `p2` are on opposite sides of line `p3p4`:

```
o1 = orientation(p1, p2, p3), o2 = orientation(p1, p2, p4)
o3 = orientation(p3, p4, p1), o4 = orientation(p3, p4, p2)
general case:   o1 != o2 && o3 != o4
collinear case: some orientation is 0 and that endpoint lies within the other segment's box
```

### Convex hull: Andrew's monotone chain, O(n log n)

Sort points by `x` (then `y`). Walk left to right building the **lower** hull: push each
point, but first pop while the last two points and the new one make a clockwise turn
(`cross <= 0`; use `< 0` to keep collinear boundary points). Then walk right to left for the
**upper** hull. Join them.

```
points sorted by x:  A(0,0)  B(1,2)  C(2,1)  D(3,3)  E(4,0)        C is inside

        D
   B
        C
   A         E

lower chain, left to right (pop while the turn is clockwise, cross <= 0):
  push A, push B                                  [A B]
  C: cross(A,B,C) = -3  -> pop B;  push C         [A C]
  D: cross(A,C,D) = +3  -> push                   [A C D]
  E: cross(C,D,E) = -5  -> pop D;  cross(A,C,E) = -4 -> pop C;  push E     [A E]

upper chain, right to left:
  push E, push D                                  [E D]
  C: cross(E,D,C) = +5  -> push                   [E D C]
  B: cross(D,C,B) = -3  -> pop C;  cross(E,D,B) = +7 -> push               [E D B]
  A: cross(D,B,A) = +3  -> push                   [E D B A]

hull = lower without its last point + upper without its last point
     = [A] + [E D B] = A -> E -> D -> B   (counter-clockwise; C never survives)
```
The invariant: *each chain only ever turns counter-clockwise*. The library and
`03_Problems/solutions/07_erect_the_fence.js` implement it exactly, with randomized checks against an
O(n³) hull.

### Distance

Always compare **squared** distances: `dx*dx + dy*dy`. Integer in, integer out, no `sqrt`,
no rounding. Only take the square root when the problem asks for the actual length.

### Area of a polygon: shoelace formula

```
2 * area = | sum over i of (x_i * y_{i+1} - x_{i+1} * y_i) |      (wrap around at the end)

rectangle (0,0) (4,0) (4,3) (0,3):
  0*0 - 4*0 = 0;  4*3 - 4*0 = 12;  4*3 - 0*3 = 12;  0*0 - 0*3 = 0  -> 24 / 2 = 12
```
Works for any simple polygon, convex or not, in O(n).

### Rectangle overlap and area

Axis-aligned `[x1, y1, x2, y2]`. The intersection is `[max(x1s), max(y1s), min(x2s), min(y2s)]`;
it has positive area iff `max(x1s) < min(x2s)` and `max(y1s) < min(y2s)`.
Union area = `A + B - intersection` (inclusion–exclusion).

### Valid square via six distances

Four points form a square iff the six pairwise squared distances sort into four equal sides
`s > 0` and two equal diagonals `d = 2s`.

### Point in polygon (brief)

Ray casting: shoot a ray to the right and count edge crossings; odd = inside. Handle points
exactly on an edge separately with `onSegment`.

---

## Pseudocode (Essential)

```
cross(o, a, b) = (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
     > 0 left turn (counter-clockwise), < 0 right turn, = 0 collinear

convexHull(points):                       # Andrew's monotone chain
  sort points by x, then y; remove duplicates
  lower = []
  for p in points:                        # left -> right
    while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0: lower.pop()
    lower.push(p)
  upper = []
  for p in reversed(points):              # right -> left
    while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0: upper.pop()
    upper.push(p)
  return lower[:-1] + upper[:-1]          # endpoints are shared

rectanglesOverlap(a, b):
  return not (a.x2 <= b.x1 or b.x2 <= a.x1 or a.y2 <= b.y1 or b.y2 <= a.y1)
```

---

## Dry run — lower hull of (0,0) (1,1) (2,0) (3,1) (4,0) (Advanced)

Points are already sorted by x.

| step | p | stack before | cross of last two + p | action | stack after |
|---|---|---|---|---|---|
| 1 | (0,0) | [] | — | push | [(0,0)] |
| 2 | (1,1) | [(0,0)] | — (fewer than 2) | push | [(0,0),(1,1)] |
| 3 | (2,0) | [(0,0),(1,1)] | cross((0,0),(1,1),(2,0)) = 1·0 - 1·2 = -2 ≤ 0 | pop (1,1), push | [(0,0),(2,0)] |
| 4 | (3,1) | [(0,0),(2,0)] | cross((0,0),(2,0),(3,1)) = 2·1 - 0·3 = 2 > 0 | push | [(0,0),(2,0),(3,1)] |
| 5 | (4,0) | [(0,0),(2,0),(3,1)] | cross((2,0),(3,1),(4,0)) = 1·0 - 1·2 = -2 ≤ 0 | pop (3,1) | [(0,0),(2,0)] |
| 5b | (4,0) | [(0,0),(2,0)] | cross((0,0),(2,0),(4,0)) = 0 ≤ 0 | pop (2,0) (collinear, strict hull), push | [(0,0),(4,0)] |

The lower hull is the straight bottom edge (0,0) → (4,0). With `keepCollinear` the pop rule is `< 0`, so step 5b keeps (2,0).

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| cross / orientation | O(1) | O(1) | integer-exact |
| segment intersection | O(1) | O(1) | 4 orientations + collinear checks |
| convex hull (monotone chain) | O(n log n) | O(n) | sort dominates |
| polygon area (shoelace) | O(n) | O(1) | |
| rectangle overlap / area | O(1) | O(1) | |
| max points on a line | O(n²) | O(n) | per anchor, Map of reduced slopes |
| valid square | O(1) | O(1) | 6 distances |
| k closest points | expected O(n) | O(1) | quickselect; O(n log k) with a heap |
| minimum area rectangle | O(n²) | O(n) | diagonal pairs + Set |
| point in polygon | O(n) | O(1) | ray casting |

---

## JavaScript implementation

Full code with randomized tests (hull vs O(n³) brute force, rectangle area vs cell counting):
`geometry.js` (`cross`, `orientation`, `onSegment`, `segmentsIntersect`, `distSq`, `dist`,
`convexHull`, `polygonArea`, `rectanglesOverlap`, `rectangleIntersectionArea`, `pointInPolygon`).
The hull core:

```js
function convexHull(points, keepCollinear = false) {
  const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const bad = (o, a, b) => (keepCollinear ? cross(o, a, b) < 0 : cross(o, a, b) <= 0);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && bad(lower.at(-2), lower.at(-1), p)) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (const p of pts.slice().reverse()) {
    while (upper.length >= 2 && bad(upper.at(-2), upper.at(-1), p)) upper.pop();
    upper.push(p);
  }
  lower.pop(); upper.pop();                 // endpoints are shared
  return lower.concat(upper);               // counter-clockwise
}
```

---

## Patterns / variations

### 1. Cross product instead of slope

```js
const collinear = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) === 0;
```
No division, so vertical lines and integer overflow (JS is exact to 2^53) are non-issues.

### 2. Normalised direction as a Map key

```js
const g = gcd(Math.abs(dx), Math.abs(dy)); dx /= g; dy /= g;
if (dx < 0 || (dx === 0 && dy < 0)) { dx = -dx; dy = -dy; }     // (1,-2) and (-1,2) are the same line
key = dx + ',' + dy;
```
Use when: Max Points on a Line, counting parallel pairs.

### 3. Squared distances + sorting / selection

Valid Square, K Closest Points, Minimum Area Rectangle (rotated version, LC 963, uses the
centre + diagonal length as a key).

### 4. "Not separated" tests for overlap

Rectangles overlap iff they are not separated on x **and** not separated on y. The same
idea generalises to intervals ([Intervals](../../31_Intervals/README.md)) and to the separating-axis theorem.

### 5. Hull as a preprocessing step

Farthest pair of points (rotating calipers), minimum enclosing shapes, "can all points be
covered by a line" - compute the hull first, then work on far fewer points.

---

## Alternatives and trade-offs

| Task | Simple approach | Better approach | Trade-off |
|---|---|---|---|
| Convex hull | O(n^3) "is every other point on one side of line i–j" | monotone chain O(n log n) | Graham scan is equivalent but needs an angle sort; gift wrapping (Jarvis) is O(n·h), good when the hull is tiny |
| Points on a line | O(n^3) check every triple | O(n^2) anchor + direction Map | exact integer keys vs float slopes |
| K closest | sort O(n log n) | heap O(n log k) / quickselect O(n) avg | heap works on streams; quickselect mutates the array |
| Min area rectangle | O(n^4) all quadruples | O(n^2) diagonal pairs + Set | memory for the Set |
| Rectangle union area (many rectangles) | grid cells | sweep line + segment tree ([Segment Tree](../../34_Range_Query_Data_Structures/01_Segment_Tree/README.md)) | far more code |

---

## When this does NOT apply

- **Grid / matrix "geometry"** (islands, shortest path on cells) is graph traversal, not computational geometry — see [Graph Traversal](../../24_Graph_Traversal/README.md).
- **Intervals on a line** (meetings, merging) are 1D — see [Intervals](../../31_Intervals/README.md).
- **Real-valued answers** (angles, circle intersections) need floats with an epsilon; the integer-only tricks here stop being exact.
- **Huge coordinates** (≥ ~10^8) make cross products exceed 2^53 — switch to BigInt rather than trusting Numbers.

---

## Common mistakes & edge cases

- Computing slopes with `/` → vertical lines divide by zero and `0.1 + 0.2` style rounding
  breaks equality. Use cross products or reduced integer fractions.
- Duplicate points: dedupe before building a hull; LeetCode's Max Points guarantees distinct
  points but older versions did not.
- Collinear boundary points: Erect the Fence wants them **kept** (`cross < 0` pop condition);
  a "strict" hull drops them (`cross <= 0`). Read the problem.
- All points collinear: both chains contain the same points - dedupe the result.
- Degenerate rectangles (zero width) must not count as overlapping.
- Touching edges/corners do not count as overlap when the problem says "positive area".
- Valid Square: check `s > 0`, otherwise four identical points pass.
- Taking `Math.sqrt` where a squared comparison would do.

---

## Interview tips

- Say early: *"I'll use the cross product to avoid division and floating point."* It is the
  single most important sentence in a geometry interview.
- For hull questions, name **monotone chain**, state O(n log n), and mention the
  "pop on clockwise turn" invariant; nobody expects Graham scan details.
- For rectangle questions, explain the "not separated" reasoning rather than enumerating
  cases.
- Be honest that geometry is rare; show the three reusable ideas (cross product, squared
  distance, normalised direction keys) and the interviewer will be satisfied.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Rectangle Overlap | Easy | interval overlap per axis | 03_Problems/solutions/01_rectangle_overlap.js |
| 02 | Rectangle Area | Medium | inclusion-exclusion | 03_Problems/solutions/02_rectangle_area.js |
| 03 | Valid Square | Medium | six squared distances | 03_Problems/solutions/03_valid_square.js |
| 04 | K Closest Points to Origin | Medium | squared distance + quickselect | 03_Problems/solutions/04_k_closest_points_to_origin.js |
| 05 | Minimum Area Rectangle | Medium | diagonal pairs + Set | 03_Problems/solutions/05_minimum_area_rectangle.js |
| 06 | Max Points on a Line | Hard | normalised direction keys per anchor | 03_Problems/solutions/06_max_points_on_a_line.js |
| 07 | Erect the Fence | Hard | convex hull (monotone chain, keep collinear) | 03_Problems/solutions/07_erect_the_fence.js |

---

## Practice more

Easy: Rectangle Overlap (836), Largest Perimeter Triangle (976), Check If It Is a Straight
Line (1232), Minimum Time Visiting All Points (1266)

Medium: Rectangle Area (223), Valid Square (593), K Closest Points to Origin (973),
Minimum Area Rectangle (939), Minimum Area Rectangle II (963), Convex Polygon (469),
Largest Triangle Area (812), Number of Boomerangs (447), Line Reflection (356),
Valid Boomerang (1037), Minimum Lines to Represent a Line Chart (2280)

Hard: Max Points on a Line (149), Erect the Fence (587), Rectangle Area II (850),
Perfect Rectangle (391), Self Crossing (335), Maximum Number of Visible Points (1610)
