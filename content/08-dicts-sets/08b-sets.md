---
id: sets
title: Sets
section: 8
---

## Introduction

You're probably familiar with the concept of sets from math classes. A **set** is an unordered collection of elements where every element is unique. Adding a duplicate element doesn't change a set. Non-duplicate elements can be added to a set, so sets are **mutable**. However, the elements in a set must be **immutable**, so a set cannot contain lists or dictionaries or sets. Sets can contain values of different types, or be empty.

:::cell id=sets-demo1
```python starter
some_ints = {1, -7, -3, 524, 0}
some_elements = {19, "watermelon", 12.6, False, (1, 2, 3)}
empty = set()   # The empty set
# Remember that {} would be an empty dictionary
```
:::

## Type hinting with sets

Since Python 3.9, we can type hint with `set`.

:::cell id=sets-demo2
```python starter
some_ints: set[int] = {1, -7, -3, 524, 0}
some_elements: set[int | str | float | bool | tuple[int]] = {19, "watermelon", 12.6, False, (1, 2, 3)}
empty: set = set()   # The empty set
# Remember that {} would be an empty dictionary
```
:::

The `some_ints` variable is declared as a `set[int]`, indicating that it is a set of integers. The `some_elements` variable is declared as a `set[int | str | float | bool | tuple[int]]`, indicating that it is a set of elements that can be either integers, strings, floats, booleans, or tuples. The `empty` variable is declared as a `set`, indicating that it is an empty set without any type restrictions.

You cannot index or slice sets.

You can use `in` and `not in` to check whether a value is in the set:

:::cell id=sets-demo3
```python starter
-7 in some_ints
```
:::

:::cell id=sets-demo4
```python starter
-7 not in some_ints
```
:::

You can `add` elements to a set or `remove` elements from a set:

:::cell id=sets-demo5
```python starter
some_ints.remove(1)
some_ints
```
:::

:::cell id=sets-demo6
```python starter
some_ints.add(1)
some_ints
```
:::

The `len` function tells you how many elements are in a set:

:::cell id=sets-demo7
```python starter
len(some_elements)
```
:::

The `clear` method empties a set:

:::cell id=sets-demo8
```python starter
some_elements.clear()
len(some_elements)
```
:::

### Set Operations

Python has operators for performing various set operations. The most common set operations are *union*, *intersection*, *difference*, and *symmetric difference*. Each of these operations produces a new set and leaves the original sets unchanged.

:::cell id=sets-demo9
```python starter
set_A: set[int] = {1, 2, 3}
set_B: set[int] = {5, 3, 4}
```
:::

The intersection of two sets is a new set that contains every element that is in **both** sets.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. Only the overlapping region in the middle, the elements shared by both circles, is shaded. That shaded middle is the intersection.

:::cell id=sets-demo10
```python starter
set_A & set_B
```
:::

The union of two sets is a new set that contains every element that is in **either** set.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. The entire area of both circles, including the overlap, is shaded. All of it together is the union.

:::cell id=sets-demo11
```python starter
set_A | set_B  # the union operator is the vertical bar symbol
```
:::

The *difference* of two sets is a new set that contains every element that is in the first set **except for** the elements that are also in the second set. This operation is not "symmetric", the result may be different depending on which set comes first.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. Only the part of circle A that does not overlap circle B is shaded. That shaded crescent is the difference A minus B.

:::cell id=sets-demo12
```python starter
print(set_A - set_B)
print(set_B - set_A)
```
:::

The symmetric difference of two sets is a new set that contains every element that is in either set except the elements that are in both sets. This is the same as the union minus the intersection.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. Both circles are shaded except for the overlapping region in the middle, which is left blank. The two shaded crescents together are the symmetric difference.

:::cell id=sets-demo13
```python starter
set_A ^ set_B
```
:::

:::cell id=sets-demo14
```python starter
# this is the same as set_A ^ set_B
(set_A | set_B) - (set_A & set_B)
```
:::

We can iterate through a set with a for loop:

:::cell id=sets-demo15
```python starter
el: int
for el in set_B:
    print(el * 2)
```
:::

### Lists vs. Sets

How do you know when to use a list and when to use a set?

1. A set cannot contain duplicate elements, but a list can.
2. A set can only contain values that are immutable, but lists can contain mutable values.
3. A list is ordered, so you can know that its elements will be traversed or printed out in a particular order. The same is not true of sets (or dictionaries), which are unordered.
4. Checking whether a certain value is in a list takes time proportional to the length of the list, but doing so in a set is very fast, regardless of the size of the set.

### Set Comprehensions

A set comprehension looks just like a list comprehension except it uses curly braces instead of square brackets. For example, if you have a list of names that possibly contains duplicates, and you would like to filter out any names that aren't palindromes (ignoring case) and get rid of duplicates at the same time, you could create a set like so:

:::cell id=sets-demo16
```python starter
name_list: list[str] = ["Hannah", "Bob", "Carl",
                        "Rebecca", "Carl", "Bob"]

name: str
name_set: set[str] = {name for name in name_list if name.lower() == name.lower()[::-1]}
name_set
```
:::

Checking for equality to the reverse slice checks for palindromes. Using `lower()` makes sure that a capital letter does not make us pay attention to case. The curly braces mean it creates a set, which will automatically exclude any duplicates.

## Exercises

:::cell id=sets-ex1 kind=exercise
1. Write your own function called `unionize` for finding the union of two sets. Your function should take as parameters two sets, and return a new set that is the union of those two sets. Do not use Python's built-in union functionality.

```python starter
# Type code here
```

```python tests
assert "unionize" in dir(), "Define a function named unionize."
assert unionize({1, 2, 3}, {5, 3, 4}) == {1, 2, 3, 4, 5}, (
    "unionize({1, 2, 3}, {5, 3, 4}) should return {1, 2, 3, 4, 5}, "
    f"but it returned {unionize({1, 2, 3}, {5, 3, 4})!r}."
)
assert unionize(set(), {1, 2}) == {1, 2}, (
    "The union with the empty set should return the other set."
)
assert unionize({1, 2}, {1, 2}) == {1, 2}, (
    "The union of a set with itself should return the same elements."
)
a = {1, 2}
b = {3, 4}
unionize(a, b)
assert a == {1, 2} and b == {3, 4}, (
    "unionize should not modify the sets passed to it."
)
```

```python solution
def unionize(s1: set[object], s2: set[object]) -> set[object]:
    result: set[object] = set()
    i: object
    for i in s1:
        result.add(i)
    j: object
    for j in s2:
        result.add(j)
    return result
```
:::

:::cell id=sets-ex2 kind=exercise
2. Write your own function called `intersect` for finding the intersection of two sets. Your function should take as parameters two sets, and return a new set that is the intersection of those two sets. Do not use Python's built-in intersection functionality.

```python starter
# Type code here
```

```python tests
assert "intersect" in dir(), "Define a function named intersect."
assert intersect({1, 2, 3}, {5, 3, 4}) == {3}, (
    "intersect({1, 2, 3}, {5, 3, 4}) should return {3}, "
    f"but it returned {intersect({1, 2, 3}, {5, 3, 4})!r}."
)
assert intersect({1, 2}, {3, 4}) == set(), (
    "Sets with no common elements should intersect to the empty set."
)
assert intersect({1, 2, 3}, {1, 2, 3}) == {1, 2, 3}, (
    "The intersection of a set with itself should return the same elements."
)
```

```python solution
def intersect(s1: set[object], s2: set[object]) -> set[object]:
    i: object
    return {i for i in s1 if i in s2}
```
:::

:::cell id=sets-ex3 kind=exercise
3. Write your own function called `sym_diff` for finding the symmetric difference of two sets. Your function should take as parameters two sets, and return a new set that is the symmetric difference of those two sets. Do not use Python's built-in symmetric difference functionality.

```python starter
# Type code here
```

```python tests
assert "sym_diff" in dir(), "Define a function named sym_diff."
assert sym_diff({1, 2, 3}, {5, 3, 4}) == {1, 2, 4, 5}, (
    "sym_diff({1, 2, 3}, {5, 3, 4}) should return {1, 2, 4, 5}, "
    f"but it returned {sym_diff({1, 2, 3}, {5, 3, 4})!r}."
)
assert sym_diff({1, 2, 3}, {1, 2, 3}) == set(), (
    "The symmetric difference of a set with itself should be the empty set."
)
assert sym_diff(set(), {1, 2}) == {1, 2}, (
    "The symmetric difference with the empty set should return the other set."
)
```

```python solution
def sym_diff(s1: set[object], s2: set[object]) -> set[object]:
    s3: set[object] = s1 | s2
    i: object
    return {i for i in s3 if (i not in s1) or (i not in s2)}
```
:::
