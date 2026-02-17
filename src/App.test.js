import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main product headline', () => {
  render(<App />);
  const headingElement = screen.getByText(/от идеи до первых клиентов за 7 дней/i);
  expect(headingElement).toBeInTheDocument();
});
