---
id: min-and-max
title: Smallest and largest
section: 3
after: loops
---

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
