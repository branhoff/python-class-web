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

## Function Scope

Variables created in a function only exist while that function is running. When the function is done, they go away. Such variables have **function scope**. If a function uses a variable name that is already used elsewhere in the program, it is a separate variable: changing the one in the function does not change any other variable with that name. Consider this code:

:::cell id=scope-demo
```python starter
def func() -> None:
    num: int = 12
    print(num)

num: int = 5
func()
print(num)
```
:::

The program starts at the line `num: int = 5`, which assigns the value `5` to a variable called `num`. Next is the function call `func()`. Execution jumps to the function definition, which assigns the value `12` to a variable called `num`. This is a separate variable with function scope.

Assigning `12` to it does not affect the other variable named `num`. Next, the function prints the local `num`, which is `12`. At the end of the function, execution returns to the function call. The next line prints the original `num`, which is still `5`.

## Default arguments

You can give a parameter a default value, which it has if the function call doesn't pass a value for it. The syntax looks like an assignment. If the call does pass a value for that parameter, the default is not used. Here's a simple example:
```python
def sum(num_1: int, num_2: int, num_3: int = 0) -> int:
    return num_1 + num_2 + num_3
```

We've made zero the default argument for `num_3`, so we can call `sum` with either two or three arguments.

Parameters with default arguments must go at the end of the parameter list. In the `sum` function, we can't give `num_1` a default argument without also giving `num_2` and `num_3` default arguments.

## Changing the Value of a Parameter

If we pass a variable to a function and the function changes that parameter, does the original variable change too? Let's try it and see:

:::cell id=square-no-return
```python starter
def square_val(val: int) -> int:
    val = val * val
    print(val)

num: int = 8
square_val(num)
print(num)
```
:::

The program starts by assigning `8` to `num`. Next it calls `square_val`, passing `num` as an argument. Execution jumps to the function definition, and the argument `num` is matched with the parameter `val`, so `val` and `num` refer to the same value. Next, `val` is assigned `val` times itself. Then the function prints `val`, which is `64`.

The function has finished, so execution returns to the function call. Next `num` is printed, and it is still `8`. Even though `val` and `num` started with the same value, changing `val` did not change `num`. We'll discuss the reason in a later module. What if we want `num` to change?

We can accomplish that like so:

:::cell id=square-with-return
```python starter
def square_val(val: int) -> int:
    val = val * val
    print(val)
    return val

num: int = 8
num = square_val(num)
print(num)
```
:::

In this version we changed two things:

 1. We have the function return the altered value.
 2. When we call the function, we store the result of the function call (its return value) in `num`.

Now when we run the code, `num` is updated to the square of its previous value.

## Docstrings

A docstring is a special string that documents a function. It describes the function's purpose and starts and ends with triple quotation marks. It goes on the first indented line of the function.

```python
def area_of_circle(radius: float) -> float:
    """Returns the area of the circle with the given radius."""
    return 3.14159 * radius ** 2

#Unlike regular strings, a docstring can go across multiple lines,
#in which case the closing triple quote should go on its own line.
def rando(num_digits: int) -> int:
    """Returns a cryptographically secure pseudorandom number with the number
    of digits specified by the argument.*
    (*Not really, this is just an example of a docstring)
    """

#You can also format it this way...
def rando(num_digits: int) -> int:
    """
    Returns a cryptographically secure pseudorandom number with the number
    of digits specified by the argument.*
    (*Not really, this is just an example of a docstring)
    """
```

Python's built-in `help` function prints the description you wrote in the docstring:

```python
help(area_of_circle)
```

Other tools can also read and display docstrings.

## Stack Traces

When a Python program crashes, the error message includes a stack trace that lists the functions that were active at the time. If function A calls function B, which calls function C, and an error in C crashes the program, the stack trace shows which line we were on in A, B, and C. Here is an example:

:::cell id=stack-trace-setup
```python starter
def func_A() -> int:
    num_A: int = -7
    result_A: int = func_B(num_A)
    return result_A

def func_B(param_B: int) -> int:
    num_B: int = 3
    if param_B < 0:
        func_C()
    return param_B * num_B

def func_C():
    num_C = not_a_var
```
:::

Now we run the program by calling `func_A`:

:::cell id=stack-trace-call
```python starter
def func_A() -> int:
    num_A: int = -7
    result_A: int = func_B(num_A)
    return result_A

def func_B(param_B: int) -> int:
    num_B: int = 3
    if param_B < 0:
        func_C()
    return param_B * num_B

def func_C():
    num_C = not_a_var

func_A()
```
:::

Because `func_C` tries to use a variable that doesn't exist, the program crashes and prints the stack trace.

A stack trace helps you work out what sequence of events caused a crash.

*NOTE: this is a good example of why type hints and docstrings matter. It's hard to tell what these three functions are meant to do. They would be much clearer with better names for the functions, parameters, and variables, docstrings explaining why each function exists, and type hints (missing in `func_C`) showing what each function expects.*

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

:::cell id=predict-scope kind=exercise
4. Predict the result. The program is not run for you.

```python
x = 4

def change() -> None:
    x = 9
    y = x + 1

change()
z = x + 1
```

Set `final_x` and `final_z` to the values the program ends with.

```python starter
final_x = None
final_z = None
```

```python tests
program = """
x = 4

def change() -> None:
    x = 9
    y = x + 1

change()
z = x + 1
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Does the `x` inside the function change the `x` outside it?"
assert final_z == real["z"], "final_z is not right. Which `x` does the last line use?"
```

```python solution
final_x = 4
final_z = 5
```

```hint
The `x` inside `change` is a separate variable that disappears when the function ends. The outer `x` is still 4.
```
:::

:::cell id=predict-parameter kind=exercise
5. Predict the result. Look closely at what happens to each call's return value.

```python
def add_ten(val: int) -> int:
    val = val + 10
    return val

num = 5
add_ten(num)
other = add_ten(num)
```

Set `final_num` and `final_other` to the values the program ends with.

```python starter
final_num = None
final_other = None
```

```python tests
program = """
def add_ten(val: int) -> int:
    val = val + 10
    return val

num = 5
add_ten(num)
other = add_ten(num)
"""
real = {}
exec(program, real)
assert final_num == real["num"], "final_num is not right. Does calling a function change the variable you pass in?"
assert final_other == real["other"], "final_other is not right. Each call starts again from the value of `num`."
```

```python solution
final_num = 5
final_other = 15
```

```hint
Changing `val` inside the function never changes `num`. The first call's result is thrown away because it is not stored. `other` gets the result of the second call, which is 5 + 10.
```
:::
