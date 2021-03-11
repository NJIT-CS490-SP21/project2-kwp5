import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';

export default function Box(props) {
  switch (props.index) {
    case '0':
      return (
        <div
          role="button"
          id={props.index}
          className="box topleft"
          onClick={() => props.event(props.index)}
          onKeyDown={() => props.event(props.index)}
          tabIndex={0}
        >
          {props.value}
        </div>
      );
    case '2':
      return (
        <div
          role="button"
          id={props.index}
          className="box topright"
          onClick={() => props.event(props.index)}
          onKeyDown={() => props.event(props.index)}
          tabIndex={0}
        >
          {props.value}
        </div>
      );
    case '6':
      return (
        <div
          role="button"
          id={props.index}
          className="box bottomleft"
          onClick={() => props.event(props.index)}
          onKeyDown={() => props.event(props.index)}
          tabIndex={0}
        >
          {props.value}
        </div>
      );
    case '8':
      return (
        <div
          role="button"
          id={props.index}
          className="box bottomright"
          onClick={() => props.event(props.index)}
          onKeyDown={() => props.event(props.index)}
          tabIndex={0}
        >
          {props.value}
        </div>
      );
    case '4':
      return (
        <div
          role="button"
          id={props.index}
          className="box middle"
          onClick={() => props.event(props.index)}
          onKeyDown={() => props.event(props.index)}
          tabIndex={0}
        >
          {props.value}
        </div>
      );
    default:
      return (
        <div
          role="button"
          id={props.index}
          className="box"
          onClick={() => props.event(props.index)}
          onKeyDown={() => props.event(props.index)}
          tabIndex={0}
        >
          {props.value}
        </div>
      );
  }
}

Box.propTypes = {
  index: PropTypes.string,
  event: PropTypes.func,
  value: PropTypes.string,
};
Box.defaultProps = {
  index: '',
  event: null,
  value: '',
};
