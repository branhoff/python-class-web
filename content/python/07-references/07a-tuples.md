---
id: tuples
title: Tuples and Mutability
section: 7
---

## Tuples

Tuples are almost the same thing as a list, with one big use-case difference: they can't be changed. We'll go over that in the *Mutability vs. Immutability* section. There are two minor differences having to do with syntax, and one more significant difference. Let's talk about the syntax first. The first difference is that we use square brackets to create a new list, but we use parentheses to create a new tuple.

The other syntax difference is with tuples that contain only one value. In order for Python to know that it's a tuple, you have to include a trailing comma.

:::cell id=tuples-demo1
```python starter
some_primes = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31)
some_names = ("Groucho", "Harpo", "Chico", "Zeppo", "Karl")
some_stuff = (98, "Fido", -4.925, ("phantom", "tollbooth"))
zero = ()   # The empty tuple

one = ("just me")   # not a tuple (no comma)
one = ("just me",)  # this is a tuple

numbers = (3, 2, 1)
```
:::

Although parentheses are used for creating a new tuple, we still use square brackets when indexing or slicing a tuple.

Now let's look at type hinting for tuples.

## Type hinting with tuples

To type hint tuples in Python, you can use the `tuple` type and specify the types of the individual elements in the tuple.

:::cell id=tuples-demo2
```python starter
some_primes: tuple[int, int, int, int, int, int, int, int, int, int, int] = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31)
some_names: tuple[str, str, str, str, str] = ("Groucho", "Harpo", "Chico", "Zeppo", "Karl")
some_stuff: tuple[int, str, float, tuple[str, str]] = (98, "Fido", -4.925, ("phantom", "tollbooth"))
zero: tuple[()] = ()  # the empty tuple

one: tuple[str] = ("just me",)

numbers: tuple[int, int, int] = (3, 2, 1)
```
:::

In this code, each of the tuples is declared with a type hint using the `tuple` type, indicating the types of the individual elements in the tuple. The type hint syntax uses a comma-separated list of types within square brackets to specify the types of the elements. For example, `tuple[int, int, int]` specifies a tuple with three `int` elements. The `tuple[()]` syntax is used to specify an empty tuple.

Naturally, the syntax can be a little tedious if you have a large number of items to declare in your tuple.

You can use the `tuple` type with the `...` syntax to specify that the tuple can contain any number of elements of any type.

Here's an example of using the `tuple` type to type hint a tuple without declaring individual elements:

:::cell id=tuples-demo3
```python starter
some_primes: tuple[int, ...] = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31)
some_names: tuple[str, ...] = ("Groucho", "Harpo", "Chico", "Zeppo", "Karl")
some_stuff: tuple[int, str, float, tuple[str, ...]] = (98, "Fido", -4.925, ("phantom", "tollbooth"))
zero: tuple[()] = ()

one: tuple[str] = ("just me",)

numbers: tuple[int, ...] = (3, 2, 1)
```
:::

In this code, the `tuple` type is used with the `...` syntax to specify that each tuple can contain any number of elements of the specified type. For example, `tuple[int, ...]` specifies a tuple that can contain any number of `int` elements.

Using the `tuple` type with the `...` syntax can make your code more concise and easier to read, as well as make it more flexible if you need to change the number of elements in your tuples in the future.

Now let's finally talk about the big difference between lists and tuples in detail.

## Mutability vs. Immutability

The big important difference between lists and tuples is that lists are mutable, but tuples are immutable. Put more simply, you can change a list, but you can't change a tuple. So far we've seen ways to create new lists based on old lists, but we haven't looked at ways we can change an existing list, with one exception. The sort method doesn't create a new sorted version of the list; it rearranges the existing list into sorted order.

:::cell id=tuples-demo4
```python starter
numbers: list[int] = [3, 2, 1]
numbers.sort()
print(numbers)
```
:::

We can't call `sort()` on tuples because they're immutable.

### Mutating a List

How else can we mutate (modify) an existing list? Here are some lists we can demonstrate on.

:::cell id=tuples-demo5
```python starter
members: list[str] = ["Tommy", "Johnny", "Joey", "Dee Dee"]

birds: list[str] = ["starling", "blue jay", "mockingbird", "ostrich", "cuckoo"]
```
:::

We can assign a new value to an existing element of a list like this:

:::cell id=tuples-demo6
```python starter
members: list[str] = ["Tommy", "Johnny", "Joey", "Dee Dee"]
members[0] = "Marky"  # using indexing to mutate a list
print(members)
```
:::

We can also put a slice on the left side of the assignment. In this case the value on the right must be of an iterable type.

:::cell id=tuples-demo7
```python starter
birds: list[str] = ["starling", "blue jay", "mockingbird", "ostrich", "cuckoo"]
birds[1:3] = ["robin", "chickadee"]  # using slicing to mutate a list
print(birds)
```
:::

The number of elements being assigned can be different than the size of the slice being replaced.

:::cell id=tuples-demo8
```python starter
birds: list[str] = ["starling", "robin", "chickadee", "ostrich", "cuckoo"]
birds[1:3] = ["hummingbird", "wren", "emu", "penguin"]
print(birds)
```
:::

:::cell id=tuples-demo9
```python starter
birds: list[str] = ["starling", "hummingbird", "wren", "emu", "penguin", "ostrich", "cuckoo"]
birds[3:6] = ["cassowary"]
print(birds)
```
:::

:::cell id=tuples-demo10
```python starter
birds: list[str] = ["starling", "hummingbird", "wren", "cassowary", "cuckoo"]
birds[1:1] = ["kiwi", "big bird"]
print(birds)
```
:::

:::cell id=tuples-demo11
```python starter
birds: list[str] = ["starling", "kiwi", "big bird", "hummingbird", "wren", "cassowary", "cuckoo"]
birds[2:3] = []
print(birds)
```
:::

Notice that the slice `birds[1:1]` is empty, since a slice goes up to the second index, but doesn't include it.

The slice `birds[:]` would create a slice of the entire list, that is, it would create a copy of the list, which can also be done using `list()`:

:::cell id=tuples-demo12
```python starter
birds: list[str] = ["starling", "kiwi", "hummingbird", "wren", "cassowary", "cuckoo"]
birds_copy_1: list[str] = birds[:]
birds_copy_2: list[str] = list(birds)
print(birds_copy_1)
print(birds_copy_2)
```
:::

We can also append items to the end of a list using **append**, and delete items from a list using **del** (notice that append uses method notation, but del uses operator notation).

:::cell id=tuples-demo13
```python starter
vocab_words: list[str] = []
vocab_words.append("usagi")
vocab_words.append("inazuma")
vocab_words.append("hebi")
vocab_words.append("kitsune")
print(vocab_words)
```
:::

:::cell id=tuples-demo14
```python starter
vocab_words: list[str] = ["usagi", "inazuma", "hebi", "kitsune"]
del vocab_words[2]
print(vocab_words)
```
:::

### What about tuples?

None of these assignments will work with tuples because they cannot be mutated. But if tuples are essentially lists that we can't change, why use them at all? One reason is that there are times when an immutable type is required. For example, only immutable types can be used as keys in **dictionaries**, another way of storing and manipulating data that we'll talk about soon. Another reason is that if the elements shouldn't get changed, using a tuple instead of a list makes sure that won't happen by accident.

### Immutable Collections of Mutable Objects

If you have a tuple that contains mutable objects, the tuple itself is immutable because you cannot change which objects it contains, however the mutable objects it contains can still be mutated.

### Mutability and Immutability of Function Arguments

In the page on functions we saw that changing a parameter in a function did not change the value of the variable that was passed in the function call, and said we'd discuss the reason in a later module. The reason is because the variable we passed referred to an immutable type. Integers, like tuples, are immutable and cannot be changed. In fact, lists are the **only** mutable type we've looked at so far; all the others we've seen are immutable (objects of user-defined classes, which we looked at in module 5, are also mutable). If a variable refers to a list, and we pass that list to a function, then the function can change the actual list that was passed.

:::cell id=tuples-demo15
```python starter
def square_val(val: list[int]) -> None:
    val[0] = val[0] * val[0]
    print(val)

num_list: list[int] = [8]
square_val(num_list)
print(num_list)
```
:::

Here we see that the variable `num_list` got changed by the function we passed it to. The function could have changed the list in other ways such as adding or removing elements, but I wanted to show an example very similar to the one I showed in the page on functions, only using a list instead of an integer.

You might have an objection at this point. How can ints, floats, bools and strings be immutable? It seems like we've changed values of those types before. We'll take a look at this in the next section, which talks about object references and identity.

### Mutable Default Arguments

In Python, default arguments are evaluated only once, when the function is defined, and not each time the function is called. This can lead to unexpected behavior if the default argument is mutable, such as a list or dictionary.

For example, consider the following code:

:::cell id=tuples-demo16
```python starter
def add_to_new_list(val: int, lst: list[int] = []) -> list[int]:
    lst.append(val)
    return lst

print(add_to_new_list(1))  # prints [1]
print(add_to_new_list(1))  # prints [1, 1], not [1] as expected
```
:::

In this code, the `add_to_new_list` function has a default argument `lst` that is a mutable list. The first call creates the default list `lst` and appends a value to it. The second call appends to the same list `lst`, rather than creating a new, separate list.

To avoid this behavior, it is best to use an immutable type, such as `None`, as the default value for the argument. If a mutable type is desired, the default value should be set to `None`, and a new mutable object should be created inside the function if the default value is encountered.

:::cell id=tuples-demo17
```python starter
def add_to_new_list(val: int, lst: None | list[int] = None) -> list[int]:
    if lst is None:
        lst = []
    # we might write the above expression in one line instead
    # lst = lst or []
    lst.append(val)
    return lst

print(add_to_new_list(1))  # prints [1]
print(add_to_new_list(2))  # prints [2], as expected
```
:::

In this code, the `add_to_new_list` function has a default argument `lst` that is set to `None`. If the default value is encountered, a new list is created inside the function. This ensures that each call creates a separate, independent list, avoiding the unexpected behavior.

Resources: [Types: union](https://docs.python.org/3/library/stdtypes.html#types-union)

## Exercises

1. Does the following program contradict the idea that tuples are immutable? Why or why not?

```python
def tuple_madness(tup):
    return tup[1:]
```

```hint
No, it does not. `tuple_madness` returns a brand new tuple that contains the same items as `tup` except the first. The original `tup` is never modified, so immutability still holds.
```

:::cell id=tuples-ex2 kind=exercise
2. Write a function named `insert_front` that takes as a parameter a list and a value to add at the front of the list. It should not return anything; it should mutate the original list. For example, if the arguments passed to the function are `[9, -55, 37]` and `"bob"`, then after calling the function, the list should now be `["bob", 9, -55, 37]`.

```python starter
# Type code here
```

```python tests
lst = [9, -55, 37]
result = insert_front(lst, "bob")
assert result is None, "insert_front should not return anything; it should mutate the list in place."
assert lst == ["bob", 9, -55, 37], f"Expected ['bob', 9, -55, 37], but the list is {lst!r}."
lst2 = []
insert_front(lst2, 1)
assert lst2 == [1], f"Inserting into an empty list should give [1], but got {lst2!r}."
```

```python solution
def insert_front(a_list: list[object], new_element: object) -> None:
    a_list[0:0] = [new_element]
```

```hint
You don't need to return anything. Assign a one-element list to the empty slice `a_list[0:0]`, or use `a_list.insert(0, new_element)`.
```
:::

:::cell id=tuples-ex3 kind=exercise
3. Write a function named `delete_last` that takes as a parameter a list and removes the last element from that list. It should not return anything; it should mutate the original list. For example, if the list passed to the function is `[7, "joe", "apple", 9.81, False]`, then after calling the function, the list should be `[7, "joe", "apple", 9.81]`.

```python starter
# Type code here
```

```python tests
lst = [7, "joe", "apple", 9.81, False]
result = delete_last(lst)
assert result is None, "delete_last should not return anything; it should mutate the list in place."
assert lst == [7, "joe", "apple", 9.81], f"Expected [7, 'joe', 'apple', 9.81], but the list is {lst!r}."
lst2 = [1, 2]
delete_last(lst2)
assert lst2 == [1], f"After deleting the last element of [1, 2] you should have [1], but got {lst2!r}."
```

```python solution
def delete_last(some_list: list[object]) -> None:
    del some_list[-1]
```

```hint
Use the `del` operator with the index `-1`, which refers to the last element.
```
:::
