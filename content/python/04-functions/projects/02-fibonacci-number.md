---
id: fibonacci-number
title: Fibonacci number
section: 4
after: functions
---

The first and second numbers in the Fibonacci sequence are both 1. After that,
each number is the sum of the two before it: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55,
89, and so on.

Write a function called `fibonacci` that takes a positive integer and returns
the number at that position in the sequence. For example, `fibonacci(1)` is 1,
`fibonacci(3)` is 2 and `fibonacci(5)` is 5. The function does not print
anything. It returns a value:

```python
term = fibonacci(17)
```

Do not use recursion. Your function must not call itself.

Save the file as `fibonacci.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-fibonacci-number
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail. The testing tools used here (classes and `unittest`) are not part of the course yet, so do not worry about how they work.

```python starter
def fibonacci(number: int) -> int:
    """Return the number at position `number` of the Fibonacci sequence."""
    previous: int = 0
    current: int = 1
    for step in range(number - 1):
        following: int = previous + current
        previous = current
        current = following
    return current


# ---- Tests ----
import sys
import unittest


class TestFibonacci(unittest.TestCase):
    def test_the_first_two_numbers_are_both_one(self):
        self.assertEqual(fibonacci(1), 1)
        self.assertEqual(fibonacci(2), 1)

    def test_each_number_is_the_sum_of_the_two_before_it(self):
        self.assertEqual(fibonacci(3), 2)
        self.assertEqual(fibonacci(4), 3)
        self.assertEqual(fibonacci(5), 5)

    def test_a_larger_position(self):
        self.assertEqual(fibonacci(17), 1597)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestFibonacci])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
