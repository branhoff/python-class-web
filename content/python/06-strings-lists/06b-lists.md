---
id: lists
title: Lists
section: 6
---

## Introduction

A list is an ordered collection of objects of any type. You can have lists of floats, strings, objects made from classes you've defined, and more. You can even have lists contain other lists. You're allowed to mix the types of objects in a list, for example you can have a list that contains both integers and strings.

Most lists contain multiple values, but we can have lists of one or zero values, which can be useful. Here are a few lists for you to interact with.

:::cell id=06b-lists-demo1
```python starter
some_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
some_names = ["Groucho", "Harpo", "Chico", "Zeppo", "Karl"]
some_stuff = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
one = ["just me"]
zero = []

print(some_primes)
print(some_names)
print(some_stuff)
print(one)
print(zero)
```
:::

## Type hinting with lists

Type hinting can be used to specify the expected data type of elements in a list. For example:

```python
def get_average(numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)
```

In the example above, the `get_average` function takes a single argument, `numbers`, which is expected to be a list of float values. The `list[float]` syntax specifies that the `numbers` argument is a list whose elements are of type `float`. The function's return value is indicated to be of type `float`.

Here is how our examples look with type hinting added.

:::cell id=06b-lists-demo2
```python starter
some_primes: list[int] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
some_names: list[str] = ["Groucho", "Harpo", "Chico", "Zeppo", "Karl"]
one = ["just me"]

print(some_primes)
print(some_names)
```
:::

## Type hinting with mixed data types

To type hint a list with a mix of items, you can use the `|` operator, which lets you specify that a value can be one of several types. Here is how we would type hint the `some_stuff` variable.

:::cell id=06b-lists-demo3
```python starter
some_stuff: list[int | str | float | list[str]] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print(some_stuff)
```
:::

In this code, the `some_stuff` variable is declared as a list of items that can each be an `int`, a `str`, a `float`, or a nested `list` of `str` values, using the `|` operator.

## Type hinting with any data type

If your list can contain any type of object, you can use the type annotation `object`.

```python
some_stuff: list[object] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
```

It's important to note that using the `object` type can make it harder to catch type errors, and can also make the code less readable, since the type of the objects in the list is not specified. In general, it's recommended to use more specific types where possible.

:::cell id=06b-lists-demo4
```python starter
some_stuff: list[object] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print(some_stuff)
```
:::

## `len`

With lists, `len()` returns the number of elements in the list:

:::cell id=06b-lists-demo5
```python starter
print(len(["Mary", "had", "a", "little", "lamb"]))
```
:::

:::cell id=06b-lists-demo6
```python starter
count: list[int] = [1, 2, 3, 4, 5]
print(len(count))
```
:::

## Indexing and slicing

Indexing and slicing work the same with lists as they do with strings. Try these examples one at a time.

:::cell id=06b-lists-demo7
```python starter
some_primes: list[int] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
print(some_primes[0])
```
:::

:::cell id=06b-lists-demo8
```python starter
some_primes: list[int] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
print(some_primes[0:10:2])
```
:::

:::cell id=06b-lists-demo9
```python starter
some_names: list[str] = ["Groucho", "Harpo", "Chico", "Zeppo", "Karl"]
print(some_names[::-2])
```
:::

When you index into a nested list to get a sublist, you can then index into that list. Try the following to get the list within `some_stuff`, then the item `"Tollbooth"` within that sublist, and then its first character:

:::cell id=06b-lists-demo10
```python starter
some_stuff: list[int | str | float | list[str]] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print(some_stuff[3])
```
:::

:::cell id=06b-lists-demo11
```python starter
some_stuff: list[int | str | float | list[str]] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print(some_stuff[3][1])
```
:::

:::cell id=06b-lists-demo12
```python starter
some_stuff: list[int | str | float | list[str]] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print(some_stuff[3][1][0])
```
:::

## `in`, `not in`

Also like strings, we can use `in` and `not in`. With these two operators, the second operand can be of any iterable type, which includes both strings and lists, and the first operand can be of any type at all. Try these examples to see for yourself:

:::cell id=06b-lists-demo13
```python starter
some_primes: list[int] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
print(13 in some_primes)
```
:::

:::cell id=06b-lists-demo14
```python starter
some_primes: list[int] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
print(13 not in some_primes)
```
:::

:::cell id=06b-lists-demo15
```python starter
some_stuff: list[int | str | float | list[str]] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print("Fido" in some_stuff)
```
:::

:::cell id=06b-lists-demo16
```python starter
some_stuff: list[int | str | float | list[str]] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print("Phantom" in some_stuff)
```
:::

:::cell id=06b-lists-demo17
```python starter
some_stuff: list[int | str | float | list[str]] = [98, "Fido", -34.925, ["Phantom", "Tollbooth"]]
print("Phantom" in some_stuff[3])
```
:::

What happened with those last two examples? The string `"Phantom"` is not in `some_stuff`. It's in a list that's in `some_stuff`. That list is at index 3, so we were able to find it there.

Let's look at some more things we can do, with new list examples.

:::cell id=06b-lists-demo18
```python starter
odds: list[int] = [7, 5, 9, 1, 13, 11, 3]
evens: list[int] = [8, 4, 10, 6, 2]
palindromes: list[str] = ["hannah", "tacocat", "bob", "mom", "dad"]

print(odds)
print(evens)
print(palindromes)
```
:::

## `min` and `max`, `sort`

There are `min` and `max` functions we can use. Try these:

:::cell id=06b-lists-demo19
```python starter
odds: list[int] = [7, 5, 9, 1, 13, 11, 3]
print(min(odds))
```
:::

:::cell id=06b-lists-demo20
```python starter
palindromes: list[str] = ["hannah", "tacocat", "bob", "mom", "dad"]
print(max(palindromes))
```
:::

The `min` and `max` functions wouldn't make sense for a list like `some_stuff`, since Python doesn't know how to compare the different types in that list. There's also a `sort` method we can use.

:::cell id=06b-lists-demo21
```python starter
evens: list[int] = [8, 4, 10, 6, 2]
evens.sort()
```
:::

:::cell id=06b-lists-demo22
```python starter
palindromes: list[str] = ["hannah", "tacocat", "bob", "mom", "dad"]
palindromes.sort()
```
:::

You'll notice that nothing prints out when you try those. But now look at the lists again:

:::cell id=06b-lists-demo23
```python starter
evens: list[int] = [8, 4, 10, 6, 2]
evens.sort()
print(evens)
```
:::

:::cell id=06b-lists-demo24
```python starter
palindromes: list[str] = ["hannah", "tacocat", "bob", "mom", "dad"]
palindromes.sort()
print(palindromes)
```
:::

The `sort` method works "in place" and directly edits the list. Sorting also wouldn't make sense for `some_stuff`, again because Python doesn't know how to compare the different types in that list. Try it and see!

:::cell id=06b-lists-demo25
```python starter
# Experiment here
```
:::

## Concatenation

We can concatenate lists with the `+` operator.

:::cell id=06b-lists-demo26
```python starter
odds: list[int] = [7, 5, 9, 1, 13, 11, 3]
evens: list[int] = [8, 4, 10, 6, 2]
print(evens + odds)
```
:::

Here's one more list example for us to practice on.

:::cell id=06b-lists-demo27
```python starter
fun_floats: list[float] = [3.141, 2.718, 6.283, 1.618, 1.414, 2.502, 0.577, 1.303, 2.685, 1.282]
print(fun_floats)
```
:::

## Iterating through a List

Lists are iterable, so we can use a `for` loop to access each element. For example, try this loop:

:::cell id=06b-lists-demo28
```python starter
fun_floats: list[float] = [3.141, 2.718, 6.283, 1.618, 1.414, 2.502, 0.577, 1.303, 2.685, 1.282]
number: float
for number in fun_floats:
    print(number)
```
:::

The following loop prints out a running total of the values in the list:

:::cell id=06b-lists-demo29
```python starter
fun_floats: list[float] = [3.141, 2.718, 6.283, 1.618, 1.414, 2.502, 0.577, 1.303, 2.685, 1.282]
total: float = 0
number: float
for number in fun_floats:
    total += number
    print(total)
```
:::

## Lists of objects

Let's reintroduce the `BankAccount` class we defined in an earlier section:

:::cell id=06b-lists-demo30
```python starter
class BankAccount:
    """Represents a bank account for deposits and withdrawals."""

    def __init__(self, account_ID: str, balance: float):
        self._account_ID: str = account_ID
        self._balance: float = balance

    def get_account_ID(self) -> str:
        return self._account_ID

    def set_account_ID(self, new_ID) -> None:
        self._account_ID = new_ID

    def get_balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        self._balance -= amount
```
:::

We can make a list of `BankAccount` objects like this:

:::cell id=06b-lists-demo31
```python starter
class BankAccount:
    """Represents a bank account for deposits and withdrawals."""

    def __init__(self, account_ID: str, balance: float):
        self._account_ID: str = account_ID
        self._balance: float = balance

    def get_account_ID(self) -> str:
        return self._account_ID

    def set_account_ID(self, new_ID) -> None:
        self._account_ID = new_ID

    def get_balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        self._balance -= amount

account_1: BankAccount = BankAccount("235349", 730.29)
account_2: BankAccount = BankAccount("783848", 240.89)
account_3: BankAccount = BankAccount("732005", 1390.20)
account_list: list[BankAccount] = [account_1, account_2, account_3]
```
:::

What if we want to access the balance of the first account in the list? We can do that like this:

:::cell id=06b-lists-demo32
```python starter
class BankAccount:
    """Represents a bank account for deposits and withdrawals."""

    def __init__(self, account_ID: str, balance: float):
        self._account_ID: str = account_ID
        self._balance: float = balance

    def get_account_ID(self) -> str:
        return self._account_ID

    def set_account_ID(self, new_ID) -> None:
        self._account_ID = new_ID

    def get_balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        self._balance -= amount

account_1: BankAccount = BankAccount("235349", 730.29)
account_2: BankAccount = BankAccount("783848", 240.89)
account_3: BankAccount = BankAccount("732005", 1390.20)
account_list: list[BankAccount] = [account_1, account_2, account_3]
print(account_list[0].get_balance())
```
:::

Here `account_list[0]` gives us a `BankAccount` object, and `.get_balance()` returns the balance of that object.

## List Comprehensions

List comprehensions are a concise way to construct a new list by applying some transformation to an existing list. Python has other types that can be iterated over the same way. We have a name for things that can be iterated over: "iterables". For example, the following code creates a new list whose elements are double the elements in `fun_floats` (defined earlier):

:::cell id=06b-lists-demo33
```python starter
fun_floats: list[float] = [3.141, 2.718, 6.283, 1.618, 1.414, 2.502, 0.577, 1.303, 2.685, 1.282]
fun_floats_doubled: list[float] = [2 * n for n in fun_floats]
print(fun_floats_doubled)
```
:::

Here's a similar example that works from a range instead of a list:

:::cell id=06b-lists-demo34
```python starter
print([2 * x for x in range(1, 11)])
```
:::

We can optionally filter out certain values from the original list (or other iterable).

:::cell id=06b-lists-demo35
```python starter
print([2 * x for x in range(1, 11) if x % 2 == 1])
```
:::

In this example, the original iterable was a range. If a value in that range is odd (the remainder of dividing by 2 is 1), then we apply the transformation (multiplying by 2). Note that values are filtered out **before** the transformation is applied. If we had doubled the numbers and then filtered out the even ones, then the new list would have been empty.

We can also use a list comprehension to filter without applying a transformation:

:::cell id=06b-lists-demo36
```python starter
nums: list[int] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print([x for x in nums if x % 3 == 0])
```
:::

Don't let this new use of the `for` and `if` keywords confuse you. List comprehensions are a related concept to for loops and if statements, but a different flavor. The best thing you can do to learn how list comprehensions will be another powerful tool in your toolbelt is to try a few exercises.

## Exercises

:::cell id=06b-lists-ex1 kind=exercise
1. Write a function named `every_other` that takes a list as a parameter and returns a list that only contains every other element starting with the first one. For example, if the original list is `[7, "joe", "apple", 9.81, False]`, then the new list should be `[7, "apple", False]`. Use slicing.

```python starter
# Type code here
```

```python tests
assert every_other([7, "joe", "apple", 9.81, False]) == [7, "apple", False], "Should keep every other element starting with the first."
assert every_other([1, 2, 3, 4]) == [1, 3], "every_other([1, 2, 3, 4]) should be [1, 3]."
assert every_other([]) == [], "An empty list gives an empty list."
assert every_other(["a"]) == ["a"], "A single-element list is unchanged."
```

```python solution
def every_other(mixed_list: list[object]) -> list[object]:
    return mixed_list[::2]

print(every_other([7, "joe", "apple", 9.81, False]))
```
:::

:::cell id=06b-lists-ex2 kind=exercise
2. Write a function named `array_sum` that takes a list of strings as a parameter and returns the total number of characters in all the strings.

```python starter
# Type code here
```

```python tests
assert array_sum(["Mary", "had", "a", "little", "lamb"]) == 18, "Total characters should be 18."
assert array_sum([]) == 0, "No strings means zero characters."
assert array_sum(["", ""]) == 0, "Empty strings add no characters."
assert array_sum(["abc"]) == 3, "abc has 3 characters."
```

```python solution
def array_sum(word_list: list[str]) -> int:
    count: int = 0
    for word in word_list:
        count += len(word)
    return count

print(array_sum(["Mary", "had", "a", "little", "lamb"]))
```
:::

:::cell id=06b-lists-ex3 kind=exercise
3. Write a function named `rev_string_list` that takes a list of strings as a parameter and returns a list that contains the reverse of each of those strings. **Use a list comprehension.**

```python starter
# Type code here
```

```python tests
assert rev_string_list(["abc", "hello"]) == ["cba", "olleh"], "Each string should be reversed."
assert rev_string_list([]) == [], "An empty list gives an empty list."
assert rev_string_list(["racecar"]) == ["racecar"], "A palindrome reversed is itself."
```

```python solution
def rev_string_list(string_list: list[str]) -> list[str]:
    return [s[::-1] for s in string_list]

print(rev_string_list(["abc", "hello"]))
```
:::

:::cell id=06b-lists-ex4 kind=exercise
4. Write a function named `contain_string` that takes a list of strings and a target string as parameters, and returns a list of the strings from the original list that contain the target string. Use a list comprehension. As an example, if the function call is `contain_string(["cats", "tacks", "scat", "stack"], "cat")`, then the return value should be `["cats", "scat"]`, because `"cats"` and `"scat"` both contain `"cat"`.

```python starter
# Type code here
```

```python tests
assert contain_string(["cats", "tacks", "scat", "stack"], "cat") == ["cats", "scat"], "Only cats and scat contain cat."
assert contain_string(["apple", "grape"], "ap") == ["apple", "grape"], "Both contain ap."
assert contain_string(["x", "y"], "z") == [], "None contain z."
```

```python solution
def contain_string(string_list: list[str], target_string: str) -> list[str]:
    return [s for s in string_list if target_string in s]

print(contain_string(["cats", "tacks", "scat", "stack"], "cat"))
```
:::

## Projects

Build these in VS Code, in your project folder. Click a project name to open it.

<details id="project-find-median">
<summary>Project: Find the median</summary>

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
</details>

<details id="project-add-surname">
<summary>Project: Add a surname</summary>

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
</details>

<details id="project-std-dev-of-ages">
<summary>Project: Standard deviation of ages</summary>

Write a class called `Person` with two **private** data members: the person's
name and age. Its `__init__` method takes the two values and stores them. It also
has a `get_age` method.

Then write a separate function, outside the class, called `std_dev`. It takes a
list of `Person` objects and returns the standard deviation of their ages. Use the population standard
deviation: find the mean age, average the squared gaps from the mean over all the
people, then take the square root.

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
</details>
