'''
    update_users_test.py
    Mocking tests
'''

import unittest
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))
from app import new_user_helper, gameover_helper
import models

KEY_EXPECTED = "expected"
INITIAL_USERNAME = 'user1'


class NewUserTestCase(unittest.TestCase):
    '''
    Mocking test for new user
    '''
    def setUp(self):
        key_input = "username"
        self.success_test_params = [
            {
                key_input:
                'player13423',
                KEY_EXPECTED:
                ["<Leaderboard 'user1'>", "<Leaderboard 'player13423'>"],
            },
            {
                key_input:
                'player2111',
                KEY_EXPECTED: [
                    "<Leaderboard 'user1'>", "<Leaderboard 'player13423'>",
                    "<Leaderboard 'player2111'>"
                ],
            },
            {
                key_input:
                'player3123',
                KEY_EXPECTED: [
                    "<Leaderboard 'user1'>", "<Leaderboard 'player13423'>",
                    "<Leaderboard 'player2111'>", "<Leaderboard 'player3123'>"
                ],
            },
        ]

        initial_person = models.Leaderboard(username=INITIAL_USERNAME,
                                            score=100)
        self.initial_db_mock = [initial_person]

    def mocked_db_session_add(self, username):
        '''
        Mocking appending database
        '''
        self.initial_db_mock.append(username)

    def mocked_db_session_commit(self):
        '''
        Mocking commiting to database
        '''

    def mocked_leaderboard_query_all(self):
        '''
        Mocking querying database
        '''
        return self.initial_db_mock

    def test_success(self):
        '''
        Main testing function
        '''
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit',
                           self.mocked_db_session_commit):
                    with patch('models.Leaderboard.query') as mocked_query:
                        mocked_query.all = self.mocked_leaderboard_query_all
                        actual_result = self.initial_db_mock
                        new_user_helper(test)
                        actual_result.pop()
                        expected_result = test[KEY_EXPECTED]
                        print(actual_result)
                        print(expected_result)
                        if len(actual_result) == 2:
                            self.assertEqual(len(actual_result),
                                             len(expected_result))
                            self.assertEqual(str(actual_result[1]),
                                             expected_result[1])
                        elif len(actual_result) == 3:
                            self.assertEqual(len(actual_result),
                                             len(expected_result))
                            self.assertEqual(str(actual_result[2]),
                                             expected_result[2])
                        elif len(actual_result) == 4:
                            self.assertEqual(len(actual_result),
                                             len(expected_result))
                            self.assertEqual(str(actual_result[3]),
                                             expected_result[3])


class XWinScoreUpdateTestCase(unittest.TestCase):
    '''
    Mocking test for score updating when x wins
    '''
    def setUp(self):
        key_input = "players"
        second_key_input = "winner"
        self.success_test_params = [
            {
                key_input: ['player1', 'player2'],
                second_key_input:
                "X",
                KEY_EXPECTED: [
                    "<Leaderboard 'player1'>", 101, "<Leaderboard 'player2'>",
                    99
                ],
            },
            {
                key_input: ['player1', 'player2'],
                second_key_input:
                "X",
                KEY_EXPECTED: [
                    "<Leaderboard 'player1'>", 102, "<Leaderboard 'player2'>",
                    98
                ],
            },
            {
                key_input: ['player1', 'player2'],
                second_key_input:
                "Draw",
                KEY_EXPECTED: [
                    "<Leaderboard 'player1'>", 102, "<Leaderboard 'player2'>",
                    98
                ],
            },
        ]

        initial_person1 = models.Leaderboard(username='player1', score=100)
        initial_person2 = models.Leaderboard(username='player2', score=100)
        self.initial_db_mock = [initial_person1, initial_person2]

    def mocked_db_session_commit(self):
        '''
        Mocking commiting to database
        '''

    def mocked_leaderboard_query_all(self):
        '''
        Mocking querying database
        '''
        return self.initial_db_mock

    def test_success(self):
        '''
        Main testing function
        '''
        for test in self.success_test_params:
            with patch('app.DB.session.commit', self.mocked_db_session_commit):
                with patch('models.Leaderboard.query') as mocked_query:
                    mocked_query.all = self.mocked_leaderboard_query_all
                    print(self.initial_db_mock)
                    actual_result = gameover_helper(test)
                    expected_result = test[KEY_EXPECTED]
                    print(actual_result)
                    print(expected_result)
                    self.assertEqual(actual_result[0], expected_result[1])
                    self.assertEqual(actual_result[1], expected_result[3])


class OWinScoreUpdateTestCase(unittest.TestCase):
    '''
    Mocking test for score updating when o wins
    '''
    def setUp(self):
        key_input = "players"
        second_key_input = "winner"
        self.success_test_params = [
            {
                key_input: ['player3', 'player4'],
                second_key_input:
                "O",
                KEY_EXPECTED: [
                    "<Leaderboard 'player1'>", 99, "<Leaderboard 'player2'>",
                    101
                ],
            },
            {
                key_input: ['player3', 'player4'],
                second_key_input:
                "O",
                KEY_EXPECTED: [
                    "<Leaderboard 'player1'>", 98, "<Leaderboard 'player2'>",
                    102
                ],
            },
            {
                key_input: ['player3', 'player4'],
                second_key_input:
                "Draw",
                KEY_EXPECTED: [
                    "<Leaderboard 'player1'>", 98, "<Leaderboard 'player2'>",
                    102
                ],
            },
        ]

        initial_person1 = models.Leaderboard(username='player1', score=100)
        initial_person2 = models.Leaderboard(username='player2', score=100)
        self.initial_db_mock = [initial_person1, initial_person2]

    def mocked_db_session_commit(self):
        '''
        Mocking commiting to database
        '''

    def mocked_leaderboard_query_all(self):
        '''
        Mocking querying database
        '''
        return self.initial_db_mock

    def test_success(self):
        '''
        Main testing function
        '''
        for test in self.success_test_params:
            with patch('app.DB.session.commit', self.mocked_db_session_commit):
                with patch('models.Leaderboard.query') as mocked_query:
                    mocked_query.all = self.mocked_leaderboard_query_all
                    print(self.initial_db_mock)
                    actual_result = gameover_helper(test)
                    expected_result = test[KEY_EXPECTED]
                    print(actual_result)
                    print(expected_result)
                    self.assertEqual(actual_result[0], expected_result[1])
                    self.assertEqual(actual_result[1], expected_result[3])


if __name__ == '__main__':
    unittest.main()
