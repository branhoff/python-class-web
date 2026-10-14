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

The `class` keyword is used to define a class. The name of a class should start with a capital letter. Classes should have a docstring that describes their purpose and any additional information someone might need to know when using the class. Functions that are part of a class are often referred to as **methods**. This `Pet` class only has a single method with the special name `__init__` (two underscores on either side). This method creates a `Pet` with whatever species and name you passed to that method. The species and name are the **data members** (or fields or attributes) of the `Pet` class. The special parameter `self` refers to the object itself. You don't call the `__init__` method by name, instead you use the name of the class. You also don't pass an argument for `self`, that's done automatically for you. Confused? Some examples should help. Let's create a couple of Pets:

```python
pet_1 = Pet("capybara", "Beatrice")
pet_2 = Pet("kangaroo", "Joey")
```

Each of these lines creates a new `Pet` **object**. The `Pet` class is just a general blueprint for Pets. To create a specific `Pet` object, we use the name of the class as shown above. This automatically calls the `__init__` method. An object is sometimes referred to as an "instance" of a class, and creating an object as "instantiating" a class. Once we've created an object, we can access its attributes using dot notation:

```python
print(pet_1.species)
print(pet_1.name)
```

We would also use dot notation to call an object's methods, but our `Pet` class doesn't have any besides `__init__`, so let's look at another example:

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

Notice that the `area` and `perimeter` methods have only the `self` parameter. They don't need to be passed the `width` or `height`, because they are already part of the object, and can be accessed via the self parameter. Now that we've defined the `Rectangle` class, here's an example of using it:

:::cell id=classes-demo3
```python starter
rect = Rectangle(2.5, 3)
print("area = ", rect.area())
print("perimeter = ", rect.perimeter())
```
:::

## How do you know what to put in a class?

When designing a class, we need to decide what are the relevant features, for our purposes, of the thing we're representing. That helps us figure out what data and functions the class should have. For example, if what we're concerned with is the selling of cars, then price would be one of the relevant features, but if we're only concerned with the driving of cars, then it wouldn't be.

## "Private" class members

Some languages have a keyword ("private" in Java and C++) that means a certain class data member or method can't be accessed from outside the class. The methods that are part of the class can still access it, but not external code that uses the class. Python does not have such a keyword. Instead, it has the convention that any data member or method whose name begins with an underscore should be treated as private even though the language doesn't enforce it.

Here's an example of a bank account class that has private class variables:

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

Notice that for class names, instead of separating words with underscores ("snake case"), we [follow python convention](https://peps.python.org/pep-0008/#class-names) and start each new word with a capital letter ("camel case"). Here's an example of using the BankAccount class:

:::cell id=classes-demo5
```python starter
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

If we want for other code to be able to access a private data member, we need to provide get and/or set methods. A get method just returns the current value of the corresponding data member. A set method takes a parameter and just sets the corresponding data member to the value of the parameter. The normal naming convention is `get_` or `set_` followed by the name of the corresponding data member. For the account ID we provided both get and set methods. For the balance, we only provided a `get` method, since the balance is changed via the deposit and withdraw methods.

You might wonder why we would want to have private data members if it means writing more methods. The reason is that it allows us to control access to the data members. If we don't want a data member to be accessed, we can just not write get and/or set methods for it. Or if a data member should only be set to a certain range of values, then we can check for that in the set method. If a data member is public, then it can be changed to anything from anywhere, which can make your program logic harder to understand and debug. Controlling access to data members this way is referred to as **information hiding** (or data hiding).

Information hiding is important because it allows you to control how certain parts of the class are accessed. It allows you to separate interface (the names and expected parameters of any public functions) from implementation (the definitions of those functions, and also any private data members or private functions). Making that distinction makes it easier to modify the class later on. If you allow the user to directly access any part of the class, then some users' code will end up depending on specific details of the implementation, which means that if you change the implementation later, you'll break any code that depends on it. It makes code much more modular if you provide a defined interface. The specific implementation details can then be allowed to change as long as the interface remains the same.

In addition to private data members, we can also indicate that methods are private in the same way. The reason we would make a method private is if it's just meant for internal use by the class and not part of the way we expect users to interact with the class. An example of this would be if we had a `Fraction` class and we wanted the Fractions to always be in reduced form. To accomplish this, we could have a `greatest_common_divisor()` function that can be used within the class. However, we wouldn't normally expect users to interact with a `Fraction` object by asking it to find the gcd of two integers, we expect them to do more explicitly Fraction-y things, like printing the `Fraction` or multiplying it by another `Fraction`. Finding the gcd of two integers is an implementation detail that can be "hidden" from the users.

## Everything is an object

In Python, everything is an object. Strings, integers, and all other values are objects. Functions are objects. Even the special value `None` is an object. Given the power and popularity of Python (and other object-oriented languages), it's clear that object-oriented design can be a valuable tool for organizing code in ways that help make programming easier. It can feel very abstract at first, but it's definitely worthwhile to master the concepts involved.

## Printing objects of user-defined classes

If you try to print an object of a user-defined class, you'll get something like this:

```python
print(account_1)
__main__.BankAccount object at 0x103506d30>
```

by default python just tells you what class it belongs to and its address in memory. In order to print out the values of the data members, you need to specifically access those data members in the print statement, as shown earlier. There are ways to customize what the printed value of an object looks like, but that is for a future lesson.

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
