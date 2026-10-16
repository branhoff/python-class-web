---
id: problem-solving
title: Problem Solving
section: 2
---

## Introduction

How do you get from a set of requirements to a working program? There is no
single approach. Your first instinct might be to start typing code right away.
That can work for tiny problems, but for bigger ones it easily leads to a
time-wasting spiral of errors you do not know how to fix. These general steps
can guide you toward a solution:

1. Understand the requirements
2. Design tests that anticipate problems you need your code to solve
3. Outline how you would approach the problem
4. Translate your plan into code
   - Add and run tests for each piece of your code's functionality
   - Debug and revise your code accordingly
   - Iterate the steps in 4 until your solution meets your requirements
5. Reflect on your approach and process

These steps may feel like overkill for very small programs, but practice them
throughout this course.

## 1. Understand the requirements

In real life this is often the hardest part, because clients may not have a
clear idea of exactly what they want. In this course, the assignments come with
clear requirements. It still helps to go through the assignment and turn the
requirements into a checklist. If you run into a case the assignment does not
cover, do your best to reason it through, or ask the instructor.

Quick check on what "clear" means:

:::cell id=problem-solving-clear-requirement kind=check
**Check your understanding.** A requirement is clear when you could write the code without guessing. Here are three requirements:

- **A.** Print a nice greeting.
- **B.** Ask for the user's name, then print `Hello, ` followed by the name.
- **C.** Make the program friendly.

Which one is clear enough to turn into code? Change `answer` to its letter, in quotes, such as `"A"`.

```python starter
answer = ""
```

```python tests
assert answer == "B", "Not quite. Ask of each one: could two programmers write different programs and both say they followed it?"
```

```python solution
answer = "B"
```

```hint
Look for the one that says exactly what to ask and exactly what to print.
```
:::

## 2. Design tests

Come up with test cases that represent how your code could be used. They should
be good enough that if your code passes all of them, you can be confident it
meets the requirements. For each test, decide what result you expect before you
run it. Otherwise it is easy to glance at the output and convince yourself it
looks reasonable.

Try it on a small program that converts Celsius to Fahrenheit: multiply by 9, divide by 5, then add 32.

:::cell id=problem-solving-expected-values kind=check
**Check your understanding.** Work out the expected result for each test by hand, on paper, before running any code. Change each variable below to the Fahrenheit value you expect:

- `expected_freezing` is the answer for 0 degrees Celsius
- `expected_boiling` is the answer for 100 degrees Celsius
- `expected_equal` is the answer for -40 degrees Celsius

```python starter
expected_freezing = None
expected_boiling = None
expected_equal = None
```

```python tests
assert expected_freezing == 32, "expected_freezing is not right. 0 * 9 / 5 + 32 is the value."
assert expected_boiling == 212, "expected_boiling is not right. Multiply 100 by 9, divide by 5, then add 32."
assert expected_equal == -40, "expected_equal is not right. Work through -40 * 9 / 5 + 32 carefully."
```

```python solution
expected_freezing = 32
expected_boiling = 212
expected_equal = -40
```

```hint
Take 100 as an example: 100 * 9 is 900, 900 / 5 is 180, and 180 + 32 is 212. Do the same steps for the other two.
```
:::

How do you know what cases to test?

- Special cases: for example if your program should compute the factorial of a
  number, the general rule is that you take the product of all integers from 1
  to that number, but zero is a special case, since the factorial of zero is 1,
  so zero should definitely be one of the test cases.
- Boundary values: for example if a customer gets a special discount when they
  order 10 or more items, then you should check the numbers on both sides of
  that boundary (9 and 10) to make sure they are handled correctly.
- Path coverage: include test cases that exercise each possible path through
  your logic, to make sure every path gives correct results.
- Edge cases: extreme or unusual cases that might expose problems.
- Unit tests: when your solution consists of multiple parts that each solve a
  piece of the problem, it is good to test each part separately, since it is
  easier to debug a small part at a time.
- Integration tests: once you are satisfied that the different parts work
  correctly on their own, you need to make sure they work correctly together.

It is better for you to find cases that break your code than for a customer or
employer to find them.

Try picking the cases for one boundary:

:::cell id=problem-solving-boundary kind=check
**Check your understanding.** A shop gives free shipping when you buy 4 or more items. Which two quantities test the boundary? Change the two variables below:

- `below_boundary` is the largest quantity that does not get free shipping
- `at_boundary` is the smallest quantity that does

```python starter
below_boundary = None
at_boundary = None
```

```python tests
assert below_boundary == 3, "below_boundary is not right. It is the biggest quantity that is still under 4."
assert at_boundary == 4, "at_boundary is not right. It is the smallest quantity that gets free shipping."
```

```python solution
below_boundary = 3
at_boundary = 4
```

```hint
A boundary has two sides. Test the last value on one side and the first value on the other.
```
:::

## 3. Outline your approach

Write an outline of the steps your code needs to take to meet the requirements.
Two useful strategies are stepwise refinement and working through examples by
hand.

### Stepwise refinement

Stepwise refinement is a common way to outline an approach. You break the
original problem into smaller sub-problems, then break each sub-problem into
even smaller ones. Repeat until you have a list of steps detailed enough to
translate into code. This list of steps is often called pseudocode.

As an example, suppose you want a program that works out what a customer owes
at a coffee shop. It might seem like a lot at first, but you can break it into
these sub-tasks:

- get the order
- work out the total
- show the total

Each step sounds clear until you ask what it means. What do we mean by "get the
order"? The program needs to know how many coffees and how many muffins the
customer wants. And "work out the total" from what? Let's break the steps down
further:

- get the order
  - ask how many coffees
  - ask how many muffins
- work out the total
  - add up the cost of the coffees and the muffins
  - add sales tax
- show the total
  - print the total

Now ask again. What do we mean by "show the total"? A bare number like `7.3` is
not much use to a customer, and a calculation can produce `7.299999999`, which
looks wrong. We want a label and exactly two decimal places. And what is "the
cost of the coffees"? We need a price, and a tax rate, and nobody has said where
those come from. One more layer:

- get the order
  - ask how many coffees and convert the answer to a whole number
  - ask how many muffins and convert the answer to a whole number
- work out the total
  - set the coffee price, the muffin price, and the tax rate
  - coffee cost = coffees times the coffee price
  - muffin cost = muffins times the muffin price
  - subtotal = coffee cost plus muffin cost
  - tax = subtotal times the tax rate
  - total = subtotal plus tax
- show the total
  - round the total to two decimal places
  - print it with a label such as "Total: $"

Keep going until you know every small step that needs to happen. A step is
detailed enough when you could write it as one or two lines of code without
guessing.

Notice what the extra layers turned up: the prices and the tax rate, converting
typed answers to numbers, rounding, and the label. None of them were in the first
outline, and each is easy to forget until the program gives a wrong answer.
Finding them on paper is much cheaper than finding them halfway through writing
code. The habit to build is to look at each step and ask "what do I mean by
this?" until no step is vague.

Check that you can order the steps of an outline:

:::cell id=problem-solving-order-steps kind=check
**Check your understanding.** These five steps from the coffee shop program are out of order:

- **A.** Print the total.
- **B.** Ask how many coffees.
- **C.** Add sales tax.
- **D.** Multiply the coffees by the coffee price.
- **E.** Round the total to two decimal places.

Put them in a sensible order. Change `order` to the five letters in that order, in quotes, such as `"ABCDE"`.

```python starter
order = ""
```

```python tests
assert order == "BDCEA", "Not quite. Each step needs something from an earlier step. You cannot add tax before you know the price."
```

```python solution
order = "BDCEA"
```

```hint
Start with what the program has to know first. Finish with the step that shows the answer.
```
:::

### Work through examples by hand

People do many tasks without being aware of the steps involved. In this method,
you solve several examples of the problem yourself with pencil and paper,
paying close attention to each tiny step. Doing this often helps you notice
patterns in how you solve them. You can combine this with stepwise refinement
to help figure out what the sub-tasks should be.

For example, how could you round `7.299999999` to two decimal places without
calling `round()`? It looks hard. A good way in is to solve an easier problem
first.

**An easier problem: round to a whole number.** Python can drop everything after
the decimal point with `int()`, so `int(7.9)` is `7`. That is chopping, not
rounding, because `7.9` should round to `8`. Work a few by hand:

- `7.3` rounds to `7`
- `7.49` rounds to `7`
- `7.5` rounds to `8`
- `7.9` rounds to `8`

The pattern: if the part after the decimal point is `.5` or more, the number goes
up to the next whole number. Otherwise it stays. Chopping gets the second case
right and the first case wrong. Can we fix the first case with something we
already know? Try adding `0.5` before chopping:

- `7.5 + 0.5` is `8.0`, which chops to `8`
- `7.9 + 0.5` is `8.4`, which chops to `8`
- `7.3 + 0.5` is `7.8`, which chops to `7`
- `7.49 + 0.5` is `7.99`, which chops to `7`

Adding `0.5` pushes numbers that are `.5` or more over the next whole number, and
leaves the others below it. So `int(number + 0.5)` rounds to a whole number.

**Back to the real problem.** We can round to a whole number, but we want two
decimal places. Can we turn this problem into the one we just solved? Multiplying
by 100 moves the decimal point two places to the right, so `7.299999999` becomes
`729.9999999`. Now the digits we want to keep are in the whole-number part, and
the digits we want to get rid of come after the decimal point. Rounding that to a
whole number gives `730`. Dividing by 100 moves the decimal point back: `7.3`.

Check it on a number where chopping and rounding give different answers. `3.159`
should round to `3.16`. Multiplying by 100 gives `315.9`. Adding `0.5` gives
`316.4`, which chops to `316`. Dividing by 100 gives `3.16`.

Now it is a few lines of code:

:::cell id=problem-solving-round-by-hand
```python starter
price = 7.299999999
print(int(price * 100 + 0.5) / 100)
```
:::

Nobody has to remember this formula. Each step was a small problem on its own:
solve an easier version first, then turn the harder problem into the easier one.
This version only works for positive numbers, so in real programs use `round()`.

Now use the same steps on a different case:

:::cell id=problem-solving-round-one-decimal kind=exercise
1. Round `price` and `tip` to **one** decimal place and print each one, without using `round()`. Use the steps above and change what needs to change.

```python starter
price = 3.14159
tip = 2.96
# Type code here
```

```python tests
import ast

calls = [n for n in ast.walk(ast.parse(source)) if isinstance(n, ast.Name) and n.id == "round"]
assert not calls, "Do not use round(). Build the result from the steps above."
assert stdout.split() == ["3.1", "3.0"], f"Expected 3.1 and then 3.0 on separate lines, but the output was {stdout!r}."
```

```python solution
price = 3.14159
tip = 2.96
print((price * 10 + 0.5) // 1 / 10)
print((tip * 10 + 0.5) // 1 / 10)
```

```hint
Which number do you multiply by to move exactly one digit to the left of the decimal point? Use the same number to shift back at the end.
```
:::

## 4a. Translate your outline into code

Translate each sub-task of your outline (or pseudocode) into code, but not all at
once (unless it is a tiny program). Write a short section of code and run it to
see if it does what you expect. If it does, add another short section and run
again, until the whole outline is translated. Avoiding big changes makes it
easier to track down new bugs.

Here is the first piece of the coffee shop program. Run it on its own, then follow the comments to add the next piece:

:::cell id=problem-solving-piece-by-piece
```python starter
# Piece 1: get the order. Run this on its own first.
coffees = int(input("How many coffees? "))
print("coffees:", coffees)

# Piece 2: work out the total. Remove the # marks, then run again.
# coffee_price = 3
# total = coffees * coffee_price
# print("total:", total)
```
:::

## 4b. Run your tests

How do you know if your code does what you expect? Run the tests you designed in
step 2. If you think of more tests while coding, add them. The more you test,
the more bugs you will catch.

## 4c. Debug your code

What if your code does not do what you expect? Then you need to find the problem
and fix it. Since you only change a few lines at a time, a new problem is almost
certainly among those lines. Error messages often tell you what the problem is
and where it occurred. If you do not see the problem at first, narrow down where
it could be, step by step. After fixing it, re-run your tests to make sure that
part works now and that you have not broken anything else.

Practice finding a bug:

:::cell id=problem-solving-fix-average kind=exercise
2. This program should print the average of `apples` and `oranges`, which is `3.5`. It prints something else. Run it, find the bug in the `average` line, and fix it. Keep using the variables, so the program would still work for other numbers.

```python starter
apples = 3
oranges = 4
average = apples + oranges / 2
print(average)
```

```python tests
assert stdout.strip() == "3.5", f"Your program should print 3.5, but it printed {stdout.strip()!r}."
other = {}
exec(source.replace("apples = 3", "apples = 10").replace("oranges = 4", "oranges = 20"), other)
assert other["average"] == 15, "Your fix should work for other numbers too, not only for 3 and 4."
```

```python solution
apples = 3
oranges = 4
average = (apples + oranges) / 2
print(average)
```

```hint
Division happens before addition. Which part should be added first, before dividing by 2?
```
:::

## 4d. Let me reiterate to iterate

As you build each piece of your code, test it and fix any bugs. Then repeat:
build, test, and debug. Do not write the whole program in one go and hope it has
no typos or logic errors. If each piece works as you build it, the finished
program is much more likely to work too.

## 5. Reflect on your process

Reflecting on your problem-solving process helps you improve it for next time. What did you learn about the problem as you went? What tests
did not work out the way you expected? What alterations did you have to make to
your program due to failed tests? How could your planned tests have been more
complete? What was missing or needed to be altered from your initial design, and
why? What problems did you encounter during implementation? How were you able to
solve those problems? What outside sources (sites, books, or other materials) did
you find helpful? How can you generalize any parts of your problem solving
experience in a way that might help you on future assignments?
