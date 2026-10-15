---
id: sets
title: Sets
section: 8
---

## Introduction

You're probably familiar with the concept of sets from math classes. A **set** is an unordered collection of elements where every element is unique. Adding a duplicate element doesn't change a set. Non-duplicate elements can be added to a set, so sets are **mutable**. However, the elements in a set must be **immutable**, so a set cannot contain lists or dictionaries or sets. Sets can contain values of different types, or be empty.

:::cell id=sets-demo1
```python starter
some_ints = {1, -7, -3, 524, 0}
some_elements = {19, "watermelon", 12.6, False, (1, 2, 3)}
empty = set()   # The empty set
# Remember that {} would be an empty dictionary
```
:::

## Type hinting with sets

Since Python 3.9, we can type hint with `set`.

:::cell id=sets-demo2
```python starter
some_ints: set[int] = {1, -7, -3, 524, 0}
some_elements: set[int | str | float | bool | tuple[int]] = {19, "watermelon", 12.6, False, (1, 2, 3)}
empty: set = set()   # The empty set
# Remember that {} would be an empty dictionary
```
:::

The `some_ints` variable is declared as a `set[int]`, indicating that it is a set of integers. The `some_elements` variable is declared as a `set[int | str | float | bool | tuple[int]]`, indicating that it is a set of elements that can be either integers, strings, floats, booleans, or tuples. The `empty` variable is declared as a `set`, indicating that it is an empty set without any type restrictions.

You cannot index or slice sets.

You can use `in` and `not in` to check whether a value is in the set:

:::cell id=sets-demo3
```python starter
some_ints: set[int] = {1, -7, -3, 524, 0}
print(-7 in some_ints)
```
:::

:::cell id=sets-demo4
```python starter
some_ints: set[int] = {1, -7, -3, 524, 0}
print(-7 not in some_ints)
```
:::

You can `add` elements to a set or `remove` elements from a set:

:::cell id=sets-demo5
```python starter
some_ints: set[int] = {1, -7, -3, 524, 0}
some_ints.remove(1)
print(some_ints)
```
:::

:::cell id=sets-demo6
```python starter
some_ints: set[int] = {1, -7, -3, 524, 0}
some_ints.remove(1)
some_ints.add(1)
print(some_ints)
```
:::

The `len` function tells you how many elements are in a set:

:::cell id=sets-demo7
```python starter
some_elements: set[int | str | float | bool | tuple[int]] = {19, "watermelon", 12.6, False, (1, 2, 3)}
print(len(some_elements))
```
:::

The `clear` method empties a set:

:::cell id=sets-demo8
```python starter
some_elements: set[int | str | float | bool | tuple[int]] = {19, "watermelon", 12.6, False, (1, 2, 3)}
some_elements.clear()
print(len(some_elements))
```
:::

### Set Operations

Python has operators for performing various set operations. The most common set operations are *union*, *intersection*, *difference*, and *symmetric difference*. Each of these operations produces a new set and leaves the original sets unchanged.

:::cell id=sets-demo9
```python starter
set_A: set[int] = {1, 2, 3}
set_B: set[int] = {5, 3, 4}
```
:::

The intersection of two sets is a new set that contains every element that is in **both** sets.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. Only the overlapping region in the middle, the elements shared by both circles, is shaded. That shaded middle is the intersection.

:::cell id=sets-demo10
```python starter
set_A: set[int] = {1, 2, 3}
set_B: set[int] = {5, 3, 4}
print(set_A & set_B)
```
:::

The union of two sets is a new set that contains every element that is in **either** set.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. The entire area of both circles, including the overlap, is shaded. All of it together is the union.

:::cell id=sets-demo11
```python starter
set_A: set[int] = {1, 2, 3}
set_B: set[int] = {5, 3, 4}
print(set_A | set_B)  # the union operator is the vertical bar symbol
```
:::

The *difference* of two sets is a new set that contains every element that is in the first set **except for** the elements that are also in the second set. This operation is not "symmetric", the result may be different depending on which set comes first.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. Only the part of circle A that does not overlap circle B is shaded. That shaded crescent is the difference A minus B.

:::cell id=sets-demo12
```python starter
set_A: set[int] = {1, 2, 3}
set_B: set[int] = {5, 3, 4}
print(set_A - set_B)
print(set_B - set_A)
```
:::

The symmetric difference of two sets is a new set that contains every element that is in either set except the elements that are in both sets. This is the same as the union minus the intersection.

> Diagram: two overlapping circles (a Venn diagram) labeled set A and set B. Both circles are shaded except for the overlapping region in the middle, which is left blank. The two shaded crescents together are the symmetric difference.

:::cell id=sets-demo13
```python starter
set_A: set[int] = {1, 2, 3}
set_B: set[int] = {5, 3, 4}
print(set_A ^ set_B)
```
:::

:::cell id=sets-demo14
```python starter
set_A: set[int] = {1, 2, 3}
set_B: set[int] = {5, 3, 4}
# this is the same as set_A ^ set_B
print((set_A | set_B) - (set_A & set_B))
```
:::

We can iterate through a set with a for loop:

:::cell id=sets-demo15
```python starter
set_B: set[int] = {5, 3, 4}
el: int
for el in set_B:
    print(el * 2)
```
:::

### Lists vs. Sets

How do you know when to use a list and when to use a set?

1. A set cannot contain duplicate elements, but a list can.
2. A set can only contain values that are immutable, but lists can contain mutable values.
3. A list is ordered, so you can know that its elements will be traversed or printed out in a particular order. The same is not true of sets (or dictionaries), which are unordered.
4. Checking whether a certain value is in a list takes time proportional to the length of the list, but doing so in a set is very fast, regardless of the size of the set.

### Set Comprehensions

A set comprehension looks just like a list comprehension except it uses curly braces instead of square brackets. For example, if you have a list of names that possibly contains duplicates, and you would like to filter out any names that aren't palindromes (ignoring case) and get rid of duplicates at the same time, you could create a set like so:

:::cell id=sets-demo16
```python starter
name_list: list[str] = ["Hannah", "Bob", "Carl",
                        "Rebecca", "Carl", "Bob"]

name: str
name_set: set[str] = {name for name in name_list if name.lower() == name.lower()[::-1]}
print(name_set)
```
:::

Checking for equality to the reverse slice checks for palindromes. Using `lower()` makes sure that a capital letter does not make us pay attention to case. The curly braces mean it creates a set, which will automatically exclude any duplicates.

## Exercises

:::cell id=sets-ex1 kind=exercise
1. Write your own function called `unionize` for finding the union of two sets. Your function should take as parameters two sets, and return a new set that is the union of those two sets. Do not use Python's built-in union functionality.

```python starter
# Type code here
```

```python tests
assert "unionize" in dir(), "Define a function named unionize."
assert unionize({1, 2, 3}, {5, 3, 4}) == {1, 2, 3, 4, 5}, (
    "unionize({1, 2, 3}, {5, 3, 4}) should return {1, 2, 3, 4, 5}, "
    f"but it returned {unionize({1, 2, 3}, {5, 3, 4})!r}."
)
assert unionize(set(), {1, 2}) == {1, 2}, (
    "The union with the empty set should return the other set."
)
assert unionize({1, 2}, {1, 2}) == {1, 2}, (
    "The union of a set with itself should return the same elements."
)
a = {1, 2}
b = {3, 4}
unionize(a, b)
assert a == {1, 2} and b == {3, 4}, (
    "unionize should not modify the sets passed to it."
)
```

```python solution
def unionize(s1: set[object], s2: set[object]) -> set[object]:
    result: set[object] = set()
    i: object
    for i in s1:
        result.add(i)
    j: object
    for j in s2:
        result.add(j)
    return result
```
:::

:::cell id=sets-ex2 kind=exercise
2. Write your own function called `intersect` for finding the intersection of two sets. Your function should take as parameters two sets, and return a new set that is the intersection of those two sets. Do not use Python's built-in intersection functionality.

```python starter
# Type code here
```

```python tests
assert "intersect" in dir(), "Define a function named intersect."
assert intersect({1, 2, 3}, {5, 3, 4}) == {3}, (
    "intersect({1, 2, 3}, {5, 3, 4}) should return {3}, "
    f"but it returned {intersect({1, 2, 3}, {5, 3, 4})!r}."
)
assert intersect({1, 2}, {3, 4}) == set(), (
    "Sets with no common elements should intersect to the empty set."
)
assert intersect({1, 2, 3}, {1, 2, 3}) == {1, 2, 3}, (
    "The intersection of a set with itself should return the same elements."
)
```

```python solution
def intersect(s1: set[object], s2: set[object]) -> set[object]:
    i: object
    return {i for i in s1 if i in s2}
```
:::

:::cell id=sets-ex3 kind=exercise
3. Write your own function called `sym_diff` for finding the symmetric difference of two sets. Your function should take as parameters two sets, and return a new set that is the symmetric difference of those two sets. Do not use Python's built-in symmetric difference functionality.

```python starter
# Type code here
```

```python tests
assert "sym_diff" in dir(), "Define a function named sym_diff."
assert sym_diff({1, 2, 3}, {5, 3, 4}) == {1, 2, 4, 5}, (
    "sym_diff({1, 2, 3}, {5, 3, 4}) should return {1, 2, 4, 5}, "
    f"but it returned {sym_diff({1, 2, 3}, {5, 3, 4})!r}."
)
assert sym_diff({1, 2, 3}, {1, 2, 3}) == set(), (
    "The symmetric difference of a set with itself should be the empty set."
)
assert sym_diff(set(), {1, 2}) == {1, 2}, (
    "The symmetric difference with the empty set should return the other set."
)
```

```python solution
def sym_diff(s1: set[object], s2: set[object]) -> set[object]:
    s3: set[object] = s1 | s2
    i: object
    return {i for i in s3 if (i not in s1) or (i not in s2)}
```
:::

## Projects

Build these in VS Code, in your project folder. Click a project name to open it.
The last two are the final projects of the course. They bring together everything
from the earlier sections.

<details id="project-words-in-both">
<summary>Project: Words in both</summary>

Write a function called `words_in_both` that takes two strings and returns a set
of the words that appear in both. You can assume every character is a letter or
a space. Capitalization does not matter, so "to" and "To" are the same word. The
words in the result set should be lower-case. For example, if one string has
"on" and the other has "ON", the set should contain "on".

Python's `split()` method helps here:

```python
sentence = 'Not the comfy chair!'
print(sentence.split())
['Not', 'the', 'comfy', 'chair!']
```

Here is how the function could be used:

```python
common_words = words_in_both("She's a jack of all trades", 'Jack was tallest of all')
```

Save the file as `words_in_both.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-words-in-both
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def words_in_both(first: str, second: str) -> set:
    """Return the lower-case words that appear in both strings."""
    return set(first.lower().split()) & set(second.lower().split())


# ---- Tests ----
import sys
import unittest


class TestWordsInBoth(unittest.TestCase):
    def test_the_example_from_the_project_finds_three_shared_words(self):
        result = words_in_both("She's a jack of all trades", "Jack was tallest of all")
        self.assertEqual(result, {"jack", "of", "all"})

    def test_a_word_in_only_one_string_is_left_out(self):
        self.assertEqual(words_in_both("red green blue", "green yellow"), {"green"})

    def test_strings_with_no_words_in_common_give_an_empty_set(self):
        self.assertEqual(words_in_both("one two", "three four"), set())

    def test_capitalization_does_not_matter(self):
        self.assertEqual(words_in_both("on", "ON"), {"on"})

    def test_the_result_is_lower_case_whichever_string_had_capitals(self):
        self.assertEqual(words_in_both("To Be", "to be"), {"to", "be"})
        self.assertEqual(words_in_both("to be", "TO BE"), {"to", "be"})

    def test_a_repeated_word_appears_once_in_the_set(self):
        self.assertEqual(words_in_both("go go go", "go"), {"go"})

    def test_extra_spaces_do_not_create_empty_words(self):
        self.assertEqual(words_in_both("  a   b ", "b  a"), {"a", "b"})

    def test_an_empty_string_has_no_words_in_common_with_anything(self):
        self.assertEqual(words_in_both("", "some words"), set())
        self.assertEqual(words_in_both("some words", ""), set())
        self.assertEqual(words_in_both("", ""), set())

    def test_the_result_is_a_set(self):
        self.assertIsInstance(words_in_both("a", "a"), set)


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestWordsInBoth])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>

<details id="project-employee-directory">
<summary>Project: Employee directory</summary>

Write a class called `Employee` with **private** data members for an employee's
name, ID number, salary and email address. It has an `__init__` method that sets
them and a getter for each one.

Then write a separate function, outside the class, called `make_employee_dict`.
It takes four lists as parameters: names, ID numbers, salaries and email
addresses. All four are the same length. The function goes through the lists,
creates an `Employee` for each position, and adds it to a dictionary. The
dictionary's keys are the ID numbers and its values are the `Employee` objects.
The function returns the dictionary.

Here is how it could be used:

```python
emp_names = ["Tuan", "Rachel", "Brandon"]
emp_ids = ["1000", "1001", "1002"]
emp_sals = [30, 35, 28]
emp_emails = ["Tuan@aol.com", "Rachel@aol.com", "Brandon@aol.com"]
result = make_employee_dict(emp_names, emp_ids, emp_sals, emp_emails)
print(result["1000"].get_name())
```

When you test, remember that printing an object of your own class shows only its
type and a memory address. To see its values, call its getters, as the last line
above does.

Save the file as `make_employee_dict.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-employee-directory
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
class Employee:
    """An employee with a name, ID number, salary and email address."""

    def __init__(self, name: str, id_number: str, salary: int, email_address: str) -> None:
        """Store the employee's details."""
        self._name: str = name
        self._id_number: str = id_number
        self._salary: int = salary
        self._email_address: str = email_address

    def get_name(self) -> str:
        """Return the employee's name."""
        return self._name

    def get_id_number(self) -> str:
        """Return the employee's ID number."""
        return self._id_number

    def get_salary(self) -> int:
        """Return the employee's salary."""
        return self._salary

    def get_email_address(self) -> str:
        """Return the employee's email address."""
        return self._email_address


def make_employee_dict(names: list, id_numbers: list, salaries: list, emails: list) -> dict:
    """Return a dictionary mapping each ID number to its Employee."""
    employees: dict = {}
    for index in range(len(id_numbers)):
        employees[id_numbers[index]] = Employee(
            names[index], id_numbers[index], salaries[index], emails[index]
        )
    return employees



# ---- Tests ----
import sys
import unittest


class TestEmployee(unittest.TestCase):
    def setUp(self):
        self.employee = Employee("Tuan", "1000", 30, "Tuan@aol.com")

    def test_get_name_returns_the_name_given(self):
        self.assertEqual(self.employee.get_name(), "Tuan")

    def test_get_id_number_returns_the_id_number_given(self):
        self.assertEqual(self.employee.get_id_number(), "1000")

    def test_get_salary_returns_the_salary_given(self):
        self.assertEqual(self.employee.get_salary(), 30)

    def test_get_email_address_returns_the_email_address_given(self):
        self.assertEqual(self.employee.get_email_address(), "Tuan@aol.com")

    def test_each_employee_keeps_its_own_details(self):
        other = Employee("Rachel", "1001", 35, "Rachel@aol.com")
        self.assertEqual(other.get_name(), "Rachel")
        self.assertEqual(self.employee.get_name(), "Tuan")

    def test_the_data_members_are_private_by_naming_convention(self):
        self.assertFalse(hasattr(self.employee, "name"))
        self.assertFalse(hasattr(self.employee, "salary"))


class TestMakeEmployeeDict(unittest.TestCase):
    def setUp(self):
        self.names = ["Tuan", "Rachel", "Brandon"]
        self.ids = ["1000", "1001", "1002"]
        self.salaries = [30, 35, 28]
        self.emails = ["Tuan@aol.com", "Rachel@aol.com", "Brandon@aol.com"]

    def make(self):
        return make_employee_dict(self.names, self.ids, self.salaries, self.emails)

    def test_the_keys_are_the_id_numbers(self):
        self.assertEqual(sorted(self.make()), ["1000", "1001", "1002"])

    def test_the_values_are_employee_objects(self):
        for employee in self.make().values():
            self.assertIsInstance(employee, Employee)

    def test_each_id_maps_to_the_employee_at_the_same_list_position(self):
        result = self.make()
        self.assertEqual(result["1000"].get_name(), "Tuan")
        self.assertEqual(result["1001"].get_name(), "Rachel")
        self.assertEqual(result["1002"].get_name(), "Brandon")

    def test_every_detail_is_copied_to_the_right_employee(self):
        brandon = self.make()["1002"]
        self.assertEqual(brandon.get_id_number(), "1002")
        self.assertEqual(brandon.get_salary(), 28)
        self.assertEqual(brandon.get_email_address(), "Brandon@aol.com")

    def test_the_salary_and_email_of_the_first_employee_are_correct(self):
        tuan = self.make()["1000"]
        self.assertEqual(tuan.get_salary(), 30)
        self.assertEqual(tuan.get_email_address(), "Tuan@aol.com")

    def test_one_employee_gives_a_dictionary_of_one(self):
        result = make_employee_dict(["Tuan"], ["1000"], [30], ["Tuan@aol.com"])
        self.assertEqual(list(result), ["1000"])
        self.assertEqual(result["1000"].get_name(), "Tuan")

    def test_empty_lists_give_an_empty_dictionary(self):
        self.assertEqual(make_employee_dict([], [], [], []), {})

    def test_the_input_lists_are_not_changed(self):
        self.make()
        self.assertEqual(self.names, ["Tuan", "Rachel", "Brandon"])
        self.assertEqual(self.ids, ["1000", "1001", "1002"])
        self.assertEqual(self.salaries, [30, 35, 28])
        self.assertEqual(self.emails, ["Tuan@aol.com", "Rachel@aol.com", "Brandon@aol.com"])


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(
    loader.loadTestsFromTestCase(case) for case in [TestEmployee, TestMakeEmployeeDict]
)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>

<details id="project-add-three-game">
<summary>Final project: Add Three game</summary>

Write a class named `AddThreeGame` for a two-player game. The players take turns
choosing numbers from 1 to 9. A number cannot be chosen if either player has
already chosen it. If exactly three of a player's numbers add up to 15, that
player wins. If all nine numbers are chosen and nobody has won, the game is a
draw.

The class needs **private** data members for:

1. which numbers have been chosen, and by whom
2. the current state, which is one of "FIRST_WON", "SECOND_WON", "DRAW" or
   "UNFINISHED"
3. whose turn it is

The class must have these methods:

- An `__init__` method that takes no parameters other than `self`.
- `get_current_state`, which returns the current state of the game.
- `make_move`, which takes two parameters in this order: a string saying which
  player is moving, either "first" or "second", and the integer they chose.
  Return `False` if it is not that player's turn, if the integer is out of
  range, if it was already chosen, or if the game is already won or drawn.
  Otherwise record the move, update the state if the move won or drew the game,
  update whose turn it is, and return `True`.

Here is how the class could be used:

```python
game = AddThreeGame()
game.make_move("first", 2)
game.make_move("second", 5)
result = game.make_move("first", 7)
state = game.get_current_state()
```

Save the file as `AddThreeGame.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-add-three-game
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail. The testing tools used here (classes and `unittest`) are not part of the course yet, so do not worry about how they work.

```python starter
class AddThreeGame:
    """Two players take turns choosing 1-9. Three of your numbers adding to 15 wins."""

    def __init__(self) -> None:
        """Start a new game with the first player to move."""
        self._choices: dict = {"first": [], "second": []}
        self._state: str = "UNFINISHED"
        self._turn: str = "first"

    def get_current_state(self) -> str:
        """Return "FIRST_WON", "SECOND_WON", "DRAW" or "UNFINISHED"."""
        return self._state

    def make_move(self, player: str, number: int) -> bool:
        """Record a move and return True, or return False if it is not allowed."""
        if self._state != "UNFINISHED" or player != self._turn:
            return False
        if number < 1 or number > 9:
            return False
        if number in self._choices["first"] or number in self._choices["second"]:
            return False

        self._choices[player].append(number)
        self._update_state(player)
        if player == "first":
            self._turn = "second"
        else:
            self._turn = "first"
        return True

    def _update_state(self, player: str) -> None:
        """Set the state to a win for `player`, a draw, or leave it unfinished."""
        if self._has_winning_trio(self._choices[player]):
            self._state = player.upper() + "_WON"
        elif len(self._choices["first"]) + len(self._choices["second"]) == 9:
            self._state = "DRAW"

    def _has_winning_trio(self, numbers: list) -> bool:
        """Return True if any three of the numbers add up to 15."""
        count: int = len(numbers)
        for i in range(count):
            for j in range(i + 1, count):
                for k in range(j + 1, count):
                    if numbers[i] + numbers[j] + numbers[k] == 15:
                        return True
        return False



# ---- Tests ----
import sys
import unittest


def play(game, moves):
    """Make each (player, number) move in order and return the list of results."""
    return [game.make_move(player, number) for player, number in moves]


class TestStartOfTheGame(unittest.TestCase):
    def test_a_new_game_is_unfinished(self):
        self.assertEqual(AddThreeGame().get_current_state(), "UNFINISHED")

    def test_the_first_player_moves_first(self):
        self.assertTrue(AddThreeGame().make_move("first", 5))

    def test_the_second_player_cannot_move_first(self):
        self.assertFalse(AddThreeGame().make_move("second", 5))

    def test_an_unknown_player_cannot_move(self):
        self.assertFalse(AddThreeGame().make_move("third", 5))


class TestTurnOrder(unittest.TestCase):
    def test_players_must_take_turns(self):
        game = AddThreeGame()
        results = play(game, [("first", 1), ("second", 2), ("first", 3), ("second", 4)])
        self.assertEqual(results, [True, True, True, True])

    def test_a_player_cannot_move_twice_in_a_row(self):
        game = AddThreeGame()
        self.assertTrue(game.make_move("first", 1))
        self.assertFalse(game.make_move("first", 2))

    def test_the_first_player_cannot_move_on_the_seconds_turn(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 2)])
        self.assertFalse(game.make_move("second", 3))

    def test_a_refused_move_does_not_change_whose_turn_it_is(self):
        game = AddThreeGame()
        game.make_move("first", 1)
        self.assertFalse(game.make_move("first", 2))
        self.assertTrue(game.make_move("second", 2))

    def test_a_move_by_the_wrong_player_does_not_use_up_the_number(self):
        game = AddThreeGame()
        self.assertFalse(game.make_move("second", 5))
        self.assertTrue(game.make_move("first", 5))


class TestNumberRange(unittest.TestCase):
    def test_every_number_from_1_to_9_is_allowed(self):
        for number in range(1, 10):
            with self.subTest(number=number):
                self.assertTrue(AddThreeGame().make_move("first", number))

    def test_zero_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", 0))

    def test_ten_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", 10))

    def test_a_negative_number_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", -3))

    def test_a_far_too_large_number_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", 100))

    def test_an_out_of_range_move_does_not_pass_the_turn(self):
        game = AddThreeGame()
        self.assertFalse(game.make_move("first", 10))
        self.assertTrue(game.make_move("first", 9))


class TestChosenNumbersCannotBeReused(unittest.TestCase):
    def test_a_number_the_other_player_chose_is_refused(self):
        game = AddThreeGame()
        play(game, [("first", 5)])
        self.assertFalse(game.make_move("second", 5))

    def test_a_number_the_same_player_chose_is_refused(self):
        game = AddThreeGame()
        play(game, [("first", 5), ("second", 1)])
        self.assertFalse(game.make_move("first", 5))

    def test_a_refused_duplicate_does_not_pass_the_turn(self):
        game = AddThreeGame()
        play(game, [("first", 5)])
        self.assertFalse(game.make_move("second", 5))
        self.assertTrue(game.make_move("second", 6))


class TestWinning(unittest.TestCase):
    def test_the_first_player_wins_with_three_numbers_that_add_to_15(self):
        game = AddThreeGame()
        results = play(
            game, [("first", 2), ("second", 1), ("first", 7), ("second", 3), ("first", 6)]
        )
        self.assertEqual(results, [True] * 5)
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_the_second_player_wins_with_three_numbers_that_add_to_15(self):
        game = AddThreeGame()
        results = play(
            game, [("first", 2), ("second", 1), ("first", 3), ("second", 5), ("first", 4), ("second", 9)]
        )
        self.assertEqual(results, [True] * 6)
        self.assertEqual(game.get_current_state(), "SECOND_WON")

    def test_two_numbers_cannot_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 1), ("first", 6)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_three_numbers_adding_to_less_than_15_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 9), ("first", 2), ("second", 8), ("first", 3)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_three_numbers_adding_to_more_than_15_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 1), ("first", 8), ("second", 2), ("first", 7)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_three_numbers_adding_to_14_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 2), ("first", 4), ("second", 3), ("first", 1)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_numbers_split_between_the_players_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 5), ("first", 1)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_a_win_using_the_first_three_numbers_chosen(self):
        game = AddThreeGame()
        play(game, [("first", 8), ("second", 1), ("first", 3), ("second", 2), ("first", 4)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_a_win_can_skip_over_a_number_chosen_in_the_middle(self):
        game = AddThreeGame()
        play(game, [("first", 4), ("second", 2), ("first", 1), ("second", 3), ("first", 5)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")
        play(game, [("second", 7), ("first", 6)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_a_win_using_the_oldest_number_and_the_two_newest(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 3), ("first", 2), ("second", 4)])
        play(game, [("first", 5), ("second", 6), ("first", 9)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_a_win_using_the_three_newest_numbers(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 2), ("first", 4), ("second", 3)])
        play(game, [("first", 5), ("second", 7), ("first", 6)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")


class TestDraw(unittest.TestCase):
    DRAWN_GAME = [1, 2, 4, 3, 5, 6, 7, 9, 8]

    def play_numbers(self, numbers):
        game = AddThreeGame()
        for turn, number in enumerate(numbers):
            player = "first" if turn % 2 == 0 else "second"
            self.assertTrue(game.make_move(player, number))
        return game

    def test_nine_numbers_with_no_winner_is_a_draw(self):
        game = self.play_numbers(self.DRAWN_GAME)
        self.assertEqual(game.get_current_state(), "DRAW")

    def test_the_game_is_unfinished_until_the_ninth_number(self):
        game = self.play_numbers(self.DRAWN_GAME[:8])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_a_win_on_the_ninth_number_is_a_win_not_a_draw(self):
        winning_game = [1, 3, 2, 7, 4, 8, 5, 9, 6]
        game = self.play_numbers(winning_game)
        self.assertEqual(game.get_current_state(), "FIRST_WON")


class TestMovesAfterTheGameEnds(unittest.TestCase):
    def test_no_move_is_allowed_after_the_first_player_wins(self):
        game = AddThreeGame()
        play(game, [("first", 2), ("second", 1), ("first", 7), ("second", 3), ("first", 6)])
        self.assertFalse(game.make_move("second", 9))
        self.assertFalse(game.make_move("first", 9))
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_no_move_is_allowed_after_the_second_player_wins(self):
        game = AddThreeGame()
        play(game, [("first", 2), ("second", 1), ("first", 3), ("second", 5), ("first", 4), ("second", 9)])
        self.assertFalse(game.make_move("first", 6))
        self.assertFalse(game.make_move("second", 6))
        self.assertEqual(game.get_current_state(), "SECOND_WON")

    def test_no_move_is_allowed_after_a_draw(self):
        game = AddThreeGame()
        for turn, number in enumerate(TestDraw.DRAWN_GAME):
            game.make_move("first" if turn % 2 == 0 else "second", number)
        self.assertFalse(game.make_move("first", 1))
        self.assertFalse(game.make_move("second", 1))
        self.assertEqual(game.get_current_state(), "DRAW")


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(
    loader.loadTestsFromTestCase(case)
    for case in [
        TestStartOfTheGame,
        TestTurnOrder,
        TestNumberRange,
        TestChosenNumbersCannotBeReused,
        TestWinning,
        TestDraw,
        TestMovesAfterTheGameEnds,
    ]
)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>

<details id="project-builders-game">
<summary>Final project: Builders game</summary>

Write a class called `BuildersGame` for a two-player game on a 5x5 grid. Each
player has two builders. The builders move around the board and add levels to
towers. The first player to move a builder on top of a 3-story tower wins.

**The rules.** Player A is `'x'` and player B is `'o'`. Player A places two
builders on the board, then player B places two. No two builders can ever share a square. After that, player A moves one
builder to an adjacent square (one step in any direction, including diagonals).
A builder can move down any number of levels but can move up at most 1 level. It
can also stay at the same level. A builder always ends up on top of the tower on
its new square.

After moving, the builder **must** add a level to an adjacent square. A level
cannot be added to a square with a builder on it. Once a tower has a 4th level,
it is complete: no more levels can be added and no builder can move onto it. Players then alternate moving and building. A
player wins by moving a builder on top of a 3-story tower, **or** when the
opponent has no legal move.

**The class.** It has these **private** data members: a representation of the
board; the current state, which is "playerA_WON", "playerB_WON" or "UNFINISHED";
and something that tracks whose turn it is.

- `__init__` sets up an empty board, sets the state to "UNFINISHED", and sets
  up the other data members. A list of lists works well for the board: five
  lists, each holding five empty strings (or any character you like for an empty
  square).
- `get_current_state` returns the current state.
- `initial_placement` takes five parameters: the row and column of each of the
  player's two builders, and `'x'` or `'o'` to say which player is placing them.
  Rows and columns are integers from 0 to 4. For example,
  `initial_placement(0,1,4,2,'o')` puts o's builders at row 0, column 1 and row
  4, column 2. Return `False` if a chosen square is occupied, if the player
  placing is not the player whose turn it is, or if that player has already
  placed their builders. Otherwise update the board and whose turn it is, and
  return `True`.
- `make_move` takes six parameters: the row and column of the builder to move,
  the row and column it moves to, and the row and column where it builds. For
  example, `make_move(2,0,3,1,3,0)` moves the builder at row 2, column 0 to row
  3, column 1, then builds a level at row 3, column 0. Return `False` if the game
  is over, if the move is invalid, if the builder does not belong to the player
  whose turn it is, or if either player has not made their initial placement
  yet. Otherwise record the move, update the state and whose turn it is, and
  return `True`. To update the state, check whether the move put a builder on a
  3-story tower, or left the opponent with no legal move.

It is not required, but a method that prints the board helps a lot when testing
and debugging. Whether you index the board as `[row][column]` or `[column][row]`
does not matter as long as you are consistent.

Here is a simple example of how the class could be used:

```python
board = BuildersGame()
board.initial_placement(2,2,1,2,'x')
board.initial_placement(0,1,4,2,'o')
board.make_move(2,2,1,1,1,0)
board.make_move(0,1,1,0,2,0)
board.get_current_state()
```

Save the file as `BuildersGame.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-builders-game
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail. The testing tools used here (classes and `unittest`) are not part of the course yet, so do not worry about how they work.

```python starter
class BuildersGame:
    """A two-player building game on a 5x5 grid. Player A is 'x', player B is 'o'."""

    def __init__(self) -> None:
        """Start with an empty board and player A to place builders."""
        self._size: int = 5
        self._levels: list = []
        for row in range(self._size):
            row_levels: list = []
            for col in range(self._size):
                row_levels.append(0)
            self._levels.append(row_levels)
        self._builders: dict = {"x": [], "o": []}
        self._state: str = "UNFINISHED"
        self._turn: str = "x"

    def get_current_state(self) -> str:
        """Return "playerA_WON", "playerB_WON" or "UNFINISHED"."""
        return self._state

    def print_board(self) -> None:
        """Print each square as its level, then the builder's letter (or a dot if none)."""
        for row in range(self._size):
            line: str = ""
            for col in range(self._size):
                owner: str = self._owner_at(row, col)
                if owner == "":
                    owner = "."
                if col > 0:
                    line = line + " "
                line = line + str(self._levels[row][col]) + owner
            print(line)

    def initial_placement(self, row1: int, col1: int, row2: int, col2: int, player: str) -> bool:
        """Place a player's two builders. Return False if the placement is not allowed."""
        if player != self._turn or self._builders[player] != []:
            return False
        if row1 == row2 and col1 == col2:
            return False
        if not self._on_board(row1, col1) or self._owner_at(row1, col1) != "":
            return False
        if not self._on_board(row2, col2) or self._owner_at(row2, col2) != "":
            return False

        self._builders[player] = [[row1, col1], [row2, col2]]
        self._turn = self._other_player(player)
        return True

    def make_move(
        self, from_row: int, from_col: int, to_row: int, to_col: int, build_row: int, build_col: int
    ) -> bool:
        """Move a builder, then build. Return False if the move is not allowed."""
        player: str = self._turn
        if self._state != "UNFINISHED":
            return False
        # Before both players have placed, the player to move may have no builder, so this fails.
        if not self._is_legal(player, from_row, from_col, to_row, to_col, build_row, build_col):
            return False

        for builder in self._builders[player]:
            if builder == [from_row, from_col]:
                builder[0] = to_row
                builder[1] = to_col
        self._levels[build_row][build_col] += 1

        opponent: str = self._other_player(player)
        if self._levels[to_row][to_col] == 3 or not self._has_legal_move(opponent):
            if player == "x":
                self._state = "playerA_WON"
            else:
                self._state = "playerB_WON"
        self._turn = opponent
        return True

    def _other_player(self, player: str) -> str:
        """Return the letter of the player who is not `player`."""
        if player == "x":
            return "o"
        return "x"

    def _on_board(self, row: int, col: int) -> bool:
        """Return True if the square is inside the 5x5 grid."""
        return 0 <= row < self._size and 0 <= col < self._size

    def _owner_at(self, row: int, col: int) -> str:
        """Return 'x' or 'o' if a builder stands on the square, else an empty string."""
        for player in self._builders:
            if [row, col] in self._builders[player]:
                return player
        return ""

    def _is_adjacent(self, row1: int, col1: int, row2: int, col2: int) -> bool:
        """Return True if the squares are different and touch, even diagonally."""
        same_square: bool = row1 == row2 and col1 == col2
        return not same_square and abs(row1 - row2) <= 1 and abs(col1 - col2) <= 1

    def _is_legal(
        self,
        player: str,
        from_row: int,
        from_col: int,
        to_row: int,
        to_col: int,
        build_row: int,
        build_col: int,
    ) -> bool:
        """Return True if `player` may make this move and build."""
        if not self._on_board(to_row, to_col) or not self._on_board(build_row, build_col):
            return False
        if [from_row, from_col] not in self._builders[player]:
            return False
        if not self._is_adjacent(from_row, from_col, to_row, to_col):
            return False
        if self._owner_at(to_row, to_col) != "":
            return False
        climb: int = self._levels[to_row][to_col] - self._levels[from_row][from_col]
        if climb > 1:  # A finished tower (level 4) is too high for any builder to climb.
            return False

        if not self._is_adjacent(to_row, to_col, build_row, build_col):
            return False
        # The builder has left its old square, so that square is free to build on.
        vacated: bool = build_row == from_row and build_col == from_col
        if self._owner_at(build_row, build_col) != "" and not vacated:
            return False
        return self._levels[build_row][build_col] < 4

    def _has_legal_move(self, player: str) -> bool:
        """Return True if `player` has at least one legal move and build."""
        for builder in self._builders[player]:
            for to_row in range(self._size):
                for to_col in range(self._size):
                    for build_row in range(self._size):
                        for build_col in range(self._size):
                            if self._is_legal(
                                player, builder[0], builder[1], to_row, to_col, build_row, build_col
                            ):
                                return True
        return False


# ---- Tests ----
import io
import sys
import unittest
from contextlib import redirect_stdout

# Opening squares used by most tests: x at (2,2) and (1,2), o at (0,1) and (4,2).
X_START = ((2, 2), (1, 2))
O_START = ((0, 1), (4, 2))

# A short game in which player x climbs a tower, one level per move, and then wins.
# Odd-numbered moves belong to the climber, even-numbered ones to a weak opponent.
CLIMB_1 = (2, 2, 3, 2, 3, 3)  # builds (3,3) to level 1
WEAK_1 = (4, 2, 4, 3, 3, 4)  # builds (3,4) to level 1
CLIMB_2 = (3, 2, 3, 3, 3, 4)  # steps up onto (3,3), builds (3,4) to level 2
WEAK_2 = (4, 3, 4, 2, 4, 3)
CLIMB_3 = (3, 3, 3, 4, 3, 3)  # steps up onto (3,4), builds (3,3) to level 2
WEAK_3 = (4, 2, 4, 3, 3, 3)  # builds (3,3) to level 3
CLIMB_4 = (3, 4, 3, 3, 4, 4)  # steps up from level 2 onto the level 3 tower
CLIMB_SO_FAR = (CLIMB_1, WEAK_1, CLIMB_2, WEAK_2, CLIMB_3)


class BuildersTestCase(unittest.TestCase):
    """Shared helpers. The board is read through print_board, its public view."""

    def new_game(self, x_squares=X_START, o_squares=O_START):
        game = BuildersGame()
        self.assertTrue(game.initial_placement(*x_squares[0], *x_squares[1], "x"))
        self.assertTrue(game.initial_placement(*o_squares[0], *o_squares[1], "o"))
        return game

    def play(self, game, *moves):
        for move in moves:
            self.assertTrue(game.make_move(*move), f"move {move} should be allowed")

    def board(self, game):
        output = io.StringIO()
        with redirect_stdout(output):
            game.print_board()
        return output.getvalue().splitlines()

    def assertBoard(self, game, *rows):
        self.assertEqual(self.board(game), list(rows))

    def square(self, game, row, col):
        """Return the level and builder letter on a square, such as '2x' or '0.'."""
        return self.board(game)[row].split()[col]


class TestPrintBoard(BuildersTestCase):
    def test_an_empty_board_is_five_rows_of_level_zero(self):
        self.assertBoard(
            BuildersGame(),
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
        )

    def test_each_builder_is_shown_as_its_letter_after_the_level(self):
        self.assertBoard(
            self.new_game(),
            "0. 0o 0. 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0o 0. 0.",
        )

    def test_printing_does_not_change_the_game(self):
        game = self.new_game()
        before = self.board(game)
        self.assertEqual(self.board(game), before)
        self.assertEqual(game.get_current_state(), "UNFINISHED")


class TestInitialPlacement(BuildersTestCase):
    def test_x_places_first_and_then_o(self):
        game = BuildersGame()
        self.assertTrue(game.initial_placement(2, 2, 1, 2, "x"))
        self.assertTrue(game.initial_placement(0, 1, 4, 2, "o"))

    def test_o_cannot_place_before_x(self):
        game = BuildersGame()
        self.assertFalse(game.initial_placement(0, 1, 4, 2, "o"))
        self.assertEqual(self.square(game, 0, 1), "0.")

    def test_x_cannot_place_twice_in_a_row(self):
        game = BuildersGame()
        self.assertTrue(game.initial_placement(2, 2, 1, 2, "x"))
        self.assertFalse(game.initial_placement(3, 3, 3, 4, "x"))

    def test_a_player_who_has_placed_cannot_place_again_on_their_turn(self):
        game = self.new_game()
        self.assertFalse(game.initial_placement(3, 3, 3, 4, "x"))
        self.assertEqual(self.square(game, 3, 3), "0.")

    def test_an_unknown_player_letter_is_refused(self):
        self.assertFalse(BuildersGame().initial_placement(0, 0, 0, 1, "z"))

    def test_builders_cannot_be_placed_on_an_occupied_square(self):
        for first, second in [((0, 1), (4, 4)), ((4, 4), (0, 1))]:
            with self.subTest(first=first, second=second):
                game = BuildersGame()
                game.initial_placement(0, 1, 3, 3, "x")
                self.assertFalse(game.initial_placement(*first, *second, "o"))

    def test_a_refused_placement_leaves_no_builder_behind(self):
        game = BuildersGame()
        game.initial_placement(0, 1, 3, 3, "x")
        game.initial_placement(4, 4, 0, 1, "o")
        self.assertEqual(self.square(game, 4, 4), "0.")
        self.assertTrue(game.initial_placement(4, 4, 4, 3, "o"))

    def test_both_builders_cannot_share_a_square(self):
        game = BuildersGame()
        self.assertFalse(game.initial_placement(2, 2, 2, 2, "x"))

    def test_squares_must_be_on_the_board(self):
        off_board = [(-1, 0), (5, 0), (0, -1), (0, 5)]
        for square in off_board:
            with self.subTest(square=square, builder="first"):
                self.assertFalse(BuildersGame().initial_placement(*square, 2, 2, "x"))
            with self.subTest(square=square, builder="second"):
                self.assertFalse(BuildersGame().initial_placement(2, 2, *square, "x"))

    def test_opposite_corners_are_on_the_board(self):
        self.assertTrue(BuildersGame().initial_placement(0, 0, 4, 4, "x"))
        self.assertTrue(BuildersGame().initial_placement(0, 4, 4, 0, "x"))


class TestLegalMoves(BuildersTestCase):
    def test_a_move_puts_the_builder_on_the_new_square_and_builds(self):
        game = self.new_game()
        self.assertTrue(game.make_move(2, 2, 3, 2, 3, 3))
        self.assertBoard(
            game,
            "0. 0o 0. 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0x 1. 0.",
            "0. 0. 0o 0. 0.",
        )

    def test_a_builder_may_step_in_all_eight_directions(self):
        for row_step in (-1, 0, 1):
            for col_step in (-1, 0, 1):
                if (row_step, col_step) == (0, 0):
                    continue
                with self.subTest(row_step=row_step, col_step=col_step):
                    game = self.new_game(((2, 2), (0, 0)), ((4, 4), (4, 0)))
                    to_row, to_col = 2 + row_step, 2 + col_step
                    self.assertTrue(game.make_move(2, 2, to_row, to_col, 2, 2))
                    self.assertEqual(self.square(game, to_row, to_col), "0x")

    def test_players_take_turns(self):
        game = self.new_game()
        self.assertTrue(game.make_move(2, 2, 3, 2, 3, 3))
        self.assertFalse(game.make_move(3, 2, 2, 2, 3, 2))
        self.assertTrue(game.make_move(4, 2, 4, 3, 3, 4))
        self.assertTrue(game.make_move(3, 2, 2, 2, 3, 2))

    def test_the_second_builder_can_move_too(self):
        game = self.new_game()
        self.assertTrue(game.make_move(1, 2, 1, 3, 1, 2))
        self.assertEqual(self.square(game, 1, 3), "0x")

    def test_a_refused_move_changes_nothing_and_keeps_the_turn(self):
        game = self.new_game()
        before = self.board(game)
        self.assertFalse(game.make_move(2, 2, 4, 4, 4, 3))
        self.assertEqual(self.board(game), before)
        self.assertTrue(game.make_move(2, 2, 3, 2, 3, 3))


class TestIllegalMoves(BuildersTestCase):
    def test_no_move_is_possible_before_anyone_has_placed(self):
        self.assertFalse(BuildersGame().make_move(2, 2, 3, 2, 3, 3))

    def test_no_move_is_possible_until_both_players_have_placed(self):
        game = BuildersGame()
        game.initial_placement(2, 2, 1, 2, "x")
        self.assertFalse(game.make_move(2, 2, 3, 2, 3, 3))

    def test_the_square_moved_from_must_hold_a_builder(self):
        game = self.new_game()
        self.assertFalse(game.make_move(3, 3, 3, 2, 3, 3))

    def test_a_player_cannot_move_the_opponents_builder(self):
        game = self.new_game()
        self.assertFalse(game.make_move(4, 2, 4, 3, 3, 3))

    def test_a_builder_cannot_stay_where_it_is(self):
        game = self.new_game()
        self.assertFalse(game.make_move(2, 2, 2, 2, 3, 3))

    def test_a_builder_cannot_move_two_squares(self):
        for target in [(4, 2), (2, 4), (0, 0), (4, 4)]:
            with self.subTest(target=target):
                game = self.new_game(((2, 2), (1, 2)), ((0, 4), (4, 0)))
                self.assertFalse(game.make_move(2, 2, *target, 3, 3))

    def test_a_builder_cannot_move_onto_another_builder(self):
        game = self.new_game(((2, 2), (2, 3)), ((3, 2), (4, 4)))
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 2), "own builder")
        self.assertFalse(game.make_move(2, 2, 3, 2, 2, 2), "opponent's builder")

    def test_a_builder_cannot_move_off_the_board(self):
        moves = [
            (0, 0, -1, 0, 0, 0),
            (0, 0, 0, -1, 0, 0),
            (4, 4, 5, 4, 4, 4),
            (4, 4, 4, 5, 4, 4),
        ]
        for move in moves:
            with self.subTest(move=move):
                game = self.new_game(((0, 0), (4, 4)), ((0, 4), (4, 0)))
                self.assertFalse(game.make_move(*move))

    def test_a_builder_can_move_between_corner_and_edge(self):
        game = self.new_game(((0, 0), (4, 4)), ((0, 4), (4, 0)))
        self.assertTrue(game.make_move(0, 0, 0, 1, 0, 0))
        self.assertTrue(game.make_move(0, 4, 0, 3, 0, 4))
        self.assertTrue(game.make_move(4, 4, 4, 3, 4, 4))


class TestBuilding(BuildersTestCase):
    def test_building_adds_one_level_to_the_chosen_square(self):
        game = self.new_game()
        game.make_move(2, 2, 3, 2, 3, 3)
        self.assertEqual(self.square(game, 3, 3), "1.")

    def test_a_builder_may_build_on_the_square_it_just_left(self):
        game = self.new_game()
        self.assertTrue(game.make_move(2, 2, 3, 2, 2, 2))
        self.assertEqual(self.square(game, 2, 2), "1.")

    def test_a_builder_cannot_build_on_the_square_it_moved_to(self):
        game = self.new_game()
        self.assertFalse(game.make_move(2, 2, 3, 2, 3, 2))

    def test_the_build_must_touch_the_new_square_not_the_old_one(self):
        game = self.new_game(((2, 2), (0, 0)), ((4, 4), (4, 0)))
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 1), "next to the old square only")
        self.assertFalse(game.make_move(2, 2, 2, 3, 4, 3), "two rows away")
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 5), "two columns away")

    def test_a_builder_cannot_build_on_another_builder(self):
        game = self.new_game(((2, 2), (2, 4)), ((3, 3), (4, 0)))
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 4), "own builder")
        self.assertFalse(game.make_move(2, 2, 2, 3, 3, 3), "opponent's builder")

    def test_a_builder_cannot_build_off_the_board(self):
        moves = [
            (0, 0, 0, 1, -1, 1),
            (0, 0, 1, 0, 1, -1),
            (4, 4, 4, 3, 5, 3),
            (4, 4, 3, 4, 3, 5),
        ]
        for move in moves:
            with self.subTest(move=move):
                game = self.new_game(((0, 0), (4, 4)), ((0, 4), (4, 0)))
                self.assertFalse(game.make_move(*move))


class TestTowers(BuildersTestCase):
    def build_two_towers(self, game):
        """x and o shuffle back and forth, building (1,1) and (3,1) up to level 4."""
        for _ in range(2):
            self.play(game, (0, 0, 0, 1, 1, 1), (4, 0, 4, 1, 3, 1))
            self.play(game, (0, 1, 0, 0, 1, 1), (4, 1, 4, 0, 3, 1))

    def new_game_with_towers(self):
        game = self.new_game(((0, 0), (0, 4)), ((4, 0), (4, 4)))
        self.build_two_towers(game)
        return game

    def test_a_tower_gets_a_fourth_level_and_is_then_complete(self):
        game = self.new_game_with_towers()
        self.assertEqual(self.square(game, 1, 1), "4.")
        self.assertEqual(self.square(game, 3, 1), "4.")

    def test_no_level_can_be_added_to_a_complete_tower(self):
        game = self.new_game_with_towers()
        self.assertFalse(game.make_move(0, 0, 0, 1, 1, 1))
        self.assertEqual(self.square(game, 1, 1), "4.")

    def test_no_builder_can_move_onto_a_complete_tower(self):
        game = self.new_game_with_towers()
        self.assertFalse(game.make_move(0, 0, 1, 1, 0, 0))

    def test_the_same_move_works_when_it_builds_somewhere_else(self):
        game = self.new_game_with_towers()
        self.assertTrue(game.make_move(0, 0, 0, 1, 1, 0))
        self.assertEqual(self.square(game, 1, 0), "1.")


class TestClimbing(BuildersTestCase):
    def test_a_builder_can_step_up_one_level(self):
        game = self.new_game()
        self.play(game, CLIMB_1, WEAK_1)
        self.assertTrue(game.make_move(*CLIMB_2))
        self.assertEqual(self.square(game, 3, 3), "1x")

    def test_a_builder_can_step_up_from_level_one_to_level_two(self):
        game = self.new_game()
        self.play(game, CLIMB_1, WEAK_1, CLIMB_2, WEAK_2)
        self.assertTrue(game.make_move(*CLIMB_3))
        self.assertEqual(self.square(game, 3, 4), "2x")

    def test_a_builder_cannot_climb_two_levels_at_once(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR)
        self.assertEqual(self.square(game, 3, 3), "2.")
        self.assertFalse(game.make_move(4, 2, 3, 3, 4, 2))

    def test_a_builder_can_move_to_a_square_at_its_own_level(self):
        game = self.new_game()
        self.play(game, CLIMB_1, WEAK_1, CLIMB_2, WEAK_2)
        self.assertEqual(self.square(game, 3, 3), "1x")
        self.assertEqual(self.square(game, 4, 3), "1.")
        self.assertTrue(game.make_move(3, 3, 4, 3, 3, 3))

    def test_a_builder_can_step_down_any_number_of_levels(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3)
        self.assertEqual(self.square(game, 3, 4), "2x")
        self.assertTrue(game.make_move(3, 4, 4, 4, 3, 4))
        self.assertEqual(self.square(game, 4, 4), "0x")

    def test_a_builder_always_stands_on_top_of_the_tower(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR)
        self.assertBoard(
            game,
            "0. 0o 0. 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 2. 2x",
            "0. 0. 0o 1. 0.",
        )


class TestWinning(BuildersTestCase):
    def test_a_new_game_is_unfinished(self):
        self.assertEqual(BuildersGame().get_current_state(), "UNFINISHED")

    def test_the_game_is_unfinished_while_players_place_and_move(self):
        game = self.new_game()
        self.assertEqual(game.get_current_state(), "UNFINISHED")
        self.play(game, CLIMB_1, WEAK_1)
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_building_a_third_level_does_not_win_by_itself(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3)
        self.assertEqual(self.square(game, 3, 3), "3.")
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_x_wins_by_stepping_up_onto_a_level_three_tower(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3, CLIMB_4)
        self.assertEqual(self.square(game, 3, 3), "3x")
        self.assertEqual(game.get_current_state(), "playerA_WON")

    def test_o_wins_by_stepping_up_onto_a_level_three_tower(self):
        game = self.new_game(O_START, X_START)
        self.play(game, (0, 1, 0, 0, 1, 0))  # x moves a far-away builder first
        self.play(game, *CLIMB_SO_FAR, WEAK_3, CLIMB_4)
        self.assertEqual(game.get_current_state(), "playerB_WON")

    def test_nobody_can_move_after_the_game_is_won(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3, CLIMB_4)
        before = self.board(game)
        self.assertFalse(game.make_move(4, 3, 4, 2, 4, 3), "the loser")
        self.assertFalse(game.make_move(3, 3, 3, 4, 3, 3), "the winner")
        self.assertEqual(self.board(game), before)
        self.assertEqual(game.get_current_state(), "playerA_WON")

    def test_x_wins_when_o_has_no_legal_move(self):
        game = self.new_game(((1, 2), (0, 2)), ((0, 0), (0, 1)))
        self.play(
            game,
            (1, 2, 2, 2, 1, 2),
            (0, 1, 1, 0, 1, 1),
            (2, 2, 1, 1, 1, 2),
            (1, 0, 0, 1, 1, 2),
        )
        self.assertEqual(game.get_current_state(), "UNFINISHED")
        self.assertTrue(game.make_move(1, 1, 1, 0, 1, 1))
        self.assertBoard(
            game,
            "0o 0o 0x 0. 0.",
            "0x 2. 3. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
        )
        self.assertEqual(game.get_current_state(), "playerA_WON")


# ---- Run the tests ----
loader = unittest.defaultTestLoader
cases = [
    TestPrintBoard,
    TestInitialPlacement,
    TestLegalMoves,
    TestIllegalMoves,
    TestBuilding,
    TestTowers,
    TestClimbing,
    TestWinning,
]
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in cases)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>
