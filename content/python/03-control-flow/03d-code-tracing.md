---
id: code-tracing
title: Code Tracing
section: 3
---

## Flow of Execution: Code Tracing

Tracing the flow of execution through code, and telling how it will behave, is a key skill for reading code and debugging it. Here are four common methods:

1. Hand-tracing means stepping through the code line by line as if you were the computer, keeping track of the current value of every variable. On paper (or a whiteboard), write a row (or column) for each variable. Each time a value changes, cross off the old value and write the new one.

2. Temporarily adding `print` calls at various places shows what values your variables hold at those points. Delete them when you're done.

3. Many programming environments include a debugger, which lets you step through the code line by line and watch how the variables change.

4. Explaining your code to someone else can give you an "Aha!" moment where you see the gap between what the code should do and what it does. It even works when you explain it to a pet or a rubber duck.

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
in the code cell to the values you expect at the end. Press **Run** to check. If a
value is wrong, trace the program again one line at a time.

:::cell id=trace-assignments kind=quiz
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

:::cell id=trace-loop kind=quiz
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

:::cell id=trace-conditionals kind=quiz
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
