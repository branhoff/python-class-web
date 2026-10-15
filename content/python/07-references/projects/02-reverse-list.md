---
id: reverse-list
title: Reverse a list in place
section: 7
after: references
---

Write a function named `reverse_list` that takes a list of numbers and reverses
the order of its elements. It does not return anything. It changes the original
list. Your function must not use slicing.

```python
vals = [2, -5, 10, 9]
reverse_list(vals)
print(vals)  # This should print [9, 10, -5, 2]
```

Save the file as `reverse_list.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-reverse-list
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def reverse_list(numbers: list) -> None:
    """Reverse the list in place, without slicing."""
    last: int = len(numbers) - 1
    for index in range(len(numbers) // 2):
        other: int = last - index
        saved = numbers[index]
        numbers[index] = numbers[other]
        numbers[other] = saved


# ---- Tests ----
import sys
import unittest


class TestReverseList(unittest.TestCase):
    def test_the_example_from_the_project(self):
        vals = [2, -5, 10, 9]
        reverse_list(vals)
        self.assertEqual(vals, [9, 10, -5, 2])

    def test_an_empty_list_stays_empty(self):
        vals = []
        reverse_list(vals)
        self.assertEqual(vals, [])

    def test_a_single_item_list_is_unchanged(self):
        vals = [4]
        reverse_list(vals)
        self.assertEqual(vals, [4])

    def test_two_items_are_swapped(self):
        vals = [1, 2]
        reverse_list(vals)
        self.assertEqual(vals, [2, 1])

    def test_an_odd_length_list_keeps_its_middle_item_in_place(self):
        vals = [1, 2, 3]
        reverse_list(vals)
        self.assertEqual(vals, [3, 2, 1])

    def test_a_longer_odd_length_list(self):
        vals = [1, 2, 3, 4, 5]
        reverse_list(vals)
        self.assertEqual(vals, [5, 4, 3, 2, 1])

    def test_a_longer_even_length_list(self):
        vals = [1, 2, 3, 4, 5, 6]
        reverse_list(vals)
        self.assertEqual(vals, [6, 5, 4, 3, 2, 1])

    def test_repeated_values_are_kept(self):
        vals = [1, 1, 2]
        reverse_list(vals)
        self.assertEqual(vals, [2, 1, 1])

    def test_reversing_twice_gives_back_the_original(self):
        vals = [3, 1, 4, 1, 5]
        reverse_list(vals)
        reverse_list(vals)
        self.assertEqual(vals, [3, 1, 4, 1, 5])

    def test_the_same_list_object_is_changed(self):
        vals = [1, 2, 3]
        same_list = vals
        reverse_list(vals)
        self.assertIs(vals, same_list)

    def test_nothing_is_returned(self):
        self.assertIsNone(reverse_list([1, 2]))


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestReverseList])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
