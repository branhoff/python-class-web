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

## Concatenation

In the example above, suppose you changed the `**` on the last line to `+`, so
that the line looked like this:

```python
print("The result is", num_1 + num_2)
```

This would cause no error because `+` on strings means concatenation. If you
entered 3 for `num_1` and 4 for `num_2`, the last line would print 34, which is
"3" joined to "4".
