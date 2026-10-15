---
id: employee-directory
title: Employee directory
section: 8
after: sets
---

Write a class called `Employee` with **private** data members for an employee's
name, ID number, salary and email address. It has an `__init__` method that sets
them and a getter for each one.

Then write a separate function, outside the class, called `make_employee_dict`.
It takes four lists as parameters: names, ID numbers, salaries and email
addresses. All four are the same length. The function goes through the lists,
creates an `Employee` for each position, and adds it to a dictionary. The
dictionary's keys are the ID numbers and its values are the `Employee` objects.
The function returns the dictionary.

Here is how it could be used:

```python
emp_names = ["Tuan", "Rachel", "Brandon"]
emp_ids = ["1000", "1001", "1002"]
emp_sals = [30, 35, 28]
emp_emails = ["Tuan@aol.com", "Rachel@aol.com", "Brandon@aol.com"]
result = make_employee_dict(emp_names, emp_ids, emp_sals, emp_emails)
print(result["1000"].get_name())
```

When you test, remember that printing an object of your own class shows only its
type and a memory address. To see its values, call its getters, as the last line
above does.

Save the file as `make_employee_dict.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-employee-directory
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail.

```python starter
class Employee:
    """An employee with a name, ID number, salary and email address."""

    def __init__(self, name: str, id_number: str, salary: int, email_address: str) -> None:
        """Store the employee's details."""
        self._name: str = name
        self._id_number: str = id_number
        self._salary: int = salary
        self._email_address: str = email_address

    def get_name(self) -> str:
        """Return the employee's name."""
        return self._name

    def get_id_number(self) -> str:
        """Return the employee's ID number."""
        return self._id_number

    def get_salary(self) -> int:
        """Return the employee's salary."""
        return self._salary

    def get_email_address(self) -> str:
        """Return the employee's email address."""
        return self._email_address


def make_employee_dict(names: list, id_numbers: list, salaries: list, emails: list) -> dict:
    """Return a dictionary mapping each ID number to its Employee."""
    employees: dict = {}
    for index in range(len(id_numbers)):
        employees[id_numbers[index]] = Employee(
            names[index], id_numbers[index], salaries[index], emails[index]
        )
    return employees



# ---- Tests ----
import sys
import unittest


class TestEmployee(unittest.TestCase):
    def setUp(self):
        self.employee = Employee("Tuan", "1000", 30, "Tuan@aol.com")

    def test_get_name_returns_the_name_given(self):
        self.assertEqual(self.employee.get_name(), "Tuan")

    def test_get_id_number_returns_the_id_number_given(self):
        self.assertEqual(self.employee.get_id_number(), "1000")

    def test_get_salary_returns_the_salary_given(self):
        self.assertEqual(self.employee.get_salary(), 30)

    def test_get_email_address_returns_the_email_address_given(self):
        self.assertEqual(self.employee.get_email_address(), "Tuan@aol.com")

    def test_each_employee_keeps_its_own_details(self):
        other = Employee("Rachel", "1001", 35, "Rachel@aol.com")
        self.assertEqual(other.get_name(), "Rachel")
        self.assertEqual(self.employee.get_name(), "Tuan")

    def test_the_data_members_are_private_by_naming_convention(self):
        self.assertFalse(hasattr(self.employee, "name"))
        self.assertFalse(hasattr(self.employee, "salary"))


class TestMakeEmployeeDict(unittest.TestCase):
    def setUp(self):
        self.names = ["Tuan", "Rachel", "Brandon"]
        self.ids = ["1000", "1001", "1002"]
        self.salaries = [30, 35, 28]
        self.emails = ["Tuan@aol.com", "Rachel@aol.com", "Brandon@aol.com"]

    def make(self):
        return make_employee_dict(self.names, self.ids, self.salaries, self.emails)

    def test_the_keys_are_the_id_numbers(self):
        self.assertEqual(sorted(self.make()), ["1000", "1001", "1002"])

    def test_the_values_are_employee_objects(self):
        for employee in self.make().values():
            self.assertIsInstance(employee, Employee)

    def test_each_id_maps_to_the_employee_at_the_same_list_position(self):
        result = self.make()
        self.assertEqual(result["1000"].get_name(), "Tuan")
        self.assertEqual(result["1001"].get_name(), "Rachel")
        self.assertEqual(result["1002"].get_name(), "Brandon")

    def test_every_detail_is_copied_to_the_right_employee(self):
        brandon = self.make()["1002"]
        self.assertEqual(brandon.get_id_number(), "1002")
        self.assertEqual(brandon.get_salary(), 28)
        self.assertEqual(brandon.get_email_address(), "Brandon@aol.com")

    def test_the_salary_and_email_of_the_first_employee_are_correct(self):
        tuan = self.make()["1000"]
        self.assertEqual(tuan.get_salary(), 30)
        self.assertEqual(tuan.get_email_address(), "Tuan@aol.com")

    def test_one_employee_gives_a_dictionary_of_one(self):
        result = make_employee_dict(["Tuan"], ["1000"], [30], ["Tuan@aol.com"])
        self.assertEqual(list(result), ["1000"])
        self.assertEqual(result["1000"].get_name(), "Tuan")

    def test_empty_lists_give_an_empty_dictionary(self):
        self.assertEqual(make_employee_dict([], [], [], []), {})

    def test_the_input_lists_are_not_changed(self):
        self.make()
        self.assertEqual(self.names, ["Tuan", "Rachel", "Brandon"])
        self.assertEqual(self.ids, ["1000", "1001", "1002"])
        self.assertEqual(self.salaries, [30, 35, 28])
        self.assertEqual(self.emails, ["Tuan@aol.com", "Rachel@aol.com", "Brandon@aol.com"])


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(
    loader.loadTestsFromTestCase(case) for case in [TestEmployee, TestMakeEmployeeDict]
)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
