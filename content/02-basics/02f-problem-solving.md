---
id: problem-solving
title: Problem Solving
section: 2
---

## Introduction

How do you get from a set of requirements to a working program? Sadly, there is
no single solution or approach. Your first instinct might just be to sit down at
the keyboard and start typing out code, and that might work okay for tiny
problems, but for bigger problems, it can easily get you into a time-wasting
spiral of errors that you are not sure how to fix. To help you avoid that
outcome, here are some general principles you can follow to help guide you
toward a solution:

1. Understand the requirements
2. Design tests that anticipate problems you need your code to solve
3. Outline how you would approach the problem
4. Translate your plan into code
   - Add and run tests for each piece of your code's functionality
   - Debug and revise your code accordingly
   - Iterate the steps in 4 until your solution meets your requirements
5. Reflect on your approach and process

You may find all of these steps overkill for very small programs, but you should
practice them throughout all the provided material.

## 1. Understand the requirements

In real life this is sometimes the most challenging part, since sometimes your
clients themselves will not have a super clear idea of exactly what they want,
but for the assignments you will of course have clear guidelines of
requirements. However you may find it useful to go through the assignment
specifications and put them in the form of a checklist. Naturally, you may come
across a scenario that the current version of this material does not consider. In
that case, do your best to logic through it, or feel free to leave a comment or
submit an issue to try and get an answer.

## 2. Design tests

It is important to come up with test cases that are representative of how your
code could be used. You want them to be good enough that if your code passes all
your tests, you will feel confident that it correctly meets all of the
requirements. It is also important that for each test, you decide what result or
results you expect from that test. If you do not do that ahead of time, then it
can be easy to run a test, briefly look at the output, and convince yourself
that it looks reasonable.

How do you know what cases to test?

- Special cases: for example if your program should compute the factorial of a
  number, the general rule is that you take the product of all integers from 1
  to that number, but zero is a special case, since the factorial of zero is 1,
  so zero should definitely be one of the test cases.
- Boundary values: for example if a customer gets a special discount when they
  order 10 or more items, then you should check the numbers on both sides of
  that boundary (9 and 10) to make sure they are handled correctly.
- Path coverage: you should have test cases that check different possible paths
  through your logic, to make sure the different paths give correct results.
- Edge cases: extreme or unusual cases that might expose problems.
- Unit tests: when your solution consists of multiple parts that each solve a
  piece of the problem, it is good to test each part separately, since it is
  easier to debug a small part at a time.
- Integration tests: once you are satisfied that the different parts work
  correctly on their own, you need to make sure they work correctly together.

It is always better for you to find cases that break your code than for a
customer (or employer) to do so.

## 3. Outline your approach

You will want to come up with an outline of the steps your code will need to take
to meet the requirements. Two useful strategies to help with this are stepwise
refinement and working through examples of the problem by hand.

### Stepwise refinement

One of the most common methods for outlining your problem-solving approach is
stepwise refinement. This is a process of breaking up the original problem into
some number of smaller sub-problems. Next, you take each sub-problem and break it
up into even smaller sub-problems. This is repeated until you get a list of steps
that are detailed enough to be translated into code. This list of steps is often
referred to as pseudocode.

As an example of stepwise refinement, consider the problem of wanting to paint
your house, which is a big job. It might seem overwhelming at first, but you can
break that top-level task into the following sub-tasks:

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

This process continues until you have defined everything to a level of detail
where you feel comfortable that you know every small step that needs to happen.

### Work through examples by hand

Brains are pretty smart (most of the time). They know how to do lots of stuff
without us really being conscious of the steps we go through to make that stuff
happen. In this method, you solve multiple examples of the problem yourself with
pencil and paper, paying close attention to each tiny step. Doing this will often
help you notice the patterns in how you solve different examples of that problem.
This strategy can be used together with stepwise refinement, to help you figure
out what the sub-tasks should be.

## 4a. Translate your outline into code

Take the outline (or pseudocode) you have created and translate each small
sub-task into code, but do not do it all at once (unless it is a tiny program).
Instead, you should produce a short section of code and then try running it to
see if that part does what you expect. If it does, then you can add another
short section and run it again, until you have translated your whole outline. If
you avoid making lots of changes at once, it is easier to track down any new bugs
that pop up.

## 4b. Run your tests

How do you know if your code does what you expect? By running the tests you
designed back in step 2. If you have thought of more tests while coding, add
those in. The more testing you do, the more bugs you will catch.

## 4c. Debug your code

What if your code does not do what you expect? Well then you need to find the
problem and fix it. Fortunately, since you are only making a few changes to your
code at a time, that means any new problem is almost certainly among those few
changes. Often error messages will also give you information about what the
problem is and where it occurred. If you do not see the problem at first, try to
methodically narrow down where it could be. After making corrections, re-run your
tests to make sure that part works now, and that you have not accidentally broken
anything else.

## 4d. Let me reiterate to iterate

As you build each piece of your code, test along the way and fix the bugs if
there are any. Then do it again: build, test, and debug. Essentially, do not just
write the whole program in one go, hoping there is not a single typo or error in
logic. Ensure each piece you write works as expected, and by the time it is
complete it will be much more likely to act as you would expect.

## 5. Reflect on your process

Reflecting on your problem solving process can help you fine tune it to work
better next time. What did you learn about the problem as you went? What tests
did not work out the way you expected? What alterations did you have to make to
your program due to failed tests? How could your planned tests have been more
complete? What was missing or needed to be altered from your initial design, and
why? What problems did you encounter during implementation? How were you able to
solve those problems? What outside sources (sites, books, or other materials) did
you find helpful? How can you generalize any parts of your problem solving
experience in a way that might help you on future assignments?
