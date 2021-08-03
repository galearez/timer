import React from 'react';
import { render, screen } from '@testing-library/react';
import Timer from './timer';

test('renders learn react link', () => {
  render(<Timer />);
  const linkElement = screen.getByText(/He He/i);
  expect(linkElement).toBeInTheDocument();
});

test('counts down', () => {
  const wrapper = new Timer(60);
  expect(wrapper.countdown(5)).toBe(false);
});
