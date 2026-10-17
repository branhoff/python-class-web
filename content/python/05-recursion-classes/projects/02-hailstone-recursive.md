---
id: hailstone-recursive
title: Hailstone steps with recursion
section: 5
after: recursion
---

In Section 4 you wrote [Hailstone steps](/lessons/hailstone-steps) with a loop.
Write the same function again, this time with recursion.

A hailstone sequence starts with a positive integer. If the number is even,
divide it by two to get the next number. If it is odd, multiply it by three and
add one. Repeat with each new number until you reach 1. Starting from 3, the
sequence is 3, 10, 5, 16, 8, 4, 2, 1.

Write a **recursive** function named `hailstone_step_recursive` that takes the
starting number and returns how many steps it takes to reach 1. A starting value
of 1 takes 0 steps. A starting value of 3 takes 7 steps. The function does not
print anything. It returns a value:

```python
answer = hailstone_step_recursive(1000)
print(answer)
```

Your function must call itself, and it cannot use a loop.

To get started, ask two questions. Which starting value needs no more work? For
every other value, how does the number of steps from it relate to the number of
steps from the next number in the sequence?

Save the file as `hailstone_recursive.py`.

When you finish, compare it with your loop version. Which is shorter? Which is
easier to read? Python stops a function that calls itself more than about 1000
times in a row, so the recursive version cannot handle a starting value like
989345275647, whose sequence takes 1348 steps. The loop version has no such limit.


<details>
<summary>Show a solution</summary>

:::cell id=solution-hailstone-recursive
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def hailstone_step_recursive(num: int) -> int:
    """Return how many steps a hailstone sequence takes to reach 1."""
    if num == 1:
        return 0
    if num % 2 == 0:
        return 1 + hailstone_step_recursive(num // 2)
    return 1 + hailstone_step_recursive(num * 3 + 1)


# ---- Tests ----
import sys
import unittest


class TestHailstoneStepRecursive(unittest.TestCase):
    def test_starting_at_one_takes_zero_steps(self):
        self.assertEqual(hailstone_step_recursive(1), 0)

    def test_two_halves_to_one_in_a_single_step(self):
        self.assertEqual(hailstone_step_recursive(2), 1)

    def test_three_takes_seven_steps(self):
        # 3, 10, 5, 16, 8, 4, 2, 1
        self.assertEqual(hailstone_step_recursive(3), 7)

    def test_five_takes_five_steps(self):
        # 5, 16, 8, 4, 2, 1
        self.assertEqual(hailstone_step_recursive(5), 5)

    def test_six_takes_one_step_more_than_three(self):
        # 6, 3, then the 7 steps from 3
        self.assertEqual(hailstone_step_recursive(6), 8)

    def test_a_power_of_two_only_halves(self):
        self.assertEqual(hailstone_step_recursive(64), 6)

    def test_a_longer_sequence(self):
        self.assertEqual(hailstone_step_recursive(1000), 111)

    def test_a_sequence_that_climbs_high_before_falling(self):
        self.assertEqual(hailstone_step_recursive(27), 111)

    def test_a_deeper_sequence_still_fits_in_the_recursion_limit(self):
        self.assertEqual(hailstone_step_recursive(97), 118)

    def test_halving_stays_exact_for_a_very_large_even_number(self):
        # Dividing with / instead of // would turn this into a decimal, round
        # it, and follow a different path.
        self.assertEqual(hailstone_step_recursive(36028797018964194), 169)

    def test_the_result_is_a_whole_number(self):
        self.assertIsInstance(hailstone_step_recursive(7), int)

    def test_a_long_sequence_runs_out_of_room_when_the_limit_is_low(self):
        # Each recursive call nests one level deeper, and Python refuses to nest
        # past its recursion limit. Set the limit a little above the current
        # depth: a short sequence still fits, a long one does not. A loop would
        # never hit the limit, so this test fails if the function does not
        # call itself.
        depth = 0
        frame = sys._getframe()
        while frame is not None:
            depth += 1
            frame = frame.f_back
        old_limit = sys.getrecursionlimit()
        sys.setrecursionlimit(depth + 60)
        try:
            self.assertEqual(hailstone_step_recursive(3), 7)
            with self.assertRaises(RecursionError):
                hailstone_step_recursive(27)
        finally:
            sys.setrecursionlimit(old_limit)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestHailstoneStepRecursive])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
