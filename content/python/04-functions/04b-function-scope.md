---
id: function-scope
title: Function Scope and Parameters
section: 4
---

This page continues from Functions. It covers where a function's variables live, default arguments, what happens when a function changes one of its parameters, docstrings, and reading a stack trace.

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

:::cell id=predict-scope kind=check
**Check your understanding.** Predict the result. The program is not run for you.

```python
x = 4

def change() -> None:
    x = 9
    y = x + 1

change()
z = x + 1
```

Predict what each variable holds after the program finishes. The program is not run for you. Change the values below to your predictions:

- `final_x` is the value of `x` at the end
- `final_z` is the value of `z` at the end

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

:::cell id=predict-parameter kind=check
**Check your understanding.** Predict the result. Look closely at what happens to each call's return value.

```python
def add_ten(val: int) -> int:
    val = val + 10
    return val

num = 5
add_ten(num)
other = add_ten(num)
```

Predict what each variable holds after the program finishes. The program is not run for you. Change the values below to your predictions:

- `final_num` is the value of `num` at the end
- `final_other` is the value of `other` at the end

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

## Quizzes

:::cell id=default-greeting kind=quiz
1. Write a function named `greet` that takes a `name` and a `greeting`, and returns the greeting, a comma, a space, the name and an exclamation mark. Give `greeting` a default value of `"Hello"`, so `greet("Ava")` returns `"Hello, Ava!"` and `greet("Ava", "Hi")` returns `"Hi, Ava!"`.

```python starter
# Type code here
```

```python tests
assert greet("Ava") == "Hello, Ava!", f'greet("Ava") should return "Hello, Ava!", but it returned {greet("Ava")!r}.'
assert greet("Ava", "Hi") == "Hi, Ava!", f'greet("Ava", "Hi") should return "Hi, Ava!", but it returned {greet("Ava", "Hi")!r}.'
assert greet("Raj", "Welcome") == "Welcome, Raj!", "A greeting you pass in should replace the default."
```

```python solution
def greet(name: str, greeting: str = "Hello") -> str:
    return greeting + ", " + name + "!"
```

```hint
Put the parameter with the default value last: `greeting: str = "Hello"`. Build the result with `+`, as in the string lessons.
```
:::
