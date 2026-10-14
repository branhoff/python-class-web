---
id: numbers
title: Numbers and arithmetic
section: 2
---

Python does math with the usual operators: `+`, `-`, `*`, `/`, and `**` for
powers. Division with `/` always produces a decimal (a `float`).

:::cell id=math-demo
```python starter
print(2 + 3)
print(10 / 4)
print(2 ** 5)
```
:::

## Exercises

:::cell id=multiply kind=exercise
1. Print the result of multiplying `7` by `6`.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "42", f"Expected 42, but got {stdout.strip()!r}."
```

```python solution
print(7 * 6)
```
:::

:::cell id=average kind=exercise
2. Write a function `average(a, b)` that returns the average of its two
arguments, then print `average(10, 20)`.

```python starter
def average(a, b):
    pass
```

```python tests
assert average(10, 20) == 15.0, "average(10, 20) should be 15.0."
assert average(4, 6) == 5.0, "average(4, 6) should be 5.0."
assert stdout.strip() == "15.0", f"Your program should print 15.0, but it printed {stdout.strip()!r}."
```

```python solution
def average(a, b):
    return (a + b) / 2


print(average(10, 20))
```

```hint
The average of two numbers is their sum divided by 2.
```
:::
