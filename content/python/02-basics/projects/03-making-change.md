---
id: making-change
title: Making change
section: 2
after: input-and-casting
---

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
