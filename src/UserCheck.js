import App from "./App";
import Login from "./Login";

export function Usercheck(props) {
  const isUser = props.event;
  if (isUser) {
    return <App />;
  }
  return <Login />;
}

export default Usercheck;
