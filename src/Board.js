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
            setBoard(prevBoard => [...prevBoard, prevBoard[boxIndex] = 'O']);
        }
        else if (board[boxIndex] == null) {
            setBoard(prevBoard => [...prevBoard, prevBoard[boxIndex] = 'X']);
        }
        var data = { index: boxIndex, turn: turn }
        socket.emit('boxClick', data);
        setNextTurn(turn => !turn);
    }

    
    useEffect(() => {
        socket.on('boxClick', (data) => {
            console.log('Chat event received!');
            console.log(data.index);
            setNextTurn(turn => !turn);
            if (board[data.index] == null && data.turn){
                console.log("O turn");
                setBoard(prevBoard => [...prevBoard, prevBoard[data.index] = 'O']);
            }
            else {
                console.log("X turn");
                setBoard(prevBoard => [...prevBoard, prevBoard[data.index] = 'X']);
            }
        });
    }, []);
    
    
    return <div class="board">
            <Box event={onClickBox} index='0' value={board[0]}/>
            <Box event={onClickBox} index='1' value={board[1]}/>
            <Box event={onClickBox} index='2' value={board[2]}/>
            <Box event={onClickBox} index='3' value={board[3]}/>
            <Box event={onClickBox} index='4' value={board[4]}/>
            <Box event={onClickBox} index='5' value={board[5]}/>
            <Box event={onClickBox} index='6' value={board[6]}/>
            <Box event={onClickBox} index='7' value={board[7]}/>
            <Box event={onClickBox} index='8' value={board[8]}/>
        </div>;
}