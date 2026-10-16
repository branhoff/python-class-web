---
id: testing-and-debugging
title: Testing and Debugging
section: 4
---

A program that runs is not necessarily a program that works. A **test** checks
that your code gives the right answer. **Debugging** is what you do when it does
not. Now that you can write functions, you have something worth testing.

## What a test is

A test calls your function with an input you chose and compares the result with
the answer you worked out by hand. Python's `assert` statement does the
comparison. It is followed by a condition. If the condition is `True`, nothing
happens. If it is `False`, the program stops with an `AssertionError`.

Run this cell, then change one of the expected values and run it again.

:::cell id=assert-try
```python starter
def is_even(number):
    return number % 2 == 0

assert is_even(4) == True
assert is_even(3) == False
print("All tests passed")
```
:::

You can add a message after a comma. It is shown when the assert fails, so say
what you expected:

```python
assert is_even(3) == False, "3 is odd, so is_even(3) should be False"
```

The project solutions end with tests written with a tool called `unittest`, which
you will meet later. The idea is the same: call the code, check the result.

## Choose what to test

Decide the expected answer before you run anything. Otherwise it is easy to
glance at the output and decide it looks fine. Use the kinds of input listed in
Problem Solving. For `is_even` that means a typical value (`4`), the other answer
(`3`), zero, and a negative number (`-2`).

## Put tests in a function

Group the asserts for one function into a test function. Name it `test_` followed
by the name of the function it checks, then call it.

:::cell id=test-function-try
```python starter
def is_even(number):
    return number % 2 == 0


def test_is_even():
    assert is_even(4) == True, "4 is even"
    assert is_even(3) == False, "3 is odd"
    assert is_even(0) == True, "0 is even"
    assert is_even(-2) == True, "-2 is even"


test_is_even()
print("All tests passed")
```
:::

In VS Code, put the function and its tests in one file and run it with the Run
triangle, as in Getting started. If the file prints "All tests passed", every
assert held. If one fails, the terminal shows something like this:

```text
Traceback (most recent call last):
  File "even.py", line 14, in <module>
    test_is_even()
  File "even.py", line 9, in test_is_even
    assert is_even(0) == True, "0 is even"
AssertionError: 0 is even
```

Read it from the bottom. The last line gives the error type and your message,
which says which check failed. The line above it points to the assert. The lines above that show
which functions were running, the same stack trace you met in Functions. Your
line numbers will differ from this example.

## Debugging

When a test fails, work in this order:

1. **Shrink the problem.** Find the smallest input that still fails.
2. **Find the first wrong value.** Follow the data through the code until a
   value is not what you expected. The bug is at or just before that point.
3. **Fix one thing, then run all the tests again.**

Step 2 is Code Tracing, with the computer doing the work. Two tools help.

### Print debugging

Print the values you are unsure about. This function should take 10 percent off
a price, but the answer is negative. Run it and see where the numbers go wrong.

:::cell id=print-debug-try
```python starter
def total_price(price, quantity, discount):
    subtotal = price * quantity
    print("subtotal:", subtotal)
    total = subtotal - discount * subtotal
    print("total:", total)
    return total


print(total_price(10, 3, 10))
```
:::

The subtotal is right and the total is not, so the bug is in the line between the
two prints. The discount is `10`, but the formula needs a fraction such as `0.1`.
The fix is to divide by 100 in the formula: `discount / 100 * subtotal`. Delete
your debugging prints when you are done.

### The VS Code debugger

A debugger pauses your program so you can look at it. Try it on any file with a
function in it.

1. Click in the margin just left of a line number. A red dot appears. This is a
   **breakpoint**. The program will pause before it runs that line.
2. Choose **Run, Start Debugging** (or press F5). If VS Code asks, pick
   **Python File**.
3. The program runs until it reaches the breakpoint and stops. The **Variables**
   panel on the left shows the current value of every variable.
4. Use the buttons at the top, or these keys, to move:

| Key | Button | What it does |
| --- | --- | --- |
| F10 | Step Over | Run this line and stop at the next one |
| F11 | Step Into | If the line calls one of your functions, go inside it |
| Shift+F11 | Step Out | Finish the current function and go back to the caller |
| F5 | Continue | Run until the next breakpoint, or until the program ends |
| Shift+F5 | Stop | End the debugging session |

On a Mac laptop you may need to hold Fn with the function keys.

Step through the code and watch the Variables panel after each line. Stop when a
value is wrong. That line, or the one before it, holds the bug. You can type any
expression into the **Watch** panel to follow it as you step, and the **Call
Stack** panel shows which function called which.

## Quizzes

:::cell id=fix-last-digit kind=quiz
1. The asserts below fail. Run the code and read the message, then fix the
function so every assert passes.

```python starter
def last_digit(number):
    return number // 10


assert last_digit(123) == 3, "last_digit(123) should be 3"
assert last_digit(7) == 7, "last_digit(7) should be 7"
assert last_digit(40) == 0, "last_digit(40) should be 0"
```

```python tests
assert last_digit(9) == 9, "last_digit(9) should be 9."
assert last_digit(100) == 0, "last_digit(100) should be 0."
assert last_digit(58) == 8, "last_digit(58) should be 8."
```

```python solution
def last_digit(number):
    return number % 10


assert last_digit(123) == 3, "last_digit(123) should be 3"
assert last_digit(7) == 7, "last_digit(7) should be 7"
assert last_digit(40) == 0, "last_digit(40) should be 0"
```

```hint
`//` gives the whole-number part of a division. Which operator gives the remainder?
```
:::

:::cell id=write-leap-tests kind=quiz
2. A year is a leap year if it is divisible by 4, except that years divisible by
100 are not leap years unless they are also divisible by 400. The function
`is_leap_year` below follows that rule.

Write a function named `test_is_leap_year` that checks it with asserts, then call
it. Your tests are good if they would catch a wrong version of the function. This
page runs yours against three wrong versions, and each one must make an assert
fail.

```python starter
def is_leap_year(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


# Write test_is_leap_year here
```

```python tests
assert callable(globals().get("test_is_leap_year")), "Define a function named test_is_leap_year."
namespace = globals()
correct = namespace["is_leap_year"]
test_is_leap_year()

wrong_versions = {
    "one that always returns True": lambda year: True,
    "one that ignores the century rule": lambda year: year % 4 == 0,
    "one that forgets years divisible by 400": lambda year: year % 4 == 0 and year % 100 != 0,
}
for description, wrong in wrong_versions.items():
    namespace["is_leap_year"] = wrong
    caught = False
    try:
        test_is_leap_year()
    except AssertionError:
        caught = True
    namespace["is_leap_year"] = correct
    assert caught, f"Your tests did not catch {description}. Try another year."
```

```python solution
def is_leap_year(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def test_is_leap_year():
    assert is_leap_year(2024) == True, "2024 is a leap year"
    assert is_leap_year(2023) == False, "2023 is not a leap year"
    assert is_leap_year(1900) == False, "1900 is not a leap year"
    assert is_leap_year(2000) == True, "2000 is a leap year"


test_is_leap_year()
```

```hint
Try an ordinary leap year, an ordinary non-leap year, a year divisible by 100 and
a year divisible by 400.
```
:::

:::cell id=debug-sum-to kind=quiz
3. `sum_to(n)` should add the whole numbers from 1 to `n`, so `sum_to(4)` is
`1 + 2 + 3 + 4 = 10`. It prints 6. Add a `print` inside the loop to see which
values `i` takes, then fix the function. Remove your debugging prints afterward.

```python starter
def sum_to(n):
    total = 0
    for i in range(n):
        total = total + i
    return total


print(sum_to(4))
```

```python tests
assert sum_to(4) == 10, "sum_to(4) should be 10."
assert sum_to(1) == 1, "sum_to(1) should be 1."
assert sum_to(0) == 0, "sum_to(0) should be 0."
assert sum_to(10) == 55, "sum_to(10) should be 55."
assert stdout.strip() == "10", "Remove your debugging prints so the program prints only 10."
```

```python solution
def sum_to(n):
    total = 0
    for i in range(1, n + 1):
        total = total + i
    return total


print(sum_to(4))
```

```hint
`range(4)` gives 0, 1, 2, 3. You need 1, 2, 3, 4.
```
:::
