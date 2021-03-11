'''
    update_users_test.py
    
    Fill in what this test is for here
'''

import unittest
from app import on_new_user

USERNAME_INPUT = "username"
USERS_INPUT = 'users'
EXPECTED_OUTPUT = "expected"

class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                USERNAME_INPUT: { "player1" },
                USERS_INPUT: {
                    'player_x': None,
                    'player_o': None,
                    'spectators': [],
                },
                EXPECTED_OUTPUT: {
                    'player_x': "player1",
                    'player_o': None,
                    'spectators': [],
                }
            },
            {
                USERNAME_INPUT: { "player2" },
                USERS_INPUT: {
                    'player_x': "player1",
                    'player_o': None,
                    'spectators': [],
                },
                EXPECTED_OUTPUT: {
                    'player_x': "player1",
                    'player_o': "player2",
                    'spectators': [],
                }
            },
            {
                USERNAME_INPUT: { "player3" },
                USERS_INPUT: {
                    'player_x': "player1",
                    'player_o': "player2",
                    'spectators': [],
                },
                EXPECTED_OUTPUT: {
                    'player_x': "player1",
                    'player_o': "player2",
                    'spectators': ["player3"],
                }
            },
        ]

    def test_add_user(self):
        for test in self.success_test_params:
            print(test['username'])
            real_result = on_new_user(test['username'])
            expected_result = test['EXPECTED_OUTPUT']
            self.assertEqual(real_result[0],expected_result[0])
            self.assertEqual(real_result[1],expected_result[1])
            self.assertEqual(real_result[2],expected_result[2])
            # TODO: Make a call to add user with your test inputs
            # then assign it to a variable. Look at split_test for example
            # actual_result = 
            
            # TODO: Assign the expected output as a variable from test
            # expected_result = 

            # TODO: Use assert checks to see compare values of the results
            # self.assertEqual(
            # self.assertEqual(
            # self.assertEqual(

if __name__ == '__main__':
    unittest.main()