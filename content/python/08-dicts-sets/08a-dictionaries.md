---
id: dictionaries
title: Dictionaries
section: 8
---

## Dictionary Data Types

Another data type that's built-in to Python is called a dictionary. A dictionary is a way of storing key-value pairs. For example:

:::cell id=dictionaries-demo1
```python starter
state_capitals = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
```
:::

The first column has the keys and the second column has their associated values (the extra spaces that align the columns and colons are just for ease of reading, they are not required). Each key can only have one value, but the same value can be used for multiple keys. Dictionaries, like lists, are **mutable**. However, unlike lists, you cannot index into a dictionary by the position of an element. You still use the square bracket notation, but instead of a positional index, you give the key that you want the associated value of.

:::cell id=dictionaries-demo2
```python starter
state_capitals = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
print(state_capitals["Idaho"])
```
:::

:::cell id=dictionaries-demo3
```python starter
state_capitals = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
print(state_capitals["Washington"])
```
:::

It's easy to add a new key-value pair:

:::cell id=dictionaries-demo4
```python starter
state_capitals = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
state_capitals["Florida"] = "Orlando"
print(state_capitals["Florida"])
```
:::

Or to change an existing key-value pair:

:::cell id=dictionaries-demo5
```python starter
state_capitals = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
state_capitals["Florida"] = "Orlando"
state_capitals["Florida"] = "Tallahassee"
print(state_capitals["Florida"])
```
:::

You can delete an entry using `del`:

:::cell id=dictionaries-demo6
```python starter
state_capitals = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
state_capitals["Florida"] = "Tallahassee"
del state_capitals["Florida"]
print(state_capitals)
```
:::

If you print a dictionary, it will list all of its key-value pairs:

:::cell id=dictionaries-demo7
```python starter
state_capitals = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
print(state_capitals)
```
:::

## Type hinting with dictionaries

Type hinting in Python can be used to specify the expected types of variables, including dictionaries. In the case of the `state_capitals` dictionary, you can add type hinting as follows:

```python
state_capitals: dict[str, str] = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
```

The `state_capitals` variable is declared as a `dict[str, str]`, indicating that it is a dictionary with keys of type `str` and values of type `str`.

The keys in a dictionary must be immutable, but the associated values can be of any type. The keys are not required to all be the same type. You can even nest dictionaries. Here's an example of a dictionary with some string values and an integer value. For mixing expected types, we can use the `|` operator.

:::cell id=dictionaries-demo8
```python starter
capybara: dict[str, str | int] = {
    "scientific name"   : "Hydrochoerus hydrochaeris",
    "lifespan in years" : 10,
    "classification"    : "rodent",
    "size"              : "unusual"
}
```
:::

You can declare an empty dictionary like so:

:::cell id=dictionaries-demo9
```python starter
empty_dict = {}
```
:::

You can use `in` and `not in` to test whether a key is in a dictionary:

:::cell id=dictionaries-demo10
```python starter
capybara: dict[str, str | int] = {
    "scientific name"   : "Hydrochoerus hydrochaeris",
    "lifespan in years" : 10,
    "classification"    : "rodent",
    "size"              : "unusual"
}
print("classification" in capybara)
print("genus" in capybara)
```
:::

You can use `len` to get the number of key-value pairs in a dictionary:

:::cell id=dictionaries-demo11
```python starter
capybara: dict[str, str | int] = {
    "scientific name"   : "Hydrochoerus hydrochaeris",
    "lifespan in years" : 10,
    "classification"    : "rodent",
    "size"              : "unusual"
}
print(len(capybara))
```
:::

You can use a for loop to iterate through a dictionary.

:::cell id=dictionaries-demo12
```python starter
capybara: dict[str, str | int] = {
    "scientific name"   : "Hydrochoerus hydrochaeris",
    "lifespan in years" : 10,
    "classification"    : "rodent",
    "size"              : "unusual"
}
attribute: str
for attribute in capybara:
    print(attribute)
```
:::

When you iterate through a dictionary, Python by default guarantees to return keys in the same order they were created.

The `clear` method makes a dictionary empty:

:::cell id=dictionaries-demo13
```python starter
capybara: dict[str, str | int] = {
    "scientific name"   : "Hydrochoerus hydrochaeris",
    "lifespan in years" : 10,
    "classification"    : "rodent",
    "size"              : "unusual"
}
capybara.clear()
print(len(capybara))
```
:::

As with lists, there are other operators, functions and methods available for working with dictionaries.

## Exercises

:::cell id=dictionaries-ex1 kind=exercise
1. Make a dictionary called `eng_to_span` where the keys are the English words `"one"` through `"ten"`, and the corresponding values are their Spanish translations.

```python starter
# Type code here
```

```python tests
expected = {
    "one": "uno",
    "two": "dos",
    "three": "tres",
    "four": "cuatro",
    "five": "cinco",
    "six": "seis",
    "seven": "siete",
    "eight": "ocho",
    "nine": "nueve",
    "ten": "diez",
}
assert "eng_to_span" in dir(), "Define a dictionary named eng_to_span."
assert isinstance(eng_to_span, dict), "eng_to_span should be a dictionary."
assert eng_to_span == expected, (
    "eng_to_span should map the English words one through ten to their "
    f"Spanish translations, but it was {eng_to_span!r}."
)
```

```python solution
eng_to_span: dict[str, str] = {
    "one": "uno",
    "two": "dos",
    "three": "tres",
    "four": "cuatro",
    "five": "cinco",
    "six": "seis",
    "seven": "siete",
    "eight": "ocho",
    "nine": "nueve",
    "ten": "diez",
}
```
:::

:::cell id=dictionaries-ex2 kind=exercise
2. Using the dictionary from #1, write a loop that prints out both the key and value of each key-value pair. For example the first iteration of the loop should print `one uno`.

```python starter
# Type code here
```

```python tests
pairs = [
    ("one", "uno"),
    ("two", "dos"),
    ("three", "tres"),
    ("four", "cuatro"),
    ("five", "cinco"),
    ("six", "seis"),
    ("seven", "siete"),
    ("eight", "ocho"),
    ("nine", "nueve"),
    ("ten", "diez"),
]
lines = [line.strip() for line in stdout.strip().splitlines() if line.strip()]
assert len(lines) == len(pairs), (
    f"Expected one printed line per pair ({len(pairs)} lines), "
    f"but got {len(lines)}."
)
for (key, value), line in zip(pairs, lines):
    assert key in line and value in line, (
        f"Each line should print the key and its value, "
        f"but a line was {line!r} (expected {key!r} and {value!r})."
    )
```

```python solution
eng_to_span: dict[str, str] = {
    "one": "uno",
    "two": "dos",
    "three": "tres",
    "four": "cuatro",
    "five": "cinco",
    "six": "seis",
    "seven": "siete",
    "eight": "ocho",
    "nine": "nueve",
    "ten": "diez",
}

word: str
for word in eng_to_span:
    print(word, eng_to_span[word])
```
:::

:::cell id=dictionaries-ex3 kind=exercise
3. Write a function named `some_squares` that takes a positive integer parameter and returns a dictionary where the keys are the integers from `1` through the value of the parameter, and the corresponding values are the squares of those integers. For example, if it's passed `3`, then the dictionary should contain the following key-value pairs: `{1: 1, 2: 4, 3: 9}`.

```python starter
# Type code here
```

```python tests
assert "some_squares" in dir(), "Define a function named some_squares."
assert some_squares(3) == {1: 1, 2: 4, 3: 9}, (
    f"some_squares(3) should return {{1: 1, 2: 4, 3: 9}}, "
    f"but it returned {some_squares(3)!r}."
)
assert some_squares(1) == {1: 1}, (
    f"some_squares(1) should return {{1: 1}}, but it returned {some_squares(1)!r}."
)
assert some_squares(5) == {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}, (
    "some_squares(5) should map each integer 1 through 5 to its square."
)
```

```python solution
def some_squares(n: int) -> dict[int, int]:
    d: dict[int, int] = {}
    i: int
    for i in range(1, n + 1):
        d[i] = i * i
    return d
```
:::

## Projects

Build this in VS Code, in your project folder. Click the project name to open it.

<details id="project-count-letters">
<summary>Project: Count the letters</summary>

Write a function called `count_letters` that takes a string and returns a
dictionary showing how many times each letter appears in it. The string can
contain characters that are not letters, and it can be empty. Count only
letters, and count upper-case and lower-case as the same letter. The keys of the
dictionary should be upper-case letters.

For example, given this string:

```python
"AaBb"
```

the dictionary should hold these pairs:

```python
{'A': 2, 'B': 2}
```

We have not covered the built-in `isalpha()`, so do not use it.

Save the file as `count_letters.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-count-letters
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
def count_letters(text: str) -> dict:
    """Count each letter in `text`, ignoring case. Keys are upper-case."""
    counts: dict = {}
    for character in text:
        letter: str = character.upper()
        if "A" <= letter <= "Z":
            if letter in counts:
                counts[letter] += 1
            else:
                counts[letter] = 1
    return counts


# ---- Tests ----
import sys
import unittest


class TestCountLetters(unittest.TestCase):
    def test_the_example_from_the_project(self):
        self.assertEqual(count_letters("AaBb"), {"A": 2, "B": 2})

    def test_an_empty_string_gives_an_empty_dictionary(self):
        self.assertEqual(count_letters(""), {})

    def test_a_single_letter_is_counted_once(self):
        self.assertEqual(count_letters("q"), {"Q": 1})

    def test_repeated_letters_are_added_up(self):
        self.assertEqual(count_letters("banana"), {"B": 1, "A": 3, "N": 2})

    def test_upper_and_lower_case_count_as_the_same_letter(self):
        self.assertEqual(count_letters("aAaA"), {"A": 4})

    def test_the_keys_are_upper_case(self):
        self.assertEqual(list(count_letters("xyz")), ["X", "Y", "Z"])

    def test_digits_spaces_and_punctuation_are_ignored(self):
        self.assertEqual(count_letters("123 !?-_"), {})

    def test_letters_mixed_with_other_characters(self):
        expected = {"H": 1, "E": 1, "L": 3, "O": 2, "W": 1, "R": 1, "D": 1}
        self.assertEqual(count_letters("Hello, World!"), expected)

    def test_the_first_and_last_letters_of_the_alphabet_are_counted(self):
        self.assertEqual(count_letters("azAZ"), {"A": 2, "Z": 2})

    def test_characters_just_outside_the_alphabet_are_ignored(self):
        # "@" and "[" sit next to "A" and "Z" in the character table.
        # "`" and "{" sit next to "a" and "z".
        self.assertEqual(count_letters("@[`{"), {})

    def test_accented_letters_are_not_counted(self):
        self.assertEqual(count_letters("éa"), {"A": 1})


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in [TestCountLetters])
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
</details>
