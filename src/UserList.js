import './Board.css';
import PropTypes from 'prop-types';
import React from 'react';

export default function UserList(props) {
  const { name } = props;
  return <li>{name}</li>;
}

UserList.propTypes = {
  name: PropTypes.string,
};
UserList.defaultProps = {
  name: '',
};
