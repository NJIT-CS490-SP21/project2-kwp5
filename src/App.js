import './App.css';
import { Board } from './Board.js';
import './Board.css';


function App(props) {
  
  return (
    <div class="boardcenter">
      <Board player={props.name}/>
    </div>
  );
}

export default App;
