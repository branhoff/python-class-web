---
id: print-and-types
title: Print Statements and Types
section: 2
---

## Print statements

The `print()` function displays values. Put the value you want to print inside
the parentheses. Here is an example that prints `"Hello world"`.

:::cell id=print-and-types-demo1
```python starter
print("Hello world")
# Press Run to execute this cell. The output appears below.
```
:::

Try it yourself by typing `print("Your Name")`.

:::cell id=print-and-types-demo2
```python starter
# type print and some string below
```
:::

A print statement can print more than one value. Separate the values with
commas. By default, Python inserts a space between them. Try this and see:

:::cell id=print-and-types-demo3
```python starter
print("pi =", 3.14159)
```
:::

The two values in that print statement are different types. The first one is a
string, the second one is a floating-point number (a number with a decimal
point).

We can produce the exact same output like this (give it a try!):

:::cell id=print-and-types-demo4
```python starter
print("pi = 3.14159")
```
:::

## Types

Python distinguishes between different types of values. Here we will talk about
four basic Python types: integers, floating-point numbers, strings and
Booleans. We will encounter some other types later in the course.

### Integers

Integers are numeric values that do not contain a decimal point. In Python 3
integers can be as long as you want (within the limits of your computer's
memory).

:::cell id=print-and-types-demo5
```python starter
print(42)
print(-927)
print(1000000000000000000000000000000000)
```
:::

### Floating-point numbers

Floating-point numbers are numeric values that do contain a decimal point. In
mathematics, these are called real numbers. Integers are a subset of the real
numbers. The value 4 is an integer, but the value 4.0 is a floating-point
number.

:::cell id=print-and-types-demo6
```python starter
print(3.14159)
print(-12.572)
print(2.0)
```
:::

Floats can also be written using scientific notation, using either e or E
followed by a positive or negative integer (the exponent).

:::cell id=print-and-types-demo7
```python starter
print(1.2e7)
print(-3.27E12)
print(1.2e-5)
```
:::

The maximum value of a float is 1.7976931348623157e+308. Floats are stored as
binary fractions. Unfortunately most fractional values cannot be represented
exactly in binary. Just as 1/3 cannot be represented exactly in decimal notation
with a finite number of digits (0.333333333333333...), 1/10 cannot be
represented exactly in binary notation with a finite number of digits
(0.000110011001100...). Because of this, floats are approximate values, but the
approximation is accurate to several decimal places.

### Strings

Strings are zero or more characters between a pair of quotation marks. You can
use either single quotes or double quotes. The length of a string is only
limited by your computer's memory.

:::cell id=print-and-types-demo8
```python starter
print('Jello world')
print("Pippilotta Delicatessa Windowshade Mackrelmint Ephraim's Daughter Longstocking")
print("")
```
:::

There are two ways to put a quotation mark inside a string. One way: if the
string contains a double quote, use single quotes to mark the ends of the string
(or vice versa).

:::cell id=print-and-types-demo9
```python starter
print('She explained, "Mae fy hofrenfad yn llawn llyswennod."')
```
:::

Another way is to put a backslash character in front of the quotation marks that
are part of the string.

:::cell id=print-and-types-demo10
```python starter
print("She explained, \"Mae fy hofrenfad yn llawn llyswennod.\"")
```
:::

The backslash is an "escape character", because it removes the special meaning
of the character after it. To put a backslash itself in a string, write two in
a row (the first removes the special meaning of the second).

:::cell id=print-and-types-demo11
```python starter
print("Here is a backslash: \\")
```
:::

Normal strings cannot be split across multiple lines. Later we will see a
special kind of string (called a docstring) that can be.

### Booleans

There are only two Boolean values, True and False. The first letter of those
values must be capitalized.

:::cell id=print-and-types-demo12
```python starter
print(False)
print(True)
```
:::

## Determining type

We can use the `type()` function to tell us what the type of a particular value
is. Try these examples to find out the type of the values in the parentheses.

:::cell id=print-and-types-demo13
```python starter
print(type(4))
```
:::

:::cell id=print-and-types-demo14
```python starter
print(type(4.0))
```
:::

:::cell id=print-and-types-demo15
```python starter
print(type('4'))
```
:::

:::cell id=print-and-types-demo16
```python starter
print(type(False))
```
:::

:::cell id=print-and-types-demo17
```python starter
print(type("False"))
```
:::

## Quizzes

:::cell id=print-and-types-ex1 kind=quiz
1. Write a statement that prints out the float value 188.67.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "188.67", f"Your program should print 188.67, but it printed {stdout.strip()!r}."
```

```python solution
print(188.67)
```
:::

:::cell id=print-and-types-ex2 kind=quiz
2. Write a statement that prints out the string value `"Knock knock, "Who's There?", "Your Mom."`

```python starter
# Type code here
```

```python tests
expected = '"Knock knock, "Who\'s There?", "Your Mom."'
assert stdout.strip() == expected, f"Your program should print {expected!r}, but it printed {stdout.strip()!r}."
```

```python solution
print('''"Knock knock, "Who's There?", "Your Mom."''')
```

```hint
A string can be surrounded by triple quotes `'''...'''`, which lets you include
both single and double quotes inside it.
```
:::

:::cell id=print-and-types-ex3 kind=quiz
3. Write a statement that prints out the boolean value True (not the string value "True").

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "True", f"Your program should print True, but it printed {stdout.strip()!r}."
```

```python solution
print(True)
```
:::

:::cell id=print-and-types-ex4 kind=quiz
4. Write a statement that prints out the result of calling the `type()` function on the value 77.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "<class 'int'>", f"Your program should print <class 'int'>, but it printed {stdout.strip()!r}."
```

```python solution
print(type(77))
```
:::

:::cell id=print-and-types-ex5 kind=quiz
5. Write a statement that prints out the type of the value `"You talkin' to me?"`

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "<class 'str'>", f"Your program should print <class 'str'>, but it printed {stdout.strip()!r}."
```

```python solution
print(type("You talkin' to me?"))
```
:::
