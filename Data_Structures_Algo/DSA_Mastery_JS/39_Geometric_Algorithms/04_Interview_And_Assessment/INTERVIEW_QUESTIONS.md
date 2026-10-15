# Geometric Algorithms — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. What does the 2D cross product `cross(o, a, b)` tell you?

<details><summary>Model answer</summary>

`cross(o, a, b) = (a.x - o.x)(b.y - o.y) - (a.y - o.y)(b.x - o.x)`. Positive means the turn o → a → b is counter-clockwise (b is to the left of the ray o→a), negative means clockwise, zero means collinear. Its absolute value is twice the area of triangle o, a, b.
</details>

### 2. Why do geometry solutions avoid slopes and `Math.sqrt`?

<details><summary>Model answer</summary>

Slopes need division: vertical lines divide by zero and floating-point rounding makes equal slopes compare unequal. `sqrt` introduces irrational floats. With integer inputs, cross products and squared distances stay exact integers, so equality tests are reliable.
</details>

### 3. How do you test whether two segments intersect?

<details><summary>Model answer</summary>

Compute the four orientations `o1 = orient(p1,p2,p3)`, `o2 = orient(p1,p2,p4)`, `o3 = orient(p3,p4,p1)`, `o4 = orient(p3,p4,p2)`. General case: they intersect if `o1 != o2` and `o3 != o4` (each segment's endpoints are on opposite sides of the other). Special cases: if an orientation is 0, check whether that endpoint lies within the bounding box of the other segment (onSegment).
</details>

### 4. Explain Andrew's monotone chain convex hull.

<details><summary>Model answer</summary>

Sort points by x, then y. Build the lower hull left to right with a stack: before pushing a point, pop while the last two stack points and the new point make a clockwise (or straight) turn. Build the upper hull right to left the same way. Concatenate, dropping the duplicated endpoints. O(n log n) for the sort plus O(n) for the stack passes (each point pushed and popped at most once per chain).
</details>

### 5. How do you keep collinear points on the hull boundary, and when does it matter?

<details><summary>Model answer</summary>

Pop only on a strictly clockwise turn (`cross < 0`) instead of `cross <= 0`. It matters in problems like Erect the Fence that ask for every point lying on the fence. Watch out for the all-collinear case, where both chains contain the same points and the result must be deduplicated.
</details>

### 6. How do you count the maximum number of points on one line in O(n^2)?

<details><summary>Model answer</summary>

Fix an anchor point; for every other point compute the direction `(dx, dy)`, divide by `gcd(|dx|, |dy|)` and normalise the sign so opposite directions match. Count directions in a Map; the best count + 1 (the anchor) is the best line through that anchor. Repeat for each anchor. Exact integer keys avoid float slope bugs.
</details>

### 7. How do you check if two axis-aligned rectangles overlap?

<details><summary>Model answer</summary>

Think "not separated": they do not overlap if one is entirely left of, right of, above, or below the other. So overlap = `!(r1.x2 <= r2.x1 || r2.x2 <= r1.x1 || r1.y2 <= r2.y1 || r2.y2 <= r1.y1)`. Equivalently, the x-intervals overlap AND the y-intervals overlap with positive length.
</details>

### 8. What is the shoelace formula?

<details><summary>Model answer</summary>

For a simple polygon with vertices in order, `2·Area = |Σ (x_i·y_{i+1} - x_{i+1}·y_i)|`. It is a sum of signed cross products from the origin; the sign tells you whether the vertices are listed counter-clockwise (positive) or clockwise (negative).
</details>

### 9. How would you decide if a point is inside a polygon?

<details><summary>Model answer</summary>

Ray casting: shoot a horizontal ray to the right and count edge crossings; odd = inside. Handle boundary points explicitly (onSegment check) and use the half-open rule `(a.y > p.y) != (b.y > p.y)` so vertices are not counted twice. For a convex polygon you can instead check that the point is on the same side of every edge, or binary search in O(log n).
</details>

### 10. How do you find the k closest points to the origin efficiently?

<details><summary>Model answer</summary>

Compare squared distances. Options: sort, O(n log n); a max-heap of size k, O(n log k) — good for streams; quickselect, O(n) average with a random pivot. Mention that ties can be returned in any order.
</details>

### 11. How do you validate that four points form a square?

<details><summary>Model answer</summary>

Compute the six pairwise squared distances. A square has exactly two distinct values: four equal sides `s` and two equal diagonals `2s`, with `s > 0`. Order of the input points does not matter.
</details>

### 12. When does a geometry problem actually need floating point, and how do you protect yourself?

<details><summary>Model answer</summary>

When answers are real-valued (angles, intersection coordinates, circle problems like Maximum Number of Visible Points). Use an epsilon (e.g. `1e-9`) for comparisons, avoid subtracting nearly equal numbers, and keep everything in integers for as long as possible (compare angles via cross products, distances via squares).
</details>

### 13. How does integer overflow show up in JavaScript geometry?

<details><summary>Model answer</summary>

JavaScript Numbers are exact integers only up to 2^53. Coordinates up to 10^4 give cross products around 10^8 — safe. Coordinates up to 10^9 give products near 10^18 — not safe; use BigInt for the cross product in that case.
</details>
