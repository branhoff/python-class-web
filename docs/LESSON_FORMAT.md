# Lesson format

A lesson is one markdown file under `content/<course>/`, for example
`content/python/04-functions/functions.md`. Each top-level folder under
`content/` is one course (its folder name is the course id). A lesson file is
plain markdown plus a front matter block and a `:::cell` directive for runnable
cells.

## Front matter

```
---
id: functions
title: Functions
section: 4
---
```

All three fields are required. `section` is the course section number.

A fourth field, `after`, is optional and marks the page as a **project**:

```
---
id: number-guessing
title: Number guessing game
section: 3
after: loops
---
```

`after` names the lesson the project follows. A project page has an "I finished
this project" checkbox, because projects are built locally; ticking it counts
toward the learner's progress like a passed exercise. A project is a normal page, with
three differences: it is listed in the sidebar and on the course page under its
section, after that section's lessons, and marked with a small arrow; the lesson
it follows ends with an automatic "Projects" list linking to it; and its
solution may only use what the course has taught up to and including that
lesson. Put project files in a `projects/` folder inside the section folder,
numbered (`01-name.md`) so they sort after the lessons and in the order you want.
`npm run lessons:check` fails if `after` names a lesson that does not exist, is
itself a project, or sits in a different section.

## Cells

A cell sits between `:::cell ...` and `:::` lines. Everything outside a cell is
ordinary markdown, and ordinary code fences (even ones containing `:::cell`) are
left alone.

````
:::cell id=double-number kind=exercise
Write a function that returns twice its argument, then print `double_num(5)`.

```python starter
# Type code here
```

```python tests
assert stdout.strip() == "10", "Your program should print 10."
```

```python solution
def double_num(x):
    return x * 2

print(double_num(5))
```

```hint
Use the `*` operator.
```
:::
````

| attribute | values                                                         |
| --------- | -------------------------------------------------------------- |
| `id`      | required; lowercase letters, digits, dashes; unique per lesson |
| `kind`    | `sandbox` (default), `exercise` or `check`                     |

Inside a cell:

- Text and ordinary code fences are the **prompt** (markdown).
- `python starter` is the code the learner starts with. Required.
- `python tests` and `python solution` are required for `exercise` and `check`
  and not allowed for `sandbox`.
- `hint` blocks are optional, shown one at a time in order.
- Each of starter, tests and solution may appear once.

## How code runs

Every cell has a **Reset** button that puts the editor back to the code the page
shipped with (the textarea's original content, so no extra data is needed). After
a reset the button reads **Undo reset** until the learner types again, so a
mis-click cannot destroy their work. It is off while the cell is running.

Every cell runs in a web worker. Output appears as the program prints it,
`input()` shows a box under the cell where the learner types a line, and a Stop
button interrupts the program. A program that runs for more than 10 seconds
(not counting time spent waiting for typed input) is stopped with a message
about loops. Tests for `exercise` cells run in the same worker after the
learner's code.

- **Sandbox cells** run in isolation: each cell runs on its own in a fresh
  namespace, so nothing defined in one cell carries over to another. A cell that
  uses a variable or function must define it, and only `print(...)` shows output
  (a bare trailing expression does not auto-display).
- **Exercises** run the learner's code in a fresh namespace, then run the tests
  in that same namespace. The tests see everything the learner defined, plus
  `stdout`, the text the learner's program printed, and `source`, the learner's
  code as text (for example, to check that a function was not used with `ast`).
- A **check** (`kind=check`) is graded like an exercise but is just for practice:
  it has a dashed border, it is never recorded as progress, and it does not count
  toward the sidebar tick. A lesson with a check shows a one-line legend under its
  title. Use checks for quick "did that sink in" questions placed right after a
  concept, and keep exercises for the work that should count.
- A test fails by raising `AssertionError`. Its message is shown to the learner,
  so write helpful ones.

Tests and solutions are meant to run in the learner's browser (Pyodide), so
anyone can read them. That is accepted for a self-study course.

## Checks (`make check`, `npm run lessons:check`)

For every lesson the checker verifies that

- the file parses (errors name the file and line),
- every starter is valid Python syntax,
- every exercise's solution passes its tests, and
- every exercise's starter **fails** its tests, so no exercise is trivial.

`npm run lessons:build` renders each lesson to `build/lessons/<id>.html` as a
static preview (cells are not runnable yet).

The harness that runs code lives in `src/lessons/harness.py`. The same file is
meant to run under Pyodide in the browser so CI and learners get the same
results.

## Project solution cells

Each project page ends with a "Show a solution" block holding sandbox cells whose
ids start with `solution-`. **A solution may only use what the course has taught
by the lesson it sits in.** `scripts/audit_solution.py` enforces this by reading
the solution's syntax tree against a table of "first taught in" lessons. When a
lesson starts teaching something, update that table.

Tests are for students to read, so they may use `unittest`, classes and
`unittest.mock`. There are two layouts:

**Functions and classes (one cell).** The cell is one Python file in three parts:

1. the solution,
2. a `# ---- Tests ----` line, then `unittest` test cases, and
3. a `# ---- Run the tests ----` line, then the lines that run the cases.

The run section builds the suite from the listed `TestCase` classes. It does not
call `unittest.main()`, because the browser runs cells with `exec` and `main`
would not find them.

**Plain scripts (two cells).** Early projects that read `input()` come before
functions are taught, so the solution cannot be wrapped in `def`. The
`solution-<slug>` cell is the plain script. A second cell, `tests-<slug>`,
starts with `PROGRAM = r'''` followed by an exact copy of the script, then the
tests and run sections above. The tests run `PROGRAM` with pretend `input()`.
The extractor fails if the copy differs from the solution cell.

`make solutions` extracts each cell into `build/solutions/<slug>/`
(`scripts/extract-solutions.ts`) and checks that the solution passes the
taught-features audit, that the cell prints `OK`, and that the tests cover 100%
of the solution's lines and branches (coverage.py). `make mutation` also
mutation-tests every solution and every injected bug must be caught: mutmut for
function and class solutions, cosmic-ray for plain scripts (mutmut only changes
code inside functions). A line where a change cannot alter behavior may carry
`# pragma: no mutate` and a comment saying why. The Python tools are pinned in
`scripts/solutions-requirements.txt` and installed into a throwaway virtualenv
under `build/`, so they never touch the Node dependency surface.
