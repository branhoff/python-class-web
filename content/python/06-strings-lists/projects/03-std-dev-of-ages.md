---
id: std-dev-of-ages
title: Standard deviation of ages
section: 6
after: lists
---

Write a class called `Person` with two **private** data members: the person's
name and age. Its `__init__` method takes the two values and stores them. It also
has a `get_age` method.

Then write a separate function, outside the class, called `std_dev`. It takes a
list of `Person` objects and returns the standard deviation of their ages. Use
the population standard deviation, in these steps:

1. Find the mean age.
2. For each person, subtract the mean from their age and square the result.
3. Average those squared gaps (add them up and divide by the number of people).
4. Take the square root.

To find a standard deviation you need a square root. Raising a number to the
power 0.5 gives its square root, so `9 ** 0.5` is `3.0`. Python also has a
`sqrt()` function, but it needs an import, which we have not covered.

Here is how the class and function could be used:

```python
person1 = Person("Katie", 73)
person2 = Person("Tran", 24)
person3 = Person("Hanna", 48)
person_list = [person1, person2, person3]
answer = std_dev(person_list)
```

Save the file as `std_dev.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-std-dev-of-ages
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
class Person:
    """A person with a name and an age."""

    def __init__(self, name: str, age: int) -> None:
        """Store the person's name and age."""
        self._name: str = name
        self._age: int = age

    def get_age(self) -> int:
        """Return the person's age."""
        return self._age


def std_dev(person_list: list) -> float:
    """Return the standard deviation of the ages in a list of Person objects."""
    total: float = 0
    for person in person_list:
        total += person.get_age()
    mean: float = total / len(person_list)

    squared_gaps: float = 0
    for person in person_list:
        squared_gaps += (person.get_age() - mean) ** 2
    return (squared_gaps / len(person_list)) ** 0.5


# ---- Tests ----
import sys
import unittest


def people_aged(*ages: int) -> list:
    """Build a list of Person objects with the given ages."""
    return [Person("Someone", age) for age in ages]


class TestPerson(unittest.TestCase):
    def test_get_age_returns_the_age_given_to_the_constructor(self):
        self.assertEqual(Person("Katie", 73).get_age(), 73)

    def test_the_name_is_stored(self):
        # There is no getter for the name, so look at the stored values directly.
        self.assertIn("Katie", vars(Person("Katie", 73)).values())

    def test_the_name_and_age_are_private(self):
        person = Person("Katie", 73)
        self.assertFalse(hasattr(person, "name"))
        self.assertFalse(hasattr(person, "age"))


class TestStdDev(unittest.TestCase):
    def test_the_example_from_the_project(self):
        people = [Person("Katie", 73), Person("Tran", 24), Person("Hanna", 48)]
        self.assertAlmostEqual(std_dev(people), 20.0056, places=3)

    def test_a_known_population_standard_deviation(self):
        self.assertEqual(std_dev(people_aged(2, 4, 4, 4, 5, 5, 7, 9)), 2.0)

    def test_people_of_the_same_age_have_no_spread(self):
        self.assertEqual(std_dev(people_aged(30, 30)), 0)

    def test_one_person_has_no_spread(self):
        self.assertEqual(std_dev(people_aged(40)), 0)

    def test_two_ages_differ_from_the_mean_by_half_the_gap(self):
        self.assertEqual(std_dev(people_aged(10, 20)), 5.0)

    def test_the_order_of_the_people_does_not_matter(self):
        self.assertEqual(
            std_dev(people_aged(9, 2, 5, 4, 7, 4, 5, 4)),
            std_dev(people_aged(2, 4, 4, 4, 5, 5, 7, 9)),
        )

    def test_the_result_is_a_population_deviation_not_a_sample_one(self):
        # A sample deviation would divide by one less and give about 1.414.
        self.assertEqual(std_dev(people_aged(1, 3)), 1.0)

    def test_the_list_of_people_is_left_unchanged(self):
        people = people_aged(10, 20)
        std_dev(people)
        self.assertEqual([person.get_age() for person in people], [10, 20])


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestPerson, TestStdDev])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
