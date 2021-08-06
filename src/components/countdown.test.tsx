import { render, screen } from '@testing-library/react';
import Countdown from './countdown';

test('the component is counting down', () => {
  render(<Countdown />);
});
