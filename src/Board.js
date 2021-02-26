import './Board.css';
import { Box } from './Box.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from './UserList';

const socket = io();
export function Board(props) {
    const [board, setBoard] = useState([null,null,null,null,null,null,null,null,null]);
    const [turn, setNextTurn] = useState(false);
    const [outcome, setOutcome] = useState("");
    const [players, setPlayers] = useState([]);
    const [spectators, setSpectators] = useState([]);
    function onClickBox(boxIndex) {
        var data = { index: boxIndex, playername: props.player };
        if (calculateWinner(board)) {
            return;
        }
        setNextTurn(prevTurn => !prevTurn);
        if (turn) {
            if (board[boxIndex] == null && props.player === players[0]){
                setBoard(prevBoard => [...prevBoard, prevBoard[boxIndex] = 'X']);
                socket.emit('boxClick', data);
               // setNextTurn(prevTurn => !prevTurn);
            }
            else if (board[boxIndex] == null && props.player === players[1]) {
                setBoard(prevBoard => [...prevBoard, prevBoard[boxIndex] = 'O']);
                socket.emit('boxClick', data);
               // setNextTurn(prevTurn => !prevTurn);
            }
        }
        console.log(turn);
       // setNextTurn(prevTurn => !prevTurn);
    }

    useEffect(() => {
        socket.on('boxClick', (data) => {
            console.log('Chat event received!');
            console.log(data.index);
            console.log(data.turn);
            setNextTurn(prevTurn => data.turn);
            if (data.playername === data.currPlayers[0]){
                console.log("X turn");
                setBoard(prevBoard => [...prevBoard, prevBoard[data.index] = 'X']);
            }
            else if (data.playername === data.currPlayers[1]) {
                console.log("O turn");
                setBoard(prevBoard => [...prevBoard, prevBoard[data.index] = 'O']);
            }
        });
        socket.on('newUser', (userArray) => {
            console.log('New User Received!');
            setPlayers(userArray.allUsers.splice(0, 2));
            setSpectators(userArray.allUsers);
        });
        socket.on('restartGame', () => {
          //  setNextTurn(prevTurn => !prevTurn);
            restartGame(); 
        });
    }, []);
    
    useEffect(() => {
        calculateWinner(board);
       /* if (turn) {
            setNextTurn(prevTurn => !prevTurn);
        }*/
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
                if (props.player === players[0] || props.player === players[1]) {
                    document.getElementById("winnerButton").style.visibility = "visible";
                }
                setOutcome(noOutcome => [board[a]+" Wins"]);
                return true;
            }
        }
        if (board.every(value => value !== null)) {
            document.getElementById("winnerHead").style.visibility = "visible";
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
        document.getElementById("winnerHead").style.visibility = "hidden";
        document.getElementById("winnerButton").style.visibility = "hidden";
    }
    
    return<div>
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
            <div>
                <h3 id="winnerHead" style={{visibility: "hidden"}}>{outcome}</h3>
                <button id="winnerButton" style={{visibility: "hidden"}} onClick={() => {restartGame(); socket.emit('restartGame');}}>Play Again</button>
            </div>
            <div>
                <u>Player Playing X</u>
                <br />
                {players[0]}
            </div>
            <div>
                <u>Player Playing O</u>
                <br />
                {players[1]}
            </div>
            <div><u>Spectators</u>
                <ul>
                  {spectators.map((viewer) => <UserList name={viewer} />)}
                </ul>
            </div>
        </div>;
}