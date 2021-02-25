import React from 'react';
import './Board.css';
import { Box } from './Box.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();
export function Board(props) {
    const [board, setBoard] = useState([null,null,null,null,null,null,null,null,null]);
    const [turn, setNextTurn] = useState(true);
    function onClickBox(boxIndex) {
        if (board[boxIndex] == null && turn){
            setBoard(prevBoard => [...prevBoard, prevBoard[boxIndex] = 'X']);
        }
        else if (board[boxIndex] == null) {
            setBoard(prevBoard => [...prevBoard, prevBoard[boxIndex] = 'O']);
        }
        var data = { index: boxIndex, turn: turn };
        socket.emit('boxClick', data);
        setNextTurn(turn => !turn);
    }
    
    useEffect(() => {
        socket.on('boxClick', (data) => {
            console.log('Chat event received!');
            console.log(data.index);
            setNextTurn(turn => !turn);
            if (board[data.index] == null && data.turn){
                console.log("X turn");
                setBoard(prevBoard => [...prevBoard, prevBoard[data.index] = 'X']);
            }
            else {
                console.log("O turn");
                setBoard(prevBoard => [...prevBoard, prevBoard[data.index] = 'O']);
            }
        });
    }, []);
    
    useEffect(() => {
        if (calculateWinner(board)){
            return;
        }
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
            document.getElementById("winnerButton").style.visibility = "visible";
            return board[a];
          }
      }
      return false;
    }
    
    function restartGame() {
        setBoard([null,null,null,null,null,null,null,null,null]);
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
                <h3 id="winnerHead" style={{visibility: "hidden"}}>{board[0]} Wins</h3>
                <button id="winnerButton" style={{visibility: "hidden"}} onClick={restartGame}>Play Again</button>
            </div>
        </div>;
}