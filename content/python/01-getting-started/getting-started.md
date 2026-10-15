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

## Projects

Every project in this course is written the same way. Read the description,
create a file with the name it gives, write your solution, and run it in VS Code.
Projects appear at the end of the lesson they follow. Each one is a collapsible
section: click its name to open it.

The first project checks that your setup works.

<details id="project-first-python-file">
<summary>Project: Your first Python file</summary>

Create a Python file named `my_color.py` in your project folder. Type the
following code into the file, using **your name** and the **current date**. You
can try it here first: press **Run** and a box asks for your color.

:::cell id=first-python-file
```python starter
# Author: Your Name
# Date: 01/15/2026
# Description: Asks the user for their favorite color and then
#              prints out a statement with the variable

fave_color = input("Please enter your favorite color: ")
print("Your favorite color is " + fave_color + ".")
```
:::

Save the file in VS Code and run it there too. The program asks for your favorite color. After you
type one, it prints "Your favorite color is" followed by what you typed.

If you can do this, your editor and Python are working and you are ready for the
rest of the course.

</details>

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

Open the lesson to find the project. Each project name below links to its
section.

| Project                                                                 | Lesson                                                        |
| ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Your first Python file](/lessons/getting-started#project-first-python-file) | [Getting started](/lessons/getting-started)                   |
| [Average of five numbers](/lessons/input-and-casting#project-average-of-five) | [Input and casting](/lessons/input-and-casting)               |
| [Celsius to Fahrenheit](/lessons/input-and-casting#project-celsius-to-fahrenheit) | [Input and casting](/lessons/input-and-casting)               |
| [Making change](/lessons/input-and-casting#project-making-change)       | [Input and casting](/lessons/input-and-casting)               |
| [Smallest and largest](/lessons/loops#project-min-and-max)              | [Loops](/lessons/loops)                                       |
| [Find the factors](/lessons/loops#project-find-factors)                 | [Loops](/lessons/loops)                                       |
| [Number guessing game](/lessons/loops#project-number-guessing)          | [Loops](/lessons/loops)                                       |
| [Distance fallen](/lessons/functions#project-distance-fallen)           | [Functions](/lessons/functions)                               |
| [Fibonacci number](/lessons/functions#project-fibonacci-number)         | [Functions](/lessons/functions)                               |
| [Hailstone steps](/lessons/functions#project-hailstone-steps)           | [Functions](/lessons/functions)                               |
| [Multiply with recursion](/lessons/recursion#project-multiply-recursively) | [Recursion](/lessons/recursion)                            |
| [Taxicab](/lessons/classes#project-taxicab)                             | [Classes](/lessons/classes)                                   |
| [Find the median](/lessons/lists#project-find-median)                   | [Lists](/lessons/lists)                                       |
| [Add a surname](/lessons/lists#project-add-surname)                     | [Lists](/lessons/lists)                                       |
| [Standard deviation of ages](/lessons/lists#project-std-dev-of-ages)    | [Lists](/lessons/lists)                                       |
| [Square a list in place](/lessons/references#project-square-list)       | [References](/lessons/references)                             |
| [Reverse a list in place](/lessons/references#project-reverse-list)     | [References](/lessons/references)                             |
| [Count the letters](/lessons/dictionaries#project-count-letters)        | [Dictionaries](/lessons/dictionaries)                         |
| [Words in both](/lessons/sets#project-words-in-both)                    | [Sets](/lessons/sets)                                         |
| [Employee directory](/lessons/sets#project-employee-directory)          | [Sets](/lessons/sets)                                         |
| [Add Three game](/lessons/sets#project-add-three-game)                  | [Sets](/lessons/sets) (final project)                         |
| [Builders game](/lessons/sets#project-builders-game)                    | [Sets](/lessons/sets) (final project)                         |
