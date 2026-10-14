---
id: error-messages
title: Example Error Messages
section: 2
---

Here are a few examples of problems and their corresponding error messages. The
code snippets below are shown as plain examples rather than runnable cells,
because most of them are written to fail on purpose. Read each one and notice
what the interpreter reports.

## EOF

See what happens when you try to run the code below:

```python
print("hello"
```

We omitted the closing parenthesis. EOF stands for "end of file". The
interpreter got to the end of the file and never found the missing parenthesis.

## EOL

Here is another example:

```python
print("hello)
```

We omitted the closing quotation mark for the string. EOL stands for "end of
line". The interpreter got to the end of the line without finding the missing
quotation mark. Because strings cannot be split across lines, the interpreter
does not need to look all the way to the end of the file.

## NameError

```python
print(phrase)
```

We did not assign a value to `phrase` before trying to print it.

## SyntaxError

```python
32 = age
```

We have to have a variable on the left side of an assignment statement, not a
literal value.

## TypeError

```python
num_1 = input("Enter first operand: ")
num_2 = input("Enter second operand: ")
print("The result is", num_1 ** num_2)
```

We did not cast the input strings to numbers before trying to do math with them.
The `**` operator is not defined for strings. As we learned in the Input and
Casting lesson, we can concatenate strings with a `+` operator, but the `**`
operator is not defined on the string type.

## Concatenation

In the example above, try running the code again after changing the `**` on the
last line to a `+` sign, so that the last line looks like this:

```python
print("The result is", num_1 + num_2)
```

The reason this does not cause an error message is because `+` is defined for
strings as concatenation. If you enter 3 for `num_1` and 4 for `num_2`, then the
last line will print that the result is 34, which is the concatenation of "3"
and "4".
