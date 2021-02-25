import App from './App';
import Login from './Login';
import React from 'react';


export function Usercheck(props) {
    const isUser = props.event;
    if (isUser) {
        return <App />;
    }
    return <Login />;
}

export default Usercheck;