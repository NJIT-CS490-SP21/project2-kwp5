import React from 'react';
import { useRef } from 'react';
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
            <div class="login title">
                <h1>Tic-Tac-Toe</h1>
            </div>
            <div class="login">
                Enter a username
            </div>
            <div class="login input">
                <input ref={inputRef} type='text' />
            </div>
            <div class="login button">
                <button onClick={enterUser}>Login</button>
            </div>
            <div class="login note">
                ** To demo easier enter the first user (X) as "a"<br /> 
                and the second user on another tab (O) as "b". <br /> 
                Any other users will be spectators.
            </div>
        </div>;
}

export default Login;