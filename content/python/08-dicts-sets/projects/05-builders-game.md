---
id: builders-game
title: Builders game (final project)
section: 8
after: sets
---

Write a class called `BuildersGame` for a two-player game on a 5x5 grid. Each
player has two builders. The builders move around the board and add levels to
towers. The first player to move a builder on top of a 3-story tower wins.

**The rules.** Player A is `'x'` and player B is `'o'`. Player A places two
builders on the board, then player B places two. No two builders can ever share a square. After that, player A moves one
builder to an adjacent square (one step in any direction, including diagonals).
A builder can move down any number of levels but can move up at most 1 level. It
can also stay at the same level. A builder always ends up on top of the tower on
its new square.

After moving, the builder **must** add a level to an adjacent square. A level
cannot be added to a square with a builder on it. Once a tower has a 4th level,
it is complete: no more levels can be added and no builder can move onto it. Players then alternate moving and building. A
player wins by moving a builder on top of a 3-story tower, **or** when the
opponent has no legal move.

**The class.** It has these **private** data members: a representation of the
board; the current state, which is "playerA_WON", "playerB_WON" or "UNFINISHED";
and something that tracks whose turn it is.

- `__init__` sets up an empty board, sets the state to "UNFINISHED", and sets
  up the other data members. A list of lists works well for the board: five
  lists, each holding five empty strings (or any character you like for an empty
  square).
- `get_current_state` returns the current state.
- `initial_placement` takes five parameters: the row and column of each of the
  player's two builders, and `'x'` or `'o'` to say which player is placing them.
  Rows and columns are integers from 0 to 4. For example,
  `initial_placement(0,1,4,2,'o')` puts o's builders at row 0, column 1 and row
  4, column 2. Return `False` if a chosen square is occupied, if the player
  placing is not the player whose turn it is, or if that player has already
  placed their builders. Otherwise update the board and whose turn it is, and
  return `True`.
- `make_move` takes six parameters: the row and column of the builder to move,
  the row and column it moves to, and the row and column where it builds. For
  example, `make_move(2,0,3,1,3,0)` moves the builder at row 2, column 0 to row
  3, column 1, then builds a level at row 3, column 0. Return `False` if the game
  is over, if the move is invalid, if the builder does not belong to the player
  whose turn it is, or if either player has not made their initial placement
  yet. Otherwise record the move, update the state and whose turn it is, and
  return `True`. To update the state, check whether the move put a builder on a
  3-story tower, or left the opponent with no legal move.

It is not required, but a method that prints the board helps a lot when testing
and debugging. Whether you index the board as `[row][column]` or `[column][row]`
does not matter as long as you are consistent.

Here is a simple example of how the class could be used:

```python
board = BuildersGame()
board.initial_placement(2,2,1,2,'x')
board.initial_placement(0,1,4,2,'o')
board.make_move(2,2,1,1,1,0)
board.make_move(0,1,1,0,2,0)
board.get_current_state()
```

Save the file as `BuildersGame.py`.


<details>
<summary>Show a solution</summary>

:::cell id=solution-builders-game
Try the project on your own first. This is one working solution, followed by its tests. Press **Run** to run the tests. Read them to see what thorough testing looks like, then change the solution and run again to watch a test fail. The testing tools used here (classes and `unittest`) are not part of the course yet, so do not worry about how they work.

```python starter
class BuildersGame:
    """A two-player building game on a 5x5 grid. Player A is 'x', player B is 'o'."""

    def __init__(self) -> None:
        """Start with an empty board and player A to place builders."""
        self._size: int = 5
        self._levels: list = []
        for row in range(self._size):
            row_levels: list = []
            for col in range(self._size):
                row_levels.append(0)
            self._levels.append(row_levels)
        self._builders: dict = {"x": [], "o": []}
        self._state: str = "UNFINISHED"
        self._turn: str = "x"

    def get_current_state(self) -> str:
        """Return "playerA_WON", "playerB_WON" or "UNFINISHED"."""
        return self._state

    def print_board(self) -> None:
        """Print each square as its level, then the builder's letter (or a dot if none)."""
        for row in range(self._size):
            line: str = ""
            for col in range(self._size):
                owner: str = self._owner_at(row, col)
                if owner == "":
                    owner = "."
                if col > 0:
                    line = line + " "
                line = line + str(self._levels[row][col]) + owner
            print(line)

    def initial_placement(self, row1: int, col1: int, row2: int, col2: int, player: str) -> bool:
        """Place a player's two builders. Return False if the placement is not allowed."""
        if player != self._turn or self._builders[player] != []:
            return False
        if row1 == row2 and col1 == col2:
            return False
        if not self._on_board(row1, col1) or self._owner_at(row1, col1) != "":
            return False
        if not self._on_board(row2, col2) or self._owner_at(row2, col2) != "":
            return False

        self._builders[player] = [[row1, col1], [row2, col2]]
        self._turn = self._other_player(player)
        return True

    def make_move(
        self, from_row: int, from_col: int, to_row: int, to_col: int, build_row: int, build_col: int
    ) -> bool:
        """Move a builder, then build. Return False if the move is not allowed."""
        player: str = self._turn
        if self._state != "UNFINISHED":
            return False
        # Before both players have placed, the player to move may have no builder, so this fails.
        if not self._is_legal(player, from_row, from_col, to_row, to_col, build_row, build_col):
            return False

        for builder in self._builders[player]:
            if builder == [from_row, from_col]:
                builder[0] = to_row
                builder[1] = to_col
        self._levels[build_row][build_col] += 1

        opponent: str = self._other_player(player)
        if self._levels[to_row][to_col] == 3 or not self._has_legal_move(opponent):
            if player == "x":
                self._state = "playerA_WON"
            else:
                self._state = "playerB_WON"
        self._turn = opponent
        return True

    def _other_player(self, player: str) -> str:
        """Return the letter of the player who is not `player`."""
        if player == "x":
            return "o"
        return "x"

    def _on_board(self, row: int, col: int) -> bool:
        """Return True if the square is inside the 5x5 grid."""
        return 0 <= row < self._size and 0 <= col < self._size

    def _owner_at(self, row: int, col: int) -> str:
        """Return 'x' or 'o' if a builder stands on the square, else an empty string."""
        for player in self._builders:
            if [row, col] in self._builders[player]:
                return player
        return ""

    def _is_adjacent(self, row1: int, col1: int, row2: int, col2: int) -> bool:
        """Return True if the squares are different and touch, even diagonally."""
        same_square: bool = row1 == row2 and col1 == col2
        return not same_square and abs(row1 - row2) <= 1 and abs(col1 - col2) <= 1

    def _is_legal(
        self,
        player: str,
        from_row: int,
        from_col: int,
        to_row: int,
        to_col: int,
        build_row: int,
        build_col: int,
    ) -> bool:
        """Return True if `player` may make this move and build."""
        if not self._on_board(to_row, to_col) or not self._on_board(build_row, build_col):
            return False
        if [from_row, from_col] not in self._builders[player]:
            return False
        if not self._is_adjacent(from_row, from_col, to_row, to_col):
            return False
        if self._owner_at(to_row, to_col) != "":
            return False
        climb: int = self._levels[to_row][to_col] - self._levels[from_row][from_col]
        if climb > 1:  # A finished tower (level 4) is too high for any builder to climb.
            return False

        if not self._is_adjacent(to_row, to_col, build_row, build_col):
            return False
        # The builder has left its old square, so that square is free to build on.
        vacated: bool = build_row == from_row and build_col == from_col
        if self._owner_at(build_row, build_col) != "" and not vacated:
            return False
        return self._levels[build_row][build_col] < 4

    def _has_legal_move(self, player: str) -> bool:
        """Return True if `player` has at least one legal move and build."""
        for builder in self._builders[player]:
            for to_row in range(self._size):
                for to_col in range(self._size):
                    for build_row in range(self._size):
                        for build_col in range(self._size):
                            if self._is_legal(
                                player, builder[0], builder[1], to_row, to_col, build_row, build_col
                            ):
                                return True
        return False


# ---- Tests ----
import io
import sys
import unittest
from contextlib import redirect_stdout

# Opening squares used by most tests: x at (2,2) and (1,2), o at (0,1) and (4,2).
X_START = ((2, 2), (1, 2))
O_START = ((0, 1), (4, 2))

# A short game in which player x climbs a tower, one level per move, and then wins.
# Odd-numbered moves belong to the climber, even-numbered ones to a weak opponent.
CLIMB_1 = (2, 2, 3, 2, 3, 3)  # builds (3,3) to level 1
WEAK_1 = (4, 2, 4, 3, 3, 4)  # builds (3,4) to level 1
CLIMB_2 = (3, 2, 3, 3, 3, 4)  # steps up onto (3,3), builds (3,4) to level 2
WEAK_2 = (4, 3, 4, 2, 4, 3)
CLIMB_3 = (3, 3, 3, 4, 3, 3)  # steps up onto (3,4), builds (3,3) to level 2
WEAK_3 = (4, 2, 4, 3, 3, 3)  # builds (3,3) to level 3
CLIMB_4 = (3, 4, 3, 3, 4, 4)  # steps up from level 2 onto the level 3 tower
CLIMB_SO_FAR = (CLIMB_1, WEAK_1, CLIMB_2, WEAK_2, CLIMB_3)


class BuildersTestCase(unittest.TestCase):
    """Shared helpers. The board is read through print_board, its public view."""

    def new_game(self, x_squares=X_START, o_squares=O_START):
        game = BuildersGame()
        self.assertTrue(game.initial_placement(*x_squares[0], *x_squares[1], "x"))
        self.assertTrue(game.initial_placement(*o_squares[0], *o_squares[1], "o"))
        return game

    def play(self, game, *moves):
        for move in moves:
            self.assertTrue(game.make_move(*move), f"move {move} should be allowed")

    def board(self, game):
        output = io.StringIO()
        with redirect_stdout(output):
            game.print_board()
        return output.getvalue().splitlines()

    def assertBoard(self, game, *rows):
        self.assertEqual(self.board(game), list(rows))

    def square(self, game, row, col):
        """Return the level and builder letter on a square, such as '2x' or '0.'."""
        return self.board(game)[row].split()[col]


class TestPrintBoard(BuildersTestCase):
    def test_an_empty_board_is_five_rows_of_level_zero(self):
        self.assertBoard(
            BuildersGame(),
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
        )

    def test_each_builder_is_shown_as_its_letter_after_the_level(self):
        self.assertBoard(
            self.new_game(),
            "0. 0o 0. 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0o 0. 0.",
        )

    def test_printing_does_not_change_the_game(self):
        game = self.new_game()
        before = self.board(game)
        self.assertEqual(self.board(game), before)
        self.assertEqual(game.get_current_state(), "UNFINISHED")


class TestInitialPlacement(BuildersTestCase):
    def test_x_places_first_and_then_o(self):
        game = BuildersGame()
        self.assertTrue(game.initial_placement(2, 2, 1, 2, "x"))
        self.assertTrue(game.initial_placement(0, 1, 4, 2, "o"))

    def test_o_cannot_place_before_x(self):
        game = BuildersGame()
        self.assertFalse(game.initial_placement(0, 1, 4, 2, "o"))
        self.assertEqual(self.square(game, 0, 1), "0.")

    def test_x_cannot_place_twice_in_a_row(self):
        game = BuildersGame()
        self.assertTrue(game.initial_placement(2, 2, 1, 2, "x"))
        self.assertFalse(game.initial_placement(3, 3, 3, 4, "x"))

    def test_a_player_who_has_placed_cannot_place_again_on_their_turn(self):
        game = self.new_game()
        self.assertFalse(game.initial_placement(3, 3, 3, 4, "x"))
        self.assertEqual(self.square(game, 3, 3), "0.")

    def test_an_unknown_player_letter_is_refused(self):
        self.assertFalse(BuildersGame().initial_placement(0, 0, 0, 1, "z"))

    def test_builders_cannot_be_placed_on_an_occupied_square(self):
        for first, second in [((0, 1), (4, 4)), ((4, 4), (0, 1))]:
            with self.subTest(first=first, second=second):
                game = BuildersGame()
                game.initial_placement(0, 1, 3, 3, "x")
                self.assertFalse(game.initial_placement(*first, *second, "o"))

    def test_a_refused_placement_leaves_no_builder_behind(self):
        game = BuildersGame()
        game.initial_placement(0, 1, 3, 3, "x")
        game.initial_placement(4, 4, 0, 1, "o")
        self.assertEqual(self.square(game, 4, 4), "0.")
        self.assertTrue(game.initial_placement(4, 4, 4, 3, "o"))

    def test_both_builders_cannot_share_a_square(self):
        game = BuildersGame()
        self.assertFalse(game.initial_placement(2, 2, 2, 2, "x"))

    def test_squares_must_be_on_the_board(self):
        off_board = [(-1, 0), (5, 0), (0, -1), (0, 5)]
        for square in off_board:
            with self.subTest(square=square, builder="first"):
                self.assertFalse(BuildersGame().initial_placement(*square, 2, 2, "x"))
            with self.subTest(square=square, builder="second"):
                self.assertFalse(BuildersGame().initial_placement(2, 2, *square, "x"))

    def test_opposite_corners_are_on_the_board(self):
        self.assertTrue(BuildersGame().initial_placement(0, 0, 4, 4, "x"))
        self.assertTrue(BuildersGame().initial_placement(0, 4, 4, 0, "x"))


class TestLegalMoves(BuildersTestCase):
    def test_a_move_puts_the_builder_on_the_new_square_and_builds(self):
        game = self.new_game()
        self.assertTrue(game.make_move(2, 2, 3, 2, 3, 3))
        self.assertBoard(
            game,
            "0. 0o 0. 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0x 1. 0.",
            "0. 0. 0o 0. 0.",
        )

    def test_a_builder_may_step_in_all_eight_directions(self):
        for row_step in (-1, 0, 1):
            for col_step in (-1, 0, 1):
                if (row_step, col_step) == (0, 0):
                    continue
                with self.subTest(row_step=row_step, col_step=col_step):
                    game = self.new_game(((2, 2), (0, 0)), ((4, 4), (4, 0)))
                    to_row, to_col = 2 + row_step, 2 + col_step
                    self.assertTrue(game.make_move(2, 2, to_row, to_col, 2, 2))
                    self.assertEqual(self.square(game, to_row, to_col), "0x")

    def test_players_take_turns(self):
        game = self.new_game()
        self.assertTrue(game.make_move(2, 2, 3, 2, 3, 3))
        self.assertFalse(game.make_move(3, 2, 2, 2, 3, 2))
        self.assertTrue(game.make_move(4, 2, 4, 3, 3, 4))
        self.assertTrue(game.make_move(3, 2, 2, 2, 3, 2))

    def test_the_second_builder_can_move_too(self):
        game = self.new_game()
        self.assertTrue(game.make_move(1, 2, 1, 3, 1, 2))
        self.assertEqual(self.square(game, 1, 3), "0x")

    def test_a_refused_move_changes_nothing_and_keeps_the_turn(self):
        game = self.new_game()
        before = self.board(game)
        self.assertFalse(game.make_move(2, 2, 4, 4, 4, 3))
        self.assertEqual(self.board(game), before)
        self.assertTrue(game.make_move(2, 2, 3, 2, 3, 3))


class TestIllegalMoves(BuildersTestCase):
    def test_no_move_is_possible_before_anyone_has_placed(self):
        self.assertFalse(BuildersGame().make_move(2, 2, 3, 2, 3, 3))

    def test_no_move_is_possible_until_both_players_have_placed(self):
        game = BuildersGame()
        game.initial_placement(2, 2, 1, 2, "x")
        self.assertFalse(game.make_move(2, 2, 3, 2, 3, 3))

    def test_the_square_moved_from_must_hold_a_builder(self):
        game = self.new_game()
        self.assertFalse(game.make_move(3, 3, 3, 2, 3, 3))

    def test_a_player_cannot_move_the_opponents_builder(self):
        game = self.new_game()
        self.assertFalse(game.make_move(4, 2, 4, 3, 3, 3))

    def test_a_builder_cannot_stay_where_it_is(self):
        game = self.new_game()
        self.assertFalse(game.make_move(2, 2, 2, 2, 3, 3))

    def test_a_builder_cannot_move_two_squares(self):
        for target in [(4, 2), (2, 4), (0, 0), (4, 4)]:
            with self.subTest(target=target):
                game = self.new_game(((2, 2), (1, 2)), ((0, 4), (4, 0)))
                self.assertFalse(game.make_move(2, 2, *target, 3, 3))

    def test_a_builder_cannot_move_onto_another_builder(self):
        game = self.new_game(((2, 2), (2, 3)), ((3, 2), (4, 4)))
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 2), "own builder")
        self.assertFalse(game.make_move(2, 2, 3, 2, 2, 2), "opponent's builder")

    def test_a_builder_cannot_move_off_the_board(self):
        moves = [
            (0, 0, -1, 0, 0, 0),
            (0, 0, 0, -1, 0, 0),
            (4, 4, 5, 4, 4, 4),
            (4, 4, 4, 5, 4, 4),
        ]
        for move in moves:
            with self.subTest(move=move):
                game = self.new_game(((0, 0), (4, 4)), ((0, 4), (4, 0)))
                self.assertFalse(game.make_move(*move))

    def test_a_builder_can_move_between_corner_and_edge(self):
        game = self.new_game(((0, 0), (4, 4)), ((0, 4), (4, 0)))
        self.assertTrue(game.make_move(0, 0, 0, 1, 0, 0))
        self.assertTrue(game.make_move(0, 4, 0, 3, 0, 4))
        self.assertTrue(game.make_move(4, 4, 4, 3, 4, 4))


class TestBuilding(BuildersTestCase):
    def test_building_adds_one_level_to_the_chosen_square(self):
        game = self.new_game()
        game.make_move(2, 2, 3, 2, 3, 3)
        self.assertEqual(self.square(game, 3, 3), "1.")

    def test_a_builder_may_build_on_the_square_it_just_left(self):
        game = self.new_game()
        self.assertTrue(game.make_move(2, 2, 3, 2, 2, 2))
        self.assertEqual(self.square(game, 2, 2), "1.")

    def test_a_builder_cannot_build_on_the_square_it_moved_to(self):
        game = self.new_game()
        self.assertFalse(game.make_move(2, 2, 3, 2, 3, 2))

    def test_the_build_must_touch_the_new_square_not_the_old_one(self):
        game = self.new_game(((2, 2), (0, 0)), ((4, 4), (4, 0)))
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 1), "next to the old square only")
        self.assertFalse(game.make_move(2, 2, 2, 3, 4, 3), "two rows away")
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 5), "two columns away")

    def test_a_builder_cannot_build_on_another_builder(self):
        game = self.new_game(((2, 2), (2, 4)), ((3, 3), (4, 0)))
        self.assertFalse(game.make_move(2, 2, 2, 3, 2, 4), "own builder")
        self.assertFalse(game.make_move(2, 2, 2, 3, 3, 3), "opponent's builder")

    def test_a_builder_cannot_build_off_the_board(self):
        moves = [
            (0, 0, 0, 1, -1, 1),
            (0, 0, 1, 0, 1, -1),
            (4, 4, 4, 3, 5, 3),
            (4, 4, 3, 4, 3, 5),
        ]
        for move in moves:
            with self.subTest(move=move):
                game = self.new_game(((0, 0), (4, 4)), ((0, 4), (4, 0)))
                self.assertFalse(game.make_move(*move))


class TestTowers(BuildersTestCase):
    def build_two_towers(self, game):
        """x and o shuffle back and forth, building (1,1) and (3,1) up to level 4."""
        for _ in range(2):
            self.play(game, (0, 0, 0, 1, 1, 1), (4, 0, 4, 1, 3, 1))
            self.play(game, (0, 1, 0, 0, 1, 1), (4, 1, 4, 0, 3, 1))

    def new_game_with_towers(self):
        game = self.new_game(((0, 0), (0, 4)), ((4, 0), (4, 4)))
        self.build_two_towers(game)
        return game

    def test_a_tower_gets_a_fourth_level_and_is_then_complete(self):
        game = self.new_game_with_towers()
        self.assertEqual(self.square(game, 1, 1), "4.")
        self.assertEqual(self.square(game, 3, 1), "4.")

    def test_no_level_can_be_added_to_a_complete_tower(self):
        game = self.new_game_with_towers()
        self.assertFalse(game.make_move(0, 0, 0, 1, 1, 1))
        self.assertEqual(self.square(game, 1, 1), "4.")

    def test_no_builder_can_move_onto_a_complete_tower(self):
        game = self.new_game_with_towers()
        self.assertFalse(game.make_move(0, 0, 1, 1, 0, 0))

    def test_the_same_move_works_when_it_builds_somewhere_else(self):
        game = self.new_game_with_towers()
        self.assertTrue(game.make_move(0, 0, 0, 1, 1, 0))
        self.assertEqual(self.square(game, 1, 0), "1.")


class TestClimbing(BuildersTestCase):
    def test_a_builder_can_step_up_one_level(self):
        game = self.new_game()
        self.play(game, CLIMB_1, WEAK_1)
        self.assertTrue(game.make_move(*CLIMB_2))
        self.assertEqual(self.square(game, 3, 3), "1x")

    def test_a_builder_can_step_up_from_level_one_to_level_two(self):
        game = self.new_game()
        self.play(game, CLIMB_1, WEAK_1, CLIMB_2, WEAK_2)
        self.assertTrue(game.make_move(*CLIMB_3))
        self.assertEqual(self.square(game, 3, 4), "2x")

    def test_a_builder_cannot_climb_two_levels_at_once(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR)
        self.assertEqual(self.square(game, 3, 3), "2.")
        self.assertFalse(game.make_move(4, 2, 3, 3, 4, 2))

    def test_a_builder_can_move_to_a_square_at_its_own_level(self):
        game = self.new_game()
        self.play(game, CLIMB_1, WEAK_1, CLIMB_2, WEAK_2)
        self.assertEqual(self.square(game, 3, 3), "1x")
        self.assertEqual(self.square(game, 4, 3), "1.")
        self.assertTrue(game.make_move(3, 3, 4, 3, 3, 3))

    def test_a_builder_can_step_down_any_number_of_levels(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3)
        self.assertEqual(self.square(game, 3, 4), "2x")
        self.assertTrue(game.make_move(3, 4, 4, 4, 3, 4))
        self.assertEqual(self.square(game, 4, 4), "0x")

    def test_a_builder_always_stands_on_top_of_the_tower(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR)
        self.assertBoard(
            game,
            "0. 0o 0. 0. 0.",
            "0. 0. 0x 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 2. 2x",
            "0. 0. 0o 1. 0.",
        )


class TestWinning(BuildersTestCase):
    def test_a_new_game_is_unfinished(self):
        self.assertEqual(BuildersGame().get_current_state(), "UNFINISHED")

    def test_the_game_is_unfinished_while_players_place_and_move(self):
        game = self.new_game()
        self.assertEqual(game.get_current_state(), "UNFINISHED")
        self.play(game, CLIMB_1, WEAK_1)
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_building_a_third_level_does_not_win_by_itself(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3)
        self.assertEqual(self.square(game, 3, 3), "3.")
        self.assertEqual(game.get_current_state(), "UNFINISHED")

    def test_x_wins_by_stepping_up_onto_a_level_three_tower(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3, CLIMB_4)
        self.assertEqual(self.square(game, 3, 3), "3x")
        self.assertEqual(game.get_current_state(), "playerA_WON")

    def test_o_wins_by_stepping_up_onto_a_level_three_tower(self):
        game = self.new_game(O_START, X_START)
        self.play(game, (0, 1, 0, 0, 1, 0))  # x moves a far-away builder first
        self.play(game, *CLIMB_SO_FAR, WEAK_3, CLIMB_4)
        self.assertEqual(game.get_current_state(), "playerB_WON")

    def test_nobody_can_move_after_the_game_is_won(self):
        game = self.new_game()
        self.play(game, *CLIMB_SO_FAR, WEAK_3, CLIMB_4)
        before = self.board(game)
        self.assertFalse(game.make_move(4, 3, 4, 2, 4, 3), "the loser")
        self.assertFalse(game.make_move(3, 3, 3, 4, 3, 3), "the winner")
        self.assertEqual(self.board(game), before)
        self.assertEqual(game.get_current_state(), "playerA_WON")

    def test_x_wins_when_o_has_no_legal_move(self):
        game = self.new_game(((1, 2), (0, 2)), ((0, 0), (0, 1)))
        self.play(
            game,
            (1, 2, 2, 2, 1, 2),
            (0, 1, 1, 0, 1, 1),
            (2, 2, 1, 1, 1, 2),
            (1, 0, 0, 1, 1, 2),
        )
        self.assertEqual(game.get_current_state(), "UNFINISHED")
        self.assertTrue(game.make_move(1, 1, 1, 0, 1, 1))
        self.assertBoard(
            game,
            "0o 0o 0x 0. 0.",
            "0x 2. 3. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
            "0. 0. 0. 0. 0.",
        )
        self.assertEqual(game.get_current_state(), "playerA_WON")


# ---- Run the tests ----
loader = unittest.defaultTestLoader
cases = [
    TestPrintBoard,
    TestInitialPlacement,
    TestLegalMoves,
    TestIllegalMoves,
    TestBuilding,
    TestTowers,
    TestClimbing,
    TestWinning,
]
suite = unittest.TestSuite(loader.loadTestsFromTestCase(case) for case in cases)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```
:::

</details>
