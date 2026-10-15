---
id: code-tracing
title: Code Tracing
section: 3
---

## Flow of Execution: Code Tracing

Being able to trace the flow of execution through a given piece of code and tell how it will behave, is a critical skill for reading and understanding code, as well as for debugging. Here are four common methods people use to help them do this:

1. Hand-tracing is just stepping through the code as if you were the computer, going along line by line, and keeping track of the current values of all the variables as they change. You can write down on paper (or a whiteboard) a row (or column) for each variable, and then each time the value for that variable changes, you can cross off the old value and write down the new value.

2. Temporarily inserting print statements at various places in your code can also be useful for checking what values variables referred to at those points. Make sure to delete such print statements when you're done with them.

3. Many programming environments provide a built-in debugger, which lets you look at the current values of the different variables to see how they change as you step through the code line by line.

4. Explaining how your code works to someone else can often give you an "Aha!" moment where it helps you see a disconnect between what your code is supposed to do and what it actually does. This can even work when explaining your code to a cat or dog, or even a rubber duck.

All of these are worth being comfortable with.

## A worked trace

Here is a hand trace of a short program. Each row is one line of code, and each
column is a variable. A row shows every variable's value after that line runs. A
variable that has not been assigned yet is left blank.

```python
count = 3
total = 10
count = count + 1
total = total - count
```

| After line | count | total |
| --- | --- | --- |
| `count = 3` | 3 | |
| `total = 10` | 3 | 10 |
| `count = count + 1` | 4 | 10 |
| `total = total - count` | 4 | 6 |

Work on the right side first, using the values the variables hold right now, then
store the result in the variable on the left.

## Practice: predict the result

Each program below is shown but not run. Trace it by hand, then set the variables
in the cell to the values you expect at the end. Press **Run** to check. If a
value is wrong, trace the program again one line at a time.

:::cell id=trace-assignments kind=exercise
1. Trace this program.

```python
a = 4
b = a + 1
a = b * 2
b = a - b - 1
```

Set `final_a` and `final_b` to the values of `a` and `b` after the last line.

```python starter
final_a = None
final_b = None
```

```python tests
program = """
a = 4
b = a + 1
a = b * 2
b = a - b - 1
"""
real = {}
exec(program, real)
assert final_a == real["a"], "final_a is not right. Trace the program again, one line at a time."
assert final_b == real["b"], "final_b is not right. Trace the program again, one line at a time."
```

```python solution
final_a = 10
final_b = 4
```

```hint
Write a row for each line and update the column of the variable that line changes.
```
:::

:::cell id=trace-loop kind=exercise
2. Trace this program. The loop body runs once for each value of `i`.

```python
total = 0
for i in range(1, 4):
    total = total + i * 2
```

Set `final_total` to the value of `total` and `final_i` to the value of `i` after
the loop ends.

```python starter
final_total = None
final_i = None
```

```python tests
program = """
total = 0
for i in range(1, 4):
    total = total + i * 2
"""
real = {}
exec(program, real)
assert final_total == real["total"], "final_total is not right. Write a row for each pass through the loop."
assert final_i == real["i"], "final_i is not right. What is the last value range(1, 4) gives?"
```

```python solution
final_total = 12
final_i = 3
```

```hint
`range(1, 4)` gives 1, 2 and 3. Add a row to your table for each pass.
```
:::

:::cell id=trace-conditionals kind=exercise
3. Trace this program. Both `if` statements are checked, one after the other.

```python
score = 7
if score > 5:
    score = score - 3
if score > 5:
    score = score * 10
else:
    score = score + 1
```

Set `final_score` to the value of `score` at the end.

```python starter
final_score = None
```

```python tests
program = """
score = 7
if score > 5:
    score = score - 3
if score > 5:
    score = score * 10
else:
    score = score + 1
"""
real = {}
exec(program, real)
assert final_score == real["score"], "final_score is not right. Check the second if against the new value of score."
```

```python solution
final_score = 5
```

```hint
The second `if` sees the value of `score` after the first one has changed it.
```
:::
