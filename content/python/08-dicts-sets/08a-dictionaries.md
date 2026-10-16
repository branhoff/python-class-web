---
id: dictionaries
title: Dictionaries
section: 8
---

## Dictionary Data Types

Python has a built-in data type called a dictionary. A dictionary stores key-value pairs. For example:

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

The first column has the keys and the second column has their associated values (the extra spaces that align the columns and colons only make it easier to read, and are not required). Each key can only have one value, but the same value can be used for multiple keys. Dictionaries, like lists, are **mutable** (you can change them after you create them). Unlike lists, though, you cannot look up an element by its position. You still use square brackets, but you put the key inside them, and you get back that key's value.

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

:::cell id=predict-dict-update-add kind=check
**Check your understanding.** Predict the result. Notice which assignment changes a value and which adds a pair.

```python
stock = {"apple": 4, "pear": 2}
stock["apple"] = 9
stock["plum"] = 1
size = len(stock)
apples = stock["apple"]
```

Predict what each variable holds after the program finishes. The program is not run for you. Change the values below to your predictions:

- `final_size` is the value of `size` at the end
- `final_apples` is the value of `apples` at the end

```python starter
final_size = None
final_apples = None
```

```python tests
program = """
stock = {"apple": 4, "pear": 2}
stock["apple"] = 9
stock["plum"] = 1
size = len(stock)
apples = stock["apple"]
"""
real = {}
exec(program, real)
assert final_size == real["size"], "final_size is not right. Does assigning to an existing key add a pair?"
assert final_apples == real["apples"], "final_apples is not right. Check what happened to the old value."
```

```python solution
final_size = 3
final_apples = 9
```

```hint
Assigning to a key that already exists replaces its value. Assigning to a new key adds a pair.
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

Printing a dictionary shows all of its key-value pairs:

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

A type hint states the type a variable is expected to hold. You can add one to a dictionary. For `state_capitals`, it looks like this:

```python
state_capitals: dict[str, str] = {
    "Washington" : "Olympia",
    "Oregon"     : "Salem",
    "Idaho"      : "Boise",
    "Montana"    : "Helena"
}
```

The `state_capitals` variable is declared as a `dict[str, str]`, meaning a dictionary with keys of type `str` and values of type `str`.

The keys in a dictionary must be immutable (unchangeable, like strings and numbers), but the values can be of any type. The keys do not all have to be the same type. You can even nest dictionaries. Here's a dictionary with some string values and an integer value. To allow more than one type, use the `|` operator in the hint.

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

A `for` loop goes through a dictionary's keys:

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

A loop returns the keys in the order they were added.

:::cell id=predict-dict-loop kind=check
**Check your understanding.** Predict the result. Look at what the loop variable holds on each pass.

```python
prices = {"tea": 3, "milk": 2}
joined = ""
for item in prices:
    joined = joined + item
count = len(prices)
```

Predict what each variable holds after the program finishes. The program is not run for you. Change the values below to your predictions, and write strings with quotes:

- `final_joined` is the value of `joined` at the end
- `final_count` is the value of `count` at the end

```python starter
final_joined = None
final_count = None
```

```python tests
program = """
prices = {"tea": 3, "milk": 2}
joined = ""
for item in prices:
    joined = joined + item
count = len(prices)
"""
real = {}
exec(program, real)
assert final_joined == real["joined"], "final_joined is not right. Check what a for loop hands you from a dictionary."
assert final_count == real["count"], "final_count is not right. Count the key-value pairs."
```

```python solution
final_joined = "teamilk"
final_count = 2
```

```hint
A for loop over a dictionary gives you one thing per pass. Is it a key or a value?
```
:::

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

As with lists, there are other operators, functions, and methods for working with dictionaries.

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
2. Using the dictionary from #1, write a loop that prints both the key and value of each key-value pair. For example the first iteration of the loop should print `one uno`.

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
