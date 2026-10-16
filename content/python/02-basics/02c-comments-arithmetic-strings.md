---
id: comments-arithmetic-strings
title: Comments, Arithmetic, and String Concatenation
section: 2
---

## Comments

Comments are notes for people reading the code. Python ignores them. A comment
begins with `#`. It can be on its own line or on the same line as other code.
Either way, Python ignores everything from the `#` to the end of the line.

:::cell id=comments-arithmetic-strings-demo1
```python starter
# this is a comment
height: float = 1.8 # this is also a comment
```
:::

Write comments that explain what is not obvious, such as the purpose of a
section, the units of a variable, or the reason for a design choice. You do not
need to comment every line, but remember that code that is clear to you now may
not be clear to other people, or to you in a few months.

## Arithmetic

Addition, subtraction, multiplication and division are done with the `+`, `-`,
`*`, and `/` symbols.

Floor division uses the `//` symbol. It divides and rounds the result down to a
whole number.

:::cell id=comments-arithmetic-strings-demo2
```python starter
floor_1: int = 7 // 2
floor_2: int = -7 // 2
print(floor_1)
print(floor_2)
```
:::

Normal division always gives a float, even when the result is a whole number.
For example, `8 / 4` gives `2.0`. If you want a whole-number result, use floor
division.

The mod operation uses the `%` symbol. It gives you the **remainder** of a
division.

:::cell id=comments-arithmetic-strings-demo3
```python starter
remainder_1: int = 14 % 3
remainder_2: int = 3 % 5
print(remainder_1)
print(remainder_2)
```
:::

Exponentiation is done with the `**` symbol.

:::cell id=comments-arithmetic-strings-demo4
```python starter
power_1: int = 3 ** 4
power_2: float = 2 ** -3
print(power_1)
print(power_2)
```
:::

The order of operations is exponentiation first, then multiplication, division,
floor division, and mod, then addition and subtraction. Parentheses let you
choose a different order, since operations in parentheses happen first.

:::cell id=comments-arithmetic-strings-demo5
```python starter
result_1: int = 3 * 5 + 1  # multiplication happens first
result_2: int = 3 * (5 + 1)  # addition happens first
print(result_1)
print(result_2)
```
:::

The `+=` operator is a shorter way to add something to an existing value. The
following statements do exactly the same thing:

:::cell id=comments-arithmetic-strings-demo6
```python starter
my_sum: int = 0
my_sum = my_sum + 8
# the notation below is the equivalent of the notation above
my_sum += 8
print(my_sum)
```
:::

You can combine `=` with each of the operators above to get more shortcut
operators. Run the cells below and read the printed values.

:::cell id=comments-arithmetic-strings-demo8
```python starter
num: int = 1
num += 3 # same as num = num + 3
print(num)
num -= 3 # same as num = num - 3
print(num)
num *= 3 # same as num = num * 3
print(num)
num /= 3 # same as num = num / 3
print(num)
num //= 3 # same as num = num // 3
print(num)
num %= 3 # same as num = num % 3
print(num)
num **= 3 # same as num = num ** 3
print(num)
```
:::

The `+=` operator is the most common of these, since it is handy for keeping a
running total.

You can get the absolute value of a number like this:

:::cell id=comments-arithmetic-strings-demo9
```python starter
answer: int = abs(-12)
print(answer)
```
:::

Here the variable `answer` is assigned the value 12.

## Concatenation

The `+` operator also works on strings. Concatenating strings joins them end to
end.

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
