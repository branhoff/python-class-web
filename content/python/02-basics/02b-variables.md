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

Dynamic typing can make for an easy introduction to programming, but can be
quite problematic as your codebase gets more and more complex and ever changing
variables are harder to track.

To help you keep your variables straight, you can use the `type` function to see
what type of value a variable currently refers to. See the example below:

:::cell id=variables-demo4
```python starter
my_number = 57
print("The type of my_number is ", type(my_number))
my_number = "fifty-seven"
print("The type of my_number is ", type(my_number))
```
:::

### Static typing

Static typing is a type of type checking that occurs before the code is
executed, at compile time. In a statically typed language, the data type of a
variable must be specified in advance and cannot be changed during runtime. This
helps to catch type-related bugs early in the development process, before the
code is executed.

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

Static typing can help catch bugs early in the development process and improve
the readability and maintainability of code. However, it can also make code less
flexible, as changing the type of a variable requires changing the code in
multiple places.

## Type hinting

Type hinting is a feature in Python that allows you to specify the expected data
type of an argument or a variable in a function or a class. We will only go over
variables for now. It is almost like a middle ground between dynamic typing and
static typing.

Type hinting is not used by the Python interpreter at runtime, but it can be
used by tools like IDEs, linters, and type checkers to provide better feedback
to the developer, improve code documentation, and catch potential bugs early in
the development process. In essence, it helps the readability and debugging
efforts but it will not prevent you from executing code when you have made an
assignment or reassignment mistake.

Type hints are specified using annotations placed immediately after the
argument, parameter, or variable declaration. For example:

```python
name: str = "Tuan Nguyen"
age: int = 33
```

In this example, the `: str` annotation after `name` indicates that `name` is a
string variable, and the `: int` annotation after `age` indicates that `age` is
an integer variable.

However, it is important to remember that type hints are technically only
suggestions, and the Python interpreter will not enforce them at runtime like a
compiler in a statically typed language. If you need to enforce the types of
arguments or variables, you can use a type checker like
[`mypy`](https://www.mypy-lang.org/).

## Best practice and what we will do going forward in the course

Type hinting is optional in Python, but it is considered a best practice to
provide type hints in your code whenever possible, especially in larger projects
where code documentation and maintainability are important. "Declaring" our
types is a far more common design pattern in programming languages, especially
in influential, widespread languages like C, C#, C++, and Java.

As such, we will treat type hinting as gospel and STRONGLY encourage its use
while utilizing it in the training materials and in the project solutions. We
believe this will help fulfill the aim of learning good, general programming
practices and not overly niche language specific knowledge.

Type hinting is an important tool that your future self will be glad you took the
time to implement in your program when you inevitably forget what you originally
intended only days after you wrote the code to begin with.

## Literals

When a value is written in the code without being assigned to a variable, it is
called a literal. A literal is a value that is represented directly in the code,
and is not assigned to a name (variable). Here are a few examples, which we
should be familiar with in Python:

```python
print(42)  # This line prints the integer literal 42
print('Hello, world!')  # This line prints the string literal 'Hello, world!'
```

In Python, literals are used to represent constant values in the code. They can
be assigned to variables, passed as arguments to functions, and used in other
ways just like any other value. It is important to note that literals in Python
are immutable, which means that their values cannot be changed once they are
created. If you need a value that can change, you need to use a variable instead.

## Exercises

Note: in our exercises today we are reminding you to add type hints. This is just
a courtesy. Future exercises and projects will simply assume you know to use type
hinting. Python does not inherently enforce this, so listen to your better
programming angels and use type hinting.

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
