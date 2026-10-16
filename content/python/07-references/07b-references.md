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

## Shallow Copies vs. Deep Copies

We can make a copy of a list like this:

:::cell id=references-demo14
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
```
:::

`copied_list` now holds a copy of `original_list`, but it's just a **shallow copy**. The outer list is a separate object:

:::cell id=references-demo15
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
print(original_list is copied_list)
```
:::

But the elements are shared. The first element (the int) is the same object in both:

:::cell id=references-demo16
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
print(original_list[0] is copied_list[0])
```
:::

And so is the second element (the inner list):

:::cell id=references-demo17
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
print(original_list[1] is copied_list[1])
```
:::

We can see that although `original_list` and `copied_list` refer to different objects, the elements of `original_list` and the elements of `copied_list` refer to the same objects. If you mutate the list referenced by `original_list[1]`, and then print `copied_list`:

:::cell id=references-demo18
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
original_list[1][0] = 99
print(copied_list)
```
:::

You'll see that `copied_list` shows that change as well.

> Diagram: `original_list` and `copied_list` are two separate outer list objects, so each has its own box. But their second element (the inner list `[1, 2, 3]`) is a single shared object: the second slot of both outer lists has an arrow pointing to that one inner list. Their first element (the int `1`) is also shared. Mutating the shared inner list is therefore visible through both outer lists.

A **deep copy**, however, would be an entirely separate copy (no shared sub-elements or sub-sub-elements, etc.). If we had made a deep copy in this example instead of a shallow copy, it would look like this:

> Diagram: `original_list` and `copied_list` are separate outer list objects, and this time their inner lists are also separate objects. Every slot in `copied_list` points at its own copy, so there are no shared arrows between the two structures at any level. Mutating one structure cannot affect the other.

We could have achieved a deep copy by also making a copy of any sublists (or other mutable sub-elements). Here the inner lists end up as separate objects:

:::cell id=references-demo19
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list = list(original_list)
copied_list[1] = list(original_list[1])
print(original_list[1] is copied_list[1])
```
:::

There is a Python module that can be used to make deep copies, but we won't cover that here.

Continuing with our shallow copy example, if you rebind `original_list[0]` and then print `copied_list`:

:::cell id=references-demo20
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
original_list[0] = 5
print(copied_list)
```
:::

You'll see that `copied_list` hasn't changed. That's because we're not mutating the object referred to by `original_list[0]` (it's an int, and ints are immutable). Instead, we're rebinding `original_list[0]` to a new int object.

> Diagram: starting from the shallow copy, `original_list[0]` now has an arrow pointing at a new int object `5`, while `copied_list[0]` still points at the old int object `1`. The inner list in the second slot is still shared by both outer lists. Rebinding one slot of `original_list` does not touch `copied_list`.

We were able to mutate the object referred to by `original_list[1]` because it's a list, and lists are mutable. If we wanted, we could rebind `original_list[1]` instead, and `copied_list` wouldn't be affected, because we're not mutating a shared list, but instead rebinding `original_list[1]` to a new list object:

:::cell id=references-demo21
```python starter
original_list: list[int | list[int]] = [1, [1, 2, 3]]
copied_list: list[int | list[int]] = list(original_list)
original_list[1] = [2, 4, 6, 8]
print(copied_list)
```
:::

:::cell id=predict-alias-or-copy kind=check
**Check your understanding.** Predict the result. One of the names is an alias and one is a copy.

```python
a = [1, 2, 3]
b = a
c = list(a)
a.append(4)
```

Predict what each variable holds after the program finishes. The program is not run for you. Change the values below to your predictions:

- `final_a` is the value of `a` at the end
- `final_b` is the value of `b` at the end
- `final_c` is the value of `c` at the end

```python starter
final_a = None
final_b = None
final_c = None
```

```python tests
program = """
a = [1, 2, 3]
b = a
c = list(a)
a.append(4)
"""
real = {}
exec(program, real)
assert final_a == real["a"], "final_a is not right. `a.append(4)` changes the list `a` refers to."
assert final_b == real["b"], "final_b is not right. `b = a` gives the list a second name."
assert final_c == real["c"], "final_c is not right. `list(a)` made a separate list before the append."
```

```python solution
final_a = [1, 2, 3, 4]
final_b = [1, 2, 3, 4]
final_c = [1, 2, 3]
```

```hint
`b` is another name for the same list as `a`, so it sees the append. `c` is a copy made before the append, so it does not.
```
:::

## Automatic Sharing

Sometimes Python is able to figure out that it can save memory by automatically making variables refer to the same object.

:::cell id=references-demo22
```python starter
num_1: int = 5
num_2: int = 5
print(num_1 is num_2)
```
:::

:::cell id=references-demo23
```python starter
name_1: str = "Betty"
name_2: str = "Betty"
print(name_1 is name_2)
```
:::

This only ever happens with (equal) immutable values, so it can't affect your code's results.

*A note about Python internals:*

You might notice that this example using 5 gives a different result from the earlier example that used 1000. It depends too on whether you're running the code in the interactive console or running it as a script. In the interactive console, Python internally keeps an array of integer objects for -5 through 256. When you create an int in that range, you actually just get back a reference to the existing object. So if you do that with two (or more) variables, they will then refer to the same object. However, if you type that code as a script in an IDE and then try running it with different values, you can see that any integer values will be shared, not just from -5 to 256. This is because when you're running a script, the Python interpreter can look through the entire script before running it, so it knows all the values that could be shared.

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

:::cell id=predict-shallow-copy kind=exercise
4. Predict the result. The copy is a shallow copy.

```python
original = [1, [2, 3]]
copied = list(original)
copied[0] = 99
copied[1].append(4)
```

Predict what each variable holds after the program finishes. The program is not run for you. Change the values below to your predictions:

- `final_original` is the value of `original` at the end
- `final_copied` is the value of `copied` at the end

```python starter
final_original = None
final_copied = None
```

```python tests
program = """
original = [1, [2, 3]]
copied = list(original)
copied[0] = 99
copied[1].append(4)
"""
real = {}
exec(program, real)
assert final_original == real["original"], "final_original is not right. Which parts of the two lists are shared?"
assert final_copied == real["copied"], "final_copied is not right. Replacing an item and changing an inner list are different."
```

```python solution
final_original = [1, [2, 3, 4]]
final_copied = [99, [2, 3, 4]]
```

```hint
`copied[0] = 99` replaces an item in the copy only. `copied[1]` is the same inner list as `original[1]`, so appending to it shows up in both.
```
:::
