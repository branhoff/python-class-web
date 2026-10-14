---
id: functions
title: Functions
section: 4
---

## Function Calls

We've already been using function calls to print values, read input, get the type of a value or variable, cast from one type to another, and to create ranges. A function call consists of the name of a function followed by a pair of parentheses, which contain all the arguments for the function. A function carries out some task and returns a value when it's done. In python all functions return the special value `None` if no other value is defined.

```python
int(-12.5)
```
In the above function call, the name of the function is *int*. It's being passed one argument, the number -12.5. In this example, the int function would return the integer -12 as its **return value**.

```python
print("num orders =", num_orders)
```

In the above function call, the name of the function is *print*. It's being passed two arguments, the string "num orders =" and the variable *num_orders*. The print function doesn't have a return value, so it defaults to None.

```python
print(float(input()))
```

As we've already seen, you can chain function calls together. The above line would read input from the user, cast that input to a float, and then print out the result.

When you make a function call that returns a value, make sure you don't accidentally "drop" it. Most of the time you would either assign the return value to a variable or have the function call be part of a larger expression that uses the return value (like in the example above where we directly use the result of one function in another function).

## Function definitions

To define a function, you use the "def" keyword. For example, we could define a function that adds together three numbers as in the example below. Try calling the `sum_three` function below by typing `sum_three(-5, 189, 12)` underneath the `# Type here` comment and hit **&lt;Shift> + &lt;Enter>**

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

In the above definition, the name of the function is sum_three. The rules for function names are the same as for variable names. The parameters of the function are num1, num2, and num3. When you call a function, the arguments in the function call are matched up (in order) with the parameters given in the function definition, so if we called the function like this:

```python
result = sum_three(-5, 189, 12)
```

Then `-5` is assigned to `num1`, `189` is assigned to `num2`, and `12` is assigned to `num3`.

When the computer is executing the program and it reaches a function call, then it jumps to the function definition and executes the code there. Once the function is done, the computer returns back to the function call and continues from there.

A function is done when the computer either reaches the end of the code in the definition, or it reaches a return statement, whichever happens first. A return statement doesn't have to go at the end of the function, and you can even have multiple return statements in a function. As soon as the code executes any return statement, it immediately ends the function and returns execution (and any return value) back to the function call.

If your function doesn't have a return value, you can still use the return keyword if you want to end the function before reaching the end of the definition for some reason. You can see how this works in the first function below.

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
# Try playing around with the function above here
```
:::

Both versions have their uses, they both give the same output for the same input. In programming, often there is no clear right answer for how to solve a problem, so it comes down to personal preference, and the preferences of the development team working on a shared codebase.

The sum_three function could also be defined like this:

:::cell id=sum-concise
```python starter
def sum(num_1, num_2, num_3):
    return num_1 + num_2 + num_3
```
:::

This definition is more concise and probably preferable for this function, but in cases where you have a long and/or complicated expression, splitting it up into separate steps can make it easier to read and debug.

If a function doesn't have any parameters, you still need the parentheses following the function name:

```python
 def print_greeting():
    print("howdy")
```

We would call this function like so:
```python
print_greeting()
```

A function must be defined somewhere above the place where it's called. That is, you cannot have the function call appear earlier in the file than the function definition. Otherwise when the computer is executing your program it will see the function call before it knows what that function does.

## Type hinting with functions
Type hinting with functions in Python allows you to specify the expected data types of the arguments and return values of a function. This information is not used by the Python interpreter at runtime, but it can be used by tools like IDEs, linters, and type checkers to provide better feedback to the developer, improve code documentation, and catch potential bugs early in the development process.

Here's an example of a function with type hints:

```python
def repeat_string(string: str, times: int) -> str:
    return string * times
```
In this example, the `: str` type hint after string indicates that the string argument must be a string, and the `: int` type hint after times indicates that the times argument must be an integer. The `-> str` type hint after the function definition indicates that the function returns a string.

Type hints can also be used with basic data types like integers, strings, and floats. For example:

```python
def add_numbers(a: int, b: int) -> int:
    return a + b

def concatenate_strings(a: str, b: str) -> str:
    return a + b

def divide_numbers(a: float, b: float) -> float:
    return a / b
```
In these examples, the type hints specify that the `a` and `b` arguments in each function must be of the corresponding data type (integer, string, or float), and that the return type of each function must also be of the corresponding data type.

It is important to remember that type hints in Python are only suggestions, and the Python interpreter will not enforce them at runtime. It is however considered best practice to utilize them, and we believe making use of them prepares you for stricter staticly type languages. So going forward, we'll utilize type hinting in our functions as well.

## Function Scope

Variables in a function definition only exist while that function is executing. When the function is done, those variables go away. Such variables have **function scope**. If a function uses a variable name that is already being used in some other part of the program, it is a separate variable - changing the one in the function does not change any other variables of that name. If you run the following code:

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

Then the program will start at the line `num = 5`, which assigns the value `5` to a variable called `num`. Next is the function call `func()`. At this point execution jumps to the function definition, which assigns the value `12` to a variable called `num`, but this is a separate variable, which has function scope.

Assigning `12` to it does not affect the value of the other variable named num. Next, the function prints out the value of the local `num` variable, which is `12`. Having reached the end of the function definition, execution returns back to the function call. The next line prints out the value of the original `num` variable, which is still `5`.

## Default arguments

It's possible to give a parameter a default value that it will have if no value is passed for it in the function call. The syntax looks like you're assigning a value to that parameter, but if the function call does pass a value for that parameter, then the default argument is not used. Here's a simple example:
```python
def sum(num_1: int, num_2: int, num_3: int = 0) -> int:
    return num_1 + num_2 + num_3
```

We've made zero the default argument for `num_3`. This allows us to call `sum` with either two or three arguments.

Parameters with default arguments must all go at the end of the parameter list. In the `sum` function, we can't give `num_1` a default argument and then not give `num_2` and `num_3` default arguments.

## Changing the Value of a Parameter

If we pass a variable to a function and the function changes that parameter, what happens to the original variable that was passed? Does it change because the parameter in the function was changed? Let's try it and see:

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

Here the program starts by assigning `8` to `num`. Next it calls the function `square_val`, passing `num` as an argument. Now execution jumps to the function definition, and the argument `num` is matched with the parameter `val`, so now `val` and `num` refer to the same value. Next, `val` is assigned the value of `val` times itself. Then the function prints out the value of `val`, which is `64`.

Since the function has finished, execution returns to the function call. Next the value of `num` is printed out, which is `8`. We can see that even though `val` and `num` referred to the same value, changing `val` did not change `num`. This is not because of scope. We'll discuss the reason behind it in a later module. What if we want `num` to change?

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

Now when we run the code, we see that `num` is updated to the square of its previous value.

## Docstrings

A docstring is a special type of string you should use to help document your functions. A docstring gives a description of the function's purpose, with a triple quotation mark at the beginning and end. It goes on the first indented line of the function.

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

Python has a built-in help function that will print out the description you provided in the docstring:

```python
help(area_of_circle)
```

There also exist third-party tools that will read and display docstrings in various formats.

## Stack Traces

When a Python program crashes, the error messages will include a stack trace that tells you which functions were active at the time. If function A calls function B, which calls function C, and if there is an error in C that crashes the program, then the stack trace that is printed out will include which line of code we were on in functions A, B, and C. Here is an example:

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

So now if we try to run this program by calling it,

:::cell id=stack-trace-call
```python starter
func_A()
```
:::

Then because `func_C` tries to use a nonexistent variable, the program crashes and gives us the stack trace.

This can be helpful when trying to figure out exactly what sequence of events caused a program to crash.

*NOTE: this is a good example of the importance of type hinting and docstrings. It's hard to see what these three functions are intending to do on their own. This could be vastly improved using better naming conventions for the functions, paramaters and variables, docstrings explaining the WHY of the function, and type hinting (lacking in `func_C`) so we can understand quickly what expectations should be*

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
