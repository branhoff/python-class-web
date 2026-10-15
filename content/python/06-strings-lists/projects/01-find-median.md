---
id: find-median
title: Find the median
section: 6
after: lists
---

Write a function named `find_median` that takes a list of numbers and returns
their median. You will need to sort the list first. If you are not sure how the
median works, look it up before you start.

```python
list_of_nums = [13, 7, -3, 82, 4]
result = find_median(list_of_nums)
```

Save the file as `find_median.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-find-median
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail. The testing tools used here (classes and `unittest`) are not part of the course yet, so do not worry about how they work.

```python starter
def find_median(numbers: list) -> float:
    """Return the median of a list of numbers without changing the list."""
    ordered: list = numbers[:]
    ordered.sort()
    middle: int = len(ordered) // 2
    if len(ordered) % 2 == 0:
        return (ordered[middle - 1] + ordered[middle]) / 2
    return ordered[middle]


# ---- Tests ----
import sys
import unittest


class TestFindMedian(unittest.TestCase):
    def test_a_single_number_is_its_own_median(self):
        self.assertEqual(find_median([5]), 5)

    def test_an_odd_length_list_returns_the_middle_number(self):
        self.assertEqual(find_median([1, 2, 3]), 2)

    def test_the_example_from_the_project(self):
        self.assertEqual(find_median([13, 7, -3, 82, 4]), 7)

    def test_an_even_length_list_averages_the_two_middle_numbers(self):
        self.assertEqual(find_median([1, 2, 3, 4]), 2.5)

    def test_two_numbers_average_to_the_value_between_them(self):
        self.assertEqual(find_median([10, 20]), 15)

    def test_an_even_length_list_can_have_a_median_that_is_not_in_the_list(self):
        self.assertEqual(find_median([1, 2, 3, 10, 20, 30]), 6.5)

    def test_an_unsorted_list_is_sorted_first(self):
        self.assertEqual(find_median([9, 1, 5, 3, 7]), 5)
        self.assertEqual(find_median([8, 2, 6, 4]), 5)

    def test_negative_numbers_are_handled(self):
        self.assertEqual(find_median([-5, -1, -3]), -3)
        self.assertEqual(find_median([-4, -2]), -3)

    def test_repeated_numbers_are_handled(self):
        self.assertEqual(find_median([4, 4, 4, 9]), 4)

    def test_the_original_list_is_left_unchanged(self):
        numbers = [13, 7, -3, 82, 4]
        find_median(numbers)
        self.assertEqual(numbers, [13, 7, -3, 82, 4])


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestFindMedian])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
