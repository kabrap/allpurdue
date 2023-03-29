import React from 'react';
import Navbar from './Navbar';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Navbar component', () => {
    render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
});
