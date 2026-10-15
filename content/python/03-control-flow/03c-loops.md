---
id: loops
title: Iteration and Looping
section: 3
---

## Iteration

While loops and for loops enable us to make certain sections of code repeat multiple times.

### `while` loops

A while loop continues iterating as long as its condition remains true. Here's an example:

:::cell id=loops-demo1
```python starter
# Accumulates total score until it's 100 or greater
total_score: int = 0
while total_score < 100:
    total_score += int(input("Enter your score for this round: "))
    print("total so far =", total_score)
```
:::

The loop will first test the condition. If it's true, then the code in the loop is executed. It will continue testing the condition and executing the loop until the condition is false, at which point we drop out of the loop and execution resumes with whatever code comes after it. It's important that something in the loop will eventually cause the loop condition to become false. Otherwise the loop will continue forever, which is known as an infinite loop. This is an example of a script that wil run until you forcefully quit your program.

```python
while True:
    print("hi")
```

### `for` loops

A for loop traverses a sequence (or iterable type), looping once for each element in the sequence. A loop variable takes on the value of the current element, which can then be used inside the loop. So far, strings are the only iterable type we've looked at - we'll see one more on this page and others later. Here's an example of iterating through a string:

:::cell id=loops-demo2
```python starter
word = "apothecary"
for letter in word:    # letter is the loop variable
    print(letter)
```
:::

The first time through the loop, letter equals "a", next time through it equals "p", next "o", and so on until the last time through, when it equals "y".

### Using ranges with `for` loops

If we need a for loop to iterate over some increasing (or decreasing) sequence of integers, we can achieve that by using a range. Ranges are another iterable type. Here's an example that counts from 1 to 10:

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

### `break` and `continue`

A loop can be terminated early with the "break" keyword. For example:

:::cell id=loops-demo6
```python starter
for num in range(1, 11):
    if (num == 5):
        break
    print(num)
```
:::

This loop only prints the numbers up to 4 because when the "break" is executed, it immediately drops us out of the loop.

The "continue" keyword allows us to skip iterations of a loop. For example, try replacing the word "break" with "continue" in line 3 of the cell above. With that change, it prints the numbers from 1 through 10 except for 5, because it skips that iteration, jumping us to the next iteration of the loop.

### Proper use of `break`

There may be occasions where using `break` is justified, but you should try to write your loop conditions such that `break` is not needed, since that usually makes the behavior of your loop simpler to read.

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

Notice that we flipped from testing `==` to testing `!=`. That's because we were testing when to stop, but now we're testing when to keep going.

:::cell id=loops-demo9
```python starter
# bad example
while True:
    user_num: int= int(input("Please enter an integer: "))
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

If there are two things that need to be `True` for a loop to continue, it's easy enough to use and to connect them in the loop condition. When there are more than two things that need to be `True`, or the condition starts to get long, try using `break` statements to split up your conditions across multiple lines. You can also use variables to save conditions into descriptive containers before using them.

:::cell id=loops-demo11
```python starter
# save a long condition into a variable
is_positive_num: int = True
while is_positive_num:
    user_num = int(input("Please enter an integer: "))
    print("You entered", user_num)
    is_positive_num = user_num > 0
print("all done")
```
:::

### Nested loops

Both `while` loops and `for` loops can be nested. You can also have `if` statements inside loops or loops inside `if` statements. You can have an `if` statement inside a `for` loop inside a `while` loop inside another `if` statement if you want to.

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
