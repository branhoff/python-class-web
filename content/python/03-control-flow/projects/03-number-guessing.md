---
id: number-guessing
title: Number guessing game
section: 3
after: loops
---

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
