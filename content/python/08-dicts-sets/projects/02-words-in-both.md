---
id: words-in-both
title: Words in both
section: 8
after: sets
---

Write a function called `words_in_both` that takes two strings and returns a set
of the words that appear in both. You can assume every character is a letter or
a space. Capitalization does not matter, so "to" and "To" are the same word. The
words in the result set should be lower-case. For example, if one string has
"on" and the other has "ON", the set should contain "on".

Python's `split()` method helps here:

```python
sentence = 'Not the comfy chair!'
print(sentence.split())  # ['Not', 'the', 'comfy', 'chair!']
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
