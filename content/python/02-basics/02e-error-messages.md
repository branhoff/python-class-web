---
id: error-messages
title: Example Error Messages
section: 2
---

Here are a few examples of problems and the error messages they cause. The
snippets below are not runnable cells, because most of them fail on purpose.
Read each one and notice what Python reports.

## EOF

This code has a mistake, and Python reports an error for it:

```python
print("hello"
```

We left out the closing parenthesis. EOF stands for "end of file". Python
reached the end of the file without finding the missing parenthesis.

## EOL

Here is another example:

```python
print("hello)
```

We left out the closing quotation mark of the string. EOL stands for "end of
line". Python reached the end of the line without finding the missing quotation
mark. Because a string cannot continue onto the next line, Python stops at the
end of the line instead of reading to the end of the file.

## NameError

```python
print(phrase)
```

We never assigned a value to `phrase` before trying to print it.

:::cell id=predict-error-case kind=exercise
**Check your understanding.** Predict the result. Name the error Python reports for the last line.

```python
name = "Sam"
print(name)
print(Name)
```

Set `error_name` to the name of the error type as a string, for example `"ZeroDivisionError"`.

```python starter
error_name = ""
```

```python tests
program = """
name = "Sam"
print(name)
print(Name)
"""
try:
    exec(program, {})
except Exception as e:
    assert error_name == type(e).__name__, "error_name is not right. Read the line that fails and think about what kind of problem it is."
else:
    assert False, "The program raised no error, so there is nothing to name."
```

```python solution
error_name = "NameError"
```

```hint
Python treats upper and lower case letters as different.
```
:::

## SyntaxError

```python
32 = age
```

The left side of an assignment must be a variable name, not a literal value.

## TypeError

```python
num_1 = input("Enter first operand: ")
num_2 = input("Enter second operand: ")
print("The result is", num_1 ** num_2)
```

We did not cast the input strings to numbers before doing math with them. The
`**` operator does not work on strings. Strings do support `+` (concatenation),
but not `**`.

:::cell id=predict-error-add kind=exercise
**Check your understanding.** Predict the result. Name the error Python reports for the last line.

```python
age = 12
print("Age: " + age)
```

Set `error_name` to the name of the error type as a string, for example `"ZeroDivisionError"`.

```python starter
error_name = ""
```

```python tests
program = """
age = 12
print("Age: " + age)
"""
try:
    exec(program, {})
except Exception as e:
    assert error_name == type(e).__name__, "error_name is not right. Read the line that fails and think about what kind of problem it is."
else:
    assert False, "The program raised no error, so there is nothing to name."
```

```python solution
error_name = "TypeError"
```

```hint
The code is written correctly. Look at the types being joined.
```
:::

## Concatenation

In the example above, suppose you changed the `**` on the last line to `+`, so
that the line looked like this:

```python
print("The result is", num_1 + num_2)
```

This would cause no error because `+` on strings means concatenation. If you
entered 3 for `num_1` and 4 for `num_2`, the last line would print 34, which is
"3" joined to "4".
