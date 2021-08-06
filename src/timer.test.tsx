import React from 'react';
import { render, screen } from '@testing-library/react';
import Timer from './timer';

test('renders learn react link', () => {
  render(<Timer />);
  const linkElement = screen.getByText(/He He/i);
  expect(linkElement).toBeInTheDocument();
});
