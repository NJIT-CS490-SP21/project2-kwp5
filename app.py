import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
app = Flask(__name__, static_folder='./build/static')

ALLUSERS = []
ACTIVEUSERS = []
USERSCORES = []
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(app)
import models
CORS = CORS(app, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
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
    curr_players = [ACTIVEUSERS[0], ACTIVEUSERS[1]]
    data['curr_players'] = curr_players
    SOCKETIO.emit('boxClick', data, broadcast=True, include_self=False)

@SOCKETIO.on('newUser')
def on_new_user(user):
    user_check = DB.session.query(models.Leaderboard).filter_by(username=user['username']).first()
    if user_check is None:
        new_user = models.Leaderboard(username=user['username'], score=100)
        DB.session.add(new_user)
        DB.session.commit()
    active_user_check = DB.session.query(models.Active).filter_by(name=user['username']).first()
    if active_user_check is None:
        new_active_user = models.Active(name=user['username'])
        DB.session.add(new_active_user)
        DB.session.commit()
    all_people = DB.session.query(models.Leaderboard).order_by(models.Leaderboard.score.desc()).all()
    for person in all_people:
        if person.username not in ALLUSERS:
            ALLUSERS.append(person.username)
            USERSCORES.append(person.score)
    for person in models.Active.query.all():
        if person.name not in ACTIVEUSERS:
            ACTIVEUSERS.append(person.name)
    user['allUsers'] = ALLUSERS
    user['activeUsers'] = ACTIVEUSERS
    user['player_scores'] = USERSCORES
    SOCKETIO.emit('newUser', user, broadcast=True, include_self=False)

@SOCKETIO.on('restartGame')
def on_restart_game():
    SOCKETIO.emit('restartGame', broadcast=True, include_self=False)
    
@SOCKETIO.on('gameover')
def on_gameover(data):
    ALLUSERS = []
    USERSCORES = []
    player1 = DB.session.query(models.Leaderboard).filter_by(username=data['players'][0]).first()
    player2 = DB.session.query(models.Leaderboard).filter_by(username=data['players'][1]).first()
    print(data['winner'])
    if data['winner'] == "X":
        player1.score = player1.score + 1
        player2.score = player2.score - 1
    elif data['winner'] == "O":
        player2.score = player2.score + 1
        player1.score = player1.score - 1
    DB.session.merge(player1)
    DB.session.merge(player2)
    DB.session.commit()
    all_people = DB.session.query(models.Leaderboard).order_by(models.Leaderboard.score.desc()).all()
    for person in all_people:
        ALLUSERS.append(person.username)
        USERSCORES.append(person.score)
    data['allUsers'] = ALLUSERS
    data['player_scores'] = USERSCORES
    SOCKETIO.emit('gameover', data)
# Note we need to add this line so we can import APP in the python shell
if __name__ == "__main__":
# Note that we don't call APP.run anymore. We call SOCKETIO.run with APP arg
    SOCKETIO.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
