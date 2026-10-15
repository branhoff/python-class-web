---
id: distance-fallen
title: Distance fallen
section: 4
after: functions
---

Use this formula to find how far an object falls in a given time because of
gravity:

d = (1/2)gt<sup>2</sup>

where d is the distance in meters, g is 9.8, and t is the time in seconds.

Write a function called `distance_fallen` that takes a time in seconds as an
argument and returns the distance the object has fallen in that time. Here is
how it could be used:

```python
dist = distance_fallen(4.5)
print(dist)
```

Save the file as `distance_fallen.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-distance-fallen
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def distance_fallen(time: float) -> float:
    """Return the distance in meters an object falls in `time` seconds."""
    gravity: float = 9.8
    return 0.5 * gravity * time * time


# ---- Tests ----
import sys
import unittest


class TestDistanceFallen(unittest.TestCase):
    def test_an_object_has_not_fallen_at_time_zero(self):
        self.assertEqual(distance_fallen(0), 0)

    def test_one_second_of_falling_is_half_of_gravity(self):
        self.assertAlmostEqual(distance_fallen(1), 4.9)

    def test_the_example_from_the_project(self):
        self.assertAlmostEqual(distance_fallen(4.5), 99.225)

    def test_a_whole_number_of_seconds(self):
        self.assertAlmostEqual(distance_fallen(10), 490)

    def test_doubling_the_time_quadruples_the_distance(self):
        self.assertAlmostEqual(distance_fallen(6), 4 * distance_fallen(3))

    def test_a_fraction_of_a_second(self):
        self.assertAlmostEqual(distance_fallen(0.5), 1.225)

    def test_a_negative_time_gives_the_same_distance_as_a_positive_one(self):
        self.assertAlmostEqual(distance_fallen(-2), distance_fallen(2))


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestDistanceFallen])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
