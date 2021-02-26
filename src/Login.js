import React from 'react';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Board.css';
import App from './App';
import ReactDOM from 'react-dom';

const socket = io();
export function Login() {
    const inputRef = useRef(null);
    var username = "";
    function enterUser() {
        if (inputRef != null) {
            username = inputRef.current.value;
            socket.emit('newUser', {username: username});
            ReactDOM.render(
              <React.StrictMode>
                <App name={username}/>
              </React.StrictMode>,
              document.getElementById('root')
            );
        }
    }
    
    return <div>
            <div>
                Enter a username:
                <input ref={inputRef} type='text' />
                <button onClick={enterUser}>Login</button>
            </div>
        </div>;
}

export default Login;