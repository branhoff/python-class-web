"""Self-test for audit_solution.py: it must reject untaught features and accept taught ones."""
import ast
import unittest

import audit_solution as audit


def found(source, lesson):
    return [message for _, message in audit.problems(ast.parse(source), lesson)]


class TestAuditSolution(unittest.TestCase):
    def test_rejects_features_that_are_never_taught(self):
        for source in [
            "x = 1 if True else 2",
            "total = sorted([3, 1])",
            "for _ in range(3):\n    pass",
            "a, b = 1, 2",
            "class C:\n    SIZE = 5",
            "while True:\n    break",
            "f = lambda n: n",
            "n = round(2.5)",
            "d = {}\nfor k, v in d.items():\n    pass",
            "x = [a for a in [1] for b in [2]]",
        ]:
            with self.subTest(source=source):
                self.assertTrue(found(source, "sets"), source)

    def test_rejects_features_used_before_their_lesson(self):
        self.assertTrue(found("print(1 < 2)", "input-and-casting"))
        self.assertTrue(found("def f():\n    return 1", "loops"))
        self.assertTrue(found("names = []\nnames.append(1)", "lists"))
        self.assertTrue(found("x = [1, 2]", "loops"))
        self.assertTrue(found("assert 1 == 1", "functions"))

    def test_accepts_features_once_taught(self):
        self.assertEqual(found("print(1 < 2)", "comparison-logical"), [])
        self.assertEqual(found("def f():\n    return 1", "functions"), [])
        self.assertEqual(found("assert 1 == 1", "testing-and-debugging"), [])
        self.assertEqual(found("names = []\nnames.append(1)", "tuples"), [])
        self.assertEqual(found("n = [a for a in [1, 2] if a > 1]", "lists"), [])
        self.assertEqual(found("n = 5 // 2 + abs(-3) % 2 ** 2", "comments-arithmetic-strings"), [])

    def test_allows_calling_a_method_the_solution_defines_on_another_object(self):
        source = "class P:\n    def get_age(self):\n        return 1\n\nP().get_age()"
        self.assertEqual(found(source, "classes"), [])
        self.assertTrue(found("x = [1]\nx.get_age()", "classes"))

    def test_allows_methods_and_functions_defined_in_the_solution(self):
        source = "class C:\n    def go(self):\n        return self.run()\n\ndef helper():\n    return 1\nhelper()"
        self.assertEqual(found(source, "classes"), [])


if __name__ == "__main__":
    unittest.main()
