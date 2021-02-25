import './App.css';
import { useState, useRef, useEffect } from 'react';
import { Board } from './Board.js';
import './Board.css';
import UserList from './UserList';
import io from 'socket.io-client';

const socket = io();

function App() {
  var users = [];
  //console.log(users);
  
  useEffect(() => {
    socket.on('newUser', (allUsers) => {
        console.log('New User Received!');
        users = allUsers;
    });
  }, []);
  
  return (
    <div>
      <div>
        <Board/>
      </div>
      <div><u>Users</u>
        <ul>
          {users.map((user, index) => <UserList key={index} name={user} />)}
        </ul>
      </div>
    </div>
  );
}

export default App;
