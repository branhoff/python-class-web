---
id: add-three-game
title: Add Three game (final project)
section: 8
after: sets
---

Write a class named `AddThreeGame` for a two-player game. The players take turns
choosing numbers from 1 to 9. A number cannot be chosen if either player has
already chosen it. If exactly three of a player's numbers add up to 15, that
player wins. If all nine numbers are chosen and nobody has won, the game is a
draw.

The class needs **private** data members for:

1. which numbers have been chosen, and by whom
2. the current state, which is one of "FIRST_WON", "SECOND_WON", "DRAW" or
   "UNFINISHED"
3. whose turn it is

The class must have these methods:

- An `__init__` method that takes no parameters other than `self`.
- `get_current_state`, which returns the current state of the game.
- `make_move`, which takes two parameters in this order: a string saying which
  player is moving, either "first" or "second", and the integer they chose.
  Return `False` if it is not that player's turn, if the integer is out of
  range, if it was already chosen, or if the game is already won or drawn.
  Otherwise record the move, update the state if the move won or drew the game,
  update whose turn it is, and return `True`.

Here is how the class could be used:

```python
game = AddThreeGame()
game.make_move("first", 2)
game.make_move("second", 5)
result = game.make_move("first", 7)
state = game.get_current_state()
```

Save the file as `AddThreeGame.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-add-three-game
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail. The testing tools used here (classes and `unittest`) are not part of the course yet, so do not worry about how they work.

```python starter
class AddThreeGame:
    """Two players take turns choosing 1-9. Three of your numbers adding to 15 wins."""

    def __init__(self) -> None:
        """Start a new game with the first player to move."""
        self._choices: dict = {"first": [], "second": []}
        self._state: str = "UNFINISHED"
        self._turn: str = "first"

    def get_current_state(self) -> str:
        """Return "FIRST_WON", "SECOND_WON", "DRAW" or "UNFINISHED"."""
        return self._state

    def make_move(self, player: str, number: int) -> bool:
        """Record a move and return True, or return False if it is not allowed."""
        if self._state != "UNFINISHED" or player != self._turn:
            return False
        if number < 1 or number > 9:
            return False
        if number in self._choices["first"] or number in self._choices["second"]:
            return False

        self._choices[player].append(number)
        self._update_state(player)
        if player == "first":
            self._turn = "second"
        else:
            self._turn = "first"
        return True

    def _update_state(self, player: str) -> None:
        """Set the state to a win for `player`, a draw, or leave it unfinished."""
        if self._has_winning_trio(self._choices[player]):
            self._state = player.upper() + "_WON"
        elif len(self._choices["first"]) + len(self._choices["second"]) == 9:
            self._state = "DRAW"

    def _has_winning_trio(self, numbers: list) -> bool:
        """Return True if any three of the numbers add up to 15."""
        count: int = len(numbers)
        for i in range(count):
            for j in range(i + 1, count):
                for k in range(j + 1, count):
                    if numbers[i] + numbers[j] + numbers[k] == 15:
                        return True
        return False



# ---- Tests ----
import sys
import unittest


def play(game, moves):
    """Make each (player, number) move in order and return the list of results."""
    return [game.make_move(player, number) for player, number in moves]


class TestStartOfTheGame(unittest.TestCase):
    def test_a_new_game_is_unfinished(self):
        self.assertEqual(AddThreeGame().get_current_state(), "UNFINISHED")

    def test_the_first_player_moves_first(self):
        self.assertTrue(AddThreeGame().make_move("first", 5))

    def test_the_second_player_cannot_move_first(self):
        self.assertFalse(AddThreeGame().make_move("second", 5))

    def test_an_unknown_player_cannot_move(self):
        self.assertFalse(AddThreeGame().make_move("third", 5))


class TestTurnOrder(unittest.TestCase):
    def test_players_must_take_turns(self):
        game = AddThreeGame()
        results = play(game, [("first", 1), ("second", 2), ("first", 3), ("second", 4)])
        self.assertEqual(results, [True, True, True, True])

    def test_a_player_cannot_move_twice_in_a_row(self):
        game = AddThreeGame()
        self.assertTrue(game.make_move("first", 1))
        self.assertFalse(game.make_move("first", 2))

    def test_the_first_player_cannot_move_on_the_seconds_turn(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 2)])
        self.assertFalse(game.make_move("second", 3))

    def test_a_refused_move_does_not_change_whose_turn_it_is(self):
        game = AddThreeGame()
        game.make_move("first", 1)
        self.assertFalse(game.make_move("first", 2))
        self.assertTrue(game.make_move("second", 2))

    def test_a_move_by_the_wrong_player_does_not_use_up_the_number(self):
        game = AddThreeGame()
        self.assertFalse(game.make_move("second", 5))
        self.assertTrue(game.make_move("first", 5))


class TestNumberRange(unittest.TestCase):
    def test_every_number_from_1_to_9_is_allowed(self):
        for number in range(1, 10):
            with self.subTest(number=number):
                self.assertTrue(AddThreeGame().make_move("first", number))

    def test_zero_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", 0))

    def test_ten_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", 10))

    def test_a_negative_number_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", -3))

    def test_a_far_too_large_number_is_out_of_range(self):
        self.assertFalse(AddThreeGame().make_move("first", 100))

    def test_an_out_of_range_move_does_not_pass_the_turn(self):
        game = AddThreeGame()
        self.assertFalse(game.make_move("first", 10))
        self.assertTrue(game.make_move("first", 9))


class TestChosenNumbersCannotBeReused(unittest.TestCase):
    def test_a_number_the_other_player_chose_is_refused(self):
        game = AddThreeGame()
        play(game, [("first", 5)])
        self.assertFalse(game.make_move("second", 5))

    def test_a_number_the_same_player_chose_is_refused(self):
        game = AddThreeGame()
        play(game, [("first", 5), ("second", 1)])
        self.assertFalse(game.make_move("first", 5))

    def test_a_refused_duplicate_does_not_pass_the_turn(self):
        game = AddThreeGame()
        play(game, [("first", 5)])
        self.assertFalse(game.make_move("second", 5))
        self.assertTrue(game.make_move("second", 6))


class TestWinning(unittest.TestCase):
    def test_the_first_player_wins_with_three_numbers_that_add_to_15(self):
        game = AddThreeGame()
        results = play(
            game, [("first", 2), ("second", 1), ("first", 7), ("second", 3), ("first", 6)]
        )
        self.assertEqual(results, [True] * 5)
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_the_second_player_wins_with_three_numbers_that_add_to_15(self):
        game = AddThreeGame()
        results = play(
            game, [("first", 2), ("second", 1), ("first", 3), ("second", 5), ("first", 4), ("second", 9)]
        )
        self.assertEqual(results, [True] * 6)
        self.assertEqual(game.get_current_state(), "SECOND_WON")

    def test_two_numbers_cannot_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 1), ("first", 6)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_three_numbers_adding_to_less_than_15_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 9), ("first", 2), ("second", 8), ("first", 3)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_three_numbers_adding_to_more_than_15_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 1), ("first", 8), ("second", 2), ("first", 7)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_three_numbers_adding_to_14_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 2), ("first", 4), ("second", 3), ("first", 1)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_numbers_split_between_the_players_do_not_win(self):
        game = AddThreeGame()
        play(game, [("first", 9), ("second", 5), ("first", 1)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_a_win_using_the_first_three_numbers_chosen(self):
        game = AddThreeGame()
        play(game, [("first", 8), ("second", 1), ("first", 3), ("second", 2), ("first", 4)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_a_win_can_skip_over_a_number_chosen_in_the_middle(self):
        game = AddThreeGame()
        play(game, [("first", 4), ("second", 2), ("first", 1), ("second", 3), ("first", 5)])
        self.assertEqual(game.get_current_state(), "UNFINISHED")
        play(game, [("second", 7), ("first", 6)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_a_win_using_the_oldest_number_and_the_two_newest(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 3), ("first", 2), ("second", 4)])
        play(game, [("first", 5), ("second", 6), ("first", 9)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_a_win_using_the_three_newest_numbers(self):
        game = AddThreeGame()
        play(game, [("first", 1), ("second", 2), ("first", 4), ("second", 3)])
        play(game, [("first", 5), ("second", 7), ("first", 6)])
        self.assertEqual(game.get_current_state(), "FIRST_WON")


class TestDraw(unittest.TestCase):
    DRAWN_GAME = [1, 2, 4, 3, 5, 6, 7, 9, 8]

    def play_numbers(self, numbers):
        game = AddThreeGame()
        for turn, number in enumerate(numbers):
            player = "first" if turn % 2 == 0 else "second"
            self.assertTrue(game.make_move(player, number))
        return game

    def test_nine_numbers_with_no_winner_is_a_draw(self):
        game = self.play_numbers(self.DRAWN_GAME)
        self.assertEqual(game.get_current_state(), "DRAW")

    def test_the_game_is_unfinished_until_the_ninth_number(self):
        game = self.play_numbers(self.DRAWN_GAME[:8])
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_a_win_on_the_ninth_number_is_a_win_not_a_draw(self):
        winning_game = [1, 3, 2, 7, 4, 8, 5, 9, 6]
        game = self.play_numbers(winning_game)
        self.assertEqual(game.get_current_state(), "FIRST_WON")


class TestMovesAfterTheGameEnds(unittest.TestCase):
    def test_no_move_is_allowed_after_the_first_player_wins(self):
        game = AddThreeGame()
        play(game, [("first", 2), ("second", 1), ("first", 7), ("second", 3), ("first", 6)])
        self.assertFalse(game.make_move("second", 9))
        self.assertFalse(game.make_move("first", 9))
        self.assertEqual(game.get_current_state(), "FIRST_WON")

    def test_no_move_is_allowed_after_the_second_player_wins(self):
        game = AddThreeGame()
        play(game, [("first", 2), ("second", 1), ("first", 3), ("second", 5), ("first", 4), ("second", 9)])
        self.assertFalse(game.make_move("first", 6))
        self.assertFalse(game.make_move("second", 6))
        self.assertEqual(game.get_current_state(), "SECOND_WON")

    def test_no_move_is_allowed_after_a_draw(self):
        game = AddThreeGame()
        for turn, number in enumerate(TestDraw.DRAWN_GAME):
            game.make_move("first" if turn % 2 == 0 else "second", number)
        self.assertFalse(game.make_move("first", 1))
        self.assertFalse(game.make_move("second", 1))
        self.assertEqual(game.get_current_state(), "DRAW")


# ---- Run the tests ----
loader = unittest.defaultTestLoader
suite = unittest.TestSuite(
    loader.loadTestsFromTestCase(case)
    for case in [
        TestStartOfTheGame,
        TestTurnOrder,
        TestNumberRange,
        TestChosenNumbersCannotBeReused,
        TestWinning,
        TestDraw,
        TestMovesAfterTheGameEnds,
    ]
)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
