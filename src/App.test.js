import { render, screen, fireEvent } from "@testing-library/react";
import Board from "./Board";
import Box from "./Box";

test("Verify x turn is still there after clicking box", () => {
  const result = render(<Board />);
  const turnElement = screen.getByText('X Turn');
  expect(turnElement).toBeInTheDocument();
  const boxElement = screen.getAllByRole("button");
  fireEvent.click(boxElement[0]);
  expect(turnElement).toBeInTheDocument();
});

test("Show leaderboard button works", () => {
  const result = render(<Board />);
  const leaderboardElement = screen.getByText('User');
  expect(leaderboardElement).toBeInTheDocument();
  const showElement = screen.getByText("Show Leaderboard");
  fireEvent.click(showElement);
  expect(leaderboardElement).toBeInTheDocument();
});