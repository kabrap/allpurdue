import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginSignup from './LoginSignup';

test('renders LoginSignup component', () => {
  render(
    <BrowserRouter>
      <LoginSignup />
    </BrowserRouter>
  );
});
