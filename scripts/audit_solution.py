"""Fail if a solution uses a Python feature the course has not taught yet.

Usage: audit_solution.py <solution.py> <lesson-id>

A project may use everything taught up to and including its own lesson. The
table below says in which lesson each feature is first taught. A feature mapped
to None is never taught, so no solution may use it. Keep this table in step
with the lessons: if a lesson starts teaching something, move it here.
"""
import ast
import sys

LESSONS = [
    "getting-started", "editor-setup", "print-and-types", "variables",
    "comments-arithmetic-strings", "input-and-casting", "error-messages", "problem-solving",
    "comparison-logical", "conditionals", "loops", "code-tracing", "functions",
    "function-scope", "testing-and-debugging", "recursion", "classes", "strings", "lists",
    "tuples", "references", "copies", "dictionaries", "sets",
]

# Syntax nodes: node class name -> lesson that first teaches it (None = never).
NODES = {
    "Compare": "comparison-logical", "BoolOp": "comparison-logical",
    "If": "conditionals", "While": "loops", "For": "loops",
    "Break": None, "Continue": None,  # taught, but the loops lesson says to avoid them
    "FunctionDef": "functions", "Return": "functions", "Assert": "testing-and-debugging",
    "ClassDef": "classes",
    "List": "lists", "ListComp": "lists", "Tuple": "tuples", "Dict": "dictionaries",
    "Set": "sets", "SetComp": "sets", "Delete": "tuples",
    "IfExp": None, "Lambda": None, "DictComp": None, "GeneratorExp": None,
    "Try": None, "Raise": None, "With": None, "Global": None, "Nonlocal": None,
    "Import": None, "ImportFrom": None, "Yield": None, "JoinedStr": None,
    "Starred": None, "Match": None, "NamedExpr": None,
}

# Builtin functions: name -> lesson that first teaches it.
BUILTINS = {
    "print": "print-and-types", "int": "input-and-casting", "float": "input-and-casting",
    "str": "input-and-casting", "input": "input-and-casting",
    "abs": "comments-arithmetic-strings", "range": "loops", "len": "loops",
    "min": "lists", "max": "lists", "list": "tuples", "set": "sets",
}

# Methods: name -> lesson that first teaches it.
METHODS = {
    "upper": "strings", "lower": "strings", "sort": "lists", "append": "tuples",
    "add": "sets", "remove": "sets", "clear": "dictionaries", "split": "sets",
}


def allowed(first_lesson, current):
    return first_lesson is not None and LESSONS.index(first_lesson) <= LESSONS.index(current)


def problems(tree, current):
    defined = {n.name for n in ast.walk(tree) if isinstance(n, (ast.FunctionDef, ast.ClassDef))}
    for node in ast.walk(tree):
        kind = type(node).__name__
        if kind in NODES and not allowed(NODES[kind], current):
            yield node, f"{kind} is not taught by '{current}' (first taught: {NODES[kind]})"
        if isinstance(node, ast.comprehension) and len(node.ifs) > 1:
            yield node, "a comprehension with more than one if"
        if isinstance(node, (ast.ListComp, ast.SetComp)) and len(node.generators) > 1:
            yield node, "a comprehension with more than one for"
        if isinstance(node, ast.Call):
            yield from call_problems(node, current, defined)
        if isinstance(node, ast.Subscript) and isinstance(node.slice, ast.Slice):
            if not allowed("strings", current):
                yield node, "slicing is not taught yet"
        if isinstance(node, (ast.Assign, ast.For)):
            target = node.targets[0] if isinstance(node, ast.Assign) else node.target
            if isinstance(target, ast.Tuple):
                yield node, "tuple unpacking is never taught"
            if isinstance(target, ast.Name) and target.id == "_":
                yield node, "the throwaway name '_' is never taught; name the variable"
        if isinstance(node, ast.ClassDef):
            for stmt in node.body:
                if isinstance(stmt, (ast.Assign, ast.AnnAssign)):
                    yield stmt, "class-level attributes are never taught"


def call_problems(node, current, defined):
    func = node.func
    if isinstance(func, ast.Name) and func.id not in defined:
        if not allowed(BUILTINS.get(func.id), current):
            yield node, f"{func.id}() is not taught by '{current}'"
    if isinstance(func, ast.Attribute) and func.attr not in defined and not (
        isinstance(func.value, ast.Name) and func.value.id == "self"
    ):
        if not allowed(METHODS.get(func.attr), current):
            yield node, f".{func.attr}() is not taught by '{current}'"


def main():
    path, lesson = sys.argv[1], sys.argv[2]
    if lesson not in LESSONS:
        sys.exit(f"unknown lesson id '{lesson}'; add it to LESSONS in audit_solution.py")
    tree = ast.parse(open(path).read(), path)
    found = sorted(problems(tree, lesson), key=lambda p: p[0].lineno)
    for node, message in found:
        print(f"{path}:{node.lineno}: {message}")
    sys.exit(1 if found else 0)


if __name__ == "__main__":
    main()
