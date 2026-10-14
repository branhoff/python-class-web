---
id: code-tracing
title: Code Tracing
section: 3
---

## Flow of Execution: Code Tracing

Being able to trace the flow of execution through a given piece of code and tell how it will behave, is a critical skill for reading and understanding code, as well as for debugging. Here are four common methods people use to help them do this:

1. Hand-tracing is just stepping through the code as if you were the computer, going along line by line, and keeping track of the current values of all the variables as they change. You can write down on paper (or a whiteboard) a row (or column) for each variable, and then each time the value for that variable changes, you can cross off the old value and write down the new value.

2. Temporarily inserting print statements at various places in your code can also be useful for checking what values variables referred to at those points. Make sure to delete such print statements when you're done with them.

3. Many programming environments provide a built-in debugger, which lets you look at the current values of the different variables to see how they change as you step through the code line by line.

4. Explaining how your code works to someone else can often give you an "Aha!" moment where it helps you see a disconnect between what your code is supposed to do and what it actually does. This can even work when explaining your code to a cat or dog, or even a rubber duck.

All of these are worth being comfortable with.
