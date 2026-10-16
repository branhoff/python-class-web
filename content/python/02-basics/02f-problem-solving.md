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

## 2. Design tests

Come up with test cases that represent how your code could be used. They should
be good enough that if your code passes all of them, you can be confident it
meets the requirements. For each test, decide what result you expect before you
run it. Otherwise it is easy to glance at the output and convince yourself it
looks reasonable.

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

### Work through examples by hand

People do many tasks without being aware of the steps involved. In this method,
you solve several examples of the problem yourself with pencil and paper,
paying close attention to each tiny step. Doing this often helps you notice
patterns in how you solve them. You can combine this with stepwise refinement
to help figure out what the sub-tasks should be.

For example, how could you round `7.299999999` to two decimal places without
calling `round()`? It looks hard until you do it by hand and write down each
step:

1. Start with `7.299999999`. We want `7.3`.
2. The digits we want to keep are the first two after the decimal point. Move
   them to the left of it by multiplying by 100: `729.9999999`.
3. Now we need to drop everything after the decimal point. But rounding is not
   chopping. Try `3.159`. The answer should be `3.16`, and chopping gives
   `3.15`. If the next digit is 5 or more, we need to go up. Adding `0.5` does
   that: `729.9999999 + 0.5` is `730.4999999`.
4. Drop everything after the decimal point: `730`.
5. Move the decimal point back by dividing by 100: `7.3`.

Check the steps on another number. For `3.14159`, multiply by 100 to get
`314.159`, add `0.5` to get `314.659`, drop the decimals to get `314`, and
divide by 100 to get `3.14`. The same steps work, so you can turn them into
code. Dropping the decimals can be done with `int()`, which cuts off everything
after the decimal point:

:::cell id=problem-solving-round-by-hand
```python starter
price = 7.299999999
print(int(price * 100 + 0.5) / 100)
```
:::

Each step on its own is simple. Writing them down one at a time is what made the
whole thing possible. This version only works for positive numbers, so in real
programs use `round()`.

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
