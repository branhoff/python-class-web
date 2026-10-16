---
id: lists
title: Lists
section: 6
---

## Introduction

A list is an ordered collection of objects of any type. You can have lists of floats, strings, objects made from classes you've defined, and more. You can even have lists contain other lists. You're allowed to mix the types of objects in a list, for example you can have a list that contains both integers and strings.

Most lists contain multiple values, but we can have lists of one or zero values, which can be useful. Run this cell to see a few lists.

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

Also like strings, we can use `in` and `not in`. With these two operators, the second operand can be a string or a list, and the first operand can be any value. Try these examples to see for yourself:

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

The `sort` method works "in place": it changes the original list. Sorting also wouldn't make sense for `some_stuff`, again because Python doesn't know how to compare the different types in that list. Try it and see!

:::cell id=06b-lists-demo25
```python starter
# Experiment here
```
:::

:::cell id=predict-sort-result kind=exercise
**Check your understanding.** Predict the result. Look at what `sort` gives back.

```python
nums = [3, 1, 2]
result = nums.sort()
```

Set `final_nums` and `final_result` to the values the program ends with.

```python starter
final_nums = None
final_result = None
```

```python tests
program = """
nums = [3, 1, 2]
result = nums.sort()
"""
real = {}
exec(program, real)
assert final_nums == real["nums"], "final_nums is not right. What does `sort` do to the list it is called on?"
assert final_result == real["result"], "final_result is not right. What does a method that changes a list in place give back?"
```

```python solution
final_nums = [1, 2, 3]
final_result = None
```

```hint
`sort` rearranges the list itself and gives back `None`, so `result` is `None`.
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

:::cell id=predict-concatenation-copy kind=exercise
**Check your understanding.** Predict the result. One of these changes a list and one makes a new one.

```python
a = [1, 2]
b = a + [3]
a[0] = 9
```

Set `final_a` and `final_b` to the values the program ends with.

```python starter
final_a = None
final_b = None
```

```python tests
program = """
a = [1, 2]
b = a + [3]
a[0] = 9
"""
real = {}
exec(program, real)
assert final_a == real["a"], "final_a is not right. Which line changes the list that `a` refers to?"
assert final_b == real["b"], "final_b is not right. `a + [3]` builds a new list before `a[0] = 9` runs."
```

```python solution
final_a = [9, 2]
final_b = [1, 2, 3]
```

```hint
`a + [3]` makes a new list, so `b` is not affected when `a[0] = 9` changes the first item of `a`.
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

List comprehensions are a concise way to construct a new list by applying some transformation to an existing list. Anything you can loop over, such as a list or a range, is called an **iterable**. For example, the following code creates a new list whose elements are double the elements in `fun_floats` (defined earlier):

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

Don't let this new use of the `for` and `if` keywords confuse you. List comprehensions are a related concept to for loops and if statements, but a different flavor. The best way to get comfortable with list comprehensions is to try the exercises.

## Exercises

:::cell id=06b-lists-ex1 kind=exercise
1. Write a function named `every_other` that takes a list as a parameter and returns a list that contains only every other element starting with the first one. For example, if the original list is `[7, "joe", "apple", 9.81, False]`, then the new list should be `[7, "apple", False]`. Use slicing.

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
