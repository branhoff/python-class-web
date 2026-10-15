---
id: find-factors
title: Find the factors
section: 3
after: loops
---

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
