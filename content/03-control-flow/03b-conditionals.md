---
id: conditionals
title: Conditional Execution
section: 3
---

## `if` Statements

The `if` statement enables us to define branches in our code based on whether a given condition is `True` or `False`. Here's a simple example:

:::cell id=conditionals-demo1
```python starter
num: int = 14
if num % 2 == 0:
    print("num is even")   # This line executes if and only if the condition is True
else:
    print("num is odd")    # This line executes if and only if the condition is False
```
:::

The else case is optional. Both the `if` and `else` cases can contain as many statements as needed:

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

Indentation is crucial for the proper functioning of a Python program. While indentation is important for readability in many programming languages, in Python it plays a larger role as it determines the grouping of statements. Code blocks related to a specific if statement, for example, are indented underneath, and a new block of related statements begins with a return to the original indentation.

While the Python language does not dictate a specific number of spaces for indentation, it is generally recommended to indent 4 spaces, unless the existing code uses a different amount.

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

The indentation tells the Python interpreter which ifs and elses go together, however, this level of nesting can get a little hard to read, so the more common way to express this example would be:

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

Where `elif` is short for `else if`.

## Extra note on indentation

Additionally, it's worth mentioning that in Python, indentation is **MANDATORY** and must be consistent throughout the code. This means that each code block must be indented to the same level, and every line within a block must have the same indentation. Mixing spaces and tabs for indentation is not recommended, as it can cause issues with code readability and portability.

Furthermore, it's important to note that changing the indentation level of a code block can change its meaning, and can lead to unexpected results. For example, an if statement that is indented correctly to indicate that a block of code should be executed only if a certain condition is met, may not work as expected if the indentation is incorrect.

Proper indentation is essential for writing correct and readable Python code, and should be given careful consideration when writing or modifying code. Consistent indentation and adherence to recommended conventions can greatly improve the readability and maintainability of your code.

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
