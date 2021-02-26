import './App.css';
import { Board } from './Board.js';
import './Board.css';


function App(props) {
  
  return (
    <div>
      <div>
        <Board player={props.name}/>
      </div>
    </div>
  );
}

export default App;
