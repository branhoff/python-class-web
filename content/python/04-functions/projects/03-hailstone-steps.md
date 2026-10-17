---
id: hailstone-steps
title: Hailstone steps
section: 4
after: functions
---

A hailstone sequence starts with a positive integer. If the number is even,
divide it by two to get the next number. If it is odd, multiply it by three and
add one. Repeat with each new number. Starting from 3, the sequence is 3, 10, 5,
16, 8, 4, 2, 1.

Write a function called `hailstone_step` that takes the starting number and
returns how many steps it takes to reach 1. Stop once you reach 1. A starting
value of 1 takes 0 steps. A starting value of 3 takes 7 steps. The function does
not print anything. It returns a value:

```python
answer = hailstone_step(1000)
print(answer)
```

Splitting the work across several small functions can make code easier to read
and to test. You may do that here, but `hailstone_step` must still return the
count. Do not use recursion. You will write this function again with recursion in
Section 5.

Save the file as `hailstone_step.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-hailstone-steps
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def next_hailstone(num: int) -> int:
    """Return the number that follows `num` in a hailstone sequence."""
    if num % 2 == 0:
        return num // 2
    return num * 3 + 1


def hailstone_step(num: int) -> int:
    """Return how many steps a hailstone sequence takes to reach 1."""
    steps: int = 0
    while num != 1:
        num = next_hailstone(num)
        steps += 1
    return steps


# ---- Tests ----
import sys
import unittest


class TestNextHailstone(unittest.TestCase):
    def test_an_even_number_is_halved(self):
        self.assertEqual(next_hailstone(6), 3)
        self.assertEqual(next_hailstone(2), 1)

    def test_an_odd_number_is_tripled_and_increased_by_one(self):
        self.assertEqual(next_hailstone(3), 10)
        self.assertEqual(next_hailstone(1), 4)

    def test_halving_gives_a_whole_number_not_a_decimal(self):
        self.assertIsInstance(next_hailstone(10), int)


class TestHailstoneStep(unittest.TestCase):
    def test_starting_at_one_takes_zero_steps(self):
        self.assertEqual(hailstone_step(1), 0)

    def test_two_halves_to_one_in_a_single_step(self):
        self.assertEqual(hailstone_step(2), 1)

    def test_three_takes_seven_steps(self):
        # 3, 10, 5, 16, 8, 4, 2, 1
        self.assertEqual(hailstone_step(3), 7)

    def test_five_takes_five_steps(self):
        # 5, 16, 8, 4, 2, 1
        self.assertEqual(hailstone_step(5), 5)

    def test_six_takes_one_step_more_than_three(self):
        # 6, 3, then the 7 steps from 3
        self.assertEqual(hailstone_step(6), 8)

    def test_a_power_of_two_only_halves(self):
        self.assertEqual(hailstone_step(64), 6)

    def test_a_longer_sequence(self):
        self.assertEqual(hailstone_step(1000), 111)

    def test_a_sequence_that_climbs_high_before_falling(self):
        self.assertEqual(hailstone_step(27), 111)

    def test_the_result_is_a_whole_number(self):
        self.assertIsInstance(hailstone_step(7), int)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestNextHailstone, TestHailstoneStep])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
