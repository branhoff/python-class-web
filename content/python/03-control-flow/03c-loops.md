---
id: loops
title: Iteration and Looping
section: 3
---

## Iteration

`while` loops and `for` loops repeat sections of code.

### `while` loops

A `while` loop keeps repeating as long as its condition is true. Here's an example:

:::cell id=loops-demo1
```python starter
# Accumulates total score until it's 100 or greater
total_score: int = 0
while total_score < 100:
    total_score += int(input("Enter your score for this round: "))
    print("total so far =", total_score)
```
:::

The loop first tests the condition. If it's true, the code in the loop runs. This repeats until the condition is false, and then execution continues with the code after the loop. Something in the loop must eventually make the condition false. Otherwise the loop runs forever, which is called an infinite loop. This example never stops on its own, so you would have to stop the program yourself.

```python
while True:
    print("hi")
```

### `for` loops

A `for` loop goes through a sequence (an iterable type) and repeats once for each element. A loop variable takes on the value of the current element, so you can use it inside the loop. So far, strings are the only iterable type we've seen. We'll see one more on this page and others later. Here's an example that loops through a string:

:::cell id=loops-demo2
```python starter
word = "apothecary"
for letter in word:    # letter is the loop variable
    print(letter)
```
:::

The first time through the loop, letter equals "a", next time through it equals "p", next "o", and so on until the last time through, when it equals "y".

### Using ranges with `for` loops

If we need a for loop to iterate over some increasing (or decreasing) sequence of integers, we can use a range. Ranges are another iterable type. Here's an example that counts from 1 to 10:

:::cell id=loops-demo3
```python starter
for num in range(1, 11):
    print(num)
```
:::

Notice that the range goes from 1 up to, but not including, 11. A range can also count by a given step size:

:::cell id=loops-demo4
```python starter
# counts by twos
for num in range(1, 11, 2): # the third number is the step size
    print(num)
```
:::

You can count down by using a negative step size, but if you do, then the first number (the start of the range) needs to be greater than the second number (the end of the range):

:::cell id=loops-demo5
```python starter
# counts down from 10 to 1
for num in range(10, 0, -1):
    print(num)
```
:::

:::cell id=predict-zero-times kind=check
**Check your understanding.** Predict the result. Check whether each range has any numbers in it, and what the step does.

```python
x = 100
y = 0
for x in range(5, 1):
    y += 1
for n in range(10, 0, -3):
    y += n
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
x = 100
y = 0
for x in range(5, 1):
    y += 1
for n in range(10, 0, -3):
    y += n
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Does the first range have any numbers? List the second one."
assert final_y == real["y"], "final_y is not right. Does the first range have any numbers? List the second one."
```

```python solution
final_x = 100
final_y = 22
```

```hint
A range with no numbers never runs the body, so the loop variable is never set. The second range counts down by 3.
```
:::

### `break` and `continue`

The `break` keyword ends a loop early. For example:

:::cell id=loops-demo6
```python starter
for num in range(1, 11):
    if (num == 5):
        break
    print(num)
```
:::

This loop only prints the numbers up to 4 because when `break` runs, it immediately exits the loop.

The `continue` keyword skips the rest of the current iteration and jumps to the next one. Try replacing `break` with `continue` in the code above. It then prints the numbers from 1 through 10 except for 5.

:::cell id=predict-loop-var-continue kind=check
**Check your understanding.** Predict the result. Think about what `x` holds when the loop ends, and which numbers `continue` skips.

```python
x = 0
y = 0
for x in range(1, 11):
    if x % 3 == 0:
        continue
    y += x
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
x = 0
y = 0
for x in range(1, 11):
    if x % 3 == 0:
        continue
    y += x
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Check which numbers get added and what x is last."
assert final_y == real["y"], "final_y is not right. Check which numbers get added and what x is last."
```

```python solution
final_x = 10
final_y = 37
```

```hint
`continue` still leaves the loop variable set. The range stops before 11.
```
:::

### Proper use of `break`

Sometimes `break` is justified, but try to write your loop conditions so that `break` is not needed. That usually makes the loop easier to read.

:::cell id=loops-demo7
```python starter
# bad example
binary_str: str = ""
user_num: int = int(input("Please enter a positive integer: "))
while True:
    binary_str = str(user_num % 2) + binary_str
    user_num //= 2
    if user_num == 0:  # This is the real loop condition
        break
print(binary_str)
```
:::

:::cell id=loops-demo8
```python starter
# good example
binary_str: str = ""
user_num: int = int(input("Please enter a positive integer: "))
while user_num != 0:
    binary_str = str(user_num % 2) + binary_str
    user_num //= 2
print(binary_str)
```
:::

Notice that we changed `==` to `!=`. The first version tested when to stop, and the second tests when to keep going.

:::cell id=loops-demo9
```python starter
# bad example
while True:
    user_num: int = int(input("Please enter an integer: "))
    if user_num % 10 == 0: # This is the real loop condition
        break
    else:
        print("You entered", user_num)
print("all done")
```
:::

:::cell id=loops-demo10
```python starter
# good example
# The first line declares user_num by initializing it to a value
# that will make the loop condition True (otherwise we would
# never enter the loop)
user_num: int = 1
while user_num % 10 != 0:
    user_num = int(input("Please enter an integer: "))
    print("You entered", user_num)
print("all done")
```
:::

If two things must be `True` for a loop to continue, join them with `and` in the loop condition. If there are more than two, or the condition gets long, you can use `break` statements to split it across several lines. You can also save a condition in a variable with a descriptive name and use that variable in the loop condition.

:::cell id=loops-demo11
```python starter
# save a long condition into a variable
is_positive_num: bool = True
while is_positive_num:
    user_num = int(input("Please enter an integer: "))
    print("You entered", user_num)
    is_positive_num = user_num > 0
print("all done")
```
:::

### Nested loops

Both `while` loops and `for` loops can be nested (placed inside other loops). You can also put `if` statements inside loops and loops inside `if` statements, to any depth.

:::cell id=loops-demo12
```python starter
# A nested for loop
total_num_letters = 0
print("Please enter the names of your three favorite animals.")
for val in range(1, 4):
    animal = input()
    for letter in animal:
        total_num_letters += 1
print("Those names contained a total of", total_num_letters, "characters.")
```
:::

## Exercises

:::cell id=loops-ex1 kind=exercise
1. Write a function named `sum_to` that takes an integer parameter `n` and returns the sum of the integers from 1 to `n` (inclusive).

```python starter
# Type code here
```

```python tests
assert sum_to(1) == 1, "sum_to(1) should return 1."
assert sum_to(5) == 15, "sum_to(5) should return 15."
assert sum_to(10) == 55, "sum_to(10) should return 55."
assert sum_to(100) == 5050, "sum_to(100) should return 5050."
```

```python solution
def sum_to(n: int) -> int:
    total: int = 0
    for i in range(1, n + 1):
        total += i
    return total

print(sum_to(10))
```
:::

:::cell id=loops-ex2 kind=exercise
2. Write a function named `length_parity` that takes a string parameter, counts how many characters are in the string, and returns `"odd"` if that number is odd and `"even"` if that number is even.

```python starter
# Type code here
```

```python tests
assert length_parity("abc") == "odd", 'length_parity("abc") should return "odd".'
assert length_parity("abcd") == "even", 'length_parity("abcd") should return "even".'
assert length_parity("") == "even", 'length_parity("") should return "even".'
assert length_parity("a") == "odd", 'length_parity("a") should return "odd".'
```

```python solution
def length_parity(text: str) -> str:
    count: int = 0
    for character in text:
        count += 1
    if count % 2 == 1:
        return "odd"
    else:
        return "even"

print(length_parity("hello"))
```
:::

:::cell id=loops-ex3 kind=exercise
3. Write a function named `echo_until_quit` that takes a list of strings. Starting from the first item, it prints each string on its own line, stopping as soon as it reaches the string `"quit"` (which is not printed). Then call your function with the list `["red", "green", "quit", "blue"]`.

```python starter
# Type code here
```

```python tests
import io, contextlib
_buf = io.StringIO()
with contextlib.redirect_stdout(_buf):
    echo_until_quit(["a", "b", "quit", "c"])
assert _buf.getvalue().strip() == "a\nb", "echo_until_quit should print each string until it reaches quit."
_buf2 = io.StringIO()
with contextlib.redirect_stdout(_buf2):
    result = echo_until_quit(["x", "quit"])
assert _buf2.getvalue().strip() == "x", "echo_until_quit should stop at quit without printing it."
assert result is None, "echo_until_quit should not return a value."
```

```python solution
def echo_until_quit(words: list) -> None:
    index: int = 0
    while index < len(words) and words[index] != "quit":
        print(words[index])
        index += 1

echo_until_quit(["red", "green", "quit", "blue"])
```
:::

:::cell id=predict-nested-break kind=exercise
4. Predict the result. Count how many times the inner body reaches `x += 1`, and what `b` is at the end.

```python
x = 0
y = 0
for a in range(0, 3):
    for b in range(0, 4):
        if b == 2:
            break
        x += 1
y = b
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
x = 0
y = 0
for a in range(0, 3):
    for b in range(0, 4):
        if b == 2:
            break
        x += 1
y = b
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Count the inner passes per outer pass, then multiply."
assert final_y == real["y"], "final_y is not right. Count the inner passes per outer pass, then multiply."
```

```python solution
final_x = 6
final_y = 2
```

```hint
`break` only leaves the inner loop. The outer loop still goes around each time.
```
:::
