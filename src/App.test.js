import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

test("renders learn react link", () => {
  const result = render(<Login />);
  const loginElement = screen.getByText('Login');
  fireEvent.click(loginElement);
  expect(loginElement).not.toBeInTheDocument();
});
