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

## Projects

Build these in VS Code, in your project folder. Click a project name to open it.

<details id="project-average-of-five">
<summary>Project: Average of five numbers</summary>

Write a program that reads five numbers from the keyboard and prints their
average. It should accept negative numbers and decimals. When you run it, the
output should match this format:

```
Please enter five numbers.
-5.4
2.1
7.0
134.8
-20.0
The calculated average of those numbers is:
23.7
```

Save the file as `calculate_average.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-average-of-five
Try the project on your own first. This is one working solution. Press **Run**, and a box asks for each input. Type the sample values from the project description to see the same output.

```python starter
print("Please enter five numbers.")
first = float(input())
second = float(input())
third = float(input())
fourth = float(input())
fifth = float(input())

average = (first + second + third + fourth + fifth) / 5
print("The calculated average of those numbers is:")
print(average)
```
:::

:::cell id=tests-average-of-five
These tests check the solution above. They run a copy of the program, kept in `PROGRAM`, and give it pretend input. The testing tools here are not part of the course yet, so do not worry about how they work. Read the test names and the expected outputs: together they list what the program must do. Press **Run** to run the tests.

```python starter
PROGRAM = r'''
print("Please enter five numbers.")
first = float(input())
second = float(input())
third = float(input())
fourth = float(input())
fifth = float(input())

average = (first + second + third + fourth + fifth) / 5
print("The calculated average of those numbers is:")
print(average)
'''

# ---- Tests ----
import io
import sys
import unittest
from contextlib import redirect_stdout
from unittest import mock


def run_program(*typed_lines: str) -> str:
    """Run the program as if the user typed each line, and return what it printed."""
    answers = iter(typed_lines)

    def fake_input(prompt: str = "") -> str:
        print(prompt, end="")
        return next(answers)

    output = io.StringIO()
    with mock.patch("builtins.input", fake_input), redirect_stdout(output):
        exec(compile(PROGRAM.strip(), "solution.py", "exec"), {})
    return output.getvalue()


class TestAverageOfFive(unittest.TestCase):
    def test_matches_the_sample_run_exactly(self):
        output = run_program("-5.4", "2.1", "7.0", "134.8", "-20.0")
        self.assertEqual(
            output,
            "Please enter five numbers.\n"
            "The calculated average of those numbers is:\n"
            "23.7\n",
        )

    def test_averages_whole_numbers(self):
        output = run_program("1", "2", "3", "4", "5")
        self.assertTrue(output.endswith("is:\n3.0\n"))

    def test_five_equal_numbers_average_to_that_number(self):
        output = run_program("7", "7", "7", "7", "7")
        self.assertTrue(output.endswith("is:\n7.0\n"))

    def test_accepts_negative_numbers(self):
        output = run_program("-10", "-20", "-30", "-40", "-50")
        self.assertTrue(output.endswith("is:\n-30.0\n"))

    def test_positive_and_negative_numbers_cancel_out(self):
        output = run_program("5", "-5", "10", "-10", "0")
        self.assertTrue(output.endswith("is:\n0.0\n"))

    def test_accepts_decimals(self):
        output = run_program("0.5", "1.5", "2.5", "3.5", "4.5")
        self.assertTrue(output.endswith("is:\n2.5\n"))

    def test_every_number_counts_toward_the_average(self):
        # Moving the single nonzero number to each position gives the same result.
        for position in range(5):
            typed = ["0"] * 5
            typed[position] = "10"
            with self.subTest(position=position):
                self.assertTrue(run_program(*typed).endswith("is:\n2.0\n"))


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestAverageOfFive])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>

<details id="project-celsius-to-fahrenheit">
<summary>Project: Celsius to Fahrenheit</summary>

Write a program that converts a temperature from Celsius to Fahrenheit with this
formula:

F = (9/5)C + 32

where F is Fahrenheit and C is Celsius. The program reads a temperature in
Celsius and prints the temperature in Fahrenheit. When you run it, the output
should match this format:

```
Please enter the temperature in Celsius.
34.5
The corresponding temperature in Fahrenheit is:
94.1
```

Your result only needs to match to 7 decimal places. For example, 13.0999999999
counts as correct.

Save the file as `temp_conversion.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-celsius-to-fahrenheit
Try the project on your own first. This is one working solution. Press **Run**, and a box asks for each input. Type the sample values from the project description to see the same output.

```python starter
print("Please enter the temperature in Celsius.")
celsius = float(input())
fahrenheit = (9 / 5) * celsius + 32
print("The corresponding temperature in Fahrenheit is:")
print(fahrenheit)
```
:::

:::cell id=tests-celsius-to-fahrenheit
These tests check the solution above. They run a copy of the program, kept in `PROGRAM`, and give it pretend input. The testing tools here are not part of the course yet, so do not worry about how they work. Read the test names and the expected outputs: together they list what the program must do. Press **Run** to run the tests.

```python starter
PROGRAM = r'''
print("Please enter the temperature in Celsius.")
celsius = float(input())
fahrenheit = (9 / 5) * celsius + 32
print("The corresponding temperature in Fahrenheit is:")
print(fahrenheit)
'''

# ---- Tests ----
import io
import sys
import unittest
from contextlib import redirect_stdout
from unittest import mock


def run_program(*typed_lines: str) -> str:
    """Run the program as if the user typed each line, and return what it printed."""
    answers = iter(typed_lines)

    def fake_input(prompt: str = "") -> str:
        print(prompt, end="")
        return next(answers)

    output = io.StringIO()
    with mock.patch("builtins.input", fake_input), redirect_stdout(output):
        exec(compile(PROGRAM.strip(), "solution.py", "exec"), {})
    return output.getvalue()


class TestCelsiusToFahrenheit(unittest.TestCase):
    def test_matches_the_sample_run_exactly(self):
        self.assertEqual(
            run_program("34.5"),
            "Please enter the temperature in Celsius.\n"
            "The corresponding temperature in Fahrenheit is:\n"
            "94.1\n",
        )

    def test_freezing_point_of_water(self):
        self.assertTrue(run_program("0").endswith("is:\n32.0\n"))

    def test_boiling_point_of_water(self):
        self.assertTrue(run_program("100").endswith("is:\n212.0\n"))

    def test_minus_forty_is_the_same_in_both_scales(self):
        self.assertTrue(run_program("-40").endswith("is:\n-40.0\n"))

    def test_negative_temperature(self):
        self.assertTrue(run_program("-10").endswith("is:\n14.0\n"))

    def test_a_decimal_result_is_close_to_the_true_value(self):
        # Floating point may print 98.60000000000001, so compare with a tolerance.
        printed = run_program("37").splitlines()[-1]
        self.assertAlmostEqual(float(printed), 98.6, places=7)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestCelsiusToFahrenheit])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>

<details id="project-making-change">
<summary>Project: Making change</summary>

Write a program that asks for a whole number of cents from 0 to 99 and works out
the fewest coins needed to make that amount. When you run it, the output should
match this format:

```
Please enter an amount between 0 and 99 cents.
87
Your change will be:
Q: 3
D: 1
N: 0
P: 2
```

The coins are:

- 1 quarter (Q) = 25 cents
- 1 dime (D) = 10 cents
- 1 nickel (N) = 5 cents
- 1 penny (P) = 1 cent

Hint: the mod operator (`%`) is useful here.

Save the file as `coin_change.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-making-change
Try the project on your own first. This is one working solution. Press **Run**, and a box asks for each input. Type the sample values from the project description to see the same output.

```python starter
print("Please enter an amount between 0 and 99 cents.")
cents = int(input())

quarters = cents // 25
cents = cents % 25
dimes = cents // 10
cents = cents % 10
nickels = cents // 5
pennies = cents % 5

print("Your change will be:")
print("Q:", quarters)
print("D:", dimes)
print("N:", nickels)
print("P:", pennies)
```
:::

:::cell id=tests-making-change
These tests check the solution above. They run a copy of the program, kept in `PROGRAM`, and give it pretend input. The testing tools here are not part of the course yet, so do not worry about how they work. Read the test names and the expected outputs: together they list what the program must do. Press **Run** to run the tests.

```python starter
PROGRAM = r'''
print("Please enter an amount between 0 and 99 cents.")
cents = int(input())

quarters = cents // 25
cents = cents % 25
dimes = cents // 10
cents = cents % 10
nickels = cents // 5
pennies = cents % 5

print("Your change will be:")
print("Q:", quarters)
print("D:", dimes)
print("N:", nickels)
print("P:", pennies)
'''

# ---- Tests ----
import io
import sys
import unittest
from contextlib import redirect_stdout
from unittest import mock


def run_program(*typed_lines: str) -> str:
    """Run the program as if the user typed each line, and return what it printed."""
    answers = iter(typed_lines)

    def fake_input(prompt: str = "") -> str:
        print(prompt, end="")
        return next(answers)

    output = io.StringIO()
    with mock.patch("builtins.input", fake_input), redirect_stdout(output):
        exec(compile(PROGRAM.strip(), "solution.py", "exec"), {})
    return output.getvalue()


class TestMakingChange(unittest.TestCase):
    def assert_change(self, cents, quarters, dimes, nickels, pennies):
        expected = (
            "Please enter an amount between 0 and 99 cents.\n"
            "Your change will be:\n"
            f"Q: {quarters}\n"
            f"D: {dimes}\n"
            f"N: {nickels}\n"
            f"P: {pennies}\n"
        )
        self.assertEqual(run_program(str(cents)), expected)

    def test_matches_the_sample_run_exactly(self):
        self.assert_change(87, quarters=3, dimes=1, nickels=0, pennies=2)

    def test_zero_cents_needs_no_coins(self):
        self.assert_change(0, 0, 0, 0, 0)

    def test_one_of_each_single_coin(self):
        self.assert_change(1, 0, 0, 0, 1)
        self.assert_change(5, 0, 0, 1, 0)
        self.assert_change(10, 0, 1, 0, 0)
        self.assert_change(25, 1, 0, 0, 0)

    def test_amounts_just_below_a_coin_use_smaller_coins(self):
        self.assert_change(4, 0, 0, 0, 4)
        self.assert_change(9, 0, 0, 1, 4)
        self.assert_change(24, 0, 2, 0, 4)

    def test_two_dimes_do_not_become_a_quarter(self):
        self.assert_change(20, 0, 2, 0, 0)

    def test_two_nickels_make_a_dime(self):
        self.assert_change(15, 0, 1, 1, 0)

    def test_largest_amount_is_99_cents(self):
        self.assert_change(99, 3, 2, 0, 4)

    def test_exact_multiples_of_a_quarter(self):
        self.assert_change(50, 2, 0, 0, 0)
        self.assert_change(75, 3, 0, 0, 0)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestMakingChange])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>
