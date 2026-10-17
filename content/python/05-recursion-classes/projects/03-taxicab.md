---
id: taxicab
title: Taxicab
section: 5
after: classes
---

Write a class called `Taxicab` with three **private** data members: the cab's
x-coordinate, its y-coordinate, and its odometer reading.

- The `__init__` method takes two parameters, the starting x and y coordinates.
  It sets the odometer to zero.
- There is a getter for each data member: `get_x_coord`, `get_y_coord` and
  `get_odometer`.
- `move_x` takes a number saying how far the cab moves left or right.
- `move_y` takes a number saying how far the cab moves up or down.
- The odometer adds up the distance travelled, so moving left counts the same as
  moving right.

Here is how the class could be used:

```python
cab = Taxicab(3, -8)       # creates a Taxicab object at coordinates (3, -8)
cab.move_x(4)              # moves cab 4 units "right"
cab.move_y(-5)             # moves cab 5 units "down"
cab.move_x(-2)             # moves cab 2 units "left"
print(cab.get_odometer())  # prints the current odometer reading
```

Save the file as `Taxicab.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-taxicab
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
class Taxicab:
    """A taxicab that tracks its position and the distance it has driven."""

    def __init__(self, x: int, y: int) -> None:
        """Place the cab at (x, y) with the odometer at zero."""
        self._x: int = x
        self._y: int = y
        self._odometer: int = 0

    def get_x_coord(self) -> int:
        """Return the cab's x-coordinate."""
        return self._x

    def get_y_coord(self) -> int:
        """Return the cab's y-coordinate."""
        return self._y

    def get_odometer(self) -> int:
        """Return the total distance driven."""
        return self._odometer

    def move_x(self, distance: int) -> None:
        """Move left or right. Any direction adds to the odometer."""
        self._x += distance
        self._odometer += abs(distance)

    def move_y(self, distance: int) -> None:
        """Move up or down. Any direction adds to the odometer."""
        self._y += distance
        self._odometer += abs(distance)


# ---- Tests ----
import sys
import unittest


class TestTaxicab(unittest.TestCase):
    def setUp(self):
        self.cab = Taxicab(3, -8)

    def test_a_new_cab_is_at_its_starting_coordinates(self):
        self.assertEqual(self.cab.get_x_coord(), 3)
        self.assertEqual(self.cab.get_y_coord(), -8)

    def test_a_new_cab_has_an_odometer_of_zero(self):
        self.assertEqual(self.cab.get_odometer(), 0)

    def test_moving_right_increases_x_and_leaves_y_alone(self):
        self.cab.move_x(4)
        self.assertEqual(self.cab.get_x_coord(), 7)
        self.assertEqual(self.cab.get_y_coord(), -8)

    def test_moving_left_decreases_x(self):
        self.cab.move_x(-5)
        self.assertEqual(self.cab.get_x_coord(), -2)

    def test_moving_up_increases_y_and_leaves_x_alone(self):
        self.cab.move_y(6)
        self.assertEqual(self.cab.get_y_coord(), -2)
        self.assertEqual(self.cab.get_x_coord(), 3)

    def test_moving_down_decreases_y(self):
        self.cab.move_y(-5)
        self.assertEqual(self.cab.get_y_coord(), -13)

    def test_moving_right_adds_to_the_odometer(self):
        self.cab.move_x(4)
        self.assertEqual(self.cab.get_odometer(), 4)

    def test_moving_left_adds_to_the_odometer_too(self):
        self.cab.move_x(-4)
        self.assertEqual(self.cab.get_odometer(), 4)

    def test_moving_up_adds_to_the_odometer(self):
        self.cab.move_y(6)
        self.assertEqual(self.cab.get_odometer(), 6)

    def test_moving_down_adds_to_the_odometer_too(self):
        self.cab.move_y(-6)
        self.assertEqual(self.cab.get_odometer(), 6)

    def test_moving_zero_changes_nothing(self):
        self.cab.move_x(0)
        self.cab.move_y(0)
        self.assertEqual(
            (self.cab.get_x_coord(), self.cab.get_y_coord(), self.cab.get_odometer()),
            (3, -8, 0),
        )

    def test_the_example_from_the_project(self):
        self.cab.move_x(4)
        self.cab.move_y(-5)
        self.cab.move_x(-2)
        self.assertEqual(self.cab.get_odometer(), 11)
        self.assertEqual(self.cab.get_x_coord(), 5)
        self.assertEqual(self.cab.get_y_coord(), -13)

    def test_the_move_methods_return_nothing(self):
        self.assertIsNone(self.cab.move_x(1))
        self.assertIsNone(self.cab.move_y(1))

    def test_each_cab_keeps_its_own_state(self):
        other = Taxicab(0, 0)
        self.cab.move_x(5)
        self.assertEqual(other.get_x_coord(), 0)
        self.assertEqual(other.get_odometer(), 0)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestTaxicab])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
