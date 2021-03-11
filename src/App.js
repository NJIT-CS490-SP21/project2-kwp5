import React from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import './Board.css';

function App(props) {
  const { name } = props;
  return (
    <div id="board" className="boardcenter">
      <Board player={name} />
    </div>
  );
}

App.propTypes = {
  name: PropTypes.string,
};
App.defaultProps = {
  name: '',
};

export default App;
