import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
APP = Flask(__name__, static_folder='./build/static')

ALLUSERS = []
ACTIVEUSERS = []
# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import leader_db
DB.create_all()
CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    print('User disconnected!')

@SOCKETIO.on('boxClick')
def on_box_click(data):
    print(str(data['index']))
    print(str(data['playername']))
    print(str(data['turn']))
    curr_players = [ACTIVEUSERS[0], ACTIVEUSERS[1]]
    data['curr_players'] = curr_players
    SOCKETIO.emit('boxClick', data, broadcast=True, include_self=False)

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@SOCKETIO.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('chat', data, broadcast=True, include_self=False)

@SOCKETIO.on('newUser')
def on_new_user(user):
    print(str(user))
    new_user = leader_db.Leaderboard(username=user['username'], score=100)
    if not new_user:
        DB.session.add(new_user)
        DB.session.commit()
    new_active_user = leader_db.Active(username=user['username'])
    DB.session.add(new_active_user)
    DB.session.commit()
    all_people = leader_db.Leaderboard.query.all()
    all_active_people = leader_db.Active.query.all()
    scores = []
    for person in all_people:
        ALLUSERS.append(person.username)
        scores.append(person.score)
    for active in all_active_people:
        ACTIVEUSERS.append(active.username)
    user['allUsers'] = ALLUSERS
    user['curr_players'] = ACTIVEUSERS
    user['player_scores'] = scores
    SOCKETIO.emit('newUser', user, broadcast=True, include_self=False)

@SOCKETIO.on('restartGame')
def on_restart_game():
    SOCKETIO.emit('restartGame', broadcast=True, include_self=False)
    
@SOCKETIO.on('gameover')
def on_gameover(data):
    player1 = leader_db.Leaderboard.query.filter_by(username=data['players'][0]).first()
    player2 = leader_db.Leaderboard.query.filter_by(username=data['players'][1]).first()
    if data['outcome'] == "X Wins":
        player1.score += 1
        player2.score -= 1
    if data['outcome'] == "O Wins":
        player1.score -= 1
        player2.score += 1
    DB.session.commit()
    all_people = leader_db.Leaderboard.query.all()
    scores = []
    for person in all_people:
        ALLUSERS.append(person.username)
        scores.append(person.score)
    data['allUsers'] = ALLUSERS
    data['player_scores'] = scores
    SOCKETIO.emit('gameover', data)


# Note we need to add this line so we can import APP in the python shell
if __name__ == "__main__":
# Note that we don't call APP.run anymore. We call SOCKETIO.run with APP arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
