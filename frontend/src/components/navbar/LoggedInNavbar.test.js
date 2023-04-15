import React from 'react';
import LoggedInNavbar from './LoggedInNavbar';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders LoggedInNavbar component', () => {
    render(
        <BrowserRouter>
          <LoggedInNavbar />
        </BrowserRouter>
      );
});
