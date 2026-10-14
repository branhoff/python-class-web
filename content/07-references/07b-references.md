---
id: references
title: Object References and Identity
section: 7
---

## Introduction

Remember how variables refer to values, and how all values in Python are objects? It's possible for two or more variables to refer to the same object. We can tell whether this is the case by using the `is` operator.

:::cell id=references-demo1
```python starter
num_1: int = 1000
num_2: int = 1000
```
:::

Test whether `num_1` and `num_2` are equal:

:::cell id=references-demo2
```python starter
num_1 == num_2
```
:::

Test whether `num_1` and `num_2` refer to the same object:

:::cell id=references-demo3
```python starter
num_1 is num_2
```
:::

Now make `num_1` and `num_2` refer to the same object and check again:

:::cell id=references-demo4
```python starter
num_1 = num_2
num_1 is num_2
```
:::

Make `num_2` refer to a different object:

:::cell id=references-demo5
```python starter
num_2 = -89
num_1 is num_2
```
:::

The first line creates an object for the value `1000` and **binds** the variable `num_1` to it. The second line creates another object for the value `1000` and binds the variable `num_2` to it. Next we use the `==` operator to test whether `num_1` and `num_2` refer to values that are equal, which they do.

Then we use the `is` operator to test whether `num_1` and `num_2` refer to (are bound to) the same object, which they aren't. Next we assign `num_2` to `num_1`. This **rebinds** `num_1`, so that now it refers to the same object that `num_2` does. When we test again whether `num_1` and `num_2` refer to the same object, we see that they now do.

Next we have another assignment statement, which creates an object for the value `-89` and rebinds `num_2` to refer to that object. Now we see that `num_1` and `num_2` no longer refer to the same object. Assigning `-89` to `num_2` did not change the object for the value `1000`, which `num_1` still refers to. We cannot change the value of an integer object, because integers are immutable, but we can rebind a variable to a different object.

You can think of a variable as like a sticky note that you can stick to different objects. You can have multiple sticky notes attached (bound) to the same object, and you can take a sticky note off one object and attach it to another object, even an object of another type.

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
num_list_1 == num_list_2
```
:::

Now make them refer to the same object:

:::cell id=references-demo8
```python starter
num_list_1 = num_list_2
num_list_1 is num_list_2
```
:::

Make `num_list_2` refer to a different object:

:::cell id=references-demo9
```python starter
num_list_2 = [23, -1, 19]
num_list_1 is num_list_2
```
:::

This example behaves the same way as the previous example. So far, being mutable doesn't seem to make a difference. However, let's try something a little different.

Make `num_list_1` and `num_list_2` refer to the same object:

:::cell id=references-demo10
```python starter
num_list_1 = [3, 17, 12]
num_list_2 = num_list_1
num_list_1 is num_list_2
```
:::

Change the object that `num_list_1` and `num_list_2` both refer to:

:::cell id=references-demo11
```python starter
num_list_2[0] = 99
```
:::

:::cell id=references-demo12
```python starter
num_list_1
```
:::

:::cell id=references-demo13
```python starter
num_list_1 is num_list_2
```
:::

In this example, changing `num_list_2` does **not** result in creating a new object and rebinding `num_list_2` to that object. Instead, it mutates the existing list object, which `num_list_1` and `num_list_2` both still refer to. We can see that **there is a difference between rebinding a variable, and mutating the value that a variable refers to**.

> Diagram: both `num_list_1` and `num_list_2` are drawn as separate variable names, each with an arrow pointing at the same single list object `[99, 17, 12]`. Because the two arrows land on one shared object, mutating the list through either name is visible through the other.

## Changing Parameters - Mutating Values

This helps explain what happens when a function "changes" one of its parameters. Let's revisit a couple of examples we've seen previously:

:::cell id=references-demo14
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

## Shallow Copies vs. Deep Copies

We can make a copy of a list like this:

:::cell id=references-demo15
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
```
:::

`copied_list` now holds a copy of `original_list`, but it's just a **shallow copy**.

:::cell id=references-demo16
```python starter
original_list is copied_list
```
:::

:::cell id=references-demo17
```python starter
original_list[0] is copied_list[0]
```
:::

:::cell id=references-demo18
```python starter
original_list[1] is copied_list[1]
```
:::

We can see that although `original_list` and `copied_list` refer to different objects, the elements of `original_list` and the elements of `copied_list` refer to the same objects. If you mutate the list referenced by `original_list[1]`, and then print `copied_list`:

:::cell id=references-demo19
```python starter
original_list[1][0] = 99
copied_list
```
:::

You'll see that `copied_list` shows that change as well.

> Diagram: `original_list` and `copied_list` are two separate outer list objects, so each has its own box. But their second element (the inner list `[1, 2, 3]`) is a single shared object: the second slot of both outer lists has an arrow pointing to that one inner list. Their first element (the int `1`) is also shared. Mutating the shared inner list is therefore visible through both outer lists.

A **deep copy**, however, would be an entirely separate copy (no shared sub-elements or sub-sub-elements, etc.). If we had made a deep copy in this example instead of a shallow copy, it would look like this:

> Diagram: `original_list` and `copied_list` are separate outer list objects, and this time their inner lists are also separate objects. Every slot in `copied_list` points at its own copy, so there are no shared arrows between the two structures at any level. Mutating one structure cannot affect the other.

We could have achieved a deep copy by also making a copy of any sublists (or other mutable sub-elements):

:::cell id=references-demo20
```python starter
copied_list = list(original_list)
copied_list[1] = list(original_list[1])
```
:::

There is a Python module that can be used to make deep copies, but we won't cover that here.

Continuing with our shallow copy example, if you enter the following:

:::cell id=references-demo21
```python starter
original_list[0] = 5
copied_list
```
:::

You'll see that `copied_list` hasn't changed. That's because we're not mutating the object referred to by `original_list[0]` (it's an int, and ints are immutable). Instead, we're rebinding `original_list[0]` to a new int object.

> Diagram: starting from the shallow copy, `original_list[0]` now has an arrow pointing at a new int object `5`, while `copied_list[0]` still points at the old int object `1`. The inner list in the second slot is still shared by both outer lists. Rebinding one slot of `original_list` does not touch `copied_list`.

We were able to mutate the object referred to by `original_list[1]` because it's a list, and lists are mutable. If we wanted, we could rebind `original_list[1]`, like this:

:::cell id=references-demo22
```python starter
original_list[1] = [2, 4, 6, 8]
```
:::

In which case `copied_list` wouldn't be affected, because we're not mutating a shared list, but instead rebinding `original_list[1]` to a new list object.

## Automatic Sharing

Sometimes Python is able to figure out that it can save memory by automatically making variables refer to the same object.

:::cell id=references-demo23
```python starter
num_1 = 5
num_2 = 5
num_1 is num_2
```
:::

:::cell id=references-demo24
```python starter
name_1 = "Betty"
name_2 = "Betty"
name_1 is name_2
```
:::

This only ever happens with (equal) immutable values, so it can't affect your code's results.

*Kind of interesting note about Python internals:*

You might notice that this example using 5 gives you different results than the earlier example that used 1000. It depends too on whether you're running the code in the interactive console or running it as a script. In the interactive console, Python internally keeps an array of integer objects for -5 through 256. When you create an int in that range, you actually just get back a reference to the existing object. So if you do that with two (or more) variables, they will then refer to the same object. However, if you type that code as a script in an IDE and then try running it with different values, you can see that any integer values will be shared, not just from -5 to 256. This is because when you're running a script, the Python interpreter can look through the entire script before running it, so it knows all the values that could be shared.

## Exercises

These exercises are questions to think through rather than code to write. Try to answer each in your own words first, then open the hint to check your reasoning.

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
