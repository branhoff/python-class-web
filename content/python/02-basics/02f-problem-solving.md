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

As an example, consider painting your house, which is a big job. It might seem
overwhelming at first, but you can break it into these sub-tasks:

- buy paint
- paint house
- clean up

Those sub-tasks can in turn be broken down further:

- buy paint
  - choose colors
  - choose brand of paint
- paint house
  - tape over parts that should not get painted
  - purchase or borrow supplies (ladders, rollers, and so on)
  - bribe friends with pizza
  - schedule a day and time
  - actually paint the house
- clean up
  - return or put away supplies
  - un-tape the taped bits
  - finish any fine detail work

Keep going until you know every small step that needs to happen.

### Work through examples by hand

People do many tasks without being aware of the steps involved. In this method,
you solve several examples of the problem yourself with pencil and paper,
paying close attention to each tiny step. Doing this often helps you notice
patterns in how you solve them. You can combine this with stepwise refinement
to help figure out what the sub-tasks should be.

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
