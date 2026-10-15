---
id: loops
title: Iteration and Looping
section: 3
---

## Iteration

While loops and for loops enable us to make certain sections of code repeat multiple times.

### `while` loops

A while loop continues iterating as long as its condition remains true. Here's an example:

:::cell id=loops-demo1
```python starter
# Accumulates total score until it's 100 or greater
total_score: int = 0
while total_score < 100:
    total_score += int(input("Enter your score for this round: "))
    print("total so far =", total_score)
```
:::

The loop will first test the condition. If it's true, then the code in the loop is executed. It will continue testing the condition and executing the loop until the condition is false, at which point we drop out of the loop and execution resumes with whatever code comes after it. It's important that something in the loop will eventually cause the loop condition to become false. Otherwise the loop will continue forever, which is known as an infinite loop. This is an example of a script that wil run until you forcefully quit your program.

```python
while True:
    print("hi")
```

### `for` loops

A for loop traverses a sequence (or iterable type), looping once for each element in the sequence. A loop variable takes on the value of the current element, which can then be used inside the loop. So far, strings are the only iterable type we've looked at - we'll see one more on this page and others later. Here's an example of iterating through a string:

:::cell id=loops-demo2
```python starter
word = "apothecary"
for letter in word:    # letter is the loop variable
    print(letter)
```
:::

The first time through the loop, letter equals "a", next time through it equals "p", next "o", and so on until the last time through, when it equals "y".

### Using ranges with `for` loops

If we need a for loop to iterate over some increasing (or decreasing) sequence of integers, we can achieve that by using a range. Ranges are another iterable type. Here's an example that counts from 1 to 10:

:::cell id=loops-demo3
```python starter
for num in range(1, 11):
    print(num)
```
:::

Notice that the range goes from 1 up to, but not including, 11. A range can also count by a given step size:

:::cell id=loops-demo4
```python starter
# counts by twos
for num in range(1, 11, 2): # the third number is the step size
    print(num)
```
:::

You can count down by using a negative step size, but if you do, then the first number (the start of the range) needs to be greater than the second number (the end of the range):

:::cell id=loops-demo5
```python starter
# counts down from 10 to 1
for num in range(10, 0, -1):
    print(num)
```
:::

### `break` and `continue`

A loop can be terminated early with the "break" keyword. For example:

:::cell id=loops-demo6
```python starter
for num in range(1, 11):
    if (num == 5):
        break
    print(num)
```
:::

This loop only prints the numbers up to 4 because when the "break" is executed, it immediately drops us out of the loop.

The "continue" keyword allows us to skip iterations of a loop. For example, try replacing the word "break" with "continue" in line 3 of the cell above. With that change, it prints the numbers from 1 through 10 except for 5, because it skips that iteration, jumping us to the next iteration of the loop.

### Proper use of `break`

There may be occasions where using `break` is justified, but you should try to write your loop conditions such that `break` is not needed, since that usually makes the behavior of your loop simpler to read.

:::cell id=loops-demo7
```python starter
# bad example
binary_str: str = ""
user_num: int = int(input("Please enter a positive integer: "))
while True:
    binary_str = str(user_num % 2) + binary_str
    user_num //= 2
    if user_num == 0:  # This is the real loop condition
        break
print(binary_str)
```
:::

:::cell id=loops-demo8
```python starter
# good example
binary_str: str = ""
user_num: int = int(input("Please enter a positive integer: "))
while user_num != 0:
    binary_str = str(user_num % 2) + binary_str
    user_num //= 2
print(binary_str)
```
:::

Notice that we flipped from testing `==` to testing `!=`. That's because we were testing when to stop, but now we're testing when to keep going.

:::cell id=loops-demo9
```python starter
# bad example
while True:
    user_num: int= int(input("Please enter an integer: "))
    if user_num % 10 == 0: # This is the real loop condition
        break
    else:
        print("You entered", user_num)
print("all done")
```
:::

:::cell id=loops-demo10
```python starter
# good example
# The first line declares user_num by initializing it to a value
# that will make the loop condition True (otherwise we would
# never enter the loop)
user_num: int = 1
while user_num % 10 != 0:
    user_num = int(input("Please enter an integer: "))
    print("You entered", user_num)
print("all done")
```
:::

If there are two things that need to be `True` for a loop to continue, it's easy enough to use and to connect them in the loop condition. When there are more than two things that need to be `True`, or the condition starts to get long, try using `break` statements to split up your conditions across multiple lines. You can also use variables to save conditions into descriptive containers before using them.

:::cell id=loops-demo11
```python starter
# save a long condition into a variable
is_positive_num: int = True
while is_positive_num:
    user_num = int(input("Please enter an integer: "))
    print("You entered", user_num)
    is_positive_num = user_num > 0
print("all done")
```
:::

### Nested loops

Both `while` loops and `for` loops can be nested. You can also have `if` statements inside loops or loops inside `if` statements. You can have an `if` statement inside a `for` loop inside a `while` loop inside another `if` statement if you want to.

:::cell id=loops-demo12
```python starter
# A nested for loop
total_num_letters = 0
print("Please enter the names of your three favorite animals.")
for val in range(1, 4):
    animal = input()
    for letter in animal:
        total_num_letters += 1
print("Those names contained a total of", total_num_letters, "characters.")
```
:::

## Exercises

:::cell id=loops-ex1 kind=exercise
1. Write a function named `sum_to` that takes an integer parameter `n` and returns the sum of the integers from 1 to `n` (inclusive).

```python starter
# Type code here
```

```python tests
assert sum_to(1) == 1, "sum_to(1) should return 1."
assert sum_to(5) == 15, "sum_to(5) should return 15."
assert sum_to(10) == 55, "sum_to(10) should return 55."
assert sum_to(100) == 5050, "sum_to(100) should return 5050."
```

```python solution
def sum_to(n: int) -> int:
    total: int = 0
    for i in range(1, n + 1):
        total += i
    return total

print(sum_to(10))
```
:::

:::cell id=loops-ex2 kind=exercise
2. Write a function named `length_parity` that takes a string parameter, counts how many characters are in the string, and returns `"odd"` if that number is odd and `"even"` if that number is even.

```python starter
# Type code here
```

```python tests
assert length_parity("abc") == "odd", 'length_parity("abc") should return "odd".'
assert length_parity("abcd") == "even", 'length_parity("abcd") should return "even".'
assert length_parity("") == "even", 'length_parity("") should return "even".'
assert length_parity("a") == "odd", 'length_parity("a") should return "odd".'
```

```python solution
def length_parity(text: str) -> str:
    count: int = 0
    for character in text:
        count += 1
    if count % 2 == 1:
        return "odd"
    else:
        return "even"

print(length_parity("hello"))
```
:::

:::cell id=loops-ex3 kind=exercise
3. Write a function named `echo_until_quit` that takes a list of strings. Starting from the first item, it prints each string on its own line, stopping as soon as it reaches the string `"quit"` (which is not printed). Then call your function with the list `["red", "green", "quit", "blue"]`.

```python starter
# Type code here
```

```python tests
import io, contextlib
_buf = io.StringIO()
with contextlib.redirect_stdout(_buf):
    echo_until_quit(["a", "b", "quit", "c"])
assert _buf.getvalue().strip() == "a\nb", "echo_until_quit should print each string until it reaches quit."
_buf2 = io.StringIO()
with contextlib.redirect_stdout(_buf2):
    result = echo_until_quit(["x", "quit"])
assert _buf2.getvalue().strip() == "x", "echo_until_quit should stop at quit without printing it."
assert result is None, "echo_until_quit should not return a value."
```

```python solution
def echo_until_quit(words: list) -> None:
    index: int = 0
    while index < len(words) and words[index] != "quit":
        print(words[index])
        index += 1

echo_until_quit(["red", "green", "quit", "blue"])
```
:::

## Projects

Build these in VS Code, in your project folder. Click a project name to open it.

<details id="project-min-and-max">
<summary>Project: Smallest and largest</summary>

Write a program that asks how many numbers the user wants to enter (at least
one), then asks for that many numbers. When all the numbers are in, print the
smallest and the largest. Do not use lists or any other data structure. When you
run it, the output should match this format:

```
How many numbers would you like to enter?
3
Please enter 3 numbers.
3
5
7

min: 3
max: 7
```

Hints: how many numbers do you need to keep track of at one time? If someone
read you a list of numbers and asked for the largest and smallest at the end,
what would you remember as you went? How should you set up your variables? What
happens if the user enters only one number?

Save the file as `min_max_number.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-min-and-max
Try the project on your own first. This is one working solution. Press **Run**, and a box asks for each input. Type the sample values from the project description to see the same output.

```python starter
print("How many numbers would you like to enter?")
count = int(input())
while count < 1:
    print("Please enter at least one number.")
    count = int(input())

print("Please enter", count, "numbers.")
smallest = int(input())
largest = smallest
for i in range(count - 1):
    number = int(input())
    # Using <= would also work: equal numbers swap in the same value.
    if number < smallest:  # pragma: no mutate
        smallest = number
    if number > largest:  # pragma: no mutate
        largest = number

print()
print("min:", smallest)
print("max:", largest)
```
:::

:::cell id=tests-min-and-max
These tests check the solution above. They run a copy of the program, kept in `PROGRAM`, and give it pretend input. The testing tools here are not part of the course yet, so do not worry about how they work. Read the test names and the expected outputs: together they list what the program must do. Press **Run** to run the tests.

```python starter
PROGRAM = r'''
print("How many numbers would you like to enter?")
count = int(input())
while count < 1:
    print("Please enter at least one number.")
    count = int(input())

print("Please enter", count, "numbers.")
smallest = int(input())
largest = smallest
for i in range(count - 1):
    number = int(input())
    # Using <= would also work: equal numbers swap in the same value.
    if number < smallest:  # pragma: no mutate
        smallest = number
    if number > largest:  # pragma: no mutate
        largest = number

print()
print("min:", smallest)
print("max:", largest)
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


class TestMinAndMax(unittest.TestCase):
    def test_matches_the_sample_run_exactly(self):
        self.assertEqual(
            run_program("3", "3", "5", "7"),
            "How many numbers would you like to enter?\n"
            "Please enter 3 numbers.\n"
            "\n"
            "min: 3\n"
            "max: 7\n",
        )

    def test_a_single_number_is_both_the_min_and_the_max(self):
        self.assertEqual(
            run_program("1", "42"),
            "How many numbers would you like to enter?\n"
            "Please enter 1 numbers.\n"
            "\n"
            "min: 42\n"
            "max: 42\n",
        )

    def test_two_numbers_in_either_order(self):
        self.assertTrue(run_program("2", "1", "9").endswith("min: 1\nmax: 9\n"))
        self.assertTrue(run_program("2", "9", "1").endswith("min: 1\nmax: 9\n"))

    def test_largest_first_and_smallest_last(self):
        self.assertTrue(run_program("3", "9", "5", "1").endswith("min: 1\nmax: 9\n"))

    def test_smallest_first_and_largest_last(self):
        self.assertTrue(run_program("3", "1", "5", "9").endswith("min: 1\nmax: 9\n"))

    def test_extremes_in_the_middle(self):
        self.assertTrue(
            run_program("5", "5", "1", "9", "4", "6").endswith("min: 1\nmax: 9\n")
        )

    def test_all_numbers_equal(self):
        self.assertTrue(run_program("3", "4", "4", "4").endswith("min: 4\nmax: 4\n"))

    def test_negative_numbers(self):
        self.assertTrue(
            run_program("3", "-5", "-20", "-1").endswith("min: -20\nmax: -1\n")
        )

    def test_the_last_number_is_read(self):
        self.assertTrue(run_program("2", "5", "100").endswith("min: 5\nmax: 100\n"))
        self.assertTrue(run_program("2", "5", "-100").endswith("min: -100\nmax: 5\n"))

    def test_asks_again_when_the_count_is_zero(self):
        self.assertEqual(
            run_program("0", "2", "8", "3"),
            "How many numbers would you like to enter?\n"
            "Please enter at least one number.\n"
            "Please enter 2 numbers.\n"
            "\n"
            "min: 3\n"
            "max: 8\n",
        )

    def test_asks_again_until_the_count_is_at_least_one(self):
        output = run_program("-4", "0", "1", "6")
        self.assertEqual(output.count("Please enter at least one number.\n"), 2)
        self.assertTrue(output.endswith("min: 6\nmax: 6\n"))


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestMinAndMax])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>

<details id="project-find-factors">
<summary>Project: Find the factors</summary>

Write a program that asks for a positive integer and prints every positive
integer that divides it evenly, including 1 and the number itself, in ascending
order. When you run it, the output should match this format:

```
Please enter a positive integer: 12
The factors of 12 are:
1
2
3
4
6
12
```

Save the file as `find_factors.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-find-factors
Try the project on your own first. This is one working solution. Press **Run**, and a box asks for each input. Type the sample values from the project description to see the same output.

```python starter
number = int(input("Please enter a positive integer: "))
print("The factors of", number, "are:")
# A larger range end (such as number * 2) would also work: no number above it divides it.
for candidate in range(1, number + 1):  # pragma: no mutate
    # Using <= 0 would also work: a remainder is never negative here.
    if number % candidate == 0:  # pragma: no mutate
        print(candidate)
```
:::

:::cell id=tests-find-factors
These tests check the solution above. They run a copy of the program, kept in `PROGRAM`, and give it pretend input. The testing tools here are not part of the course yet, so do not worry about how they work. Read the test names and the expected outputs: together they list what the program must do. Press **Run** to run the tests.

```python starter
PROGRAM = r'''
number = int(input("Please enter a positive integer: "))
print("The factors of", number, "are:")
# A larger range end (such as number * 2) would also work: no number above it divides it.
for candidate in range(1, number + 1):  # pragma: no mutate
    # Using <= 0 would also work: a remainder is never negative here.
    if number % candidate == 0:  # pragma: no mutate
        print(candidate)
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


class TestFindFactors(unittest.TestCase):
    def assert_factors(self, number, factors):
        expected = (
            f"Please enter a positive integer: The factors of {number} are:\n"
            + "".join(f"{factor}\n" for factor in factors)
        )
        self.assertEqual(run_program(str(number)), expected)

    def test_matches_the_sample_run_exactly(self):
        self.assert_factors(12, [1, 2, 3, 4, 6, 12])

    def test_one_has_only_itself_as_a_factor(self):
        self.assert_factors(1, [1])

    def test_a_prime_has_only_one_and_itself(self):
        self.assert_factors(13, [1, 13])

    def test_two_is_the_smallest_prime(self):
        self.assert_factors(2, [1, 2])

    def test_a_perfect_square_lists_its_root_once(self):
        self.assert_factors(36, [1, 2, 3, 4, 6, 9, 12, 18, 36])

    def test_a_larger_number(self):
        self.assert_factors(100, [1, 2, 4, 5, 10, 20, 25, 50, 100])

    def test_zero_and_negative_numbers_list_no_factors(self):
        self.assert_factors(0, [])
        self.assert_factors(-6, [])


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestFindFactors])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>

<details id="project-number-guessing">
<summary>Project: Number guessing game</summary>

Write a program where one player picks a number and a second player tries to
guess it. The program first asks for the number to guess. Then it keeps asking
for guesses. After a wrong guess it prints "Too high - try again:" or "Too low -
try again:". It stops only when the guess is right, and then prints how many
guesses it took. When you run it, the output should match this format:

```
Enter the number for the player to guess.
-10
Enter your guess.
10
Too high - try again:
5
Too high - try again:
-200
Too low - try again:
-10
You guessed it in 4 tries.
```

If the player guesses on the first try, print "You guessed it in 1 try."

Save the file as `guess_num.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-number-guessing
Try the project on your own first. This is one working solution. Press **Run**, and a box asks for each input. Type the sample values from the project description to see the same output.

```python starter
print("Enter the number for the player to guess.")
secret = int(input())

print("Enter your guess.")
guess = int(input())
tries = 1
while guess != secret:
    # Using <= would also work: the loop only runs while guess != secret.
    if guess < secret:  # pragma: no mutate
        print("Too low - try again:")
    else:
        print("Too high - try again:")
    guess = int(input())
    tries += 1

# Using <= 1 would also work: tries is never below 1.
if tries == 1:  # pragma: no mutate
    print("You guessed it in 1 try.")
else:
    print("You guessed it in", tries, "tries.")
```
:::

:::cell id=tests-number-guessing
These tests check the solution above. They run a copy of the program, kept in `PROGRAM`, and give it pretend input. The testing tools here are not part of the course yet, so do not worry about how they work. Read the test names and the expected outputs: together they list what the program must do. Press **Run** to run the tests.

```python starter
PROGRAM = r'''
print("Enter the number for the player to guess.")
secret = int(input())

print("Enter your guess.")
guess = int(input())
tries = 1
while guess != secret:
    # Using <= would also work: the loop only runs while guess != secret.
    if guess < secret:  # pragma: no mutate
        print("Too low - try again:")
    else:
        print("Too high - try again:")
    guess = int(input())
    tries += 1

# Using <= 1 would also work: tries is never below 1.
if tries == 1:  # pragma: no mutate
    print("You guessed it in 1 try.")
else:
    print("You guessed it in", tries, "tries.")
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


class TestNumberGuessing(unittest.TestCase):
    START = "Enter the number for the player to guess.\nEnter your guess.\n"

    def test_matches_the_sample_run_exactly(self):
        self.assertEqual(
            run_program("-10", "10", "5", "-200", "-10"),
            self.START
            + "Too high - try again:\n"
            + "Too high - try again:\n"
            + "Too low - try again:\n"
            + "You guessed it in 4 tries.\n",
        )

    def test_a_correct_first_guess_uses_the_singular_try(self):
        self.assertEqual(
            run_program("7", "7"), self.START + "You guessed it in 1 try.\n"
        )

    def test_two_guesses_use_the_plural_tries(self):
        self.assertEqual(
            run_program("7", "3", "7"),
            self.START + "Too low - try again:\nYou guessed it in 2 tries.\n",
        )

    def test_a_guess_above_the_number_is_too_high(self):
        self.assertEqual(
            run_program("7", "8", "7"),
            self.START + "Too high - try again:\nYou guessed it in 2 tries.\n",
        )

    def test_a_guess_one_below_the_number_is_too_low(self):
        self.assertIn("Too low - try again:\n", run_program("7", "6", "7"))

    def test_a_guess_one_above_the_number_is_too_high(self):
        self.assertIn("Too high - try again:\n", run_program("7", "8", "7"))

    def test_zero_and_negative_numbers_work(self):
        self.assertEqual(
            run_program("0", "-1", "0"),
            self.START + "Too low - try again:\nYou guessed it in 2 tries.\n",
        )

    def test_counts_every_wrong_guess(self):
        output = run_program("5", "1", "2", "3", "4", "6", "5")
        self.assertEqual(output.count("try again:"), 5)
        self.assertTrue(output.endswith("You guessed it in 6 tries.\n"))


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestNumberGuessing])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>
