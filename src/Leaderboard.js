import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';

export default function Leaderboard(props) {
  const allData = [];
  for (let i = 0; i < props.users.length; i += 1) {
    if (props.users[i] === props.curr_name) {
      allData.push({
        scores: props.scores[i],
        users: `${props.users[i]} (YOU)`,
      });
    } else {
      allData.push({
        scores: props.scores[i],
        users: props.users[i],
      });
    }
  }
  return (
    <table className="leaderboard" id="leaderboard_table">
      <tbody>
        <tr>
          <th>Score</th>
          <th>User</th>
        </tr>
        {allData.map((item) => (
          <tr>
            {Object.values(item).map((val) => (
              <td>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Leaderboard.propTypes = {
  users: PropTypes.node,
  curr_name: PropTypes.string,
  scores: PropTypes.node,
};
Leaderboard.defaultProps = {
  users: [],
  curr_name: '',
  scores: [],
};
