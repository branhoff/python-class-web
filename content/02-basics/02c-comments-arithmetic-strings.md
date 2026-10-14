---
id: comments-arithmetic-strings
title: Comments, Arithmetic, and String Concatenation
section: 2
---

## Comments

Comments are notes for those reading the code, and are ignored by the Python
interpreter. A comment begins with `#`. A comment can be either on its own line
or on the same line as other code. Either way, the interpreter ignores
everything between the `#` and the end of the line.

:::cell id=comments-arithmetic-strings-demo1
```python starter
# this is a comment
height: float = 1.8 # this is also a comment
```
:::

You should write comments that explain non-obvious aspects of your code, such as
the purpose of a particular section, the units for the value of some variable,
the reason for a certain design choice, and so on. You certainly do not need to
comment every line, but keep in mind that how your code works may not be obvious
to other people, or even to yourself in a few months.

## Arithmetic

Addition, subtraction, multiplication and division are done with the `+`, `-`,
`*`, and `/` symbols.

The floor division operation is done with the `//` symbol, and gives you the
rounded down result of division.

:::cell id=comments-arithmetic-strings-demo2
```python starter
floor_1: int = 7 // 2 # 3
floor_2: int = -7 // 2 # -4
```
:::

Normal division results in a float value, even if the result is an integer. For
example 8 / 4 would give you 2.0. If you need an integer remainder, use floor
division.

The mod operation is done with the `%` symbol, and gives you the **remainder** of
division.

:::cell id=comments-arithmetic-strings-demo3
```python starter
remainder_1: int = 14 % 3 # 2
remainder_2: int = 3 % 5 # 3
```
:::

Exponentiation is done with the `**` symbol.

:::cell id=comments-arithmetic-strings-demo4
```python starter
power_1: int = 3 ** 4 # 81
power_2: int = 2 ** -3 # 0.125
```
:::

The order of operations is exponentiation, followed by multiplication, division,
floor, and mod, followed by addition and subtraction. However parentheses can be
used to give whatever order is needed, since operations in parentheses happen
first.

:::cell id=comments-arithmetic-strings-demo5
```python starter
result_1: int = 3 * 5 + 1 # 16, multiplication happens first
result_2: int = 3 * (5 + 1) # 18, addition happens first
```
:::

The `+=` operator is a slightly shorter way to express that you want to add
something to an existing value. The following statements do exactly the same
thing:

:::cell id=comments-arithmetic-strings-demo6
```python starter
my_sum: int = 0
my_sum = my_sum + 8
# the notation below is the equivalent of the notation above
my_sum += 8
```
:::

You can combine `=` with each of the operators above to get the following
shortcut operators. See for yourself by typing in the following examples and
then checking the value of `num`.

:::cell id=comments-arithmetic-strings-demo7
```python starter
num: int = 1
```
:::

:::cell id=comments-arithmetic-strings-demo8
```python starter
num += 3 # same as num = num + 3
num -= 3 # same as num = num - 3
num *= 3 # same as num = num * 3
num /= 3 # same as num = num / 3
num //= 3 # same as num = num // 3
num %= 3 # same as num = num % 3
num **= 3 # same as num = num ** 3
```
:::

The `+=` operator is the most commonly used of these, since it is handy for
accumulating totals.

You can get the absolute value of a number like this:

:::cell id=comments-arithmetic-strings-demo9
```python starter
answer: int = abs(-12)
```
:::

In the above line, the variable `answer` is assigned the value 12.

## Concatenation

The `+` operator can also be used with strings to concatenate them together.

:::cell id=comments-arithmetic-strings-demo10
```python starter
first_name: str = "Carol"
last_name: str = "Danvers"
full_name: str = first_name + " " + last_name
print(full_name)
```
:::

## Exercises

:::cell id=comments-arithmetic-strings-ex1 kind=exercise
1. Write a statement that prints out the remainder of 17 divided by 3.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "2", f"Your program should print 2, but it printed {stdout.strip()!r}."
```

```python solution
print(17 % 3)
```
:::

:::cell id=comments-arithmetic-strings-ex2 kind=exercise
2. Write a statement that prints out 3 to the 4th power.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "81", f"Your program should print 81, but it printed {stdout.strip()!r}."
```

```python solution
print(3 ** 4)
```
:::

:::cell id=comments-arithmetic-strings-ex3 kind=exercise
3. Write a statement that finds the result of 17 divided by 6 and assigns it to a variable named `conversion_ratio`.

```python starter
# Type code here
```

```python tests
assert "conversion_ratio" in dir(), "You should create a variable named conversion_ratio."
assert conversion_ratio == 17 / 6, f"conversion_ratio should be 17 / 6, but it is {conversion_ratio!r}."
```

```python solution
conversion_ratio: float = 17 / 6
```

```hint
Normal division uses the `/` operator and produces a float.
```
:::

:::cell id=comments-arithmetic-strings-ex4 kind=exercise
4. Write code that first assigns 9 to a variable called `num_planets`, then subtracts 1 from it, so that `num_planets` will now equal 8.

```python starter
# Type code here
```

```python tests
assert "num_planets" in dir(), "You should create a variable named num_planets."
assert num_planets == 8, f"num_planets should be 8, but it is {num_planets!r}."
```

```python solution
num_planets: int = 9
num_planets -= 1
```
:::

:::cell id=comments-arithmetic-strings-ex5 kind=exercise
5. Write code that assigns `"Doctor"` to a variable named `title`, assigns `"Strange"` to a variable called `last_name`, and then uses string concatenation to print out `"Doctor Strange"`.

```python starter
# Type code here
```

```python tests
assert "title" in dir(), "You should create a variable named title."
assert title == "Doctor", f"title should be 'Doctor', but it is {title!r}."
assert last_name == "Strange", f"last_name should be 'Strange', but it is {last_name!r}."
assert stdout.strip() == "Doctor Strange", f"Your program should print Doctor Strange, but it printed {stdout.strip()!r}."
```

```python solution
title: str = "Doctor"
last_name: str = "Strange"
print(title + " " + last_name)
```
:::
