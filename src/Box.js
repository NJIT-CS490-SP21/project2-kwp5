import './Board.css';

export function Box(props) {
    return <div class="box" onClick={() => props.event(props.index)}>{props.value}</div>;
}