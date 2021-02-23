import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef } from 'react';
import { Board } from './Board.js';
import { Box } from './Box.js';
import './Board.css';

function App() {
  
  return (
    <div>
      <Board/>
    </div>
  );
}

export default App;
