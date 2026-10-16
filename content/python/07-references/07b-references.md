---
id: references
title: Object References and Identity
section: 7
---

## Introduction

Remember how variables refer to values, and how all values in Python are objects? It's possible for two or more variables to refer to the same object. We can tell whether this is the case by using the `is` operator.

Each code box on this page runs on its own, with a fresh set of variables. Nothing you define in one box carries over to the next. That's why the boxes below repeat the variable definitions each time: so every box runs on its own and you can see exactly what it does.

:::cell id=references-demo1
```python starter
num_1: int = 1000
num_2: int = 1000
```
:::

Test whether `num_1` and `num_2` are equal:

:::cell id=references-demo2
```python starter
num_1: int = 1000
num_2: int = 1000
print(num_1 == num_2)
```
:::

Test whether `num_1` and `num_2` refer to the same object:

:::cell id=references-demo3
```python starter
num_1: int = 1000
num_2: int = 1000
print(num_1 is num_2)
```
:::

Now make `num_1` and `num_2` refer to the same object and check again:

:::cell id=references-demo4
```python starter
num_1: int = 1000
num_2: int = 1000
num_1 = num_2
print(num_1 is num_2)
```
:::

Make `num_2` refer to a different object:

:::cell id=references-demo5
```python starter
num_1: int = 1000
num_2: int = 1000
num_1 = num_2
num_2 = -89
print(num_1)
print(num_1 is num_2)
```
:::

Declaring `num_1` and `num_2` creates an object for the value `1000` and **binds** each variable to it. (They are two separate `1000` objects.) The `==` operator tests whether `num_1` and `num_2` refer to values that are equal, which they do.

The `is` operator tests whether `num_1` and `num_2` refer to (are bound to) the same object, which at first they don't. When we assign `num_1 = num_2`, this **rebinds** `num_1` so that it refers to the same object `num_2` does, and testing with `is` again shows that they now match.

The last box has one more assignment, `num_2 = -89`, which creates an object for the value `-89` and rebinds `num_2` to it. Now `num_1` and `num_2` no longer refer to the same object. Assigning `-89` to `num_2` did not change the object for the value `1000`, which `num_1` still refers to (notice `num_1` still prints `1000`). We cannot change the value of an integer object, because integers are immutable, but we can rebind a variable to a different object.

You can think of a variable as a sticky note that you can stick to different objects. You can have multiple sticky notes attached (bound) to the same object, and you can take a sticky note off one object and attach it to another object, even an object of another type.

## Example Using Lists

Now let's look at an example that uses lists, which we know are mutable.

:::cell id=references-demo6
```python starter
num_list_1: list[int] = [2, 9, 7]
num_list_2: list[int] = [2, 9, 7]
```
:::

Test whether `num_list_1` and `num_list_2` are equal:

:::cell id=references-demo7
```python starter
num_list_1: list[int] = [2, 9, 7]
num_list_2: list[int] = [2, 9, 7]
print(num_list_1 == num_list_2)
```
:::

Now make them refer to the same object:

:::cell id=references-demo8
```python starter
num_list_1: list[int] = [2, 9, 7]
num_list_2: list[int] = [2, 9, 7]
num_list_1 = num_list_2
print(num_list_1 is num_list_2)
```
:::

Make `num_list_2` refer to a different object:

:::cell id=references-demo9
```python starter
num_list_1: list[int] = [2, 9, 7]
num_list_2: list[int] = [2, 9, 7]
num_list_1 = num_list_2
num_list_2 = [23, -1, 19]
print(num_list_1 is num_list_2)
```
:::

This example behaves the same way as the previous example. So far, being mutable doesn't seem to make a difference. However, let's try something a little different.

Make `num_list_1` and `num_list_2` refer to the same object:

:::cell id=references-demo10
```python starter
num_list_1: list[int] = [3, 17, 12]
num_list_2 = num_list_1
print(num_list_1 is num_list_2)
```
:::

Now change the object that `num_list_1` and `num_list_2` both refer to, and look at `num_list_1`:

:::cell id=references-demo11
```python starter
num_list_1: list[int] = [3, 17, 12]
num_list_2 = num_list_1
num_list_2[0] = 99
print(num_list_1)
```
:::

They still refer to the same object:

:::cell id=references-demo12
```python starter
num_list_1: list[int] = [3, 17, 12]
num_list_2 = num_list_1
num_list_2[0] = 99
print(num_list_1 is num_list_2)
```
:::

In this example, changing `num_list_2` does **not** result in creating a new object and rebinding `num_list_2` to that object. Instead, it mutates the existing list object, which `num_list_1` and `num_list_2` both still refer to. We can see that **there is a difference between rebinding a variable, and mutating the value that a variable refers to**.

> Diagram: both `num_list_1` and `num_list_2` are drawn as separate variable names, each with an arrow pointing at the same single list object `[99, 17, 12]`. Because the two arrows land on one shared object, mutating the list through either name is visible through the other.

## Changing Parameters - Mutating Values

This helps explain what happens when a function "changes" one of its parameters. Let's revisit a couple of examples we've seen previously:

:::cell id=references-demo13
```python starter
# first example
def square_val(val: int) -> None:
    val = val * val
    print("from in the function:", val)

num: int = 8
square_val(num)
print("from outside the function:", num)

# second example
def square_val(val: list[int]) -> None:
    val[0] = val[0] * val[0]
    print("from in the function:", val)

num_list: list[int] = [8]
square_val(num_list)
print("from outside the function:", num_list)
```
:::

In the first example, we pass `num` to the function and `val` gets bound to the same object as `num`. Then the line `val = val * val` creates a new object for the value `64`, and **rebinds `val` to that object**. At this point `num` and `val` no longer refer to the same object. This is why `num` doesn't show any change after the function call.

In the second example, we pass `num_list` to the function and `val` gets bound to the same object as `num_list`. Then the line `val[0] = val[0] * val[0]` **mutates** the list that both `num_list` and `val` refer to. This is why `num_list` shows a change after the function call.

So if you need for a function to mutate a value, then that value needs to be of a mutable type. Note that in Python a variable doesn't have a type; it's the value it references that has a type, and that type determines whether the value is mutable or immutable.

## Questions to think through

These are questions to think through rather than code to write. Try to answer each in your own words first, then open the hint to check your reasoning.

1. Is it possible to have variables be equal, but not refer to the same object? Is it possible to have variables refer to the same object, but not be equal? Explain both answers.

```hint
Yes to the first: you can have `num_1` referencing one object with the value 7, and `num_2` referencing a different object that also has the value 7. They are equal (`==`) but not identical (`is`). No to the second: if `num_1` and `num_2` both reference the same object, they refer to the same value, so they must be equal.
```

2. If `nums_1` and `nums_2` refer to the same **list** object, and you delete the first element of `nums_1`, then that affects `nums_2`, because they're the same list. Why is this not true if `nums_1` and `nums_2` refer to the same **tuple** object?

```hint
It's because lists are a mutable type, but tuples are an immutable type. You cannot delete an element from a tuple at all, so there is no in-place change that could be seen through the other variable.
```

3. When does rebinding of a variable happen?

```hint
It happens when a new value is assigned to the variable. For example:

    zip_code = "97331"
    zip_code = "98225"

The first line creates a string object with the value "97331" and binds `zip_code` to it. The second line creates a new string object with the value "98225" and rebinds `zip_code` to that new object.
```
