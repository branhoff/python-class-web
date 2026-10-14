---
id: variables
title: Variables and printing
section: 1
---

A **variable** is a name that holds a value. You create one with `=`, and you
show a value with the `print` function.

:::cell id=hello-demo
```python starter
greeting = "Hello"
name = "Ada"
print(greeting, name)
```
:::

Run the cell above. `print` writes its arguments separated by spaces. Try
changing `name` and running it again.

## Exercises

:::cell id=print-age kind=exercise
1. Create a variable named `age` set to the number `25`, then print it.

```python starter
# Type code here
```

```python tests
assert "age" in dir(), "Create a variable named age."
assert age == 25, f"age should be 25, but it is {age!r}."
assert stdout.strip() == "25", f"Your program should print 25, but it printed {stdout.strip()!r}."
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
assert "first" in dir() and "last" in dir(), "Create variables named first and last."
assert first == "Grace", f"first should be 'Grace', but it is {first!r}."
assert last == "Hopper", f"last should be 'Hopper', but it is {last!r}."
assert stdout.strip() == "Grace Hopper", f"Your program should print 'Grace Hopper', but it printed {stdout.strip()!r}."
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
