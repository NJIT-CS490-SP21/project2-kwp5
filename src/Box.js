import './Board.css';

export function Box(props) {
    console.log(props.index);
    switch(props.index) {
        case '0':
            return <div id={props.index} class="box topleft" onClick={() => props.event(props.index)}>{props.value}</div>;
        case '2':
            return <div id={props.index} class="box topright" onClick={() => props.event(props.index)}>{props.value}</div>;
        case '6':
            return <div id={props.index} class="box bottomleft" onClick={() => props.event(props.index)}>{props.value}</div>;
        case '8':
            return <div id={props.index} class="box bottomright" onClick={() => props.event(props.index)}>{props.value}</div>;
        case '4':
            return <div id={props.index} class="box middle" onClick={() => props.event(props.index)}>{props.value}</div>;
        default:
            return <div id={props.index} class="box" onClick={() => props.event(props.index)}>{props.value}</div>;
    }
}