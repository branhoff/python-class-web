---
id: functions
title: Functions
section: 4
---

## Function Calls

We've already been using function calls to print values, read input, get the type of a value or variable, convert from one type to another, and create ranges. A function call is the name of a function followed by a pair of parentheses containing the function's arguments (the values you give it). A function carries out some task and returns a value when it's done. In Python, a function returns the special value `None` if it doesn't return anything else.

```python
int(-12.5)
```
In the above function call, the name of the function is *int*. It's being passed one argument, the number -12.5. The int function returns the integer -12. This is its **return value**.

```python
print("num orders =", num_orders)
```

In the above function call, the name of the function is *print*. It's being passed two arguments, the string "num orders =" and the variable *num_orders*. The print function doesn't have a return value, so it defaults to None.

```python
print(float(input()))
```

As we've already seen, you can chain function calls together. The above line reads input from the user, converts it to a float, and then prints the result.

When you call a function that returns a value, make sure you don't accidentally "drop" it. Either assign the return value to a variable or make the call part of a larger expression that uses it (like the example above, where the result of one function goes straight into another).

## Function definitions

To define a function, you use the `def` keyword. For example, the function below adds together three numbers. Try calling `sum_three` by typing `print(sum_three(-5, 189, 12))` underneath the `# Type here` comment, then click **Run**.

:::cell id=sum-three-try
```python starter
def sum_three(num1, num2, num3):  # The first line is the "function header"
    sum = num1 + num2 + num3
    print("num1 = ", num1)
    print("num2 = ", num2)
    print("num3 = ", num3)
    return sum

# Type here
```
:::

In the above definition, the name of the function is `sum_three`. The rules for function names are the same as for variable names. The parameters (the names the function uses for the values it receives) are `num1`, `num2`, and `num3`. When you call a function, the arguments are matched up in order with the parameters, so if we called the function like this:

```python
result = sum_three(-5, 189, 12)
```

Then `-5` is assigned to `num1`, `189` is assigned to `num2`, and `12` is assigned to `num3`.

When the computer reaches a function call, it jumps to the function definition and runs the code there. Once the function is done, the computer returns to the function call and continues from there.

A function is done when the computer reaches the end of the definition or a return statement, whichever happens first. A return statement doesn't have to go at the end of the function, and a function can have several. As soon as any return statement runs, the function ends and execution (and any return value) goes back to the function call.

If your function doesn't have a return value, you can still use the `return` keyword to end the function early. You can see how this works in the first function below.

:::cell id=print-choice
```python starter
def print_choice_v1(num):
    if num == 1:
        print("one")
        return   # immediately ends the function
    print("not one")


def print_choice_v2(num):
    if num == 1:
        print("one")
    else:
        print("not one")
```
:::

:::cell id=print-choice-playground
```python starter
def print_choice_v1(num):
    if num == 1:
        print("one")
        return   # immediately ends the function
    print("not one")


def print_choice_v2(num):
    if num == 1:
        print("one")
    else:
        print("not one")

# Try calling the functions above here
```
:::

Both versions give the same output for the same input. In programming, there is often no single right way to solve a problem, so the choice comes down to personal preference and the preferences of the team sharing the code.

The sum_three function could also be defined like this:

:::cell id=sum-concise
```python starter
def sum(num_1, num_2, num_3):
    return num_1 + num_2 + num_3

print(sum(-5, 189, 12))
```
:::

This definition is shorter and probably better for this function, but when an expression is long or complicated, splitting it into separate steps can make it easier to read and debug.

If a function doesn't have any parameters, you still need the parentheses following the function name:

```python
 def print_greeting():
    print("howdy")
```

We would call this function like so:
```python
print_greeting()
```

A function must be defined above the place where it's called. If the call appears earlier in the file than the definition, the computer reaches the call before it knows what the function does.

## Type hinting with functions
Type hints let you state the expected data types of a function's arguments and return value. Python does not use this information when the program runs. Tools such as code editors, linters (which flag likely mistakes), and type checkers do use it to give better feedback, document the code, and catch bugs early.

Here's an example of a function with type hints:

```python
def repeat_string(string: str, times: int) -> str:
    return string * times
```
In this example, the `: str` after `string` says the `string` argument should be a string, and the `: int` after `times` says the `times` argument should be an integer. The `-> str` after the parameter list says the function returns a string.

Here are more examples with integers, strings, and floats:

```python
def add_numbers(a: int, b: int) -> int:
    return a + b

def concatenate_strings(a: str, b: str) -> str:
    return a + b

def divide_numbers(a: float, b: float) -> float:
    return a / b
```
In these examples, the type hints say that `a` and `b` in each function should have the matching data type (integer, string, or float), and so should the return value.

Remember that type hints are only suggestions: Python will not enforce them when the program runs. Using them is still considered good practice, and it prepares you for languages with stricter static typing. So going forward, we'll use type hints in our functions.

## Exercises

:::cell id=double-number kind=exercise
1. Write a function that takes a numeric parameter and returns twice that number. Write a print statement that calls your function with the number `5` and prints the function's return value.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "10", f"Your program should print 10, but it printed {stdout.strip()!r}."
```

```python solution
def double_num(x: int) -> int:
    return x*2

print(double_num(5))
```
:::

:::cell id=concat-strings kind=exercise
2. Write a function that takes two string parameters and returns the string formed by concatenating those two strings together. Write a print statement that calls your function with the values `"hello"` and `"world"` and prints the function's return value.

```python starter
# Type code here
```

```python tests
assert stdout.strip().replace(" ", "") == "helloworld", f"Your program should print helloworld, but it printed {stdout.strip()!r}."
```

```python solution
def combine_string(s1: str, s2: str) -> str:
    return s1 + s2

print(combine_string("hello ", "world"))
```
:::

:::cell id=is-even kind=exercise
3. Write a function named `is_even` that takes an `int` parameter and returns a `bool` value - `True` if the integer is even, and `False` if the integer is odd.

```python starter
# Type code here
```

```python tests
assert is_even(4) is True, "is_even(4) should return True."
assert is_even(3) is False, "is_even(3) should return False."
assert is_even(0) is True, "is_even(0) should return True."
assert is_even(-2) is True, "is_even(-2) should return True."
assert is_even(-3) is False, "is_even(-3) should return False."
```

```python solution
def is_even(n: int) -> bool:
    return n % 2 == 0

print(is_even(3))
print(is_even(48))
```
:::
