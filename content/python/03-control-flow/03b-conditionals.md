---
id: conditionals
title: Conditional Execution
section: 3
---

## `if` Statements

The `if` statement lets our code take different branches depending on whether a condition is `True` or `False`. Here's a simple example:

:::cell id=conditionals-demo1
```python starter
num: int = 14
if num % 2 == 0:
    print("num is even")   # This line executes if and only if the condition is True
else:
    print("num is odd")    # This line executes if and only if the condition is False
```
:::

The `else` case is optional. Both the `if` and `else` cases can contain as many statements as needed:

:::cell id=conditionals-demo2
```python starter
even_nums: int = 0
odd_nums: int = 0

num: int = 47
if num % 2 == 0:
    print("num is even")
    even_nums += 1
else:
    print("num is odd")
    odd_nums += 1
```
:::

Indentation matters in Python. Many languages use it only for readability, but in Python it determines which statements belong together. The code for an `if` statement is indented underneath it, and returning to the original indentation ends the block.

Python does not require a specific number of spaces, but 4 is the usual choice (unless the existing code uses a different amount).

## Nested `if` statements and `elif`

You can also have nested `if` statements (`if` statements inside other `if` statements):

:::cell id=conditionals-demo3
```python starter
score: int = int(input("Enter a score: "))
grade: str = ""
if score >= 90:
    grade = "A"
else:
    if score >= 80:   # If we get here we already know the score is less than 90
        grade = "B"
    else:
        if score >= 70:   # If we get here we already know the score is less than 80
            grade = "C"
        else:
            if score >= 60:   # Etc.
                grade = "D"
            else:
                grade = "F"
print("Letter grade = ", grade)
```
:::

The indentation tells Python which `if`s and `else`s go together. This much nesting is hard to read, so the more common way to write this example is:

:::cell id=conditionals-demo4
```python starter
score: int = int(input("Enter a score: "))
grade: str = ""
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
print("Letter grade = ", grade)
```
:::

Here `elif` is short for `else if`.

:::cell id=predict-elif-vs-if kind=exercise
**Check your understanding.** Predict the result. Look at what the first `if` does to `x` before the second test runs.

```python
x = 10
y = 0
if x > 5:
    x = 2
    y += 1
if x > 1:
    y += 10
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
x = 10
y = 0
if x > 5:
    x = 2
    y += 1
if x > 1:
    y += 10
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Re-check the value of x when each test runs."
assert final_y == real["y"], "final_y is not right. Re-check the value of x when each test runs."
```

```python solution
final_x = 2
final_y = 11
```

```hint
The second `if` is a new test, and it reads `x` as it is after the first block ran.
```
:::

## Extra note on indentation

In Python, indentation is **required** and must be consistent. Every line in a block must have the same indentation. Avoid mixing spaces and tabs, because they can look the same but count differently.

Changing the indentation of a line can change what your program does. For example, if a line meant to run only when a condition is met is indented incorrectly, it may run every time, or never.

## Exercises

:::cell id=conditionals-ex1 kind=exercise
1. Write a function named `range_label` that takes one numeric parameter. It returns `"in range"` if the value is between 50 and 100 (inclusive) and `"out of range"` otherwise.

```python starter
# Type code here
```

```python tests
assert range_label(50) == "in range", 'range_label(50) should return "in range".'
assert range_label(100) == "in range", 'range_label(100) should return "in range".'
assert range_label(75) == "in range", 'range_label(75) should return "in range".'
assert range_label(49) == "out of range", 'range_label(49) should return "out of range".'
assert range_label(150) == "out of range", 'range_label(150) should return "out of range".'
```

```python solution
def range_label(num: float) -> str:
    if num >= 50 and num <= 100:
        return "in range"
    else:
        return "out of range"

print(range_label(72))
```
:::

:::cell id=conditionals-ex2 kind=exercise
2. Write a function named `size_label` that takes one numeric parameter. It returns `"small"` if the value is less than 10, `"medium"` if it is at least 10 but less than 50, and `"large"` if it is at least 50.

```python starter
# Type code here
```

```python tests
assert size_label(5) == "small", 'size_label(5) should return "small".'
assert size_label(9) == "small", 'size_label(9) should return "small".'
assert size_label(10) == "medium", 'size_label(10) should return "medium".'
assert size_label(49) == "medium", 'size_label(49) should return "medium".'
assert size_label(50) == "large", 'size_label(50) should return "large".'
assert size_label(100) == "large", 'size_label(100) should return "large".'
```

```python solution
def size_label(num: float) -> str:
    if num < 10:
        return "small"
    elif num < 50:
        return "medium"
    else:
        return "large"

print(size_label(25))
```
:::

:::cell id=conditionals-ex3 kind=exercise
3. Write a function named `number_word` that takes an integer parameter. If the integer is a value from 1 to 5, it returns the English word for that number. Otherwise it returns `"input not recognized"`.

```python starter
# Type code here
```

```python tests
assert number_word(1) == "one", 'number_word(1) should return "one".'
assert number_word(2) == "two", 'number_word(2) should return "two".'
assert number_word(3) == "three", 'number_word(3) should return "three".'
assert number_word(4) == "four", 'number_word(4) should return "four".'
assert number_word(5) == "five", 'number_word(5) should return "five".'
assert number_word(0) == "input not recognized", 'number_word(0) should return "input not recognized".'
assert number_word(6) == "input not recognized", 'number_word(6) should return "input not recognized".'
```

```python solution
def number_word(num: int) -> str:
    if num == 1:
        return "one"
    elif num == 2:
        return "two"
    elif num == 3:
        return "three"
    elif num == 4:
        return "four"
    elif num == 5:
        return "five"
    else:
        return "input not recognized"

print(number_word(3))
```
:::

:::cell id=predict-nested-branch kind=exercise
4. Predict the result. Find which inner branch runs, then see what the last test reads.

```python
x = 7
y = 0
if x > 5:
    if x > 8:
        y = 1
    elif x > 6:
        y = 2
        x += 10
    else:
        y = 3
else:
    y = 4
if x > 10:
    y += 5
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
x = 7
y = 0
if x > 5:
    if x > 8:
        y = 1
    elif x > 6:
        y = 2
        x += 10
    else:
        y = 3
else:
    y = 4
if x > 10:
    y += 5
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Find the one branch that runs, then check the last test."
assert final_y == real["y"], "final_y is not right. Find the one branch that runs, then check the last test."
```

```python solution
final_x = 17
final_y = 7
```

```hint
Only one branch of a chain runs. Then the final `if` sees the changed `x`.
```
:::
