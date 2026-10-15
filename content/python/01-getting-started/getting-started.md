---
id: getting-started
title: Getting started
section: 1
---

Welcome. This course teaches the fundamentals of programming using Python. The
focus is on the core ideas, variables, control flow, loops, functions, objects,
and data structures, rather than the most clever or optimal Python. Once you
have the ideas you can carry them to any language.

## How this course works

The course has two halves that work together.

**Lessons and exercises, here in your browser.** Each lesson explains a concept
with runnable examples. The code runs in the page itself (Python runs in your
browser), so there is nothing to install to follow along. Press **Run** on the
cell below, then edit the code and run it again. It is yours to experiment with.

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

## Some background for the projects

A few terms come up as soon as you leave the browser. None of them need to be
memorized now.

**Programs and algorithms.** An algorithm is a set of steps for solving a
problem, written so it works for every case of that problem and not just one
example. A program is an algorithm written in a language a computer can run.

**Programming languages.** A computer's processor only understands machine
code, long strings of 1s and 0s. Languages like Python are written for humans,
with keywords and names you can read. Before a processor can act on your code,
it has to be translated. A **compiler** translates the whole program ahead of
time. An **interpreter** reads your code and runs it as it goes. Python is
usually run through an interpreter: you give it a file ending in `.py` and it
carries out the instructions in order.

**Source files.** The text you write is called source code, and it lives in a
plain text file. A Python source file ends in `.py`, for example `my_color.py`.
Writing a program means writing and saving files like this, then running them.

**IDEs.** An IDE (integrated development environment) is to a programmer what a
word processor is to a writer. It has a code editor, a way to run your program,
and a debugger, all in one window. Common ones are VS Code, PyCharm and Xcode.
This course uses VS Code.

**The terminal.** A terminal is a text window where you type commands instead of
clicking. VS Code has one built in. You will mostly use it to see your
program's output and to type input when your program asks for it.

## Set up your editor

You need two things on your own machine: Python and VS Code. The steps below are
the short version. Each tool's own site has the full installer instructions.

### Install Python

1. Go to [python.org/downloads](https://www.python.org/downloads/) and download
   the latest Python 3 installer for your system. Version 3.11 or newer is fine.
2. Run the installer.
   - On **Windows**, tick **Add python.exe to PATH** on the first screen before
     you click Install.
   - On **Mac**, the default options are fine. If you already use Homebrew,
     `brew install python` works too.
3. Open a terminal and check the install. On Mac, use Terminal and run
   `python3 --version`. On Windows, use Command Prompt or PowerShell and run
   `python --version`. You should see a version number such as `Python 3.12.4`.

### Install VS Code

1. Download VS Code from
   [code.visualstudio.com](https://code.visualstudio.com/) and install it.
2. Open VS Code and click the **Extensions** icon in the left bar (it looks like
   four squares). Search for **Python**, and install the one published by
   Microsoft.
3. Make a folder on your computer for your work, for example `python-projects`.
   In VS Code choose **File, Open Folder** and pick it. Everything you create for
   the projects goes in here.

### Run a Python file

1. In the Explorer panel, hover over your folder name and click the **New File**
   icon. Type a name ending in `.py` and press Enter.
2. Type your code into the file and save it (Ctrl+S on Windows, Cmd+S on Mac).
3. Click the **Run** triangle at the top right of the editor. The output appears
   in the terminal panel at the bottom. If your program asks for input, click in
   that panel and type your answer there.

If VS Code asks you to pick a Python interpreter, choose the version you just
installed.

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

The first project checks that your setup works:
[Your first Python file](/lessons/first-python-file).

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
  a solution cell to introduce a bug, then press **Run** and watch a test catch it.
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
| [Your first Python file](/lessons/first-python-file) | [Getting started](/lessons/getting-started) |
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
