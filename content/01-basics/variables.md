---
id: variables
title: Variables and printing
section: 1
---

# Variables and printing

A **variable** is a name that holds a value. You create one with `=`, and you
show a value with the `print` function.

:::cell id=hello-demo
```python starter
greeting = "Hello"
name = "Ada"
print(greeting, name)
```
:::

Run the cell above — `print` writes its arguments separated by spaces. Try
changing `name` and running it again.

## Exercises

:::cell id=print-age kind=exercise
1. Create a variable named `age` set to the number `25`, then print it.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "25", f"Expected your program to print 25, but it printed {stdout.strip()!r}."
```

```python solution
age = 25
print(age)
```

```hint
Assign with `age = 25`, then call `print(age)`.
```
:::

:::cell id=full-name kind=exercise
2. Create variables `first` set to `"Grace"` and `last` set to `"Hopper"`, then
print them on one line separated by a space, like `Grace Hopper`.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "Grace Hopper", f"Expected 'Grace Hopper', but got {stdout.strip()!r}."
```

```python solution
first = "Grace"
last = "Hopper"
print(first, last)
```

```hint
`print(first, last)` puts a space between the two values.
```
:::
