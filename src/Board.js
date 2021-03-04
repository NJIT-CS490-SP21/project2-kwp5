import './Board.css';
import { Box } from './Box.js';
import { Leaderboard_Users, Leaderboard_Scores } from '.Leaderboard.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from './UserList';

const socket = io();
export function Board(props) {
    const [board, setBoard] = useState([null,null,null,null,null,null,null,null,null]);
    const [turn, setNextTurn] = useState(true);
    const [outcome, setOutcome] = useState("");
    const [players, setPlayers] = useState([]);
    const [spectators, setSpectators] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allScores, setAllScores] = useState([]);
    const [update, setUpdate] = useState(true);
    function onClickBox(boxIndex) {
        var data = { index: boxIndex, playername: props.player, turn: turn, currBoard: board };
        function playerOneTurn() {
            if (board[boxIndex] == null && props.player === players[0]){
                board[boxIndex] = "X";
                setBoard(board);
                setNextTurn(prevTurn => false);
                data.turn = false;
                data.currBoard = board;
                socket.emit('boxClick', data);
                calculateWinner(board);
            }
        }
        function playerTwoTurn() {
            if (board[boxIndex] == null && props.player === players[1]) {
                board[boxIndex] = "O";
                setBoard(board);
                setNextTurn(prevTurn => true);
                data.turn = true;
                data.currBoard = board;
                socket.emit('boxClick', data);
                calculateWinner(board);
            }
        }
        if (calculateWinner(board)) {
            if (update) {
                var endData = { outcome: outcome, players: players };
                socket.emit('gameover', endData);
                setUpdate(prevUpdate => false);
            }
            return;
        }
        if (props.player === players[0] && turn) {
            playerOneTurn();
        }
        else if (props.player === players[1] && !turn) {
            playerTwoTurn();
        }
    }

    useEffect(() => {
        socket.on('boxClick', (data) => {
            console.log('Chat event received!');
            console.log(data.index);
            console.log(data.turn);
            setNextTurn(prevTurn => data.turn);
            if (data.playername === data.curr_players[0]){
                console.log("X turn");
                data.currBoard[data.index] = "X";
                setBoard(data.currBoard);
            }
            else if (data.playername === data.curr_players[1]) {
                console.log("O turn");
                data.currBoard[data.index] = "O";
                setBoard(data.currBoard);
            }
        });
        socket.on('newUser', (userArray) => {
            console.log('New User Received!');
            setPlayers(userArray.curr_players.splice(0, 2));
            setSpectators(userArray.curr_players);
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
    }, [board]);
    
    function calculateWinner(board) {
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
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                document.getElementById("winnerHead").style.visibility = "visible";
                document.getElementById("currTurn").style.visibility = "hidden";
                document.getElementById(a).style.color = "red";
                document.getElementById(b).style.color = "red";
                document.getElementById(c).style.color = "red";
                if (props.player === players[0] || props.player === players[1]) {
                    document.getElementById("winnerButton").style.visibility = "visible";
                }
                setOutcome(noOutcome => [board[a]+" Wins"]);
                return true;
            }
        }
        if (board.every(value => value !== null)) {
            document.getElementById("currTurn").style.visibility = "hidden";
            if (props.player === players[0] || props.player === players[1]) {
                document.getElementById("winnerButton").style.visibility = "visible";
            }
            setOutcome(noOutcome => ["Draw"]);
            return true;
        }
        return false;
    }
    
    function restartGame() {
        setBoard([null,null,null,null,null,null,null,null,null]);
        setOutcome("");
        for (var i = 0; i < 9; i++) {
            document.getElementById(String(i)).style.color = "white";
        }
        document.getElementById("winnerHead").style.visibility = "hidden";
        document.getElementById("winnerButton").style.visibility = "hidden";
        document.getElementById("currTurn").style.visibility = "visible";
        setNextTurn(prevTurn => !prevTurn);
    }
    
    return<div>
            <div class="login title">
                <h1>Tic-Tac-Toe</h1>
            </div>
            <div class="board">
                <Box event={onClickBox} index='0' value={board[0]}/>
                <Box event={onClickBox} index='1' value={board[1]}/>
                <Box event={onClickBox} index='2' value={board[2]}/>
                <Box event={onClickBox} index='3' value={board[3]}/>
                <Box event={onClickBox} index='4' value={board[4]}/>
                <Box event={onClickBox} index='5' value={board[5]}/>
                <Box event={onClickBox} index='6' value={board[6]}/>
                <Box event={onClickBox} index='7' value={board[7]}/>
                <Box event={onClickBox} index='8' value={board[8]}/>
            </div>
            <div class="wincenter">
                <h1 id="winnerHead" style={{visibility: "hidden"}}>{outcome}</h1>
            </div>
            <div class="textcenter" id="currTurn">

                {turn ? <h2>X Turn</h2> : <h2>O Turn</h2>}
            </div>
            <div class="playagain">
                <button id="winnerButton" style={{visibility: "hidden"}} onClick={() => {restartGame(); socket.emit('restartGame');}}>Play Again</button>
            </div>
            <div class="textcenter">
                <div class="xplayer">
                    <u>Playing X</u>
                    <br />
                    {players[0]}
                </div>
                <div class="oplayer">
                    <u>Playing O</u>
                    <br />
                    {players[1]}
                </div>
                <div class="nonplayer">
                    <u>Spectators</u>
                    <p style={{listStyleType: "none"}}>
                      {spectators.map((viewer) => <UserList name={viewer} />)}
                    </p>
                </div>
            </div>
            <div>
                <table>
                    <tr>
                        <th>User</th>
                        <th>Score</th>
                    </tr>
                    <tr>
                    {allUsers.map((user) => <Leaderboard_Users users={user}/>)}
                    {allScores.map((score) => <Leaderboard_Scores score={score}/>)}
                    </tr>
                </table>
            </div>
        </div>;
}
