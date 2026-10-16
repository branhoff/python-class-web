---
id: editor-setup
title: Set up your editor
section: 1
---

The lessons run in your browser, but the projects run on your own machine. This
page gets Python and a code editor installed. It starts with a few terms you
will meet along the way.

## A few terms

These come up as soon as you leave the browser. None of them need to be
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

## What you need

You need two things on your own machine: Python and VS Code. The steps below are
the short version. Each tool's own site has the full installer instructions.

## Install Python

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

## Install VS Code

1. Download VS Code from
   [code.visualstudio.com](https://code.visualstudio.com/) and install it.
2. Open VS Code and click the **Extensions** icon in the left bar (it looks like
   four squares). Search for **Python**, and install the one published by
   Microsoft.
3. Make a folder on your computer for your work, for example `python-projects`.
   In VS Code choose **File, Open Folder** and pick it. Everything you create for
   the projects goes in here.

## Run a Python file

1. In the Explorer panel, hover over your folder name and click the **New File**
   icon. Type a name ending in `.py` and press Enter.
2. Type your code into the file and save it (Ctrl+S on Windows, Cmd+S on Mac).
3. Click the **Run** triangle at the top right of the editor. The output appears
   in the terminal panel at the bottom. If your program asks for input, click in
   that panel and type your answer there.

If VS Code asks you to pick a Python interpreter, choose the version you just
installed.

## Check that it works

Your first project does this for you:
[Your first Python file](/lessons/first-python-file). If it runs and prints your
color, Python and your editor are working.
