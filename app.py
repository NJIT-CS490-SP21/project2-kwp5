'''Main program to run backend server for Tic Tac Toe.'''
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
APP = Flask(__name__, static_folder='./build/static')

ALLUSERS = []
ACTIVEUSERS = []
USERSCORES = []
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
import models
CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''Get file.'''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''Connect user.'''
    print('User connected!')


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    '''Disonnect user.'''
    print('User disconnected!')


@SOCKETIO.on('boxClick')
def on_box_click(data):
    '''Tell all users a box was clicked.'''
    curr_players = [ACTIVEUSERS[0], ACTIVEUSERS[1]]
    data['curr_players'] = curr_players
    SOCKETIO.emit('boxClick', data, broadcast=True, include_self=False)


@SOCKETIO.on('newUser')
def on_new_user(user):
    '''Add new user to leaderboard and player list.'''
    new_user_helper(user)
    user['allUsers'] = ALLUSERS
    user['activeUsers'] = ACTIVEUSERS
    user['player_scores'] = USERSCORES
    SOCKETIO.emit('newUser', user, broadcast=True, include_self=False)


def new_user_helper(userdata):
    '''Helper for on_new_user function'''
    user_check = DB.session.query(
        models.Leaderboard).filter_by(username=userdata['username']).first()
    if user_check is None:
        new_user = models.Leaderboard(username=userdata['username'], score=100)
        DB.session.add(new_user)
        DB.session.commit()
    active_user_check = DB.session.query(
        models.Active).filter_by(name=userdata['username']).first()
    if active_user_check is None:
        new_active_user = models.Active(name=userdata['username'])
        DB.session.add(new_active_user)
        DB.session.commit()
    all_people = DB.session.query(models.Leaderboard).order_by(
        models.Leaderboard.score.desc()).all()
    for person in all_people:
        if person.username not in ALLUSERS:
            ALLUSERS.append(person.username)
            USERSCORES.append(person.score)
    for person in models.Active.query.all():
        if person.name not in ACTIVEUSERS:
            ACTIVEUSERS.append(person.name)
    return ALLUSERS


@SOCKETIO.on('restartGame')
def on_restart_game():
    '''Restart game for all users.'''
    SOCKETIO.emit('restartGame', broadcast=True, include_self=False)


@SOCKETIO.on('gameover')
def on_gameover(data):
    '''Update leaderboard for all users.'''
    ALLUSERS.clear()
    USERSCORES.clear()
    gameover_helper(data)
    data['allUsers'] = ALLUSERS
    data['player_scores'] = USERSCORES
    SOCKETIO.emit('gameover', data)


def gameover_helper(scoredata):
    '''Helper for on_gameover function'''
    player1 = DB.session.query(models.Leaderboard).filter_by(
        username=scoredata['players'][0]).first()
    player2 = DB.session.query(models.Leaderboard).filter_by(
        username=scoredata['players'][1]).first()
    print(scoredata['winner'])
    if scoredata['winner'] == "X":
        player1.score = player1.score + 1
        player2.score = player2.score - 1
    elif scoredata['winner'] == "O":
        player2.score = player2.score + 1
        player1.score = player1.score - 1
    DB.session.merge(player1)
    DB.session.merge(player2)
    DB.session.commit()
    all_people = DB.session.query(models.Leaderboard).order_by(
        models.Leaderboard.score.desc()).all()
    for person in all_people:
        ALLUSERS.append(person.username)
        USERSCORES.append(person.score)
    return [player1.score, player2.score]


# Note we need to add this line so we can import APP in the python shell
if __name__ == "__main__":
    # Note that we don't call APP.run anymore. We call SOCKETIO.run with APP arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
