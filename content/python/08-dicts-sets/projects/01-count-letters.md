---
id: count-letters
title: Count the letters
section: 8
after: dictionaries
---

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
