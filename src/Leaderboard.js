import './Board.css';

export function Leaderboard_Users(props) {
    return <td>{props.users}</td>;
}

export function Leaderboard_Scores(props) {
    return <td>{props.score}</td>;
}