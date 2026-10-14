---
id: conditionals
title: Making decisions with if
section: 3
---

An `if` statement runs code only when a condition is `True`. Add `elif` for more
cases and `else` for everything left over. Conditions use comparisons like `==`,
`<`, `>`, and `>=`.

:::cell id=if-demo
```python starter
temperature = 72
if temperature > 80:
    print("hot")
elif temperature > 60:
    print("nice")
else:
    print("cold")
```
:::

## Exercises

:::cell id=sign kind=exercise
1. Write a function `sign(n)` that returns `"positive"` when `n` is greater than
0, `"negative"` when it is less than 0, and `"zero"` otherwise.

```python starter
def sign(n):
    pass
```

```python tests
assert sign(5) == "positive", "sign(5) should be 'positive'."
assert sign(-3) == "negative", "sign(-3) should be 'negative'."
assert sign(0) == "zero", "sign(0) should be 'zero'."
```

```python solution
def sign(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"
```

```hint
Three branches: `if n > 0`, `elif n < 0`, then `else`.
```
:::

:::cell id=parity kind=exercise
2. Write a function `parity(n)` that returns `"even"` when `n` is divisible by 2
and `"odd"` otherwise. The remainder operator `%` helps: `n % 2` is `0` when `n`
is even.

```python starter
def parity(n):
    pass
```

```python tests
assert parity(4) == "even", "parity(4) should be 'even'."
assert parity(7) == "odd", "parity(7) should be 'odd'."
assert parity(0) == "even", "parity(0) should be 'even'."
```

```python solution
def parity(n):
    if n % 2 == 0:
        return "even"
    return "odd"
```

```hint
`n % 2 == 0` is True when `n` is even.
```
:::
