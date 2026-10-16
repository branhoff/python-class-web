---
id: getting-started
title: Getting started
section: 1
---

Welcome. This course teaches the fundamentals of programming using Python. The
focus is on the core ideas (variables, control flow, loops, functions, objects,
and data structures), not on clever or optimal Python. Once you have the ideas
you can carry them to any language.

## How this course works

The course has two halves that work together.

**Lessons and exercises, here in your browser.** Each lesson explains a concept
with runnable examples. The code runs in the page itself (Python runs in your
browser), so there is nothing to install to follow along. Press **Run** on the
code cell below, then edit the code and run it again.

:::cell id=welcome-demo
```python starter
print("Hello, programmer!")
for i in range(3):
    print("Counting:", i)
```
:::

Exercises are cells that check your work. You write code, press Run, and the
cell tells you whether it passed, with a message to guide you if it did not.
Hints are there when you get stuck.

**IDE projects, on your own machine.** Each section also has a larger project
you build locally in a real code editor (the notes assume VS Code). The
in-browser lessons teach the concept; the local project is where you practice
building something bigger, the way you would in real work. Setting up an editor
and running your own Python files is part of learning to program, so the
projects live outside the browser on purpose.

## How to move through it

Use the section list on the left to jump between lessons, or the Previous and
Next buttons at the bottom of each lesson to go in order. Start with the next
lesson and work forward.

## How projects work

Every project in this course is written the same way. Read the description,
create a file with the name it gives, write your solution, and run it in VS
Code. Each project has its own page. You will find it in the sidebar under its
section, marked with a small arrow, and in a list at the end of the lesson it
follows. Each page also has a collapsible solution with tests. Try the project
yourself first.

Before the first project you need Python and a code editor on your computer.
[Set up your editor](/lessons/editor-setup) walks through it, and the first
project, [Your first Python file](/lessons/first-python-file), checks that it
works.

## Reading the tests

Every project has a solution you can open, and every solution comes with tests.
The tests are there to read, not only to run. A good test suite shows what the
code is supposed to do, so read the test names first: each one describes a
single rule.

- **A test** calls your code with chosen inputs and checks the result. If the
  result is wrong, the test fails and names the line.
- **Coverage** measures which lines of your code the tests actually ran. A line
  no test reaches is a line nobody has checked. The solutions here are tested to
  100% of their lines and branches, meaning every `if` was tested both ways.
- **Coverage is not enough.** A test can run a line without checking its result.
  To check the tests themselves, we use mutation testing: a tool makes small
  deliberate bugs in the solution, such as changing `<` to `<=` or `+` to `-`,
  and every one of them must make at least one test fail. Try it yourself: edit
  the solution code to add a bug, then press **Run** and watch a test catch it.
- **Equivalent changes.** Sometimes a small change does not alter what the
  program does. For example, if a loop only runs while `guess != secret`, then
  `guess < secret` and `guess <= secret` behave the same. No test can tell them
  apart, so those lines carry the comment `# pragma: no mutate` and a note
  saying why.

The tests use tools you have not met yet, such as classes and the `unittest`
module. Do not worry about how they work. Read the test names and the expected
values: together they list what the program must do.

To measure coverage on your own project in the VS Code terminal, install the
tool once, then run your tests under it and print the report. The report lists
any line your tests missed. (On Windows, use `python` in place of `python3`.)

```
python3 -m pip install coverage
python3 -m coverage run --branch -m unittest
python3 -m coverage report -m
```

## All projects

Every project, in course order. Each name links to its page.

| Project | Follows the lesson |
| --- | --- |
| [Your first Python file](/lessons/first-python-file) | [Set up your editor](/lessons/editor-setup) |
| [Average of five numbers](/lessons/average-of-five) | [Input and casting](/lessons/input-and-casting) |
| [Celsius to Fahrenheit](/lessons/celsius-to-fahrenheit) | [Input and casting](/lessons/input-and-casting) |
| [Making change](/lessons/making-change) | [Input and casting](/lessons/input-and-casting) |
| [Smallest and largest](/lessons/min-and-max) | [Loops](/lessons/loops) |
| [Find the factors](/lessons/find-factors) | [Loops](/lessons/loops) |
| [Number guessing game](/lessons/number-guessing) | [Loops](/lessons/loops) |
| [Distance fallen](/lessons/distance-fallen) | [Functions](/lessons/functions) |
| [Fibonacci number](/lessons/fibonacci-number) | [Functions](/lessons/functions) |
| [Hailstone steps](/lessons/hailstone-steps) | [Functions](/lessons/functions) |
| [Multiply with recursion](/lessons/multiply-recursively) | [Recursion](/lessons/recursion) |
| [Taxicab](/lessons/taxicab) | [Classes](/lessons/classes) |
| [Find the median](/lessons/find-median) | [Lists](/lessons/lists) |
| [Add a surname](/lessons/add-surname) | [Lists](/lessons/lists) |
| [Standard deviation of ages](/lessons/std-dev-of-ages) | [Lists](/lessons/lists) |
| [Square a list in place](/lessons/square-list) | [References](/lessons/references) |
| [Reverse a list in place](/lessons/reverse-list) | [References](/lessons/references) |
| [Count the letters](/lessons/count-letters) | [Dictionaries](/lessons/dictionaries) |
| [Words in both](/lessons/words-in-both) | [Sets](/lessons/sets) |
| [Employee directory](/lessons/employee-directory) | [Sets](/lessons/sets) |
| [Add Three game (final project)](/lessons/add-three-game) | [Sets](/lessons/sets) |
| [Builders game (final project)](/lessons/builders-game) | [Sets](/lessons/sets) |
