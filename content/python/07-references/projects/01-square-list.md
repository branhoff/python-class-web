---
id: square-list
title: Square a list in place
section: 7
after: references
---

Write a function called `square_list` that takes a list of numbers and replaces
each value with its square. It does not return anything. It changes the original
list.

```python
nums = [7, -3, 12, 9]
square_list(nums)
print(nums)  # This should print [49, 9, 144, 81]
```

Save the file as `square_list.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-square-list
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def square_list(numbers: list) -> None:
    """Replace each number in the list with its square."""
    for index in range(len(numbers)):
        numbers[index] = numbers[index] ** 2


# ---- Tests ----
import sys
import unittest


class TestSquareList(unittest.TestCase):
    def test_the_example_from_the_project(self):
        nums = [7, -3, 12, 9]
        square_list(nums)
        self.assertEqual(nums, [49, 9, 144, 81])

    def test_an_empty_list_stays_empty(self):
        nums = []
        square_list(nums)
        self.assertEqual(nums, [])

    def test_a_single_number_is_squared(self):
        nums = [6]
        square_list(nums)
        self.assertEqual(nums, [36])

    def test_zero_and_one_square_to_themselves(self):
        nums = [0, 1]
        square_list(nums)
        self.assertEqual(nums, [0, 1])

    def test_negative_numbers_become_positive(self):
        nums = [-1, -5]
        square_list(nums)
        self.assertEqual(nums, [1, 25])

    def test_the_first_and_last_items_are_both_squared(self):
        nums = [2, 3, 4]
        square_list(nums)
        self.assertEqual(nums, [4, 9, 16])

    def test_decimal_numbers_are_squared(self):
        nums = [0.5, 1.5]
        square_list(nums)
        self.assertEqual(nums, [0.25, 2.25])

    def test_the_same_list_object_is_changed(self):
        nums = [2, 3]
        same_list = nums
        square_list(nums)
        self.assertIs(nums, same_list)
        self.assertEqual(same_list, [4, 9])

    def test_nothing_is_returned(self):
        self.assertIsNone(square_list([1, 2]))


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestSquareList])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
