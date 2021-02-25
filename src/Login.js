import React from 'react';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Board.css';
import UserList from './UserList.js';
import App from './App';
import ReactDOM from 'react-dom';

const socket = io();
export function Login() {
    //const [users, setUsers] = useState([]);
    const inputRef = useRef(null);
    var username = "";
    var users = [];
    function enterUser() {
        if (inputRef != null) {
            username = inputRef.current.value;
            //setUsers(oldUsers => [...oldUsers, username]);
            socket.emit('newUser', {username: username});
            ReactDOM.render(
              <React.StrictMode>
                <App />
              </React.StrictMode>,
              document.getElementById('root')
            );
        }
    }
    
    useEffect(() => {
        socket.on('newUser', (allUsers) => {
            console.log('New User Received!');
            console.log(allUsers);
            users = allUsers;
        });
    }, []);
    
    return <div>
            <div>
                Enter a username:
                <input ref={inputRef} type='text' />
                <button onClick={enterUser}>Login</button>
            </div>
            <div><u>Users</u>
                <ul>
                    {users.map((user, index) => <UserList key={index} name={user} />)}
                </ul>
            </div>
        </div>;
}

export default Login;