import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import io from 'socket.io-client';
import Box from './Box';
import Leaderboard from './Leaderboard';
import UserList from './UserList';

const socket = io();
export default function Board(props) {
  const [board, setBoard] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [turn, setNextTurn] = useState(true);
  const [outcome, setOutcome] = useState('');
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allScores, setAllScores] = useState([]);
  const { player } = props;

  function calculateWinner(gameBoard) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (
        gameBoard[a]
        && gameBoard[a] === gameBoard[b]
        && gameBoard[a] === gameBoard[c]
      ) {
        document.getElementById('winnerHead').style.visibility = 'visible';
        document.getElementById('currTurn').style.visibility = 'hidden';
        document.getElementById(a).style.color = 'red';
        document.getElementById(b).style.color = 'red';
        document.getElementById(c).style.color = 'red';
        if (props.player === players[0] || props.player === players[1]) {
          document.getElementById('winnerButton').style.visibility = 'visible';
        }
        setOutcome(`${gameBoard[a]} Wins`);
        return gameBoard[a];
      }
    }
    if (gameBoard.every((value) => value !== null)) {
      document.getElementById('currTurn').style.visibility = 'hidden';
      if (props.player === players[0] || props.player === players[1]) {
        document.getElementById('winnerButton').style.visibility = 'visible';
      }
      return true;
    }
    return false;
  }

  function onClickBox(boxIndex) {
    const data = {
      index: boxIndex,
      playername: props.player,
      turn,
      currBoard: board,
    };
    if (calculateWinner(board)) {
      return;
    }
    function playerOneTurn() {
      if (board[boxIndex] == null && props.player === players[0]) {
        board[boxIndex] = 'X';
        setBoard(board);
        setNextTurn(false);
        data.turn = false;
        data.currBoard = board;
        socket.emit('boxClick', data);
        if (calculateWinner(board)) {
          const endData = { winner: calculateWinner(board), players };
          socket.emit('gameover', endData);
        }
      }
    }
    function playerTwoTurn() {
      if (board[boxIndex] == null && props.player === players[1]) {
        board[boxIndex] = 'O';
        setBoard(board);
        setNextTurn(true);
        data.turn = true;
        data.currBoard = board;
        socket.emit('boxClick', data);
        if (calculateWinner(board)) {
          const endData = { winner: calculateWinner(board), players };
          socket.emit('gameover', endData);
        }
      }
    }
    if (props.player === players[0] && turn) {
      playerOneTurn();
    } else if (props.player === players[1] && !turn) {
      playerTwoTurn();
    }
  }

  function restartGame() {
    setBoard([null, null, null, null, null, null, null, null, null]);
    setOutcome('');
    for (let i = 0; i < 9; i += 1) {
      document.getElementById(String(i)).style.color = 'white';
    }
    document.getElementById('winnerHead').style.visibility = 'hidden';
    document.getElementById('winnerButton').style.visibility = 'hidden';
    document.getElementById('currTurn').style.visibility = 'visible';
    setNextTurn((prevTurn) => !prevTurn);
  }

  function showLeaderBoard() {
    const scoreboard = document.getElementById('leaderboard');
    if (scoreboard.style.visibility === 'hidden') {
      scoreboard.style.visibility = 'visible';
    } else {
      scoreboard.style.visibility = 'hidden';
    }
  }

  useEffect(() => {
    socket.on('boxClick', (data) => {
      const currentBoard = data.currBoard;
      setNextTurn(data.turn);
      if (data.playername === data.curr_players[0]) {
        currentBoard[data.index] = 'X';
        setBoard(data.currBoard);
      } else if (data.playername === data.curr_players[1]) {
        currentBoard[data.index] = 'O';
        setBoard(data.currBoard);
      }
    });
    socket.on('newUser', (userArray) => {
      setPlayers(userArray.activeUsers.splice(0, 2));
      setSpectators(userArray.activeUsers);
      setAllUsers(userArray.allUsers);
      setAllScores(userArray.player_scores);
    });
    socket.on('gameover', (userArray) => {
      setAllUsers(userArray.allUsers);
      setAllScores(userArray.player_scores);
    });
    socket.on('restartGame', () => {
      restartGame();
    });
  }, []);

  useEffect(() => {
    calculateWinner(board);
  }, [board, calculateWinner]);

  return (
    <div>
      <div className="login title">
        <h1>Tic-Tac-Toe</h1>
      </div>
      <div className="board">
        <Box event={onClickBox} index="0" value={board[0]} />
        <Box event={onClickBox} index="1" value={board[1]} />
        <Box event={onClickBox} index="2" value={board[2]} />
        <Box event={onClickBox} index="3" value={board[3]} />
        <Box event={onClickBox} index="4" value={board[4]} />
        <Box event={onClickBox} index="5" value={board[5]} />
        <Box event={onClickBox} index="6" value={board[6]} />
        <Box event={onClickBox} index="7" value={board[7]} />
        <Box event={onClickBox} index="8" value={board[8]} />
      </div>
      <div className="wincenter">
        <h1 id="winnerHead" style={{ visibility: 'hidden' }}>
          {outcome}
        </h1>
      </div>
      <div className="textcenter" id="currTurn">
        {turn ? <h2>X Turn</h2> : <h2>O Turn</h2>}
      </div>
      <div className="playagain">
        <button
          id="winnerButton"
          type="button"
          style={{ visibility: 'hidden' }}
          onClick={() => {
            restartGame();
            socket.emit('restartGame');
          }}
        >
          Play Again
        </button>
      </div>
      <div className="textcenter">
        <div className="xplayer">
          <u>Playing X</u>
          <br />
          {players[0]}
        </div>
        <div className="oplayer">
          <u>Playing O</u>
          <br />
          {players[1]}
        </div>
        <div className="nonplayer">
          <u>Spectators</u>
          <p style={{ listStyleType: 'none' }}>
            {spectators.map((viewer) => (
              <UserList name={viewer} />
            ))}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="leaderboardButton"
        onClick={showLeaderBoard}
      >
        Show Leaderboard
      </button>
      <div className="holder" id="leaderboard" style={{ visibility: 'hidden' }}>
        <Leaderboard users={allUsers} scores={allScores} curr_name={player} />
      </div>
    </div>
  );
}

Board.propTypes = {
  player: PropTypes.string,
};
Board.defaultProps = {
  player: '',
};
