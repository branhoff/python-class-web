---
id: multiply-recursively
title: Multiply with recursion
section: 5
after: recursion
---

Write a **recursive** function named `multiply` that takes two positive integers
and returns their product. It cannot use the `*` operator. It has to find the
answer by adding. This shows the idea:

```
7 * 4 = 7 + (7 * 3)
7 * 3 = 7 + (7 * 2)
7 * 2 = 7 + (7 * 1)
7 * 1 = 7
So, 7 * 4 = 7 + (7 + (7 + (7)))
```

Your function cannot use a loop.

Save the file as `multiply_recur.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-multiply-recursively
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def multiply(first: int, second: int) -> int:
    """Multiply two positive integers using only addition and recursion."""
    if second == 1:
        return first
    return first + multiply(first, second - 1)


# ---- Tests ----
import sys
import unittest


class TestMultiply(unittest.TestCase):
    def test_multiplying_by_one_returns_the_first_number(self):
        self.assertEqual(multiply(9, 1), 9)

    def test_one_times_one_is_one(self):
        self.assertEqual(multiply(1, 1), 1)

    def test_multiplying_one_by_a_number_returns_that_number(self):
        self.assertEqual(multiply(1, 9), 9)

    def test_the_example_from_the_project(self):
        self.assertEqual(multiply(7, 4), 28)

    def test_two_equal_numbers(self):
        self.assertEqual(multiply(12, 12), 144)

    def test_the_order_of_the_numbers_does_not_change_the_answer(self):
        self.assertEqual(multiply(3, 8), multiply(8, 3))

    def test_a_small_product(self):
        self.assertEqual(multiply(2, 3), 6)

    def test_the_second_number_counts_how_many_times_to_add(self):
        self.assertEqual(multiply(5, 2), 10)
        self.assertEqual(multiply(5, 3), 15)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestMultiply])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
