---
id: add-surname
title: Add a surname
section: 6
after: lists
---

Write a function named `add_surname` that takes a list of first names. It returns
a new list holding only the names that start with "K", each with the surname
"Hoffman" added after a space. You can assume every name starts with a capital
letter. For example, given this list:

```python
["Kiki", "Krystal", "Pavel", "MaryKay", "Annie", "Koala"]
```

the function returns:

```python
['Kiki Hoffman', 'Krystal Hoffman', 'Koala Hoffman']
```

Save the file as `add_surname.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-add-surname
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail. The testing tools used here (classes and `unittest`) are not part of the course yet, so do not worry about how they work.

```python starter
def add_surname(first_names: list) -> list:
    """Return the names starting with "K", each followed by " Hoffman"."""
    return [name + " Hoffman" for name in first_names if name[0] == "K"]


# ---- Tests ----
import sys
import unittest


class TestAddSurname(unittest.TestCase):
    def test_the_example_from_the_project(self):
        names = ["Kiki", "Krystal", "Pavel", "MaryKay", "Annie", "Koala"]
        expected = ["Kiki Hoffman", "Krystal Hoffman", "Koala Hoffman"]
        self.assertEqual(add_surname(names), expected)

    def test_an_empty_list_gives_an_empty_list(self):
        self.assertEqual(add_surname([]), [])

    def test_a_name_starting_with_k_gets_the_surname(self):
        self.assertEqual(add_surname(["Kim"]), ["Kim Hoffman"])

    def test_a_name_not_starting_with_k_is_left_out(self):
        self.assertEqual(add_surname(["Pavel"]), [])

    def test_a_k_in_the_middle_of_a_name_does_not_count(self):
        self.assertEqual(add_surname(["MaryKay", "Ik"]), [])

    def test_a_lower_case_k_does_not_count(self):
        self.assertEqual(add_surname(["kiki"]), [])

    def test_a_single_letter_name_is_handled(self):
        self.assertEqual(add_surname(["K", "A"]), ["K Hoffman"])

    def test_names_keep_their_original_order(self):
        self.assertEqual(
            add_surname(["Zed", "Kyle", "Kai", "Ann"]),
            ["Kyle Hoffman", "Kai Hoffman"],
        )

    def test_the_original_list_is_left_unchanged(self):
        names = ["Kiki", "Pavel"]
        add_surname(names)
        self.assertEqual(names, ["Kiki", "Pavel"])


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestAddSurname])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
