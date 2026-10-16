---
id: strings
title: String Manipulation
section: 6
---

## `in`, `not in`

There are operators called `in` and `not in` that can be used to check whether a string contains another string. For example:

:::cell id=06a-strings-demo1
```python starter
print("ow" in "chowder")
print("ow" not in "chowder")

animal: str = "anteater"
print("ant" in animal)
bug: str = "aphid"
print(bug in animal)
```
:::

## `len`

There is a function called `len` that returns the length of a string:

:::cell id=06a-strings-demo2
```python starter
print(len("hokey pokey"))
```
:::

:::cell id=06a-strings-demo3
```python starter
city: str = "Charleston"
print(len(city))
```
:::

## `upper` and `lower`

You can use the functions `upper` and `lower` to get an upper-case or lower-case version of a string.

:::cell id=06a-strings-demo4
```python starter
print("what?".upper())
```
:::

:::cell id=06a-strings-demo5
```python starter
var: str = "FACEBOOK"
print(var.lower())
```
:::

## Operators vs. Functions vs. Methods

Notice the different syntax we've used for `in` and `not in`, `len`, and `upper` and `lower`. The `in` and `not in` operators are used between two values (the operands) in a format similar to arithmetic operators, like `*` and `/`. These arithmetic operators each have two numeric operands. However in the examples for `in` and `not in`, we used strings for both operands.

The `len` **function** is called in the same way we've called other functions. We first give the name of the function, and then list inside parentheses any values we're passing to the function. In this case we're passing a string to the function.

The `upper` and `lower` **methods** are called using the dot notation syntax that we use with objects. That's because strings (like everything else in Python) are objects that have certain methods defined for them. In this case, we don't have to pass the string as an argument. You can think of it as politely asking the string if it would be so kind as to give you an upper-case (or lower-case) version of itself. (The string is implicitly passed to the method as the `self` argument.)

## Indexing

We can get the character at a certain position, or **index**, in a string by indexing into the string. Imagine numbering the letters of a string in order, **starting with zero**. So in the string `"onyx"`, the `"o"` is at index zero, the `"n"` is at index 1, the `"y"` is at index 2, and the `"x"` is at index 3. **Notice that the index of the last character is the length of the string minus 1.** We index into a string by following it with square brackets containing the index that we want to access.

:::cell id=06a-strings-demo6
```python starter
gem: str = "onyx"
print(gem[2])
print(gem[0])
print(gem[len(gem) - 1])
```
:::

We can also use negative indices, in which case we count from the back of the string. The character at index -1 would be the last character in the string, the one at -2 would be the next-to-last character, and so on.

:::cell id=06a-strings-demo7
```python starter
dino: str = "velociraptor"
print(dino[-1])
print(dino[-12])
```
:::

:::cell id=predict-negative-index kind=exercise
**Check your understanding.** Predict the result. Count from the back of the string.

```python
word = "bookshelf"
x = word[-3]
y = len(word)
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
word = "bookshelf"
x = word[-3]
y = len(word)
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Check which letter sits at that negative index."
assert final_y == real["y"], "final_y is not right. Check how many letters there are."
```

```python solution
final_x = "e"
final_y = 9
```

```hint
Negative indices start at -1 for the last character. len counts every character.
```
:::

## Slicing

Slicing a string gives you back part of that string, based on the indices for the start and end of the part you want.

:::cell id=06a-strings-demo8
```python starter
fruit: str = "strawberry"
print(fruit[2:5])
```
:::

Notice that the substring you get back starts at the first index, and goes up to, **but does not include** the second index (similar to making a range). If you omit the first index, the substring starts at the first character. If you omit the second index, the substring ends at the last character.

:::cell id=06a-strings-demo9
```python starter
hero: str = "spiderman"
print(hero[:6])
print(hero[6:])
```
:::

The character at index 6 (the seventh character) doesn't get included in the first slice, but does in the second slice. We can also add a third number after a second colon, the "stride". A stride of 2 gives every other character, a stride of 3 gives every third character, and so on. A stride of -1 walks the string backward.

:::cell id=06a-strings-demo10
```python starter
poem: str = "mary had a little lamb"
print(poem[::-1])
```
:::

:::cell id=predict-stride-slices kind=exercise
**Check your understanding.** Predict the result. Look at where each slice starts and which way it moves.

```python
text = "abcdefgh"
x = text[1:6:2]
y = text[::-2]
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
text = "abcdefgh"
x = text[1:6:2]
y = text[::-2]
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Remember the end index is not included."
assert final_y == real["y"], "final_y is not right. A negative stride starts at the end."
```

```python solution
final_x = "bdf"
final_y = "hfdb"
```

```hint
The stride is the step between characters. A negative stride walks backward from the last character.
```
:::

## Comparison Operators

We can use the normal comparison operators with strings, where `A < B` is true when A comes before B in lexicographic (dictionary) order.

:::cell id=06a-strings-demo11
```python starter
print("zebra" < "aardvark")
```
:::

:::cell id=06a-strings-demo12
```python starter
print("zebra" > "aardvark")
```
:::

:::cell id=06a-strings-demo13
```python starter
word: str = "catharsis"
print("cat" == word[:3])
```
:::

However, there is a catch. Characters are stored as numbers, and upper-case letters have lower numbers than lower-case letters, so Python puts every upper-case letter before every lower-case letter.

:::cell id=06a-strings-demo14
```python starter
print("Zebra" < "aardvark")
```
:::

One way to handle this is to convert the strings to upper-case (or lower-case) before comparing them.

:::cell id=06a-strings-demo15
```python starter
print("Zebra".upper() > "aardvark".upper())
```
:::

## Exercises

:::cell id=06a-strings-ex1 kind=exercise
1. Write a function called `last_char` that takes a string parameter and returns the last letter of that string.

```python starter
# Type code here
```

```python tests
assert last_char("hello") == "o", "last_char('hello') should return 'o'."
assert last_char("x") == "x", "last_char('x') should return 'x'."
assert last_char("Python") == "n", "last_char('Python') should return 'n'."
```

```python solution
def last_char(s: str) -> str:
    return s[-1]

print(last_char("hello"))
```
:::

:::cell id=06a-strings-ex2 kind=exercise
2. Write a function called `midstring` that takes a string parameter and returns a copy of that string minus its first and last letters. If the string passed in has only 1 or 2 letters, the function should return the empty string `""`.

```python starter
# Type code here
```

```python tests
assert midstring("hello") == "ell", "midstring('hello') should return 'ell'."
assert midstring("abc") == "b", "midstring('abc') should return 'b'."
assert midstring("ab") == "", "A 2-letter string should give the empty string."
assert midstring("a") == "", "A 1-letter string should give the empty string."
assert midstring("") == "", "The empty string should give the empty string."
```

```python solution
def midstring(s: str) -> str:
    return s[1:-1]

print(midstring("hello"))
```
:::

:::cell id=06a-strings-ex3 kind=exercise
3. Write a function called `sort_two_strings` that takes two string parameters and returns a single string of both of them in dictionary order, ignoring case. For example, if the strings `"aardvark"` and `"Zebra"` are passed, it should return `"aardvark Zebra"`.

```python starter
# Type code here
```

```python tests
assert sort_two_strings("aardvark", "Zebra") == "aardvark Zebra", "Should ignore case and put aardvark first."
assert sort_two_strings("Zebra", "aardvark") == "aardvark Zebra", "Order of arguments should not matter."
assert sort_two_strings("apple", "banana") == "apple banana", "apple comes before banana."
```

```python solution
def sort_two_strings(s1: str, s2: str) -> str:
    if s1.lower() < s2.lower():
        return s1 + " " + s2
    return s2 + " " + s1

print(sort_two_strings("aardvark", "Zebra"))
```
:::

:::cell id=06a-strings-ex4 kind=exercise
4. A palindrome is a string that reads the same forward or backward. Write a function called `is_palindrome` that takes a string parameter and returns `True` if that string is a palindrome and `False` otherwise.

```python starter
# Type code here
```

```python tests
assert is_palindrome("racecar") is True, "racecar is a palindrome."
assert is_palindrome("hello") is False, "hello is not a palindrome."
assert is_palindrome("tacocat") is True, "tacocat is a palindrome."
assert is_palindrome("") is True, "The empty string is a palindrome."
```

```python solution
def is_palindrome(s: str) -> bool:
    return s[::-1] == s

print(is_palindrome("racecar"))
```
:::
