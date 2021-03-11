import React, { useRef } from 'react';
import io from 'socket.io-client';
import './Board.css';
import ReactDOM from 'react-dom';
import App from './App';

const socket = io();
export default function Login() {
  const inputRef = useRef(null);
  let username = '';
  function enterUser() {
    if (inputRef != null) {
      username = inputRef.current.value;
      socket.emit('newUser', { username });
      ReactDOM.render(
        <React.StrictMode>
          <App name={username} />
        </React.StrictMode>,
        document.getElementById('root'),
      );
    }
  }

  return (
    <div>
      <div className="login title">
        <h1>Tic-Tac-Toe</h1>
      </div>
      <div className="login">Enter a username</div>
      <div className="login input">
        <input ref={inputRef} type="text" />
      </div>
      <div className="login button">
        <button type="button" onClick={enterUser}>
          Login
        </button>
      </div>
      <div className="login note">
        ** To demo easier enter the first user (X) as &quot;a&quot;
        <br />
        and the second user on another tab (O) as &quot;b&quot;.
        <br />
        Any other users will be spectators.
      </div>
    </div>
  );
}
