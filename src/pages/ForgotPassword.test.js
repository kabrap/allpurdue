import React from 'react';
import ForgotPassword from './ForgotPassword';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders ForgotPassword page', () => {
    render(
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      );
});
