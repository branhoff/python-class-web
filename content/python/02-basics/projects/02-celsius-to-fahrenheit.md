---
id: celsius-to-fahrenheit
title: Celsius to Fahrenheit
section: 2
after: input-and-casting
---

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
