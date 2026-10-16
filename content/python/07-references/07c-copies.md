---
id: copies
title: Copies and Shared Objects
section: 7
---

This page continues from Object References and Identity. It covers what happens when you copy a list, the difference between a shallow and a deep copy, and the cases where Python makes variables share an object for you.

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

You might notice that this example using 5 gives a different result from the example that used 1000 on the previous page. It depends too on whether you're running the code in the interactive console or running it as a script. In the interactive console, Python internally keeps an array of integer objects for -5 through 256. When you create an int in that range, you actually just get back a reference to the existing object. So if you do that with two (or more) variables, they will then refer to the same object. However, if you type that code as a script in an IDE and then try running it with different values, you can see that any integer values will be shared, not just from -5 to 256. This is because when you're running a script, the Python interpreter can look through the entire script before running it, so it knows all the values that could be shared.

## Exercises

:::cell id=predict-shallow-copy kind=exercise
1. Predict the result. The copy is a shallow copy.

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
