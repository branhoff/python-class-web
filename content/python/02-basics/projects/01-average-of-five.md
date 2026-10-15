---
id: average-of-five
title: Average of five numbers
section: 2
after: input-and-casting
---

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
