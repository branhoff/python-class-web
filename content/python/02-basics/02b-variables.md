---
id: variables
title: Variables and Assignment
section: 2
---

A variable is a name that refers to a particular value. It is called a variable
because the value it refers to can change. An assignment statement assigns a
value to a variable. If a variable of that name does not yet exist, then one is
created. Assignment statements look like this:

:::cell id=variables-demo1
```python starter
radius = 19.2
first_name = "Jane"
is_even = True
num_1 = 12
```
:::

Each of these statements causes the variable on the left side to refer to the
value on the right side. It is also possible to have a variable on the right
side of an assignment statement, in which case the variable on the left side
will now refer to the same value as the variable on the right side. After the
statement below, `num_1` and `num_2` will both refer to the value 12.

:::cell id=variables-demo2
```python starter
num_1 = 12
num_2 = num_1
print(num_2)
```
:::

You can print the value that a variable refers to like so:

:::cell id=variables-demo3
```python starter
radius = 19.2
first_name = "Jane"
is_even = True
print(radius)
print(first_name)
print("The value of is_even is", is_even)
```
:::

Variable names should be descriptive of their purpose to enhance the readability
of your code. They must start with a letter or an underscore. Subsequent
characters can be numbers, letters or underscores. Variable names are case
sensitive, so radius, Radius, raDius, and so on would be interpreted as
different variables. A variable name can be almost anything, as long as it is
not one of Python's reserved keywords. Every programming language has a few
words that are reserved for special operations and cannot be reused for
variables.

| | | | | |
| --- | --- | --- | --- | --- |
| False | class | finally | is | return |
| True | continue | for | lambda | try |
| None | def | from | nonlocal | while |
| and | del | global | not | with |
| as | elif | if | or | yield |
| assert | else | import | pass | |
| break | except | in | raise | |

## Static typing vs. dynamic typing

### Dynamic typing

Python is a dynamically typed language, meaning variables can change from type
to type with any new assignment. For example, this is a legal statement in
Python:

```python
my_number = 57

my_number = 'fifty-seven'
```

Dynamic typing makes programming easy to start, but it becomes a problem as
your code grows, because variables that keep changing type are harder to track.

To keep your variables straight, use the `type` function to see what type of
value a variable currently refers to. See the example below:

:::cell id=variables-demo4
```python starter
my_number = 57
print("The type of my_number is ", type(my_number))
my_number = "fifty-seven"
print("The type of my_number is ", type(my_number))
```
:::

### Static typing

Static typing means types are checked before the code runs, when the program is
translated into machine code (compile time). In a statically typed language, you
must declare the type of a variable in advance, and it cannot change while the
program runs. This catches type-related bugs early, before the code is run.

Static typing in the programming language C++, for example, would look something
like:

```cpp
std::string name = "John Doe";
int age = 30;
```

Because C++ has static typing, these variables cannot be assigned values of a
different type later on in the code. For example, if you did this:

```cpp
name = 30;  // This would raise a compile-time error
```

Static typing also makes code easier to read and maintain, because you always
know what kind of value a variable holds. The cost is flexibility: a variable
cannot hold a different type later. That limit is usually a good thing, since a
variable that switches between, say, a string and a number is hard to follow.

## Type hinting

Type hinting lets you state the expected data type of a variable (or of a
function argument, which we cover later). It is a middle ground between dynamic
typing and static typing.

The Python interpreter ignores type hints when the program runs. Tools such as
IDEs, linters, and type checkers use them to give better feedback, document the
code, and catch bugs early. Hints help readability and debugging, but they will
not stop your code from running when you assign the wrong type of value.

Type hints are specified using annotations placed immediately after the
argument, parameter, or variable declaration. For example:

```python
name: str = "Tuan Nguyen"
age: int = 33
```

In this example, the `: str` annotation after `name` indicates that `name` is a
string variable, and the `: int` annotation after `age` indicates that `age` is
an integer variable.

Remember that type hints are only suggestions. Unlike a compiler for a
statically typed language, the Python interpreter does not enforce them. To
check the types of arguments or variables, you can use a type checker like
[`mypy`](https://www.mypy-lang.org/).

## Best practice and what we will do going forward in the course

Type hinting is optional in Python, but it is considered a best practice to
provide type hints in your code whenever possible, especially in larger projects
where code documentation and maintainability are important. "Declaring" our
types is a far more common design pattern in programming languages, especially
in influential, widespread languages like C, C#, C++, and Java.

As such, we use type hints throughout the lessons and project solutions, and we
strongly encourage you to use them too. We believe this teaches good, general
programming practice rather than niche, language-specific knowledge.

Type hints also help your future self. Days after writing code, you will forget
what you intended, and the hints will remind you.

## Literals

When a value is written in the code without being assigned to a variable, it is
called a literal. A literal is a value written directly in the code, not
assigned to a name (variable). Here are a few examples:

```python
print(42)  # This line prints the integer literal 42
print('Hello, world!')  # This line prints the string literal 'Hello, world!'
```

Literals represent fixed values in the code. You can assign them to variables,
pass them to functions, and use them like any other value. A literal's value
cannot be changed. If you need a value that can change, use a variable.

## Exercises

Note: these exercises remind you to add type hints. Future exercises and
projects will assume you know to use them. Python does not enforce type hints,
so make it a habit anyway.

:::cell id=variables-ex1 kind=exercise
1. Assign the value `3.14159` to a variable named `pi` with the appropriate type hint, and then print out the value of that variable.

```python starter
# Type code here
```

```python tests
assert "pi" in dir(), "You should create a variable named pi."
assert pi == 3.14159, f"pi should be 3.14159, but it is {pi!r}."
assert stdout.strip() == "3.14159", f"Your program should print 3.14159, but it printed {stdout.strip()!r}."
```

```python solution
pi: float = 3.14159
print(pi)
```
:::

:::cell id=variables-ex2 kind=exercise
2. Assign the value `"Nguyen"` to a variable named `last_name` with an appropriate type hint, and then print out the value of that variable.

```python starter
# Type code here
```

```python tests
assert "last_name" in dir(), "You should create a variable named last_name."
assert last_name == "Nguyen", f"last_name should be 'Nguyen', but it is {last_name!r}."
assert stdout.strip() == "Nguyen", f"Your program should print Nguyen, but it printed {stdout.strip()!r}."
```

```python solution
last_name: str = "Nguyen"
print(last_name)
```
:::

:::cell id=variables-ex3 kind=exercise
3. Assign the value `16.4` to a variable named `length` with an appropriate type hint, and then print out the type of the value that variable refers to.

```python starter
# Type code here
```

```python tests
assert "length" in dir(), "You should create a variable named length."
assert length == 16.4, f"length should be 16.4, but it is {length!r}."
assert stdout.strip() == "<class 'float'>", f"Your program should print <class 'float'>, but it printed {stdout.strip()!r}."
```

```python solution
length: float = 16.4
print(type(length))
```
:::

:::cell id=variables-ex4 kind=exercise
4. Assign the value `"blacksmith"` to a variable named `occupation` with an appropriate type hint, and then print out the type of the value that variable refers to.

```python starter
# Type code here
```

```python tests
assert "occupation" in dir(), "You should create a variable named occupation."
assert occupation == "blacksmith", f"occupation should be 'blacksmith', but it is {occupation!r}."
assert stdout.strip() == "<class 'str'>", f"Your program should print <class 'str'>, but it printed {stdout.strip()!r}."
```

```python solution
occupation: str = "blacksmith"
print(type(occupation))
```
:::
