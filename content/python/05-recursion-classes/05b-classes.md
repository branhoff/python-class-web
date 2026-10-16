---
id: classes
title: Classes and Objects
section: 5
---

## Introduction

Here's a simple example class:

:::cell id=classes-demo1
```python starter
class Pet:
    """Represents a pet that has a species and a name."""

    def __init__(self, species: str, name: str):
        """Creates a new Pet with the specified species and name."""
        self.species: str = species
        self.name: str = name
```
:::

The `class` keyword defines a class. The name of a class should start with a capital letter. A class should have a docstring that describes its purpose and anything else someone needs to know to use it. Functions that are part of a class are called **methods**. This `Pet` class has a single method with the special name `__init__` (two underscores on either side). It runs when a `Pet` is created and stores the species and name you passed in. The species and name are the **data members** (also called fields or attributes) of the `Pet` class. The special parameter `self` refers to the object being created. You don't call `__init__` by name. Instead you use the name of the class. You also don't pass an argument for `self`, Python does that for you. Confused? Some examples should help. Let's create a couple of Pets:

```python
pet_1 = Pet("capybara", "Beatrice")
pet_2 = Pet("kangaroo", "Joey")
```

Each of these lines creates a new `Pet` **object**. The `Pet` class is a general blueprint for pets. To create a specific `Pet` object, we use the name of the class as shown above, which automatically calls `__init__`. An object is also called an "instance" of a class, and creating an object is called "instantiating" the class. Once we've created an object, we can access its attributes using dot notation:

```python
print(pet_1.species)
print(pet_1.name)
```

We also use dot notation to call an object's methods, but our `Pet` class has none besides `__init__`, so let's look at another example:

:::cell id=classes-demo2
```python starter
class Rectangle:
    """Represents a two-dimensional rectangle with methods to calculate its
    area and perimeter."""

    def __init__(self, width: float, height: float):
        """Creates a Rectangle object with the specified width and height."""
        self.width: float = width
        self.height: float = height

    def area(self) -> float:
        """Returns the area of the rectangle."""
        return self.width * self.height

    def perimeter(self) -> float:
        """Returns the perimeter of the rectangle."""
        return 2 * self.width + 2 * self.height
```
:::

Notice that the `area` and `perimeter` methods have only the `self` parameter. They don't need `width` or `height` passed in, because those are already part of the object and can be reached through `self`. Now that we've defined the `Rectangle` class, here's an example of using it:

:::cell id=classes-demo3
```python starter
class Rectangle:
    """Represents a two-dimensional rectangle with methods to calculate its
    area and perimeter."""

    def __init__(self, width: float, height: float):
        """Creates a Rectangle object with the specified width and height."""
        self.width: float = width
        self.height: float = height

    def area(self) -> float:
        """Returns the area of the rectangle."""
        return self.width * self.height

    def perimeter(self) -> float:
        """Returns the perimeter of the rectangle."""
        return 2 * self.width + 2 * self.height


rect = Rectangle(2.5, 3)
print("area = ", rect.area())
print("perimeter = ", rect.perimeter())
```
:::

## How do you know what to put in a class?

When designing a class, we decide which features of the thing we're representing matter for our purposes. That tells us what data and functions the class needs. For example, if we're concerned with selling cars, price is a relevant feature. If we're only concerned with driving cars, it isn't.

## "Private" class members

Some languages have a keyword (`private` in Java and C++) that stops code outside a class from accessing a data member or method. Methods of the class can still use it. Python has no such keyword. Instead, it has a convention: a data member or method whose name begins with an underscore should be treated as private, even though Python doesn't enforce it.

Here's an example of a bank account class that has private data members:

:::cell id=classes-demo4
```python starter
class BankAccount:
    """Represents a bank account that the user can deposit money to and
    withdraw money from."""

    def __init__(self, account_ID: str, balance: float):
        """Creates a bank account object with an account ID and balance."""
        self._account_ID: str = account_ID
        self._balance: float = balance

    def get_account_ID(self) -> str:
        """Returns the account ID."""
        return self._account_ID

    def set_account_ID(self, new_ID: str) -> None:
        """Sets the account ID to a new value."""
        self._account_ID = new_ID

    def get_balance(self) -> float:
        """Returns the current balance."""
        return self._balance

    def deposit(self, amount: float) -> None:
        """Deposits the specified amount into the account."""
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        """Withdraws the specified amount from the account."""
        self._balance -= amount
```
:::

Notice that for class names, instead of separating words with underscores ("snake case"), we [follow Python convention](https://peps.python.org/pep-0008/#class-names) and start each new word with a capital letter ("CapWords", sometimes called "Pascal case"). Here's an example of using the `BankAccount` class:

:::cell id=classes-demo5
```python starter
class BankAccount:
    """Represents a bank account that the user can deposit money to and
    withdraw money from."""

    def __init__(self, account_ID: str, balance: float):
        """Creates a bank account object with an account ID and balance."""
        self._account_ID: str = account_ID
        self._balance: float = balance

    def get_account_ID(self) -> str:
        """Returns the account ID."""
        return self._account_ID

    def set_account_ID(self, new_ID: str) -> None:
        """Sets the account ID to a new value."""
        self._account_ID = new_ID

    def get_balance(self) -> float:
        """Returns the current balance."""
        return self._balance

    def deposit(self, amount: float) -> None:
        """Deposits the specified amount into the account."""
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        """Withdraws the specified amount from the account."""
        self._balance -= amount


account_1: BankAccount = BankAccount("235349", 730.29)
print("account ID =", account_1.get_account_ID())
account_1.set_account_ID("983341")
print("account ID =", account_1.get_account_ID())
print("balance =", account_1.get_balance())
account_1.deposit(200.11)
print("balance =", account_1.get_balance())
account_1.withdraw(500.00)
print("balance =", account_1.get_balance())
```
:::

If we want other code to be able to access a private data member, we provide get and/or set methods. A get method returns the current value of a data member. A set method takes a parameter and stores it in the data member. The usual naming convention is `get_` or `set_` followed by the name of the data member. For the account ID we provided both. For the balance we provided only a get method, since the balance changes through the deposit and withdraw methods.

:::cell id=predict-two-counters kind=exercise
**Check your understanding.** Predict the result. Each object keeps its own count.

```python
class Counter:
    def __init__(self, start):
        self._count = start

    def add(self, amount):
        self._count += amount

    def get_count(self):
        return self._count

a = Counter(10)
b = Counter(10)
a.add(5)
b.add(1)
a.add(b.get_count())
x = a.get_count()
y = b.get_count()
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
class Counter:
    def __init__(self, start):
        self._count = start

    def add(self, amount):
        self._count += amount

    def get_count(self):
        return self._count

a = Counter(10)
b = Counter(10)
a.add(5)
b.add(1)
a.add(b.get_count())
x = a.get_count()
y = b.get_count()
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Track a and b separately after every line."
assert final_y == real["y"], "final_y is not right. Only b.add(1) changes b."
```

```python solution
final_x = 26
final_y = 11
```

```hint
Each object has its own _count, and a method only changes the object it is called on.
```
:::


You might wonder why we would use private data members if it means writing more methods. The reason is that it lets us control access. If we don't want a data member to be accessed, we don't write get or set methods for it. If a data member should only hold certain values, the set method can check for that. If a data member is public, it can be changed to anything from anywhere, which makes your program harder to understand and debug. Controlling access this way is called **information hiding** (or data hiding).

Information hiding also separates the interface from the implementation. The interface is the names and parameters of the public functions. The implementation is the code inside those functions, plus any private data members and private functions. If users' code reaches into the implementation, it comes to depend on those details, and changing the implementation later will break it. With a defined interface, the implementation can change as long as the interface stays the same.

Methods can be private in the same way. A method should be private if it is only for internal use by the class and not part of how we expect users to work with it. For example, suppose a `Fraction` class keeps every fraction in reduced form. It could have a `greatest_common_divisor()` method for its own use. We wouldn't expect users to ask a `Fraction` for the gcd of two integers. We expect them to do Fraction-like things, such as printing a `Fraction` or multiplying it by another. Finding the gcd is an implementation detail that can be hidden from users.

## Everything is an object

In Python, everything is an object. Strings, integers, and all other values are objects. Functions are objects. Even the special value `None` is an object. Object-oriented design is a useful way to organize code. It can feel abstract at first, but it is worth learning.

## Printing objects of user-defined classes

If you try to print an object of a user-defined class, you'll get something like this:

```python
print(account_1)
<__main__.BankAccount object at 0x103506d30>
```

By default, Python only shows which class the object belongs to and its address in memory. To print the values of the data members, access them in the print statement, as shown earlier. There are ways to customize how an object prints, but that is for a future lesson.

## Exercises

:::cell id=classes-ex1 kind=exercise
1. Define a class named `HourlyWorker` that has three private data members: `_name`, `_ID`, and `_wage`. The class should have a docstring and an `__init__` method. The parameters to the `__init__` method should be in the order listed above.

```python starter
# Type code here
```

```python tests
w = HourlyWorker("Alice", "123", 25.0)
assert w._name == "Alice", "HourlyWorker should store its first argument in _name."
assert w._ID == "123", "HourlyWorker should store its second argument in _ID."
assert w._wage == 25.0, "HourlyWorker should store its third argument in _wage."
```

```python solution
class HourlyWorker:
    """Represents an hourly worker with a name, ID and wage."""

    def __init__(self, name: str, ID: str, wage: float):
        self._name: str = name
        self._ID: str = ID
        self._wage: float = wage
```

```hint
The `__init__` method takes `self`, `name`, `ID`, and `wage`, and assigns each one to a data member whose name starts with an underscore.
```
:::

:::cell id=classes-ex2 kind=exercise
2. Define a class named `Box` that has three private data members: `_length`, `_width`, and `_height`. The class should have a docstring and an `__init__` method. The parameters to the `__init__` method should be in the order listed above. The class should also have a method named `volume` that returns the *volume* of the `Box`, and a method named `surface_area` that returns the *surface area* of the `Box`.

```python starter
# Type code here
```

```python tests
b = Box(2, 3, 4)
assert b._length == 2, "Box should store its first argument in _length."
assert b._width == 3, "Box should store its second argument in _width."
assert b._height == 4, "Box should store its third argument in _height."
assert b.volume() == 24, f"Box(2, 3, 4).volume() should be 24, but it returned {b.volume()!r}."
assert b.surface_area() == 52, f"Box(2, 3, 4).surface_area() should be 52, but it returned {b.surface_area()!r}."
```

```python solution
class Box:
    """Represents a box with a length, width and height."""

    def __init__(self, length: float, width: float, height: float):
        self._length: float = length
        self._width: float = width
        self._height: float = height

    def volume(self) -> float:
        return self._length * self._width * self._height

    def surface_area(self) -> float:
        l: float = self._length
        w: float = self._width
        h: float = self._height
        return 2 * ((l * w) + (l * h) + (w * h))
```

```hint
Volume is length times width times height. Surface area is `2 * (length*width + length*height + width*height)`.
```
:::

:::cell id=predict-tank-levels kind=exercise
3. Predict the result. Notice which methods change the object and which only return a value.

```python
class Tank:
    def __init__(self, level):
        self._level = level

    def fill(self, amount):
        self._level += amount

    def level_after(self, amount):
        return self._level + amount

    def get_level(self):
        return self._level

t1 = Tank(20)
t2 = Tank(5)
t1.level_after(10)
t2.fill(t1.get_level())
x = t1.get_level()
y = t2.get_level()
```

Set `final_x` and `final_y` to the values the program ends with.

```python starter
final_x = None
final_y = None
```

```python tests
program = """
class Tank:
    def __init__(self, level):
        self._level = level

    def fill(self, amount):
        self._level += amount

    def level_after(self, amount):
        return self._level + amount

    def get_level(self):
        return self._level

t1 = Tank(20)
t2 = Tank(5)
t1.level_after(10)
t2.fill(t1.get_level())
x = t1.get_level()
y = t2.get_level()
"""
real = {}
exec(program, real)
assert final_x == real["x"], "final_x is not right. Does level_after change t1?"
assert final_y == real["y"], "final_y is not right. t2.fill adds t1's current level to t2."
```

```python solution
final_x = 20
final_y = 25
```

```hint
A method that only returns a value leaves the data member as it was.
```
:::
