'''Schema for database.'''
from app import DB

class Leaderboard(DB.Model):
    '''Leaderboard table.'''
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        return '<Leaderboard %r>' % self.username


class Active(DB.Model):
    '''Active User table.'''
    id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(80), unique=True, nullable=False)

    def __repr__(self):
        return '<Active %r>' % self.name
