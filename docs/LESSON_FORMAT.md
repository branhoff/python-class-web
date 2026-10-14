# Lesson format

A lesson is one markdown file under `content/`, for example
`content/04-functions/functions.md`. It is plain markdown plus a front matter
block and a `:::cell` directive for runnable cells.

## Front matter

```
---
id: functions
title: Functions
section: 4
---
```

All three fields are required. `section` is the course section number.

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
| `kind`    | `sandbox` (default) or `exercise`                              |

Inside a cell:

- Text and ordinary code fences are the **prompt** (markdown).
- `python starter` is the code the learner starts with. Required.
- `python tests` and `python solution` are required for `exercise` and not
  allowed for `sandbox`.
- `hint` blocks are optional, shown one at a time in order.
- Each of starter, tests and solution may appear once.

## How code runs

- **Sandbox cells** share one interpreter session per lesson, in page order,
  like a notebook, so a later cell can call a function defined earlier.
  (Decision to confirm when the browser runner exists.)
- **Exercises** run the learner's code in a fresh namespace, then run the tests
  in that same namespace. The tests see everything the learner defined, plus
  `stdout`, the text the learner's program printed.
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
