import contextlib
import io
import json
import sys
import traceback


def describe(error, filename):
    frames = [f for f in traceback.extract_tb(error.__traceback__) if f.filename == filename]
    where = f" (line {frames[-1].lineno})" if frames else ""
    return f"{type(error).__name__}: {error}{where}"


def run_code(code, namespace):
    output = io.StringIO()
    try:
        with contextlib.redirect_stdout(output):
            exec(compile(code, "<your code>", "exec"), namespace)
    except BaseException as error:
        return output.getvalue(), describe(error, "<your code>")
    return output.getvalue(), None


def run_tests(tests, namespace):
    try:
        # Discard any stdout the tests themselves print; only the JSON result
        # may reach the harness's real stdout, which is the caller's protocol.
        with contextlib.redirect_stdout(io.StringIO()):
            exec(compile(tests, "<tests>", "exec"), namespace)
    except AssertionError as error:
        return str(error) or "A check failed."
    except BaseException as error:
        return describe(error, "<tests>")
    return None


def check_syntax(code):
    try:
        compile(code, "<your code>", "exec")
    except SyntaxError as error:
        return {"ok": False, "message": f"SyntaxError: {error.msg} (line {error.lineno})"}
    return {"ok": True}


def run_exercise(code, tests):
    namespace = {"__name__": "__main__"}
    stdout, failure = run_code(code, namespace)
    if failure:
        return {"ok": False, "stage": "code", "message": failure, "stdout": stdout}
    namespace["stdout"] = stdout
    failure = run_tests(tests, namespace)
    if failure:
        return {"ok": False, "stage": "tests", "message": failure, "stdout": stdout}
    return {"ok": True, "stdout": stdout}


def main():
    request = json.load(sys.stdin)
    action = request["action"]
    if action == "syntax":
        result = check_syntax(request["code"])
    elif action == "exercise":
        result = run_exercise(request["code"], request["tests"])
    else:
        raise ValueError(f"unknown action: {action}")
    json.dump(result, sys.stdout)


if __name__ == "__main__":
    main()
