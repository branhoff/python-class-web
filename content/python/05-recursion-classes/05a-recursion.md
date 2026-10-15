---
id: recursion
title: Recursion
section: 5
---

## Introduction

A recursive function is a function that calls itself. Each time it calls itself, a separate copy is created that has its own values for its parameters and variables. Of course, if every copy creates another copy, then the recursion will never end, and we'll run out of memory, so it's crucial that every recursive function have one or more base cases. A base case is a case where the function doesn't call itself.

Let's look at a common first example of recursion:

:::cell id=recursion-demo1
```python starter
def factorial(num: int) -> int:
    """Returns the factorial of num."""
    if num == 0:
        return 1
    else:
        return num * factorial(num - 1)

print(factorial(5))
```
:::

The condition of the if statement checks whether `num` is equal to zero. This is the base case. If it's true, then the function does not call itself. However, if the base case is not true, then it calls itself, performs a multiplication with the return value, and returns the result. We could also write it like this:

:::cell id=recursion-demo2
```python starter
def factorial(num: int) -> int:
    """Returns the factorial of num."""
    if num == 0:
        return 1

    return num * factorial(num - 1)

print(factorial(5))
```
:::

The else can be omitted here because if the condition is true, then `return 1` is executed, and the function ends before it can reach the recursive call. This is the logic I'll use in the other examples in this lesson.

## The Call Stack

When running a recursive function, multiple copies of the function will be active at once, but only the most recent one will be executing. The others are paused while waiting for a result. When a recursive call is made, the computer needs to save our place in the current copy of the function, so that we can come back to it later. Then we can start executing a new copy of the function. The computer saves our place in the current copy by storing its information on the **call stack**, which keeps track of all active function calls. Watch the video "Flow of execution example for recursion" to see how this works.

## More examples

Here's a recursive function that finds the greatest common divisor of two integers:

:::cell id=recursion-demo3
```python starter
def gcd(a: int, b: int) -> int:
    """Returns the greatest common divisor of a and b."""
    if a % b == 0:
        return b

    return gcd(b, a % b)

print(gcd(48, 36))
```
:::

The base case is when b evenly divides `a`, in which case `b` is the greatest common divisor. Otherwise we make a recursive call with the value of `b` passed for `a`, and the value of `a % b` passed for `b`. Nothing needs to be done with the return values on the way back out of the recursive calls.

Here's a recursive function that computes the hailstone sequence starting from a given number and counts how many steps it takes to reach 1:

:::cell id=recursion-demo4
```python starter
def hailstone(num: int) -> int:
    """Returns the number of steps a hailstone sequence that starts at num
    takes to reach 1."""
    if num == 1:
        return 0
    if num % 2 == 0:  # if num is even
        return hailstone(num // 2) + 1
    else:
        return hailstone(num * 3 + 1) + 1

print(hailstone(3))
```
:::

Here the base case is when the sequence arrives at 1. You can see that there are two different recursive cases, one that happens if `num` is odd, and one that happens if `num` is even. We add 1 to the return value, since the current copy of hailstone takes one more step to reach 1 than the recursive call does. For example, if we start at 3, the sequence goes: 3, 10, 5, 16, 8, 4, 2, 1. If we find the number of steps it takes to go from 10 to 1, then we can just add 1 more step to get the number of steps it takes to go from 3 to 1.

## Writing a Recursive Function

Recursion can feel like it's partly magic, because you're writing a function that is calling the function you're still writing. It feels like an M.C. Escher print. The general strategy for designing a recursive function is to identify how a problem can be broken up into a smaller problem of the same kind, plus a bit of work at the current level.

- In the factorial example, `num`! is equal to (`num`-1)! multiplied by `num`. The smaller problem of the same kind is (`num`-1)! and multiplying by `num` is the bit of work at the current level.
- In the gcd example, the gcd of `a` and `b` is the same as the gcd of `b` and `a % b`, which is a smaller problem of the same type. In this example no additional work at the current level is needed.
- In the hailstone sequence example, the smaller problem of the same type is counting how many steps it takes to get from the next number in the sequence to 1. The bit of work at the current level is adding 1 to that result.

## Exercises

:::cell id=recursion-ex1 kind=exercise
1. Write a **recursive** function called `countdown` that takes a positive integer parameter and returns a string that **counts down from that number to 1**. For example, if `5` is passed to the function, it should return the string `"5 4 3 2 1"`. You can use string concatenation in your recursive function to build up the return value.

```python starter
# Type code here
```

```python tests
assert countdown(5) == "5 4 3 2 1", f"countdown(5) should be '5 4 3 2 1', but it returned {countdown(5)!r}."
assert countdown(1) == "1", f"countdown(1) should be '1', but it returned {countdown(1)!r}."
assert countdown(3) == "3 2 1", f"countdown(3) should be '3 2 1', but it returned {countdown(3)!r}."
```

```python solution
def countdown(n: int) -> str:
    if n < 2:
        return str(n)
    return str(n) + " " + countdown(n - 1)
```

```hint
The base case is when `n` is 1. Otherwise, put `str(n)` in front of the result of `countdown(n - 1)`.
```
:::

:::cell id=recursion-ex2 kind=exercise
2. Write a **recursive** function called `countup` that takes a positive integer parameter and returns a string that **counts up from 1 to that number**. For example, if `5` is passed to the function, it should return the string `"1 2 3 4 5"`. You can use string concatenation in your recursive function to build up the return value.

```python starter
# Type code here
```

```python tests
assert countup(5) == "1 2 3 4 5", f"countup(5) should be '1 2 3 4 5', but it returned {countup(5)!r}."
assert countup(1) == "1", f"countup(1) should be '1', but it returned {countup(1)!r}."
assert countup(3) == "1 2 3", f"countup(3) should be '1 2 3', but it returned {countup(3)!r}."
```

```python solution
def countup(n: int) -> str:
    if n < 2:
        return str(n)
    return countup(n - 1) + " " + str(n)
```

```hint
This is the mirror of `countdown`. Put the result of `countup(n - 1)` in front of `str(n)`.
```
:::

:::cell id=recursion-ex3 kind=exercise
3. Write a **recursive** function called `sum_countup` that takes an integer parameter and returns the sum of all the integers from 1 to that number. For example if the function is passed the value `5`, then it should return `15` because 1 + 2 + 3 + 4 + 5 = 15.

```python starter
# Type code here
```

```python tests
assert sum_countup(5) == 15, f"sum_countup(5) should be 15, but it returned {sum_countup(5)!r}."
assert sum_countup(1) == 1, f"sum_countup(1) should be 1, but it returned {sum_countup(1)!r}."
assert sum_countup(10) == 55, f"sum_countup(10) should be 55, but it returned {sum_countup(10)!r}."
```

```python solution
def sum_countup(n: int) -> int:
    if n == 1:
        return 1
    return n + sum_countup(n - 1)
```

```hint
The base case returns 1 when `n` is 1. Otherwise add `n` to `sum_countup(n - 1)`.
```
:::
