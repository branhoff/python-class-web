---
id: input-and-casting
title: Input and Casting
section: 2
---

## Input function

The `input()` function reads typed input from the user. You can use it in a
couple of ways. For example, if you want to ask the user for their name, you can
do this:

:::cell id=input-and-casting-demo1
```python starter
print("Please enter your name.")
name: str = input()
print("Hi", name)
# make sure you actually enter something or this cell will keep running
```
:::

Or you can do this:

:::cell id=input-and-casting-demo2
```python starter
name: str = input("Please enter your name: ")
print("Hi", name)
# make sure you actually enter something or this cell will keep running
```
:::

Notice that with the first way, your input will appear on the line after the
prompt, and with the second way, your input would appear on the same line as the
prompt.

User input is always a string. If you want a numeric value from user input, then
you need to cast the string to an int or a float.

:::cell id=input-and-casting-demo3
```python starter
age: int = int(input("Please enter your age: "))
height_in_meters: float = float(input("Please enter your height in meters: "))
print(age)
print(height_in_meters)
# make sure you actually enter something or this cell will keep running
```
:::

Each of the lines above combines two functions. First the input function gets a
string from the user. Next the `int()` or `float()` function casts that string
to a numeric value. That value is then assigned to the variable. We can call
those functions on separate lines if we want:

:::cell id=input-and-casting-demo4
```python starter
str_age = input("Please enter your age: ") # str_age will refer to a string value
int_age = int(str_age) # int_age will refer to an int value
print(str_age)
print(int_age)
# make sure you actually enter something or this cell will keep running
```
:::

If the user enters a string that cannot be cast to the specified type, that
causes an error. For example, if for height in meters we try to enter "hi", what
happens?

Here is an example that asks the user for two numbers and prints out their sum:

:::cell id=input-and-casting-demo5
```python starter
print("Please enter two numbers.")
num_1 = float(input())
num_2 = float(input())
print("The sum is", num_1 + num_2)
```
:::

You can also cast an int to a float:

:::cell id=input-and-casting-demo6
```python starter
print(float(18))
```
:::

Or a float to an int, which truncates everything after the decimal point:

:::cell id=input-and-casting-demo7
```python starter
print(int(3.25))
```
:::

You can also cast values to strings with `str()`.

:::cell id=input-and-casting-demo8
```python starter
print(str(-9.4))
```
:::

:::cell id=input-and-casting-demo9
```python starter
print(str(43))
```
:::

## Exercises

The exercises below are written as functions you can test without typing input.
In a real program you would read these values with `input()`, but a function
that takes its values as parameters is easier to test and reuse.

:::cell id=input-and-casting-ex1 kind=exercise
1. Write a function named `greet` that takes a `name` parameter and prints out `"Hello"` followed by the name. For example, `greet("Sam")` should print `Hello Sam`.

```python starter
# Type code here
```

```python tests
import io, contextlib

def _captured(*args):
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        greet(*args)
    return buffer.getvalue().strip()

assert "greet" in dir(), "You should define a function named greet."
assert _captured("Sam") == "Hello Sam", f"greet('Sam') should print 'Hello Sam', but it printed {_captured('Sam')!r}."
assert _captured("Mina") == "Hello Mina", f"greet('Mina') should print 'Hello Mina', but it printed {_captured('Mina')!r}."
```

```python solution
def greet(name: str) -> None:
    print("Hello", name)

greet("Sam")
```
:::

:::cell id=input-and-casting-ex2 kind=exercise
2. Write a function named `multiply` that takes two numbers and prints out `"The result is"` followed by the result of multiplying those numbers. For example, `multiply(3, 4)` should print `The result is 12`.

```python starter
# Type code here
```

```python tests
import io, contextlib

def _captured(*args):
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        multiply(*args)
    return buffer.getvalue().strip()

assert "multiply" in dir(), "You should define a function named multiply."
assert _captured(3, 4) == "The result is 12", f"multiply(3, 4) should print 'The result is 12', but it printed {_captured(3, 4)!r}."
assert _captured(2.5, 4) == "The result is 10.0", f"multiply(2.5, 4) should print 'The result is 10.0', but it printed {_captured(2.5, 4)!r}."
```

```python solution
def multiply(a: float, b: float) -> None:
    print("The result is", a * b)

multiply(6, 7)
```
:::

:::cell id=input-and-casting-ex3 kind=exercise
3. Write a function named `divide_report` that takes two integers, a `dividend` and a `divisor`, and prints a report in this exact form:

    `<divisor> goes into <dividend> <i> times with <r> as the remainder.`

where `<i>` is the whole number of times the divisor goes into the dividend and
`<r>` is the remainder. For example, `divide_report(17, 5)` should print:

    `5 goes into 17 3 times with 2 as the remainder.`

```python starter
# Type code here
```

```python tests
import io, contextlib

def _captured(*args):
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        divide_report(*args)
    return buffer.getvalue().strip()

assert "divide_report" in dir(), "You should define a function named divide_report."
assert _captured(17, 5) == "5 goes into 17 3 times with 2 as the remainder.", f"divide_report(17, 5) printed {_captured(17, 5)!r}."
assert _captured(10, 3) == "3 goes into 10 3 times with 1 as the remainder.", f"divide_report(10, 3) printed {_captured(10, 3)!r}."
```

```python solution
def divide_report(dividend: int, divisor: int) -> None:
    quotient: int = dividend // divisor
    remainder: int = dividend % divisor
    print(divisor, "goes into", dividend, quotient, "times with", remainder, "as the remainder.")

divide_report(17, 5)
```

```hint
Use floor division `//` to get how many whole times the divisor fits, and the
mod operator `%` to get the remainder.
```
:::
