import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn', () => {
  render(<App />);
  const linkElement = screen.getByText(/Group 8/i);
  expect(linkElement).toBeInTheDocument();
});
