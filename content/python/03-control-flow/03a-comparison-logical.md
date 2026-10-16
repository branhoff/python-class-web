---
id: comparison-logical
title: Comparison and Logical Operators
section: 3
---

## Comparison Operators

We often need to compare two values. Is one value greater, smaller, or equal?

Python has the following comparison operators:

```python
num_1 == num_2 # num_1 equals num_2
num_1 != num_2 # num_1 does not equal num_2
num_1 > num_2 # num_1 is greater than num_2
num_1 < num_2 # num_1 is less than num_2
num_1 >= num_2 # num_1 is greater than or equal to num_2
num_1 <= num_2 # num_1 is less than or equal to num_2
```

Each of the above **conditions** is either `True` or `False`, which is a bool value.

For example:

:::cell id=comparison-logical-demo1
```python starter
print(17 < 5)
```
:::

:::cell id=comparison-logical-demo2
```python starter
print(3 != 12)
```
:::

Don't mix up the assignment operator (`=`) and the equality operator (`==`). It's a common mistake that can be hard to see.

**Careful: don't test two floats for exact equality, because round-off errors can make values that should be equal differ slightly.**

Instead, if you need to compare float values for equality, you can do something like this:

```python
abs(num_1 - num_2) < 0.000001
```

This takes the absolute value of the difference between the two numbers and checks whether it's less than a very small value.

Unlike many computer languages, Python allows you to chain comparison operators. In Python you check if x is between 2 and 7 by saying

```python
2 < x < 7
```

whereas in many languages you would need to write that as

```python
2 < x and x < 7
```

The logical operator `and` is discussed in the following section.

## Logical Operators

Sometimes we need to combine comparisons. Python has the following logical operators:

```python
bool_1 and bool_2                  # Both bool_1 and bool_2 equal True
bool_1 or bool_2                   # At least one of bool_1 and bool_2 equals True
not bool_1                         # Flips the value of bool_1. If bool_1 is True not bool_1 is False and vice versa
```

Each of these conditions is also either `True` or `False`.

:::cell id=comparison-logical-demo3
```python starter
print(17 >= 10 and 5 % 2 == 0)   # True and False, which equals False
```
:::

:::cell id=comparison-logical-demo4
```python starter
print(17 >= 10 or 5 % 2 == 0)    # True or False, which equals True
```
:::

:::cell id=comparison-logical-demo5
```python starter
print(not 17 >= 10)              # not True, which equals False
```
:::

## Some Clarification

Logical operators can look confusing, but they work like everyday language.

Consider two conditions, represented by `P` and `Q`. When `P` and `Q` are joined with the `and` operator, the statement is true only if both `P` and `Q` are true. For example, if someone asks *"Do you have a car and a driver's license?"* The answer would be yes only if you have **BOTH** a car **AND** a driver's license. On the other hand, the `or` operator makes the statement `True` if either `P` or `Q` (or both) are `True`. If someone asks *"Do you have a car or a bike?"* The answer would be yes if you have either a car or a bike (or both).

The `not` operator simply reverses the truth value of a statement, so if `P` is `False`, then `not P` is `True` and vice versa.

## A Common Syntax Error

To check if num_x and num_y are both equal to 5, it is **not** correct to do the following:

```python
num_x and num_y == 5  # wrong
```

since that checks `num_x` on its own as a true or false value, and also checks `num_y == 5`. Instead, you would need to do this:

```python
num_x == 5 and num_y == 5
```

or since we know we can chain comparisons:

```python
num_x == num_y == 5
```

## Quizzes

:::cell id=comparison-logical-ex1 kind=quiz
1. Print the value of `17 < 5`.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "False", f"Your program should print False, but it printed {stdout.strip()!r}."
```

```python solution
print(17 < 5)
```
:::

:::cell id=comparison-logical-ex2 kind=quiz
2. Write a function named `greater_than_ten` that takes one numeric parameter and returns `True` if the value is greater than 10 and `False` otherwise.

```python starter
# Type code here
```

```python tests
assert greater_than_ten(11) is True, "greater_than_ten(11) should return True."
assert greater_than_ten(10) is False, "greater_than_ten(10) should return False."
assert greater_than_ten(10.5) is True, "greater_than_ten(10.5) should return True."
assert greater_than_ten(-3) is False, "greater_than_ten(-3) should return False."
```

```python solution
def greater_than_ten(num: float) -> bool:
    return num > 10

print(greater_than_ten(42))
```
:::

:::cell id=comparison-logical-ex3 kind=quiz
3. Write a function named `in_range` that takes one numeric parameter and returns `True` if the value is between 50 and 100 (inclusive) and `False` otherwise.

```python starter
# Type code here
```

```python tests
assert in_range(50) is True, "in_range(50) should return True."
assert in_range(100) is True, "in_range(100) should return True."
assert in_range(75) is True, "in_range(75) should return True."
assert in_range(49) is False, "in_range(49) should return False."
assert in_range(101) is False, "in_range(101) should return False."
```

```python solution
def in_range(num: float) -> bool:
    return 50 <= num <= 100

print(in_range(75))
```
:::
